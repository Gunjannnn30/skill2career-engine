const User = require('../models/User');

// @desc Save AI Analysis result to user history
// @route POST /api/user/save-analysis
const saveAnalysis = async (req, res) => {
    try {
        const { input, result } = req.body;

        if (!input || !result) {
            return res.status(400).json({ error: "Missing input or result" });
        }

        const user = await User.findById(req.user._id);
        
        user.history.push({
            input,
            result
        });

        await user.save();

        return res.status(200).json({ message: "Analysis saved successfully!" });
    } catch (error) {
        return res.status(500).json({ error: "Server error", message: error.message });
    }
}

// @desc Get User History
// @route GET /api/user/history
const getHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
             return res.status(404).json({ error: "User not found" });
        }

        const sortedHistory = user.history.sort((a, b) => b.createdAt - a.createdAt);

        return res.status(200).json(sortedHistory);
    } catch(error) {
        return res.status(500).json({ error: "Server error", message: error.message });
    }
}

// @desc Get active career profile
// @route GET /api/user/career-profile
const getCareerProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ error: "User not found" });

        return res.status(200).json(user.careerProfile || null);
    } catch (error) {
        return res.status(500).json({ error: "Server error", message: error.message });
    }
}

// @desc Save active career profile (overwrites previous)
// @route POST /api/user/career-profile
const saveCareerProfile = async (req, res) => {
    try {
        const { goal, timeline, matchScore, currentSkills, missingSkills, roadmap, companiesHiring, recommendedProjects, projectsDone } = req.body;

        if (!goal || !timeline) {
            return res.status(400).json({ error: "Missing goal or timeline" });
        }

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.careerProfile = {
            goal,
            timeline,
            matchScore: matchScore || 0,
            currentSkills: currentSkills || [],
            targetSkills: missingSkills || [],
            projectsDone: projectsDone || [],
            companiesHiring: companiesHiring || [],
            recommendedProjects: recommendedProjects || [],
            roadmap: roadmap || [],
            lastUpdated: Date.now()
        };

        await user.save();
        return res.status(200).json({ message: "Career Profile updated securely", data: user.careerProfile });
    } catch (error) {
        return res.status(500).json({ error: "Server error", message: error.message });
    }
}

module.exports = { saveAnalysis, getHistory, getCareerProfile, saveCareerProfile };
