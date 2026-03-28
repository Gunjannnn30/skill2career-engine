const rolesConfig = [
    {
        role: "Backend Developer",
        skills: ["java", "nodejs", "dsa", "database"]
    },
    {
        role: "Frontend Developer",
        skills: ["html", "css", "javascript", "react"]
    },
    {
        role: "Full Stack Developer",
        skills: ["html", "css", "javascript", "nodejs", "react"]
    },
    {
        role: "Software Engineer",
        skills: ["java", "dsa", "system design"]
    }
];

const matchRoles = (userSkills) => {
    if (!userSkills || !Array.isArray(userSkills)) {
        return [];
    }

    const matchedRoles = [];
    const normalizedUserSkills = userSkills.map(s => s.toLowerCase().trim());

    // Iterate through pre-defined roles
    for (const roleObj of rolesConfig) {
        let matchCount = 0;
        const totalSkills = roleObj.skills.length;
        const missingSkills = [];

        // Check each required skill
        for (const reqSkill of roleObj.skills) {
            if (normalizedUserSkills.includes(reqSkill.toLowerCase().trim())) {
                matchCount++;
            } else {
                missingSkills.push(reqSkill);
            }
        }

        // Include roles with at least 1 matching skill
        if (matchCount > 0) {
            const matchPercentage = Math.round((matchCount / totalSkills) * 100);
            
            // Build roadmap
            const roadmap = [];
            for (const mSkill of missingSkills) {
                roadmap.push(`Learn ${mSkill} basics`);
                roadmap.push(`Build projects using ${mSkill}`);
            }
            roadmap.push("Build real-world projects");
            roadmap.push("Prepare for interviews");

            matchedRoles.push({
                role: roleObj.role,
                match: matchPercentage,
                missingSkills: missingSkills,
                roadmap: roadmap
            });
        }
    }

    // Sort roles in descending order of match %
    matchedRoles.sort((a, b) => b.match - a.match);

    return matchedRoles;
};

module.exports = {
    matchRoles
};
