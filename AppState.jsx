import React, { createContext, useState, useEffect } from 'react';

/* ==========================================================================
   START OF TOPIC: CO4 - GLOBAL STATE ARCHITECTURE & CONTEXT ENGINEERING RATIONALE
   WHY IT IS USED: Used to eliminate "prop-drilling" across deeply nested terminal view tabs.
   WHERE IT IS USED: Declared at the root context level to provide a single source of truth.
   WHAT IT DOES: Instantiates a centralized state injection portal holding user data, theme states, and graph definitions.
   ========================================================================== */
export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    /* ==========================================================================
       START OF TOPIC: CO1/CO3 - IMMUTABILITY, REACTIVE STATE & RUNTIME DATA
       WHY IT IS USED: To enforce component-driven rendering pipelines whenever variables shift.
       WHERE IT IS USED: At the top level of the state container initialization block.
       WHAT IT DOES: Preserves immutable references to memory hooks for authorization session tokens and UI tabs.
       ========================================================================== */
    const [user, setUser] = useState(() => {
        const cached = localStorage.getItem('rgia_session_token');
        return cached ? JSON.parse(cached) : null;
    });
    const [currentFloor, setCurrentFloor] = useState(2); // 0: Aeroplaza, 1: Arrivals, 2: Departures
    const [darkMode, setDarkMode] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [activeTab, setActiveTab] = useState('map');

    /* ==========================================================================
       START OF TOPIC: CO4 - DATA MODELING OF COMPLEX DISCRETE STRUCTURES
       WHY IT IS USED: Serves as the adjacency model mapping spatial vertices and edges for pathfinding computations.
       WHERE IT IS USED: Embedded as the baseline data graph network structure.
       WHAT IT DOES: Encapsulates coordinates (x, y), levels, and real-world queue-delay node weights.
       ========================================================================== */
    const [mapData, setMapData] = useState({
        nodes: [
            /* LEVEL F0: AEROPLAZA COMMERCIAL PLATFORM */
            { id: "aeroplaza_food", label: "Aero Plaza Food Court", floor: 0, x: 500, y: 220, type: "food", queueTime: 6, info: "Ground level multi-cuisine premium dining sector." },
            { id: "escalator_f0_f1", label: "Escalator to Arrivals (F0➔F1)", floor: 0, x: 720, y: 280, type: "transit", queueTime: 0, info: "Central structural mechanical lift escalator link." },
            
            /* LEVEL F1: ARRIVALS & BAGGAGE RECLAIM LOGISTICS */
            { id: "arrivals_gate_1", label: "International Arrivals G1", floor: 1, x: 250, y: 280, type: "entry", queueTime: 8, info: "Main arrival channel immigration desks checkpoint." },
            { id: "baggage_belt_04", label: "Baggage Claim Belt 04", floor: 1, x: 480, y: 180, type: "baggage", queueTime: 18, info: "Wide-body international baggage handling loop." },
            { id: "escalator_f1_f2", label: "Escalator to Departures (F1➔F2)", floor: 1, x: 720, y: 280, type: "transit", queueTime: 0, info: "Primary vertical passenger escalator corridor link." },
            
            /* LEVEL F2: DEPARTURES & SECURITY GATEWAYS */
            { id: "entry_gate_02", label: "Departure Entry Gate 2", floor: 2, x: 180, y: 300, type: "entry", queueTime: 4, info: "Main outer vehicle drop-off staging lane." },
            { id: "checkin_row_a", label: "Check-in Row A", floor: 2, x: 380, y: 240, type: "checkin", queueTime: 15, info: "IndiGo automated self-service check-in counters." },
            { id: "domestic_security", label: "Domestic Security Screening", floor: 2, x: 580, y: 240, type: "security", queueTime: 12, info: "CISF terminal pre-board physical validation area." },
            { id: "lounge_premium", label: "Plaza Premium Lounge", floor: 2, x: 700, y: 120, type: "lounge", queueTime: 0, info: "Level 2 premium commercial lounge sector." },
            { id: "gate_21", label: "Boarding Gate 21", floor: 2, x: 820, y: 80, type: "gate", queueTime: 2, info: "North wing corridor glass bridge boarding link." },
            { id: "gate_22A", label: "Boarding Gate 22A", floor: 2, x: 900, y: 200, type: "gate", queueTime: 5, info: "Remote tarmac shuttle loading portal." }
        ],
        edges: [
            { from: "entry_gate_02", to: "checkin_row_a", weight: 140 },
            { from: "checkin_row_a", to: "domestic_security", weight: 240 },
            { from: "domestic_security", to: "lounge_premium", weight: 110 },
            { from: "lounge_premium", to: "gate_21", weight: 280 },
            { from: "domestic_security", to: "gate_22A", weight: 380 },
            { from: "arrivals_gate_1", to: "baggage_belt_04", weight: 230 },
            { from: "baggage_belt_04", to: "escalator_f1_f2", weight: 200 },
            { from: "aeroplaza_food", to: "escalator_f0_f1", weight: 180 }
        ]
    });

    /* ==========================================================================
       START OF TOPIC: CO2/CO3 - MODULE FUNCTION PASSING & STATE MUTATION CONSTRAINTS
       WHY IT IS USED: To enforce predictable functional state transitions.
       WHERE IT IS USED: Defined as transactional operations passed inside the Context provider.
       WHAT IT DOES: Packages business logic operations for login, logout, and marker bookmarking lists.
       ========================================================================== */
    const login = (sessionPayload) => {
        localStorage.setItem('rgia_session_token', JSON.stringify(sessionPayload));
        setUser(sessionPayload);
    };

    const logout = () => {
        localStorage.removeItem('rgia_session_token');
        setUser(null);
    };

    const toggleFavorite = (id) => {
        setFavorites(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    return (
        <AppContext.Provider value={{
            user, login, logout,
            currentFloor, setCurrentFloor,
            darkMode, setDarkMode,
            favorites, toggleFavorite,
            activeTab, setActiveTab,
            mapData, setMapData
        }}>
            {children}
        </AppContext.Provider>
    );
};
/* ==========================================================================
   END OF TOPIC: CO4 - GLOBAL STATE ARCHITECTURE ENDPOINT
   ========================================================================== */