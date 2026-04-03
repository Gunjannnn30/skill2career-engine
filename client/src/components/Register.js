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
            const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server is unavailable or starting up. Please try again in a minute.");
            }
            
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Registration failed');

            localStorage.setItem("token", data.token);
            setToken(data.token);
            setView('main');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2 className="section-title">Create Account</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleRegister} className="form-container" style={{ marginTop: '20px' }}>
                <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required className="skill-input" style={{ minHeight: '50px', marginBottom: '15px', maxWidth: '400px' }} />
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="skill-input" style={{ minHeight: '50px', marginBottom: '15px', maxWidth: '400px' }} />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="skill-input" style={{ minHeight: '50px', marginBottom: '20px', maxWidth: '400px' }} />
                <button type="submit" disabled={loading} className={`${loading ? 'loading' : ''}`}>
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
