import React, { useState, useEffect } from 'react';

const AILoading = ({ messages = ["Analyzing your profile...", "Understanding your skills...", "Finding best career matches..."] }) => {
    const [msgIndex, setMsgIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    
    useEffect(() => {
        let currentString = messages[msgIndex] || "";
        
        if (charIndex < currentString.length) {
            const timeout = setTimeout(() => {
                setCharIndex(prev => prev + 1);
            }, 50); // Typing speed
            return () => clearTimeout(timeout);
        } else {
            // Wait before switching to next message
            const timeout = setTimeout(() => {
                setCharIndex(0);
                setMsgIndex(prev => (prev + 1) % messages.length);
            }, 2000); 
            return () => clearTimeout(timeout);
        }
    }, [charIndex, msgIndex, messages]);
    
    return (
        <div className="ai-loading-container fade-in">
            <div className="ai-pulse-ring"></div>
            <div className="ai-loading-wrapper">
                <h3 className="ai-loading-text">
                    {messages[msgIndex] ? messages[msgIndex].substring(0, charIndex) : ""}
                    <span className="cursor">|</span>
                </h3>
                <p className="ai-loading-subtext">AI is actively processing your request...</p>
            </div>
        </div>
    );
};

export default AILoading;
