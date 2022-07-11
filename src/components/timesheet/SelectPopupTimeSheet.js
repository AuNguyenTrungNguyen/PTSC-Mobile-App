import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, ScrollView, Text, TouchableOpacity, Dimensions, Modal, ActivityIndicator, TextInput } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Formater from '../../utils/Formater';
import Networker from '../../utils/Networker';
import Helper from '../../utils/Helper';
import { GetTimeSheetWorkOrderListAPI, RefreshWorkOrderAPI } from '../../apis/timesheet/TimeSheetAPI';

const SelectPopupTimeSheet = ({ data, visible, onChangeItem, onCancel, onReload }) => {

  const [workOrder, setWorkOrder] = useState('');
  const [workOrderList, setWorkOrderList] = useState(data);

  useEffect(
    () => {
      if (visible) {
        _onSearchWorkOrder();
      }
    }, [visible]
  );

  const _onSearchWorkOrder = () => {
    if (workOrder && data) {
      const result = data.filter(i => i.WorkOrder.includes(workOrder));
      setWorkOrderList(result);
    }
    else {
      setWorkOrderList(data);
    }
  };

  const _onRefreshWorkOrder = () => {
    Networker.callAPI(refreshWorkOrder());
  };
  const refreshWorkOrder = async () => {
    const token = await Helper.getData('TOKEN');
    const projectCode = await Helper.getData('PROJECT_CODE');
    const userLogin = await Helper.getData('USERNAME');
    RefreshWorkOrderAPI(projectCode, userLogin, token)
      .then(res => {
        if (res.Success && onReload != null) {
          GetTimeSheetWorkOrderListAPI(projectCode, userLogin, token)
            .then(res => {
              onReload(res.data);
              setWorkOrderList(res.data);
            }
            );
        } else {
        }
      }).catch(() => {
      });
  };

  const _onChangeWorkOrder = text => {
    setWorkOrder(text);
  };

  const _onClearWorkOrder = () => {
    setWorkOrder('');
    setWorkOrderList(data);
  };

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={visible}>
      <View style={modals.dim}>
        <SafeAreaView>
          <View style={modals.container}>
            <View style={styles.searchContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputText}
                  value={workOrder}
                  onChangeText={_onChangeWorkOrder}
                  underlineColorAndroid='transparent'
                />
                {
                  workOrder == ''
                    ? null
                    : <FontAwesome5Icon name='times-circle' onPress={_onClearWorkOrder} style={styles.inputIcon} />
                }
              </View>
              <TouchableOpacity style={styles.inputButton} onPress={_onSearchWorkOrder}>
                <FontAwesomeIcon
                  size={20}
                  name={'search'} color={OPP_COLOR} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputButton} onPress={_onRefreshWorkOrder}>
                <FontAwesomeIcon
                  size={20}
                  name={'refresh'} color={OPP_COLOR} />
              </TouchableOpacity>
            </View>
            <View style={modals.list}>
              <ScrollView>
                {
                  workOrderList != null
                    ?
                    workOrderList.length
                      ?
                      workOrderList.map(item => {
                        return (
                          <TouchableOpacity style={styles.box} key={item.WorkOrder} onPress={() => onChangeItem(item.WorkOrder)}>
                            <View style={styles.row}>
                              <Text style={styles.cellTitle}>{Formater.formatEmptyData(item.WorkOrder)}</Text>
                            </View>
                            {
                              item.WorkOrderName
                                ?
                                <View style={styles.row}>
                                  <Text style={styles.cellData}>{Formater.formatEmptyData(item.WorkOrderName)}</Text>
                                </View> :
                                null
                            }
                            <View style={styles.row}>
                              {
                                item.BudgetMHRS && item.BudgetMHRS < 0
                                  ?
                                  <>
                                    <Text style={styles.cellLineDataError}>Budget: {Formater.formatTwoDigits(item.BudgetMHRS)}</Text>
                                  </>
                                  :
                                  <>
                                    <Text style={styles.cellLineData}>Budget: {Formater.formatTwoDigits(item.BudgetMHRS)}</Text>
                                  </>
                              }
                              {
                                item.ActualMHRS && item.ActualMHRS < 0
                                  ?
                                  <>
                                    <Text style={styles.cellLineDataError}>Actual: {Formater.formatTwoDigits(item.ActualMHRS)}</Text>
                                  </>
                                  :
                                  <>
                                    <Text style={styles.cellLineData}>Actual: {Formater.formatTwoDigits(item.ActualMHRS)}</Text>
                                  </>
                              }
                            </View>
                            <View style={styles.row}>
                              {
                                item.RemainMHRS && item.RemainMHRS < 0
                                  ?
                                  <>
                                    <Text style={styles.cellLineDataError}>Remain: {Formater.formatTwoDigits(item.RemainMHRS)}</Text>
                                  </>
                                  :
                                  <>
                                    <Text style={styles.cellLineData}>Remain: {Formater.formatTwoDigits(item.RemainMHRS)}</Text>
                                  </>
                              }
                              {
                                item.WasteMHRS && item.WasteMHRS < 0
                                  ?
                                  <>
                                    <Text style={styles.cellLineDataError}>Waste: {Formater.formatTwoDigits(item.WasteMHRS)}</Text>
                                  </>
                                  :
                                  <>
                                    <Text style={styles.cellLineData}>Waste: {Formater.formatTwoDigits(item.WasteMHRS)}</Text>
                                  </>
                              }
                            </View>
                          </TouchableOpacity>
                        );
                      })
                      :
                      <View>
                        <Text style={modals.emptyText}>No have any data!</Text>
                      </View>
                    :
                    <View>
                      <ActivityIndicator size='large' color={BASE_COLOR} />
                    </View>
                }
              </ScrollView>
            </View>
            {
              workOrderList != null &&
              <View style={modals.action}>
                <TouchableOpacity style={modals.button} onPress={onCancel}>
                  <Text style={modals.buttonTitle}>Cancel</Text>
                </TouchableOpacity>
              </View>
            }
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const BASE_COLOR = '#344955';
const OPP_COLOR = '#FFF';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const modals = StyleSheet.create({
  dim: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: OPP_COLOR,
    width: windowWidth * 0.95,
    height: undefined,
    maxHeight: windowHeight * 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  list: {
    padding: 16,
    width: windowWidth * 0.95,
    height: (windowHeight * 0.85) - 32 - 76 - 40,
  },
  row: {
    flexDirection: 'row',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    alignItems: 'center',
    minHeight: 36,
    padding: 4,
  },

  emptyText: {
    flex: 1,
    color: BASE_COLOR,
    textAlign: 'center',
    fontSize: 15,
  },
  action: {
    width: windowWidth * 0.95,
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
  buttonTitle: {
    color: OPP_COLOR,
  },
});

const styles = StyleSheet.create({
  box: {
    width: '100%',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    padding: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 16,
  },
  cellTitle: {
    flex: 1,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  cellData: {
    flex: 1,
    color: BASE_COLOR,
  },
  cellLineTitle: {
    flex: 1,
  },
  cellLineData: {
    flex: 1.5,
    color: BASE_COLOR,
  },
  cellLineTitleError: {
    flex: 1,
    color: 'red',
  },
  cellLineDataError: {
    flex: 1.5,
    color: 'red',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    marginTop: 4,
    width: windowWidth * 0.85,
  },
  inputContainer: {
    flexDirection: 'row',
    flex: 1,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    height: '100%',
    alignItems: 'center',
    padding: 4,
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
  inputButton: {
    width: 48,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BASE_COLOR,
    padding: 4,
    marginLeft: 4,
  },
});

export default SelectPopupTimeSheet;
