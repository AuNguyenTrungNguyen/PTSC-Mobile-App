import React from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import Toast from 'react-native-simple-toast';

import Helper from '../../utils/Helper';

const ReportManagerScreen = ({ route, navigation }) => {

  const { projectCode } = route.params;

  const _onPressViewConstruction = () => {
    if (projectCode == null) {
      Toast.show('Please select a project!', Toast.SHORT);
      return;
    }
    navigation.navigate('ReportConstruction', { projectCode: projectCode });
  };

  const _onPressViewDiscipline = () => {
    if (projectCode == null) {
      Toast.show('Please select a project!', Toast.SHORT);
      return;
    }
    navigation.navigate('ReportDiscipline', { projectCode: projectCode });
  };

  const _onPressViewHistogram = () => {
    if (projectCode == null) {
      Toast.show('Please select a project!', Toast.SHORT);
      return;
    }
    navigation.navigate('ReportHistogram', { projectCode: projectCode });
  };

  const _onPressViewDailyMaipower = async () => {
    if (projectCode == null) {
      Toast.show('Please select a project!', Toast.SHORT);
      return;
    }
    let username = await Helper.getData('USERNAME');
    navigation.navigate(
      'ReportDailyManpower',
      {
        projectCode: projectCode,
        username: username
      }
    );
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
          <TouchableOpacity style={styles.buttonContainer} onPress={_onPressViewConstruction}>
            <Text style={styles.buttonTitle}>View Construction ID</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainerPadding} onPress={_onPressViewDiscipline}>
            <Text style={styles.buttonTitle}>View Discipline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainerPadding} onPress={_onPressViewHistogram}>
            <Text style={styles.buttonTitle}>View Histogram</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainerPadding} onPress={_onPressViewDailyMaipower}>
            <Text style={styles.buttonTitle}>View Daily Mainpower</Text>
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

export default ReportManagerScreen;