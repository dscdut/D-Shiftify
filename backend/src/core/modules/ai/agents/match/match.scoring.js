const deg2rad = deg => deg * (Math.PI / 180);

export const geoScore = (lat1, lon1, lat2, lon2) => {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return 0;
    const nLat1 = Number(lat1);
    const nLon1 = Number(lon1);
    const nLat2 = Number(lat2);
    const nLon2 = Number(lon2);

    if ([nLat1, nLon1, nLat2, nLon2].some(value => Number.isNaN(value))) return 0;

    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(nLat2 - nLat1);
    const dLon = deg2rad(nLon2 - nLon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(nLat1)) * Math.cos(deg2rad(nLat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km

    if (distance < 10) return 1;
    if (distance < 30) return 0.8;
    if (distance < 50) return 0.5;
    return 0.1;
};

export const atMatchScore = (needs = [], job) => {
    let s = 0;
    const env = (job.work_environment || '').toLowerCase();
    const workMode = (job.work_mode || '').toLowerCase();

    if (needs.includes('screen_reader')) {
        if (['nvda', 'jaws', 'screen_reader'].some(k => env.includes(k))) s += 0.5;
        else if (job.accessibility_level === 'AAA') s += 0.3;
        else if (job.accessibility_level === 'AA')  s += 0.15;
    }
    if (needs.includes('accessible_workspace') && ['remote', 'hybrid'].includes(workMode)) s += 0.5;
    if (needs.includes('flexible_hours') && ['remote', 'hybrid'].includes(workMode)) s += 0.3;
    if (needs.includes('voice_control') && job.is_remote) s += 0.3;
    if (job.accessibility_level === 'AAA') s += 0.2;
    else if (job.accessibility_level === 'AA') s += 0.1;

    if (needs.length > 0 && s === 0) return 0.3;

    return Math.min(s, 1);
};

const toSkillName = skill => {
    if (typeof skill === 'string') return skill;
    if (skill && typeof skill === 'object' && typeof skill.name === 'string') return skill.name;
    return '';
};

const normalizeSkills = skills => {
    if (!Array.isArray(skills)) return [];
    return skills.map(toSkillName).filter(Boolean);
};

export const skillScore = (candidate_skills = [], job_skills = [], semantic_score = 0) => {
    const normalizedJobSkills = normalizeSkills(job_skills);
    const normalizedCandidateSkills = normalizeSkills(candidate_skills);
    if (!normalizedJobSkills.length) return semantic_score;
    const jLower = normalizedJobSkills.map(s => s.toLowerCase());
    const exact = normalizedCandidateSkills.filter(s => jLower.includes(s.toLowerCase())).length;
    return Math.min(exact / normalizedJobSkills.length + semantic_score * 0.3, 1);
};

export const expScore = (experience = []) => {
    if (experience.length >= 3) return 1;
    if (experience.length >= 1) return 0.6;
    return 0.2;
};

export const hybridScore = (profile, job, semantic_score = 0, weights = null) => {
    const w = weights || { skill: 0.40, exp: 0.20, at: 0.25, geo: 0.15, culture_fit: 0 };

    const candidateSkills = profile.skills || [];

    const score =
    (w.skill || 0) * skillScore(candidateSkills, job.skills, semantic_score) +
    (w.exp || 0) * expScore(profile.experiences || []) +
    (w.at || 0) * atMatchScore(profile.accessibility_needs || [], job) +
    (w.geo || 0) * geoScore(profile.latitude, profile.longitude, job.latitude, job.longitude) +
    (w.culture_fit || 0) * semantic_score;

    return Math.round(score * 100);
};
