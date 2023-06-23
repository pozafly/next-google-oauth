import axios from 'axios';
import { REQUEST_BODY_TYPE } from '@/constant/auth.js';
import {
  onErrorResponse,
  onResponse,
} from '@/core/apis/common/interceptors.js';

const oauthApi = axios.create({
  baseURL: 'https://www.googleapis.com',
  headers: {
    'Content-type': 'application/json',
  },
  params: {},
  timeout: 15 * 1000,
});

setTimeout(() => {
  oauthApi.interceptors.response.use(onResponse, onErrorResponse);
});

export const getAuthCode = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_DOMAIN_URI}/api/auth`
  );

  return response.data;
};

export const getAccessToken = async code => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_DOMAIN_URI}/api/auth`,
    {
      type: REQUEST_BODY_TYPE.GET_TOKEN,
      code,
    }
  );
  return response.data;
};

export const getAccessTokenByRefreshToken = async () => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_DOMAIN_URI}/api/auth`,
    {
      type: REQUEST_BODY_TYPE.GET_TOKEN_BY_REFRESH_TOKEN,
      accessToken: localStorage.getItem('accessToken'),
    }
  );
  return response.data;
};

export const logoutToServer = async accessToken => {
  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_DOMAIN_URI}/api/auth?access_token=${accessToken}`
  );
  return response.data;
};

export const getUserInfo = async accessToken => {
  const response = await oauthApi.get(
    `oauth2/v2/userinfo?access_token=${accessToken}`
  );

  return response.data;
};
