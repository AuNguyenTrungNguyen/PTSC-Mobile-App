import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Appearance } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import NetInfo from '@react-native-community/netinfo';
import Dialog from 'react-native-dialog';
import AwesomeAlert from 'react-native-awesome-alerts';
import Toast from 'react-native-simple-toast';

import { UpdateManHoursImpactDetailAPI } from '../../../apis/general/GeneralAPI';
import { GetFactorTypeAPI } from '../../../apis/app/AppAPI';

import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';
import Header from '../../../components/Header';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';
import SelectPopup from '../../../components/SelectPopup';
import { set } from 'react-native-reanimated';

const ManHoursImpactDetailScreen = ({ route, navigation }) => {

  const { projectCode, facilityCode, companyCode, workOrder, userLogin } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [manHoursImpactDetail, setManHoursImpactDetail] = useState({});

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
      callAPI(getFactorType);
      setManHoursImpactDetail({
        ProjectCode: projectCode,
        FacilityCode: facilityCode,
        CompanyCode: companyCode,
        Description: 'Mobile_Test',
        WorkOrderNo: workOrder,
        Mhrs: 0,
        Date: new Date(),
        FactorType: '',
        SubFactorType: '',
        Remark: '',
      });
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

  const callAPI = (executedAPI, showUI = false) => {
    if (!showUI) {
      setIsLoading(true);
    }
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

  const getFactorType = async () => {
    let token = await Helper.getData('TOKEN');
    GetFactorTypeAPI('GALLAF03', token)
      .then(res => {
        if (res.success) {
          setFactorTypeList(res.factorTypeList);
          setSubFactorTypeList(res.subFactorTypeList);
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

  const updateManHoursImpactDetail = async () => {
    let token = await Helper.getData('TOKEN');
    UpdateManHoursImpactDetailAPI(userLogin, manHoursImpactDetail, token)
      .then(res => {
        if (res.success) {
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
        } else {
          Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        }
        console.log(res.Message.toString());
        setIsUploading(false);
      }).catch((e) => {
        console.log(e);
        Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        setIsUploading(false);
      });
  }

  const _onPressSubmitToServer = async () => {
    if (true) {
      setIsUploading(true);
      callAPI(updateManHoursImpactDetail, true);
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
  };

  const [isVisibleMhrs, setIsVisibleMhrs] = useState(false);
  const [mhrs, setMhrs] = useState(0);
  const _onChangeMhrs = () => {
    if (!mhrs) {
      setMhrs('');
    }
    let value = mhrs.replace(/,/g, '.');
    if (!Helper.checkFormatNumber(value)) {
      Toast.show('Please enter Mhrs must be a number.', Toast.SHORT);
      return;
    }
    value = parseFloat(mhrs);
    manHoursImpactDetail.Mhrs = value;
    setIsVisibleMhrs(false);
  };

  const [isVisibleFactorType, setIsVisibleFactorType] = useState(false);
  const [factorTypeList, setFactorTypeList] = useState([]);
  const _onChangeFactorType = type => {
    manHoursImpactDetail.FactorType = type;
    const typeNumber = parseInt(type.substring(0, 2));
    const subTypeDisplay = [];
    subFactorTypeList.map( item => {
      const subTypeNumber = parseInt(item.substring(0, item.indexOf('.')));
      if(typeNumber === subTypeNumber){
        subTypeDisplay.push(item);
      }
      return item;
    });
    setSubFactorTypeListDisplay(subTypeDisplay);
    manHoursImpactDetail.SubFactorType = '';
    setIsVisibleFactorType(false);
  };

  const [isVisibleSubFactorType, setIsVisibleSubFactorType] = useState(false);
  const [subFactorTypeList, setSubFactorTypeList] = useState([]);
  const [subFactorTypeListDisplay, setSubFactorTypeListDisplay] = useState([]);
  const _onChangeSubFactorType = type => {
    manHoursImpactDetail.SubFactorType = type;
    setIsVisibleSubFactorType(false);
  };

  const [isVisibleRemark, setIsVisibleRemark] = useState(false);
  const [remark, setRemark] = useState('');
  const _onChangeRemark = () => {
    manHoursImpactDetail.Remark = remark;
    setIsVisibleRemark(false);
  };

  const _onPressManageImage = () => {
    navigation.navigate(
      'ManHoursImpactImage',
      {
        projectCode: projectCode,
        facilityCode: facilityCode,
        companyCode: companyCode,
        workOrderNo: workOrder,
        userLogin: userLogin,
        factorType: manHoursImpactDetail.FactorType,
        date: Formater.formatDateData(manHoursImpactDetail.Date)
      }
    );
  };





  const RenderManHoursImpactDetail = () => {
    return (
      <View style={styles.table}>
        {
          <>
            <View style={styles.box}>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>WorkOrderNo:</Text>
                <Text style={styles.cellData}>{Formater.formatEmptyData(workOrder)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>Date:</Text>
                <Text style={styles.cellData}>{Formater.formatDateData(manHoursImpactDetail.Date)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>Mhrs:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => { setIsVisibleMhrs(true) }}>
                    <Text style={styles.textAction}>{Formater.formatTwoDigits(manHoursImpactDetail.Mhrs)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>FactorType:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => { setIsVisibleFactorType(true) }}>
                    <Text style={styles.textAction}>{Formater.formatEmptyData(manHoursImpactDetail.FactorType)}</Text>
                    <Ionicons style={styles.iconAction} name='md-list' size={20} color={BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>SubFactorType:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => { setIsVisibleSubFactorType(true) }}>
                    <Text style={styles.textAction}>{Formater.formatEmptyData(manHoursImpactDetail.SubFactorType)}</Text>
                    <Ionicons style={styles.iconAction} name='md-list' size={20} color={BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>Remark:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => { setIsVisibleRemark(true) }}>
                    <Text style={styles.textAction}>{Formater.formatEmptyData(manHoursImpactDetail.Remark)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>Pictures:</Text>
                <TouchableOpacity style={styles.cellData} onPress={_onPressManageImage}>
                  <Ionicons style={styles.iconAction} name='md-image-outline' size={20} color={BASE_COLOR} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.button} onPress={_onPressSubmitToServer}>
                <Text style={styles.buttonTitle}>Submit to Server</Text>
              </TouchableOpacity>
            </View>
          </>
        }
      </View>
    );
  };

  const headerData = {
    'TeamLeader': userLogin,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => { callAPI(getFactorType) }} />
        :
        <View style={styles.container}>
          {
            isShowDescription.show &&
            <Header data={headerData} />
          }
          <RenderManHoursImpactDetail />
        </View>
      }
      <Dialog.Container visible={isVisibleMhrs}>
        <Dialog.Title>{'Enter Mhrs'}</Dialog.Title>
        <Dialog.Input
          value={mhrs}
          onChangeText={(text) => setMhrs(text)}
          underlineColorAndroid={BASE_COLOR}
        />
        <Dialog.Button label='Cancle' onPress={() => {
          setIsVisibleMhrs(false);
          setMhrs(manHoursImpactDetail.Mhrs);
        }} />
        <Dialog.Button label='Enter' onPress={_onChangeMhrs} />
      </Dialog.Container>
      <SelectPopup
        visible={isVisibleFactorType}
        data={factorTypeList}
        onChangeItem={_onChangeFactorType}
        onCancel={() => setIsVisibleFactorType(false)} />
      <SelectPopup
        visible={isVisibleSubFactorType}
        data={subFactorTypeListDisplay}
        onChangeItem={_onChangeSubFactorType}
        onCancel={() => setIsVisibleSubFactorType(false)} />
      <Dialog.Container visible={isVisibleRemark}>
        <Dialog.Title>{'Enter Remark'}</Dialog.Title>
        <Dialog.Input
          multiline={true}
          numberOfLines={7}
          value={remark}
          onChangeText={(text) => setRemark(text)}
          underlineColorAndroid={BASE_COLOR}
        />
        <Dialog.Button label='Cancle' onPress={() => {
          setIsVisibleRemark(false);
          setRemark(manHoursImpactDetail.Remark);
        }} />
        <Dialog.Button label='Enter' onPress={_onChangeRemark} />
      </Dialog.Container>
      <AwesomeAlert
        show={isUploading}
        showProgress={true}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
      />
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
    marginVertical: 8,
    marginHorizontal: 4,
  },
  cellTitle: {
    flex: 4,
  },
  cellData: {
    flex: 8,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  containerAction: {
    flexDirection: 'row',
  },
  textAction: {
    flexWrap: 'wrap',
    flexShrink: 1,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  iconAction: {
    marginLeft: 4,
    width: 20,
    height: 20,
  },

  actionContainer: {
    marginTop: 12,
    height: 36,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
  },
  buttonTitle: {
    color: OPP_COLOR,
  },
});

export default ManHoursImpactDetailScreen;