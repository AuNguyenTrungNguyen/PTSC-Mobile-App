import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Helper from '../../../utils/Helper';
import Constant from '../../../utils/Constant';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';

import { GetNDTNumbersAPI } from '../../../apis/ndt/NDTAPI';

const NDTManagerScreen = ({ route, navigation }) => {

  const { projectCode } = route.params;

  const isFocused = useIsFocused();

  const [NDTNumbers, setNDTNumbers] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(
    () => {
      callAPI(getNDTNumbers);
    }, [isFocused]
  );

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

  const getNDTNumbers = async () => {
    let token = await Helper.getData('TOKEN');
    GetNDTNumbersAPI(projectCode, token)
      .then(res => {
        if (res.success) {
          setNDTNumbers(res.data);
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

  const _onPressNDTDetail = code => {
    const title = code + ' TO-DO';
    navigation.navigate(
      'NDTDetail',
      {
        projectCode: projectCode,
        code: code,
        title: title
      }
    );
  };

  const RenderItemBox = ({ code, value }) => {
    return (
      value
        ?
        <>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => _onPressNDTDetail(code)}
            activeOpacity={1}>
            <Text style={styles.itemTitle}>{code}</Text>
            <MCIcons name='pipe-disconnected' size={ICON_SIZE} color={BASE_COLOR} style={styles.itemIcon} />
          </TouchableOpacity>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{value < 1000 ? value : '999+'}</Text>
          </View>
        </>
        :
        <TouchableOpacity
          style={styles.itemContainerDisabled}
          activeOpacity={1}>
          <Text style={styles.itemTitleDisabled}>{code}</Text>
          <MCIcons name='check-network-outline' size={ICON_SIZE} color={DISABLED_COLOR} style={styles.itemIconDisabled} />
        </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getNDTNumbers)} />
        :
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>ProjectCode:</Text>
              <View style={styles.headerDataContainer}>
                <Text style={styles.headerData}>{projectCode.toUpperCase()}</Text>
              </View>
            </View>
          </View>
          <View style={styles.table}>
            <View style={styles.row}>
              <View style={styles.cell}>
                <RenderItemBox value={NDTNumbers.MT} code={Constant.NDT_MT_CODE} />
              </View>
              <View style={styles.cell}>
                <RenderItemBox value={NDTNumbers.PT} code={Constant.NDT_PT_CODE} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <RenderItemBox value={NDTNumbers.RT} code={Constant.NDT_RT_CODE} />
              </View>
              <View style={styles.cell}>
                <RenderItemBox value={NDTNumbers.UT} code={Constant.NDT_UT_CODE} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <RenderItemBox value={NDTNumbers.PAUT} code={Constant.NDT_PAUT_CODE} />
              </View>
              <View style={styles.cell} />
            </View>
            <View style={styles.rowOffset} />
          </View>
        </View>
      }
    </SafeAreaView>
  );
};

const BASE_COLOR = '#344955';
const DISABLED_COLOR = '#a3a3a3';
const OPP_COLOR = '#FFF';
const ICON_SIZE = 80;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: OPP_COLOR,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: OPP_COLOR,
  },

  headerContainer: {
    marginBottom: 12,
    padding: 4,
    paddingBottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 28,
    marginBottom: 4,
  },
  headerTitle: {
    flex: 3,
  },
  headerDataContainer: {
    flex: 7,
    borderColor: BASE_COLOR,
    borderBottomWidth: 1,
  },
  headerData: {
    color: BASE_COLOR,
    fontWeight: 'bold',
  },


  table: {
    flex: 1,
  },
  row: {
    flex: 2,
    flexDirection: 'row',
  },
  rowOffset: {
    flex: 1,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    height: '90%',
    width: '90%',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  itemTitle: {
    textAlign: 'center',
    color: BASE_COLOR,
    fontSize: 20,
  },
  itemIcon: {
    color: BASE_COLOR,
    height: ICON_SIZE,
    width: ICON_SIZE,
  },
  itemContainerDisabled: {
    height: '90%',
    width: '90%',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: DISABLED_COLOR,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  itemTitleDisabled: {
    textAlign: 'center',
    color: DISABLED_COLOR,
    fontSize: 20,
  },
  itemIconDisabled: {
    color: DISABLED_COLOR,
    height: ICON_SIZE,
    width: ICON_SIZE,
  },
  badgeContainer: {
    width: 52,
    height: 52,
    padding: 2,
    borderRadius: 52 / 2,
    backgroundColor: '#FF8C00',
    position: 'absolute',
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: OPP_COLOR,
    fontWeight: 'bold'
  },

});

export default NDTManagerScreen;