import React, { useState } from 'react';
import API_BASE_URL from '../config';

const Register = ({ setToken, setView, setIsGuest }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setError('Please enter a valid email address.');
                setLoading(false);
                return;
            }

            if (password.length < 6) {
                setError('Password must be at least 6 characters long.');
                setLoading(false);
                return;
            }

            let res;
            try {
                res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password })
                });
            } catch (networkErr) {
                throw new Error("Unable to reach the server. The backend may be starting up on Render (free tier cold start takes ~30-50s). Please wait a moment and try again.");
            }

            let data;
            try {
                data = await res.json();
            } catch (jsonErr) {
                throw new Error("Received an invalid response from server. If the server is restarting, please retry in a few seconds.");
            }

            if (!res.ok) {
                const rawError = data.error || data.message || "Something went wrong";
                if (typeof rawError === 'string' && rawError.includes('buffering timed out')) {
                    throw new Error("Database connection timed out. Please verify that MONGO_URI is configured on Render and MongoDB Atlas allows access from 0.0.0.0/0.");
                }
                throw new Error(rawError);
            }

            if (data.token) {
                localStorage.setItem("token", data.token);
                setToken(data.token);
                setView('main');
            } else {
                throw new Error("Registration succeeded but no authorization token was received.");
            }
        } catch (err) {
            console.error("REGISTER ERROR:", err);
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container fade-in">
            <div className="auth-header">
                <h2 className="sidebar-logo" style={{ marginBottom: '10px' }}>Skill-to-Career <br/><span>AI Engine</span></h2>
            </div>
            <h2 className="section-title">Create Account</h2>
            {error && (
                <div className="error-message">
                    {error}
                    {setIsGuest && (
                        <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                            <button 
                                type="button" 
                                onClick={() => { setIsGuest(true); setView('main'); }} 
                                style={{ background: 'transparent', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                            >
                                Or continue in Guest Mode →
                            </button>
                        </div>
                    )}
                </div>
            )}
            <form onSubmit={handleRegister} className="form-container" style={{ padding: '0', border: 'none', boxShadow: 'none' }}>
                <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit" disabled={loading} className={`btn-primary ${loading ? 'loading' : ''}`}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)' }}>
                Already have an account? <span onClick={() => setView('login')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>Login</span>
            </p>
        </div>
    );
};

export default Register;
