import React, { useState, useEffect } from 'react';
import RoleCard from './RoleCard';
import API_BASE_URL from '../config';

const HistoryView = ({ token, setView }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/user/history`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Server is unavailable or returned an invalid response.");
                }

                const text = await res.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    console.error("❌ HTML RESPONSE RECEIVED:", text);
                    throw new Error("Backend returned HTML instead of JSON. Check API URL.");
                }
                if (!res.ok) throw new Error(data.error || 'Failed to fetch history');
                setHistory(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [token]);

    return (
        <section className="results-section fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="section-title" style={{ margin: 0 }}>Your Saved Analyses</h2>
                <button onClick={() => setView('main')} className="analyze-btn" style={{ minWidth: 'auto', padding: '8px 20px', fontSize: '1rem' }}>Back to AI Menu</button>
            </div>
            
            {loading && <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>Loading history mapping...</p>}
            {error && <div className="error-message">{error}</div>}
            
            {!loading && history.length === 0 && (
                <p className="no-roles">You haven't explicitly requested or saved any analyses yet!</p>
            )}

            {!loading && history.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    {history.map((item, idx) => (
                        <div key={idx} style={{ padding: '30px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--primary)' }}>
                            <div style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ color: 'var(--success)', display: 'block', fontSize: '0.9rem', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    {new Date(item.createdAt).toLocaleString()}
                                </span>
                                <h3 style={{color: '#fff', fontSize: '1.2rem', marginBottom: '15px'}}>"{item.input}"</h3>
                                
                                {item.result && item.result.skills && item.result.skills.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        <strong style={{ color: 'var(--text-muted)', fontSize: '0.9rem', alignSelf: 'center', marginRight: '5px' }}>Skills Detected:</strong>
                                        {item.result.skills.map(skill => (
                                            <span key={skill} className="tag skill-tag" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>{skill}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="roles-grid">
                                {item.result && item.result.roles && item.result.roles.map((roleObj, i) => (
                                    <RoleCard key={i} roleObj={roleObj} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default HistoryView;
