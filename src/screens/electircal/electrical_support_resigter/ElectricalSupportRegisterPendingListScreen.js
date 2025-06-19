import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance, TextInput, Keyboard, ActivityIndicator } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Toast from 'react-native-simple-toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useIsFocused } from '@react-navigation/native';

import Helper from '../../../utils/Helper';
import Constant from '../../../utils/Constant';
import Formater from '../../../utils/Formater';
import Networker from '../../../utils/Networker';

import { GetFacilityListAPI } from '../../../apis/app/AppAPI';
import { GetElectricalSupportRegisterPendingListAPI, UpdateElectricalSupportRegisterPendingListAPI } from '../../../apis/eit/EITAPI';

import SelectPopup from '../../../components/SelectPopup';
import { ListSelectData, ListLoadingData, ListEmptyData } from '../../../components/HelperUI';
import LoadingRefresh from '../../../components/LoadingRefresh';

const ElectricalSupportRegisterPendingListScreen = ({ route, navigation }) => {

  const { projectCode, code } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [drawingNo, setDrawingNo] = useState('');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [EITItems, setEITItems] = useState(null);
  const [EITUpdateItems, setEITUpdateItems] = useState([]);

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => { setIsVisibleResult(true) }}>
            <Ionicons
              size={24}
              name={'md-ellipsis-vertical-circle'} color={iconColor} />
          </TouchableOpacity>
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

  const callAPI = executedAPI => {
    setIsSearching(true);
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true), setIsSearching(false) });
  };

  useEffect(
    () => {
      callAPI(getFacilityList);
    }, []
  );

  const isFocused = useIsFocused();
  useEffect(
    () => {
      callAPI(getEITItems);
    }, [isFocused]
  );

  //-- Facility Code
  const FACILITY_CODE_DEFAULT = 'All Facility Code';
  const [isVisibleFacility, setIsVisibleFacility] = useState(false);
  const [facilityList, setFacilityList] = useState([]);
  const [facilityCode, setFacilityCode] = useState(FACILITY_CODE_DEFAULT);
  const getFacilityList = async () => {
    const token = await Helper.getData('TOKEN');
    GetFacilityListAPI(projectCode, token)
      .then(res => {
        if (res.success) {
          setFacilityList(res.data);
          setIsLoading(false);
          setIsError(false);
          setIsSearching(false);
        } else {
          setIsLoading(false);
          setIsError(true);
          setIsSearching(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsSearching(false);
      });
  };
  const _onChangeFacilityCode = code => {
    if (code !== facilityCode) {
      setFacilityCode(code);
    }
    setIsVisibleFacility(false);
  };
  const _onPressClearFacilityCode = () => {
    if (facilityCode !== FACILITY_CODE_DEFAULT) {
      setFacilityCode(FACILITY_CODE_DEFAULT);
    }
    setIsVisibleFacility(false);
  };

  //-- Search Action
  const _onPressSearchCable = () => {
    Keyboard.dismiss();
    callAPI(getEITItems);
  };
  async function getEITItems(filterResult = result) {
    const facility = (facilityCode && facilityCode != FACILITY_CODE_DEFAULT) ? facilityCode : '';
    GetElectricalSupportRegisterPendingListAPI(projectCode, facility, drawingNo, location, name, code, filterResult)
      .then(res => {
        if (res.Success && res.Data) {
          setEITItems(res.Data);
          setIsLoading(false);
          setIsError(false);
          setIsSearching(false);
        } else {
          setIsLoading(false);
          setIsError(true);
          setIsSearching(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsSearching(false);
      });
  };
  const _onChangeDrawingNo = value => {
    setDrawingNo(value);
  };
  const _onChangeLocation = value => {
    setLocation(value);
  };
  const _onChangeName = value => {
    setName(value);
  };

  //-- Result
  const [result, setResult] = useState(Constant.RESULT_EMPTY);
  const [isVisibleResult, setIsVisibleResult] = useState(false);
  const _onChangeResult = data => {
    if (data != result) {
      setResult(data);
      callAPI(() => { getEITItems(data) });
    }
    setIsVisibleResult(false);
  };
  const _onClearResult = () => {
    setResult(Constant.RESULT_EMPTY);
    callAPI(() => { getEITItems(Constant.RESULT_EMPTY) });
    setIsVisibleResult(false);
  };

  //-- KEY
  const _onPressChangeStatus = (index, key, value) => {

    //-- Current Data
    setEITItems((prevState) =>
      prevState.map((item) =>
        item.RowIndex == index ? { ...item, [key]: value } : item
      )
    );

    //-- Update Data
    setEITUpdateItems((prevState) => {
      const existingChange = prevState.find((item) => item.RowIndex == index);

      if (existingChange) {
        return prevState.map((item) =>
          item.RowIndex == index ? { ...item, [key]: value } : item
        );
      } else {
        return [...prevState, { RowIndex: index, [key]: value }];
      }
    });
  };

  //-- UPDATE
  const submitToServer = async () => {
    const listUpdate = Helper.handleListUpdate(EITUpdateItems);
    setIsUploading(true);
    UpdateElectricalSupportRegisterPendingListAPI(listUpdate)
      .then(res => {
        if (res.success) {
          setEITUpdateItems([]);
          callAPI(getEITItems);
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
        } else {
          Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        }
        setIsUploading(false);
      }).catch(() => {
        Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        setIsUploading(false);
      });
  };
  const _onPressSubmitToServer = async () => {
    if (EITUpdateItems.length == 0) {
      Toast.show('Without any data changes!', Toast.SHORT);
      return;
    }
    callAPI(submitToServer);
  };

  //-- Render List
  const renderItem = ({ _, item }) => {
    const isDisableResult = !!result;

    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>Facility:</Text>
          </View>
          <View style={styles.cellTwo}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.FacilityCode)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>DrawingNo:</Text>
          </View>
          <View style={styles.cellTwo}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.DetailDrawingNo)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>Location:</Text>
          </View>
          <View style={styles.cellTwo}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.Location)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>{'Support\nName:'}</Text>
          </View>
          <View style={styles.cellTwo}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.SupportName)}</Text>
          </View>
        </View>
        {
          code == Constant.CODE_FAB
            ?
            <>
              <View style={styles.row}>
                <View style={styles.cellOne}>
                  <Text>{'FabResult:'}</Text>
                </View>
                <View style={styles.cellTwo}>
                  {
                    item.CheckedFabResult == Constant.STATUS_ACCEPT
                      ?
                      <Text style={styles.textAccept}>{Formater.formatEmptyData(item.CheckedFabResult)}</Text>
                      :
                      item.CheckedFabResult == Constant.STATUS_REJECT
                        ?
                        <Text style={styles.textReject}>{Formater.formatEmptyData(item.CheckedFabResult)}</Text>
                        :
                        <Text style={styles.textData}>{Formater.formatEmptyData(item.CheckedFabResult)}</Text>
                  }
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOne}>
                </View>
                <View style={styles.cellOne}>
                  <TouchableOpacity
                    disabled={isDisableResult}
                    style={isDisableResult ? styles.disabledButton : styles.buttonAccept}
                    onPress={() => _onPressChangeStatus(item.RowIndex, 'CheckedFabResult', Constant.STATUS_ACCEPT)}>
                    <Text style={isDisableResult ? styles.disabledLabel : styles.labelAccept}>Accept</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.cellOne}>
                  <TouchableOpacity
                    disabled={isDisableResult}
                    style={isDisableResult ? styles.disabledButton : styles.buttonReject}
                    onPress={() => _onPressChangeStatus(item.RowIndex, 'CheckedFabResult', Constant.STATUS_REJECT)}>
                    <Text style={isDisableResult ? styles.disabledLabel : styles.labelReject}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
            :
            code == Constant.CODE_FITUP
              ?
              <>
                <View style={styles.row}>
                  <View style={styles.cellOne}>
                    <Text>{'InstallResult\n(FitUp):'}</Text>
                  </View>
                  <View style={styles.cellTwo}>
                    {
                      item.CheckedFitUpResult == Constant.STATUS_ACCEPT
                        ?
                        <Text style={styles.textAccept}>{Formater.formatEmptyData(item.CheckedFitUpResult)}</Text>
                        :
                        item.CheckedFitUpResult == Constant.STATUS_REJECT
                          ?
                          <Text style={styles.textReject}>{Formater.formatEmptyData(item.CheckedFitUpResult)}</Text>
                          :
                          <Text style={styles.textData}>{Formater.formatEmptyData(item.CheckedFitUpResult)}</Text>
                    }
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.cellOne}>
                  </View>
                  <View style={styles.cellOne}>
                    <TouchableOpacity
                      disabled={isDisableResult}
                      style={isDisableResult ? styles.disabledButton : styles.buttonAccept}
                      onPress={() => _onPressChangeStatus(item.RowIndex, 'CheckedFitUpResult', Constant.STATUS_ACCEPT)}>
                      <Text style={isDisableResult ? styles.disabledLabel : styles.labelAccept}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.cellOne}>
                    <TouchableOpacity
                      disabled={isDisableResult}
                      style={isDisableResult ? styles.disabledButton : styles.buttonReject}
                      onPress={() => _onPressChangeStatus(item.RowIndex, 'CheckedFitUpResult', Constant.STATUS_REJECT)}>
                      <Text style={isDisableResult ? styles.disabledLabel : styles.labelReject}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
              :
              <>
                <View style={styles.row}>
                  <View style={styles.cellOne}>
                    <Text>{'InstallResult\n(Weld):'}</Text>
                  </View>
                  <View style={styles.cellTwo}>
                    {
                      item.CheckedInstallResult == Constant.STATUS_ACCEPT
                        ?
                        <Text style={styles.textAccept}>{Formater.formatEmptyData(item.CheckedInstallResult)}</Text>
                        :
                        item.CheckedInstallResult == Constant.STATUS_REJECT
                          ?
                          <Text style={styles.textReject}>{Formater.formatEmptyData(item.CheckedInstallResult)}</Text>
                          :
                          <Text style={styles.textData}>{Formater.formatEmptyData(item.CheckedInstallResult)}</Text>
                    }
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.cellOne}>
                  </View>
                  <View style={styles.cellOne}>
                    <TouchableOpacity
                      disabled={isDisableResult}
                      style={isDisableResult ? styles.disabledButton : styles.buttonAccept}
                      onPress={() => _onPressChangeStatus(item.RowIndex, 'CheckedInstallResult', Constant.STATUS_ACCEPT)}>
                      <Text style={isDisableResult ? styles.disabledLabel : styles.labelAccept}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.cellOne}>
                    <TouchableOpacity
                      disabled={isDisableResult}
                      style={isDisableResult ? styles.disabledButton : styles.buttonReject}
                      onPress={() => _onPressChangeStatus(item.RowIndex, 'CheckedInstallResult', Constant.STATUS_REJECT)}>
                      <Text style={isDisableResult ? styles.disabledLabel : styles.labelReject}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
        }
      </View>
    );
  };
  const RenderList = () => {
    {
      if (isSearching) {
        return <ListLoadingData />
      } else if (!EITItems) {
        return <ListSelectData title={'Please enter Cable Name'} />
      } else {
        return <ListEmptyData />
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getEITItems)} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show
                ?
                (<View style={styles.headerContainer}>
                  <View style={styles.rowInfo}>
                    <Text style={styles.infoTitle}>ProjectCode:</Text>
                    <Text style={styles.infoData}>{projectCode}</Text>
                  </View>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction}>FacilityCode:</Text>
                    <TouchableOpacity style={styles.selectContainer} onPress={() => { setIsVisibleFacility(true) }}>
                      <Text style={styles.buttonTitleDark}>{facilityCode}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction}>DrawingNo:</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.inputText}
                        value={drawingNo}
                        onChangeText={_onChangeDrawingNo}
                        underlineColorAndroid='transparent'
                      />
                      {
                        drawingNo == ''
                          ? null
                          : <Icon name='times-circle' onPress={() => _onChangeDrawingNo('')} style={styles.inputIcon} />
                      }
                    </View>
                  </View>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction}>Location:</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.inputText}
                        value={location}
                        onChangeText={_onChangeLocation}
                        underlineColorAndroid='transparent'
                      />
                      {
                        location == ''
                          ? null
                          : <Icon name='times-circle' onPress={() => _onChangeLocation('')} style={styles.inputIcon} />
                      }
                    </View>
                  </View>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction}>Name:</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.inputText}
                        value={name}
                        onChangeText={_onChangeName}
                        underlineColorAndroid='transparent'
                      />
                      {
                        name == ''
                          ? null
                          : <Icon name='times-circle' onPress={() => _onChangeName('')} style={styles.inputIcon} />
                      }
                    </View>
                  </View>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction} />
                    <TouchableOpacity
                      style={styles.searchButton}
                      onPress={_onPressSearchCable}
                      disabled={isSearching}>
                      <Text style={styles.buttonTitle}>Search</Text>
                    </TouchableOpacity>
                  </View>
                </View>)
                :
                null
            }
            {
              EITItems && EITItems.length
                ?
                <VirtualizedList
                  style={styles.table}
                  data={EITItems}
                  getItemCount={data => data.length}
                  getItem={(data, index) => {
                    return data[index];
                  }}
                  keyExtractor={(item, index) => item.RowIndex}
                  renderItem={renderItem}
                />
                :
                <RenderList />
            }
            <View style={styles.actionContainer}>
              {
                isUploading
                  ?
                  <TouchableOpacity style={styles.submitButton}>
                    <ActivityIndicator size='large' color={'white'} />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={styles.submitButton} onPress={_onPressSubmitToServer}>
                    <Text style={styles.buttonTitle}>Submit to Server</Text>
                  </TouchableOpacity>
              }
            </View>
          </View>
      }
      <SelectPopup
        visible={isVisibleFacility}
        data={facilityList}
        onCancel={() => setIsVisibleFacility(false)}
        onClear={_onPressClearFacilityCode}
        onChangeItem={_onChangeFacilityCode}>
      </SelectPopup>
      <SelectPopup
        visible={isVisibleResult}
        data={[Constant.RESULT_ACCEPT, Constant.RESULT_REJECT]}
        onCancel={() => setIsVisibleResult(false)}
        onClear={_onClearResult}
        onChangeItem={_onChangeResult}>
      </SelectPopup>
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

  headerContainer: {
    marginBottom: 8,
    padding: 4,
    paddingBottom: 0,
  },
  rowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    marginBottom: 4,
  },
  infoTitle: {
    flex: 3,
  },
  infoData: {
    flex: 7,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  rowInfoAction: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    marginBottom: 4,
  },
  infoTitleAction: {
    flex: 3,
  },
  selectContainer: {
    flex: 7,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    height: '100%',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    flex: 7,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    height: '100%',
    padding: 4,
    borderRadius: 2,
    alignItems: 'center',
  },
  inputText: {
    flex: 1,
    height: '100%',
    color: BASE_COLOR,
    paddingVertical: 0,
    justifyContent: 'center'
  },
  inputIcon: {
    marginLeft: 4,
    fontSize: 20,
    color: BASE_COLOR,
  },
  searchButton: {
    flex: 7,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    height: '100%',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
    borderRadius: 2,
  },

  table: {
    flexGrow: 1,
  },
  box: {
    flexDirection: 'column',
    width: '100%',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 8,
  },
  disabledBox: {
    backgroundColor: 'lightgray',
    flexDirection: 'column',
    borderColor: 'red',
    width: '100%',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 4,
    minHeight: 20,
  },
  cellOne: {
    flex: 1,
    justifyContent: 'center',
  },
  cellOneRow: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cellTwo: {
    flex: 2,
    justifyContent: 'center',
  },
  cellTwoRow: {
    flex: 2,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  textData: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  textAccept: {
    fontWeight: 'bold',
    color: 'green',
  },
  textReject: {
    fontWeight: 'bold',
    color: 'red',
  },
  textUpdated: {
    fontWeight: 'bold',
    color: 'green',
  },
  textPending: {
    fontWeight: 'bold',
    color: 'orange',
  },
  checkBox: {
    fontWeight: 'bold',
    color: BASE_COLOR,
    width: 20,
    height: 20,
    marginLeft: 8,
    marginRight: 8,
  },
  checkBoxDisabled: {
    fontWeight: 'bold',
    color: DISABLE_COLOR,
    width: 20,
    height: 20,
    marginLeft: 8,
    marginRight: 8,
  },

  actionContainer: {
    marginTop: 12,
    height: 36,
    flexDirection: 'row',
  },
  submitButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
  },
  buttonTitle: {
    color: OPP_COLOR,
  },
  buttonTitleDark: {
    color: BASE_COLOR,
  },

  disabledButton: {
    width: 70,
    borderColor: DISABLE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  disabledLabel: {
    color: DISABLE_COLOR,
  },
  buttonAccept: {
    width: 70,
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelAccept: {
    color: 'green',
  },
  buttonReject: {
    width: 70,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelReject: {
    color: 'red',
  },
});

export default ElectricalSupportRegisterPendingListScreen;