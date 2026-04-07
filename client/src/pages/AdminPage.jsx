import dash from "../exampleDash.png";

export default function AdminPage() {

    return (
        <>
            <div class="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-300">
                <header class="bg-blue-500 p-4">
                <div class="flex items-center justify-between"> 
                    
                    <div className="">
                        <p class="text-white font-mono font-bold">⚖️Lawbot</p>
                    </div>
                </div>
                </header>
                <div className="p-8 font-bold">
                    <h1>Dashboard</h1>
                </div>
                <div class="flex flex-col md:flex-row flex-grow">
                    <main class="flex-1 flex justify-center items-center p-8 w-full order-2 md:order-1">
                        <div>
                            <img src={dash} class="w-800 h-600" alt="profile" />
                        </div>
                    </main>
                    <aside class="flex-1 flex justify-center p-8 order-1 md:order-2">
                        <div class="flex-row">
                            <div class="font-bold text-xl">
                                <h1>Analytics here</h1>
                            </div>
                        </div>
                    </aside>
                </div>

            </div>

        </>
    )

}