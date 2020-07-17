import React from 'react';
import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import { RNCamera } from 'react-native-camera';

export default ({ navigation }) => {

    const _onBarCodeRead = (scanResult) => {
        if (scanResult.data !== null) {
            navigation.navigate('Home', {
                barCode: scanResult.data,
            });
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <RNCamera
                style={styles.containerCamera}
                type={RNCamera.Constants.Type.back}
                onBarCodeRead={_onBarCodeRead}
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
                    <Text style={styles.note}>Please move your camera over Barcode to scan it</Text>
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
