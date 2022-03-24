import React from 'react';
import { StyleSheet, SafeAreaView, View, ScrollView, Text, TouchableOpacity, Dimensions, Modal, ActivityIndicator } from 'react-native';

const SelectPopup = props => {
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
                        let code = item.code ? item.code : item;
                        let name = code;
                        if (props.multi) {
                          code = item.Code;
                          name = item.Name
                        }
                        return (
                          <TouchableOpacity style={modals.row} key={code} onPress={() => props.onChangeItem(code)}>
                            <Text style={modals.cell}>{name} </Text>
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
    minHeight: 36,
    padding: 4,
  },
  cell: {
    flex: 1,
    color: BASE_COLOR,
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

export default SelectPopup;