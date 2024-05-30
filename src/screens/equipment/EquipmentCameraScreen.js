import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, Appearance, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Constant from '../../utils/Constant';

const EquipmentCameraScreen = ({ route, navigation }) => {

  const { source } = route.params;
  const [isScanned, setIsScanned] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsScanned(false);
    });
    return unsubscribe;
  }, [navigation]);

  let colorIcon = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={_onSearch} style={{ paddingRight: 16 }}>
          <Ionicons name='search-outline' size={24} color={colorIcon} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const _onQRCodeRead = scanResult => {
    if (!isScanned) {
      setIsScanned(true);
      _onGoDetail(scanResult.data);
    }
  };

  const _onSearch = async () => {
    var screen = 'DailyTaskPlan';
    if (source == Constant.CAMERA_EQUIPMENT_STATUS) {
      screen = 'EquipmentDataControlList'
    }
    navigation.navigate('EquipmentList', {
      screen: screen,
    });
  };

  const _onGoDetail = async code => {
    var screen = 'DailyTaskPlan';
    if (source == Constant.CAMERA_EQUIPMENT_STATUS) {
      screen = 'EquipmentDataControlList'
    }
    navigation.navigate(screen, {
      equipmentCode: code,
    });
  };

  // const _onGoDetail = async code => {
  //   NetInfo.fetch().then(state => {
  //     if (!state.isConnected) {
  //       showComfirm('ERROR', 'Network not available!');
  //     } else {
  //       GetEquipmentDetailAPI(code)
  //         .then(res => {
  //           if (res.Success) {
  //             if (res.Data) {
  //               navigation.navigate('DailyTaskPlan', {
  //                 code: code,
  //                 category: res.Data.EquipmentCategory,
  //               });
  //             } else {
  //               showComfirm('ERROR', 'Not found EquipmentCode: ' + code);
  //             }
  //           }
  //           else {
  //             showComfirm('ERROR', res.Message);
  //           }
  //         }).catch(() => {
  //           showComfirm('ERROR', 'Please check that you are using the company network!');
  //         });
  //     }
  //   });
  // };

  // const showComfirm = (type, message) => {
  //   Alert.alert(
  //     type,
  //     message,
  //     [
  //       {
  //         text: 'Back',
  //         onPress: () => {
  //           navigation.goBack();
  //         },
  //         style: 'cancel'
  //       },
  //       {
  //         text: 'Rescan',
  //         onPress: () => { setIsScanned(false) }
  //       }
  //     ],
  //     { cancelable: false },
  //   );
  // };

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
const BASE_COLOR = '#344955';
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

export default EquipmentCameraScreen;