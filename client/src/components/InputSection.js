import React, { useState } from 'react';

const InputSection = ({ inputText, setInputText, loading, handleAnalyze, handleUpload }) => {
  const [file, setFile] = useState(null);

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
    <section className="input-section">
      <div>
        <h3 style={{ margin: '0 0 10px 0', color: 'var(--text-main)', fontSize: '1.2rem'}}>1. Text Analysis</h3>
        <textarea
          className="skill-input"
          placeholder="Describe your skills, projects, experience..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={loading}
        />
        <button 
          className="analyze-btn" 
          onClick={handleAnalyze}
          disabled={loading || !inputText.trim()}
          style={{ width: '100%' }}
        >
          {loading ? <><div className="spinner"></div> Analyzing...</> : 'Analyze Text'}
        </button>

        <div className="divider-container">
           <div className="divider-line"></div>
           <span className="divider-text">OR</span>
           <div className="divider-line"></div>
        </div>

        <div>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2rem', color: '#fff' }}>2. Resume Upload (PDF)</h3>
          
          <div className="custom-file-upload">
             <label className="file-upload-lbl">
                Choose File
                <input 
                  type="file" 
                  accept="application/pdf"
                  onChange={onFileChange}
                  disabled={loading}
                  style={{ display: 'none' }}
                />
             </label>
             <span className="file-name-display">{file ? file.name : 'No file chosen'}</span>
          </div>
          
          <button 
            className="analyze-btn" 
            onClick={onUploadClick}
            disabled={loading || !file}
            style={{ alignSelf: 'flex-start', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)', width: '100%' }}
          >
            {loading ? <><div className="spinner"></div> Analyzing PDF...</> : 'Upload & Analyze Resume'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default InputSection;
