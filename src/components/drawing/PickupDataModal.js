import React from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Dimensions, Modal, ScrollView } from 'react-native';

const PickupDataModal = props => {
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
                {props.children}
              </ScrollView>
            </View>
            {
              props.loaded
                ?
                <View style={modals.action}>
                  <TouchableOpacity style={modals.button} onPress={props.onClear}>
                    <Text style={modals.buttonTitle}>Clear</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={modals.button} onPress={props.onCancel}>
                    <Text style={modals.buttonTitle}>Cancel</Text>
                  </TouchableOpacity>
                </View>
                :
                null
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
    flexShrink: 1,
    padding: 16,
    width: windowWidth * 0.85,
    height: undefined,
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

export default PickupDataModal;