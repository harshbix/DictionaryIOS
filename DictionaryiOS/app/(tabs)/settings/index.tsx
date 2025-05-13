import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SettingsScreen = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [doNotDisturb, setDoNotDisturb] = useState(false);
    const [hapticFeedback, setHapticFeedback] = useState(true);

    return (
        <ScrollView style={styles.container}>
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
        </ScrollView>
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
    <TouchableOpacity onPress={onPress} style={styles.item}>
        <View style={styles.itemLeft}>
            <Icon name={icon} size={20} color="#555" style={styles.icon} />
            <Text style={styles.label}>{label}</Text>
        </View>
        <Icon name="chevron-forward-outline" size={20} color="#aaa" />
    </TouchableOpacity>
);

const SettingToggle = ({ label, value, onToggle, icon }: { label: string; value: boolean; onToggle: (val: boolean) => void; icon: string }) => (
    <View style={styles.item}>
        <View style={styles.itemLeft}>
            <Icon name={icon} size={20} color="#555" style={styles.icon} />
            <Text style={styles.label}>{label}</Text>
        </View>
        <Switch value={value} onValueChange={onToggle} />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    section: {
        marginVertical: 10,
        paddingHorizontal: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 5,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 15,
        color: '#333',
    },
    icon: {
        marginRight: 15,
    },
});

export default SettingsScreen;
