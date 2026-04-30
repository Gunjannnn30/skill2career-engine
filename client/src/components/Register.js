import React, { useState } from 'react';
import API_BASE_URL from '../config';

const Register = ({ setToken, setView }) => {
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

            const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
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
            <h2 className="section-title">Create Account</h2>
            {error && <div className="error-message">{error}</div>}
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
