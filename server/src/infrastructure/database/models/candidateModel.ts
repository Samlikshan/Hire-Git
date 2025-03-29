import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    profession: { type: String },
    bio: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    profileImage: { type: String },
    socialLinks: { linkedIn: { type: String }, gitHub: { type: String } },
    skills: [String],
    resume: { type: String },
    experience: [
      {
        jobTitle: String,
        company: String,
        startDate: Date,
        endDate: Date,
        description: String,
        location: String,
      },
    ],
    projects: [{}],
    profileCompleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const CandidateModel = mongoose.model("Candidates", candidateSchema);
