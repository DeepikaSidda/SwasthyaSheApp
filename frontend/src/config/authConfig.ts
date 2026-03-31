export interface AuthConfig {
  userPoolId: string;
  clientId: string;
  domain: string;
  redirectUri: string;
  signOutUri: string;
  region: string;
}

export function getAuthConfig(): AuthConfig | null {
  const userPoolId = process.env.REACT_APP_COGNITO_USER_POOL_ID;
  const clientId = process.env.REACT_APP_COGNITO_CLIENT_ID;
  const domain = process.env.REACT_APP_COGNITO_DOMAIN;
  const redirectUri = process.env.REACT_APP_COGNITO_REDIRECT_URI;
  const signOutUri = process.env.REACT_APP_COGNITO_SIGN_OUT_URI;

  if (!userPoolId || !clientId || !domain) {
    console.warn('Auth env vars missing — auth features disabled');
    return null;
  }

  const region = userPoolId.split('_')[0];

  return {
    userPoolId,
    clientId,
    domain,
    redirectUri: redirectUri || 'http://localhost:3000',
    signOutUri: signOutUri || 'http://localhost:3000',
    region,
  };
}
