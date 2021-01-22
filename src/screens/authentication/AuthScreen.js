import React, { useEffect } from 'react';
import { SafeAreaView, Alert, Platform, Linking } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import RNExitApp from 'react-native-exit-app';

import Helper from '../../utils/Helper';

const ANDROID_STORE = 'https://play.google.com/store/apps/details?id=com.ptsc_cloud';
const IOS_STORE = 'https://testflight.apple.com/join/4EoDbXUS';
const LATEST_VERSION = '2.0';
const LATEST_BUILD_NUMBER = '19';

export default ({ navigation }) => {

  const version = DeviceInfo.getVersion();
  const buildNumber = DeviceInfo.getBuildNumber();

  useEffect(() => {
    const getRoute = async () => {
      if (version === LATEST_VERSION && buildNumber === LATEST_BUILD_NUMBER) {
        let expires = await Helper.getData('EXPIRES');
        if (expires && (Moment.utc(new Date(expires)).valueOf() - Moment.utc(new Date()).valueOf() > 0)) {
          let projectCode = await Helper.getData('PROJECT_CODE');
          let disciplineCode = await Helper.getData('DISCIPLINE_CODE');
          navigation.replace('Home', { projectCode: projectCode, disciplineCode: disciplineCode });
        } else {
          navigation.replace('Login');
        }
        SplashScreen.hide();
      } else {
        Helper.clearData();
        SplashScreen.hide();
        Alert.alert(
          'Update New Version',
          'Please update the new version to continue using the app.',
          [
            {
              text: 'Update and Reopen',
              onPress: updateNewVersion,
            },
          ],
          { cancelable: false },
        );
      }
    };
    getRoute();
  }, []);

  const updateNewVersion = async () => {
    if (Platform.OS === 'android') {
      await Linking.openURL(ANDROID_STORE);
      RNExitApp.exitApp();
    } else {
      await Linking.openURL(IOS_STORE);
      RNExitApp.exitApp();
    }
  };

  return (
    <SafeAreaView />
  );
};