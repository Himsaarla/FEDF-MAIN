import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppState.jsx';

/* ==========================================================================
   START OF TOPIC: CO5 - AUTHENTICATION REGISTRY BOUNDARIES & INTERFACE ACCESS CONTROLS
   WHY IT IS USED: Implements secure route access boundaries by verifying operator credentials before mounting internal views.
   WHERE IT IS USED: Serves as the primary security gateway component.
   WHAT IT DOES: Coordinates form actions, error messaging states, and multi-factor authorization logic.
   ========================================================================== */
export default function LoginPage() {
    const { login, darkMode } = useContext(AppContext);
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [serverOtp, setServerOtp] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const handleInitialVerification = (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (username !== 'user1' || password !== 'Test@123') {
            setErrorMsg('Invalid administrative credential definitions.');
            return;
        }
        if (!/^\d{10}$/.test(phone)) {
            setErrorMsg('System communications link requires a valid 10-digit telephone configuration.');
            return;
        }

        const generatedToken = Math.floor(1000 + Math.random() * 9000);
        setServerOtp(generatedToken);
        setStep(2);
        alert(`[GMR NETWORK OTP TELEMETRY GATEWAY]\nSimulated SMS sent to +91 ${phone}\nYour Secure Access Token: ${generatedToken}`);
    };

    const handleTokenChallenge = (e) => {
        e.preventDefault();
        if (parseInt(otpCode, 10) === serverOtp) {
            login({ username, phone, role: 'admin' });
        } else {
            setErrorMsg('Cryptographic authorization failure. Verification token rejected.');
        }
    };

    return (
        <div className={`h-screen w-screen flex items-center justify-center font-sans ${darkMode ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
            <div className={`w-[400px] p-8 border rounded-2xl shadow-2xl backdrop-blur-md transition-all duration-300 ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white/80 border-zinc-200'}`}>
                <div className="text-center mb-6">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full font-mono text-[9px] font-black tracking-widest uppercase mb-2 ${darkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-600'}`}>RGIA Secure Gateway</span>
                    <h2 className={`text-2xl font-black uppercase tracking-tight ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Terminal Control</h2>
                    <p className="text-xs text-zinc-500 mt-1">Passenger Flow & Graphs Monitoring Suite</p>
                </div>

                {errorMsg && <div className="mb-4 p-3 rounded-xl text-xs font-mono font-bold bg-red-500/10 border border-red-500/30 text-red-500">{errorMsg}</div>}

                {step === 1 ? (
                    <form onSubmit={handleInitialVerification} className="space-y-4 text-xs font-bold uppercase tracking-wider">
                        <div>
                            <label className={`block mb-1.5 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Operator Profile Username</label>
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className={`w-full p-3 border rounded-xl font-mono text-xs focus:outline-none transition ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white focus:border-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-zinc-900'}`} placeholder="e.g. user1" required />
                        </div>
                        <div>
                            <label className={`block mb-1.5 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Security Vector Matrix Key</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={`w-full p-3 border rounded-xl font-mono text-xs focus:outline-none transition ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white focus:border-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-zinc-900'}`} placeholder="••••••••" required />
                        </div>
                        <div>
                            <label className={`block mb-1.5 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Mobile Communication Handle</label>
                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} className={`w-full p-3 border rounded-xl font-mono text-xs focus:outline-none transition ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white focus:border-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-zinc-900'}`} placeholder="10-digit number" maxLength="10" required />
                        </div>
                        <button type="submit" className={`w-full font-black py-3.5 rounded-xl transition uppercase text-xs tracking-widest mt-2 shadow-lg ${darkMode ? 'bg-white text-zinc-950 hover:bg-zinc-200 shadow-white/5' : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-zinc-900/10'}`}>Generate SMS Token</button>
                    </form>
                ) : (
                    <form onSubmit={handleTokenChallenge} className="space-y-4 text-xs font-bold uppercase tracking-wider">
                        <div className={`p-3 rounded-xl text-center font-medium leading-relaxed normal-case ${darkMode ? 'bg-zinc-950 text-zinc-400' : 'bg-zinc-50 text-zinc-600'}`}>An authorized multi-factor payload has been synchronized with the device profile registry line at <span className="font-mono font-bold text-blue-500">+91 {phone}</span>.</div>
                        <div>
                            <label className={`block mb-1.5 text-center ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Enter 4-Digit Identity OTP</label>
                            <input type="text" value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))} className={`w-full p-3 border text-xl font-mono text-center font-black tracking-widest rounded-xl focus:outline-none transition ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white focus:border-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-zinc-900'}`} placeholder="0000" maxLength="4" required />
                        </div>
                        <div className="flex gap-2 pt-1">
                            <button type="button" onClick={() => setStep(1)} className={`flex-1 py-3 rounded-xl uppercase font-bold text-xs ${darkMode ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'}`}>Back</button>
                            <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl uppercase text-xs tracking-wider shadow-lg shadow-emerald-600/10">Authorize Terminal</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
/* ==========================================================================
   END OF TOPIC: CO5 - ACCESS SECURITY INTERFACE SURFACE ENDPOINT
   ========================================================================== */