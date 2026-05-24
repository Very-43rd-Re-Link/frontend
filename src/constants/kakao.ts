import Constants from 'expo-constants';

type ExpoExtra = {
  kakaoNativeAppKey?: string;
};

const extra = Constants.expoConfig?.extra as ExpoExtra | undefined;

export const kakaoNativeAppKey = extra?.kakaoNativeAppKey ?? '';

