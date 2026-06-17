import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppState.jsx';

/* ==========================================================================
   START OF TOPIC: CO3 - COMPONENT COMPOSITION & HOOK ABSTRACT LAYOUTS
   WHY IT IS USED: Combines path configuration tools, filters, and scanning modules into a unified container view.
   WHERE IT IS USED: Left panel control dock within the application hierarchy.
   WHAT IT DOES: Leverages state hooks to handle form selections, local data searches, and barcode scanning loops.
   ========================================================================== */
export default function Sidebar({ onCalculateRoute, currentRouteMetrics }) {
    const { mapData, currentFloor, setCurrentFloor, darkMode, favorites, toggleFavorite } = useContext(AppContext);
    const [search, setSearch] = useState('');
    const [startPoint, setStartPoint] = useState('');
    const [endPoint, setEndPoint] = useState('');
    const [scanActive, setScanActive] = useState(false);
    const [scanStatus, setScanStatus] = useState(null);

    /* ==========================================================================
       START OF TOPIC: CO4 - DERIVED FILTER CO-LOCATION MATRICES
       WHY IT IS USED: Optimizes memory usage by computing filtering data dynamically during evaluation cycles.
       WHERE IT IS USED: Evaluated inside the component rendering loop execution path.
       WHAT IT DOES: Executes low-latency substring filter sorting on local arrays based on real-time text inputs.
       ========================================================================== */
    const activeFloorNodes = (mapData.nodes || []).filter(n => n.floor === currentFloor);
    const filteredPOIs = activeFloorNodes.filter(n => n.label.toLowerCase().includes(search.toLowerCase()));

    const handleBarCodeScanSimulation = () => {
        setScanActive(true);
        setScanStatus(null);
        setTimeout(() => {
            setScanActive(false);
            setScanStatus({
                passenger: "Himesh Kumar",
                flight: "6E-6212",
                gate: "Gate 21",
                originNode: "entry_gate_02",
                destNode: "gate_21"
            });
            onCalculateRoute("entry_gate_02", "gate_21");
            alert("✅ BOARDING PASS VERIFIED!\nPassenger: Himesh Kumar\nFlight: 6E-6212\nOrigin Point: Departure Gate 2\nTarget Destination: Boarding Gate 21\n\nOptimal transit vector path automatically computed on your 3D canvas map layout!");
        }, 2200);
    };

    return (
        <aside className={`w-[380px] h-screen p-6 border-r flex flex-col gap-5 overflow-y-auto shrink-0 z-20 relative select-none transition-colors duration-300 ${darkMode ? 'bg-zinc-900/90 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 shadow-xl text-zinc-800'}`}>
            <div>
                <h1 className={`text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-zinc-900'}`}>RGIA ENGINE</h1>
                <p className="text-[10px] text-zinc-400 font-mono tracking-widest font-black uppercase mt-0.5">Graph Network Core Management UI</p>
            </div>

            <div>
                <label className="block text-[9px] font-mono font-black text-zinc-400 uppercase tracking-widest mb-2">Active Floor Plane Configuration</label>
                <div className={`grid grid-cols-3 gap-1.5 p-1 border rounded-xl font-mono text-xs font-black text-center ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
                    {[0, 1, 2].map(fl => (
                        <button key={fl} onClick={() => setCurrentFloor(fl)} className={`py-2 rounded-lg transition uppercase ${currentFloor === fl ? (darkMode ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-900 shadow-xs') : 'text-zinc-400'}`}>Level F{fl}</button>
                    ))}
                </div>
            </div>

            {/* ==========================================================================
               START OF TOPIC: CO3 - CONTROLLED INPUT ELEMENTS & DESIGN FORM CONTRACTS
               WHY IT IS USED: Restricts arbitrary input values to protect the mathematical graph parameters from parsing errors.
               WHERE IT IS USED: Inside the dropdown component form selector block.
               WHAT IT DOES: Binds dropdown option array nodes straight to component states, passing data packets upstream to the pathfinding solver.
               ========================================================================== */
            }
            <div className={`p-4 border rounded-xl flex flex-col gap-3.5 transition-colors duration-300 ${darkMode ? 'bg-zinc-950/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                <h3 className="text-[10px] font-black tracking-wider uppercase font-mono text-zinc-400">Topology Path Router</h3>
                <div className="space-y-2 text-xs font-medium light-mode-dropdown-override">
                    <select value={startPoint} onChange={e => setStartPoint(e.target.value)} className={`w-full p-2.5 border rounded-xl focus:outline-none ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'}`}>
                        <option value="">Choose Origin Node Point...</option>
                        {(mapData.nodes || []).map(n => <option key={n.id} value={n.id}>{n.label} (F{n.floor})</option>)}
                    </select>
                    <select value={endPoint} onChange={e => setEndPoint(e.target.value)} className={`w-full p-2.5 border rounded-xl focus:outline-none ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'}`}>
                        <option value="">Choose Target Destination...</option>
                        {(mapData.nodes || []).map(n => <option key={n.id} value={n.id}>{n.label} (F{n.floor})</option>)}
                    </select>
                </div>
                <button onClick={() => onCalculateRoute(startPoint, endPoint)} className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider transition ${darkMode ? 'bg-white text-zinc-950 hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}>Compute Optimal Matrix</button>
            </div>

            {currentRouteMetrics && (
                <div className={`p-4 border rounded-xl grid grid-cols-2 gap-3 text-center font-mono transition-colors duration-300 ${darkMode ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                    <div>
                        <span className="block text-[9px] font-black uppercase text-zinc-500">Scalar Vector Distance</span>
                        <span className={`text-sm font-black block mt-0.5 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{currentRouteMetrics.distance} m</span>
                    </div>
                    <div>
                        <span className="block text-[9px] font-black uppercase text-zinc-500">Node Queue Delay</span>
                        <span className="text-sm font-black block mt-0.5 text-orange-500">{currentRouteMetrics.totalQueue} mins</span>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-2.5 flex-1 overflow-hidden">
                <h3 className="text-[10px] font-black uppercase tracking-wider font-mono text-zinc-400">Search Points of Interest</h3>
                <input type="text" placeholder="Filter local terminal points..." value={search} onChange={e => setSearch(e.target.value)} className={`w-full p-2.5 border text-xs rounded-xl focus:outline-none ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white focus:border-zinc-500' : 'bg-white border-zinc-200 text-zinc-900 focus:border-zinc-900'}`} />
                <div className={`border rounded-xl flex-1 max-h-48 overflow-y-auto divide-y ${darkMode ? 'bg-zinc-950/40 border-zinc-800/80 divide-zinc-900' : 'bg-white border-zinc-200 divide-zinc-100'}`}>
                    {filteredPOIs.map(node => (
                        <div key={node.id} className="p-3 text-xs flex justify-between items-center">
                            <div>
                                <span className={`font-bold block ${darkMode ? 'text-zinc-200' : 'text-zinc-900'}`}>{node.label}</span>
                                <span className="text-[10px] font-mono text-zinc-500">Level Floor {node.floor} • Delay: <span className="text-orange-500 font-bold">{node.queueTime}m</span></span>
                            </div>
                            <button onClick={() => toggleFavorite(node.id)} className={`text-base px-2 transition ${favorites.includes(node.id) ? 'text-yellow-500' : 'text-zinc-300 hover:text-zinc-500'}`}>★</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ==========================================================================
               START OF TOPIC: CO4/CO5 - COMPLEX EVENT SEQUENCING & HARDWARE EMULATION
               WHY IT IS USED: Coordinates asynchronous timeouts to mimic optical hardware scanning pipelines.
               WHERE IT IS USED: Footer controller block of the system navigation side dashboard.
               WHAT IT DOES: Executes non-blocking step functions to update state registries, parse scanned identifiers, and compute paths on completion.
               ========================================================================== */}
            <div className="border-t border-zinc-800/80 pt-4 shrink-0">
                <button 
                    onClick={handleBarCodeScanSimulation} 
                    disabled={scanActive}
                    className={`w-full border p-3 text-xs font-black uppercase tracking-wider rounded-xl transition ${scanActive ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : (darkMode ? 'bg-zinc-950 border-zinc-800 text-white hover:bg-zinc-800' : 'bg-zinc-100 border-zinc-300 text-zinc-800 hover:bg-zinc-200')}`}
                >
                    {scanActive ? '⏳ Optical Laser Scanner Scanning...' : '📸 Scan Boarding Pass QR / Barcode'}
                </button>
                
                {scanActive && (
                    <div className="mt-3 relative w-full h-24 bg-black rounded-xl border border-zinc-800 overflow-hidden flex items-center justify-center shadow-inner">
                        <div className="absolute left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_10px_#10b981] animate-scanner-laser z-10" />
                        <div className="text-center text-zinc-600 font-mono text-[9px] uppercase tracking-widest">
                            [ Align Barcode Area ]
                        </div>
                    </div>
                )}

                {scanStatus && (
                    <div className={`mt-3 p-3 rounded-xl border font-mono text-[10px] space-y-1 ${darkMode ? 'bg-zinc-950 border-emerald-900 text-zinc-300' : 'bg-emerald-50 border-emerald-200 text-zinc-800'}`}>
                        <div className="text-emerald-500 font-black uppercase tracking-widest text-[9px] border-b border-emerald-900/30 pb-1 mb-1">⚡ Telemetry Passing Successful</div>
                        <div><span className="text-zinc-500">PASSENGER:</span> {scanStatus.passenger}</div>
                        <div><span className="text-zinc-500">FLIGHT ID:</span> {scanStatus.flight}</div>
                        <div><span className="text-zinc-500">ASSIGNED HUB:</span> {scanStatus.gate}</div>
                    </div>
                )}
            </div>
        </aside>
    );
}
/* ==========================================================================
   END OF TOPIC: CO3 - SIDE PANEL CONTROL CONTROLLER MODULE
   ========================================================================== */