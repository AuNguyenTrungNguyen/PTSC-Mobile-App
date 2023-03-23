import { Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MessageAlert from '../components/MessageAlert';
import Constant from './Constant';

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

  static checkFormatNumber = numer => {
    const regexNumber = /^\d+(\.\d+)?$/;
    return regexNumber.test(numer) && numer !== '';
  };

  static checkFormatNegativeNumber = numer => {
    const regex = /^-?\d+(\.\d{1,2})?$/;
    return regex.test(numer) && numer !== '';
  };

  static checkFormatInteger = int => {
    const regexNumber = /^\d+$/;
    return regexNumber.test(int) && int !== '';
  };

  static openDrawingPDF = (navigation, link, title) => {
    navigation.navigate(
      Constant.ROUTE__PDF,
      {
        link: link,
        title: title,
      }
    );
  };

  static handleListUpdate = list => {
    let result = [];
    list.map(item => {
      let keys = Object.keys(item);
      let column = keys.filter(i => (i !== 'RowIndex' && i !== 'Id'));
      result.push({ 'ColumnChange': column, 'Model': item });
      return item;
    });
    return result;
  };

};
