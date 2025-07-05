"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interview = void 0;
class Interview {
    constructor(application, job, scheduledAt, duration, timeZone, roomId, meetingLink, round, status, offerLetter, offerStatus, signedOfferLetter, offerSentAt, offerRejectedAt, candidateFeedback, rejectionReason, note, feedback, evaluation, _id) {
        this.application = application;
        this.job = job;
        this.scheduledAt = scheduledAt;
        this.duration = duration;
        this.timeZone = timeZone;
        this.roomId = roomId;
        this.meetingLink = meetingLink;
        this.round = round;
        this.status = status;
        this.offerLetter = offerLetter;
        this.offerStatus = offerStatus;
        this.signedOfferLetter = signedOfferLetter;
        this.offerSentAt = offerSentAt;
        this.offerRejectedAt = offerRejectedAt;
        this.candidateFeedback = candidateFeedback;
        this.rejectionReason = rejectionReason;
        this.note = note;
        this.feedback = feedback;
        this.evaluation = evaluation;
        this._id = _id;
    }
}
exports.Interview = Interview;
