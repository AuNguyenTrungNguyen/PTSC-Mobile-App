import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CheckBox from '@react-native-community/checkbox';
import Dialog from 'react-native-dialog';
import AwesomeAlert from 'react-native-awesome-alerts';

import { GetManHoursImpactListAPI } from '../../../apis/general/GeneralAPI';

import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';
import CoreStyle from '../../../utils/CoreStyle';
import Header from '../../../components/Header';
import { ListEmptyData } from '../../../components/HelperUI';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';

const ManHoursImpactListScreen = ({ route, navigation }) => {

  const { projectCode, userLogin } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [manHoursImpactList, setManHoursImpactList] = useState([]);

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

  useEffect(
    () => {
      callAPI(getManHoursImpactList);
    }, []
  );

  const toggle = () => {
    setIsShowDescription(prevState => {
      return {
        show: !prevState.show,
        name: prevState.name === 'arrow-up-circle-outline' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'
      }
    });
  };

  const callAPI = executedAPI => {
    setIsLoading(true);
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoading(false);
        setIsError(true);
        MessageAlert('WARNING', 'Network not available!');
      } else {
        executedAPI();
      }
    });
  };

  const getManHoursImpactList = async () => {
    let token = await Helper.getData('TOKEN');
    GetManHoursImpactListAPI('GALLAF', userLogin, token)
      .then(res => {
        if (res.success) {
          setManHoursImpactList(res.data);
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

  const _onPressViewDetail = item => {
    navigation.navigate(
      'ManHoursImpactDetail',
      {
        projectCode: projectCode,
        facilityCode: item.Facility,
        companyCode: item.CompanyCode,
        workOrder: item.WorkOrder,
        userLogin: userLogin,
      }
    );
  };





  const renderItem = ({ index, item }) => {
    return (
      <TouchableOpacity onPress={() => { _onPressViewDetail(item) }}>
        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>WorkOrder: </Text>
            <Text style={styles.cellData}>{Formater.formatEmptyData(item.WorkOrder)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>WODes: </Text>
            <Text style={styles.cellData}>{Formater.formatEmptyData(item.WorkOrderName)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLine}>Budget:</Text>
            <Text style={styles.cellLineData}>{Formater.formatTwoDigits(item.BudgetMHRS)}</Text>
            <Text style={styles.cellLine}>Actual:</Text>
            <Text style={styles.cellLineData}>{Formater.formatTwoDigits(item.ActualMHRS)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLine}>Earn:</Text>
            <Text style={styles.cellLineData}>{Formater.formatTwoDigits(item.EarnMHRS)}</Text>
            <Text style={styles.cellLine}>Waste:</Text>
            <Text style={styles.cellLineData}>{Formater.formatTwoDigits(item.WasteMHRS)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLine}>Remain:</Text>
            <Text style={styles.cellLineData}>{Formater.formatTwoDigits(item.RemainMHRS)}</Text>
            <View style={styles.cellLine} />
            <View style={styles.cellLineData} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const RenderManHoursImpactList = () => {
    return (
      manHoursImpactList.length
        ?
        <>
          <Text style={CoreStyle.textNote}>* Click an item to create impact</Text>
          <VirtualizedList
            style={styles.table}
            data={manHoursImpactList}
            getItemCount={data => data.length}
            getItem={(data, index) => {
              return data[index];
            }}
            keyExtractor={(item, index) => index}
            renderItem={renderItem}
          />
        </>
        :
        <ListEmptyData />
    );
  };

  const headerData = {
    'ProjectCode': projectCode,
    'TeamLeader': userLogin,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => { callAPI(getManHoursImpactList) }} />
        :
        <View style={styles.container}>
          {
            isShowDescription.show &&
            <Header data={headerData} />
          }
          <RenderManHoursImpactList />
        </View>
      }
      {/* <DateTimePickerModal
        isVisible={isShowPicker}
        date={dateDisplay}
        mode={'date'}
        onConfirm={_onChangeDate}
        onCancel={() => { setIsShowPicker(false) }}
      />
      <SelectPopup
        visible={isShowWorkOrder}
        data={workOrderList}
        onChangeItem={_onChangeWorkOrder}
        onCancel={() => setIsShowWorkOrder(false)}
      />
      <Dialog.Container visible={isShowDialog}>
        <Dialog.Title>{'Enter hours:'}</Dialog.Title>
        <Dialog.Input
          value={timeDisplay}
          onChangeText={(text) => setTimeDisplay(text)}
          underlineColorAndroid={BASE_COLOR}
          keyboardType={'numeric'}
        />
        <Dialog.Button label='Cancle' onPress={() => { setIsShowDialog(false) }} />
        <Dialog.Button label='OK' onPress={_onChangeTime} />
      </Dialog.Container>
      <AwesomeAlert
        show={isUploading}
        showProgress={true}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
      /> */}
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
    alignItems: 'center',
    minHeight: 16,
    marginBottom: 4,
  },
  cellTitle: {
    height: '100%'
    // flex: 3,
  },
  cellData: {
    flex: 1,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  cellLine: {
    flex: 1,
  },
  cellLineData: {
    flex: 2,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
});

export default ManHoursImpactListScreen;