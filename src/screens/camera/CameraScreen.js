import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import NetInfo from '@react-native-community/netinfo';

import Helper from '../../utils/Helper';
import GetFacilityCodeByDrawingAPI from '../../apis/drawing/GetFacilityCodeByDrawingAPI';
import MessageAlert from '../../components/MessageAlert';

export default ({ route, navigation }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isScanned, setIsScanned] = useState(false);
  const { projectCode, teamLeader, code } = route.params;

  const _onQRCodeRead = scanResult => {
    if (scanResult.data !== null && !isScanned) {
      var data = scanResult.data.split('_');
      getFacilityCode(data[0], data[1], data[2]);
    }
  };

  const getFacilityCode = async (drawingNo, sheet, rev) => {
    setIsScanned(true);
    let token = await Helper.getData('TOKEN');
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        showComfirm('ERROR', 'Network not available!');
      } else {
        GetFacilityCodeByDrawingAPI(projectCode, drawingNo, sheet, rev, token)
          .then(res => {
            if (res.success && res.data != null) {
              navigation.navigate('DrawingDetail', {
                projectCode: projectCode,
                facilityCode: res.data,
                drawingNo: drawingNo,
                sheet: sheet,
                rev: rev,
                code: code,
                teamLeader: teamLeader,
              });
              setIsScanned(false);
            } else if (res.data == null) {
              let message = 'Not find FacilityCode with: \n'
                + 'projectCode: ' + projectCode + '\n'
                + 'drawingNo: ' + drawingNo + '\n'
                + 'sheet: ' + sheet + '\n'
                + 'rev: ' + rev;
              showComfirm('ERROR', message);
            } else {
              showComfirm('ERROR', 'Please check that you are using the company network!');
            }
          }).catch(() => {
            showComfirm('ERROR', 'Please check that you are using the company network!');
          });
      }
    });
  };

  const showComfirm = (type, message) => {
    Alert.alert(
      type,
      message,
      [
        {
          text: 'Back',
          onPress: () => {
            navigation.goBack();
          },
          style: 'cancel'
        },
        {
          text: 'Rescan',
          onPress: () => { setIsScanned(false) }
        }
      ],
      { cancelable: false },
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <RNCamera
        style={styles.containerCamera}
        type={RNCamera.Constants.Type.back}
        onBarCodeRead={_onQRCodeRead}
        captureAudio={false}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}>
        <View style={styles.backdrop} />
        <View style={styles.finder}>
          <View style={[styles.topLeft, styles.edge]} />
          <View style={[styles.topRight, styles.edge]} />
          <View style={[styles.bottomLeft, styles.edge]} />
          <View style={[styles.bottomRight, styles.edge]} />
        </View>
        <View style={styles.backdrop} >
          <Text style={styles.note}>Please move your camera over QR Code to scan it</Text>
        </View>
      </RNCamera>
    </SafeAreaView>
  );
}
const BASE_BORDER_SIZE = 3;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  containerCamera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  backdrop: {
    height: '25%',
    backgroundColor: 'black',
    opacity: 0.7,
    justifyContent: 'center'
  },
  finder: {
    height: '50%',
    position: 'relative'
  },
  edge: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: BASE_BORDER_SIZE,
    borderLeftWidth: BASE_BORDER_SIZE,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: BASE_BORDER_SIZE,
    borderRightWidth: BASE_BORDER_SIZE,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: BASE_BORDER_SIZE,
    borderLeftWidth: BASE_BORDER_SIZE,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: BASE_BORDER_SIZE,
    borderRightWidth: BASE_BORDER_SIZE,
  },
  note: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});
