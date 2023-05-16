import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Moment from 'moment';
import Constant from '../../utils/Constant';
import Helper from '../../utils/Helper';

const AuthScreen = ({ navigation }) => {

  useEffect(() => {
    // callAPI(getVersionApp);
    getRoute();
  }, []);

  const getRoute = async () => {
    const expires = await Helper.getData('EXPIRES');
    if (expires && (Moment.utc(new Date(expires)).valueOf() - Moment.utc(new Date()).valueOf() > 0)) {
      const projectCode = await Helper.getData('PROJECT_CODE');
      const subContractor = await Helper.getData('SUB_CONTRACTOR');
      const disciplineCode = await Helper.getData('DISCIPLINE_CODE');
      const roleCode = await Helper.getData('ROLE_CODE');
      SplashScreen.hide();
      navigation.replace(roleCode, {
        screen: Constant.ROUTE__HOME,
        params: { projectCode: projectCode, disciplineCode: disciplineCode, subContractor: subContractor }
      });
    } else {
      Helper.clearData();
      SplashScreen.hide();
      navigation.replace(Constant.ROUTE__LOGIN);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} >
    </SafeAreaView>
  );
};

export default AuthScreen;
