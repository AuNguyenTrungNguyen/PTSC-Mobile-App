import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Appearance, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CheckBox from '@react-native-community/checkbox';
import Toast from 'react-native-simple-toast';

import { GetInstrumentGlandControlDetailAPI, UpdateInstrumentGlandControlDetailAPI } from '../../../apis/eit/EITAPI';

import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';
import Networker from '../../../utils/Networker';

import Header from '../../../components/Header';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';

const InstrumentGlandControlDetailScreen = ({ route, navigation }) => {

  const { projectCode, facilityCode, cableName, rowIndex, userLogin } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [columnChange, setColumnChange] = useState([]);
  const [glandDetail, setGlandDetail] = useState({});

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
      callAPI(getCableDetail);
    }, []
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
    GetInstrumentGlandControlDetailAPI(rowIndex)
      .then(res => {
        if (res.Success && res.Data) {
          setGlandDetail(res.Data);
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
    UpdateInstrumentGlandControlDetailAPI(glandDetail, columnChange)
      .then(res => {
        setIsUploading(false);
        if (res.Success) {
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

  //-- KEY
  const _onSaveByKey = (key, value) => {
    //-- Save change
    if (!columnChange.includes(key)) {
      columnChange.push(key);
    }
    glandDetail[key] = value;
  };

  //-- Checkbox
  const _onChangeCheckbox = (key, data) => {
    if (data) {
      data = Helper.getDatetimeWithoutTimezone();
    } else {
      data = null;
    }
    _onSaveByKey(key, data);
  };

  //-- Clear
  const _onPressClear = () => {
    const valueClear = null;

    if (!columnChange.includes('StatusFromGlandingDate')) {
      columnChange.push('StatusFromGlandingDate');
    }
    glandDetail['StatusFromGlandingDate'] = valueClear;

    if (!columnChange.includes('StatusToGlandingDate')) {
      columnChange.push('StatusToGlandingDate');
    }
    glandDetail['StatusToGlandingDate'] = valueClear;
    setIsRender(new Date());
  };

  //-- Render
  const RenderDetail = () => {
    const isFromUpdated = !!glandDetail.StatusFromGlandingDate;
    const isToUpdated = !!glandDetail.StatusToGlandingDate;
    const disableClear = glandDetail.GlandByUser != userLogin || (!glandDetail.StatusFromGlandingDate && !glandDetail.StatusToGlandingDate);
    const isPulled = glandDetail.PullingByUser
    return (
      <>
        {
          !isPulled &&
          <Text style={styles.textInfo}>This cable hasn't been pulled</Text>
        }
        <View style={styles.table}>
          {
            <>
              <View style={styles.box} pointerEvents={(isUploading || !isPulled) ? 'none' : 'auto'}>
                <View style={styles.rowAction}>
                  <Text style={styles.cellTitle}></Text>
                  {
                    disableClear
                      ?
                      <View style={styles.cellData}>
                        <TouchableOpacity
                          disabled={true}
                          style={styles.itemActionDisable}>
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
                  <Text style={styles.cellTitle}>From:</Text>
                  <View style={styles.cellData}>
                    <View style={styles.containerAction}>
                      <Text style={styles.textBlue}>{Formater.formatEmptyData(glandDetail.FromEquipmentNo)}</Text>
                    </View>
                  </View>
                  {
                    isPulled
                      ?
                      <CheckBox
                        value={isFromUpdated}
                        onValueChange={newValue => _onChangeCheckbox('StatusFromGlandingDate', newValue)}
                        style={styles.checkBox}
                        boxType='square'
                        disabled={isFromUpdated}
                        onCheckColor={OPP_COLOR}
                        onFillColor={isFromUpdated ? DISABLE_COLOR : BASE_COLOR}
                        onTintColor={isFromUpdated ? DISABLE_COLOR : BASE_COLOR}
                        tintColors={{ true: BASE_COLOR, false: DISABLE_COLOR }}
                        animationDuration={0.2}
                        onAnimationType='flat'
                      />
                      :
                      <CheckBox
                        value={isFromUpdated}
                        onValueChange={null}
                        style={styles.checkBoxDisabled}
                        boxType='square'
                        disabled={true}
                        onCheckColor={OPP_COLOR}
                        onFillColor={isFromUpdated ? DISABLE_COLOR : BASE_COLOR}
                        onTintColor={isFromUpdated ? DISABLE_COLOR : BASE_COLOR}
                        tintColors={{ true: BASE_COLOR, false: DISABLE_COLOR }}
                        animationDuration={0.2}
                        onAnimationType='flat'
                      />
                  }
                </View>
                <View style={styles.row}>
                  <Text style={styles.cellTitle}>FromType:</Text>
                  <View style={styles.cellData}>
                    <View style={styles.containerAction}>
                      <Text style={styles.textBlue}>{Formater.formatEmptyData(glandDetail.FromGlandType)}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.row}>
                  <Text style={styles.cellTitle}>FromSize:</Text>
                  <View style={styles.cellData}>
                    <View style={styles.containerAction}>
                      <Text style={styles.textBlue}>{Formater.formatEmptyData(glandDetail.FromGlandSize)}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.line} />
                <View style={styles.row}>
                  <Text style={styles.cellTitle}>To:</Text>
                  <View style={styles.cellData}>
                    <View style={styles.containerAction}>
                      <Text style={styles.textBlue}>{Formater.formatEmptyData(glandDetail.ToEquipmentNo)}</Text>
                    </View>
                  </View>
                  {
                    isPulled
                      ?
                      <CheckBox
                        value={isToUpdated}
                        onValueChange={newValue => _onChangeCheckbox('StatusToGlandingDate', newValue)}
                        style={styles.checkBox}
                        boxType='square'
                        disabled={isToUpdated}
                        onCheckColor={OPP_COLOR}
                        onFillColor={isToUpdated ? DISABLE_COLOR : BASE_COLOR}
                        onTintColor={isToUpdated ? DISABLE_COLOR : BASE_COLOR}
                        tintColors={{ true: BASE_COLOR, false: DISABLE_COLOR }}
                        animationDuration={0.2}
                        onAnimationType='flat'
                      />
                      :
                      <CheckBox
                        value={isToUpdated}
                        onValueChange={null}
                        style={styles.checkBoxDisabled}
                        boxType='square'
                        disabled={true}
                        onCheckColor={OPP_COLOR}
                        onFillColor={isToUpdated ? DISABLE_COLOR : BASE_COLOR}
                        onTintColor={isToUpdated ? DISABLE_COLOR : BASE_COLOR}
                        tintColors={{ true: BASE_COLOR, false: DISABLE_COLOR }}
                        animationDuration={0.2}
                        onAnimationType='flat'
                      />
                  }
                </View>
                <View style={styles.row}>
                  <Text style={styles.cellTitle}>ToType:</Text>
                  <View style={styles.cellData}>
                    <View style={styles.containerAction}>
                      <Text style={styles.textBlue}>{Formater.formatEmptyData(glandDetail.ToGlandType)}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.row}>
                  <Text style={styles.cellTitle}>ToSize:</Text>
                  <View style={styles.cellData}>
                    <View style={styles.containerAction}>
                      <Text style={styles.textBlue}>{Formater.formatEmptyData(glandDetail.ToGlandSize)}</Text>
                    </View>
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
        </View>
      </>
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
    </SafeAreaView>
  );
};

const BASE_COLOR = '#344955';
const OPP_COLOR = 'white';
const DISABLE_COLOR = '#aaaaaa';
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

  textInfo: {
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 8
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
  checkBox: {
    fontWeight: 'bold',
    color: BASE_COLOR,
    width: 20,
    height: 20,
    marginLeft: 8,
  },
  checkBoxDisabled: {
    backgroundColor: DISABLE_COLOR,
    fontWeight: 'bold',
    color: DISABLE_COLOR,
    width: 20,
    height: 20,
    marginLeft: 8,
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

export default InstrumentGlandControlDetailScreen;