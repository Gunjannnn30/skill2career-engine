const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    history: [
        {
            input: String,
            result: Object,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    careerProfile: {
        goal: String,
        timeline: String,
        matchScore: Number,
        currentSkills: [String],
        targetSkills: [String],
        projectsDone: [String],
        companiesHiring: [String],
        recommendedProjects: [
            {
                name: String,
                description: String,
                purpose: String,
                techStack: [String]
            }
        ],
        lastUpdated: Date,
        roadmap: [
            {
                phase: String,
                focus: [String]
            }
        ]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
