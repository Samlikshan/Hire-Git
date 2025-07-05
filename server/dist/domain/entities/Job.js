"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
class Job {
    constructor(company, title, type, location, department, description, salary, experienceLevel, requirements, responsibilities, requiredSkills, tags, status, deadline, createdAt, updatedAt, deleted, _id) {
        this.company = company;
        this.title = title;
        this.type = type;
        this.location = location;
        this.department = department;
        this.description = description;
        this.salary = salary;
        this.experienceLevel = experienceLevel;
        this.requirements = requirements;
        this.responsibilities = responsibilities;
        this.requiredSkills = requiredSkills;
        this.tags = tags;
        this.status = status;
        this.deadline = deadline;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deleted = deleted;
        this._id = _id;
    }
}
exports.Job = Job;
