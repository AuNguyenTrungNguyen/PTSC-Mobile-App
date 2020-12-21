import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Modal, Dimensions, ScrollView, ActivityIndicator, Appearance } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-simple-toast';

import Helper from '../../utils/Helper';
import GetConstructionFacilityListAPI from '../../apis/construction/GetConstructionFacilityListAPI';
import GetSumFacilityAPI from '../../apis/discipline/GetSumFacilityAPI';
import GetDisciplineListByFacilityAPI from '../../apis/discipline/GetDisciplineListByFacilityAPI';
import MessageAlert from '../../components/MessageAlert';
import LoadingRefresh from '../../components/LoadingRefresh';

export default ({ route, navigation }) => {

  const FACILITY_CODE_DEFAULT = 'Select Facility Code';

  const { projectCode } = route.params;

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : 'black';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ paddingRight: 16 }} onPress={toggle}>
          <Ionicons size={24} name={isShowDescription.name} color={iconColor} />
        </TouchableOpacity>
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



  const [facilityList, setFacilityList] = useState([]);
  const [facilityCode, setFacilityCode] = useState(FACILITY_CODE_DEFAULT);
  const [isVisibleFacility, setIsVisibleFacility] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [summaryFacility, setSummaryFacility] = useState(null);
  const [disciplineList, setDisciplineList] = useState(null);

  useEffect(
    () => {
      callAPI(getDisciplineListDataFilter);
    }, []
  );

  const callAPI = (executedAPI, loading = true) => {
    if (loading) {
      setIsLoading(true);
    } else {
      setIsSearching(true);
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

  const getDisciplineListDataFilter = async () => {
    let token = await Helper.getData('TOKEN');
    GetConstructionFacilityListAPI(projectCode, token)
      .then(res => {
        if (res.success) {
          setFacilityList(res.data);
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

  const _onPressShowModel = () => {
    if (facilityList.length) {
      setIsVisibleFacility(true);
    } else {
      Toast.show('No have FacilityCode to filter', Toast.SHORT);
    }
  };

  const _onPressCancelModel = () => {
    setIsVisibleFacility(false);
  };

  const _onChangeCode = (value) => {
    setFacilityCode(value);
    if (value !== facilityCode) {
      callAPI(() => { searchDiscipline(value) }, false);
    }
    setIsVisibleFacility(false);
  };

  const searchDiscipline = async (facilityCode) => {
    let token = await Helper.getData('TOKEN');
    try {
      await Promise.all([GetSumFacilityAPI(projectCode, facilityCode, token), GetDisciplineListByFacilityAPI(projectCode, facilityCode, token)])
        .then(([sumFacilityResult, disciplineResult]) => {
          if (sumFacilityResult.success && disciplineResult.success) {
            setSummaryFacility(sumFacilityResult.data);
            setDisciplineList(disciplineResult.data);
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
        });;
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      setIsSearching(false);
      MessageAlert('ERROR', error.toString());
    }
  };



  const ListSearchData = () => (
    <View style={styles.noDataContainer}>
      <ActivityIndicator size='large' color={BASE_COLOR} />
    </View>
  );

  const ListSelectData = () => (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataTitle}>Select FacilityCode to filter</Text>
    </View>
  );

  const ListEmptyData = () => (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataTitle}>No have any data</Text>
    </View>
  );

  const renderItem = ({ item }) => {
    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>DisciplineCode: </Text>
            <Text style={styles.textData}>{formatEmptyData(item.DisciplineCode)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>ActualProgress: </Text>
            <Text style={styles.textData}>{formatEmptyNumber(item.ActualProgress)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>ActualMHRS: </Text>
            <Text style={styles.textData}>{formatEmptyNumber(item.ActualMHRS)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>BaseBudgetMHRS: </Text>
            <Text style={styles.textData}>{formatEmptyNumber(item.BaseBudgetMHRS)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>EarnedMHRS: </Text>
            <Text style={styles.textData}>{formatEmptyNumber(item.EarnedMHRS)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>RemainMHRS: </Text>
            {
              item.RemainMHRS < 0
                ?
                <Text style={[styles.textData, { color: 'red' }]}>{formatEmptyNumber(item.RemainMHRS)}</Text>
                :
                <Text style={[styles.textData, { color: 'green' }]}>{formatEmptyNumber(item.RemainMHRS)}</Text>
            }
          </View>
        </View>
      </View>
    );
  };

  const RenderDisciplineList = () => {
    {
      if (isSearching) {
        return <ListSearchData />
      } else if (disciplineList == null) {
        return <ListSelectData />
      } else if (!disciplineList.length) {
        return <ListEmptyData />
      } else {
        return <VirtualizedList
          style={styles.table}
          data={disciplineList}
          getItemCount={(data) => data.length}
          getItem={(data, index) => {
            return data[index];
          }}
          keyExtractor={(item) => {
            return item.RowIndex;
          }}
          renderItem={renderItem}
        />
      }
    }
  };

  const RenderSummaryFacility = () => {
    {
      if (isSearching || summaryFacility == null) {
        return null
      } else {
        return (<View style={styles.summaryContainer}>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.textTitle}>ActualProgress:</Text>
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryTextData}>{formatEmptyNumber(summaryFacility.ActualProgress)}</Text>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.textTitle}>ActualMHRS:</Text>
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryTextData}>{formatEmptyNumber(summaryFacility.ActualMHRS)}</Text>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.textTitle}>BaseBudgetMHRS: </Text>
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryTextData}>{formatEmptyNumber(summaryFacility.BaseBudgetMHRS)}</Text>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.textTitle}>EarnedMHRS: </Text>
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryTextData}>{formatEmptyNumber(summaryFacility.EarnedMHRS)}</Text>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.textTitle}>RemainMHRS: </Text>
              <View style={styles.summaryTextContainerEnd}>
                {
                  summaryFacility.RemainMHRS < 0
                    ?
                    <Text style={[styles.summaryTextData, { color: 'red' }]}>{formatEmptyNumber(summaryFacility.RemainMHRS)}</Text>
                    :
                    <Text style={[styles.summaryTextData, { color: 'green' }]}>{formatEmptyNumber(summaryFacility.RemainMHRS)}</Text>
                }
              </View>
            </View>
          </View>
        </View>)
      }
    }
  };

  const formatEmptyData = data => {
    return data ? data : '';
  };

  const formatEmptyNumber = data => {
    return data ? data : 0.00;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getDisciplineListDataFilter)} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show
                ?
                (<>
                  <View style={styles.headerContainer}>
                    <View style={styles.rowInfo}>
                      <Text style={styles.infoTitle}>FacilityCode:</Text>
                      <TouchableOpacity style={styles.buttonSelect} onPress={_onPressShowModel} >
                        <Text style={styles.buttonTitleDark}>{facilityCode}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <RenderSummaryFacility />
                </>)
                :
                null
            }
            <RenderDisciplineList />
          </View>
      }
      <Modal
        animationType='fade'
        transparent={true}
        visible={isVisibleFacility}>
        <View style={modals.dim}>
          <SafeAreaView>
            <View style={modals.container}>
              <View style={modals.list}>
                <ScrollView>
                  {facilityList.map((item) => {
                    return (
                      <TouchableOpacity style={modals.row} onPress={() => _onChangeCode(item)}>
                        <Text style={modals.cell}>{item}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
              <View style={modals.action}>
                <TouchableOpacity style={modals.button} onPress={_onPressCancelModel} >
                  <Text style={styles.buttonTitle}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const BASE_COLOR = '#344955';
const OPP_COLOR = 'white';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: OPP_COLOR,
  },
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: OPP_COLOR,
  },

  headerContainer: {
    padding: 4,
    paddingBottom: 0,
  },
  rowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
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
  buttonSelect: {
    flex: 7,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    height: '100%',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  buttonTitle: {
    color: OPP_COLOR,
  },
  buttonTitleDark: {
    color: BASE_COLOR,
  },

  summaryContainer: {
    flexDirection: 'column',
    width: '100%',
    borderColor: BASE_COLOR,
    borderBottomWidth: 2,
    marginBottom: 8,
  },
  summaryTextContainer: {
    flex: 1.5,
    borderColor: BASE_COLOR,
    borderBottomWidth: 1,
  },
  summaryTextData: {
    color: BASE_COLOR,
    flexShrink: 1,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  summaryTextContainerEnd: {
    flex: 1.5,
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
    paddingTop: 4,
    fontSize: 16,
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
  cell: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  textTitle: {
    flex: 1,
  },
  textData: {
    flex: 1.5,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
});
const modals = StyleSheet.create({
  dim: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: OPP_COLOR,
    width: windowWidth * 0.85,
    height: undefined,
    maxHeight: windowHeight * 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  list: {
    padding: 16,
    width: windowWidth * 0.85,
    height: undefined,
  },
  row: {
    flexDirection: 'row',
    height: 36,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    alignItems: 'center',
  },
  cell: {
    flex: 5,
    color: BASE_COLOR,
    paddingLeft: 4,
    paddingRight: 4,
  },
  action: {
    width: windowWidth * 0.85,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 16,
    marginBottom: 16,
  },
  button: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BASE_COLOR,
    padding: 4,
    marginRight: 8,
  },
});