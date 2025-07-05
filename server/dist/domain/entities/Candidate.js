"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = exports.Candidate = void 0;
class Candidate {
    constructor(email, name, isVerified, profileCompleted, isBlocked, savedJobs, id, profession, bio, password, googleId, profileImage, projects, socialLinks, skills, resume, experience) {
        this.email = email;
        this.name = name;
        this.isVerified = isVerified;
        this.profileCompleted = profileCompleted;
        this.isBlocked = isBlocked;
        this.savedJobs = savedJobs;
        this.id = id;
        this.profession = profession;
        this.bio = bio;
        this.password = password;
        this.googleId = googleId;
        this.profileImage = profileImage;
        this.projects = projects;
        this.socialLinks = socialLinks;
        this.skills = skills;
        this.resume = resume;
        this.experience = experience;
    }
}
exports.Candidate = Candidate;
class Project {
    constructor(tile) {
        this.tile = tile;
    }
}
exports.Project = Project;
