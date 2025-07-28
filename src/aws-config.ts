// my-snapgram-project-final-simple/frontend/src/aws-config.ts
export const AWS_REGION = import.meta.env.VITE_APP_AWS_REGION;
export const USER_POOL_ID = import.meta.env.VITE_APP_USER_POOL_ID;
export const APP_CLIENT_ID = import.meta.env.VITE_APP_APP_CLIENT_ID;
export const IDENTITY_POOL_ID = import.meta.env.VITE_APP_IDENTITY_POOL_ID;

export const S3_BUCKET_NAME = import.meta.env.VITE_APP_S3_BUCKET_NAME;
export const S3_BUCKET_URL_PREFIX = import.meta.env.VITE_APP_S3_BUCKET_URL_PREFIX;

export const API_GATEWAY_URL = import.meta.env.VITE_APP_API_GATEWAY_URL;

if (!AWS_REGION || !USER_POOL_ID || !APP_CLIENT_ID || !IDENTITY_POOL_ID || !S3_BUCKET_NAME || !API_GATEWAY_URL) {
  console.error("Missing one or more AWS environment variables. Please check your .env file.");
}