import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext/index.jsx";
import {
  uploadChatToBackend,
  fetchConversations,
  createConversation,
  fetchMessages,
  createMessage,
} from "../api/chat.api.js";
import { doSignOut } from "../firebase/auth.js";
import Modal from "../components/Modal.jsx";
import LawGPTSidebar from "../components/LawGPT/LawGPTSidebar.jsx";
import LawGPTHeader from "../components/LawGPT/LawGPTHeader.jsx";
import LawGPTMessageList from "../components/LawGPT/LawGPTMessageList.jsx";
import LawGPTChatInput from "../components/LawGPT/LawGPTChatInput.jsx";

export default function LawGPT() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const settingsRef = useRef(null);

  const activeConversation = useMemo(
    () => conversations[activeIdx] ?? { title: "New Chat" },
    [activeIdx, conversations]
  );

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

  useEffect(() => {
    if (!currentUser?.uid) return;

    const userId = currentUser.uid;

    const loadConversations = async () => {
      try {
        const data = await fetchConversations(userId);
        setConversations(data);

        if (data.length > 0) {
          setActiveIdx(0);
          setSelectedConversationId(data[0].id);

          const conversationMessages = await fetchMessages(data[0].id, userId);

          setMessages(
            conversationMessages.map((msg) => ({
              role: msg.role,
              text: msg.content,
              citations: msg.citations || [],
            }))
          );
        } else {
          setMessages([]);
          setSelectedConversationId(null);
          setActiveIdx(-1);
        }
      } catch (error) {
        console.error("Failed to load conversations:", error);
      }
    };

    loadConversations();
  }, [currentUser]);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await doSignOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
      setSettingsOpen(false);
    }
  };

  const loadConversationMessages = async (conversationId, index) => {
    if (!currentUser?.uid) return;

    try {
      const data = await fetchMessages(conversationId, currentUser.uid);

      setMessages(
        data.map((msg) => ({
          role: msg.role,
          text: msg.content,
          citations: msg.citations || [],
        }))
      );

      setSelectedConversationId(conversationId);
      setActiveIdx(index);
      setSidebarOpen(false);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const handleNewChat = () => {
    setSelectedConversationId(null);
    setMessages([]);
    setActiveIdx(-1);
    setSidebarOpen(false);
  };

  const onSend = async () => {
    const trimmed = message.trim();
    if (!trimmed || !currentUser?.uid || isSending) return;

    const userId = currentUser.uid;
    let conversationId = selectedConversationId;

    setIsSending(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: trimmed, citations: [] },
    ]);
    setMessage("");

    try {
      if (!conversationId) {
        const newConversation = await createConversation(
          userId,
          trimmed.length > 30 ? `${trimmed.slice(0, 30)}...` : trimmed
        );

        setConversations((prev) => [newConversation, ...prev]);
        setSelectedConversationId(newConversation.id);
        setActiveIdx(0);
        conversationId = newConversation.id;
      }

      await createMessage(conversationId, userId, "user", trimmed);

      const res = await uploadChatToBackend(trimmed);
      const botReply = res?.answer || res?.response || "No response returned.";
      const citations = Array.isArray(res?.citations) ? res.citations : [];

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: botReply,
          citations,
        },
      ]);

      await createMessage(conversationId, userId, "assistant", botReply, citations);

      const refreshedConversations = await fetchConversations(userId);
      setConversations(refreshedConversations);

      const updatedIndex = refreshedConversations.findIndex(
        (conversation) => conversation.id === conversationId
      );

      if (updatedIndex !== -1) {
        setActiveIdx(updatedIndex);
      }
    } catch (error) {
      console.error(error);

      const fallback = "Something went wrong getting a response.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: fallback,
          citations: [],
        },
      ]);

      if (conversationId) {
        try {
          await createMessage(conversationId, userId, "assistant", fallback, []);
        } catch (saveError) {
          console.error("Failed to save fallback assistant message:", saveError);
        }
      }
    } finally {
      setIsSending(false);
    }
  };

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
          setShowModal={setShowModal}
        />

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
                {messages.length === 0 ? (
                  <>
                    <div className="flex flex-col items-center pt-10 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white shadow-sm">
                        ⚖️
                      </div>

                      <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                        LegalAI Assistant
                      </h1>

                      <p className="mt-3 max-w-2xl text-sm text-zinc-600 sm:text-base">
                        Your AI-powered legal research companion. Ask questions, get
                        insights, and explore legal topics.
                      </p>
                    </div>
                  </>
                ) : (
                  <LawGPTMessageList messages={messages} isSending={isSending} />
                )}
              </div>
            </div>

            <LawGPTChatInput
              message={message}
              setMessage={setMessage}
              onSend={onSend}
              isSending={isSending}
            />
          </main>
        </div>
      </div>

      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </div>
  );
}