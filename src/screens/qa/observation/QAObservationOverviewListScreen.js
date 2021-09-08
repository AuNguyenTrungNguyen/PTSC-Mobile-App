import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput, VirtualizedList, Appearance, Keyboard } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NetInfo from '@react-native-community/netinfo';

import { GetObservationDisciplineAPI, GetObservationOverviewListAPI } from '../../../apis/qa/QAAPI';

import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';
import Constant from '../../../utils/Constant';
import CoreStyle from '../../../utils/CoreStyle';
import { ListEmptyData, ListLoadingData } from '../../../components/HelperUI';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';
import SelectPopup from '../../../components/SelectPopup';

const QAObservationOverviewListScreen = ({ route, navigation }) => {

  const { projectCode, userLogin } = route.params;
  const DISCIPLINE_CODE_DEFAULT = 'All Discipline Code';

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(true);

  const [isVisibleDiscipline, setIsVisibleDiscipline] = useState(false);
  const [disciplineList, setDisciplineList] = useState([]);
  const [discipline, setDiscipline] = useState(DISCIPLINE_CODE_DEFAULT);
  const [id, setId] = useState('');
  const [oldId, setOldId] = useState(null);
  const [description, setDescription] = useState('');
  const [oldDescription, setOldDescription] = useState(null);

  const [observationList, setObservationList] = useState([]);

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

  const isFocused = useIsFocused();
  useEffect(
    () => {
      callAPI(() => { searchObservationList('', '', '') });
      callAPI(getDisciplineList);
    }, [isFocused]
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
    if (isFocused) {
      if (!loading === null) {
        if (loading) {
          setIsLoading(true);
        } else {
          setIsSearching(true);
        }
      }
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          setIsLoading(false);
          setIsError(true);
          setIsSearching(false);
          MessageAlert('WARNING', 'Network not available!');
        } else {
          executedAPI();
        }
      });
    }
  };

  const getDisciplineList = async () => {
    let token = await Helper.getData('TOKEN');
    GetObservationDisciplineAPI(projectCode, token)
      .then(res => {
        if (res.success) {
          setDisciplineList(res.data);
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

  const _onPressViewDetail = item => {
    navigation.navigate(
      'QA',
      {
        screen: 'QAObservationDetail',
        params: {
          projectCode: projectCode,
          userLogin: userLogin,
          observation: JSON.stringify(item),
          owner: item.CreatebyUser
        },
      }
    );
  };

  /* Action Filter */
  const _onChangeDiscipline = code => {
    if (code !== discipline) {
      setDiscipline(code);
      callAPI(() => { searchObservationList(code, id, description) }, false);
    }
    setIsVisibleDiscipline(false);
  };

  const _onClearDiscipline = () => {
    if (discipline !== DISCIPLINE_CODE_DEFAULT) {
      setDiscipline(DISCIPLINE_CODE_DEFAULT);
      callAPI(() => { searchObservationList('', id, description) }, false);
    }
    setIsVisibleDiscipline(false);
  };

  const _onChangeId = id => {
    setId(id);
  };

  const _onClearId = () => {
    setId('');
    callAPI(() => { searchObservationList(discipline, '', description) }, false);
  };

  const _onChangeDescription = descrption => {
    setDescription(descrption);
  };

  const _onClearDescription = () => {
    setDescription('');
    callAPI(() => { searchObservationList(discipline, id, '') }, false);
  };

  const _onPressSearchRequest = () => {
    let isSearch = false;
    if (id !== oldId) {
      setOldId(id);
      isSearch = true;
    }
    if (description !== oldDescription) {
      setOldDescription(description);
      isSearch = true;
    }
    if (isSearch) {
      callAPI(() => { searchObservationList(discipline, id, description) }, false);
    }
  };

  const searchObservationList = async (discipline, id, description) => {
    Keyboard.dismiss();
    let token = await Helper.getData('TOKEN');
    discipline = (discipline != null && discipline != DISCIPLINE_CODE_DEFAULT) ? discipline : '';
    id = id != null ? id : '';
    description = description != null ? description : '';
    GetObservationOverviewListAPI(projectCode, discipline, id, description, token)
      .then(res => {
        if (res.success) {
          setObservationList(res.data);
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





  const renderItem = ({ index, item }) => {
    return (
      <TouchableOpacity onPress={() => { _onPressViewDetail(item) }}>
        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>Discipline:</Text>
            <Text style={styles.cellData}>{item.DisciplineCode}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>Id:</Text>
            <Text style={styles.cellData}>{item.ObservationID}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>Description:</Text>
            <Text style={styles.cellData}>{item.ObservationDesciption}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>Status:</Text>
            <RenderStatus status={item.ObservationStatus} />
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>Date:</Text>
            <Text style={styles.cellData}>{Formater.formatDateData(item.ObservationDate)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const RenderObservationOverviewList = () => {
    return (
      isSearching
        ?
        <ListLoadingData />
        :
        observationList.length
          ?
          <>
            <Text style={CoreStyle.textNote}>* Click an item to view/update observation</Text>
            <VirtualizedList
              style={styles.table}
              data={observationList}
              getItemCount={data => data.length}
              getItem={(data, index) => {
                return data[index];
              }}
              keyExtractor={(item, index) => index}
              renderItem={renderItem}
            />
          </>
          :
          <ListEmptyData />
    );
  };

  const RenderStatus = ({ status }) => {
    if (status == Constant.QA_OBSERVATION_DRAFT) {
      return (<Text style={styles.cellStatusDraft}>{Constant.STATUS_DRAFT}</Text>);
    }
    if (status == Constant.QA_OBSERVATION_FINAL) {
      return (<Text style={styles.cellStatusFinal}>{Constant.STATUS_FINAL}</Text>);
    }
    return (<Text style={styles.cellData}></Text>);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => { callAPI(() => { searchObservationList(discipline, id, description) }) }} />
        :
        <View style={styles.container}>
          {
            isShowDescription.show &&
            <View style={styles.headerContainer}>
              <View style={styles.rowInfo}>
                <Text style={styles.infoTitle}>ProjectCode:</Text>
                <Text style={styles.infoData}>{projectCode}</Text>
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.infoTitle}>Discipline:</Text>
                <TouchableOpacity style={styles.selectInput} onPress={() => { setIsVisibleDiscipline(true) }}>
                  <Text style={styles.buttonTitleDark}>{discipline}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.infoTitle}>Id:</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputText}
                    value={id}
                    onChangeText={_onChangeId}
                    underlineColorAndroid='transparent'
                  />
                  {
                    id == ''
                      ? null
                      : <Icon name='times-circle' onPress={_onClearId} style={styles.inputIcon} />
                  }
                </View>
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.infoTitle}>Description:</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputText}
                    value={description}
                    onChangeText={_onChangeDescription}
                    underlineColorAndroid='transparent'
                  />
                  {
                    description == ''
                      ? null
                      : <Icon name='times-circle' onPress={_onClearDescription} style={styles.inputIcon} />
                  }
                </View>
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.infoTitle} />
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={_onPressSearchRequest}
                  disabled={isSearching}>
                  <Text style={styles.searchButtonTitle}>Search Observation</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          <RenderObservationOverviewList />
        </View>
      }
      <SelectPopup
        visible={isVisibleDiscipline}
        data={disciplineList}
        onCancel={() => setIsVisibleDiscipline(false)}
        onClear={_onClearDiscipline}
        onChangeItem={_onChangeDiscipline} />
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
  searchButtonTitle: {
    color: OPP_COLOR,
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
    alignItems: 'center',
    minHeight: 20,
    marginBottom: 4,
  },
  cellTitle: {
    flex: 1,
  },
  cellData: {
    flex: 2,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  cellStatusDraft: {
    flex: 2,
    fontWeight: 'bold',
    color: 'gray',
  },
  cellStatusFinal: {
    flex: 2,
    fontWeight: 'bold',
    color: 'green',
  },
});

export default QAObservationOverviewListScreen;