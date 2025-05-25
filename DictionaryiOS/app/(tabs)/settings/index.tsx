import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Switch, SafeAreaView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SettingsScreen = () => {
    const [darkMode, setDarkMode] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [doNotDisturb, setDoNotDisturb] = useState(false);
    const [hapticFeedback, setHapticFeedback] = useState(true);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#111827" />
            
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.logoContainer}>
                        <Icon name="settings" size={24} color="white" />
                    </View>
                    <Text style={styles.headerTitle}>Settings</Text>
                </View>
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Section title="Account Settings">
                    <SettingItem label="Profile" icon="person-outline" onPress={() => console.log('Profile')} />
                    <SettingItem label="Email & Phone" icon="mail-outline" />
                    <SettingItem label="Password" icon="lock-closed-outline" />
                </Section>

                <Section title="Appearance">
                    <SettingToggle label="Dark Mode" value={darkMode} onToggle={setDarkMode} icon="moon-outline" />
                    <SettingItem label="Font Size" icon="text-outline" />
                    <SettingItem label="App Icon" icon="apps-outline" />
                </Section>

                <Section title="Notifications">
                    <SettingToggle label="Push Notifications" value={pushNotifications} onToggle={setPushNotifications} icon="notifications-outline" />
                    <SettingItem label="Notification Categories" icon="list-outline" />
                    <SettingToggle label="Do Not Disturb" value={doNotDisturb} onToggle={setDoNotDisturb} icon="remove-circle-outline" />
                </Section>

                <Section title="Privacy">
                    <SettingItem label="Data Sharing" icon="share-social-outline" />
                    <SettingItem label="Permissions" icon="shield-checkmark-outline" />
                    <SettingItem label="Blocked Users" icon="close-circle-outline" />
                </Section>

                <Section title="Accessibility">
                    <SettingToggle label="Haptic Feedback" value={hapticFeedback} onToggle={setHapticFeedback} icon="pulse-outline" />
                    <SettingItem label="Text-to-Speech" icon="mic-outline" />
                    <SettingItem label="Screen Reader" icon="eye-off-outline" />
                </Section>

                <Section title="Support">
                    <SettingItem label="Help Center" icon="help-circle-outline" />
                    <SettingItem label="Report a Bug" icon="bug-outline" />
                    <SettingItem label="Feedback" icon="chatbubble-ellipses-outline" />
                </Section>

                <Section title="About">
                    <SettingItem label="App Version" icon="information-circle-outline" />
                    <SettingItem label="Terms & Privacy" icon="document-text-outline" />
                </Section>

                {/* Bottom spacing for tab bar */}
                <View style={styles.bottomSpacing} />
            </ScrollView>
        </SafeAreaView>
    );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.card}>
            {children}
        </View>
    </View>
);

const SettingItem = ({ label, icon, onPress }: { label: string; icon: string; onPress?: () => void }) => (
    <TouchableOpacity onPress={onPress} style={styles.item} activeOpacity={0.7}>
        <View style={styles.itemLeft}>
            <Icon name={icon} size={20} color="rgba(255,255,255,0.7)" style={styles.icon} />
            <Text style={styles.label}>{label}</Text>
        </View>
        <Icon name="chevron-forward-outline" size={20} color="rgba(255,255,255,0.4)" />
    </TouchableOpacity>
);

const SettingToggle = ({ label, value, onToggle, icon }: { label: string; value: boolean; onToggle: (val: boolean) => void; icon: string }) => (
    <View style={styles.item}>
        <View style={styles.itemLeft}>
            <Icon name={icon} size={20} color="rgba(255,255,255,0.7)" style={styles.icon} />
            <Text style={styles.label}>{label}</Text>
        </View>
        <Switch 
            value={value} 
            onValueChange={onToggle}
            trackColor={{ false: 'rgba(255,255,255,0.2)', true: '#3B82F6' }}
            thumbColor={value ? '#ffffff' : 'rgba(255,255,255,0.8)'}
            ios_backgroundColor="rgba(255,255,255,0.2)"
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoContainer: {
        width: 40,
        height: 40,
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    scrollContainer: {
        flex: 1,
    },
    section: {
        marginVertical: 12,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        marginBottom: 12,
        marginLeft: 4,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        borderBottomWidth: 1,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    label: {
        fontSize: 16,
        color: 'white',
        fontWeight: '500',
    },
    icon: {
        marginRight: 16,
    },
    bottomSpacing: {
        height: 100,
    },
});

export default SettingsScreen;