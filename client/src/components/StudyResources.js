import React from 'react';
import { BookOpen, Video, Book } from 'lucide-react';
import { getSkillUrl } from '../utils/skillDictionary';

const StudyResources = ({ skills }) => {
    // Return early if no skills are tracked
    if (!skills || skills.length === 0) {
        return null;
    }

    return (
        <div className="study-resources-container fade-in">
            <div className="role-divider" style={{ margin: '30px 0' }}></div>
            <h3 className="section-title" style={{ fontSize: '1.4rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BookOpen size={24} color="var(--primary)" /> Recommended Study Resources
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                Curated jumping-off points to help you rapidly acquire the missing skills for this role.
            </p>
            
            <div className="resources-grid">
                {skills.map((skill, index) => {
                    const url = getSkillUrl(skill);
                    const isFallback = url.includes('youtube.com');
                    
                    return (
                        <a 
                            key={index} 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="resource-card"
                        >
                            <div className="resource-header">
                                <span className="resource-icon" style={{ color: 'var(--text-muted)' }}>
                                    {isFallback ? <Video size={18} /> : <Book size={18} />}
                                </span>
                                <span className="resource-skill">{skill}</span>
                            </div>
                            <div className="resource-action">
                                {isFallback ? 'Search Video Tutorials' : 'Read Official Guide'} &rarr;
                            </div>
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

export default StudyResources;
