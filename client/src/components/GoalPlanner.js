import React, { useState, useEffect } from 'react';
import AILoading from './AILoading';
import API_BASE_URL from '../config';

const GoalPlanner = ({ currentSkills: initialSkills, token, setView }) => {
    const [goal, setGoal] = useState('');
    const [timeline, setTimeline] = useState('6 months');
    
    // Editable State arrays
    const [activeSkills, setActiveSkills] = useState([]);
    const [newSkillInput, setNewSkillInput] = useState('');
    
    const [projectsDone, setProjectsDone] = useState([]);
    const [newProjectInput, setNewProjectInput] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) return;
            try {
                const res = await fetch(`${API_BASE_URL}/api/user/career-profile`, { headers: { 'Authorization': `Bearer ${token}` } });
                const text = await res.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    console.error("❌ HTML RESPONSE RECEIVED:", text);
                    throw new Error("Backend returned HTML instead of JSON. Check API URL.");
                }
                if (res.ok && data && data.goal) {
                    setGoal(data.goal);
                    setTimeline(data.timeline);
                    
                    // Always prioritize the saved database skills when opening the planner!
                    if (data.currentSkills && data.currentSkills.length > 0) {
                        setActiveSkills(data.currentSkills);
                    } else if (initialSkills && initialSkills.length > 0) {
                        setActiveSkills(initialSkills);
                    } else {
                        setActiveSkills([]);
                    }
                    
                    setProjectsDone(data.projectsDone || []);
                } else if (initialSkills && initialSkills.length > 0) {
                    setActiveSkills(initialSkills);
                }
            } catch (err) { }
        };
        fetchProfile();
    }, [token, initialSkills]);

    const handleAddSkill = (e) => {
        if (e.key === 'Enter' && newSkillInput.trim()) {
            if (!activeSkills.includes(newSkillInput.trim())) {
                setActiveSkills([...activeSkills, newSkillInput.trim()]);
            }
            setNewSkillInput('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setActiveSkills(activeSkills.filter(s => s !== skillToRemove));
    };

    const handleAddProject = (e) => {
        if (e.key === 'Enter' && newProjectInput.trim()) {
            if (!projectsDone.includes(newProjectInput.trim())) {
                setProjectsDone([...projectsDone, newProjectInput.trim()]);
            }
            setNewProjectInput('');
        }
    };

    const handleRemoveProject = (projectToRemove) => {
        setProjectsDone(projectsDone.filter(p => p !== projectToRemove));
    };

    const handleGenerateGoal = async () => {
        if (!goal.trim()) {
            setError("Please enter a target career role.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage('');

        try {
            // 1. Fetch Plan from AI API mapped natively with advanced Real-Time contexts
            const aiRes = await fetch(`${API_BASE_URL}/api/ai/goal-analysis`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    goal, 
                    timeline, 
                    currentSkills: activeSkills,
                    projectsDone 
                })
            });

            let aiData;
            try {
                aiData = await aiRes.json();
            } catch (jsonErr) {
                console.error("Non-JSON Response received:", jsonErr);
                throw new Error("Something went wrong. The server returned an invalid response. Please verify the backend API is running and try again.");
            }

            if (!aiRes.ok) throw new Error(aiData.error || aiData.message || 'Failed to generate plan');

            // 2. Save explicitly to User Career Profile mapping verified advanced attributes
            if (token) {
                const saveRes = await fetch(`${API_BASE_URL}/api/user/career-profile`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({
                        goal,
                        timeline,
                        matchScore: aiData.data.matchScore,
                        currentSkills: activeSkills,
                        missingSkills: aiData.data.missingSkills,
                        roadmap: aiData.data.roadmap,
                        companiesHiring: aiData.data.companiesHiring,
                        recommendedProjects: aiData.data.recommendedProjects,
                        projectsDone
                    })
                });

                if (!saveRes.ok) throw new Error('Failed to save profile permanently');
                setSuccessMessage("Roadmap successfully generated and permanently saved to your profile!");
            } else {
                setError("Please log in to save a persistent Career Plan.");
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="goal-planner-container fade-in" style={{ marginTop: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}>🎯 Set Your Career Goal</h2>

            <div style={{ marginBottom: '25px' }}>
                <h4 style={{ color: '#e2e8f0', marginBottom: '10px' }}>Your Current Skills</h4>
                <div className="editable-tags-container">
                    {activeSkills.map((skill, i) => (
                        <div key={i} className="editable-tag">
                            {skill}
                            <button className="editable-tag-remove" onClick={() => handleRemoveSkill(skill)}>✕</button>
                        </div>
                    ))}
                    <input 
                        type="text" 
                        placeholder="Type a skill and press Enter..." 
                        style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', flex: 1, minWidth: '150px' }}
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        onKeyDown={handleAddSkill}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '35px' }}>
                <h4 style={{ color: '#e2e8f0', margin: '0 0 10px 0' }}>Projects Completed So Far</h4>
                <div className="editable-tags-container" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                    {projectsDone.map((proj, i) => (
                        <div key={i} className="editable-tag" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                            {proj}
                            <button className="editable-tag-remove" onClick={() => handleRemoveProject(proj)}>✕</button>
                        </div>
                    ))}
                    <input 
                        type="text" 
                        placeholder="E.g., Built a Next.js Ecommerce site (Press Enter)" 
                        style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', flex: 1, minWidth: '250px' }}
                        value={newProjectInput}
                        onChange={(e) => setNewProjectInput(e.target.value)}
                        onKeyDown={handleAddProject}
                    />
                </div>
            </div>

            <h4 style={{ color: '#6366f1', marginBottom: '15px' }}>Configure Your Target</h4>
            <div className="goal-form" style={{ marginTop: 0 }}>
                <input 
                    type="text" 
                    className="goal-input" 
                    placeholder="Target Role (E.g., Senior Security Engineer)" 
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                />
                
                <select 
                    className="goal-select" 
                    value={timeline} 
                    onChange={(e) => setTimeline(e.target.value)}
                >
                    <option value="3 months">3 Months</option>
                    <option value="6 months">6 Months</option>
                    <option value="1 year">1 Year</option>
                    <option value="2 years">2 Years</option>
                </select>

                <button 
                    className="goal-btn" 
                    onClick={handleGenerateGoal}
                    disabled={loading || !goal.trim()}
                >
                    Generate AI Dashboard
                </button>
            </div>

            {loading && (
                <div style={{ marginTop: '30px' }}>
                    <AILoading messages={["Evaluating user background...", "Querying active verified industry pipelines...", "Formulating real-world project roadmaps...", "Optimizing trajectory..."]} />
                </div>
            )}

            {error && !loading && (
                <div className="error-message" style={{ marginTop: '20px' }}>
                    Oops! {error}
                </div>
            )}

            {successMessage && !loading && (
                <div className="fade-in" style={{ marginTop: '30px', padding: '25px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '12px', textAlign: 'center' }}>
                    <h3 style={{ color: '#34d399', marginBottom: '15px' }}>✓ {successMessage}</h3>
                    <button 
                        onClick={() => setView('careerPlan')} 
                        style={{ padding: '12px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        View My New Career Dashboard →
                    </button>
                </div>
            )}
        </div>
    );
};

export default GoalPlanner;
