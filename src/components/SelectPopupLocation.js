import React from 'react';
import { StyleSheet, SafeAreaView, View, ScrollView, Text, TouchableOpacity, Dimensions, Modal, ActivityIndicator } from 'react-native';

const SelectPopupLocation = ({ visible, leftHeader, rightHeader, data, leftKey, rightKey, onChangeItem, onClear, onCancel }) => {
  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={visible}>
      <View style={modals.dim}>
        <SafeAreaView>
          <View style={modals.container}>
            <View style={modals.list}>
              <View style={modals.row}>
                <Text style={modals.cellTitleHeader}>{leftHeader}</Text>
                <View style={modals.cellLine} />
                <Text style={modals.cellDataHeader}>{rightHeader}</Text>
              </View>
              <ScrollView>
                {
                  data != null
                    ?
                    data.length
                      ?
                      data.map((item, index) => {
                        const valueLeft = item[leftKey] ? item[leftKey] : '';
                        const valueRight = item[rightKey] ? item[rightKey] : '';
                        return (
                          <TouchableOpacity style={modals.row} key={index} onPress={() => onChangeItem(item)}>
                            <Text style={modals.cellTitle}>{valueLeft}</Text>
                            <View style={modals.cellLine} />
                            <Text style={modals.cellData}>{valueRight}</Text>
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
              data != null &&
              <View style={modals.action}>
                {
                  !!data.length && !!onClear &&
                  <TouchableOpacity style={modals.button} onPress={() => { onClear() }}>
                    <Text style={modals.buttonTitle}>Clear</Text>
                  </TouchableOpacity>
                }
                <TouchableOpacity style={modals.button} onPress={() => { onCancel() }}>
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
const OPP_COLOR = 'white';
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
    maxHeight: windowHeight * 0.85 - 36 - 16,
  },
  row: {
    flexDirection: 'row',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    alignItems: 'center',
    height: 36,
  },
  cellTitleHeader: {
    flex: 1,
    color: BASE_COLOR,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cellDataHeader: {
    flex: 1,
    color: BASE_COLOR,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cellLine: {
    height: '100%',
    width: 1,
    backgroundColor: BASE_COLOR,
  },
  cellTitle: {
    flex: 1,
    color: BASE_COLOR,
    textAlign: 'center',
    fontSize: 15,
  },
  cellData: {
    flex: 1,
    color: BASE_COLOR,
    textAlign: 'center',
    fontSize: 15,
  },
  emptyText: {
    flex: 1,
    color: BASE_COLOR,
    textAlign: 'center',
    fontSize: 15,
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
  buttonTitle: {
    color: OPP_COLOR,
  },
});

export default SelectPopupLocation;