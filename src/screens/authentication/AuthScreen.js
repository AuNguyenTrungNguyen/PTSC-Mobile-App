import React, { useEffect } from 'react';
import { SafeAreaView} from 'react-native';
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
      const disciplineCode = await Helper.getData('DISCIPLINE_CODE');
      SplashScreen.hide();

      if (disciplineCode.toUpperCase() === Constant.ROUTE__STRUCTURAL) {
        const roleCode = await Helper.getData('ROLE_CODE');
        navigation.replace(roleCode, {
          screen: Constant.ROUTE__HOME,
          params: { projectCode: projectCode, disciplineCode: disciplineCode }
        });
      } else {
        navigation.replace(Constant.ROUTE__PIPING, {
          screen: 'Home',
          params: { projectCode: projectCode, disciplineCode: disciplineCode }
        });
      }
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
