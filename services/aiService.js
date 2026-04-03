const skillKeywords = {
    'javascript': ['javascript', 'js'],
    'nodejs': ['nodejs', 'node', 'node.js'],
    'dsa': ['dsa', 'data structures', 'algorithms'],
    'react': ['react', 'reactjs'],
    'vue': ['vue', 'vuejs'],
    'typescript': ['typescript', 'ts'],
    'cpp': ['c++', 'cpp'],
    'csharp': ['c#', 'csharp'],
    'java': ['java'],
    'python': ['python'],
    'c': [' c ', 'c language'], 
    'ruby': ['ruby'],
    'php': ['php'],
    'swift': ['swift'],
    'kotlin': ['kotlin'],
    'go': ['golang', ' go '], 
    'rust': ['rust'],
    'angular': ['angular'],
    'html': ['html'],
    'css': ['css'],
    'sql': ['sql'],
    'mysql': ['mysql'],
    'postgresql': ['postgresql', 'postgres'],
    'mongodb': ['mongodb', 'mongo'],
    'redis': ['redis'],
    'firebase': ['firebase'],
    'aws': ['aws'],
    'azure': ['azure'],
    'gcp': ['gcp'],
    'docker': ['docker'],
    'kubernetes': ['kubernetes', 'k8s'],
    'machine learning': ['machine learning', ' ml '],
    'ai': [' ai ', 'artificial intelligence']
};

const analyzeText = (text) => {
    if (!text || typeof text !== 'string') {
        return { skills: [], projects: 0 };
    }

    const input = text.toLowerCase();
    const extractedSkills = new Set();

    // 1. Detect skills using simple string matching
    for (const [skill, keywords] of Object.entries(skillKeywords)) {
        for (const keyword of keywords) {
            if (input.includes(keyword)) {
                extractedSkills.add(skill);
                break; // Skill identified, move to the next skill category
            }
        }
    }

    // 2. Extract project count using safe regex
    let projectsCount = 0;
    const match = text.match(/\d+/);
    if (match) {
        projectsCount = parseInt(match[0], 10);
    }

    // 3. Return structured object
    return {
        skills: Array.from(extractedSkills),
        projects: projectsCount
    };
};

const generateAIResponse = async (text) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
        throw { statusCode: 500, data: { error: "OpenRouter API key missing" } };
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://skill2career-frontend.vercel.app/",
            "X-Title": "Skill2Career AI Engine"
        },
        body: JSON.stringify({
            model: "mistralai/mistral-7b-instruct",
            messages: [
                {
                    role: "user",
                    content: `Analyze this resume and user skills. Suggest MULTIPLE relevant career roles.

Input: ${text}

IMPORTANT RULES:
* Return ONLY valid JSON
* DO NOT return explanations
* DO NOT return markdown

Return format:
{
"skills": ["skill1", "skill2"],
"roles": [
{
"role": "Data Analyst",
"match": 80,
"missingSkills": ["python", "sql"],
"roadmap": [
"Learn python basics"
]
}
]
}

CRITICAL INSTRUCTIONS:
1. Generate AT LEAST 3-5 DIFFERENT roles.
2. STRICT MATCH SCORING: You MUST be ruthlessly authentic with the "match" score.
3. Return clean JSON ONLY`
                }
            ]
        })
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("OpenRouter error:", data);
        const errMsg = (data.error && data.error.message) ? data.error.message : (data.error || "Unauthorized");
        throw { statusCode: response.status || 401, message: errMsg };
    }
    let content = data.choices[0].message.content;
    
    // Clean potential markdown blocks
    const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) {
        content = match[1].trim();
    } else {
        // Fallback: sometimes the AI returns JSON without markdown but with text before/after.
        const firstBrace = content.indexOf('{');
        const lastBrace = content.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
            content = content.substring(firstBrace, lastBrace + 1);
        }
    }

    const parsed = JSON.parse(content);

    parsed.roles = (parsed.roles || []).map(r => ({
        role: r.role || "General Software Role",
        match: r.match || 50,
        missingSkills: Array.isArray(r.missingSkills) ? r.missingSkills : [],
        roadmap: Array.isArray(r.roadmap) ? r.roadmap : []
    }));

    parsed.roles = parsed.roles.slice(0, 5);

    return parsed;
};

