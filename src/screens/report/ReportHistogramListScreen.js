import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import Helper from '../../utils/Helper';
import MessageAlert from '../../components/MessageAlert';
import LoadingRefresh from '../../components/LoadingRefresh';

import { GetHistogramListAPI } from '../../apis/report/ReportAPI';



const ReportHistogramListScreen = ({ route, navigation }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { projectCode } = route.params;

  const [histogramList, setHistogramList] = useState([]);

  useEffect(
    () => {
      callAPI(getHistogramList);
    }, []
  );

  const callAPI = executedAPI => {
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

  const getHistogramList = async () => {
    let token = await Helper.getData('TOKEN');
    GetHistogramListAPI(projectCode, token)
      .then(res => {
        if (res.success) {
          setHistogramList(res.data);
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

  const _onPressHistogramView = link => {
    navigation.navigate(
      'PDFView',
      {
        link: link,
        title: 'View Histogram Chart',
      }
    );
  };





  const ListEmptyData = () => (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataTitle}>No have any data with </Text>
      <Text style={styles.noDataTitle}>ProjectCode <Text style={styles.noDataText}>{projectCode}</Text></Text>
    </View>
  );

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.box} onPress={() => { _onPressHistogramView(item.WebLinkPdf) }}>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>FacilityCode: </Text>
            <Text style={styles.textData}>{item.FacilityCode}</Text>
          </View>
          <View style={styles.cellSmall}>
            <Text style={styles.textTitle}>Group: </Text>
            <Text style={styles.textDataSmall}>{item.Group}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>Discipline: </Text>
            <Text style={styles.textData}>{item.Discipline}</Text>
          </View>
          <View style={styles.cellSmall}>
            <Text style={styles.textTitle}>Deck: </Text>
            <Text style={styles.textDataSmall}>{item.Deck}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>Assignment: </Text>
            <Text style={styles.textData}>{item.Assignment}</Text>
          </View>
          <View style={styles.cellSmall}>
            <Text style={styles.textTitle}>Scope: </Text>
            <Text style={styles.textDataSmall}>{item.Scope}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>Compare: </Text>
            <Text style={styles.textData}>{formatCompareType(item.CompareType)}</Text>
          </View>
          <View style={styles.cellSmall}>
            <Text style={styles.textTitle}>Phase: </Text>
            <Text style={styles.textDataSmall}>{item.Phase}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const formatCompareType = type => {
    switch (type) {
      case 0:
        return 'Plan/Actual';
      case 1:
        return 'Forecast/Actual';
      case 2:
        return 'Plan/Remain';
      case 3:
        return 'Forecast/Remain';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getHistogramList)} />
        :
        <View style={styles.container}>
          {
            histogramList.length
              ?
              <>
                <Text style={styles.textNote}>* Click an item to view its chart</Text>
                <VirtualizedList
                  style={styles.table}
                  data={histogramList}
                  getItemCount={(data) => data.length}
                  getItem={(data, index) => {
                    return data[index];
                  }}
                  keyExtractor={(item) => {
                    return item.RowIndex;
                  }}
                  renderItem={renderItem}
                />
              </>
              :
              <ListEmptyData />
          }
        </View>
      }
    </SafeAreaView>
  );
}

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

  textNote: {
    color: BASE_COLOR,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 4,
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
    flex: 2,
    alignItems: 'center',
  },
  cellSmall: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  textTitle: {
    flex: 1,
  },
  textData: {
    flex: 1.5,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  textDataSmall: {
    flex: 1,
    fontWeight: 'bold',
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
    fontSize: 16,
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
  buttonLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
    marginRight: 4,
  },
  buttonRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
    marginLeft: 4,
  },
  buttonTitle: {
    color: OPP_COLOR,
  },
  buttonTitleDark: {
    color: BASE_COLOR,
  },
});

export default ReportHistogramListScreen;