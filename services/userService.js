const mongoose = require('mongoose');
const User = require('../models/User');

// In-memory fallback storage when MongoDB is not connected
const inMemoryUsers = new Map();

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * Generate a consistent user object representation
 */
const formatUser = (userDoc) => {
    if (!userDoc) return null;
    return {
        _id: userDoc._id ? userDoc._id.toString() : userDoc.id,
        id: userDoc._id ? userDoc._id.toString() : userDoc.id,
        name: userDoc.name,
        email: userDoc.email,
        password: userDoc.password,
        history: userDoc.history || [],
        careerProfile: userDoc.careerProfile || null,
        createdAt: userDoc.createdAt || new Date(),
        updatedAt: userDoc.updatedAt || new Date()
    };
};

/**
 * Find user by email (case-insensitive)
 */
const findUserByEmail = async (email) => {
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!normalizedEmail) return null;

    if (isDbConnected()) {
        try {
            const user = await User.findOne({ email: normalizedEmail });
            return user;
        } catch (err) {
            console.warn('[userService] MongoDB findOne failed, checking in-memory fallback:', err.message);
        }
    }

    // Check in-memory store
    for (const user of inMemoryUsers.values()) {
        if (user.email.toLowerCase() === normalizedEmail) {
            return user;
        }
    }
    return null;
};

/**
 * Find user by ID
 */
const findUserById = async (id) => {
    if (!id) return null;
    const idStr = id.toString();

    if (isDbConnected()) {
        try {
            const user = await User.findById(idStr);
            if (user) return user;
        } catch (err) {
            console.warn('[userService] MongoDB findById failed, checking in-memory fallback:', err.message);
        }
    }

    const memUser = inMemoryUsers.get(idStr);
    return memUser || null;
};

/**
 * Create a new user
 */
const createUser = async ({ name, email, password }) => {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const trimmedName = (name || '').trim();

    if (isDbConnected()) {
        try {
            const user = await User.create({
                name: trimmedName,
                email: normalizedEmail,
                password
            });
            return user;
        } catch (err) {
            console.warn('[userService] MongoDB User.create failed, falling back to in-memory store:', err.message);
        }
    }

    // Fallback: create in memory
    const newId = new mongoose.Types.ObjectId().toString();
    const newUser = {
        _id: newId,
        id: newId,
        name: trimmedName,
        email: normalizedEmail,
        password,
        history: [],
        careerProfile: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        save: async function() {
            inMemoryUsers.set(this._id, this);
            return this;
        }
    };

    inMemoryUsers.set(newId, newUser);
    console.log(`[userService] Registered user "${normalizedEmail}" in in-memory store (MongoDB offline).`);
    return newUser;
};

/**
 * Add analysis result to user history
 */
const addHistory = async (userId, input, result) => {
    const user = await findUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const historyItem = {
        input,
        result,
        createdAt: new Date()
    };

    if (isDbConnected() && typeof user.save === 'function' && user instanceof User) {
        if (!user.history) user.history = [];
        user.history.push(historyItem);
        await user.save();
        return user.history;
    }

    // In-memory or fallback update
    if (!user.history) user.history = [];
    user.history.push(historyItem);
    if (typeof user.save === 'function') {
        await user.save();
    } else {
        inMemoryUsers.set(user._id ? user._id.toString() : user.id, user);
    }
    return user.history;
};

/**
 * Get user history
 */
const getHistory = async (userId) => {
    const user = await findUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const history = user.history || [];
    return [...history].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

/**
 * Get career profile
 */
const getCareerProfile = async (userId) => {
    const user = await findUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user.careerProfile || null;
};

/**
 * Save career profile
 */
const saveCareerProfile = async (userId, profileData) => {
    const user = await findUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const updatedProfile = {
        goal: profileData.goal,
        timeline: profileData.timeline,
        matchScore: profileData.matchScore || 0,
        currentSkills: profileData.currentSkills || [],
        targetSkills: profileData.missingSkills || profileData.targetSkills || [],
        projectsDone: profileData.projectsDone || [],
        companiesHiring: profileData.companiesHiring || [],
        recommendedProjects: profileData.recommendedProjects || [],
        roadmap: profileData.roadmap || [],
        lastUpdated: new Date()
    };

    if (isDbConnected() && typeof user.save === 'function' && user instanceof User) {
        user.careerProfile = updatedProfile;
        await user.save();
        return user.careerProfile;
    }

    user.careerProfile = updatedProfile;
    if (typeof user.save === 'function') {
        await user.save();
    } else {
        inMemoryUsers.set(user._id ? user._id.toString() : user.id, user);
    }
    return updatedProfile;
};

module.exports = {
    isDbConnected,
    findUserByEmail,
    findUserById,
    createUser,
    addHistory,
    getHistory,
    getCareerProfile,
    saveCareerProfile,
    formatUser
};
