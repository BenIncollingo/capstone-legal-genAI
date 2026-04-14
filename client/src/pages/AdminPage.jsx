import dash from "../exampleDash.png";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import React, { useEffect, useState } from 'react';
import { useCounter } from "../contexts/Counter/CounterProvider";// Adjust path as needed


export default function AdminPage() {
    const { stats } = useCounter();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <p className="text-blue-600 font-mono font-bold text-xl tracking-tight">⚖️ Lawbot</p>
                    <div className="h-8 w-8 rounded-full bg-slate-200"></div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 md:p-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
                    <p className="text-slate-500">Here are the latest stats:</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Uploads</p>
                        <h2 className="text-4xl font-bold mt-2 text-blue-600">{stats.total}</h2>
                    </div>

                    <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Recent Files</h2>
                        <ul className="divide-y divide-slate-100">
                            {stats.recentFiles?.map((name, i) => (
                                <li key={i} className="py-3 text-sm text-slate-600 flex items-center">
                                    <span className="mr-3 text-slate-400">📄</span> {name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center border-dashed border-2">
                        <p className="text-slate-400 font-medium italic">Secondary Analytics Placeholder</p>
                    </div>
                </div>
            </main>
        </div>
    );
}