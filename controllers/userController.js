const userService = require('../services/userService');

const getUserId = (user) => {
    if (!user) return null;
    return user._id ? user._id.toString() : user.id;
};

// @desc Save AI Analysis result to user history
// @route POST /api/user/save-analysis
const saveAnalysis = async (req, res) => {
    try {
        const { input, result } = req.body;

        if (!input || !result) {
            return res.status(400).json({
                success: false,
                error: "Missing input or result",
                message: "Missing input or result payload"
            });
        }

        const userId = getUserId(req.user);
        if (!userId) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }

        await userService.addHistory(userId, input, result);
        return res.status(200).json({
            success: true,
            message: "Analysis saved successfully!"
        });
    } catch (error) {
        console.error("SAVE ANALYSIS ERROR:", error);
        return res.status(500).json({
            success: false,
            error: "Server error",
            message: error.message || "Failed to save analysis"
        });
    }
};

// @desc Get User History
// @route GET /api/user/history
const getHistory = async (req, res) => {
    try {
        const userId = getUserId(req.user);
        if (!userId) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }

        const sortedHistory = await userService.getHistory(userId);
        return res.status(200).json(sortedHistory);
    } catch(error) {
        console.error("GET HISTORY ERROR:", error);
        return res.status(500).json({
            success: false,
            error: "Server error",
            message: error.message || "Failed to fetch history"
        });
    }
};

// @desc Get active career profile
// @route GET /api/user/career-profile
const getCareerProfile = async (req, res) => {
    try {
        const userId = getUserId(req.user);
        if (!userId) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }

        const profile = await userService.getCareerProfile(userId);
        return res.status(200).json(profile || null);
    } catch (error) {
        console.error("GET PROFILE ERROR:", error);
        return res.status(500).json({
            success: false,
            error: "Server error",
            message: error.message || "Failed to fetch career profile"
        });
    }
};

// @desc Save active career profile (overwrites previous)
// @route POST /api/user/career-profile
const saveCareerProfile = async (req, res) => {
    try {
        const {
            goal,
            timeline,
            matchScore,
            currentSkills,
            missingSkills,
            targetSkills,
            roadmap,
            companiesHiring,
            recommendedProjects,
            projectsDone
        } = req.body;

        if (!goal || !timeline) {
            return res.status(400).json({
                success: false,
                error: "Missing goal or timeline",
                message: "Goal and timeline are required"
            });
        }

        const userId = getUserId(req.user);
        if (!userId) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }

        const resolvedTargetSkills = missingSkills || targetSkills || [];

        const updatedProfile = await userService.saveCareerProfile(userId, {
            goal,
            timeline,
            matchScore: matchScore || 0,
            currentSkills: currentSkills || [],
            missingSkills: resolvedTargetSkills,
            targetSkills: resolvedTargetSkills,
            projectsDone: projectsDone || [],
            companiesHiring: companiesHiring || [],
            recommendedProjects: recommendedProjects || [],
            roadmap: roadmap || []
        });

        // Ensure returned object includes both targetSkills and missingSkills for frontend compatibility
        const responseData = {
            ...updatedProfile,
            targetSkills: resolvedTargetSkills,
            missingSkills: resolvedTargetSkills
        };

        return res.status(200).json({
            success: true,
            message: "Career Profile updated securely",
            data: responseData
        });
    } catch (error) {
        console.error("SAVE PROFILE ERROR:", error);
        return res.status(500).json({
            success: false,
            error: "Server error",
            message: error.message || "Failed to save career profile"
        });
    }
};

module.exports = {
    saveAnalysis,
    getHistory,
    getCareerProfile,
    saveCareerProfile
};
