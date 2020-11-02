import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Moment from 'moment';

import Helper from '../helper/Helper';

export default ({ navigation }) => {

  useEffect(() => {
    const getRoute = async () => {
      let expires = await Helper.getData('EXPIRES');
      if (expires && (Moment.utc(new Date(expires)).valueOf() - Moment.utc(new Date()).valueOf() > 0)) {
        navigation.navigate('Home');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        navigation.navigate('Login');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
      SplashScreen.hide();
    };
    getRoute();
  }, []);

  return (
    <SafeAreaView />
  );
};