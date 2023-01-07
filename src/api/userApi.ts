import {
  DifferentUserType,
  friendType,
  LoginFormData,
  SignUpFormData,
  UserType,
} from '../shared/types';
import axiosClient, { axiosAuthClient } from './index';

interface loginResponse {
  token: string;
  user: UserType;
}

interface searchUserParams {
  q: string;
  page?: number;
  limit?: number;
}

export const registerUser = (data: SignUpFormData): Promise<any> =>
  axiosAuthClient.post('auth/register', data);

export const loginUser = (data: LoginFormData): Promise<loginResponse> =>
  axiosAuthClient.post('auth/login', data);

//get profile of current user
export const getProfileApi = (): Promise<UserType> => axiosClient.get('auth');

export const changePasswordApi = (payload: {
  id: string;
  oldPassword: string;
  newPassword: string;
}): Promise<any> =>
  axiosClient.put(`auth/${payload.id}/password`, {
    oldPassword: payload.oldPassword,
    newPassword: payload.newPassword,
  });

//get profile of other user
export const getProfileOtherApi = (username: string): Promise<UserType> =>
  axiosClient.get(`users/${username}/profile`);

export const updateUserApi = (payload: any): Promise<UserType> =>
  axiosClient.put(`users/${payload.id}`, payload.userUpdated);

export const deleteUserApi = (id: string): Promise<any> => axiosClient.delete(`users/${id}`);

export const searchUserApi = (params: searchUserParams): Promise<any[]> =>
  axiosClient.get('search', { params });

export const addHistoryApi = (payload: { id: string; historyId: string }): Promise<[string]> =>
  axiosClient.put(`users/${payload.id}/searchHistory`, { searchId: payload.historyId });

export const getHistoryInfoApi = (id: string): Promise<any> =>
  axiosClient.get(`users/${id}/searchHistory`);

export const deleteHistoryApi = (payload: { id: string; historyId: string }): Promise<[string]> =>
  axiosClient.delete(`users/${payload.id}/searchHistory/${payload.historyId}`);

export const getFriendListApi = (id: string, params: { page: number }): Promise<friendType[]> =>
  axiosClient.get(`users/${id}/friends`, { params });

export const deleteFriendApi = (payload: { id: string; friendId: string }): Promise<[string]> =>
  axiosClient.delete(`users/${payload.id}/friends/${payload.friendId}`);

export const getOnlineUsersApi = (onlineList: string[]): Promise<UserType[]> =>
  axiosClient.post('users/online', { onlineList });

export const getSuggestUserApi = (): Promise<DifferentUserType[]> =>
  axiosClient.get('users/suggest');

export const requestForgotPasswordApi = (email: string): Promise<any> =>
  axiosClient.post('auth/forgot-password', { email });

export const resetPasswordApi = (payload: {
  email: string;
  newPassword: string;
  code: string;
}): Promise<any> => axiosClient.post('auth/reset-password', payload);
