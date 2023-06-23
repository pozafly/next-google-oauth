import axios from 'axios';
import { getAccessTokenByRefreshToken } from '@/core/apis/auth.js';
import store from '@/store/store.js';
import { setAccessToken } from '@/store/slices/authSlice.js';

const changeConfigNewToken = (config, token) => {
  if (config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const url = config.url;
  if (url?.includes('access_token=')) {
    const tokenIndex = url.indexOf('access_token=');
    if (tokenIndex > -1) {
      let urlToken = '';
      const endIndex = url.indexOf('&', tokenIndex);
      if (endIndex > -1) {
        urlToken = url.slice(tokenIndex + 13, endIndex);
      } else {
        urlToken = url.slice(tokenIndex + 13);
      }
      config.url = url.replace(urlToken, token);
    }
  }

  return config;
};

export const onResponse = response => {
  return response;
};

export const onErrorResponse = async error => {
  if (Number(error.response?.status) === 401) {
    try {
      const { token } = await getAccessTokenByRefreshToken();
      if (!token) {
        throw new Error('not found');
      }
      localStorage.setItem('accessToken', token);
      store.dispatch(setAccessToken(token));

      const config = changeConfigNewToken(error.config, token);
      return await axios.request(config);
    } catch (error) {
      alert('로그인이 필요합니다.');
      window.location.href = `${process.env.NEXT_PUBLIC_DOMAIN_URI}`;
    }
  }
  return Promise.reject(error);
};
