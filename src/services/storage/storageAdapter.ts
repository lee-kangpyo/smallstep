import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage 인터페이스 정의
 * 다양한 Storage 구현체를 동일한 인터페이스로 사용할 수 있도록 추상화
 */
export interface IStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  getAllKeys(): Promise<string[]>;
}

/**
 * AsyncStorage Adapter
 * 기존 AsyncStorage를 IStorage 인터페이스에 맞게 래핑
 */
export class AsyncStorageAdapter implements IStorage {
  async getItem(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }

  async getAllKeys(): Promise<string[]> {
    const keys = await AsyncStorage.getAllKeys();
    return [...keys];
  }
}

/**
 * MMKV Adapter
 * MMKV를 IStorage 인터페이스에 맞게 래핑
 */
export class MMKVAdapter implements IStorage {
  private storage: any;

  constructor() {
    // react-native-mmkv v4는 createMMKV 함수를 사용
    // @ts-ignore - MMKV는 네이티브 모듈
    const { createMMKV } = require('react-native-mmkv');
    this.storage = createMMKV({ id: 'goals-storage' });
    console.log('✅ MMKV 초기화 성공');
    // 디버깅: MMKV 객체의 메서드 확인
    console.log('🔍 MMKV 메서드:', Object.keys(this.storage).filter(key => typeof this.storage[key] === 'function'));
  }

  async getItem(key: string): Promise<string | null> {
    return this.storage.getString(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    // MMKV의 삭제 메서드 확인 및 사용
    if (typeof this.storage.delete === 'function') {
      this.storage.delete(key);
    } else if (typeof this.storage.remove === 'function') {
      this.storage.remove(key);
    } else {
      // 메서드가 없으면 에러 발생
      console.error('MMKV delete/remove 메서드를 찾을 수 없습니다. 사용 가능한 메서드:', Object.keys(this.storage));
      throw new Error('MMKV delete 메서드를 사용할 수 없습니다.');
    }
  }

  async getAllKeys(): Promise<string[]> {
    const keys = this.storage.getAllKeys();
    return Array.isArray(keys) ? [...keys] : [];
  }
}

/**
 * Storage 팩토리
 * USE_MMKV 플래그에 따라 적절한 Storage 구현체를 반환
 * 
 * Phase 3: MMKV로 전환 (기존 리스트 구조 유지)
 */
const USE_MMKV = true; // MMKV 사용 (빌드에 MMKV가 포함되어 있는지 확인 후 true로 변경)

export const storage: IStorage = (() => {
  if (USE_MMKV) {
    try {
      const mmkvAdapter = new MMKVAdapter();
      console.log('✅ MMKV Storage 사용 중');
      return mmkvAdapter;
    } catch (error) {
      console.warn('MMKV 초기화 실패, AsyncStorage로 폴백:', error);
      return new AsyncStorageAdapter();
    }
  }
  console.log('📦 AsyncStorage 사용 중');
  return new AsyncStorageAdapter();
})();

