import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Appearance, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Toast from 'react-native-simple-toast';

import { GetPipeSupportDetailAPI, UpdatePipeSupportDetailAPI } from '../../../apis/piping/ConstructionAPI';

import Formater from '../../../utils/Formater';
import Networker from '../../../utils/Networker';

import Header from '../../../components/Header';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';

const PipeSupportDetailScreen = ({ route, navigation }) => {

  const { projectCode, facilityCode, supportName } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [columnChange, setColumnChange] = useState([]);
  const [supportDetail, setSupportDetail] = useState({});

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
      callAPI(getSupportDetail);
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

  const callAPI = (executedAPI, loading = true) => {
    if (loading) {
      setIsLoading(true);
    }
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true), setIsUploading(false) });
  };

  const getSupportDetail = () => {
    GetPipeSupportDetailAPI(projectCode, facilityCode, supportName)
      .then(res => {
        if (res.Success) {
          setSupportDetail(res.Data);
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

  const updateSupportDetail = async () => {
    setIsUploading(true);
    UpdatePipeSupportDetailAPI(supportDetail, columnChange)
      .then(res => {
        setIsUploading(false);
        if (res.Success) {
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
          setColumnChange([]);
        } else {
          MessageAlert('Lỗi', res.Message.toString());
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
    callAPI(updateSupportDetail, false);
  };

  //-- Update data
  const [keyUpdate, setKeyUpdate] = useState('');
  const _onSelectDate = key => {
    setKeyUpdate(key);
    var date = Formater.formatDateZero(supportDetail[key]);
    setDateDisplay(date);
    setIsVisibleDate(true);
  };

  const [isVisibleDate, setIsVisibleDate] = useState(false);
  const [dateDisplay, setDateDisplay] = useState(null);
  const _onChangeDate = (selectedDate) => {
    if (selectedDate != undefined) {
      supportDetail[keyUpdate] = Formater.formatDateZero(selectedDate);

      //-- Save change
      if (!columnChange.includes(keyUpdate)) {
        columnChange.push(keyUpdate);
      }
    }
    setIsVisibleDate(false);
  };

  //-- Render
  const RenderDetail = () => {
    const isFabWS_CuttingDate = columnChange.includes('FabWS_CuttingDate');
    const isFabWS_FitupDate = columnChange.includes('FabWS_FitupDate');
    const isFabWS_WeldDate = columnChange.includes('FabWS_WeldDate');
    const isInstallationPipeSupport_Fitup = columnChange.includes('InstallationPipeSupport_Fitup');
    const isInstallationPipeSupport_Welding = columnChange.includes('InstallationPipeSupport_Welding');
    const isSentToPainting = columnChange.includes('SentToPainting');
    const isCompletedPainting = columnChange.includes('CompletedPainting');
    const isFitupToSite = columnChange.includes('FitupToSite');
    const isWeldToSite = columnChange.includes('WeldToSite');
    return (
      <View style={styles.table}>
        {
          <>
            <View style={styles.box} pointerEvents={isUploading ? 'none' : 'auto'}>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>FabWS_Cutting:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => { _onSelectDate('FabWS_CuttingDate') }}>
                    <Text style={isFabWS_CuttingDate ? styles.textGreen : styles.textAction}>{Formater.formatDateData(supportDetail.FabWS_CuttingDate)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isFabWS_CuttingDate ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>FabWS_Fitup:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onSelectDate('FabWS_FitupDate')}>
                    <Text style={isFabWS_FitupDate ? styles.textGreen : styles.textAction}>{Formater.formatDateData(supportDetail.FabWS_FitupDate)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isFabWS_FitupDate ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>FabWS_Weld:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onSelectDate('FabWS_WeldDate')}>
                    <Text style={isFabWS_WeldDate ? styles.textGreen : styles.textAction}>{Formater.formatDateData(supportDetail.FabWS_WeldDate)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isFabWS_WeldDate ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.line} />

              <View style={styles.row}>
                <Text style={styles.cellTitle}>Installation_Fitup:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onSelectDate('InstallationPipeSupport_Fitup')}>
                    <Text style={isInstallationPipeSupport_Fitup ? styles.textGreen : styles.textAction}>{Formater.formatDateData(supportDetail.InstallationPipeSupport_Fitup)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isInstallationPipeSupport_Fitup ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>Installation_Welding:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onSelectDate('InstallationPipeSupport_Welding')}>
                    <Text style={isInstallationPipeSupport_Welding ? styles.textGreen : styles.textAction}>{Formater.formatDateData(supportDetail.InstallationPipeSupport_Welding)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isInstallationPipeSupport_Welding ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.line} />

              <View style={styles.row}>
                <Text style={styles.cellTitle}>SentToPainting:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onSelectDate('SentToPainting')}>
                    <Text style={isSentToPainting ? styles.textGreen : styles.textAction}>{Formater.formatDateData(supportDetail.SentToPainting)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isSentToPainting ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>CompletedPainting:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onSelectDate('CompletedPainting')}>
                    <Text style={isCompletedPainting ? styles.textGreen : styles.textAction}>{Formater.formatDateData(supportDetail.CompletedPainting)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isCompletedPainting ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.line} />

              <View style={styles.row}>
                <Text style={styles.cellTitle}>FitupToSite:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onSelectDate('FitupToSite')}>
                    <Text style={isFitupToSite ? styles.textGreen : styles.textAction}>{Formater.formatDateData(supportDetail.FitupToSite)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isFitupToSite ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>WeldToSite:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onSelectDate('WeldToSite')}>
                    <Text style={isWeldToSite ? styles.textGreen : styles.textAction}>{Formater.formatDateData(supportDetail.WeldToSite)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isWeldToSite ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
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
    );
  };

  const headerData = {
    'ProjectCode': projectCode,
    'FacilityCode': facilityCode,
    'SupportName': supportName,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => { callAPI(getSupportDetail) }} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show &&
              <Header data={headerData} />
            }
            <RenderDetail />
          </View>
      }
      <DateTimePickerModal
        isVisible={isVisibleDate}
        date={dateDisplay}
        mode={'date'}
        onConfirm={_onChangeDate}
        onCancel={() => { setIsVisibleDate(false) }}
      />
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

export default PipeSupportDetailScreen;