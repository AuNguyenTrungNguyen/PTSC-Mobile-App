import React from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Dimensions, Modal } from 'react-native';

const HELP_DATA_FITIP = [
  {
    percent: '50%',
    description: 'Materials is ready\nBevel end be grinded\nAlignment be not accepted',
  },
  {
    percent: '100%',
    description: 'Alignment be accepted\nTack weld be completed',
  }
];
const HELP_DATA_WELD = [
  {
    percent: '25%',
    description: '25% Total weld length',
  },
  {
    percent: '50%',
    description: '50% Total weld length',
  },
  {
    percent: '75%',
    description: '75% Total weld length',
  },
  {
    percent: '100%',
    description: '100% Total weld length',
  },
];

const HelpModalDetail = props => {
  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={props.visible}>
      <View style={modals.dim}>
        <SafeAreaView>
          <View style={modals.container}>
            <View style={modals.list}>
              <View style={modals.row}>
                <Text style={modals.cellTitleHeader}>Percent</Text>
                <View style={modals.cellLine} />
                <Text style={modals.cellDataHeader}>Description</Text>
              </View>
              {
                props.code == 'FitUp'
                  ?
                  HELP_DATA_FITIP.map((item) => {
                    return (
                      <View style={modals.row}>
                        <Text style={modals.cellTitle}>{item.percent}</Text>
                        <View style={modals.cellLine} />
                        <Text style={modals.cellData}>{item.description}</Text>
                      </View>
                    );
                  })
                  :
                  HELP_DATA_WELD.map((item) => {
                    return (
                      <View style={modals.row}>
                        <Text style={modals.cellTitle}>{item.percent}</Text>
                        <View style={modals.cellLine} />
                        <Text style={modals.cellData}>{item.description}</Text>
                      </View>
                    );
                  })
              }
            </View>
            <View style={modals.action}>
              <TouchableOpacity style={modals.button} onPress={props.onClose} >
                <Text style={modals.buttonTitle}>Close</Text>
              </TouchableOpacity>
            </View>
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
    height: undefined,
  },
  row: {
    flexDirection: 'row',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    alignItems: 'center',
  },
  cellTitleHeader: {
    flex: 1,
    color: BASE_COLOR,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cellDataHeader: {
    flex: 2,
    color: BASE_COLOR,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    margin: 8,
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
    flex: 2,
    color: BASE_COLOR,
    fontSize: 15,
    margin: 8,
    lineHeight: 24,
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

export default HelpModalDetail;