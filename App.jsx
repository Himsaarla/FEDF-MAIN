import React, { useContext, useState } from 'react';
import { AppContext } from './context/AppState.jsx';
import LoginPage from './components/LoginPage.jsx';
import Sidebar from './components/Sidebar.jsx';
import MapCanvas from './components/MapCanvas.jsx';
import FlightTable from './components/FlightTable.jsx';
import AdminPanel from './components/AdminPanel.jsx';

export default function App() {
    const { user, darkMode, setDarkMode, activeTab, setActiveTab, logout } = useContext(AppContext);
    const [activeRoute, setActiveRoute] = useState([]);
    const [routeMetrics, setRouteMetrics] = useState(null);

    if (!user) return <LoginPage />;

    const runDijkstraMatrixSolver = (startId, endId) => {
        if (!startId || !endId || !mapData.nodes) return;
        const distances = {}; const parents = {}; const unvisited = [];
        
        mapData.nodes.forEach(n => {
            distances[n.id] = n.id === startId ? 0 : Infinity;
            unvisited.push(n.id);
        });

        while (unvisited.length > 0) {
            unvisited.sort((a, b) => distances[a] - distances[b]);
            const current = unvisited.shift();
            if (current === endId || distances[current] === Infinity) break;

            const links = mapData.edges.filter(e => e.from === current || e.to === current);
            links.forEach(edge => {
                const target = edge.from === current ? edge.to : edge.from;
                const pathWeight = distances[current] + edge.weight;
                if (pathWeight < distances[target]) {
                    distances[target] = pathWeight;
                    parents[target] = current;
                }
            });
        }

        const path = []; let track = endId;
        while (track) { path.unshift(track); track = parents[track]; }
        if (path[0] !== startId) return;

        let totalWait = 0;
        path.forEach(id => {
            const targetNode = mapData.nodes.find(n => n.id === id);
            if (targetNode) totalWait += targetNode.queueTime;
        });

        setActiveRoute(path);
        setRouteMetrics({ distance: distances[endId], totalQueue: totalWait });
    };

    const { mapData } = useContext(AppContext);

    return (
        <div className={`flex h-screen w-screen overflow-hidden font-sans transition-colors duration-300 ${darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-800'}`}>
            <Sidebar onCalculateRoute={runDijkstraMatrixSolver} currentRouteMetrics={routeMetrics} activeRoute={activeRoute} />
            
            <div className="flex flex-col flex-1 h-full overflow-hidden">
                {/* Clean Black and White Navigation Hub Component Header */}
                <header className={`px-6 py-4 border-b flex justify-between items-center z-20 transition-colors duration-300 ${darkMode ? 'bg-zinc-900/60 border-zinc-800/80' : 'bg-white border-zinc-200/80 shadow-xs'}`}>
                    <div className="flex items-center gap-6">
                        <div className="flex border rounded-xl p-1 bg-zinc-950/5 border-zinc-500/10 text-xs font-bold uppercase tracking-wider font-mono">
                            <button onClick={() => setActiveTab('map')} className={`px-4 py-2 rounded-lg transition ${activeTab === 'map' ? (darkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-900 text-white') : 'text-zinc-400 hover:text-zinc-200'}`}>🗺️ Volumetric 3D Map</button>
                            <button onClick={() => setActiveTab('flights')} className={`px-4 py-2 rounded-lg transition ${activeTab === 'flights' ? (darkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-900 text-white') : 'text-zinc-400 hover:text-zinc-200'}`}>✈️ RealFlight Tickers</button>
                            <button onClick={() => setActiveTab('admin')} className={`px-4 py-2 rounded-lg transition ${activeTab === 'admin' ? (darkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-900 text-white') : 'text-zinc-400 hover:text-zinc-200'}`}>🛠️ Admin Modifiers</button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold font-mono">
                        <button onClick={() => setDarkMode(!darkMode)} className={`px-3 py-1.5 border rounded-xl uppercase tracking-wider transition ${darkMode ? 'border-zinc-800 bg-zinc-950 text-white hover:bg-zinc-800' : 'border-zinc-200 bg-zinc-50 text-zinc-900 hover:bg-zinc-100'}`}>🌓 Theme Profile</button>
                        <span className={darkMode ? 'text-zinc-400' : 'text-zinc-500'}>Operator: <span className="text-blue-500 font-bold">{user.username}</span></span>
                        <button onClick={logout} className="px-2.5 py-1.5 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition">Disconnect</button>
                    </div>
                </header>

                <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 text-[10px] uppercase font-mono tracking-widest text-amber-500 font-black animate-pulse">
                    ⚠️ Operational Notice: Physical disembarkation slips are officially discontinued at Indian borders from April 1, 2026. File digitised documentation entries online.
                </div>

                {/* Tab Window View Routing Matrix */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {activeTab === 'map' && <MapCanvas activeRoute={activeRoute} />}
                    {activeTab === 'flights' && <FlightTable />}
                    {activeTab === 'admin' && <AdminPanel />}
                </div>
            </div>
        </div>
    );
}