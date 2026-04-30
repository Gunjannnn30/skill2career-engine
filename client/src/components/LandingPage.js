import React from 'react';
import { ArrowRight, LogIn, UserPlus, Search, Map, FileText } from 'lucide-react';

const LandingPage = ({ setView, setIsGuest }) => {
    return (
        <div className="landing-container fade-in">
            <div className="landing-content">
                <div className="landing-logo">
                    Skill-to-Career <span>AI Engine</span>
                </div>
                
                <h1 className="landing-headline">
                    Map your skills to your dream career in seconds.
                </h1>
                
                <p className="landing-subheadline">
                    Leverage advanced AI to analyze your current skillset, identify missing gaps, and generate actionable, step-by-step roadmaps to reach your target role.
                </p>

                <div className="landing-actions">
                    <button 
                        className="btn-primary" 
                        onClick={() => setView('register')}
                        style={{ padding: '16px 32px', fontSize: '1.1rem' }}
                    >
                        Get Started <ArrowRight size={20} />
                    </button>
                    
                    <button 
                        className="btn-outline" 
                        onClick={() => setView('login')}
                        style={{ padding: '16px 32px', fontSize: '1.1rem' }}
                    >
                        Login
                    </button>
                </div>
                
                <div className="landing-skip">
                    <button 
                        className="btn-ghost" 
                        onClick={() => {
                            setIsGuest(true);
                            setView('main');
                        }}
                    >
                        Skip for Now (Try limited version)
                    </button>
                </div>
            </div>

            <div className="landing-features">
                <div className="feature-grid">
                    <div className="feature-card">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Search size={24} color="var(--primary)" /> Skills Analysis</h3>
                        <p>Instantly evaluate your current technical and soft skills against industry demands.</p>
                    </div>
                    <div className="feature-card">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Map size={24} color="var(--primary)" /> Career Roadmaps</h3>
                        <p>Get personalized, step-by-step guides on what to learn next to reach your dream role.</p>
                    </div>
                    <div className="feature-card">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={24} color="var(--primary)" /> Resume Insights</h3>
                        <p>Upload your PDF resume to automatically extract and map your experience.</p>
                    </div>
                </div>
            </div>

            <div className="landing-bottom-cta" style={{ marginTop: '100px', paddingTop: '60px', marginBottom: '40px', borderTop: '1px solid var(--border)' }}>
                <h2 style={{ marginBottom: '20px' }}>Ready to accelerate your career?</h2>
                <div className="landing-actions" style={{ marginTop: '30px' }}>
                    <button className="btn-primary" onClick={() => setView('register')}>Create Free Account</button>
                    <button className="btn-outline" onClick={() => setView('login')}>Login</button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
