import React, { useState, useEffect } from 'react';
import AILoading from './AILoading';
import API_BASE_URL from '../config';
import StudyResources from './StudyResources';
import { getSkillUrl } from '../utils/skillDictionary';

const CareerModal = ({ roleName, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/ai/career-details`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ role: roleName })
                });

                const data = await response.json();
                if (!response.ok) {
                   throw new Error(data.error || data.message || "Something went wrong");
                }
                
                setDetails(data.data);
            } catch (err) {
                console.error("ERROR:", err);
                setError(err.message || JSON.stringify(err));
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [roleName]);

    return (
        <div className="career-modal-overlay" onClick={onClose}>
            <div className="career-modal-content fade-in" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{roleName} Insights</h2>
                    <button className="modal-close-btn" onClick={onClose}>✕</button>
                </div>
                
                <div className="modal-body">
                    {loading && (
                        <div style={{ padding: '20px 0' }}>
                           <AILoading messages={["Connecting to Industry Databases...", "Analyzing market metrics...", "Formatting career insights..."]} />
                        </div>
                    )}
                    
                    {error && !loading && (
                        <div className="error-message">Oops! Could not load insights: {error}</div>
                    )}

                    {details && !loading && (
                        <>
                            {details.aiEnhanced === false && (
                                <div className="fallback-banner fade-in">
                                    <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                                    <span>AI insights temporarily unavailable — showing standard recommendations</span>
                                </div>
                            )}
                            
                            <div className="modal-section fade-in">
                                <h4>📚 Career Overview</h4>
                                <p>{details.summary}</p>
                            </div>

                            <div className="modal-section fade-in" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                <div style={{ flex: '1 1 200px', background: 'rgba(59, 130, 246, 0.1)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                    <h4 style={{ color: '#60a5fa', marginBottom: '5px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>💰 Average Package</h4>
                                    <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#fff', margin: 0 }}>{details.averagePackage}</p>
                                </div>
                                <div style={{ flex: '1 1 200px', background: 'rgba(16, 185, 129, 0.1)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                    <h4 style={{ color: '#34d399', marginBottom: '5px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📈 Market Outlook</h4>
                                    <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#fff', margin: 0 }}>{details.outlook}</p>
                                </div>
                            </div>

                            {details.skills && details.skills.length > 0 && (
                                <div className="modal-section fade-in">
                                    <h4>🎯 Core Skills Required</h4>
                                    <div className="skills-tags">
                                        {details.skills.map((skill, i) => (
                                            <a key={i} href={getSkillUrl(skill)} target="_blank" rel="noopener noreferrer" className="tag interactive-tag" style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.2)' }}>{skill}</a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {details.companies && details.companies.length > 0 && (
                                <div className="modal-section fade-in">
                                    <h4>🏢 Actively Hiring Organizations</h4>
                                    <div className="skills-tags">
                                        {details.companies.map((comp, i) => (
                                            <span key={i} className="tag" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' }}>{comp}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {details.responsibilities && details.responsibilities.length > 0 && (
                                <div className="modal-section fade-in">
                                    <h4>⚡ Key Responsibilities</h4>
                                    <ul className="modal-list">
                                        {details.responsibilities.map((req, i) => (
                                            <li key={i}>{req}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="modal-section fade-in" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
                                <h4 style={{ color: '#fbbf24' }}>🏆 The Top 1% Portfolio</h4>
                                <p style={{ color: '#e2e8f0' }}>{details.top1PercentPortfolio}</p>
                            </div>

                            {details.projects && details.projects.length > 0 && (
                                <div className="modal-section fade-in" style={{marginBottom: 0}}>
                                    <h4>🚀 Example Projects to Build</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                                        {details.projects.map((proj, i) => (
                                            <div key={i} style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' }}>
                                                <h5 style={{ color: '#a855f7', fontSize: '1.05rem', marginBottom: '8px' }}>{proj.name}</h5>
                                                <p style={{ margin: 0, fontSize: '0.95rem' }}>{proj.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <StudyResources skills={details.skills} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CareerModal;