const getCareerInsights = async (roleName) => {
    let wikiExtract = "Detailed information currently unavailable.";
    try {
        const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(roleName)}`);
        if (wikiRes.ok) {
            const wikiData = await wikiRes.json();
            if (wikiData.extract) {
                wikiExtract = wikiData.extract;
            }
        }
    } catch (err) {
        console.warn('Wikipedia API fetch failed:', err.message);
    }

    try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey || apiKey === 'your_api_key_here') throw new Error('AI API KEY missing');

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://skill2career-frontend.vercel.app/",
                "X-Title": "Skill2Career AI Engine"
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert career advisor. Return ONLY valid JSON."
                    },
                    {
                        role: "user",
                        content: `Analyze this career role: "${roleName}". Context: "${wikiExtract}".
Return JSON ONLY matching this exact structure:
{
  "summary": "Brief 2-3 sentence overview of the role.",
  "responsibilities": ["Responsibility 1", "Responsibility 2"],
  "outlook": "Brief statement on job market and future outlook.",
  "companies": ["Company 1", "Company 2", "Company 3"],
  "averagePackage": "Typical salary range (e.g., $90k - $150k)",
  "skills": ["Required Skill 1", "Required Skill 2", "Required Skill 3"],
  "top1PercentPortfolio": "What exactly does a top 1% portfolio/resume look like for this field?",
  "projects": [
      { "name": "Example Project 1", "description": "What they should build and why" },
      { "name": "Example Project 2", "description": "What they should build and why" }
  ]
}`
                    }
                ]
            })
        });

        if (!response.ok) {
            let errMsg = `AI API failed: ${response.statusText}`;
            try { 
                const errData = await response.json(); 
                errMsg = errData.error?.message || errData.error || errMsg;
            } catch(e) {}
            throw new Error(errMsg);
        }
        
        const data = await response.json();
        let content = data.choices[0].message.content;
        const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (match) {
            content = match[1].trim();
        } else {
            const firstBrace = content.indexOf('{');
            const lastBrace = content.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
                content = content.substring(firstBrace, lastBrace + 1);
            }
        }

        const parsed = JSON.parse(content);
        return {
            summary: parsed.summary || wikiExtract,
            responsibilities: parsed.responsibilities || ["Analyze data", "Build solutions", "Team collaboration"],
            outlook: parsed.outlook || "Positive growth expected.",
            companies: parsed.companies || ["Tech Giants", "Top Startups"],
            averagePackage: parsed.averagePackage || "Data Unavailable",
            skills: parsed.skills || ["Communication", "Problem Solving", "Core Tech Stack"],
            top1PercentPortfolio: parsed.top1PercentPortfolio || "A strong portfolio highlighting scalable architectures, proven metrics, and clean structural code patterns.",
            projects: parsed.projects || [
                { name: "Full-Stack Dashboard", description: "Build a data-driven UI processing analytical backend layers." }
            ],
            aiEnhanced: true
        };

    } catch (err) {
        console.warn('AI Insights failed, utilizing graceful static fallback layout:', err.message);
        return {
            summary: wikiExtract,
            responsibilities: [
                "Understand core business and technical requirements",
                "Develop, maintain, and secure robust structural components",
                "Collaborate actively with cross-functional teams"
            ],
            outlook: "The modern digital economy generally shows strong continued baseline growth.",
            companies: ["Global Enterprises", "High-growth Startups", "Remote First Agencies"],
            averagePackage: "Industry Standard Varies",
            skills: ["Technical Literacy", "System Design", "Agile Execution"],
            top1PercentPortfolio: "Top tier candidates demonstrate deep analytical capabilities alongside shipped multi-user applications, avoiding shallow standalone tutorials.",
            projects: [
                { name: "Industry API Integration", description: "Connect multiple external data layers resolving into a unified functional interface." },
                { name: "Scalable Database Schema", description: "Architect a robust foundation supporting complex relation logic scaling under heavy bounds." }
            ],
            aiEnhanced: false
        };
    }
};

const generateGoalRoadmap = async (goal, timeline, currentSkills, projectsDone) => {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey || apiKey === 'your_api_key_here') throw new Error('AI API KEY missing');

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://skill2career-frontend.vercel.app/",
                "X-Title": "Skill2Career AI Engine"
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert technical career strategist."
                    },
                    {
                        role: "user",
                        content: `Generate an intensely detailed, high-level timeline-based career roadmap explicitly grounded in real-world, modern industry demands.
User Goal: "${goal}"
Available Timeline: "${timeline}"
Current Skills: [${currentSkills.join(', ')}]
Projects Built So Far: [${projectsDone.join(', ')}]

Rules:
- Return ONLY valid JSON.
- EXHAUSTIVE SKILL GAP: You must list EVERY SINGLE missing skill (both fundamental and advanced) required for the target role comparing against the user's current skills. Do not omit any core competency. Find them all.
- Split the roadmap strictly into phases based on the timeline length.
- Identify at least 3 verified, well-known, legitimate tech/enterprise companies currently actively hiring similar roles.
- MANDATORY 5 PROJECTS: You MUST provide EXACTLY 5 actionable, major project concepts. Not 2, not 3. Exactly 5.
- PROJECT STRUCTURE: Use easy, simple language. For each project, you must provide: "name", "description" (a very easy to understand overview), "purpose" (tell the user EXACTLY what this project will do, in easy language without intense jargon), and "techStack" (an array of specific languages, frameworks, or tools the user must use).
- DEEP DESCRIPTION: Inside the "roadmap" array, the "focus" arrays must NOT be short generic bullet points. Every "focus" item MUST be extremely descriptive, highlighting exactly how to master the real-world skills required in deep detail.

Return Format EXACTLY like this:
{
  "matchScore": 40,
  "missingSkills": ["Node.js", "Docker", "Event-Driven Architecture", "System Design", "Kubernetes", "Redis", "TypeScript"],
  "companiesHiring": ["Company A", "Company B", "Company C"],
  "recommendedProjects": [
    { 
      "name": "Live Chat Application", 
      "description": "A real-time messaging app where multiple users can talk in rooms.", 
      "purpose": "This project will exactly teach you how real-time data flows work. It forces you to handle live data updates without refreshing the page, which is a critical skill for modern apps.",
      "techStack": ["React", "Node.js", "Socket.io", "MongoDB"]
    }
  ],
  "roadmap": [
    { "phase": "Month 1-2: Advanced Fundamentals", "focus": ["Mastering low-level runtime execution inside Node.js, focusing specifically on V8 memory profiling and garbage collection loops."] }
  ]
}`
                    }
                ]
            })
        });

        if (!response.ok) {
            let errMsg = `AI API failed: ${response.statusText}`;
            try { 
                const errData = await response.json(); 
                errMsg = errData.error?.message || errData.error || errMsg;
            } catch(e) {}
            throw new Error(errMsg);
        }
        
        const data = await response.json();
        let content = data.choices[0].message.content;
        const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (match) {
            content = match[1].trim();
        } else {
            const firstBrace = content.indexOf('{');
            const lastBrace = content.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
                content = content.substring(firstBrace, lastBrace + 1);
            }
        }

        const parsed = JSON.parse(content);
        
        let finalScore = parsed.matchScore || 50;
        const missing = parsed.missingSkills || [];
        
        // ----------------------------------------------------
        // EXTREMELY STRICT SCORE ENFORCEMENT (User Requested)
        // ----------------------------------------------------
        if (currentSkills.length === 0 && projectsDone.length === 0) {
             finalScore = 0; // Absolute zero if no skills.
        } else {
             const totalSkillsNeeded = currentSkills.length + missing.length;
             let exactMathScore = totalSkillsNeeded > 0 ? Math.floor((currentSkills.length / totalSkillsNeeded) * 100) : 100;
             
             // Small boost if they've built projects logically mapping architectures
             if (projectsDone.length > 0) exactMathScore += 10;
             if (exactMathScore > 100) exactMathScore = 100;
             
             // Force override if AI's generated score is inflated
             if (finalScore > exactMathScore + 10) {
                 finalScore = exactMathScore;
             }
        }
        
        return {
            matchScore: finalScore,
            missingSkills: missing.length > 0 ? missing : ["Advanced System Design", "Modern Tooling"],
            companiesHiring: parsed.companiesHiring || ["Tech Startups", "Remote SaaS"],
            recommendedProjects: parsed.recommendedProjects || [
                { 
                    name: "Gap Filler App", 
                    description: "An easy to build practical application.",
                    purpose: "This will teach you how to build a full stack interface.",
                    techStack: ["React", "Node.js"]
                }
            ],
            roadmap: parsed.roadmap || [
                { phase: "Phase 1", focus: ["Establish core fundamentals"] },
                { phase: "Phase 2", focus: ["Build interactive projects"] }
            ]
        };

    } catch (err) {
        console.warn('AI Goal Roadmap failed, utilizing static estimations:', err.message);
        return {
            matchScore: 35,
            missingSkills: ["Core Foundational Logic", "System Architecture", "Professional Tooling"],
            companiesHiring: ["Global Web Agencies", "Enterprise IT Connectors", "Fintech Pioneers"],
            recommendedProjects: [
                { 
                    name: "Serverless Analytics Engine", 
                    description: "A tool to track how many people click links on your website.",
                    purpose: "This explicitly shows you how to deploy code without managing your own servers, cutting costs and learning cloud architecture.",
                    techStack: ["AWS Lambda", "API Gateway", "DynamoDB"] 
                },
                { 
                    name: "Stateful Application Dashboard", 
                    description: "A user portal where people can log in and view their personal data safely.",
                    purpose: "This handles the exact login flows every company needs while teaching you secure database management.",
                    techStack: ["Next.js", "PostgreSQL", "Prisma"]
                }
            ],
            roadmap: [
                { phase: "Phase 1: Foundation", focus: ["Master core programming logic", "Understand base requirements"] },
                { phase: "Phase 2: Execution", focus: ["Build independent structural projects", "Deploy minimal viable products"] },
                { phase: "Phase 3: Refinement", focus: ["Study interview preparation", "Analyze system design basics"] }
            ]
        };
    }
};

module.exports = {
    analyzeText,
    generateAIResponse,
    getCareerInsights,
    generateGoalRoadmap
};
