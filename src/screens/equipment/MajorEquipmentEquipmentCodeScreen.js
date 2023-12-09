import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance, TextInput, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Helper from '../../utils/Helper';
import Formater from '../../utils/Formater';
import Networker from '../../utils/Networker';

import { GetMajorEquipmentEquipmentCodeListAPI } from '../../apis/equipment/EquipmentAPI';

import { ListLoadingData, ListEmptyData } from '../../components/HelperUI';
import LoadingRefresh from '../../components/LoadingRefresh';

const MajorEquipmentEquipmentCodeScreen = ({ route, navigation }) => {

  const { documentNo, groupCode } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [name, setName] = useState('');
  const [equipmentCodeList, setEquipmentCodeList] = useState(null);

  const [isShowName, setIsShowName] = useState({ show: true, name: 'arrow-up-circle-outline' });
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
              name={isShowName.name} color={iconColor} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, isShowName]);
  const toggle = () => {
    setIsShowName(prevState => {
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

  //-- Init
  useEffect(
    () => {
      callAPI(getEquipmentCodeList);
    }, []
  );

  //-- Search Action
  const _onPressSearchGroupCode = () => {
    Keyboard.dismiss();
    callAPI(getEquipmentCodeList);
  };
  async function getEquipmentCodeList() {
    GetMajorEquipmentEquipmentCodeListAPI(groupCode, name)
      .then(res => {
        if (res.Success && res.Data) {
          setEquipmentCodeList(res.Data);
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
  const _onChangeName = des => {
    setName(des);
  };

  //-- Detail
  const _onPressDetail = async item => {
    const userLogin = await Helper.getData('USERNAME');
    navigation.navigate(
      'EquipmentTimesheetDailyList',
      {
        documentNo: documentNo,
        equipmentCode: item.EquipmentCode,
        userLogin: userLogin
      }
    );
  };

  //-- Render List
  const renderItem = ({ _, item }) => {
    return (
      <TouchableOpacity style={styles.box} onPress={() => _onPressDetail(item)}>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>Code:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.EquipmentCode)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>Name:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.EquipmentName)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const RenderList = () => {
    {
      if (isSearching) {
        return <ListLoadingData />
        // } else if (!equipmentCodeList) {
        //   return <ListSelectData title={'Please enter DocumentNo'} />
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
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getEquipmentCodeList)} />
          :
          <View style={styles.container}>
            {
              isShowName.show
                ?
                (
                  <View style={styles.headerContainer}>
                    <View style={styles.rowInfoAction}>
                      <Text style={styles.infoTitleAction}>GroupCode:</Text>
                      <View style={styles.textContainer}>
                        <Text style={styles.textData}>{groupCode}</Text>
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
                        onPress={_onPressSearchGroupCode}
                        disabled={isSearching}>
                        <Text style={styles.buttonTitle}>Search</Text>
                      </TouchableOpacity>
                    </View>
                  </View>)
                :
                null
            }
            {
              equipmentCodeList && equipmentCodeList.length
                ?
                <VirtualizedList
                  style={styles.table}
                  data={equipmentCodeList}
                  getItemCount={data => data.length}
                  getItem={(data, index) => {
                    return data[index];
                  }}
                  keyExtractor={(item, index) => index}
                  renderItem={renderItem}
                />
                :
                <RenderList />
            }
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
    padding: 12,
    flex: 1,
    backgroundColor: OPP_COLOR,
  },

  headerContainer: {
    marginBottom: 8,
    padding: 4,
    paddingBottom: 0,
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
  textContainer: {
    flexDirection: 'row',
    flex: 7,
    height: '100%',
    padding: 2,
    alignItems: 'center',
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
  cellThreeAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellTwo: {
    flex: 2,
    justifyContent: 'center',
  },
  cellThree: {
    flex: 3,
    justifyContent: 'center',
  },
  cellImageAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  cellAction: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  buttonClean: {
    width: 70,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelClean: {
    color: BASE_COLOR,
  },


  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    backgroundColor: OPP_COLOR,
  },
  noDataTitle: {
    paddingTop: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  noDataText: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },

  actionContainer: {
    marginTop: 12,
    height: 36,
    flexDirection: 'row',
  },
  buttonAction: {
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

export default MajorEquipmentEquipmentCodeScreen;