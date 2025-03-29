import { logoutService } from "@/services/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserData {
  role: string;
  _id: string;
  name: string;
  email: string;
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
      console.log(action.payload, "payload");
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

export const { login } = userSlice.actions;
export default userSlice.reducer;
