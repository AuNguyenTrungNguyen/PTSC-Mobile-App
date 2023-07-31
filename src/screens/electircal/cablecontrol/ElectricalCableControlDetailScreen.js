import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Appearance, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Dialog from "react-native-dialog";
import Toast from 'react-native-simple-toast';

import { GetElectricalCableControlDetailAPI, UpdateElectricalCableControlDetailAPI } from '../../../apis/eit/EITAPI';

import Formater from '../../../utils/Formater';
import Networker from '../../../utils/Networker';

import Header from '../../../components/Header';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';

const ElectricalCableControlDetailScreen = ({ route, navigation }) => {

  const { projectCode, facilityCode, cableName, rowIndex, userLogin } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [columnChange, setColumnChange] = useState([]);
  const [cableDetail, setCableDetail] = useState({});
  const [disableUpdate, setDisableUpdate] = useState(false);

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
      if (route.params?.drumNoSelected) {
        _onChangeNewDrumNo(route.params?.drumNoSelected);
      }
      else {
        callAPI(getCableDetail);
      }
    }, [route.params?.drumNoSelected]
  );

  const [isRender, setIsRender] = useState(null);
  useEffect(
    () => { }, [isRender]
  );

  const callAPI = (executedAPI, loading = true) => {
    if (loading) {
      setIsLoading(true);
    }
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true), setIsUploading(false) });
  };

  //-- Get
  async function getCableDetail() {
    GetElectricalCableControlDetailAPI(rowIndex)
      .then(res => {
        if (res.Success && res.Data) {
          setCableDetail(res.Data);

          const datePulling = res.Data.DatePulling;
          if (datePulling) {
            let current = new Date();
            current.setSeconds(current.getSeconds() - (current.getTimezoneOffset() * 60));
            let date = new Date(datePulling);
            date.setSeconds(date.getSeconds() - (date.getTimezoneOffset() * 60));
            var diffHours = (current.getTime() - date.getTime()) / (1000 * 3600);
            if (diffHours > 48) {
              setDisableUpdate(true);
            }
          } else {
            setDisableUpdate(false);
          }

          setIsLoading(false);
          setIsError(false);
          setIsUploading(false);
        } else {
          setIsLoading(false);
          setIsError(true);
          setIsUploading(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsUploading(false);
      });
  };

  //-- Update
  const updateCableDetail = async () => {
    setIsUploading(true);
    UpdateElectricalCableControlDetailAPI(cableDetail, columnChange)
      .then(res => {
        setIsUploading(false);
        if (res.Success) {
          cableDetail['ActualLength_m'] = res.Data.ActualLength_m;
          cableDetail['DeviationCONSAndDE'] = res.Data.DeviationCONSAndDE;
          cableDetail['DatePulling'] = res.Data.DatePulling;
          cableDetail['PullingByUser'] = res.Data.PullingByUser;
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
          setColumnChange([]);
        } else {
          MessageAlert('ERROR', res.Message.toString());
        }
      }).catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsUploading(false);
      });
  }
  const _onPressSubmitToServer = async () => {
    if (columnChange.length == 0) {
      Toast.show('Without any data changes!', Toast.SHORT);
      return;
    }
    callAPI(updateCableDetail, false);
  };

  //-- Select
  const _onPressSelect = async () => {
    setKeyUpdate('NewDrumNo');
    navigation.navigate(
      'DrumNoList',
      {
        projectCode: projectCode,
        source: 'Electrical'
      }
    );
  };
  const _onChangeNewDrumNo = newDrum => {
    _onSave(newDrum);
    setIsRender(new Date());
  };

  //-- KEY
  const [keyUpdate, setKeyUpdate] = useState('');
  const _onSave = value => {
    //-- Save change
    if (!columnChange.includes(keyUpdate)) {
      columnChange.push(keyUpdate);
    }
    cableDetail[keyUpdate] = value;
  };

  //-- Text
  const [isVisibleText, setIsVisibleText] = useState(false);
  const [textDisplay, setTextDisplay] = useState('');
  const _onPressText = key => {
    setKeyUpdate(key);
    if (cableDetail[key] !== null) {
      setTextDisplay(cableDetail[key].toString());
    }
    setIsVisibleText(true);
  };
  const _onChangeText = () => {
    _onSave(textDisplay);
    setIsVisibleText(false);
  };

  //-- Decimal
  const [isVisibleDecimal, setIsVisibleDecimal] = useState(false);
  const [decimalDisplay, setDecimalDisplay] = useState('');
  const _onPressDecimal = key => {
    setKeyUpdate(key);
    if (!cableDetail[key]) {
      cableDetail[key] = 0;
    }
    setDecimalDisplay(cableDetail[key].toString());
    setIsVisibleDecimal(true);
  };
  const _onChangeDecimal = () => {
    let value = decimalDisplay.replace(/,/g, '.');
    value = parseFloat(decimalDisplay);
    if (value < 0) {
      Toast.show(keyUpdate + ' must be greater than 0.', Toast.SHORT);
      return;
    }
    _onSave(value);
    setIsVisibleDecimal(false);
  };

  //-- Clear
  const _onPressClear = () => {
    const valueClear = null;
    if (!columnChange.includes('NewDrumNo')) {
      columnChange.push('NewDrumNo');
    }
    cableDetail['NewDrumNo'] = cableDetail['DrumNo'];

    if (!columnChange.includes('FromNo_m')) {
      columnChange.push('FromNo_m');
    }
    cableDetail['FromNo_m'] = valueClear;

    if (!columnChange.includes('ToNo_m')) {
      columnChange.push('ToNo_m');
    }
    cableDetail['ToNo_m'] = valueClear;
    setIsRender(new Date());
  };

  //-- Render
  const RenderDetail = () => {
    const isNewDrumNo = columnChange.includes('NewDrumNo');
    const isFromNo = columnChange.includes('FromNo_m');
    const isToNo = columnChange.includes('ToNo_m');
    const disableClear = cableDetail.DatePulling == null || cableDetail.PullingByUser != userLogin;
    return (
      <View style={styles.table}>
        {
          <>
            <View style={styles.box} pointerEvents={isUploading || disableUpdate ? 'none' : 'auto'}>
              <View style={styles.rowAction}>
                <Text style={styles.cellTitle}></Text>
                {
                  disableClear
                    ?
                    <View style={styles.cellData}>
                      <TouchableOpacity
                        style={styles.itemActionDisable}
                        disabled={true}>
                        <Text style={styles.itemText}>Clear</Text>
                      </TouchableOpacity>
                    </View>
                    :
                    <View style={styles.cellData}>
                      <TouchableOpacity
                        style={styles.itemAction}
                        onPress={_onPressClear}>
                        <Text style={styles.itemText}>Clear</Text>
                      </TouchableOpacity>
                    </View>
                }
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>CableFrom:</Text>
                <View style={styles.cellData}>
                  <View style={styles.containerAction}>
                    <Text style={styles.textBlue}>{Formater.formatEmptyData(cableDetail.FromEquipmentNo)}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>CableTo:</Text>
                <View style={styles.cellData}>
                  <View style={styles.containerAction}>
                    <Text style={styles.textBlue}>{Formater.formatEmptyData(cableDetail.ToEquipmentNo)}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>DE DrumNo:</Text>
                <View style={styles.cellData}>
                  <View style={styles.containerAction}>
                    <Text style={styles.textBlue}>{Formater.formatEmptyData(cableDetail.DrumNo)}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.cellTitle}>{'Actual\nDrumNo:'}</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={_onPressSelect}>
                    <Text style={isNewDrumNo ? styles.textGreen : styles.textAction}>{Formater.formatEmptyData(cableDetail.NewDrumNo)}</Text>
                    {
                      disableUpdate
                        ?
                        <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={'#a3a3a3'} />
                        :
                        <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isNewDrumNo ? EDITING_COLOR : BASE_COLOR} />
                    }
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>DrumFrom:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onPressDecimal('FromNo_m')}>
                    <Text style={isFromNo ? styles.textGreen : styles.textAction}>{Formater.formatTwoDigits(cableDetail.FromNo_m)}</Text>
                    {
                      disableUpdate
                        ?
                        <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={'#a3a3a3'} />
                        :
                        <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isFromNo ? EDITING_COLOR : BASE_COLOR} />
                    }
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>DrumTo:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onPressDecimal('ToNo_m')}>
                    <Text style={isToNo ? styles.textGreen : styles.textAction}>{Formater.formatTwoDigits(cableDetail.ToNo_m)}</Text>
                    {
                      disableUpdate
                        ?
                        <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={'#a3a3a3'} />
                        :
                        <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isToNo ? EDITING_COLOR : BASE_COLOR} />
                    }
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>ActualLength:</Text>
                <View style={styles.cellData}>
                  <Text style={styles.textBlue}>{Formater.formatTwoDigits(cableDetail.ActualLength_m)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>{'DeviationLength:\n(Between CONS And DE)'}</Text>
                <View style={styles.cellData}>
                  <Text style={styles.textBlue}>{Formater.formatTwoDigits(cableDetail.DeviationCONSAndDE)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.actionContainer}>
              {
                isUploading
                  ?
                  <TouchableOpacity style={styles.button}>
                    <ActivityIndicator size='large' color={'white'} />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={styles.button} onPress={_onPressSubmitToServer}>
                    <Text style={styles.buttonTitle}>Submit to Server</Text>
                  </TouchableOpacity>
              }
            </View>
          </>
        }
      </View >
    );
  };

  const headerData = {
    'ProjectCode': projectCode,
    'FacilityCode': facilityCode,
    'CableName': cableName,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => { callAPI(getCableDetail) }} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show &&
              <Header data={headerData} />
            }
            <RenderDetail />
          </View>
      }
      <Dialog.Container visible={isVisibleText}>
        <Dialog.Title>{`Update ${keyUpdate}`}</Dialog.Title>
        <Dialog.Input
          value={textDisplay}
          onChangeText={(text) => setTextDisplay(text)}
          underlineColorAndroid={BASE_COLOR}
        />
        <Dialog.Button label='Cancel' onPress={() => { setIsVisibleText(false) }} />
        <Dialog.Button label='OK' onPress={_onChangeText} />
      </Dialog.Container>
      <Dialog.Container visible={isVisibleDecimal}>
        <Dialog.Title>{`Update ${keyUpdate}`}</Dialog.Title>
        <Dialog.Input
          value={decimalDisplay}
          onChangeText={(text) => setDecimalDisplay(text)}
          underlineColorAndroid={BASE_COLOR}
          keyboardType={'numeric'}
        />
        <Dialog.Button label='Cancel' onPress={() => { setIsVisibleDecimal(false) }} />
        <Dialog.Button label='OK' onPress={_onChangeDecimal} />
      </Dialog.Container>
    </SafeAreaView>
  );
};

const BASE_COLOR = '#344955';
const OPP_COLOR = 'white';
const EDITING_COLOR = 'green';
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
  rowAction: {
    flexDirection: 'row',
    marginVertical: 0,
    marginHorizontal: 4,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: BASE_COLOR,
  },
  cellTitle: {
    flex: 1,
  },
  cellData: {
    flex: 1,
    fontWeight: 'bold',
    color: BASE_COLOR,
    alignItems: 'flex-end'
  },
  itemAction: {
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
  },
  itemActionDisable: {
    backgroundColor: '#cccccc',
    borderColor: '#999999',
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
  },
  itemText: {
    color: BASE_COLOR,
    fontWeight: 'bold',
    fontStyle: 'italic',
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

export default ElectricalCableControlDetailScreen;