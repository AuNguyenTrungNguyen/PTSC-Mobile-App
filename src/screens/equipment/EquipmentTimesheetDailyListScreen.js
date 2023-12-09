import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance, TextInput, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Formater from '../../utils/Formater';
import Networker from '../../utils/Networker';

import { GetMajorEquipmentTimesheetDailyListAPI } from '../../apis/equipment/EquipmentAPI';

import { ListLoadingData, ListEmptyData } from '../../components/HelperUI';
import LoadingRefresh from '../../components/LoadingRefresh';
import Header from '../../components/Header';

const EquipmentTimesheetDailyListScreen = ({ route, navigation }) => {

  const { documentNo, equipmentCode, userLogin } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [timesheetList, setTimesheetList] = useState(null);

  const [isShowName, setIsShowName] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
            onPress={_onPressAddNew}>
            <Ionicons
              size={24}
              name={'add-circle-outline'} color={iconColor} />
          </TouchableOpacity>
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

  const isFocused = useIsFocused();
  //-- Init
  useEffect(
    () => {
      callAPI(getTimesheetList);
    }, [isFocused]
  );

  //-- Search Action
  // const _onPressSearch = () => {
  //   Keyboard.dismiss();
  //   callAPI(getTimesheetList);
  // };
  async function getTimesheetList() {
    GetMajorEquipmentTimesheetDailyListAPI(documentNo, equipmentCode)
      .then(res => {
        if (res.Success && res.Data) {
          setTimesheetList(res.Data);
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

  //-- AddNew
  const _onPressAddNew = async () => {
    navigation.navigate(
      'CreateEquipmentTimesheetDaily',
      {
        documentNo: documentNo,
        equipmentCode: equipmentCode,
        userLogin: userLogin
      }
    );
  };

  //-- Render List
  const renderItem = ({ _, item }) => {
    return (
      <TouchableOpacity style={styles.box}>
        <View style={styles.row}>
          <View style={styles.cellTwo}>
            <Text>OperatorID:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.OperatorID)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTwo}>
            <Text>Operator Name:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.OperatorName)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTwo}>
            <Text>Plan Start:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatDateDataTime(item.PlanStartDate)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTwo}>
            <Text>Plan Finish:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatDateDataTime(item.PlanFinishDate)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTwo}>
            <Text>Actual Start:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatDateDataTime(item.ActualStartDate)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTwo}>
            <Text>Actual Finish:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatDateDataTime(item.ActualFinishDate)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const RenderList = () => {
    {
      if (isSearching) {
        return <ListLoadingData />
      } else {
        return <ListEmptyData />
      }
    }
  };

  const headerData = {
    'DocumentNo': documentNo,
    'Equip. Code': equipmentCode,
    'Suppervisor': userLogin,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getTimesheetList)} />
          :
          <View style={styles.container}>
            {
              isShowName.show
                ?
                <Header data={headerData} />
                :
                null
            }
            {
              timesheetList && timesheetList.length
                ?
                <VirtualizedList
                  style={styles.table}
                  data={timesheetList}
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

export default EquipmentTimesheetDailyListScreen;