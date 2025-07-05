"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplication = void 0;
class JobApplication {
    constructor(candidate, job, firstName, lastName, email, phone, location, education, currentTitle, experience, expectedSalary, resume, status, _id, feedBack, coverLetter) {
        this.candidate = candidate;
        this.job = job;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.location = location;
        this.education = education;
        this.currentTitle = currentTitle;
        this.experience = experience;
        this.expectedSalary = expectedSalary;
        this.resume = resume;
        this.status = status;
        this._id = _id;
        this.feedBack = feedBack;
        this.coverLetter = coverLetter;
    }
}
exports.JobApplication = JobApplication;
