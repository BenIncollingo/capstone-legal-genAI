import { useAuth } from "../contexts/authContext/index.jsx";
import { Link } from "react-router-dom"
import { doSignOut } from "../firebase/auth.js";
import image from "../labor-law.jpg";
import screenshot from "../lawbotss.png"

export default function Home() {

    const { currentUser, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    
    const loginButtonAction = () => {
        // change current page to login page
    }

    const signOutHome = () => {
        doSignOut();
    }

    console.log(currentUser)

    return(
        <div class="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
            <header class="bg-blue-500 p-4">
                <div class="flex items-center justify-between"> 
                    
                    <div>
                        <p class="text-white font-bold">Lawbot</p>
                    </div>

                    <div class="flex items-center gap-4">
                        { currentUser ?
                            <>
                                <img src={image} class="w-8 h-8" alt="profile" />
                                <button onClick={signOutHome} className="bg-purple-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded whitespace-nowrap">
                                    Log Out
                                </button> 
                            </>
                            :
                            <>
                            <Link to="/Login">
                                <button className="bg-slate-800 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded whitespace-nowrap">
                                    Sign In
                                </button>
                            </Link>
                            <Link to="/reset">
                                <button className="bg-slate-800 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded whitespace-nowrap">
                                    Create account
                                </button>
                            </Link>
                            </>
                        }
                    </div>
                </div>
            </header>
            <br></br>
            <br></br>
            <div class="flex flex-col md:flex-row flex-grow">
                <main class="flex-1 flex justify-center items-center p-8 w-full order-2 md:order-1">
                    <img className="rounded" src={image}></img>
                </main>
                <aside class="flex-1 flex justify-center p-8 order-1 md:order-2">
                    <div class="flex-row">
                        <div class="font-extrabold text-xl">
                            <h1>Get Help with Employment Law</h1>
                        </div>
                        <br></br>
                        <div>
                            <p>Need help with the daunting legal challenges that many employees face? Try employment lawbot! Creating an account and starting a chat are free and easy.</p>
                        </div>
                    </div>
                </aside>
            </div>
            <hr></hr>
            <div class="flex flex-col md:flex-row flex-grow bg-slate-200">
                <main class="flex-1 flex justify-center items-center p-8 w-full order-2 md:order-1">
                    <div class="flex-row">
                        <div class="font-extrabold text-xl">
                            <h1>Answers you can trust</h1>
                        </div>
                        <br></br>
                        <div>
                            <p>All answers to lawbot questions include citations to avoid the issues that plague other chatbots and AI websites. If the chatbot isn't sure about an answer, it will let you know.</p>
                        </div>
                    </div>
                </main>
                <aside class="flex-1 flex justify-center p-8 order-1 md:order-2">
                    <img className="rounded" src={screenshot}></img>
                </aside>
            </div>
        </div>
    )
}