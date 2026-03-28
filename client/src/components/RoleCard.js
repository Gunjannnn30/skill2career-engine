import React, { useState } from 'react';
import CareerModal from './CareerModal';

const RoleCard = ({ roleObj }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
    <div className="role-card-modern">
      <div className="role-card-header">
        <div className="role-title-wrapper">
          <h3 className="role-name">{roleObj.role}</h3>
          <span className="match-badge">
            <span style={{ fontWeight: 'bold', marginRight: '5px' }}>Accuracy:</span> {roleObj.match}%
          </span>
        </div>
      </div>
      
      <div className="role-divider"></div>
      
      <div className="role-body">
        {roleObj.missingSkills && roleObj.missingSkills.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h4 className="section-subtitle">Skills to Acquire</h4>
            <div className="skills-tags">
              {roleObj.missingSkills.map(skill => (
                <span key={skill} className="tag missing-tag">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {roleObj.roadmap && roleObj.roadmap.length > 0 && (
          <div>
            <h4 className="section-subtitle">Your Learning Path</h4>
            <div className="roadmap-timeline">
              {roleObj.roadmap.map((step, i) => (
                <div key={i} className="timeline-step">
                  <div className="timeline-marker">{i + 1}</div>
                  <div className="timeline-content">{step}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: 'auto' }}>
        <button className="action-btn" onClick={() => setShowModal(true)}>View Full Career Details</button>
      </div>
    </div>
    
    {showModal && <CareerModal roleName={roleObj.role} onClose={() => setShowModal(false)} />}
    </>
  );
};

export default RoleCard;
