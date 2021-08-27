import React from 'react';
import { StyleSheet, SafeAreaView, View, ScrollView, Text, TouchableOpacity, Dimensions, Modal, ActivityIndicator } from 'react-native';
import Formater from '../../utils/Formater';

const SelectPopupTimeSheet = props => {
  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={props.visible}>
      <View style={modals.dim}>
        <SafeAreaView>
          <View style={modals.container}>
            <View style={modals.list}>
              <ScrollView>
                {
                  props.data != null
                    ?
                    props.data.length
                      ?
                      props.data.map(item => {
                        return (
                          <TouchableOpacity style={styles.box} key={item.WorkOrder} onPress={() => props.onChangeItem(item.WorkOrder)}>
                            <View style={styles.row}>
                              <Text style={styles.cellTitle}>{Formater.formatEmptyData(item.WorkOrder)}</Text>
                            </View>
                            <View style={styles.row}>
                              <Text style={styles.cellData}>{Formater.formatEmptyData(item.WorkOrderName)}</Text>
                            </View>
                            <View style={styles.row}>
                              <Text style={styles.cellLine}>Budget:</Text>
                              <Text style={styles.cellLineData}>{Formater.formatTwoDigits(item.BudgetMHRS)}</Text>
                              <Text style={styles.cellLine}>Actual:</Text>
                              <Text style={styles.cellLineData}>{Formater.formatTwoDigits(item.ActualMHRS)}</Text>
                            </View>
                            <View style={styles.row}>
                              <Text style={styles.cellLine}>Earn:</Text>
                              <Text style={styles.cellLineData}>{Formater.formatTwoDigits(item.EarnMHRS)}</Text>
                              <Text style={styles.cellLine}>Waste:</Text>
                              <Text style={styles.cellLineData}>{Formater.formatTwoDigits(item.WasteMHRS)}</Text>
                            </View>
                            <View style={styles.row}>
                              <Text style={styles.cellLine}>Remain:</Text>
                              <Text style={styles.cellLineData}>{Formater.formatTwoDigits(item.RemainMHRS)}</Text>
                              <View style={styles.cellLine} />
                              <View style={styles.cellLineData} />
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
              props.data != null &&
              <View style={modals.action}>
                {
                  !!props.data.length && !!props.onClear &&
                  <TouchableOpacity style={modals.button} onPress={props.onClear}>
                    <Text style={modals.buttonTitle}>Clear</Text>
                  </TouchableOpacity>
                }
                <TouchableOpacity style={modals.button} onPress={props.onCancel}>
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
    maxHeight: windowHeight * 0.85 - 36 - 16,
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
  cellLine: {
    flex: 1,
  },
  cellLineData: {
    flex: 2,
    color: BASE_COLOR,
  },
});

export default SelectPopupTimeSheet;