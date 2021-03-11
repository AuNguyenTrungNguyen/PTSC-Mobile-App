import React, { useState, useEffect } from 'react';
import { SafeAreaView, Alert, Platform, Linking, View, TouchableOpacity, Text, ActivityIndicator, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import SplashScreen from 'react-native-splash-screen';
import Moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import RNExitApp from 'react-native-exit-app';
import NetInfo from '@react-native-community/netinfo';

import Helper from '../../utils/Helper';
import GetVersionAppAPI from '../../apis/app/GetVersionAppAPI';

const ANDROID_STORE = 'https://play.google.com/store/apps/details?id=com.ptsc_cloud';
const IOS_STORE = 'https://testflight.apple.com/join/4EoDbXUS';

export default ({ navigation }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const version = DeviceInfo.getVersion();
  const buildNumber = DeviceInfo.getBuildNumber();

  useEffect(() => {
    callAPI(getVersionApp);
  }, []);

  const callAPI = executedAPI => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        SplashScreen.hide();
        setIsLoading(false);
        setIsError(true);
      } else {
        executedAPI();
      }
    });
  };

  const getVersionApp = async () => {
    GetVersionAppAPI()
      .then(res => {
        SplashScreen.hide();
        setIsLoading(false);
        setIsError(false);
        getRoute(res);
      })
      .catch(() => {
        SplashScreen.hide();
        setIsLoading(false);
        setIsError(true);
      });
  };

  const getRoute = async res => {
    if (res.version === version && res.buildNumber === buildNumber) {
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
  }

  const BASE_COLOR = '#344955';
  const OPP_COLOR = 'white';
  return (
    <SafeAreaView style={{ flex: 1 }} >
      {
        isLoading
          ?
          <View style={{ width: '100%', height: '100%', justifyContent: 'center', backgroundColor: OPP_COLOR }}>
            <ActivityIndicator size='large' color={BASE_COLOR} />
          </View>
          : isError
            ?
            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: OPP_COLOR, padding: 12 }}>
              <Text style={{ marginTop: 16, color: BASE_COLOR }}>Please check that you are using the company network!</Text>
              <Text style={{ marginTop: 16, color: BASE_COLOR }}>Press to refresh!</Text>
              <TouchableOpacity style={{ marginTop: 16 }} onPress={() => callAPI(getVersionApp)}>
                <Icon name='sync-circle-outline' size={48} color={BASE_COLOR} />
              </TouchableOpacity>
            </View>
            :
            <Image
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode='contain'
              source={require('../../images/waiting.png')}
            />
      }
    </SafeAreaView>
  );
};