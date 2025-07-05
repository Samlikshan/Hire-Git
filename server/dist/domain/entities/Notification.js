"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
class Notification {
    constructor(type, title, job, 
    // public company: string,
    candidate, message, read, action, createdAt, _id) {
        this.type = type;
        this.title = title;
        this.job = job;
        this.candidate = candidate;
        this.message = message;
        this.read = read;
        this.action = action;
        this.createdAt = createdAt;
        this._id = _id;
    }
}
exports.Notification = Notification;
