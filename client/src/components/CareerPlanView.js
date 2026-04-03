import React, { useState, useEffect } from 'react';
import AILoading from './AILoading';
import API_BASE_URL from '../config';
import StudyResources from './StudyResources';

const CareerPlanView = ({ token, setView }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState('');
    const [newSkill, setNewSkill] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/user/career-profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || data.message || "Something went wrong");
                }
                setProfile(data);
            } catch (err) {
                console.error("ERROR:", err);
                setError(err.message || JSON.stringify(err));
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    useEffect(() => {
        if (!profile || !profile.timeline) return;

        let totalDays = 180;
        if (profile.timeline === "3 months") totalDays = 90;
        if (profile.timeline === "6 months") totalDays = 180;
        if (profile.timeline === "1 year") totalDays = 365;
        if (profile.timeline === "2 years") totalDays = 730;

        const start = new Date(profile.lastUpdated || Date.now()).getTime();
        const targetDate = start + (totalDays * 24 * 60 * 60 * 1000);

        const updateClock = () => {
            const now = Date.now();
            const difference = targetDate - now;

            if (difference <= 0) {
                setTimeLeft('Time is Up!');
                return;
            }

            const d = Math.floor(difference / (1000 * 60 * 60 * 24));
            const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const m = Math.floor((difference / 1000 / 60) % 60);
            const s = Math.floor((difference / 1000) % 60);

            setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
        };

        updateClock();
        const intervalId = setInterval(updateClock, 1000);
        return () => clearInterval(intervalId);
    }, [profile]);

    if (loading) return <div style={{ padding: '40px' }}><AILoading messages={["Loading your centralized Career Profile..."]} /></div>;
    
    if (error) return <div className="error-message">Oops! {error}</div>;

    if (!profile || !profile.goal) {
        return (
            <div className="fade-in" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>No Active Career Plan</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '30px' }}>You haven't generated a structural goal roadmap yet!</p>
                <button 
                    onClick={() => setView('main')} 
                    style={{ padding: '15px 30px', background: 'linear-gradient(135deg, #7c5cff, #5ce1e6)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}
                >
                    Run an Analysis to Set a Goal
                </button>
            </div>
        );
    }

    const handleAddLearnedSkill = async (skillToInject = null) => {
        const skillName = (typeof skillToInject === 'string') ? skillToInject.trim() : newSkill.trim();
        if (!skillName || !profile) return;
        setIsUpdating(true);

        const safeCurrent = profile.currentSkills || [];
        const safeMissing = profile.targetSkills || [];

        const updatedCurrent = [...new Set([...safeCurrent.map(s => s.toLowerCase()), skillName.toLowerCase()])].map(s => {
            if (s.toLowerCase() === skillName.toLowerCase()) return skillName;
            return safeCurrent.find(cs => cs.toLowerCase() === s) || s;
        });
        
        const updatedMissing = safeMissing.filter(s => s.toLowerCase() !== skillName.toLowerCase());

        const totalRequired = updatedCurrent.length + updatedMissing.length;
        let exactMathScore = totalRequired > 0 ? Math.floor((updatedCurrent.length / totalRequired) * 100) : 100;
        if (profile.projectsDone && profile.projectsDone.length > 0) exactMathScore += 10;
        if (exactMathScore > 100) exactMathScore = 100;
        if (updatedCurrent.length === 0 && (!profile.projectsDone || profile.projectsDone.length === 0)) exactMathScore = 0;

        const payload = {
            goal: profile.goal,
            timeline: profile.timeline,
            matchScore: exactMathScore,
            currentSkills: updatedCurrent,
            missingSkills: updatedMissing,
            roadmap: profile.roadmap,
            companiesHiring: profile.companiesHiring,
            recommendedProjects: profile.recommendedProjects,
            projectsDone: profile.projectsDone
        };

        try {
            const res = await fetch(`${API_BASE_URL}/api/user/career-profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || data.message || "Something went wrong");
            }
            setProfile(data.data);
            if (typeof skillToInject !== 'string') setNewSkill('');
        } catch (err) { 
            console.error("ERROR:", err);
            setError(err.message || JSON.stringify(err));
        } finally { setIsUpdating(false); }
    };

    return (
        <div className="fade-in" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <div className="career-plan-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <p style={{ textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '10px' }}>Target Milestone</p>
                    <h2 style={{ margin: '0 0 10px 0' }}>{profile.goal}</h2>
                    <p style={{ display: 'inline-block', background: 'rgba(99, 102, 241, 0.1)', padding: '5px 15px', borderRadius: '20px', color: '#818cf8', fontWeight: 'bold', border: '1px solid rgba(99, 102, 241, 0.3)', marginRight: '10px' }}>
                        {profile.timeline} Execution Plan
                    </p>
                    <p style={{ display: 'inline-block', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', padding: '5px 15px', borderRadius: '20px', color: 'white', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(245, 158, 11, 0.4)', fontFamily: 'monospace', fontSize: '1rem', letterSpacing: '1px' }}>
                        ⏳ {timeLeft} Left
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '15px 25px', borderRadius: '12px' }}>
                        <p style={{ color: '#6ee7b7', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Current Readiness</p>
                        <h3 style={{ fontSize: '2.2rem', color: '#10b981', margin: 0 }}>{profile.matchScore || 0}%</h3>
                    </div>
                </div>
            </div>

            <div className="plan-stats">
                <div className="plan-stat-card">
                    <h4>Current Skills Matrix</h4>
                    <p>{profile.currentSkills.length > 0 ? profile.currentSkills.length : 0}</p>
                </div>
                <div className="plan-stat-card">
                    <h4>Target Skills Gap</h4>
                    <p style={{ color: '#ef4444' }}>{profile.targetSkills.length > 0 ? profile.targetSkills.length : 'Completed'}</p>
                </div>
                <div className="plan-stat-card">
                    <h4>Phases Required</h4>
                    <p style={{ color: '#10b981' }}>{profile.roadmap.length}</p>
                </div>
            </div>

            {profile.targetSkills && profile.targetSkills.length > 0 && (
                <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ marginBottom: '5px' }}>Critical Skills to Acquire</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '15px' }}>Click any skill to instantly mark it as strictly acquired! Your scores will recalculate actively in real-time!</p>
                    <div className="skills-tags">
                        {profile.targetSkills.map((skill, i) => (
                            <button 
                                key={i} 
                                onClick={() => handleAddLearnedSkill(skill)}
                                className="tag missing-tag" 
                                style={{ cursor: 'pointer', transition: 'all 0.2s', border: '1px solid rgba(239, 68, 68, 0.3)', fontFamily: 'inherit', background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5' }}
                                onMouseOver={e => e.target.style.transform = 'scale(1.05)'} 
                                onMouseOut={e => e.target.style.transform = 'scale(1)'}
                                disabled={isUpdating}
                            >
                                {skill} ＋
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {profile.companiesHiring && profile.companiesHiring.length > 0 && (
                <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ marginBottom: '15px' }}>Verified Companies Actively Hiring</h3>
                    <div className="skills-tags">
                        {profile.companiesHiring.map((company, i) => (
                            <span key={i} className="tag" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }}>{company}</span>
                        ))}
                    </div>
                </div>
            )}

            <div className="plan-timeline-container">
                <h3 style={{ marginBottom: '25px', color: '#fff' }}>Strategic Implementation Roadmap</h3>
                
                {profile.roadmap.map((phase, i) => (
                    <div key={i} className="plan-phase">
                        <h3><span style={{ background: '#7c5cff', color: 'white', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '0.9rem' }}>{i + 1}</span> {phase.phase}</h3>
                        <ul className="plan-focus-list">
                            {phase.focus.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <StudyResources skills={profile.targetSkills} />

            {profile.recommendedProjects && profile.recommendedProjects.length > 0 && (
                <div style={{ marginTop: '50px' }}>
                    <h3 style={{ marginBottom: '20px', color: '#f59e0b' }}>Actionable Projects to Build</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {profile.recommendedProjects.map((proj, i) => (
                            <div key={i} style={{ padding: '20px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px' }}>
                                <h4 style={{ color: '#fbbf24', fontSize: '1.2rem', margin: '0 0 8px 0' }}>{proj.name}</h4>
                                {proj.purpose && <p style={{ color: '#fed7aa', margin: '0 0 10px 0', lineHeight: '1.6', fontWeight: '600' }}>{proj.purpose}</p>}
                                <p style={{ color: 'var(--text-muted)', margin: '0 0 15px 0', lineHeight: '1.6', fontSize: '0.95rem' }}>{proj.description}</p>
                                
                                {proj.techStack && proj.techStack.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '5px' }}>
                                        <span style={{ fontSize: '0.85rem', color: '#94a3b8', marginRight: '5px', display: 'flex', alignItems: 'center' }}>Tech Stack:</span>
                                        {proj.techStack.map((tech, tIdx) => (
                                            <span key={tIdx} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '3px 10px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold' }}>{tech}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            
            <div style={{ textAlign: 'center', marginTop: '60px', padding: '30px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(79, 70, 229, 0.2)', borderRadius: '15px' }}>
                <h3 style={{ marginBottom: '15px' }}>⚡ Inject a Learned Skill!</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '25px', maxWidth: '600px', margin: '0 auto 25px auto', lineHeight: '1.6' }}>Mastered something new today? Instantly inject it directly into your profile timeline to mathematically track your active readiness without generating an entirely new algorithmic roadmap!</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', maxWidth: '400px', margin: '0 auto' }}>
                    <input 
                        type="text" 
                        placeholder="e.g. Next.js" 
                        value={newSkill} 
                        onChange={e => setNewSkill(e.target.value)} 
                        style={{ padding: '12px 15px', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.3)', background: 'rgba(15, 23, 42, 0.8)', color: 'white', flex: 1, outline: 'none' }} 
                        onKeyDown={e => e.key === 'Enter' && handleAddLearnedSkill()} 
                        disabled={isUpdating}
                    />
                    <button 
                        onClick={() => handleAddLearnedSkill()} 
                        disabled={isUpdating || !newSkill.trim()} 
                        style={{ padding: '0 20px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', opacity: isUpdating || !newSkill.trim() ? 0.6 : 1, transition: 'all 0.2s' }}
                    >
                        {isUpdating ? '...' : 'Add'}
                    </button>
                </div>
            </div>
            
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '40px' }}>Last Updated: {new Date(profile.lastUpdated).toLocaleDateString()}</p>
        </div>
    );
};

export default CareerPlanView;
