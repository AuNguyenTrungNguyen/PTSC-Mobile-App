import React from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity } from 'react-native';

const ConstructionUpdateManageScreen = ({ route, navigation }) => {

  const { projectCode } = route.params;

  const _onPressFabricationControl = () => {
    navigation.navigate('DrawingList', { projectCode: projectCode });
  };

  const _onPressSpoolMatrix = () => {
    navigation.navigate('SpoolMatrix', { projectCode: projectCode });
  };

  // const _onPressPipSupport = () => {
    
  // };

  const _onPressHydrotestUpdate = () => {
    navigation.navigate('HydrotestList', { projectCode: projectCode });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.rowInfo}>
            <Text style={styles.infoTitle}>ProjectCode:</Text>
            <Text style={styles.infoData}>{projectCode}</Text>
          </View>
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.buttonContainer} onPress={_onPressFabricationControl}>
            <Text style={styles.buttonTitle}>Fabrication Control</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainerPadding} onPress={_onPressSpoolMatrix}>
            <Text style={styles.buttonTitle}>Spool Matrix</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.buttonContainerPadding} onPress={_onPressPipSupport}>
            <Text style={styles.buttonTitle}>PIP Support</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.buttonContainerPadding} onPress={_onPressHydrotestUpdate}>
            <Text style={styles.buttonTitle}>Hydrotest Update</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    flex: 1,
    padding: 12,
    backgroundColor: OPP_COLOR,
  },

  headerContainer: {
    padding: 4,
    paddingBottom: 0,
    borderColor: BASE_COLOR,
    borderBottomWidth: 1,
  },
  rowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    marginBottom: 4,
  },
  infoTitle: {
    flex: 3,
  },
  infoData: {
    flex: 7,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },

  actionContainer: {
    marginTop: 24,
  },
  buttonContainer: {
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
  },
  buttonContainerPadding: {
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
    marginTop: 8,
  },
  buttonTitle: {
    color: OPP_COLOR,
    fontSize: 16,
  },
});


export default ConstructionUpdateManageScreen;