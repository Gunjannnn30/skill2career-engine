import React from 'react';
import { Mail, Briefcase } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="app-footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3 className="footer-brand">Skill-to-Career <span>AI</span></h3>
                    <p className="footer-tagline">AI-powered career guidance platform. Map your skills to your dream role with actionable roadmaps.</p>
                </div>
                <div className="footer-section">
                    <h4>Features</h4>
                    <ul>
                        <li>AI Skill Analysis</li>
                        <li>Resume Processing</li>
                        <li>Goal Roadmaps</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Contact</h4>
                    <p className="footer-contact"><Mail size={16} /> support@skilltocareer.ai</p>
                    <p className="footer-contact" style={{ marginTop: '10px', color: 'var(--text-muted)' }}><Briefcase size={16} /> Built for learning & growth</p>
                </div>
            </div>
            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} Skill-to-Career AI Engine. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
