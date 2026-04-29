import React, { useState, useEffect } from 'react';
import { Book, DollarSign, TrendingUp, Target, Building, Zap, Award, Rocket, AlertTriangle, X } from 'lucide-react';
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
                    <button className="modal-close-btn" onClick={onClose}><X size={24} /></button>
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
                                    <AlertTriangle size={24} style={{ color: '#f59e0b' }} />
                                    <span>AI insights temporarily unavailable — showing standard recommendations</span>
                                </div>
                            )}
                            
                            <div className="modal-section fade-in">
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Book size={20} color="var(--primary)" /> Career Overview</h4>
                                <p>{details.summary}</p>
                            </div>

                            <div className="modal-section fade-in" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                <div style={{ flex: '1 1 200px', background: 'var(--surface-hover)', padding: '15px', borderRadius: '10px', border: '1px solid var(--surface-border)' }}>
                                    <h4 style={{ color: 'var(--primary)', marginBottom: '5px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}><DollarSign size={16} /> Average Package</h4>
                                    <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-main)', margin: 0 }}>{details.averagePackage}</p>
                                </div>
                                <div style={{ flex: '1 1 200px', background: 'var(--surface-hover)', padding: '15px', borderRadius: '10px', border: '1px solid var(--surface-border)' }}>
                                    <h4 style={{ color: 'var(--primary)', marginBottom: '5px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}><TrendingUp size={16} /> Market Outlook</h4>
                                    <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-main)', margin: 0 }}>{details.outlook}</p>
                                </div>
                            </div>

                            {details.skills && details.skills.length > 0 && (
                                <div className="modal-section fade-in">
                                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Target size={20} color="var(--primary)" /> Core Skills Required</h4>
                                    <div className="skills-tags">
                                        {details.skills.map((skill, i) => (
                                            <a key={i} href={getSkillUrl(skill)} target="_blank" rel="noopener noreferrer" className="tag interactive-tag" style={{ background: 'var(--surface-hover)', color: 'var(--text-main)', border: '1px solid var(--surface-border)' }}>{skill}</a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {details.companies && details.companies.length > 0 && (
                                <div className="modal-section fade-in">
                                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Building size={20} color="#a855f7" /> Actively Hiring Organizations</h4>
                                    <div className="skills-tags">
                                        {details.companies.map((comp, i) => (
                                            <span key={i} className="tag" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' }}>{comp}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {details.responsibilities && details.responsibilities.length > 0 && (
                                <div className="modal-section fade-in">
                                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={20} color="#f59e0b" /> Key Responsibilities</h4>
                                    <ul className="modal-list">
                                        {details.responsibilities.map((req, i) => (
                                            <li key={i}>{req}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="modal-section fade-in" style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--surface-border)', borderLeft: '4px solid #f59e0b', boxShadow: 'var(--shadow-soft)' }}>
                                <h4 style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px' }}><Award size={20} /> The Top 1% Portfolio</h4>
                                <p style={{ color: 'var(--text-main)' }}>{details.top1PercentPortfolio}</p>
                            </div>

                            {details.projects && details.projects.length > 0 && (
                                <div className="modal-section fade-in" style={{marginBottom: 0}}>
                                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Rocket size={20} color="#ec4899" /> Example Projects to Build</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                                        {details.projects.map((proj, i) => (
                                            <div key={i} style={{ padding: '15px', background: 'var(--surface)', border: '1px solid var(--surface-border)', borderRadius: '10px' }}>
                                                <h5 style={{ color: 'var(--text-main)', fontSize: '1.05rem', marginBottom: '8px', fontWeight: '700' }}>{proj.name}</h5>
                                                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)' }}>{proj.description}</p>
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
