import React, { useState } from 'react';
import API_BASE_URL from '../config';

const Login = ({ setToken, setView }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setError('Please enter a valid email address.');
                setLoading(false);
                return;
            }

            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || data.message || "Something went wrong");
            }
            
            localStorage.setItem("token", data.token);
            setToken(data.token);
            setView('main');
        } catch (err) {
            console.error("ERROR:", err);
            setError(err.message || JSON.stringify(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container fade-in">
            <div className="auth-header">
                <h2 className="sidebar-logo" style={{ marginBottom: '10px' }}>Skill-to-Career <br/><span>AI Engine</span></h2>
            </div>
            <h2 className="section-title">Welcome Back</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleLogin} className="form-container" style={{ padding: '0', border: 'none', boxShadow: 'none' }}>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit" disabled={loading} className={`btn-primary ${loading ? 'loading' : ''}`}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <p style={{textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)'}}>
                Don't have an account? <span onClick={() => setView('register')} style={{color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold'}}>Register</span>
            </p>
        </div>
    );
};
export default Login;
