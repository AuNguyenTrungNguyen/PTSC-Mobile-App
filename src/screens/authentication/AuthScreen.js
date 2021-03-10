import React, { useEffect } from 'react';
import { SafeAreaView, Alert, Platform, Linking } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import RNExitApp from 'react-native-exit-app';

import Helper from '../../utils/Helper';

const ANDROID_STORE = 'https://play.google.com/store/apps/details?id=com.ptsc_cloud';
const IOS_STORE = 'https://testflight.apple.com/join/4EoDbXUS';

export default ({ navigation }) => {

  const version = DeviceInfo.getVersion();
  const buildNumber = DeviceInfo.getBuildNumber();

  const newVersion = '2.0';
  const newBuildNumber = '21';

  useEffect(() => {
    getRoute();
  }, []);

  const getRoute = async () => {
    SplashScreen.hide();
    if (version === newVersion && buildNumber === newBuildNumber) {
      let expires = await Helper.getData('EXPIRES');
      if (expires && (Moment.utc(new Date(expires)).valueOf() - Moment.utc(new Date()).valueOf() > 0)) {
        let projectCode = await Helper.getData('PROJECT_CODE');
        let disciplineCode = await Helper.getData('DISCIPLINE_CODE');
        navigation.replace('Home', { projectCode: projectCode, disciplineCode: disciplineCode });
      } else {
        Helper.clearData();
        navigation.replace('Login');
      }
    } else {
      Alert.alert(
        'WARNING',
        'The application has a new version.',
        [
          {
            text: 'Use Old',
            style: 'default',
            onPress: continueOldVersion,
          },
          {
            text: 'Get New',
            style: 'default',
            onPress: updateNewVersion,
          },
        ],
        { cancelable: false },
      );
    }
  };

  const continueOldVersion = async () => {
    Helper.clearData();
    navigation.replace('Login');
  };

  const updateNewVersion = async () => {
    Helper.clearData();
    const link = Platform.OS === 'android' ? ANDROID_STORE : IOS_STORE;
    await Linking.openURL(link);
    RNExitApp.exitApp();
  };

  return (
    <SafeAreaView style={{ flex: 1 }} >
    </SafeAreaView>
  );
};