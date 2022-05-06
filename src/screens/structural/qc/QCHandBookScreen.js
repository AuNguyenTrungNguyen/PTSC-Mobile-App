import React from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Dimensions, Alert, Modal, ActivityIndicator, PermissionsAndroid, Platform } from 'react-native';
import Helper from '../../../utils/Helper';
const QCHandBookScreen = ({ route, navigation }) => {

  const STR_LINK = 'http://192.168.41.37/ptsc_pms/ObjectPackages/Upload/QCHandBook/QCHandBook_STR.pdf';
  const PIP_LINK = 'http://192.168.41.37/ptsc_pms/ObjectPackages/Upload/QCHandBook/QCHandBook_PIP.pdf';
  const EIT_LINK = 'http://192.168.41.37/ptsc_pms/ObjectPackages/Upload/QCHandBook/QCHandBook_EIT.pdf';
  const PAINT_LINK = 'http://192.168.41.37/ptsc_pms/ObjectPackages/Upload/QCHandBook/QCHandBook_PAINT.pdf';

  const _onPressOpenHandBookSTR = () => {
    Helper.openDrawingPDF(navigation, STR_LINK, 'STR Hand Book')
  };

  const _onPressOpenHandBookPIP = () => {
    Helper.openDrawingPDF(navigation, PIP_LINK, 'PIP Hand Book')
  };

  const _onPressOpenHandBookEIT = () => {
    Helper.openDrawingPDF(navigation, EIT_LINK, 'EIT Hand Book')
  };

  const _onPressOpenHandBookPAINT = () => {
    Helper.openDrawingPDF(navigation, PAINT_LINK, 'PAINT Hand Book')
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.table}>
          <View style={styles.row}>
            <View style={styles.cell}>
              <TouchableOpacity style={styles.itemContainer} onPress={_onPressOpenHandBookSTR}>
                <Text numberOfLines={2} style={styles.itemTitle}>{'Structural\nHand Book'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cell}>
              <TouchableOpacity style={styles.itemContainer} onPress={_onPressOpenHandBookPIP}>
                <Text numberOfLines={2} style={styles.itemTitle}>{'Piping\nHand Book'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.cell}>
              <TouchableOpacity style={styles.itemContainer} onPress={_onPressOpenHandBookEIT}>
                <Text numberOfLines={2} style={styles.itemTitle}>{'EIT\nHand Book'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cell}>
              <TouchableOpacity style={styles.itemContainer} onPress={_onPressOpenHandBookPAINT}>
                <Text numberOfLines={2} style={styles.itemTitle}>{'Paint\nHand Book'}</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    padding: 12,
    flex: 1,
    backgroundColor: OPP_COLOR,
  },
  table: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    paddingBottom: 24,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    width: '90%',
    height: 80,
    alignItems: 'center',
    justifyContent:'center',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 12,
  },
  itemTitle: {
    textAlign: 'center',
    color: BASE_COLOR,
    fontSize: 14,
  },

  button: {
    marginBottom: 12,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
  },
  buttonTitle: {
    color: OPP_COLOR,
  },
});

export default QCHandBookScreen;
