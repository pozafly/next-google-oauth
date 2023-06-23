const fs = require('fs');
const { google } = require('googleapis');
import { REQUEST_BODY_TYPE } from '@/constant/auth.js';

const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_DOMAIN_URI}/auth/end-popup`
);

const scopes = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'openid',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/drive.file',
];

const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

const writeFile = tokens => {
  fs.writeFileSync(process.env.TOKEN_JSON_PATH, JSON.stringify(tokens));
};

const readJSONFile = () => {
  let dataJSON =
    fs.readFileSync(process.env.TOKEN_JSON_PATH).toString() || '[]';
  return JSON.parse(dataJSON);
};

const checkSameToken = tokens => {
  const jsonTokens = readJSONFile();
  let index = jsonTokens.findIndex(v => v.access_token === tokens.access_token);
  if (index > -1) {
    jsonTokens[index].refresh_token = tokens.refresh_token;
  } else {
    jsonTokens.push({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });
  }
  return jsonTokens;
};

let hasRequest = false;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ location: authorizationUrl });
  } else if (req.method === 'POST') {
    const body = req.body;

    switch (body.type) {
      case REQUEST_BODY_TYPE.GET_TOKEN: {
        if (hasRequest) {
          res.end();
          return;
        }
        hasRequest = true;
        try {
          let { tokens } = await oauth2Client.getToken(body.code);
          oauth2Client.setCredentials(tokens);
          writeFile(checkSameToken(tokens));

          res.status(200).json({ token: tokens.access_token });
        } catch (error) {
          res.status(401).json({
            message: 'not authorization',
            isAxiosError: true,
            location: 'server',
            name: 'AxiosError',
          });
        }
        hasRequest = false;
        break;
      }

      case REQUEST_BODY_TYPE.GET_TOKEN_BY_REFRESH_TOKEN: {
        const { accessToken } = body;

        const jsonTokens = readJSONFile();
        const targetIndex = jsonTokens.findIndex(
          token => token.access_token === accessToken
        );

        if (targetIndex < 0) {
          res.status(404).json({
            message: 'not found',
            isAxiosError: true,
            location: 'server',
            name: 'AxiosError',
          });
          return;
        }

        try {
          const { tokens } = await oauth2Client.refreshToken(
            jsonTokens[targetIndex].refresh_token
          );

          jsonTokens[targetIndex] = {
            ...jsonTokens[targetIndex],
            access_token: tokens?.access_token,
          };

          writeFile(jsonTokens);

          oauth2Client.setCredentials(tokens);
          res.status(200).json({ token: tokens?.access_token });
        } catch (error) {
          res.status(401).json({
            message: 'not authorization',
            isAxiosError: true,
            location: 'server',
            name: 'AxiosError',
          });
        }

        break;
      }

      default:
        break;
    }
  } else if (req.method === 'DELETE') {
    const { access_token } = req.query;

    let jsonTokens = readJSONFile();
    let index = jsonTokens.findIndex(v => v.access_token === access_token);
    if (index > -1) {
      jsonTokens.splice(index, 1);
    }
    writeFile(jsonTokens);

    res.status(200).json({ message: 'success' });
  }
}
