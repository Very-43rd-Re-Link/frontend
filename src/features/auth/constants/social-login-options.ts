import { SocialLoginProvider } from '@/features/auth/types';

export type SocialLoginOption = {
  provider: SocialLoginProvider;
  label: string;
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
};

export const socialLoginOptions = [
  {
    provider: 'kakao',
    label: '카카오로 로그인',
    backgroundColor: '#FEE500',
    textColor: '#191919',
  },
  {
    provider: 'google',
    label: '구글로 로그인',
    backgroundColor: '#FFFFFF',
    textColor: '#1F1F1F',
    borderColor: '#DADCE0',
  },
  {
    provider: 'apple',
    label: 'Apple로 로그인',
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
  },
] satisfies SocialLoginOption[];
