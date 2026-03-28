import React, { useState } from 'react';

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
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || 'Login failed');
            
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
            <h2 className="section-title">Welcome Back</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleLogin} className="form-container" style={{ marginTop: '20px' }}>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="skill-input" style={{minHeight: '50px', marginBottom: '15px', maxWidth: '400px'}} />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="skill-input" style={{minHeight: '50px', marginBottom: '20px', maxWidth: '400px'}} />
                <button type="submit" disabled={loading} className={`${loading ? 'loading' : ''}`}>
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
