import React, { useState } from 'react';
import { Lock, Code, CheckCircle, Search } from 'lucide-react';

const InputSection = ({ inputText, setInputText, loading, handleAnalyze, handleUpload, responseData, isGuest, setView }) => {
  const [file, setFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const commonSkills = ["React", "Node.js", "Python", "Java", "SQL", "AWS", "Docker", "TypeScript"];

  const handleChipClick = (skill) => {
    if (!inputText.toLowerCase().includes(skill.toLowerCase())) {
        const newText = inputText ? `${inputText}, ${skill}` : skill;
        setInputText(newText);
        setErrorMsg('');
    }
  };

  const onAnalyzeClick = () => {
    if (!inputText.trim()) {
        setErrorMsg('Please enter some skills or experience before analyzing.');
        return;
    }
    setErrorMsg('');
    handleAnalyze();
  };

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const onUploadClick = () => {
    if (file) {
      handleUpload(file);
    }
  };

  return (
    <section className="input-section" style={{ padding: 0, background: 'transparent', border: 'none', boxShadow: 'none' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', width: '100%' }}>
        
        {/* Text Analysis Column */}
        <div className="form-container" style={{ margin: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 15px 0', color: 'var(--text-main)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code size={20} color="var(--primary)" /> 1. Text Analysis
          </h3>
          
          <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <textarea
              className="skill-input"
              placeholder="e.g. I know Java, React, and built 2 full-stack projects..."
              value={inputText}
              onChange={(e) => {
                  setInputText(e.target.value);
                  if (e.target.value.trim()) setErrorMsg('');
              }}
              disabled={loading}
              style={{ minHeight: '200px', flex: 1, fontSize: '1.05rem', lineHeight: '1.5' }}
            />
          </div>

          <div style={{ margin: '15px 0', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Suggestions:</span>
              {commonSkills.map(skill => (
                  <button 
                    key={skill}
                    onClick={() => handleChipClick(skill)}
                    className="tag interactive-tag"
                    style={{ background: 'var(--surface-hover)', border: '1px solid var(--surface-border)', color: 'var(--text-main)', fontSize: '0.85rem', padding: '4px 10px', borderRadius: '16px', cursor: 'pointer' }}
                  >
                    + {skill}
                  </button>
              ))}
          </div>

          {errorMsg && <div style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '10px' }}>{errorMsg}</div>}

          <button 
            className="analyze-btn" 
            onClick={onAnalyzeClick}
            disabled={loading}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', fontSize: '1.1rem', marginTop: 'auto' }}
          >
            {loading ? <><div className="spinner"></div> Analyzing...</> : <><Search size={20} /> Analyze Skills</>}
          </button>
        </div>

        {/* Resume Upload Column */}
        <div className="form-container" style={{ margin: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={20} color="var(--primary)" /> 2. Resume Upload (PDF)
          </h3>
          
          {isGuest ? (
            <div className="guest-banner" style={{ padding: '30px', border: '1px dashed #cbd5e1', background: 'var(--surface-hover)', boxShadow: 'none', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={32} style={{ color: 'var(--text-muted)', marginBottom: '15px' }} />
              <h4 style={{ color: 'var(--text-main)', marginBottom: '10px' }}>Resume Upload Locked</h4>
              <p style={{ color: 'var(--text-muted)', marginBottom: '15px' }}>Guest users can only use manual text analysis. Log in to unlock PDF processing.</p>
              <button onClick={() => setView('login')} className="btn-outline">Login / Register</button>
            </div>
          ) : (
            <>
              <div className="custom-file-upload" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--surface-border)', borderRadius: '12px', padding: '40px 20px', background: 'var(--surface-hover)', marginBottom: '20px' }}>
                 <label className="file-upload-lbl" style={{ padding: '12px 24px', fontSize: '1.05rem', background: 'var(--surface)', border: '1px solid var(--surface-border)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    Choose PDF File
                    <input 
                      type="file" 
                      accept="application/pdf"
                      onChange={onFileChange}
                      disabled={loading}
                      style={{ display: 'none' }}
                    />
                 </label>
                 <span className="file-name-display" style={{ marginTop: '15px', fontWeight: '500' }}>{file ? file.name : 'No file chosen'}</span>
              </div>
              
              <button 
                className="analyze-btn" 
                onClick={onUploadClick}
                disabled={loading || !file}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', fontSize: '1.1rem', marginTop: 'auto', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}
              >
                {loading ? <><div className="spinner"></div> Analyzing PDF...</> : 'Upload & Analyze Resume'}
              </button>
            </>
          )}
        </div>

      </div>

      {responseData && responseData.extractedText && (
        <div className="resume-preview-container fade-in" style={{ marginTop: '30px' }}>
          <div className="resume-preview-header">Extracted Resume Content</div>
          <div className="resume-preview-content">
            {responseData.extractedText}
          </div>
        </div>
      )}
    </section>
  );
};

export default InputSection;
