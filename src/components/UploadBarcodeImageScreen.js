import React, { useState, useEffect } from 'react';
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

    const [barcode, setBarcode] = useState(null);
    const [projectCode, setProjectCode] = useState(null);

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
        if (fileUrl == null) {
            MessageAlert('WARNING', 'There are no photos to delete!');
            return;
        }
        setFileUrl(null);
        setImageSource(null);
    };

    const _onPressUploadImage = () => {
        if (fileUrl == null) {
            MessageAlert('WARNING', 'Please select a photo to upload!');
            return;
        }
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
        try {
            let username = await AsyncStorage.getItem('USERNAME');
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
                    setFileUrl(null);
                    setImageSource(null);
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

    const getData = async () => {
        try {
            let projectCode = await AsyncStorage.getItem('PROJECT_CODE');
            let barcode = await AsyncStorage.getItem('BARCODE');
            setBarcode(barcode);
            setProjectCode(projectCode);
        } catch (error) {
            MessageAlert('ERROR', error.toString());
        };
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>
                        Project Code: <Text style={styles.infoValue}>{projectCode}</Text>
                    </Text>
                    <Text style={styles.infoTitle}>
                        Barcode: <Text style={styles.infoValue}>{barcode}</Text>
                    </Text>
                </View>
                <View style={styles.borderContainer}>
                    {isLoading
                        ? <View style={styles.imageContainer}>
                            <ActivityIndicator size='large' color='#344955' />
                        </View>
                        : fileUrl == null
                            ? <View style={styles.imageContainer}>
                                <Icons name="plus-circle" size={48} onPress={_onPressChooseImage} color={BASE_COLOR} />
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
                    <TouchableOpacity style={styles.buttonActionDelete} onPress={_onPressDeleteImage}>
                        <Text style={styles.buttonTitle}>Delete</Text>
                    </TouchableOpacity>
                    {isUploading
                        ? <TouchableOpacity style={styles.buttonActionDisable} disabled={true}>
                            <ActivityIndicator size='large' color='white' />
                        </TouchableOpacity>
                        : <TouchableOpacity style={styles.buttonActionUpload} onPress={_onPressUploadImage}>
                            <Text style={styles.buttonTitle}>Upload</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </SafeAreaView>
    );
};

const BASE_COLOR = '#344955';
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
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
        fontSize: 20,
        marginTop: 24,
        color: BASE_COLOR,
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
        backgroundColor: '#dc3534'
    },
    buttonActionUpload: {
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        width: '40%',
        height: '100%',
        backgroundColor: BASE_COLOR,
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
    infoContainer: {
        marginBottom: 16,
    },
    infoTitle: {
        color: BASE_COLOR,
        fontSize: 16,
        marginBottom: 24,
    },
    infoValue: {
        color: '#b00020',
        fontSize: 16,
    },
});
