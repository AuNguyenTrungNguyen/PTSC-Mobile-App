import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Appearance, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Dialog from "react-native-dialog";
import Toast from 'react-native-simple-toast';

import { CreateOrUpdateEITCableDamageLogDataAPI, DeleteEITCableDamageLogDataAPI } from '../../../apis/eit/EITAPI';

import Formater from '../../../utils/Formater';
import Networker from '../../../utils/Networker';

import Header from '../../../components/Header';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';

const ElectricalCableDamageLogDataScreen = ({ route, navigation }) => {

  const { rowIndex, projectCode, userLogin, damageLogData } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [damageLog, setDamageLog] = useState({});
  const [columnChange, setColumnChange] = useState([]);

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          {/* {
            rowIndex &&
            <TouchableOpacity
              style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
              onPress={_onPressDelete}>
              <Ionicons
                size={24}
                name={'md-trash-sharp'} color={iconColor} />
            </TouchableOpacity>
          } */}
          <TouchableOpacity
            style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
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
      if (damageLogData) {
        var data = JSON.parse(damageLogData);
        setDamageLog(data);
      }
    }, []
  );

  const callAPI = (executedAPI, loading = true) => {
    if (loading) {
      setIsLoading(true);
    }
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true), setIsUploading(false) });
  };


  //-- Update
  const _onPressSubmitToServer = async () => {
    if (columnChange.length == 0) {
      Toast.show('Without any data changes!', Toast.SHORT);
      return;
    }
    callAPI(updateCableDamageLog, false);
  };
  const updateCableDamageLog = async () => {
    setIsUploading(true);
    CreateOrUpdateEITCableDamageLogDataAPI(damageLog, columnChange)
      .then(res => {
        setIsUploading(false);
        if (res.Success) {
          damageLog['FromNo_m'] = res.Data.FromNo_m;
          damageLog['ToNo_m'] = res.Data.ToNo_m;
          damageLog['ActualLength_m'] = res.Data.ActualLength_m;
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
  };


  //-- Delete
  const _onPressDelete = async () => {
    callAPI(deleteCableDamageLog, false);
  };
  const deleteCableDamageLog = async () => {
    return
    DeleteEITCableDamageLogDataAPI(rowIndex)
      .then(res => {
        setIsUploading(false);
        if (res.Success) {
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
        } else {
          MessageAlert('ERROR', res.Message.toString());
        }
      }).catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  };

  //-- KEY
  const [keyUpdate, setKeyUpdate] = useState('');
  const _onSave = value => {
    if (!columnChange.includes(keyUpdate)) {
      columnChange.push(keyUpdate);
    }
    damageLog[keyUpdate] = value;
  };

  //-- Text
  const [isVisibleText, setIsVisibleText] = useState(false);
  const [textDisplay, setTextDisplay] = useState('');
  const _onPressText = key => {
    setKeyUpdate(key);
    if (damageLog[key] !== null) {
      setTextDisplay(damageLog[key].toString());
    }
    setIsVisibleText(true);
  };
  const _onChangeText = () => {
    _onSave(textDisplay);
    setIsVisibleText(false);
  };

  //-- Text
  const [isVisibleDecimal, setIsVisibleDecimal] = useState(false);
  const [decimalDisplay, setDecimalDisplay] = useState('');
  const _onPressDecimal = key => {
    setKeyUpdate(key);
    if (!damageLog[key]) {
      damageLog[key] = 0;
    }

    setDecimalDisplay(damageLog[key].toString());
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

  //-- Render
  const RenderDetail = () => {
    const isFromNo = columnChange.includes('FromNo_m');
    const isToNo = columnChange.includes('ToNo_m');
    const isRemark = columnChange.includes('Remark');
    return (
      <View style={styles.table}>
        {
          <>
            <View style={styles.box} pointerEvents={isUploading ? 'none' : 'auto'}>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>DrumNo:</Text>
                <View style={styles.cellData}>
                  <View style={styles.containerAction}>
                    <Text style={styles.textBlue}>{Formater.formatEmptyData(damageLog.DrumNo)}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.cellTitle}>DrumFrom:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onPressDecimal('FromNo_m')}>
                    <Text style={isFromNo ? styles.textGreen : styles.textAction}>{Formater.formatTwoDigits(damageLog.FromNo_m)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isFromNo ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>DrumTo:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onPressDecimal('ToNo_m')}>
                    <Text style={isToNo ? styles.textGreen : styles.textAction}>{Formater.formatTwoDigits(damageLog.ToNo_m)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isToNo ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>{'Remark:'}</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onPressText('Remark')}>
                    <Text style={isRemark ? styles.textGreen : styles.textAction}>{Formater.formatEmptyData(damageLog.Remark)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isRemark ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.cellTitle}>ActualLength:</Text>
                <View style={styles.cellData}>
                  <Text style={styles.textBlue}>{Formater.formatTwoDigits(damageLog.ActualLength_m)}</Text>
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
    'UserLogin': userLogin,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} />
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

export default ElectricalCableDamageLogDataScreen;