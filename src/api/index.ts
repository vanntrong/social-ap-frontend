import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import jwt_decode from 'jwt-decode';
import queryString from 'query-string';
import { getToken, removeToken, setToken } from 'utils/token';

const access_token = getToken('token');

//axios no header used with login and register
export const axiosAuthClient = axios.create({
  baseURL: 'https://social-app-api.vovantrong.online',
  headers: {
    'content-type': 'application/json',
  },
});

axiosAuthClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

//axios with header used with all other requests
const axiosClient = axios.create({
  baseURL: 'https://social-app-api.vovantrong.online',
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

if (access_token) {
  axiosClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
}

let isRefreshing = false;

axiosClient.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    if (isRefreshing) {
      return config;
    }
    try {
      if (access_token) {
        const currentDate = new Date();
        const decodedToken = jwt_decode<any>(access_token);
        if (decodedToken.exp * 1000 < currentDate.getTime()) {
          isRefreshing = true;
          const refresh_token = getToken('refresh_token');
          const newToken = await refreshAccessToken(refresh_token);
          if (config.headers === undefined) {
            config.headers = {};
          }

          setToken('token', newToken);
          config.headers['Authorization'] = 'Bearer ' + newToken;
          isRefreshing = false;
        }
      }
    } catch (error) {
      isRefreshing = false;
      window.location.href = '/login';
      removeToken('token');
      removeToken('refresh_token');
      throw new Error(error);
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

const refreshAccessToken = async (refreshToken: string | null): Promise<string> => {
  const access_token = await axiosAuthClient.post<string, string>(`/token/refresh`, {
    refreshToken,
  });
  return access_token;
};

export default axiosClient;
