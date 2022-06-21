import NetInfo from '@react-native-community/netinfo';
import MessageAlert from '../components/MessageAlert';

export default class Networker {
  static callAPI = async (executedAPI, errorAPI) => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        if (errorAPI != null) {
          () => { errorAPI() }
        }
        MessageAlert('WARNING', 'Network not available!');
      } else {
        () => { executedAPI() }
      }
    });
  };
};
