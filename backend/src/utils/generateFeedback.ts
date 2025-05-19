type SkillCategories = 'languages' | 'software' | 'communication' | 'backend' | 'frontend';

const REQUIRED_SKILLS: Record<SkillCategories, string[]> = {
    languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Ruby'],
    software: ['Git', 'Docker', 'Jira', 'Figma', 'Photoshop', 'VSCode', 'Postman', 'Excel'],
    communication: ['communication', 'leadership', 'teamwork', 'public speaking', 'collaboration', 'adaptability', 'problem solving'],
    backend: ['Node.js', 'Express', 'Django', 'Flask', 'PostgreSQL', 'MongoDB', 'REST API', 'GraphQL', 'SQL'],
    frontend: ['React', 'Redux', 'HTML', 'CSS', 'Vue.js', 'Angular', 'Next.js', 'Tailwind', 'Bootstrap']
};

const generateFeedback = (
    extracted: Record<SkillCategories, string[]>,
    required: Record<SkillCategories, string[]>
    ) => {
        const feedback: Record<SkillCategories, { matched: string[], missing: string[], suggestion: string }> = {
        languages: { matched: [], missing: [], suggestion: '' },
        software: { matched: [], missing: [], suggestion: '' },
        communication: { matched: [], missing: [], suggestion: '' },
        backend: { matched: [], missing: [], suggestion: '' },
        frontend: { matched: [], missing: [], suggestion: '' }
        };

        for (const category of Object.keys(required) as SkillCategories[]) {
            const matched = extracted[category];
            const missing = required[category].filter(skill => !matched.includes(skill));
            feedback[category].matched = matched;
            feedback[category].missing = missing;
            feedback[category].suggestion =
                missing.length > 0
                ? `Consider improving your ${category} by adding: ${missing.join(', ')}.`
                : `Great job! All expected ${category} skills are present.`;
        }

        return feedback;
};