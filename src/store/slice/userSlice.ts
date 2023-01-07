/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import { LoginFormData, updateUserFormType, UserType } from '../../shared/types';

export interface userState {
  currentUser: UserType | null;
  onlineUsers: { userId: string; socketId: string }[];
  logging: boolean;
  error: null | string;
}
export interface updateUserPayload {
  userUpdated: updateUserFormType;
  id: string;
}

const initialState: userState = {
  currentUser: null,
  onlineUsers: [],
  logging: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => {
      state.currentUser = action.payload;
      state.logging = false;
      state.error = null;
    },
    //login
    loginUserRequest: (state, action: PayloadAction<LoginFormData>) => {
      state.logging = true;
      state.error = null;
    },
    loginUserFailure: (state, action: PayloadAction<string>) => {
      state.logging = false;
      state.error = action.payload;
    },
    //logout
    logoutUser: (state) => {
      state.currentUser = null;
      state.logging = false;
    },

    updateUserRequest: (state, action: PayloadAction<updateUserPayload>) => {
      state.logging = true;
    },
    updateUserFailure: (state, action: PayloadAction<string>) => {
      state.logging = false;
      state.error = action.payload;
    },

    addHistoryRequest(state, action: PayloadAction<{ id: string; historyId: string }>) {
      state.logging = true;
    },
    addHistorySuccess(state, action: PayloadAction<[string]>) {
      state.logging = false;
      state.currentUser!.historySearch = action.payload;
    },
    addHistoryFailure(state, action: PayloadAction<string>) {
      state.logging = false;
      state.error = action.payload;
    },

    deleteHistoryRequest(state, action: PayloadAction<{ id: string; historyId: string }>) {
      state.logging = true;
    },
    deleteHistorySuccess(state, action: PayloadAction<[string]>) {
      state.logging = false;
      state.currentUser!.historySearch = action.payload;
    },
    deleteHistoryFailure(state, action: PayloadAction<string>) {
      state.logging = false;
      state.error = action.payload;
    },

    deleteFriendRequest(state, action: PayloadAction<{ id: string; friendId: string }>) {
      state.logging = true;
    },
    deleteFriendSuccess(state, action: PayloadAction<[string]>) {
      state.logging = false;
      state.currentUser!.friends = action.payload;
    },
    deleteFriendFailure(state, action: PayloadAction<string>) {
      state.logging = false;
      state.error = action.payload;
    },

    addFriend(state, action: PayloadAction<string>) {
      state.currentUser?.friends.push(action.payload);
    },

    setOnlineUsers: (state, action: PayloadAction<{ userId: string; socketId: string }[]>) => {
      state.onlineUsers = action.payload;
    },

    clearLoginError: (state) => {
      state.error = null;
    }
  },
});

export const userAction = userSlice.actions;

export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectHistorySearch = (state: RootState) => state.user.currentUser!.historySearch;
export const selectLogging = (state: RootState) => state.user.logging;
export const selectLoginError = (state: RootState) => state.user.error;
export const selectOnlineUsers = (state: RootState) => state.user.onlineUsers;

export default userSlice.reducer;
