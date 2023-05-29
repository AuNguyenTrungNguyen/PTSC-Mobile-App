import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Appearance } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import { GetElectricalCableControlReportAPI } from '../../../apis/eit/EITAPI';

import Formater from '../../../utils/Formater';
import Networker from '../../../utils/Networker';

import Header from '../../../components/Header';
import LoadingRefresh from '../../../components/LoadingRefresh';

const ElectricalCableControlReportScreen = ({ route, navigation }) => {

  const { projectCode, userLogin } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [cableDetail, setCableDetail] = useState({});

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}
            onPress={toggle}>
            <Ionicons
              size={24}
              name={isShowDescription.name} color={iconColor} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, isShowDescription]);
  const toggle = () => {
    setIsShowDescription(prevState => {
      return {
        show: !prevState.show,
        name: prevState.name === 'arrow-up-circle-outline' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'
      }
    });
  };

  useEffect(
    () => {
      callAPI(getCableReport);
    }, []
  );

  const callAPI = (executedAPI) => {
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true) });
  };

  //-- Get
  const getCableReport = () => {
    GetElectricalCableControlReportAPI(projectCode, userLogin)
      .then(res => {
        if (res.Success && res.Data) {
          setCableDetail(res.Data);
          setIsLoading(false);
          setIsError(false);
        } else {
          setIsLoading(false);
          setIsError(true);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  };

  //-- Render
  const RenderDetail = () => {
    return (
      <View style={styles.table}>
        {
          <>
            <View style={styles.box}>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>
                  <Text>Daily </Text>
                  <Text style={styles.textBold}>{Formater.formatDateData(cableDetail.Current)}</Text>
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>{'Num of\nCables'}:</Text>
                <View style={styles.cellData}>
                  <Text style={styles.textBlue}>{Formater.formatZeroDigits(cableDetail.DailyCount)}</Text>
                </View>
                <Text style={styles.cellTitle}>{'Total\nLength'}:</Text>
                <View style={styles.cellData}>
                  <Text style={styles.textGreen}>{Formater.formatTwoDigits(cableDetail.DailyLenght)}</Text>
                </View>
              </View>
            </View>
            <View style={styles.box}>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>
                  <Text>{'Weekly (from '}</Text>
                  <Text style={styles.textBold}>{Formater.formatDateData(cableDetail.WeekStart)}</Text>
                  <Text>{' to '}</Text>
                  <Text style={styles.textBold}>{Formater.formatDateData(cableDetail.WeekEnd)}</Text>
                  <Text>{')'}</Text>
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>{'Num of\nCables'}:</Text>
                <View style={styles.cellData}>
                  <Text style={styles.textBlue}>{Formater.formatZeroDigits(cableDetail.WeeklyCount)}</Text>
                </View>
                <Text style={styles.cellTitle}>{'Total\nLength'}:</Text>
                <View style={styles.cellData}>
                  <Text style={styles.textGreen}>{Formater.formatTwoDigits(cableDetail.WeeklyLength)}</Text>
                </View>
              </View>
            </View>
            <View style={styles.box}>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>
                  <Text>{'Monthly (from '}</Text>
                  <Text style={styles.textBold}>{Formater.formatDateData(cableDetail.MonthStart)}</Text>
                  <Text>{' to '}</Text>
                  <Text style={styles.textBold}>{Formater.formatDateData(cableDetail.MonthEnd)}</Text>
                  <Text>{')'}</Text>
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>{'Num of\nCables'}:</Text>
                <View style={styles.cellData}>
                  <Text style={styles.textBlue}>{Formater.formatZeroDigits(cableDetail.MonthlyCount)}</Text>
                </View>
                <Text style={styles.cellTitle}>{'Total\nLength'}:</Text>
                <View style={styles.cellData}>
                  <Text style={styles.textGreen}>{Formater.formatTwoDigits(cableDetail.MonthlyLength)}</Text>
                </View>
              </View>
            </View>
          </>
        }
      </View >
    );
  };

  const headerData = {
    'ProjectCode': projectCode,
    'UserLogin': userLogin,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => { callAPI(getCableReport) }} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show &&
              <Header data={headerData} />
            }
            <RenderDetail />
          </View>
      }
    </SafeAreaView>
  );
};

const BASE_COLOR = '#344955';
const OPP_COLOR = 'white';
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: OPP_COLOR,
  },
  container: {
    padding: 12,
    flex: 1,
    backgroundColor: OPP_COLOR,
  },

  table: {
    flexGrow: 1,
  },
  box: {
    width: '100%',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 12,
    marginHorizontal: 4,
  },
  cellTitle: {
    flex: 1,
  },
  cellData: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  textBold: {
    fontWeight: 'bold',
  },
  textGreen: {
    flexWrap: 'wrap',
    flexShrink: 1,
    fontWeight: 'bold',
    color: 'green',
  },
  textBlue: {
    flexWrap: 'wrap',
    flexShrink: 1,
    fontWeight: 'bold',
    color: 'blue',
  },
});

export default ElectricalCableControlReportScreen;