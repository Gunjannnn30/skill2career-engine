import React, { useState, useEffect } from 'react';
import RoleCard from './RoleCard';
import API_BASE_URL from '../config';
import { Clock, Lock } from 'lucide-react';

const HistoryView = ({ token, setView, isGuest }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isGuest) {
            setLoading(false);
            return;
        }

        const fetchHistory = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/user/history`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || data.message || "Something went wrong");
                }
                setHistory(data);
            } catch (err) {
                console.error("ERROR:", err);
                setError(err.message || JSON.stringify(err));
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [token]);

    return (
        <section className="results-section fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><Clock size={28} color="var(--primary)" /> Your Saved Analyses</h2>
                <button onClick={() => setView('main')} className="btn-outline" style={{ minWidth: 'auto', padding: '8px 20px', fontSize: '1rem', width: 'auto', marginTop: '0' }}>Back to AI Menu</button>
            </div>
            
            {isGuest ? (
                <div className="guest-banner" style={{ padding: '40px 20px', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--surface-border)', borderRadius: '12px', marginTop: '30px' }}>
                    <Lock size={48} style={{ color: 'var(--text-muted)', marginBottom: '20px' }} />
                    <h3 style={{ color: 'var(--text-main)', marginBottom: '10px' }}>History is Locked for Guests</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px', maxWidth: '400px', margin: '0 auto 20px auto' }}>
                        Your analysis history is not saved in Guest Mode. Please log in or register to securely save and access your career roadmaps anytime.
                    </p>
                    <button className="btn-primary" onClick={() => setView('login')}>Log In / Register</button>
                </div>
            ) : (
                <>
                    {loading && <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>Loading history mapping...</p>}
                    {error && <div className="error-message">{error}</div>}
                    
                    {!loading && history.length === 0 && (
                        <p className="no-roles">You haven't explicitly requested or saved any analyses yet!</p>
                    )}

            {!loading && history.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    {history.map((item, idx) => (
                        <div key={idx} style={{ padding: '30px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-soft)' }}>
                            <div style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid var(--surface-border)' }}>
                                <span style={{ color: 'var(--success)', display: 'block', fontSize: '0.9rem', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>
                                    {new Date(item.createdAt).toLocaleString()}
                                </span>
                                <h3 style={{color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '15px'}}>"{item.input}"</h3>
                                
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
                </>
            )}
        </section>
    );
};

export default HistoryView;
