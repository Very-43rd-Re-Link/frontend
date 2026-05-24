import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { SocialLoginOption } from '@/features/auth/constants/social-login-options';

type SocialLoginButtonProps = {
  option: SocialLoginOption;
  onPress: (option: SocialLoginOption) => void;
};

export function SocialLoginButton({ option, onPress }: SocialLoginButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={option.label}
      onPress={() => onPress(option)}
      style={({ pressed }) => [
        styles.loginButton,
        {
          backgroundColor: option.backgroundColor,
          borderColor: option.borderColor ?? option.backgroundColor,
          opacity: pressed ? 0.82 : 1,
        },
      ]}>
      <ThemedText type="smallBold" style={[styles.loginButtonText, { color: option.textColor }]}>
        {option.label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderRadius: Spacing.two,
    borderWidth: 1,
    paddingHorizontal: Spacing.four,
  },
  loginButtonText: {
    textAlign: 'center',
  },
});
