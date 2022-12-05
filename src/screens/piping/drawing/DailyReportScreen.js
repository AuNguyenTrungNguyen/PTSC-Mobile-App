import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import Networker from '../../../utils/Networker';
import Helper from '../../../utils/Helper';

import { GetTeamListFilterAPI } from '../../../apis/app/AppAPI';
import { GetTeamReportAPI } from '../../../apis/piping/ConstructionAPI';

import { ListLoadingData, ListSelectData, ListEmptyData } from '../../../components/HelperUI';
import SelectPopup from '../../../components/SelectPopup';
import LoadingRefresh from '../../../components/LoadingRefresh';
import Formater from '../../../utils/Formater';

const DailyReportScreen = ({ route, navigation }) => {

  const { projectCode } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const TEAM_DEFAULT = 'Select Team';
  const [teamList, setTeamList] = useState([]);
  const [isVisibleTeam, setIsVisibleTeam] = useState(false);
  const [teamDisplay, setTeamDisplay] = useState(TEAM_DEFAULT);

  const [isVisibleDate, setIsVisibleDate] = useState(false);
  const [dateDisplay, setDateDisplay] = useState('');

  const [reportList, setReportList] = useState(null);

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  const toggle = () => {
    setIsShowDescription(prevState => {
      return {
        show: !prevState.show,
        name: prevState.name === 'arrow-up-circle-outline' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'
      }
    });
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}
          onPress={toggle}>
          <Ionicons size={24} name={isShowDescription.name} color={iconColor} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isShowDescription]);

  const callAPI = (executedAPI, loading = true) => {
    if (loading) {
      setIsLoading(true);
    }
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true) });
  };
  useEffect(
    () => {
      callAPI(getTeamList);
    }, []
  );

  //-- Team
  const getTeamList = async () => {
    const token = await Helper.getData('TOKEN');
    const disciplineCode = await Helper.getData('DISCIPLINE_CODE');
    GetTeamListFilterAPI(projectCode, disciplineCode, '', token)
      .then(res => {
        if (res.Success) {
          setTeamList(res.Data);
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
  const _onChangeTeam = value => {
    if (value !== teamDisplay) {
      setTeamDisplay(value);
      callAPI(() => { showReport(value, dateDisplay) }, false);
    }
    setIsVisibleTeam(false);
  };
  const _onPressClearTeam = () => {
    if (teamDisplay !== TEAM_DEFAULT) {
      setTeamDisplay(TEAM_DEFAULT);
      callAPI(() => { showReport('', dateDisplay) }, false);
    }
    setIsVisibleTeam(false);
  };

  //-- Date
  const _onPressSelectDate = () => {
    if (dateDisplay) {
      setDateDisplay(new Date(Moment(dateDisplay).format("YYYY-MM-DDT00:00:00")));
    } else {
      setDateDisplay(new Date());
    }
    setIsVisibleDate(true);
  };
  const _onChangeDate = selectedDate => {
    if (selectedDate) {
      setDateDisplay(selectedDate);
      callAPI(() => { showReport(teamDisplay, selectedDate) }, false);
    }
    setIsVisibleDate(false);
  };
  const _onCleareDate = () => {
    setDateDisplay('');
    callAPI(() => { showReport(teamDisplay, '') }, false);
    setIsVisibleDate(false);
  };

  //-- Load Action
  const _onPressLoadData = () => {
    callAPI(() => { showReport(teamDisplay, dateDisplay) }, false);
  };
  const showReport = async (team, date) => {
    setIsSearching(true);
    const token = await Helper.getData('TOKEN');
    const disciplineCode = await Helper.getData('DISCIPLINE_CODE');
    team = (team && team !== TEAM_DEFAULT) ? team : '';
    date = Formater.formatDateWithoutTimeSQL(date);
    GetTeamReportAPI(projectCode, disciplineCode, team, date, token)
      .then(res => {
        if (res.Success) {
          setReportList(res.Data);
          setIsLoading(false);
          setIsError(false);
          setIsSearching(false);
        } else {
          setIsLoading(false);
          setIsError(true);
          setIsSearching(false);
        }
      }).catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsSearching(false);
      });
  };

  //-- Detail
  const onGoToDetail = async item => {
    navigation.navigate(
      'DailyReportDetail',
      {
        projectCode: projectCode,
        team: teamDisplay,
        date: Formater.formatDateWithoutTimeSQL(item.Date),
      }
    );
  };



  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.box} onPress={() => { onGoToDetail(item) }}>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text>Date: </Text>
            <Text style={styles.text}>{Formater.formatDateWithoutTimeSQL(item.Date)} </Text>
          </View>
          <View style={styles.cell}>
            <Text>DiaInch: </Text>
            <Text style={styles.text}>{Formater.formatZeroDigits(item.Total)} </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const RenderList = () => {
    {
      if (isSearching) {
        return <ListLoadingData />
      } else if (reportList == null) {
        return <ListSelectData title={'Enter Team to view Report'} />
      } else if (!reportList.length) {
        return <ListEmptyData />
      } else {
        return <></>
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError}
            _onPressRefresh={() => { callAPI(() => { showReport(teamDisplay, dateDisplay) }, true) }} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show
                ?
                <View style={styles.headerContainer}>
                  <View style={styles.headerRow}>
                    <Text style={styles.headerCellTitle}>Project:</Text>
                    <Text style={styles.headerCellDate}>{projectCode}</Text>
                  </View>
                  <View style={styles.headerRow}>
                    <Text style={styles.headerCellTitle}>Team:</Text>
                    <TouchableOpacity style={styles.selectInput} onPress={() => { setIsVisibleTeam(true) }}>
                      <Text style={styles.buttonTitleDark}>{teamDisplay}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.headerRow}>
                    <Text style={styles.headerCellTitle}>Date:</Text>
                    <TouchableOpacity style={styles.selectInput} onPress={() => { _onPressSelectDate() }}>
                      <Text style={styles.buttonTitleDark}>{Formater.formatDateData(dateDisplay)}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.headerRow}>
                    <Text style={styles.headerCellTitle} />
                    <TouchableOpacity
                      style={styles.searchButton}
                      onPress={_onPressLoadData}
                      disabled={isSearching}>
                      <Text style={styles.buttonTitle}>Load</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                :
                null
            }
            {
              !isSearching && reportList && reportList.length
                ?
                <VirtualizedList
                  style={styles.table}
                  data={reportList}
                  getItemCount={data => data.length}
                  getItem={(data, index) => {
                    return data[index];
                  }}
                  keyExtractor={(item, index) => index}
                  renderItem={renderItem}
                  ItemSeparatorComponent={
                    () => {
                      return (
                        <View style={{ backgroundColor: BASE_COLOR, height: 1, width: '100%' }}>
                        </View>
                      );
                    }
                  }
                />
                :
                <RenderList />
            }
          </View>
      }
      <SelectPopup
        visible={isVisibleTeam}
        data={teamList}
        onCancel={() => setIsVisibleTeam(false)}
        onClear={_onPressClearTeam}
        onChangeItem={_onChangeTeam}>
      </SelectPopup>
      <DateTimePickerModal
        isVisible={isVisibleDate}
        date={new Date(Moment(dateDisplay).format("YYYY-MM-DDT00:00:00"))}
        mode={'date'}
        onConfirm={_onChangeDate}
        onCancel={_onCleareDate}
      />
    </SafeAreaView >
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    marginBottom: 4,
  },
  headerCellTitle: {
    flex: 2,
  },
  headerCellDate: {
    flex: 8,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  selectInput: {
    flex: 7,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    height: '100%',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
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
    borderRadius: 4,
    marginVertical: 4,
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 16,
    marginBottom: 4,
  },
  cell: {
    flex: 1,
    flexDirection: 'row',
  },
  text: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },


  buttonTitle: {
    color: OPP_COLOR,
  },
  buttonTitleDark: {
    color: BASE_COLOR,
  },
});

export default DailyReportScreen;
