import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppState.jsx';

/* ==========================================================================
   START OF TOPIC: CO4/CO5 - DYNAMIC TOPOLOGY RELAXATION & CRUD MATRIX MUTATIONS
   WHY IT IS USED: Exposes interface surfaces allowing administrators to override graph weights (queue times) in real-time.
   WHERE IT IS USED: Embedded within the primary system metrics maintenance dashboard view.
   WHAT IT DOES: Captures form inputs to inject topology modifications directly into the global graph context.
   ========================================================================== */
export default function AdminPanel() {
    const { mapData, setMapData, darkMode } = useContext(AppContext);
    const [targetId, setTargetId] = useState('');
    const [waitInput, setWaitInput] = useState('');
    const [infoInput, setInfoInput] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleDataMutation = (e) => {
        e.preventDefault();
        if (!targetId) return;

        /* ==========================================================================
           START OF TOPIC: CO2/CO3 - FUNCTIONAL ARRAY IMMUTABILITY PATTERNS
           WHY IT IS USED: Prevents side-effects by modifying the graph definition matrix using pure functions.
           WHERE IT IS USED: Inside the transaction form execution handler.
           WHAT IT DOES: Uses `.map()` to generate a new graph definition structure, updating target nodes while maintaining state predictability.
           ========================================================================== */
        const updatedNodes = mapData.nodes.map(node => {
            if (node.id === targetId) {
                return {
                    ...node,
                    queueTime: waitInput !== "" ? parseInt(waitInput, 10) : node.queueTime,
                    info: infoInput !== "" ? infoInput : node.info
                };
            }
            return node;
        });

        setMapData({ ...mapData, nodes: updatedNodes });
        setSuccessMsg("🧬 Graph network model altered. Dijkstra weight distribution relaxed.");

        setTargetId('');
        setWaitInput('');
        setInfoInput('');
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    return (
        <div className={`p-6 border-t shrink-0 z-10 transition-colors duration-300 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-inner'}`}>
            <h4 className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest mb-3">🛠️ Network Topology Maintenance Node (Persistent Field Controls)</h4>
            <form onSubmit={handleDataMutation} className="flex flex-wrap gap-4 items-end text-xs font-bold uppercase tracking-wider light-mode-dropdown-override">
                <div className="flex flex-col gap-1.5 min-w-[200px]">
                    <label className="text-[9px] font-mono text-zinc-500">Target Structural Edge</label>
                    <select value={targetId} onChange={e => setTargetId(e.target.value)} className={`p-2.5 text-xs border rounded-xl font-medium focus:outline-none text-white ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200 text-zinc-900'}`} required>
                        <option value="">Select Node ID...</option>
                        {mapData.nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-1.5 flex-1 min-w-[220px]">
                    <label className="text-[9px] font-mono text-zinc-500">Override Descriptor Properties</label>
                    <input type="text" placeholder="Update layout text description..." value={infoInput} onChange={e => setInfoInput(e.target.value)} className={`p-2.5 text-xs border rounded-xl focus:outline-none ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white focus:border-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-zinc-900'}`} />
                </div>
                <div className="flex flex-col gap-1.5 w-32">
                    <label className="text-[9px] font-mono text-zinc-500">Queue Time (Min)</label>
                    <input type="number" placeholder="Mins" value={waitInput} onChange={e => setWaitInput(e.target.value)} className={`p-2.5 text-xs border rounded-xl focus:outline-none text-white ${darkMode ? 'bg-zinc-950 border-zinc-800 focus:border-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-zinc-900'}`} />
                </div>
                <button type="submit" className={`font-mono font-black text-[10px] uppercase px-6 py-3 rounded-xl tracking-widest shadow-md transition ${darkMode ? 'bg-white text-zinc-950 hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}>Inject Mutation</button>
                {successMsg && <p className="text-[10px] font-mono font-bold text-emerald-500 mt-2 normal-case animate-pulse">{successMsg}</p>}
            </form>
        </div>
    );
}
/* ==========================================================================
   END OF TOPIC: CO4/CO5 - MAINTENANCE NETWORK SURFACE CONTROLLER
   ========================================================================== */