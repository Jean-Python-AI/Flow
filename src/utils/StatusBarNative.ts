import { NativeModules, Platform } from 'react-native';

const { StatusBarModule } = NativeModules;

export const setStatusBarColorNative = async (color: string): Promise<boolean> => {
  if (Platform.OS === 'android' && StatusBarModule) {
    try {
      await StatusBarModule.setStatusBarColor(color);
      return true;
    } catch (error) {
      console.warn('Error setting status bar color:', error);
      return false;
    }
  }
  return false;
};

