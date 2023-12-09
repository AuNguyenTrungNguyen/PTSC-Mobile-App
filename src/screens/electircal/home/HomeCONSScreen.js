import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Alert, Appearance, Dimensions, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Helper from '../../../utils/Helper';
import Constant from '../../../utils/Constant';
import Header from '../../../components/Header';
import LoadingRefresh from '../../../components/LoadingRefresh';

const HomeCONSScreen = ({ route, navigation }) => {

  const { projectCode, disciplineCode } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const isFocused = useIsFocused();

  let colorIcon = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={_onPressLogout} style={{ paddingRight: 16 }}>
          <Ionicons name='log-out-outline' size={24} color={colorIcon} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(
    () => {
      // callAPI(getNotifyNumber);
    }, [isFocused]
  );

  const _onPressLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout }
      ],
      { cancelable: false }
    );
  };
  const logout = () => {
    Helper.clearData();
    navigation.replace(Constant.ROUTE__LOGIN);
  };

  //-- ManHours Impact
  const _onPressManHoursImpact = async () => {
    const userLogin = await Helper.getData('USERNAME');
    navigation.navigate(Constant.ROUTE__COMMON, {
      screen: 'ManHoursImpact',
      params: {
        projectCode: projectCode,
        userLogin: userLogin,
      }
    });
  };

  //-- TimeSheet
  const _onPressManageTimeSheet = async () => {
    Alert.alert(
      '',
      'TimeSheet: Company TimeSheet\n\nTimeSheet OT: Company TimeSheet Overtime\n\nTimeSheet Report: TimeSheet Report Overtime',
      [
        { text: 'TimeSheet', onPress: _onPressTimeSheet },
        { text: 'TimeSheet OT', onPress: _onPressTimeSheetYesterday },
        { text: 'TimeSheet Report', onPress: _onPressTimeSheetReport },
        { text: 'Cancel', style: 'cancel' }
      ],
      {
        cancelable: true,
      }
    );
  };
  const _onPressTimeSheet = async () => {
    const userLogin = await Helper.getData('USERNAME');
    navigation.navigate(Constant.ROUTE__COMMON, {
      screen: 'TimeSheet',
      params: {
        projectCode: projectCode,
        userLogin: userLogin,
      }
    });
  };
  const _onPressTimeSheetYesterday = async () => {
    const userLogin = await Helper.getData('USERNAME');
    navigation.navigate(Constant.ROUTE__COMMON, {
      screen: 'TimeSheetOT',
      params: {
        projectCode: projectCode,
        userLogin: userLogin,
      }
    });
  };
  const _onPressTimeSheetReport = async () => {
    const userLogin = await Helper.getData('USERNAME');
    navigation.navigate(Constant.ROUTE__COMMON, {
      screen: 'TimeSheetReport',
      params: {
        projectCode: projectCode,
        userLogin: userLogin,
      }
    });
  };

  //-- Electrical Cable Control
  const _onElectricalCableControl = async () => {
    navigation.navigate(
      'ElectricalCableControlList',
      {
        projectCode: projectCode,
      }
    );
  };

  //-- Instrument Cable Control
  const _onInstrumentCableControl = async () => {
    navigation.navigate(
      'InstrumentCableControlList',
      {
        projectCode: projectCode,
      }
    );
  };

  //-- Electrical Gland Control
  const _onElectricalGlandControl = async () => {
    navigation.navigate(
      'ElectricalGlandControlList',
      {
        projectCode: projectCode,
      }
    );
  };

  //-- Electrical Terminate Control
  const _onElectricalTerminationControl = async () => {
    navigation.navigate(
      'ElectricalTerminationControlList',
      {
        projectCode: projectCode,
      }
    );
  };

  //-- Instrument Gland Control
  const _onInstrumentGlandControl = async () => {
    navigation.navigate(
      'InstrumentGlandControlList',
      {
        projectCode: projectCode,
      }
    );
  };

  //-- Instrument Termination Control
  const _onInstrumentTerminationControl = async () => {
    navigation.navigate(
      'InstrumentTerminationControlList',
      {
        projectCode: projectCode,
      }
    );
  };

  //-- Cable Control Report
  const _onElectricalCableControlReport = async () => {
    const userLogin = await Helper.getData('USERNAME');
    navigation.navigate(
      'CableControlReport',
      {
        projectCode: projectCode,
        userLogin: userLogin,
      }
    );
  };

  //-- Electrical Cable Damage
  const _onElectricalCableDamage = async () => {
    navigation.navigate(
      'ElectricalCableDamageLogList',
      {
        projectCode: projectCode,
      }
    );
  };

  //-- Equipment
  const _onPressManageEquipment = async () => {
    navigation.navigate(Constant.ROUTE__EQUIPMENT, {
      screen: 'WorkRequestList',
    });
  };


  const RenderItemBox = props => {
    let iconName = 'qr-code-outline';
    if (props.iconName) {
      iconName = props.iconName;
    }
    return (
      <View style={styles.cell}>
        {
          !props.disable &&
          <>
            <TouchableOpacity style={styles.itemContainer} onPress={props.onPress} activeOpacity={1}>
              <Text numberOfLines={2} style={styles.itemTitle}>{props.title}</Text>
              {
                props.iconType === 'Material'
                  ?
                  <MaterialIcons name={iconName} size={Dimensions.get('window').height > 700 ? 48 : 36} color={BASE_COLOR} style={styles.itemIcon} />
                  :
                  (
                    props.iconType === 'MaterialCommunity'
                      ?
                      <MaterialCommunityIcons name={iconName} size={Dimensions.get('window').height > 700 ? 48 : 36} color={BASE_COLOR} style={styles.itemIcon} />
                      :
                      <Ionicons name={iconName} size={Dimensions.get('window').height > 700 ? 48 : 36} color={BASE_COLOR} style={styles.itemIcon} />
                  )
              }
            </TouchableOpacity>
            {
              props.number
                ?
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{props.number < 100 ? props.number : '99+'}</Text>
                </View>
                :
                null
            }
          </>
        }
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => { }} />
        :
        <View style={styles.container}>
          <Header data={{ 'Project': projectCode, 'Module': disciplineCode }}></Header>
          <ScrollView style={styles.table}>
            <View style={styles.row}>
              <RenderItemBox title={'TimeSheet\n'} onPress={_onPressManageTimeSheet} />
              <RenderItemBox title={'Man-hours\nImpact'} onPress={_onPressManHoursImpact} />
            </View>
            <View style={styles.row}>
              <RenderItemBox title={'Electrical\nCable Control'} onPress={_onElectricalCableControl} iconName='electrical-services' iconType='Material' />
              <RenderItemBox title={'Instrument\nCable Control'} onPress={_onInstrumentCableControl} iconName='cable-data' iconType='MaterialCommunity' />
            </View>
            <View style={styles.row}>
              <RenderItemBox title={'Electrical\nGland Control'} onPress={_onElectricalGlandControl} iconName='page-layout-header-footer' iconType='MaterialCommunity' />
              <RenderItemBox title={'Instrument\nGland Control'} onPress={_onInstrumentGlandControl} iconName='page-layout-header-footer' iconType='MaterialCommunity' />
            </View>
            <View style={styles.row}>
              <RenderItemBox title={'Electrical\nTermination Control'} onPress={_onElectricalTerminationControl} iconName='transit-connection-horizontal' iconType='MaterialCommunity' />
              <RenderItemBox title={'Instrument\nTermination Control'} onPress={_onInstrumentTerminationControl} iconName='transit-connection-horizontal' iconType='MaterialCommunity' />
            </View>
            <View style={styles.row}>
              <RenderItemBox title={'Cable Control\nReport'} onPress={_onElectricalCableControlReport} iconName='chart-timeline-variant-shimmer' iconType='MaterialCommunity' />
              <RenderItemBox title={'Cable\nDamage Log'} onPress={_onElectricalCableDamage} iconName='relation-only-one-to-zero-or-one' iconType='MaterialCommunity' />
            </View>
            <View style={styles.row}>
              <RenderItemBox title={'Equipment Control'} onPress={_onPressManageEquipment} iconName={'construct-outline'} />
              <RenderItemBox disable={true} />
            </View>
          </ScrollView>
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
    flex: 1,
    padding: 16,
    backgroundColor: OPP_COLOR,
  },

  table: {
    flexGrow: 1,
  },
  line: {
    height: 18,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  itemContainer: {
    width: '90%',
    alignItems: 'center',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 12,
    padding: Dimensions.get('window').height > 700 ? 8 : 4,
  },
  itemTitle: {
    textAlign: 'center',
    color: BASE_COLOR,
    fontSize: Dimensions.get('window').height > 700 ? 16 : 14,
    marginVertical: Dimensions.get('window').height > 700 ? 16 : 12,
    minHeight: 40,
  },
  itemIcon: {
    color: BASE_COLOR,
    marginBottom: Dimensions.get('window').height > 700 ? 8 : 4,
    height: Dimensions.get('window').height > 700 ? 48 : 36,
    width: Dimensions.get('window').height > 700 ? 48 : 36,
  },
  badgeContainer: {
    width: 36,
    height: 36,
    padding: 2,
    borderRadius: 36 / 2,
    backgroundColor: '#FF8C00',
    position: 'absolute',
    top: -36 / 2,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: OPP_COLOR,
    fontWeight: 'bold'
  },
});

export default HomeCONSScreen;