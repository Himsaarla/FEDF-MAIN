import React, { useState, useRef, useContext } from 'react';
import { AppContext } from '../context/AppState.jsx';

/* ==========================================================================
   START OF TOPIC: CO1/CO3 - ISOMETRIC VOLUMETRIC VIEWPORT ENGINEERING & HARDWARE ACCELERATION
   WHY IT IS USED: Provides spatial structural context without loading heavy external libraries like WebGL.
   WHERE IT IS USED: Encapsulated as a pure deterministic canvas presentation layout frame.
   WHAT IT DOES: Employs CSS3 hardware-accelerated transforms (`preserve-3d`) to render a multi-layered terminal.
   ========================================================================== */
export default function MapCanvas({ activeRoute }) {
    const { mapData, currentFloor, darkMode } = useContext(AppContext);
    
    /* ==========================================================================
       START OF TOPIC: CO2 - STATE construct VIA CLOSURES & CACHED POINTER REFERENCES
       WHY IT IS USED: To maintain local tracking matrices without triggering global rendering cascades.
       WHERE IT IS USED: Initialized at the head of the canvas interactive controller module.
       WHAT IT DOES: Caches coordinate variables (`useRef`) to capture real-time mouse drag vector updates.
       ========================================================================== */
    const [camera, setCamera] = useState({ pitch: 58, yaw: -28 });
    const dragging = useRef(false);
    const cursor = useRef({ x: 0, y: 0 });

    const handleStart = (e) => {
        dragging.current = true;
        cursor.current = { x: e.clientX, y: e.clientY };
    };

    const handleMove = (e) => {
        if (!dragging.current) return;
        const dX = e.clientX - cursor.current.x;
        const dY = e.clientY - cursor.current.y;
        setCamera(prev => ({
            pitch: Math.max(25, Math.min(80, prev.pitch - dY * 0.4)),
            yaw: prev.yaw + dX * 0.4
        }));
        cursor.current = { x: e.clientX, y: e.clientY };
    };

    /* ==========================================================================
       START OF TOPIC: CO3/CO4 - DERIVED DATA CALCULATION FROM STATE LAYERS
       WHY IT IS USED: Keeps components pure by deriving layout representations on-the-fly from props.
       WHERE IT IS USED: Injected during the component rendering pipeline cycle.
       WHAT IT DOES: Traverses the active route path array to compile an inline SVG path command string.
       ========================================================================== */
    const compileRoutePathString = (floorLevel) => {
        let commands = ""; 
        let active = false;
        
        activeRoute.forEach(id => {
            const node = mapData.nodes.find(n => n.id === id);
            if (node && node.floor === floorLevel) {
                commands += `${active ? 'L' : 'M'} ${node.x} ${node.y} `;
                active = true;
            }
        });
        return commands;
    };

    return (
        <div 
            className={`w-full h-full relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none transition-colors duration-300 ${darkMode ? 'bg-zinc-950' : 'bg-zinc-100'}`}
            onMouseDown={handleStart} 
            onMouseMove={handleMove}
            onMouseUp={() => dragging.current = false} 
            onMouseLeave={() => dragging.current = false}
            style={{ perspective: "1600px" }}
        >
            <div className={`absolute top-4 left-6 border p-3 rounded-xl font-mono text-[10px] uppercase tracking-wider z-20 shadow-2xl pointer-events-none ${darkMode ? 'bg-zinc-900/90 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600'}`}>
                <span className="text-blue-500 font-bold block mb-0.5">🎮 Volumetric Spatial 3D Engine</span>
                Orbit camera view over layers F0, F1, and F2 via mouse drag
            </div>

            <div 
                className="w-[940px] h-[540px] relative transition-transform duration-75 ease-out flex items-center justify-center"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: `rotateX(${camera.pitch}deg) rotateZ(${camera.yaw}deg)`
                }}
            >
                {/* ==========================================================================
                   START OF TOPIC: CO5 - RENDERING BOUNDARIES & PERFORMANCE TUNING KEYS
                   WHY IT IS USED: Employs consistent index key parameters to maximize reconciliation loop efficiency.
                   WHERE IT IS USED: Generating the stacked structural spatial floors.
                   WHAT IT DOES: Instantiates 3D bounding planes with controlled transparency based on the active state.
                   ========================================================================== */}
                {[0, 1, 2].map((floorIdx) => {
                    const isTargetFloor = floorIdx === currentFloor;
                    const zElevationOffset = (floorIdx - 1) * 160; 

                    return (
                        <div
                            key={floorIdx}
                            className="absolute inset-0 border rounded-2xl terminal-3d-floor-layer shadow-2xl overflow-hidden"
                            style={{
                                transform: `translateZ(${zElevationOffset}px)`,
                                transformStyle: 'preserve-3d',
                                opacity: isTargetFloor ? 1 : 0.18,
                                borderWidth: isTargetFloor ? '3px' : '1px',
                                borderColor: isTargetFloor ? (darkMode ? '#facc15' : '#18181b') : (darkMode ? '#27272a' : '#e4e4e7'),
                                backgroundColor: darkMode ? 'rgba(24, 24, 27, 0.45)' : 'rgba(255, 255, 255, 0.75)'
                            }}
                        >
                            <img 
                                src="/PngItem_690506.jpg" 
                                alt="Airport Layout Blueprint" 
                                className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none" 
                                style={{ opacity: darkMode ? 0.65 : 0.9 }}
                            />

                            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transformStyle: 'preserve-3d', zIndex: 10 }}>
                                {(mapData.edges || []).map((edge, i) => {
                                    const fromN = mapData.nodes.find(n => n.id === edge.from);
                                    const toN = mapData.nodes.find(n => n.id === edge.to);
                                    if (fromN?.floor === floorIdx && toN?.floor === floorIdx) {
                                        return (
                                            <line 
                                                key={i} 
                                                x1={fromN.x} 
                                                y1={fromN.y} 
                                                x2={toN.x} 
                                                y2={toN.y} 
                                                stroke={darkMode ? 'rgba(250,204,21,0.3)' : 'rgba(24,24,27,0.3)'} 
                                                strokeWidth="1.5" 
                                                strokeDasharray="4 4" 
                                            />
                                        );
                                    }
                                    return null;
                                })}

                                <path 
                                    d={compileRoutePathString(floorIdx)} 
                                    fill="none" 
                                    stroke="#ef4444" 
                                    strokeWidth="6" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    className="animate-wayfinder-vector" 
                                />
                            </svg>

                            <div className={`absolute top-3 left-4 font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg border font-black ${isTargetFloor ? 'bg-zinc-950 text-white border-zinc-700' : 'bg-transparent text-zinc-400 border-transparent'}`} style={{ transform: 'rotateX(-90deg)', transformOrigin: 'top left' }}>
                                Layer Level F{floorIdx} — {floorIdx === 2 ? 'Departures Level & Gates' : floorIdx === 1 ? 'Arrivals & Baggage Claims' : 'Aeroplaza Ground Complex'}
                            </div>

                            {mapData.nodes.filter(n => n.floor === floorIdx).map(node => (
                                <div
                                    key={node.id}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
                                    style={{ left: node.x, top: node.y, transformStyle: 'preserve-3d', zIndex: 20 }}
                                >
                                    <div 
                                        className={`w-3.5 h-3.5 rounded border transition-all duration-150 shadow-xl cursor-pointer hover:scale-130 ${activeRoute.includes(node.id) ? 'ring-4 ring-red-500/50 scale-110' : ''}`}
                                        style={{
                                            backgroundColor: node.type === 'gate' ? '#3b82f6' : node.type === 'security' ? '#dc2626' : node.type === 'checkin' ? '#eab308' : node.type === 'transit' ? '#a855f7' : '#10b981',
                                            borderColor: darkMode ? '#ffffff' : '#18181b',
                                            transform: 'translateZ(6px)'
                                        }}
                                        onClick={() => alert(`📍 Infrastructure Component: [${node.label}]\n⏱️ Queue Delay Metrics: ${node.queueTime} Mins\n🗒️ Building Specs: ${node.info}`)}
                                    />
                                    <div className={`absolute top-5 font-mono text-[9px] font-black tracking-tight px-2 py-0.5 rounded-lg border whitespace-nowrap bg-zinc-950 text-zinc-200 border-zinc-800 shadow-xl pointer-events-none transition-opacity ${isTargetFloor ? 'opacity-90 group-hover:opacity-100' : 'opacity-0'}`} style={{ transform: 'rotateX(-40deg)' }}>
                                        {node.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
/* ==========================================================================
   END OF TOPIC: CO1/CO3 - SPATIAL ENGINE VIEWPORT ENDPOINT
   ========================================================================== */