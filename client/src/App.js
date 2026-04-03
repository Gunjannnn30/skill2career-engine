import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import './index.css';
import InputSection from './components/InputSection';
import RoleCard from './components/RoleCard';
import Login from './components/Login';
import Register from './components/Register';
import HistoryView from './components/HistoryView';
import Navbar from './components/Navbar';
import AILoading from './components/AILoading';
import GoalPlanner from './components/GoalPlanner';
import CareerPlanView from './components/CareerPlanView';
import API_BASE_URL from './config';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [view, setView] = useState(token ? 'main' : 'login'); 
  
  const [inputText, setInputText] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setView('login');
    setResponseData(null);
    setInputText('');
  };

  const saveAnalysis = async (input, result) => {
    if (!token) return;
    try {
      await fetch(`${API_BASE_URL}/api/user/save-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ input, result })
      });
    } catch (err) {
      console.error('Failed to save analysis:', err);
    }
  };

  const handleDownloadPDF = () => {
    if (!responseData) return;
    
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(22);
    doc.setTextColor(30, 30, 30);
    doc.text("Skill-to-Career Roadmap", 15, 20);
    
    // Skills
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    const skillsText = `Detected Skills: ${(responseData.skills || []).join(', ')}`;
    const splitSkills = doc.splitTextToSize(skillsText, 180);
    doc.text(splitSkills, 15, 30);
    
    let yPos = 35 + (splitSkills.length * 6);
    
    if (responseData.roles && responseData.roles.length > 0) {
      responseData.roles.forEach((role, idx) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFontSize(16);
        doc.setTextColor(16, 185, 129); // primary green
        doc.text(`Role ${idx + 1}: ${role.role} (Match: ${role.match}%)`, 15, yPos);
        yPos += 8;
        
        doc.setFontSize(11);
        doc.setTextColor(220, 38, 38); // danger red
        doc.text(`Missing Skills: ${(role.missingSkills || []).join(', ') || 'None!'}`, 15, yPos);
        yPos += 8;
        
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);
        doc.text("Learning Roadmap Steps:", 15, yPos);
        yPos += 7;
        
        doc.setFontSize(11);
        doc.setTextColor(80, 80, 80);
        (role.roadmap || []).forEach(step => {
            if (yPos > 280) {
              doc.addPage();
              yPos = 20;
            }
            const lines = doc.splitTextToSize(`• ${step}`, 175);
            doc.text(lines, 20, yPos);
            yPos += (6 * lines.length);
        });
        
        yPos += 10;
      });
    }

    doc.save("career_roadmap.pdf");
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    setError('');
    setResponseData(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || "Something went wrong");
      }
      setResponseData(data);
      
      if (token) {
        await saveAnalysis(inputText, data);
      }
      
    } catch (err) {
      console.error("ERROR:", err);
      setError(err.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar 
        token={token} 
        view={view} 
        setView={setView} 
        handleLogout={handleLogout} 
      />

      <main className="main-content">
        {!token && view === 'login' && <Login setToken={setToken} setView={setView} />}
        {!token && view === 'register' && <Register setToken={setToken} setView={setView} />}

        {token && view === 'history' && <HistoryView token={token} setView={setView} />}
        {token && view === 'careerPlan' && <CareerPlanView token={token} setView={setView} />}

        {token && view === 'main' && (
          <>
            <InputSection 
              inputText={inputText}
              setInputText={setInputText}
              loading={loading}
              handleAnalyze={handleAnalyze}
              handleUpload={async (file) => {
                setLoading(true);
                setError('');
                setResponseData(null);

                const formData = new FormData();
                formData.append('file', file);

                try {
                  const response = await fetch(`${API_BASE_URL}/api/ai/upload-resume`, {
                    method: 'POST',
                    body: formData,
                  });

                  const data = await response.json();
                  if (!response.ok) {
                    throw new Error(data.error || data.message || "Something went wrong");
                  }
                  const resultData = data.success ? data.data : data;
                  setResponseData(resultData);
                  
                  if (token) {
                    await saveAnalysis(`Resume Upload: ${file.name}`, resultData);
                  }
                  
                } catch (err) {
                  console.error("ERROR:", err);
                  setError(err.message || JSON.stringify(err));
                } finally {
                  setLoading(false);
                }
              }}
            />

            {error && !loading && <div className="error-message">Oops! {error}</div>}

            {loading && <AILoading />}

            {responseData && !loading && (
              <section className="results-section fade-in">
                <div className="summary-banner">
                  <div className="summary-item">
                    <span className="label">Skills Detected:</span>
                    <div className="skills-tags">
                      {responseData.skills && responseData.skills.length > 0 
                        ? responseData.skills.map(skill => <span key={skill} className="tag skill-tag">{skill}</span>)
                        : <span className="tag missing-tag">None</span>}
                    </div>
                  </div>
                </div>

                <div className="role-divider" style={{ margin: '40px 0' }}></div>

                <h2 className="section-title">Recommended Roles</h2>
                {responseData.roles && responseData.roles.length > 0 ? (
                  <div className="roles-grid">
                    {responseData.roles.map((roleObj, idx) => (
                      <RoleCard key={idx} roleObj={roleObj} />
                    ))}
                  </div>
                ) : (
                  <p className="no-roles">No roles matched your current skills. Try analyzing with core programming concepts!</p>
                )}

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                  <button onClick={handleDownloadPDF} className="analyze-btn" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '15px 30px', fontSize: '1.1rem', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}>
                    Download Roadmap as PDF
                  </button>
                </div>

                <div className="role-divider" style={{ margin: '40px 0' }}></div>
              </section>
            )}
          </>
        )}

        {token && view === 'goal' && (
            <GoalPlanner currentSkills={responseData?.skills || []} token={token} setView={setView} />
        )}
      </main>
    </div>
  );
}

export default App;
