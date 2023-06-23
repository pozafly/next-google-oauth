import axios from 'axios';

const oauthApi = axios.create({
  baseURL: 'https://www.googleapis.com',
  headers: {
    'Content-type': 'application/json',
  },
  params: {},
  timeout: 15 * 1000,
});

export const getUserInfo = async accessToken => {
  const response = await oauthApi.get(
    `oauth2/v2/userinfo?access_token=${accessToken}`
  );

  return response.data;
};
