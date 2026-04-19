//this is the main LawGPT chat page

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext/index.jsx";
import {
  uploadChatToBackend,
  fetchConversations,
  createConversation,
  fetchMessages,
  createMessage,
  deleteConversation
} from "../api/chat.api.js";
import { doSignOut } from "../firebase/auth.js";
import LawGPTSidebar from "../components/LawGPT/LawGPTSidebar.jsx";
import LawGPTHeader from "../components/LawGPT/LawGPTHeader.jsx";
import LawGPTMessageList from "../components/LawGPT/LawGPTMessageList.jsx";
import LawGPTChatInput from "../components/LawGPT/LawGPTChatInput.jsx";
import LawGPTEmptyState from "../components/LawGPT/LawGPTEmptyState.jsx";

export default function LawGPT() {
  //state for sidebar, chat messages, conversations, and sending state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const settingsRef = useRef(null);

  //function to set title in header for current active conversation
  const activeConversation = useMemo(
    () => conversations[activeIdx] ?? { title: "New Chat" },
    [activeIdx, conversations]
  );

  //close settings dropdown if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //load user conversations and first conversation messages on page load
  useEffect(() => {
    if (!currentUser?.uid) return; //if user not loaded yet, quit

    const userId = currentUser.uid;

    const loadConversations = async () => {
      try {
        const data = await fetchConversations(userId); //call api function to get all saved conversations for this user
        setConversations(data); //store returned conversations in local state

        //if conversations exist, automatically load the first one
        if (data.length > 0) {
          setActiveIdx(0); //set first conversation as active in sidebar and header
          setSelectedConversationId(data[0].id);

          const conversationMessages = await fetchMessages(data[0].id, userId); //call api function to load all messages in selected conversation - chat.api.js

          //map database message format into frontend message format
          setMessages(
            conversationMessages.map((msg) => ({
              role: msg.role,
              text: msg.content,
              citations: msg.citations || [],
            }))
          );
        } else {
          //if user has no saved chats, clear chat state
          setMessages([]);
          setSelectedConversationId(null);
          setActiveIdx(-1);
        }
      } catch (error) {
        console.error("Failed to load conversations:", error);
      }
    };

    //run conversation load function
    loadConversations();
  }, [currentUser]);

  //function to sign user out
  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await doSignOut(); //service function located in ../firebase/auth.js
      navigate("/login"); //automatically redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      //process over so set to false
      setIsLoggingOut(false);
      setSettingsOpen(false);
    }
  };

  //navigate to settings page
  const handleOpenSettings = () => {
    setSettingsOpen(false);
    navigate("/settings");
  };

  //load messages when user selects a saved conversation
  const loadConversationMessages = async (conversationId, index) => {
    if (!currentUser?.uid) return;

    try {
      const data = await fetchMessages(conversationId, currentUser.uid); //call api function to get all messages for selected chat

      //convert database messages into frontend format
      setMessages(
        data.map((msg) => ({
          role: msg.role,
          text: msg.content,
          citations: msg.citations || [],
        }))
      );

      setSelectedConversationId(conversationId); //update which conversation is currently selected
      setActiveIdx(index); //update active conversation highlight in sidebar
      setSidebarOpen(false); //close mobile sidebar after user picks a conversation
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  //start a brand new chat
  const handleNewChat = () => {
    setSelectedConversationId(null);
    setMessages([]);
    setActiveIdx(-1);
    setSidebarOpen(false);
  };

  //delete a saved conversation
  const handleDeleteConversation = async (conversationId) => {
    const confirmed = window.confirm("Delete this saved chat?"); //ask user for confirmation before deleting
    if (!confirmed) return;

    try {
      await deleteConversation(conversationId, currentUser.uid); //call api function to delete conversation from database - chat.api.js

      //remove deleted conversation from frontend state
      setConversations((prev) =>
        prev.filter((conversation) => conversation.id !== conversationId)
      );

      //if deleted conversation was currently open, clear chat window
      if (conversations[activeIdx]?.id === conversationId) {
        setActiveIdx(-1);
        setSelectedConversationId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  //function to send user prompt and receive AI response
  const onSend = async () => {
    const trimmed = message.trim(); //remove extra spaces from input

    if (!trimmed || !currentUser?.uid || isSending) return; //do not send empty messages or allow duplicate sends

    const userId = currentUser.uid;
    let conversationId = selectedConversationId;

    setIsSending(true); //lock sending while request is running

    //add user message to chat immediately for instant UI feedback
    setMessages((prev) => [
      ...prev,
      { role: "user", text: trimmed, citations: [] },
    ]);

    setMessage(""); //clear input box after sending

    try {
      //if this is a brand new chat, create a conversation first
      if (!conversationId) {
        //call api function to create new conversation in database
        const newConversation = await createConversation(
          userId,
          trimmed.length > 30 ? `${trimmed.slice(0, 30)}...` : trimmed
        );

        setConversations((prev) => [newConversation, ...prev]); //add new conversation into sidebar list

        //set new conversation as active conversation
        setSelectedConversationId(newConversation.id);
        setActiveIdx(0);

        conversationId = newConversation.id;
      }

      //save user prompt as a message in database
      await createMessage(conversationId, userId, "user", trimmed);

      const res = await uploadChatToBackend(trimmed); //send prompt to backend AI service

      //extract response text and citations from returned response
      const botReply = res?.answer || res?.response || "No response returned.";
      const citations = Array.isArray(res?.citations) ? res.citations : [];

      //display assistant response in chat
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: botReply,
          citations,
        },
      ]);

      //save assistant response into database
      await createMessage(
        conversationId,
        userId,
        "assistant",
        botReply,
        citations
      );

      const refreshedConversations = await fetchConversations(userId); //refresh conversation list after save
      setConversations(refreshedConversations);

      //find updated position of current conversation in refreshed list
      const updatedIndex = refreshedConversations.findIndex(
        (conversation) => conversation.id === conversationId
      );

      if (updatedIndex !== -1) {
        setActiveIdx(updatedIndex);
      }
    } catch (error) {
      console.error(error);

      const fallback = "Something went wrong getting a response."; //fallback response shown if AI request fails

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: fallback,
          citations: [],
        },
      ]);

      //attempt to save fallback error message to conversation
      if (conversationId) {
        try {
          await createMessage(
            conversationId,
            userId,
            "assistant",
            fallback,
            []
          );
        } catch (saveError) {
          console.error(
            "Failed to save fallback assistant message:",
            saveError
          );
        }
      }
    } finally {
      //unlock send button after request finishes
      setIsSending(false);
    }
  };

  //main page layout
  return (
    <div className="h-screen overflow-hidden bg-white text-zinc-900">
      <div className="flex h-full overflow-hidden">
        <LawGPTSidebar
          sidebarOpen={sidebarOpen}
          handleNewChat={handleNewChat}
          conversations={conversations}
          activeIdx={activeIdx}
          loadConversationMessages={loadConversationMessages}
          currentUser={currentUser}
          settingsRef={settingsRef}
          settingsOpen={settingsOpen}
          setSettingsOpen={setSettingsOpen}
          handleLogout={handleLogout}
          isLoggingOut={isLoggingOut}
          onOpenSettings={handleOpenSettings}
          handleDeleteConversation={handleDeleteConversation}
        />

        {/*mobile sidebar overlay*/}
        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar overlay"
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <LawGPTHeader
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            activeConversation={activeConversation}
            selectedConversationId={selectedConversationId}
          />

          <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <div className="mx-auto w-full max-w-6xl">
                {/*show empty state if no messages yet*/}
                {messages.length === 0 ? (
                  <LawGPTEmptyState />
                ) : (
                  <LawGPTMessageList messages={messages} isSending={isSending} />
                )}
              </div>
            </div>

            {/*chat input box*/}
            <LawGPTChatInput
              message={message}
              setMessage={setMessage}
              onSend={onSend}
              isSending={isSending}
            />
          </main>
        </div>
      </div>
    </div>
  );
}