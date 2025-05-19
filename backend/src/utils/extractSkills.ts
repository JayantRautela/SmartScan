import keyword_extractor from 'keyword-extractor';

const SKILLS = {
    languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Ruby'],
    software: ['Git', 'Docker', 'Jira', 'Figma', 'Photoshop', 'VSCode', 'Postman', 'Excel'],
    communication: ['communication', 'leadership', 'teamwork', 'public speaking', 'collaboration', 'adaptability', 'problem solving'],
    backend: ['Node.js', 'Express', 'Django', 'Flask', 'PostgreSQL', 'MongoDB', 'REST API', 'GraphQL', 'SQL'],
    frontend: ['React', 'Redux', 'HTML', 'CSS', 'Vue.js', 'Angular', 'Next.js', 'Tailwind', 'Bootstrap']
};

export const extractSkills = (text: string) => {
    const keywords = keyword_extractor.extract(text, {
        language: 'english',
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true
    });

    const normalized = keywords.map(k => k.toLowerCase());

    const match = (list: string[]) =>
        list.filter(skill => normalized.includes(skill.toLowerCase()));

    return {
        languages: match(SKILLS.languages),
        software: match(SKILLS.software),
        communication: match(SKILLS.communication),
        backend: match(SKILLS.backend),
        frontend: match(SKILLS.frontend)
    };
};