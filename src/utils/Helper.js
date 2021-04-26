import { Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MessageAlert from '../components/MessageAlert';

export default class Helper {

  static storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      MessageAlert('ERROR', e.toString());
    };
  };

  static getData = async (key) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      MessageAlert('ERROR', e.toString());
    };
  };

  static clearData = async () => {
    const asyncStorageKeys = await AsyncStorage.getAllKeys();
    if (asyncStorageKeys.length > 0) {
      if (Platform.OS === 'android') {
        await AsyncStorage.clear();
      }
      if (Platform.OS === 'ios') {
        await AsyncStorage.multiRemove(asyncStorageKeys);
      }
    };
  }

  static openDrawingPDF = (navigation, link, title) => {
    navigation.navigate(
      'PDFView',
      {
        link: link,
        title: title,
      }
    );
  };

};
