import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSettings, useSettingsActions } from '../hooks/useAppState';
import { useUIActions } from '../hooks/useAppState';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { theme, language, notifications, soundEnabled, vibrationEnabled } = useAppSettings();
  const { updateTheme, updateLanguage, updateNotifications, updateSoundEnabled, updateVibrationEnabled } = useSettingsActions();
  const { showToast } = useUIActions();

  // 테마 변경
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    updateTheme(newTheme);
    showToast(`테마가 ${newTheme === 'light' ? '라이트' : '다크'} 모드로 변경되었습니다.`, 'success');
  };

  // 언어 변경
  const handleLanguageChange = (newLanguage: 'ko' | 'en') => {
    updateLanguage(newLanguage);
    showToast(`언어가 ${newLanguage === 'ko' ? '한국어' : 'English'}로 변경되었습니다.`, 'success');
  };

  // 알림 설정 변경
  const handleNotificationChange = (enabled: boolean) => {
    updateNotifications(enabled);
    showToast(
      enabled ? '알림이 활성화되었습니다.' : '알림이 비활성화되었습니다.',
      'success'
    );
  };

  // 소리 설정 변경
  const handleSoundChange = (enabled: boolean) => {
    updateSoundEnabled(enabled);
    showToast(
      enabled ? '소리가 활성화되었습니다.' : '소리가 비활성화되었습니다.',
      'success'
    );
  };

  // 진동 설정 변경
  const handleVibrationChange = (enabled: boolean) => {
    updateVibrationEnabled(enabled);
    showToast(
      enabled ? '진동이 활성화되었습니다.' : '진동이 비활성화되었습니다.',
      'success'
    );
  };

  // 데이터 초기화
  const handleResetData = () => {
    Alert.alert(
      '데이터 초기화',
      '모든 데이터가 삭제됩니다. 정말 초기화하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '초기화', 
          style: 'destructive',
          onPress: () => {
            // TODO: 데이터 초기화 로직
            showToast('데이터가 초기화되었습니다.', 'success');
          }
        }
      ]
    );
  };

  // 앱 정보
  const handleAppInfo = () => {
    Alert.alert(
      '앱 정보',
      'SmallStep v1.0.0\n\n목표 달성을 위한 작은 단계들을 관리하는 앱입니다.',
      [{ text: '확인', style: 'default' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* 앱 설정 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>앱 설정</Text>
        
        {/* 테마 설정 */}
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>테마</Text>
            <Text style={styles.settingDescription}>앱의 색상 테마를 선택하세요</Text>
          </View>
          <View style={styles.themeButtons}>
            <TouchableOpacity
              style={[styles.themeButton, theme === 'light' && styles.themeButtonActive]}
              onPress={() => handleThemeChange('light')}
            >
              <Text style={[styles.themeButtonText, theme === 'light' && styles.themeButtonTextActive]}>
                라이트
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.themeButton, theme === 'dark' && styles.themeButtonActive]}
              onPress={() => handleThemeChange('dark')}
            >
              <Text style={[styles.themeButtonText, theme === 'dark' && styles.themeButtonTextActive]}>
                다크
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 언어 설정 */}
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>언어</Text>
            <Text style={styles.settingDescription}>앱 언어를 선택하세요</Text>
          </View>
          <View style={styles.languageButtons}>
            <TouchableOpacity
              style={[styles.languageButton, language === 'ko' && styles.languageButtonActive]}
              onPress={() => handleLanguageChange('ko')}
            >
              <Text style={[styles.languageButtonText, language === 'ko' && styles.languageButtonTextActive]}>
                한국어
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.languageButton, language === 'en' && styles.languageButtonActive]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={[styles.languageButtonText, language === 'en' && styles.languageButtonTextActive]}>
                English
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 알림 설정 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>알림 설정</Text>
        
        {/* 알림 활성화 */}
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>알림</Text>
            <Text style={styles.settingDescription}>목표 및 활동 알림을 받습니다</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={handleNotificationChange}
            trackColor={{ false: '#bdc3c7', true: '#27ae60' }}
            thumbColor={notifications ? '#fff' : '#f4f3f4'}
          />
        </View>

        {/* 소리 설정 */}
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>소리</Text>
            <Text style={styles.settingDescription}>알림 소리를 재생합니다</Text>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={handleSoundChange}
            trackColor={{ false: '#bdc3c7', true: '#27ae60' }}
            thumbColor={soundEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        {/* 진동 설정 */}
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>진동</Text>
            <Text style={styles.settingDescription}>알림 시 진동을 울립니다</Text>
          </View>
          <Switch
            value={vibrationEnabled}
            onValueChange={handleVibrationChange}
            trackColor={{ false: '#bdc3c7', true: '#27ae60' }}
            thumbColor={vibrationEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* 데이터 관리 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>데이터 관리</Text>
        
        {/* 데이터 초기화 */}
        <TouchableOpacity style={styles.settingItem} onPress={handleResetData}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>데이터 초기화</Text>
            <Text style={styles.settingDescription}>모든 목표와 활동 데이터를 삭제합니다</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 정보 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>정보</Text>
        
        {/* 앱 정보 */}
        <TouchableOpacity style={styles.settingItem} onPress={handleAppInfo}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>앱 정보</Text>
            <Text style={styles.settingDescription}>버전 및 라이선스 정보</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    padding: 20,
    paddingBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  themeButton: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  themeButtonActive: {
    backgroundColor: '#3498db',
  },
  themeButtonText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  themeButtonTextActive: {
    color: 'white',
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  languageButton: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  languageButtonActive: {
    backgroundColor: '#e74c3c',
  },
  languageButtonText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  languageButtonTextActive: {
    color: 'white',
  },
  arrow: {
    fontSize: 18,
    color: '#bdc3c7',
    fontWeight: 'bold',
  },
});
