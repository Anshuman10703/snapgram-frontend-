// src/global.d.ts
// This declares global types for libraries that might not have perfect type definitions
// or are loaded in a way that TypeScript doesn't automatically infer.
declare global {
  // For AWS SDK clients loaded via CDN, if needed
  const AWS: {
    CognitoIdentityProvider: {
      CognitoIdentityProviderClient: any;
      InitiateAuthCommand: any;
      AuthFlowType: any;
      SignUpCommand: any;
      GlobalSignOutCommand: any;
      GetUserCommand: any;
    };
    CognitoIdentity: {
      CognitoIdentityClient: any;
      GetIdCommand: any;
      GetCredentialsForIdentityCommand: any;
    };
    S3: {
      S3Client: any;
      DeleteObjectCommand: any;
    };
    LibStorage: {
      Upload: any;
    };
  };
  // For uuid library, if needed globally
  const uuid: {
    v4: () => string;
  };
  // For jwt-decode library, if needed globally
  const jwt_decode: {
    jwtDecode: (token: string) => any;
  };
  // For React Router DOM, if needed globally
  const ReactRouterDOM: any;
}

// Extend Window interface for global variables if accessed directly from window
interface Window {
  jwt_decode?: {
    jwtDecode: (token: string) => any;
  };
  uuid?: {
    v4: () => string;
  };
  ReactRouterDOM?: any;
}