import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Appearance, VirtualizedList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { GetEITCableDamageLogDetailAPI } from '../../../apis/eit/EITAPI';

import Formater from '../../../utils/Formater';
import Helper from '../../../utils/Helper';
import Networker from '../../../utils/Networker';

import Header from '../../../components/Header';
import { ListLoadingData, ListEmptyData } from '../../../components/HelperUI';
import LoadingRefresh from '../../../components/LoadingRefresh';

const ElectricalCableDamageLogDetailScreen = ({ route, navigation }) => {

  const { projectCode, drumNo } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [damageLogDetail, setDamageLogDetail] = useState(null);

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
            onPress={_onPressCreate}>
            <MaterialIcons
              size={24}
              name={'note-add'} color={iconColor} />
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

  const callAPI = (executedAPI) => {
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true) });
  };

  //-- Get
  const getDamageLogDetail = () => {
    GetEITCableDamageLogDetailAPI(projectCode, drumNo)
      .then(res => {
        if (res.Success && res.Data) {
          setDamageLogDetail(res.Data);
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

  //-- Refresh
  const isFocused = useIsFocused();
  useEffect(() => {
    callAPI(getDamageLogDetail);
  }, [isFocused]
  );

  //-- Detail
  const _onPressCreate = async () => {
    const userLogin = await Helper.getData('USERNAME');
    const item = {
      "ProjectCode": projectCode,
      "DrumNo": drumNo,
      "FromNo_m": 0,
      "ToNo_m": 0,
      "Remark": null,
    };
    navigation.navigate(
      'ElectricalCableDamageLogData',
      {
        projectCode: projectCode,
        userLogin: userLogin,
        damageLogData: JSON.stringify(item),
        title: 'Create Cable Damage Log'
      }
    );
  };
  const _onPressUpdate = async item => {
    const userLogin = await Helper.getData('USERNAME');
    navigation.navigate(
      'ElectricalCableDamageLogData',
      {
        rowIndex: item.RowIndex,
        projectCode: projectCode,
        userLogin: userLogin,
        damageLogData: JSON.stringify(item),
        title: 'Update Cable Damage Log'
      }
    );
  };

  //-- Render
  const getStatusRender = () => {
    return damageLogDetail && damageLogDetail.length;
  };
  const RenderDetail = () => {
    {
      if (damageLogDetail == null) {
        return <ListLoadingData />
      } else if (!damageLogDetail.length) {
        return <ListEmptyData />
      }
    }
  };
  const renderItem = ({ index, item }) => {
    return (
      <TouchableOpacity style={styles.box} key={item.RowIndex} onPress={() => _onPressUpdate(item)}>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>DrumFrom:</Text>
          <View style={styles.cellTitle}>
            <Text style={styles.textData}>{Formater.formatTwoDigits(item.FromNo_m)}</Text>
          </View>
          <Text style={styles.cellTitle}>DrumTo:</Text>
          <View style={styles.cellTitle}>
            <Text style={styles.textData}>{Formater.formatTwoDigits(item.ToNo_m)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Length:</Text>
          <View style={styles.cellData}>
            <Text style={styles.textRed}>{Formater.formatTwoDigits(item.ActualLength_m)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Remark:</Text>
          <View style={styles.cellData}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.Remark)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const headerData = {
    'ProjectCode': projectCode,
    'DrumNo': drumNo,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => { callAPI(getDamageLogDetail) }} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show &&
              <Header data={headerData} />
            }
            {
              getStatusRender()
                ?
                <>
                  <VirtualizedList
                    style={styles.table}
                    data={damageLogDetail}
                    getItemCount={data => data.length}
                    getItem={(data, index) => {
                      return data[index];
                    }}
                    keyExtractor={(item, index) => index}
                    renderItem={renderItem}
                  />
                </>
                :
                <RenderDetail />
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
    marginVertical: 8,
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
    flex: 3,
  },
  textData: {
    flexWrap: 'wrap',
    flexShrink: 1,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  textRed: {
    flexWrap: 'wrap',
    flexShrink: 1,
    fontWeight: 'bold',
    color: 'red',
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

export default ElectricalCableDamageLogDetailScreen;