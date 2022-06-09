import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import NetInfo from '@react-native-community/netinfo';

import Helper from '../../../utils/Helper';
import Constant from '../../../utils/Constant';

import { GetCurrentDimCuttingInfoAPI } from '../../../apis/piping/DimAPI';
import { GetCurrentConstructionInfoAPI, CheckDrawingRevAPI } from '../../../apis/piping/ConstructionAPI';

const CameraScreen = ({ route, navigation }) => {

  const { projectCode, teamLeader, code, source } = route.params;

  const [isScanned, setIsScanned] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsScanned(false);
    });
    return unsubscribe;
  }, [navigation]);

  const _onQRCodeRead = scanResult => {
    if (!isScanned) {
      setIsScanned(true);
      var data = scanResult.data.split('_');
      _checkDrawingRev(data[0], data[1], data[2]);
    }
  };

  const _checkDrawingRev = async (drawingNo, sheet, rev) => {
    const token = await Helper.getData('TOKEN');
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        showComfirm('ERROR', 'Network not available!');
      } else {
        if (projectCode == 'GALLAF03' && drawingNo && !drawingNo.startsWith("WHP03-PMC2-")) {
          drawingNo = 'WHP03-PMC2-' + drawingNo
        }
        CheckDrawingRevAPI(projectCode, drawingNo, sheet, rev, source, token)
          .then(res => {
            if (res.Success) {
              if (res.Data != null && rev != res.Data) {
                Alert.alert(
                  'WARNING',
                  'DrawingNo: ' + drawingNo + '\nSheet: ' + sheet + '\nhas latest Rev: ' + res.Data,
                  [
                    {
                      text: 'Back',
                      onPress: () => {
                        navigation.goBack();
                      },
                      style: 'cancel'
                    },
                  ],
                  { cancelable: false },
                );
              } else {
                _onGoingDetail(drawingNo, sheet, rev);
              }
            }
            else {
              showComfirm('ERROR', 'Please check that you are using the company network!');
            }
          }).catch(() => {
            showComfirm('ERROR', 'Please check that you are using the company network!');
          });
      }
    });
  };

  const _onGoingDetail = async (drawingNo, sheet, rev) => {
    const token = await Helper.getData('TOKEN');
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        showComfirm('ERROR', 'Network not available!');
      } else {
        if (source === Constant.CAMERA_PIP_CONS_DIM) {
          GetCurrentDimCuttingInfoAPI(projectCode, drawingNo, sheet, rev, token)
            .then(res => {
              if (res.Success && res.Data != null) {
                navigation.navigate('DimCuttingDetail', {
                  projectCode: projectCode,
                  CPName: drawingNo,
                  CPSheet: sheet,
                  CPRev: rev,
                  userLogin: teamLeader,
                  link: res.Link,
                });
              } else if (res.Data == null) {
                const message = 'Not find Data with: \n'
                  + 'ProjectCode: ' + projectCode + '\n'
                  + 'CPName: ' + drawingNo + '\n'
                  + 'CPSheet: ' + sheet + '\n'
                  + 'CPRev: ' + rev;
                showComfirm('ERROR', message);
              } else {
                showComfirm('ERROR', 'Please check that you are using the company network!');
              }
            }).catch(() => {
              showComfirm('ERROR', 'Please check that you are using the company network!');
            });
        }
        else {
          GetCurrentConstructionInfoAPI(projectCode, drawingNo, sheet, rev, token)
            .then(res => {
              if (res.Success && res.Data != null) {
                if (source == Constant.CAMERA_PIP_CONS) {
                  navigation.navigate('DrawingDetail', {
                    projectCode: projectCode,
                    facilityCode: res.Data,
                    drawingNo: drawingNo,
                    sheet: sheet,
                    rev: rev,
                    code: code,
                    teamLeader: teamLeader,
                    title: code + ' Detail',
                    link: res.Link,
                  });
                } else {
                  navigation.navigate('QCDrawingDetail', {
                    projectCode: projectCode,
                    facilityCode: res.Data,
                    drawingNo: drawingNo,
                    sheet: sheet,
                    rev: rev,
                    code: code,
                    teamLeader: teamLeader,
                    title: 'QC ' + code + ' Detail',
                    link: res.Link,
                  });
                }
              } else if (res.Data == null) {
                const message = 'Not find FacilityCode with: \n'
                  + 'ProjectCode: ' + projectCode + '\n'
                  + 'DrawingNo: ' + drawingNo + '\n'
                  + 'Sheet: ' + sheet + '\n'
                  + 'Rev: ' + rev;
                showComfirm('ERROR', message);
              } else {
                showComfirm('ERROR', 'Please check that you are using the company network!');
              }
            }).catch(() => {
              showComfirm('ERROR', 'Please check that you are using the company network!');
            });
        }
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

export default CameraScreen;