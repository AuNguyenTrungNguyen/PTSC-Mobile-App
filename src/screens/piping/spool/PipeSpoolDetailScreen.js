import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Appearance, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Toast from 'react-native-simple-toast';

import { GetPipeSpoolDetailAPI, UpdatePipeSpoolDetailAPI } from '../../../apis/piping/ConstructionAPI';

import Formater from '../../../utils/Formater';
import Networker from '../../../utils/Networker';

import Header from '../../../components/Header';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';

const PipeSpoolDetailScreen = ({ route, navigation }) => {

  const { projectCode, facilityCode, spoolNo } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [columnChange, setColumnChange] = useState([]);
  const [spoolDetail, setSpoolDetail] = useState({});

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
      callAPI(getSpoolDetail);
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

  const getSpoolDetail = () => {
    GetPipeSpoolDetailAPI(projectCode, facilityCode, spoolNo)
      .then(res => {
        if (res.Success) {
          setSpoolDetail(res.Data);
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

  const updateSpoolDetail = async () => {
    setIsUploading(true);
    UpdatePipeSpoolDetailAPI(spoolDetail, columnChange)
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
    callAPI(updateSpoolDetail, false);
  };

  //-- Update data
  const [keyUpdate, setKeyUpdate] = useState('');
  const _onSelectDate = key => {
    setKeyUpdate(key);
    var date = Formater.formatDateZero(spoolDetail[key]);
    setDateDisplay(date);
    setIsVisibleDate(true);
  };

  const [isVisibleDate, setIsVisibleDate] = useState(false);
  const [dateDisplay, setDateDisplay] = useState(null);
  const _onChangeDate = (selectedDate) => {
    if (selectedDate != undefined) {
      spoolDetail[keyUpdate] = Formater.formatDateZero(selectedDate);

      //-- Save change
      if (!columnChange.includes(keyUpdate)) {
        columnChange.push(keyUpdate);
      }
    }
    setIsVisibleDate(false);
  };

  //-- Render
  const RenderDetail = () => {
    return (
      <View style={styles.table}>
        {
          <>
            <View style={styles.box} pointerEvents={isUploading ? 'none' : 'auto'}>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>FittingLastDate:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => { _onSelectDate('FittingLastDate') }}>
                    <Text style={styles.textAction}>{Formater.formatDateData(spoolDetail.FittingLastDate)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>WeldingLastDate:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onSelectDate('WeldingLastDate')}>
                    <Text style={styles.textAction}>{Formater.formatDateData(spoolDetail.WeldingLastDate)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.line} />

              <View style={styles.row}>
                <Text style={styles.cellTitle}>ReleaseForPaintingDate:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onSelectDate('ReleaseForPaintingDate')}>
                    <Text style={styles.textAction}>{Formater.formatDateData(spoolDetail.ReleaseForPaintingDate)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.line} />

              <View style={styles.row}>
                <Text style={styles.cellTitle}>SpoolOutFromBP:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onSelectDate('SpoolOutFromBP')}>
                    <Text style={styles.textAction}>{Formater.formatDateData(spoolDetail.SpoolOutFromBP)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>SpoolRigupToSite:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onSelectDate('SpoolRigupToSite')}>
                    <Text style={styles.textAction}>{Formater.formatDateData(spoolDetail.SpoolRigupToSite)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} />
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
    'SpoolNo': spoolNo,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => { callAPI(getSpoolDetail) }} />
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

export default PipeSpoolDetailScreen;