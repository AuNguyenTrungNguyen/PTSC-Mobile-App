import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';

import { GetObservationListAPI } from '../../../apis/qa/QAAPI';

import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';
import Constant from '../../../utils/Constant';
import CoreStyle from '../../../utils/CoreStyle';
import Header from '../../../components/Header';
import { ListEmptyData } from '../../../components/HelperUI';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';

const QAObservationListScreen = ({ route, navigation }) => {

  const { projectCode, userLogin } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

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
      callAPI(getObservationList);
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

  const callAPI = executedAPI => {
    if (isFocused) {
      setIsLoading(true);
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          setIsLoading(false);
          setIsError(true);
          MessageAlert('WARNING', 'Network not available!');
        } else {
          executedAPI();
        }
      });
    }
  };

  const getObservationList = async () => {
    let token = await Helper.getData('TOKEN');
    GetObservationListAPI(projectCode, userLogin, token)
      .then(res => {
        if (res.success) {
          setObservationList(res.data);
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
      'QAObservationDetail',
      {
        projectCode: projectCode,
        userLogin: userLogin,
        observation: JSON.stringify(item),
        owner: item.CreatebyUser
      }
    );
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

  const RenderObservationList = () => {
    return (
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

  const headerData = {
    'ProjectCode': projectCode,
    'UserLogin': userLogin,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => { callAPI(getObservationList) }} />
        :
        <View style={styles.container}>
          {
            isShowDescription.show &&
            <Header data={headerData} />
          }
          <RenderObservationList />
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

export default QAObservationListScreen;