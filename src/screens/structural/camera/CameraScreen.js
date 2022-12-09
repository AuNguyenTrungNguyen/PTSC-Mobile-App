import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import NetInfo from '@react-native-community/netinfo';
import { useIsFocused } from '@react-navigation/native';

import Helper from '../../../utils/Helper';
import Constant from '../../../utils/Constant';
import Naming from '../../../utils/Naming';

import { CheckDrawingRevAPI } from '../../../apis/app/AppAPI';
import { GetCurrentPieceMarkInfoAPI } from '../../../apis/structural/PieceMarkAPI';
import { GetCurrentConstructionInfoAPI } from '../../../apis/structural/ConstructionAPI';

const CameraScreen = ({ route, navigation }) => {

  const { projectCode, userLogin, code, destination } = route.params;

  const [isScanned, setIsScanned] = useState(false);
  const isFocused = useIsFocused();

  const _onQRCodeRead = scanResult => {
    if (scanResult.data !== null && !isScanned && isFocused) {
      let result = scanResult.data.split('@');
      if (!result || result.length < 3) {
        result = scanResult.data.split('_');
      }
      let drawingNo = result[0];
      let sheet = result[1];
      let rev = result[2];

      if (result.length > 3) {
        let drawingCorrect = '';
        for (i = 0; i < result.length - 3; i++) {
          drawingCorrect += result[i] + '_';
        }
        drawingNo = drawingCorrect + result[result.length - 3];
        sheet = result[result.length - 2];
        rev = result[result.length - 1];
      }

      if ((code === Constant.CODE_CUT && !drawingNo.includes('CP'))
        || (code === Constant.CODE_PAINT && !drawingNo.includes('PM'))) {
        setIsScanned(true);
        showComfirm('ERROR', 'Please scan ' + code + ' drawing type!');
        return;
      }

      let route = Constant.ROUTE__HOME;
      let title = '';
      if (destination === Naming.NAME_STR_LAM_CHECK_REQUEST) {
        route = 'LamCheckSpendingList';
      } else if (destination === Naming.NAME_STR_LAM_CHECK_TODO) {
        route = 'LamCheckTodoList';
        title = 'Lam Check Todo';
      } else if (destination === Naming.NAME_STR_DIM_CHECK) {
        route = 'DimCheckList';
        title = 'Dim Check';
      } else if (destination === Naming.NAME_STR_PIECE_MARK) {
        route = 'PieceMarkDetail';
        title = 'Piece Mark ' + code;
      } else if (destination === Naming.NAME_STR_CONSTRUCTION) {
        title = code + ' Detail';
        route = 'ConstructionDetail';
      } else if (destination === Naming.NAME_STR_QC) {
        title = 'QC ' + code;
        route = 'QCSpendList';
      } else if (destination === Naming.NAME_STR_DIM_AFTER_WELD) {
        navigation.navigate('DIMAfterWeldList', {
          projectCode: projectCode,
          paramDrawingNo: drawingNo,
          isShowDetail: false,
          isPending: false,
        });
      } else if (destination === Naming.NAME_STR_DIM_AFTER_WELD_QC) {
        navigation.navigate('DIMAfterWeldListQC', {
          projectCode: projectCode,
          paramDrawingNo: drawingNo,
          isShowDetail: true,
          isPending: false,
        });
      }

      checkDrawingRev(drawingNo, sheet, rev, route, title);

    }
  };

  const checkDrawingRev = async (drawingNo, sheet, rev, route, title) => {
    let token = await Helper.getData('TOKEN');
    setIsScanned(true);
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        showComfirm('ERROR', 'Network not available!');
      } else {
        CheckDrawingRevAPI(projectCode, drawingNo, sheet, token)
          .then(res => {
            if (res.success) {
              if (res.data != null && rev != res.data) {
                Alert.alert(
                  'WARNING',
                  'DrawingNo: ' + drawingNo + '\nSheet: ' + sheet + '\nhas latest Rev: ' + res.data,
                  [
                    {
                      text: 'Back',
                      onPress: () => {
                        navigation.goBack();
                      },
                      style: 'cancel'
                    },
                    // {
                    //   text: 'Skip',
                    //   onPress: () => { skipDrawingRev(drawingNo, sheet, rev, route, title) }
                    // }
                  ],
                  { cancelable: false },
                );
              } else {
                skipDrawingRev(drawingNo, sheet, rev, route, title);
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

  const skipDrawingRev = (drawingNo, sheet, rev, route, title) => {
    if (destination === Naming.NAME_STR_LAM_CHECK_REQUEST
      || destination === Naming.NAME_STR_LAM_CHECK_TODO
      || destination === Naming.NAME_STR_DIM_CHECK) {
      navigation.navigate(route, {
        projectCode: projectCode,
        userLogin: userLogin,
        sheet: sheet,
        rev: rev,
        paramDrawingNo: drawingNo,
        title: title,
      });
      setIsScanned(false);
    }
    else if (destination === Naming.NAME_STR_QC) {
      navigation.navigate(route, {
        projectCode: projectCode,
        userLogin: userLogin,
        sheet: sheet,
        rev: rev,
        code: code,
        paramDrawingNo: drawingNo,
        title: title,
      });
      setIsScanned(false);
    }
    else {
      getDataAndNavigate(drawingNo, sheet, rev, route, title);
    }
  };

  const getDataAndNavigate = async (drawingNo, sheet, rev, route, title) => {
    setIsScanned(true);
    let token = await Helper.getData('TOKEN');
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        showComfirm('ERROR', 'Network not available!');
      } else {
        if (destination === Naming.NAME_STR_PIECE_MARK) {
          GetCurrentPieceMarkInfoAPI(projectCode, drawingNo, sheet, rev, code, token)
            .then(res => {
              if (res.success && res.data != null) {
                navigation.navigate(route, {
                  projectCode: projectCode,
                  facilityCode: res.data,
                  drawingNo: drawingNo,
                  sheet: sheet,
                  rev: rev,
                  code: code,
                  userLogin: userLogin,
                  title: title,
                  link: res.link,
                });
                setIsScanned(false);
              } else if (res.data == null) {
                let message = 'Not find FacilityCode with: \n'
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
        } else if (destination === Naming.NAME_STR_CONSTRUCTION) {
          GetCurrentConstructionInfoAPI(projectCode, drawingNo, sheet, rev, token)
            .then(res => {
              if (res.success && res.data != null) {
                navigation.navigate(route, {
                  projectCode: projectCode,
                  facilityCode: res.data,
                  drawingNo: drawingNo,
                  sheet: sheet,
                  rev: rev,
                  code: code,
                  userLogin: userLogin,
                  title: title,
                  link: res.link,
                });
                setIsScanned(false);
              } else if (res.data == null) {
                let message = 'Not find FacilityCode with: \n'
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