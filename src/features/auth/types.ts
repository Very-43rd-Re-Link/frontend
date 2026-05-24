export type SocialLoginProvider = 'kakao' | 'google' | 'apple';

export type SocialLoginResult = {
  provider: SocialLoginProvider;
  accessToken?: string;
  accessTokenExpiresAt?: number;
  refreshTokenExpiresAt?: number;
  scopes?: string[];
};
