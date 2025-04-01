export interface Candidate {
  _id: string;
  name: string;
  email: string;
  profession: string;
  bio: string;
  googleId: string;
  profileImage: string;
  socialLinks: { linkedIn: string; gitHub: string };
  skills: string[];
  resume: string;
  isVerified: boolean;
  isBlocked: boolean;
}
