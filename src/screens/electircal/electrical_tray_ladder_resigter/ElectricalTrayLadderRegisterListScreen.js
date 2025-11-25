import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance, TextInput, Keyboard, ActivityIndicator } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Dialog from "react-native-dialog";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useIsFocused } from '@react-navigation/native';

import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';
import Networker from '../../../utils/Networker';

import { GetFacilityListAPI } from '../../../apis/app/AppAPI';
import { GetElectricalTrayLadderRegisterListAPI, UpdateElectricalTrayLadderRegisterListAPI } from '../../../apis/eit/EITAPI';

import SelectPopup from '../../../components/SelectPopup';
import { ListSelectData, ListLoadingData, ListEmptyData } from '../../../components/HelperUI';
import LoadingRefresh from '../../../components/LoadingRefresh';

const ElectricalTrayLadderRegisterListScreen = ({ route, navigation }) => {

  const { projectCode } = route.params;

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
    setIsSearching(false);
  };

  useEffect(
    () => {
      callAPI(getFacilityList);
    }, []
  );

  const isFocused = useIsFocused();
  useEffect(() => {
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
  async function getEITItems() {
    const facility = (facilityCode && facilityCode != FACILITY_CODE_DEFAULT) ? facilityCode : '';
    GetElectricalTrayLadderRegisterListAPI(projectCode, facility, drawingNo, location, name)
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

  //-- Checkbox
  const _onChangeCheckbox = (index, key, data) => {
    var temp = null;
    if (data) {
      temp = Helper.getDatetimeWithoutTimezone();
    }
    updateValue(index, key, temp);
  };

  //-- Percentage
  const [isVisiblePercent, setIsVisiblePercent] = useState(false);
  const [percentDisplay, setPercentDisplay] = useState('');
  const _onPressSelectPercent = (index, key, data) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    if (data) {
      setPercentDisplay(data.toString());
    } else {
      setPercentDisplay('');
    }
    setIsVisiblePercent(true);
  };
  const _onChangePercent = () => {
    let value = percentDisplay.replace(/,/g, '.');
    setPercentDisplay(value);
    if (!Helper.checkFormatNumber(value)) {
      Toast.show('Please enter ' + keyUpdate + ' must be a number.', Toast.SHORT);
      return;
    }
    value = parseFloat(value);
    if (value && (value < 0 || value > 100)) {
      Toast.show(keyUpdate + ' must be from 0 to 100.', Toast.SHORT);
      return;
    }
    updateValue(indexUpdate, keyUpdate, value / 100);
    setIsVisiblePercent(false);
  };

  //-- Length
  const [isVisibleLength, setIsVisibleLength] = useState(false);
  const [lengthDisplay, setLengthDisplay] = useState('');
  const _onPressSelectLength = (index, key, data) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    if (data) {
      setLengthDisplay(data.toString());
    } else {
      setLengthDisplay('');
    }
    setIsVisibleLength(true);
  };
  const _onChangeLength = () => {
    let value = lengthDisplay.replace(/,/g, '.');
    setLengthDisplay(value);
    if (!Helper.checkFormatNumber(value)) {
      Toast.show('Please enter ' + keyUpdate + ' must be a number.', Toast.SHORT);
      return;
    }
    value = parseFloat(value);
    if (value && (value < 0)) {
      Toast.show(keyUpdate + ' must be greater than 0.', Toast.SHORT);
      return;
    }
    updateValue(indexUpdate, keyUpdate, value);
    setIsVisibleLength(false);
  };

  //-- KEY
  const [indexUpdate, setIndexUpdate] = useState(-1);
  const [keyUpdate, setKeyUpdate] = useState('');
  const updateValue = (index, key, value) => {

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
    UpdateElectricalTrayLadderRegisterListAPI(listUpdate)
      .then(res => {
        if (res.success) {
          setEITUpdateItems([]);
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
    const status = (item.InstallDay || item.InstallPercentage || item.InstallLength_m) ? 1 : 0;
    const textStyle = status == 1 ? styles.textUpdated : styles.textData;

    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>Facility:</Text>
          </View>
          <View style={styles.cellTwo}>
            <Text style={textStyle}>{Formater.formatEmptyData(item.FacilityCode)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>DrawingNo:</Text>
          </View>
          <View style={styles.cellTwo}>
            <Text style={textStyle}>{Formater.formatEmptyData(item.LayoutDrawingNo)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>Location:</Text>
          </View>
          <View style={styles.cellTwo}>
            <Text style={textStyle}>{Formater.formatEmptyData(item.Location)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>{'TrayLadder\nName:'}</Text>
          </View>
          <View style={styles.cellTwo}>
            <Text style={textStyle}>{Formater.formatEmptyData(item.TrayLadderName)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>{'Unit:'}</Text>
          </View>
          <View style={styles.cellTwo}>
            <Text style={textStyle}>{Formater.formatEmptyData(item.Unit)}</Text>
          </View>
        </View>
        {
          item.Unit == 'm'
            ?
            <>
              <View style={styles.row}>
                <View style={styles.cellOne}>
                  <Text>{'Percentage:'}</Text>
                </View>
                <View style={styles.cellTwoRow}>
                  <TouchableOpacity
                    style={styles.cellTwoRow}
                    onPress={() => _onPressSelectPercent(item.RowIndex, 'InstallPercentage', item.InstallPercentage * 100)}>
                    <Text style={styles.textData}>{Formater.formatEmptyData(item.InstallPercentage * 100)}</Text>
                    {
                      <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} />
                    }
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOne}>
                  <Text>{'Length:'}</Text>
                </View>
                <View style={styles.cellTwoRow}>
                  <TouchableOpacity
                    style={styles.cellTwoRow}
                    onPress={() => _onPressSelectLength(item.RowIndex, 'InstallLength_m', item.InstallLength_m)}>
                    <Text style={styles.textData}>{Formater.formatEmptyData(item.InstallLength_m)}</Text>
                    {
                      <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} />
                    }
                  </TouchableOpacity>
                </View>
              </View>
            </>
            :
            <>
              <View style={styles.row}>
                <View style={styles.cellOne}>
                </View>
                <View style={styles.cellTwo}>
                  <View style={styles.cellTwoRow}>
                    <Text>Install:</Text>
                    <CheckBox
                      value={!!item.InstallDay}
                      onValueChange={newValue => _onChangeCheckbox(item.RowIndex, 'InstallDay', newValue)}
                      style={styles.checkBox}
                      boxType='square'
                      disabled={false}
                      onCheckColor={OPP_COLOR}
                      onFillColor={false ? DISABLE_COLOR : BASE_COLOR}
                      onTintColor={false ? DISABLE_COLOR : BASE_COLOR}
                      tintColors={{ true: BASE_COLOR, false: DISABLE_COLOR }}
                      animationDuration={0.2}
                      onAnimationType='flat'
                    />
                  </View>
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
        return <ListSelectData title={'Please enter filter'} />
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
      <Dialog.Container visible={isVisiblePercent}>
        <Dialog.Title>{'Update ' + keyUpdate + ':'}</Dialog.Title>
        <Dialog.Input
          value={percentDisplay}
          placeholder={'Enter ' + keyUpdate}
          onChangeText={(text) => setPercentDisplay(text)}
          underlineColorAndroid={BASE_COLOR}
          keyboardType={'numeric'}
        />
        <Dialog.Button label='Cancel' onPress={() => { setIsVisiblePercent(false) }} />
        <Dialog.Button label='OK' onPress={_onChangePercent} />
      </Dialog.Container>
      <Dialog.Container visible={isVisibleLength}>
        <Dialog.Title>{'Update ' + keyUpdate + ':'}</Dialog.Title>
        <Dialog.Input
          value={lengthDisplay}
          placeholder={'Enter ' + keyUpdate}
          onChangeText={(text) => setLengthDisplay(text)}
          underlineColorAndroid={BASE_COLOR}
          keyboardType={'numeric'}
        />
        <Dialog.Button label='Cancel' onPress={() => { setIsVisibleLength(false) }} />
        <Dialog.Button label='OK' onPress={_onChangeLength} />
      </Dialog.Container>
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
    // justifyContent: 'center',
    flexDirection: 'row',
  },
  textData: {
    fontWeight: 'bold',
    color: BASE_COLOR,
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
});

export default ElectricalTrayLadderRegisterListScreen;