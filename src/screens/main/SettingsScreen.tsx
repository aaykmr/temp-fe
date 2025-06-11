import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../store';
import {logout} from '../../store/slices/authSlice';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => dispatch(logout()),
        },
      ],
      {cancelable: true},
    );
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    value?: string | boolean,
    onPress?: () => void,
    isSwitch?: boolean,
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={isSwitch}>
      <View style={styles.settingItemLeft}>
        <Icon name={icon} size={24} color="#666" style={styles.settingIcon} />
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      {isSwitch ? (
        <Switch
          value={value as boolean}
          onValueChange={onPress}
          trackColor={{false: '#ddd', true: '#FF4B6E'}}
          thumbColor="#fff"
        />
      ) : (
        <View style={styles.settingItemRight}>
          {value && <Text style={styles.settingValue}>{value}</Text>}
          {!isSwitch && <Icon name="chevron-forward" size={24} color="#666" />}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {renderSettingItem('person', 'Edit Profile', undefined, () => {})}
        {renderSettingItem('mail', 'Email', user?.email)}
        {renderSettingItem(
          'lock-closed',
          'Change Password',
          undefined,
          () => {},
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        {renderSettingItem(
          'notifications',
          'Push Notifications',
          true,
          () => {},
          true,
        )}
        {renderSettingItem(
          'location',
          'Location Services',
          true,
          () => {},
          true,
        )}
        {renderSettingItem('moon', 'Dark Mode', false, () => {}, true)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        {renderSettingItem('help-circle', 'Help Center', undefined, () => {})}
        {renderSettingItem('information-circle', 'About', undefined, () => {})}
        {renderSettingItem(
          'document-text',
          'Terms of Service',
          undefined,
          () => {},
        )}
        {renderSettingItem(
          'shield-checkmark',
          'Privacy Policy',
          undefined,
          () => {},
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon
          name="log-out"
          size={24}
          color="#FF4B6E"
          style={styles.logoutIcon}
        />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginLeft: 15,
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
    marginRight: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginTop: 20,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: '#FF4B6E',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
