// my-snapgram-project-final-simple/frontend/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AuthFlowType,
  SignUpCommand,
  GlobalSignOutCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  CognitoIdentityClient,
  GetIdCommand,
  GetCredentialsForIdentityCommand,
} from '@aws-sdk/client-cognito-identity';
import { jwtDecode } from 'jwt-decode';
import { AWS_REGION, USER_POOL_ID, APP_CLIENT_ID, IDENTITY_POOL_ID, API_GATEWAY_URL } from '../aws-config.ts';

// Simple JWT parser to replace jwt-decode library
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to parse JWT:", e);
    return null;
  }
};

interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  imageUrl?: string;
  bio?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string, username: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  getAwsCredentials: () => Promise<any | null>;
  checkAuthUser: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const cognitoIdentityProviderClient = new CognitoIdentityProviderClient({ region: AWS_REGION });
const cognitoIdentityClient = new CognitoIdentityClient({ region: AWS_REGION });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const storeTokens = (idToken: string, accessToken: string, refreshToken: string, expiresIn: number) => {
    localStorage.setItem('idToken', idToken);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('expiresAt', (Date.now() + expiresIn * 1000).toString());
  };

  const clearTokens = () => {
    localStorage.removeItem('idToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('cognitoIdentityId');
  };

  const decodeAndSetUser = useCallback((idToken: string) => {
    try {
      const decoded: any = parseJwt(idToken);
      if (!decoded) {
        throw new Error("JWT decoding failed.");
      }
      const newUser: User = {
        id: decoded.sub,
        email: decoded.email,
        username: decoded.preferred_username || decoded['cognito:username'],
        name: decoded.name,
        imageUrl: decoded.picture || undefined,
        bio: decoded.custom_bio || undefined,
      };
      setUser(newUser);
      setIsAuthenticated(true);
      return newUser;
    } catch (error) {
      console.error('Error decoding ID token:', error);
      clearTokens();
      setIsAuthenticated(false);
      setUser(null);
      return null;
    }
  }, []);

  const checkAuthUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const idToken = localStorage.getItem('idToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const expiresAt = localStorage.getItem('expiresAt');

      if (!idToken || !refreshToken || !expiresAt) {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }

      const tokenExpiresAt = parseInt(expiresAt, 10);
      const isExpired = Date.now() >= tokenExpiresAt;

      if (isExpired) {
        console.log('ID Token expired, attempting refresh...');
        try {
          const initiateAuthCommand = new InitiateAuthCommand({
            AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
            ClientId: APP_CLIENT_ID,
            AuthParameters: {
              REFRESH_TOKEN: refreshToken,
            },
          });
          const authResponse = await cognitoIdentityProviderClient.send(initiateAuthCommand);
          const newIdToken = authResponse.AuthenticationResult?.IdToken;
          const newAccessToken = authResponse.AuthenticationResult?.AccessToken;
          const newExpiresIn = authResponse.AuthenticationResult?.ExpiresIn;

          if (newIdToken && newAccessToken && newExpiresIn) {
            storeTokens(newIdToken, newAccessToken, refreshToken, newExpiresIn);
            decodeAndSetUser(newIdToken);
            console.log('Tokens refreshed successfully.');
            return true;
          } else {
            console.error('Failed to refresh tokens.');
            clearTokens();
            setIsAuthenticated(false);
            setUser(null);
            return false;
          }
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          clearTokens();
          setIsAuthenticated(false);
          setUser(null);
          return false;
        }
      } else {
        decodeAndSetUser(idToken);
        return true;
      }
    } catch (error) {
      console.error('Error checking auth user:', error);
      clearTokens();
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [decodeAndSetUser]);

  useEffect(() => {
    checkAuthUser();
  }, [checkAuthUser]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const initiateAuthCommand = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        ClientId: APP_CLIENT_ID,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      });
      const authResponse = await cognitoIdentityProviderClient.send(initiateAuthCommand);

      const idToken = authResponse.AuthenticationResult?.IdToken;
      const accessToken = authResponse.AuthenticationResult?.AccessToken;
      const refreshToken = authResponse.AuthenticationResult?.RefreshToken;
      const expiresIn = authResponse.AuthenticationResult?.ExpiresIn;

      if (idToken && accessToken && refreshToken && expiresIn) {
        storeTokens(idToken, accessToken, refreshToken, expiresIn);
        decodeAndSetUser(idToken);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Sign In Error:', error);
      if (error.name === 'UserNotFoundException' || error.name === 'NotAuthorizedException') {
        alert('Incorrect email or password.');
      } else if (error.name === 'UserNotConfirmedException') {
        alert('User not confirmed. Please verify your email.');
      } else {
        alert(`Sign In Failed: ${error.message}`);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_GATEWAY_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, username }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Sign Up API Error:', data);
        alert(`Sign Up Failed: ${data.message || 'Unknown error'}`);
        return false;
      }

      alert('User registered successfully! Please sign in.');
      return true;
    } catch (error: any) {
      console.error('Sign Up Fetch Error:', error);
      alert(`Sign Up Failed: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        const globalSignOutCommand = new GlobalSignOutCommand({
          AccessToken: accessToken,
        });
        await cognitoIdentityProviderClient.send(globalSignOutCommand);
      }
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      alert('You have been signed out.');
    } catch (error) {
      console.error('Sign Out Error:', error);
      alert('Sign Out Failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const getAwsCredentials = useCallback(async () => {
    try {
      const idToken = localStorage.getItem('idToken');
      if (!idToken) {
        throw new Error('No ID Token found. User not authenticated.');
      }

      let identityId: string | null = localStorage.getItem('cognitoIdentityId');

      if (!identityId) {
        const getIdCommand = new GetIdCommand({
          IdentityPoolId: IDENTITY_POOL_ID,
          Logins: {
            [`cognito-idp.${AWS_REGION}.amazonaws.com/${USER_POOL_ID}`]: idToken,
          },
        });
        const idResponse = await cognitoIdentityClient.send(getIdCommand);
        identityId = idResponse.IdentityId ?? null; 
        
        if (identityId) {
          localStorage.setItem('cognitoIdentityId', identityId);
        } else {
          throw new Error('Failed to get Cognito Identity ID.');
        }
      }

      const getCredentialsCommand = new GetCredentialsForIdentityCommand({
        IdentityId: identityId, 
        Logins: {
          [`cognito-idp.${AWS_REGION}.amazonaws.com/${USER_POOL_ID}`]: idToken,
        },
      });
      const credentialsResponse = await cognitoIdentityClient.send(getCredentialsCommand);

      const credentials = credentialsResponse.Credentials;
      if (credentials) {
        return {
          accessKeyId: credentials.AccessKeyId,
          secretAccessKey: credentials.SecretKey,
          sessionToken: credentials.SessionToken,
          expiration: credentials.Expiration,
          region: AWS_REGION,
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting AWS credentials:', error);
      return null;
    }
  }, []);


  const value = useMemo(() => ({
    isAuthenticated,
    isLoading,
    user,
    signIn,
    signUp,
    signOut,
    getAwsCredentials,
    checkAuthUser,
  }), [isAuthenticated, isLoading, user, signIn, signUp, signOut, getAwsCredentials, checkAuthUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};