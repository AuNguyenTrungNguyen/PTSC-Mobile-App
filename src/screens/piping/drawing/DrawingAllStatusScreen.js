import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList } from 'react-native';

import Networker from '../../../utils/Networker';
import Helper from '../../../utils/Helper';
import CoreStyle from '../../../utils/CoreStyle';
import Formater from '../../../utils/Formater';
import Constant from '../../../utils/Constant';

import GetSpoolMatrixListAPI from '../../../apis/spool/GetSpoolMatrixListAPI';
import { GetCurrentConstructionInfoAPI, GetDrawingCompleteAllPercentAPI } from '../../../apis/piping/ConstructionAPI';

import { ListEmptyData } from '../../../components/HelperUI';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';

const DrawingAllStatusScreen = ({ route, navigation }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { projectCode, facilityCode, drawingNo, sheet, rev, link } = route.params;

  const [facilityCodeCalled, setFacilityCodeCalled] = useState([]);
  const [percentList, setPercentList] = useState([]);
  const [spoolList, setSpoolList] = useState([]);

  const callAPI = executedAPI => {
    setIsLoading(true);
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true) });
  };
  useEffect(
    () => {
      callAPI(getAllData);
    }, []
  );
  const getAllData = async () => {
    let token = await Helper.getData('TOKEN');
    try {
      let arrayPromise = [GetDrawingCompleteAllPercentAPI(projectCode, drawingNo, sheet, rev, token)];
      if (facilityCode) {
        arrayPromise.push(GetSpoolMatrixListAPI(projectCode, facilityCode, drawingNo, token));
        await Promise.all(arrayPromise)
          .then(([percentResult, result]) => {
            if (percentResult.Success && result.success) {
              setPercentList(percentResult.Data);
              if (!facilityCode) {
                setFacilityCodeCalled(result.data);
                GetSpoolMatrixListAPI(projectCode, result.data, drawingNo, token)
                  .then(res => {
                    if (res.success) {
                      setSpoolList(res.data);
                      setIsLoading(false);
                      setIsError(false);
                    } else {
                      setIsLoading(false);
                      setIsError(true);
                    }
                  }).catch(() => {
                    setIsLoading(false);
                    setIsError(true);
                  });
              } else {
                setSpoolList(result.data);
              }
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
      } else {
        arrayPromise.push(GetCurrentConstructionInfoAPI(projectCode, drawingNo, sheet, rev, token));
        await Promise.all(arrayPromise)
          .then(([percentResult, result]) => {
            if (percentResult.Success && result.Success) {
              setPercentList(percentResult.Data);
              if (!facilityCode) {
                setFacilityCodeCalled(result.Data);
                GetSpoolMatrixListAPI(projectCode, result.Data, drawingNo, token)
                  .then(res => {
                    if (res.success) {
                      setSpoolList(res.data);
                      setIsLoading(false);
                      setIsError(false);
                    } else {
                      setIsLoading(false);
                      setIsError(true);
                    }
                  }).catch(() => {
                    setIsLoading(false);
                    setIsError(true);
                  });
              } else {
                setSpoolList(result.data);
              }
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
      }
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      MessageAlert('ERROR', error.toString());
    }
  };


  const _onPressViewCons = async code => {
    const teamLeader = await Helper.getData('USERNAME');
    const title = code + ' Detail';
    if (facilityCode) {
      navigation.navigate(
        'DrawingDetail',
        {
          projectCode: projectCode,
          facilityCode: facilityCode,
          drawingNo: drawingNo,
          sheet: sheet,
          rev: rev,
          code: code,
          teamLeader: teamLeader,
          link: link,
          title: title,
        }
      );
    } else {
      const token = await Helper.getData('TOKEN');
      GetCurrentConstructionInfoAPI(projectCode, drawingNo, sheet, rev, token)
        .then(res => {
          if (res.Success) {
            navigation.navigate('DrawingDetail', {
              projectCode: projectCode,
              facilityCode: res.Data,
              drawingNo: drawingNo,
              sheet: sheet,
              rev: rev,
              code: code,
              teamLeader: teamLeader,
              link: res.Link,
              title: title,
            });
          } else {
            setIsLoading(false);
            setIsError(true);
          }
        }).catch(() => {
          setIsLoading(false);
          setIsError(true);
        });
    }
  };
  const _onPressViewQC = async code => {
    const teamLeader = await Helper.getData('USERNAME');
    const title = code + ' Detail';
    if (facilityCode) {
      navigation.navigate(
        'QCDrawingDetail',
        {
          projectCode: projectCode,
          facilityCode: facilityCode,
          drawingNo: drawingNo,
          sheet: sheet,
          rev: rev,
          code: code,
          teamLeader: teamLeader,
          link: link,
          title: title,
        }
      );
    } else {
      const token = await Helper.getData('TOKEN');
      GetCurrentConstructionInfoAPI(projectCode, drawingNo, sheet, rev, token)
        .then(res => {
          if (res.Success) {
            navigation.navigate('QCDrawingDetail', {
              projectCode: projectCode,
              facilityCode: res.Data,
              drawingNo: drawingNo,
              sheet: sheet,
              rev: rev,
              code: code,
              teamLeader: teamLeader,
              link: res.Link,
              title: title,
            });
          } else {
            setIsLoading(false);
            setIsError(true);
          }
        }).catch(() => {
          setIsLoading(false);
          setIsError(true);
        });
    }
  };



  const renderItem = ({ item }) => {
    return (
      <View style={styles.spoolBox}>
        <View style={styles.spoolRow}>
          <Text style={styles.spoolCellTitle}>SpoolNo:</Text>
          <Text style={styles.spoolCellData}>{Formater.formatEmptyData(item.SpoolNo)}</Text>
        </View>
        <View style={styles.spoolRow}>
          <Text style={styles.spoolCellTitle}>WS_WeldedStatus:</Text>
          <Text style={styles.spoolCellData}>{Formater.formatEmptyData(item.WS_WeldedStatus)}</Text>
        </View>
        <View style={styles.spoolRow}>
          <Text style={styles.spoolCellTitle}>Field_FitUpStatus:</Text>
          <Text style={styles.spoolCellData}>{Formater.formatEmptyData(item.Field_FitUpStatus)}</Text>
        </View>
        <View style={styles.spoolRow}>
          <Text style={styles.spoolCellTitle}>Field_WeldedStatus:</Text>
          <Text style={styles.spoolCellData}>{Formater.formatEmptyData(item.Field_WeldedStatus)}</Text>
        </View>
        <View style={styles.spoolRow}>
          <Text style={styles.spoolCellTitle}>SpoolRigUpToSite:</Text>
          <Text style={styles.spoolCellData} >{Formater.formatDateData(item.SpoolRigUpToSite)}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getAllData)} />
        :
        <View style={styles.container}>
          <View style={styles.box}>
            <View style={styles.row}>
              <Text style={styles.cellTitle}>ProjectCode:</Text>
              <Text style={styles.cellData}>{projectCode}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.cellTitle}>Facility:</Text>
              <Text style={styles.cellData}>{facilityCode ? facilityCode : facilityCodeCalled}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.cellTitle}>DrawingNo:</Text>
              {
                link
                  ?
                  <TouchableOpacity onPress={() => Helper.openDrawingPDF(navigation, link, 'Open All Status Drawing')} style={styles.cellData}>
                    <Text style={CoreStyle.textLinkWithLine}>{drawingNo.toUpperCase()}</Text>
                  </TouchableOpacity>
                  :
                  <Text style={styles.cellData}>{drawingNo.toUpperCase()}</Text>
              }
            </View>
            <View style={styles.row}>
              <Text style={styles.cellTitle}>Sheet:</Text>
              <Text style={styles.cellData}>{sheet}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.cellTitle}>Rev:</Text>
              <Text style={styles.cellData}>{rev}</Text>
            </View>
            <View style={styles.rowPercent}>
              <View style={styles.cellPercent}>
                <Text style={styles.textPercent}>{percentList.ConsFitUp}%</Text>
              </View>
              <View style={styles.cellPercent}>
                <Text style={styles.textPercent}>{percentList.ConsWeld}%</Text>
              </View>
              <View style={styles.cellPercent}>
                <Text style={styles.textPercent}>{percentList.QCFitUp}%</Text>
              </View>
              <View style={styles.cellPercent}>
                <Text style={styles.textPercent}>{percentList.QCVisual}%</Text>
              </View>
            </View>
            <View style={styles.rowAction}>
              <TouchableOpacity style={styles.cellAction} activeOpacity={1}>
                <Text style={styles.textAction}>Cons FitUp</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cellAction} activeOpacity={1}>
                <Text style={styles.textAction}>Cons Weld</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cellAction} activeOpacity={1}>
                <Text style={styles.textAction}>QC FitUp</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cellAction} activeOpacity={1}>
                <Text style={styles.textAction}>QC Visual</Text>
              </TouchableOpacity>
            </View>
          </View>
          {
            spoolList.length
              ?
              <VirtualizedList
                style={styles.table}
                data={spoolList}
                getItemCount={(data) => data.length}
                getItem={(data, index) => {
                  return data[index];
                }}
                keyExtractor={(index) => {
                  return index;
                }}
                renderItem={renderItem}
              />
              : <ListEmptyData />
          }
        </View>
      }
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
  table: {
    flexGrow: 1,
  },
  box: {
    flexDirection: 'column',
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
    flex: 3,
  },
  cellData: {
    flex: 7,
    fontWeight: 'bold',
    color: BASE_COLOR,
    flexDirection: 'row',
  },
  rowPercent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cellPercent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textPercent: {
    color: BASE_COLOR,
    fontWeight: 'bold',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
  },
  rowAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cellAction: {
    flex: 1,
    minHeight: 32,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 2,
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textAction: {
    color: BASE_COLOR,
    fontWeight: 'bold',
    fontStyle: 'italic',
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

  spoolBox: {
    flexDirection: 'column',
    width: '100%',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    marginBottom: 8,
  },
  spoolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 16,
    marginBottom: 4,
  },
  spoolCellTitle: {
    flex: 5,
    justifyContent: 'center',
  },
  spoolCellData: {
    flex: 6,
    fontWeight: 'bold',
    color: BASE_COLOR,
    justifyContent: 'center',
  },
});

export default DrawingAllStatusScreen;