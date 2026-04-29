import React, { useState, useEffect } from 'react';
import { BarChart2, Target, Map, Clock, LogOut, LogIn, Menu, X, ChevronLeft, ChevronRight, Brain } from 'lucide-react';
import '../index.css';

const Sidebar = ({ token, isGuest, view, setView, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false); // Mobile toggle
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop toggle

  // Automatically collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleNav = (v) => {
    setView(v);
    setIsOpen(false);
  };

  if (!token && !isGuest) return null;

  return (
    <>
      <button className="mobile-toggle-btn" onClick={toggleSidebar}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!isCollapsed && (
             <h2 className="sidebar-logo">Skill-to-Career <br/><span>AI Engine</span></h2>
          )}
          {isCollapsed && (
             <h2 
               className="sidebar-logo-collapsed" 
               title="Skill-to-Career AI Engine"
               style={{
                 width: '40px',
                 height: '40px',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 borderRadius: '8px',
                 margin: '0 auto',
                 cursor: 'help',
                 background: 'var(--surface-hover)'
               }}
             >
               <Brain size={24} color="var(--primary)" />
             </h2>
          )}
          <button className="collapse-btn" onClick={toggleCollapse}>
             {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`sidebar-link ${view === 'main' ? 'active' : ''}`} 
            onClick={() => handleNav('main')}
            title="Analyze Profile"
          >
            <BarChart2 size={20} />
            {!isCollapsed && <span>Analyze Profile</span>}
          </button>
          <button 
            className={`sidebar-link ${view === 'goal' ? 'active' : ''}`} 
            onClick={() => handleNav('goal')}
            title="Set Career Goal"
          >
            <Target size={20} />
            {!isCollapsed && <span>Set Career Goal</span>}
          </button>
          <button 
            className={`sidebar-link ${view === 'careerPlan' ? 'active' : ''}`} 
            onClick={() => handleNav('careerPlan')}
            title="My Career Plan"
          >
            <Map size={20} />
            {!isCollapsed && <span>My Career Plan</span>}
          </button>
          <button 
            className={`sidebar-link ${view === 'history' ? 'active' : ''}`} 
            onClick={() => handleNav('history')}
            title="View History"
          >
            <Clock size={20} />
            {!isCollapsed && <span>View History</span>}
          </button>
        </nav>

        <div className="sidebar-footer">
          {isGuest ? (
            <button className="sidebar-login" onClick={() => handleLogout()} title="Login">
              <LogIn size={20} />
              {!isCollapsed && <span>Login / Register</span>}
            </button>
          ) : (
            <button className="sidebar-logout" onClick={handleLogout} title="Logout">
              <LogOut size={20} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          )}
        </div>
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;
