import AsyncStorage from '@react-native-community/async-storage';
import MessageAlert from '../components/CustomViews/MessageAlert';

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
  
};
