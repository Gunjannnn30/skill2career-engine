export const skillDictionary = {
    'javascript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
    'js': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
    'nodejs': 'https://nodejs.org/en/learn',
    'node': 'https://nodejs.org/en/learn',
    'dsa': 'https://www.geeksforgeeks.org/data-structures/',
    'react': 'https://react.dev/learn',
    'reactjs': 'https://react.dev/learn',
    'vue': 'https://vuejs.org/guide/introduction.html',
    'typescript': 'https://www.typescriptlang.org/docs/',
    'ts': 'https://www.typescriptlang.org/docs/',
    'cpp': 'https://cplusplus.com/doc/tutorial/',
    'c++': 'https://cplusplus.com/doc/tutorial/',
    'csharp': 'https://learn.microsoft.com/en-us/dotnet/csharp/',
    'java': 'https://dev.java/learn/',
    'python': 'https://docs.python.org/3/tutorial/',
    'ruby': 'https://www.ruby-lang.org/en/documentation/',
    'php': 'https://www.php.net/manual/en/tutorial.php',
    'swift': 'https://docs.swift.org/swift-book/',
    'kotlin': 'https://kotlinlang.org/docs/home.html',
    'go': 'https://go.dev/doc/tutorial/getting-started',
    'golang': 'https://go.dev/doc/tutorial/getting-started',
    'rust': 'https://doc.rust-lang.org/book/',
    'angular': 'https://angular.dev/tutorials',
    'html': 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    'css': 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    'sql': 'https://www.w3schools.com/sql/',
    'mysql': 'https://dev.mysql.com/doc/mysql-getting-started/en/',
    'postgresql': 'https://www.postgresql.org/docs/current/tutorial.html',
    'mongodb': 'https://www.mongodb.com/docs/manual/tutorial/',
    'redis': 'https://redis.io/docs/',
    'firebase': 'https://firebase.google.com/docs',
    'aws': 'https://aws.amazon.com/getting-started/',
    'azure': 'https://learn.microsoft.com/en-us/azure/',
    'gcp': 'https://cloud.google.com/docs',
    'docker': 'https://docs.docker.com/get-started/',
    'kubernetes': 'https://kubernetes.io/docs/tutorials/',
    'machine learning': 'https://developers.google.com/machine-learning/crash-course',
    'ml': 'https://developers.google.com/machine-learning/crash-course',
    'ai': 'https://www.deeplearning.ai/courses/',
    'system design': 'https://github.com/donnemartin/system-design-primer',
    'git': 'https://git-scm.com/doc',
    'github': 'https://docs.github.com/en/get-started'
};

/**
 * Returns a verified learning URL for a given skill,
 * or dynamically builds a high-quality YouTube search for missing ones.
 */
export const getSkillUrl = (skillName) => {
    if (!skillName) return '#';
    
    // Normalize string to match exact dictionary keys
    const raw = skillName.toString().trim().toLowerCase();
    
    if (skillDictionary[raw]) {
        return skillDictionary[raw];
    }
    
    // Fallback: YouTube Search
    return `https://www.youtube.com/results?search_query=Learn+${encodeURIComponent(skillName)}`;
};
