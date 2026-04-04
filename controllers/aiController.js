const { analyzeText, generateAIResponse, getCareerInsights, generateGoalRoadmap } = require('../services/aiService');
const { matchRoles } = require('../services/roleService');

// @desc    Analyze text to extract skills and projects count
// @route   POST /api/ai/analyze
const analyze = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: 'Please provide text for analysis' });
        }

        try {
            // Attempt AI Analysis First
            const aiData = await generateAIResponse(text);

            const formattedRoles = (aiData.roles || []).map(role => ({
                role: role.role || 'Unknown Role',
                match: role.match || 0,
                missingSkills: [...(role.missingSkills || [])],
                roadmap: [...(role.roadmap || [])]
            }));

            return res.json({
                skills: aiData.skills || [],
                projects: aiData.projects || 0,
                roles: formattedRoles
            });
            
        } catch (apiError) {
            console.warn('AI API logic failed, falling back to static internal rule engine:', apiError.message);

            // Fallback Static Local Engine
            const parsed = analyzeText(text);
            const roles = matchRoles(parsed.skills);

            const formattedRoles = roles.map(role => ({
                role: role.role,
                match: role.match,
                missingSkills: [...(role.missingSkills || [])],
                roadmap: [...(role.roadmap || [])]
            }));

            return res.json({
                skills: parsed.skills,
                projects: parsed.projects,
                roles: formattedRoles
            });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Server error', message: error.message });
    }
};

const pdfParse = require('pdf-parse');

// @desc    Upload & analyze resume PDF
// @route   POST /api/ai/upload-resume
const uploadResumeController = async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
        if (!apiKey || apiKey === 'your_api_key_here') {
            return res.status(500).json({ error: "Gemini API key missing" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const data = await pdfParse(req.file.buffer);
        const extractedText = data.text;

        if (!extractedText || extractedText.trim().length === 0) {
            return res.status(400).json({
                message: "Could not extract text from PDF",
            });
        }

        // reuse existing logic
        try {
            const aiData = await generateAIResponse(extractedText);
            const formattedRoles = (aiData.roles || []).map(role => ({
                role: role.role || 'Unknown Role',
                match: role.match || 0,
                missingSkills: [...(role.missingSkills || [])],
                roadmap: [...(role.roadmap || [])]
            }));

            return res.json({
                result: {
                    skills: aiData.skills || [],
                    projects: aiData.projects || 0,
                    roles: formattedRoles
                }
            });
        } catch (apiError) {
            console.warn('AI API logic failed for Resume Upload, falling back to static internal rule engine:', apiError.message);

            // Fallback Static Local Engine
            const parsed = analyzeText(extractedText);
            const roles = matchRoles(parsed.skills);

            const formattedRoles = roles.map(role => ({
                role: role.role,
                match: role.match,
                missingSkills: [...(role.missingSkills || [])],
                roadmap: [...(role.roadmap || [])]
            }));

            return res.json({
                result: {
                    skills: parsed.skills,
                    projects: parsed.projects,
                    roles: formattedRoles
                }
            });
        }
    } catch (error) {
        console.error("PDF PARSE ERROR:", error);
        return res.status(500).json({
            error: error.message || "Resume parsing failed"
        });
    }
};

// @desc    Get detailed career insights via Wikipedia/AI
// @route   POST /api/ai/career-details
const careerDetailsController = async (req, res) => {
    try {
        const { role } = req.body;
        if (!role || typeof role !== 'string') {
            return res.status(400).json({ error: 'Please provide a valid career role' });
        }

        const details = await getCareerInsights(role);
        return res.json({ success: true, data: details });

    } catch (error) {
        console.error("CAREER DETAILS ERROR:", error);
        return res.status(500).json({
            message: "Failed to fetch career details",
            error: error.message,
        });
    }
};

// @desc    Generate Timeline-based Goal Roadmap
// @route   POST /api/ai/goal-analysis
const goalAnalysisController = async (req, res) => {
    console.log("--- GOAL ANALYSIS REQUEST RECEIVED ---");
    console.log("Incoming Body:", req.body);
    try {
        const { goal, timeline, currentSkills, projectsDone } = req.body;
        
        if (!goal || !timeline || !Array.isArray(currentSkills)) {
            console.warn("Invalid Input Parameters:", { goal, timeline, currentSkills });
            return res.status(400).json({ error: 'Please provide valid goal, timeline, and currentSkills array' });
        }

        const plan = await generateGoalRoadmap(goal, timeline, currentSkills, projectsDone || []);
        console.log("Goal Analysis Generated Successfully.");
        return res.json({ success: true, data: plan });

    } catch (error) {
        console.error("/// GOAL ANALYSIS FATAL ERROR ///");
        console.error(error);
        return res.status(500).json({
            error: "Goal analysis failed",
            message: error.message || "Internal server error"
        });
    }
};

module.exports = {
    analyze,
    uploadResumeController,
    careerDetailsController,
    goalAnalysisController
};
