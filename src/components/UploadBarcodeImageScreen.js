import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Image, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icons from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import NetInfo from '@react-native-community/netinfo';
import RNFetchBlob from 'rn-fetch-blob';
import { Port_Server } from '../Core';
import MessageAlert from './CustomViews/MessageAlert';

export default () => {
    const [imageSource, setImageSource] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const _onPressChooseImage = () => {
        setIsLoading(true);
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
                    setIsLoading(false);
                } else if (response.error) {
                    setIsLoading(false);
                } else {
                    ImageResizer.createResizedImage(response.uri, 1000, 1000, 'PNG', 0, response.originalRotation)
                        .then(res => {
                            RNFS.readFile(res.uri, 'base64')
                                .then(data => {
                                    setIsLoading(false);
                                    setImageSource({ uri: res.uri });
                                    setFileUrl(data);
                                })
                                .catch(error => {
                                    setIsLoading(false);
                                    setImageSource({ uri: res.uri });
                                    setFileUrl(response.data);
                                });
                        })
                        .catch(error => {
                            setIsLoading(false);
                            setImageSource({ uri: response.uri });
                            setFileUrl(response.data);
                        });
                }
            },
        );
    };

    const _onPressDeleteImage = () => {
        setFileUrl(null);
        setImageSource(null);
    };

    const _onPressUploadImage = () => {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                MessageAlert('WARNING', 'Network not available!');
            } else {
                setIsUploading(true);
                uploadImageToServer();
            }
        });
    };

    const uploadImageToServer = async () => {
        if (fileUrl == null) {
            setIsUploading(false);
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
                    // Authorization: 'Bearer',
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
                    setIsUploading(false);
                    MessageAlert('SUCCESS', JSON.parse(res.data).responseText);
                })
                .catch(error => {
                    setIsUploading(false);
                    MessageAlert('ERROR', error.toString());
                });
        } catch (error) {
            setIsUploading(false);
            MessageAlert('ERROR', error.toString());
        };
    };

    const ButtonUploading = () => {
        if (isUploading) {
            return (
                <TouchableOpacity style={styles.buttonActionDisable} disabled={true}>
                    <ActivityIndicator size='large' color='white' />
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity style={styles.buttonActionUpload} onPress={_onPressUploadImage}>
                <Text style={styles.buttonTitle}>Upload</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.safeArea}>
                {isLoading ? <View style={styles.loading}>
                    <ActivityIndicator size='large' color='#344955' />
                </View> : null}
                <View style={styles.container}>
                    <View style={styles.borderContainer}>
                        {fileUrl == null
                            ? <View style={styles.imageContainer}>
                                <Icons name="plus-circle" size={48} onPress={_onPressChooseImage} />
                                <Text style={styles.text}>Choose image upload</Text>
                            </View>
                            : <View style={styles.imageContainer}>
                                <Image
                                    style={styles.image}
                                    source={imageSource}
                                    resizeMode='contain' />
                            </View>
                        }
                    </View>
                    <View style={styles.actionContainer}>
                        {fileUrl == null || isUploading
                            ? <TouchableOpacity style={styles.buttonActionDisable} disabled={true}>
                                <Text style={styles.buttonTitle}>Delete</Text>
                            </TouchableOpacity>
                            : <TouchableOpacity style={styles.buttonActionDelete} onPress={_onPressDeleteImage}>
                                <Text style={styles.buttonTitle}>Delete</Text>
                            </TouchableOpacity>
                        }
                        {fileUrl != null
                            ? ButtonUploading()
                            : <TouchableOpacity style={styles.buttonActionDisable} disabled={true}>
                                <Text style={styles.buttonTitle}>Upload</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const BASE_COLOR = '#344955';
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    loading: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        padding: 16,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    borderContainer: {
        height: '50%',
        borderWidth: 1,
        borderColor: BASE_COLOR,
        padding: 8,
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%'
    },
    text: {
        fontSize: 18,
        marginTop: 8,
    },
    actionContainer: {
        marginTop: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    buttonActionDelete: {
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        width: '40%',
        height: '100%',
        backgroundColor: 'red'
    },
    buttonActionUpload: {
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        width: '40%',
        height: '100%',
        backgroundColor: 'green'
    },
    buttonActionDisable: {
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        width: '40%',
        height: '100%',
        backgroundColor: 'gray',
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
    },
});
