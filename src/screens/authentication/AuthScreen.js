import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Moment from 'moment';

import Helper from '../../utils/Helper';

export default ({ navigation }) => {

  useEffect(() => {
    const getRoute = async () => {
      let expires = await Helper.getData('EXPIRES');
      if (expires && (Moment.utc(new Date(expires)).valueOf() - Moment.utc(new Date()).valueOf() > 0)) {
        let projectCode = await Helper.getData('PROJECT_CODE');
        let disciplineCode = await Helper.getData('DISCIPLINE_CODE');
        navigation.replace('Home', { projectCode: projectCode, disciplineCode: disciplineCode });
      } else {
        navigation.replace('Login');
      }
      SplashScreen.hide();
    };
    getRoute();
  }, []);

  return (
    <SafeAreaView />
  );
};