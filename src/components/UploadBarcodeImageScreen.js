import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Image } from 'react-native';
import { Button, Text, Icon, Toast } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import Icons from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-picker';
import NetInfo from '@react-native-community/netinfo';
import RNFetchBlob from 'rn-fetch-blob';
import { Port_Server } from '../Core';
import MessageAlert from './CustomViews/MessageAlert';

export default () => {
    const [imageSource, setImageSource] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);

    const _onPressChooseImage = () => {
        ImagePicker.showImagePicker(
            {
                title: 'Select Image',
                storageOptions: {
                    mediaType: 'image',
                    skipBackup: true,
                    path: 'bbos',
                },
            },
            response => {
                if (response.didCancel) {
                } else if (response.error) {
                    Toast.show({
                        text: response.error,
                        duration: 3000,
                    });
                } else {
                    Toast.show({
                        text: 'Choose image successfully.',
                        duration: 3000,
                    });
                    setImageSource({ uri: response.uri });
                    setFileUrl(response.data);
                }
            },
        );
    };

    const _onPressDeleteImage = () => {
        Toast.show({
            text: 'Delete image successfully.',
            duration: 3000,
        });
        setFileUrl(null);
        setImageSource(null);
    };

    const _onPressUploadImage = () => {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                MessageAlert('WARNING', 'The internet not connect.');
            } else {
                uploadImageToServer();
            }
        });
    };

    const uploadImageToServer = async () => {
        if (fileUrl == null) {
            Toast.show({
                text: 'Please choose an image.',
                duration: 3000,
            });
            return;
        }
        try {
            let projectCode = await AsyncStorage.getItem('PROJECT_CODE');
            let username = await AsyncStorage.getItem('USERNAME');
            let barcode = await AsyncStorage.getItem('BARCODE');
            let date = new Date().getDate();
            let month = new Date().getMonth() + 1;
            let year = new Date().getFullYear();
            let time = new Date().getTime();
            const imageName = barcode + '_' + username + '_' + date + '_' + month + '_' + year + '_' + time;
            RNFetchBlob.fetch(
                'POST',
                Port_Server + '/api/PIPWorkOrderDetail/UploadFileBarCode',
                {
                    Authorization: 'Bearer',
                    // otherHeader: "foo",
                    'Content-Type': 'multipart/form-data',
                },
                [
                    {
                        name: 'file',
                        filename: imageName + '.png',
                        type: 'image/png',
                        data: fileUrl,
                    },
                    { name: 'BarCode', data: barcode },
                    { name: 'ProjectCode', data: projectCode },
                    { name: 'Username', data: username },
                ],
            )
                .then(res => {
                    if (res.data) {
                        var result = JSON.parse(res.data);
                        MessageAlert('SUCCESS', result.responseText);
                    }
                })
                .catch(error => {
                    MessageAlert('CATCH', error.toString());
                });
        } catch (error) {
            MessageAlert('CATCH', error.toString());
        };
    };


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.actionContainer}>
                    {fileUrl != null
                        ? <Button
                            iconLeft
                            rounded
                            danger
                            style={styles.buttonAction}
                            onPress={_onPressDeleteImage}>
                            <Icon name="close" style={styles.buttonIcon} />
                            <Text>Delete</Text>
                        </Button>
                        : <Button iconLeft rounded disabled style={styles.buttonAction}>
                            <Icon name="close" style={styles.buttonIcon} />
                            <Text>Delete</Text>
                        </Button>
                    }
                    {fileUrl != null
                        ? <Button
                            iconLeft
                            rounded
                            success
                            style={styles.buttonAction}
                            onPress={_onPressUploadImage}>
                            <Icon name="push-outline" style={styles.buttonIcon} />
                            <Text>Upload</Text>
                        </Button>
                        : <Button iconLeft rounded disabled style={styles.buttonAction}>
                            <Icon name="push-outline" style={styles.buttonIcon} />
                            <Text>Upload</Text>
                        </Button>
                    }
                </View>
                {fileUrl == null
                    ? <View style={styles.imageContainer}>
                        <Icons name="plus-circle" size={48} onPress={_onPressChooseImage} />
                        <Text style={styles.text}>Choose image upload</Text>
                    </View>
                    : <Image
                        style={styles.imageContainer}
                        source={imageSource}
                        resizeMode="contain"
                    />
                }
            </View>
        </SafeAreaView>
    );
};

const BASE_COLOR = '#344955';
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        padding: 16,
        flex: 1,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    buttonAction: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '40%',
    },
    buttonIcon: {
        color: 'white',
    },
    imageContainer: {
        flex: 1,
        width: null,
        height: null,
        margin: 8,
        padding: 8,
        borderWidth: 1,
        borderColor: BASE_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        marginTop: 4,
    },
});
