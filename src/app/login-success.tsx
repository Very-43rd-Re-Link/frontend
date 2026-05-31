import {Pressable, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {MaxContentWidth, Spacing} from '@/constants/theme';
import {logout} from "@/features/auth/services/logout";

export default function LoginSuccessScreen() {
    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ThemedView style={styles.content}>
                    <ThemedText type="subtitle" style={styles.title}>
                        로그인 성공
                    </ThemedText>
                    <ThemedText type="default" themeColor="textSecondary" style={styles.description}>
                        로그인이 정상적으로 완료되었습니다.
                    </ThemedText>
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => logout()}
                        style={() => [
                            styles.logOutButton,
                        ]}>
                    </Pressable>
                </ThemedView>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    safeArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: MaxContentWidth,
        paddingHorizontal: Spacing.four,
    },
    content: {
        alignItems: 'center',
        gap: Spacing.three,
        width: '100%',
    },
    title: {
        textAlign: 'center',
    },
    description: {
        textAlign: 'center',
    },
    logOutButton: {

    }
});
