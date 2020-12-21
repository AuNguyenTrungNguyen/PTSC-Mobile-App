import React, { useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Alert, Appearance } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Helper from '../utils/Helper';

export default ({ route, navigation }) => {

  const { projectCode, disciplineCode } = route.params;

  let colorIcon = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={_onPressLogout} style={{ paddingRight: 16 }}>
          <Ionicons name='log-out-outline' size={24} color={colorIcon} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const _onPressLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout }
      ],
      { cancelable: false }
    );
  };

  const logout = () => {
    Helper.clearData();
    navigation.replace('Login');
  };

  const _onPressUpdateDrawing = () => {
    navigation.navigate('DrawingList', { projectCode: projectCode });
  };

  const _onPressQCUpdate = () => {
    navigation.navigate('QCDrawingList', { projectCode: projectCode });
  };

  const _onPressViewReports = () => {
    navigation.navigate('Reports', { projectCode: projectCode });
  };

  const _onPressQRCodeFitUp = async () => {
    let teamLeader = await Helper.getData('USERNAME');
    navigation.navigate(
      'Camera',
      {
        code: 'FitUp',
        source: 'Drawing',
        projectCode: projectCode,
        teamLeader: teamLeader,
      }
    );
  };

  const _onPressQRCodeWeld = async () => {
    let teamLeader = await Helper.getData('USERNAME');
    navigation.navigate(
      'Camera',
      {
        code: 'Weld',
        source: 'Drawing',
        projectCode: projectCode,
        teamLeader: teamLeader,
      }
    );
  };

  const _onPressQRCodeFitUpQC = async () => {
    let teamLeader = await Helper.getData('USERNAME');
    navigation.navigate(
      'Camera',
      {
        code: 'FitUp',
        source: 'QCDrawing',
        projectCode: projectCode,
        teamLeader: teamLeader,
      }
    );
  };

  const _onPressQRCodeVisualQC = async () => {
    let teamLeader = await Helper.getData('USERNAME');
    navigation.navigate(
      'Camera',
      {
        code: 'Visual',
        source: 'QCDrawing',
        projectCode: projectCode,
        teamLeader: teamLeader,
      }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Project:</Text>
            <View style={styles.headerDataContainer}>
              <Text style={styles.headerData}>{projectCode.toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Module:</Text>
            <View style={styles.headerDataContainer}>
              <Text style={styles.headerData}>{disciplineCode.toUpperCase()}</Text>
            </View>
          </View>
        </View>
        <View style={styles.table}>
          <View style={styles.row}>
            <View style={styles.cell}>
              <TouchableOpacity style={styles.itemContainer} onPress={_onPressQRCodeFitUp}>
                <Text style={styles.itemTitle}>Cons Scan FitUp</Text>
                <Ionicons name='qr-code-outline' size={48} color={BASE_COLOR} style={styles.itemIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.cell}>
              <TouchableOpacity style={styles.itemContainer} onPress={_onPressQRCodeWeld}>
                <Text style={styles.itemTitle}>Cons Scan Weld</Text>
                <Ionicons name='qr-code-outline' size={48} color={BASE_COLOR} style={styles.itemIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.cell}>
              <TouchableOpacity style={styles.itemContainer} onPress={_onPressQRCodeFitUpQC}>
                <Text style={styles.itemTitle}>QC Scan FitUp</Text>
                <Ionicons name='qr-code-outline' size={48} color={BASE_COLOR} style={styles.itemIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.cell}>
              <TouchableOpacity style={styles.itemContainer} onPress={_onPressQRCodeVisualQC}>
                <Text style={styles.itemTitle}>QC Scan Weld</Text>
                <Ionicons name='qr-code-outline' size={48} color={BASE_COLOR} style={styles.itemIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.action}>
          <TouchableOpacity style={styles.buttonContainer} onPress={_onPressUpdateDrawing}>
            <Text style={styles.buttonTitle}>Construction Update</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainerPadding} onPress={_onPressQCUpdate}>
            <Text style={styles.buttonTitle}>QC Update</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainerPadding} onPress={_onPressViewReports}>
            <Text style={styles.buttonTitle}>View Reports</Text>
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
    padding: 16,
    backgroundColor: OPP_COLOR,
  },

  headerContainer: {
    marginBottom: 12,
    padding: 4,
    paddingBottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 28,
    marginBottom: 4,
  },
  headerTitle: {
    flex: 3,
  },
  headerDataContainer: {
    flex: 7,
    borderColor: BASE_COLOR,
    borderBottomWidth: 1,
  },
  headerData: {
    color: BASE_COLOR,
    fontWeight: 'bold',
  },


  table: {
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    height: '80%',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 12,
  },
  itemTitle: {
    color: BASE_COLOR,
    fontSize: 16,
  },
  itemIcon: {
    color: BASE_COLOR,
    height: 48,
    width: 48,
    margin: 4,
    marginTop: 16,
  },


  action: {
    marginTop: 12,
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
    marginTop: 12,
  },
  buttonTitle: {
    color: OPP_COLOR,
    fontSize: 16,
  },
});
