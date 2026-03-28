import React from 'react';

const Navbar = ({ token, view, setView, handleLogout }) => {
  const isAuthPage = !token || view === 'login' || view === 'register';

  return (
    <header className="app-header">
      <div className={`header ${isAuthPage ? 'auth-header' : 'main-header'}`}>
        <h1 className="title">Skill-to-Career AI Engine</h1>
        
        {!isAuthPage && token && (
          <div className="actions">
            <button onClick={() => setView('main')} className={`history-btn analyze-btn ${view === 'main' ? 'active-nav-btn' : ''}`} style={{ background: view === 'main' ? '#6366f1' : '' }}>
               Analyze Profile
            </button>
            <button onClick={() => setView('goal')} className={`history-btn analyze-btn ${view === 'goal' ? 'active-nav-btn' : ''}`} style={{ background: view === 'goal' ? '#6366f1' : '' }}>
               Set Career Goal
            </button>
            <button onClick={() => setView('careerPlan')} className={`history-btn analyze-btn ${view === 'careerPlan' ? 'active-nav-btn' : ''}`} style={{ background: view === 'careerPlan' ? '#6366f1' : '' }}>
               My Career Plan
            </button>
            <button onClick={() => setView('history')} className={`history-btn analyze-btn ${view === 'history' ? 'active-nav-btn' : ''}`}>
              View History
            </button>
            <button onClick={handleLogout} className="logout-btn analyze-btn">
              Logout
            </button>
          </div>
        )}
      </div>
      <p className="subtitle">Discover your ideal career path with AI</p>
    </header>
  );
};

export default Navbar;
