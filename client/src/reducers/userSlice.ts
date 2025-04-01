import { logoutService } from "@/services/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserData {
  role: string;
  _id: string;
  name: string;
  email: string;
  profession: string;
  bio: string;
  googleId: string;
  profileImage: string;
  socialLinks: { linkedIn: string; gitHub: string; twitter: string };
  skills: string[];
  resume: string;
  isVerified: boolean;
  isBlocked: boolean;
  accountStatus: {
    status: "Pending" | "Rejected" | "Accepted";
    description: string;
  };
  website: string;
  industry: string;
  description: string;
  companySize: string;
  founded: string;
  about: string;
  headquarters: string;
  logo: string;
  experience: [
    {
      _id?: string;
      jobTitle: string;
      location: string;
      company: string;
      startDate: string;
      endDate: string;
      description: string;
    }
  ];
}

interface UserState {
  isAuthenticated: boolean;
  role: string | null;
  userData: UserData | null;
}
const initialState: UserState = {
  isAuthenticated: false,
  role: null,
  userData: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserData>) => {
      state.isAuthenticated = true;
      state.role = action.payload.role;
      state.userData = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.role = null;
      state.userData = null;
      logoutService();
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
