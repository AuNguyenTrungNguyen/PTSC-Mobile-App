import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, FlatList, TextInput, TouchableOpacity, Modal, ImageBackground, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NetInfo from '@react-native-community/netinfo';

import GetListOrderAPI from '../apis/GetListOrder';
import UpdateOrderDetailAPI from '../apis/UpdateOrderDetail';

import { Port_Server } from '../Core';
import MessageAlert from './CustomViews/MessageAlert';

export default () => {

    /**
     * State using for update ActutalMHRS
     */
    const [listOrder, setListOrder] = useState([]);
    const [listUpdate, setListUpdate] = useState([]);
    const [drawingNo, setDrawingNo] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    /**
     * State using for update Image Barcode
     */
    const [imageLoading, setImageLoading] = useState(false);
    const [imageSource, setImageSource] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [isShowModal, setIsShowModal] = useState(false);

    /**
     * State using for Alert Notification
     */
    const [isLoading, setIsLoading] = useState(true);
    const [isImageUpload, setIsImageUpload] = useState(false);

    const _pressChooseImage = () => {
        setImageLoading(true);
        ImagePicker.showImagePicker({
            title: 'Select Image',
            storageOptions: {
                mediaType: 'image',
                skipBackup: true,
                path: 'bbos',
            },
        }, (response) => {
            setImageLoading(false);
            if (response.didCancel) {
                setImageLoading(false);
            } else if (response.error) {
                setImageLoading(false);
                MessageAlert('ERROR: ', response.error);
            } else {
                setImageLoading(false);
                MessageAlert('SUCCESS', 'Choose image successfully.');
                setImageSource({ uri: response.uri });
                setFileUrl(response.data);
            }
        });
    }

    const _pressViewImage = () => {
        setIsShowModal(true);
    }

    const _pressDeleteImage = () => {
        MessageAlert('SUCCESS', 'Delete image successfully.');
        setFileUrl(null);
        setImageSource(null);
    }

    const _pressCloseImage = () => {
        setIsShowModal(false);
    }

    const _onRefresh = () => {
        setIsRefreshing(true);
        getDataFromAPI()
    }

    const checkNumber = input => {
        const regexNumber = /^[0-9]*$/;
        return input !== '' && regexNumber.test(input);
    }

    const getDataFromAPI = async () => {
        try {
            let projectCode = await AsyncStorage.getItem('PROJECT_CODE');
            let username = await AsyncStorage.getItem('USERNAME');
            let barcode = await AsyncStorage.getItem('BARCODE');
            projectCode = 'BD1';
            username = 'Admin4';
            barcode = 'LSX18090015';
            GetListOrderAPI(projectCode, username, barcode)
                .then(res => {
                    console.log(res);
                    if (Array.isArray(res) && res.length) {
                        setDrawingNo(res[0].DrawingNo);
                        setListOrder(res);
                        setListUpdate(res);
                    }
                    setIsLoading(false);
                    setIsRefreshing(false);
                })
                .catch(error => {
                    setIsLoading(false);
                    setIsRefreshing(false);
                    MessageAlert('CATCH', error.toString());
                });
        } catch (error) {
            setIsLoading(false);
            setIsRefreshing(false);
            MessageAlert('CATCH', error.toString());
        }
    }

    const updateActutalsToServer = () => {
        let errorIndexs = [];
        let listOrderUpdate = [];
        listUpdate.forEach((item, index) => {
            if (item.RowIndex === listOrder[index].RowIndex && item.ActutalMHRS !== listOrder[index].ActutalMHRS) {
                if (!checkNumber(item.ActutalMHRS)) {
                    errorIndexs.push(item.JointNo);
                } else {
                    listOrderUpdate.push(item);
                }
            }
        });
        if (errorIndexs.length) {
            let message = 'Value in JointNo [ ';
            errorIndexs.forEach(item => {
                message += item + ' ';
            });
            message += '] is invalid.'
            MessageAlert('ERROR', message);
            return;
        }
        listOrderUpdate.forEach((item) => {
            UpdateOrderDetailAPI(item.RowIndex, item.ActutalMHRS)
                .then(res => {
                    if (res.success) {
                        MessageAlert('SUCCESS', 'Update value in JointNo ' + item.JointNo + ' successfully.');
                    } else if (res.Message) {
                        MessageAlert('ERROR', 'Update value in JointNo ' + item.JointNo + ' unsuccessfully.');
                    }
                    getDataFromAPI();
                })
                .catch(error => {
                    MessageAlert('CATCH', error.toString());
                });
            getDataFromAPI();
        });
    };

    const uploadImageToServer = async () => {
        if (fileUrl == null) {
            return;
        }
        // TODO Handle resize image after upload to server
        // ...
        try {
            // let projectCode = await AsyncStorage.getItem('PROJECT_CODE');
            // let username = await AsyncStorage.getItem('USERNAME');
            // let barcode = await AsyncStorage.getItem('BARCODE');
            let date = new Date().getDate();
            let month = new Date().getMonth() + 1;
            let year = new Date().getFullYear();
            let time = new Date().getTime();
            const imageName = barcode + "_" + username + "_" + date + '_' + month + '_' + year + '_' + time;
            console.log(imageName);
            console.log(fileUrl);
            // RNFetchBlob.fetch('POST', Port_Server + '/api/PIPWorkOrderDetail/UploadFileBarCode', {
            //     Authorization: "Bearer access-token",
            //     otherHeader: "foo",
            //     'Content-Type': 'multipart/form-data',
            // }, [
            //     { name: 'file', filename: imageName + '.png', type: 'image/png', data: fileUrl },
            //     { name: 'BarCode', data: barcode },
            //     { name: 'ProjectCode', data: projectCode },
            //     { name: 'Username', data: username },
            // ]).then((res) => {
            //     if (res.data) {
            //         setIsImageUpload(true);
            //     }
            // }).catch((error) => {
            //     MessageAlert('CATCH', error.toString());
            // });
        } catch (error) {
            MessageAlert('CATCH', error.toString());
        }
    }

    const _submitData = () => {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                MessageAlert('WARNING', 'The internet not connect.');
            } else {
                // updateActutalsToServer();
                // uploadImageToServer();
            }
        });
    }

    useEffect(() => {
        getDataFromAPI();
    }, []);

    return (
        <View style={styles.safeArea}>
            {isLoading ? <ActivityIndicator size='large' color={BASE_COLOR} style={styles.loading} /> : null}
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <FlatList
                        ListHeaderComponent={
                            <View>
                                <Text style={[styles.itemRow, styles.itemHeader, styles.itemDrawing]}>
                                    DrawingNo: <Text style={styles.textDrawing}>{drawingNo}</Text>
                                </Text>
                                <View style={styles.itemContainer}>
                                    <Text style={[styles.itemRow, styles.itemHeader]}>JointNo</Text>
                                    <Text style={[styles.itemRow, styles.itemHeader]}>ActutalMHRS</Text>
                                </View>
                            </View>
                        }
                        onRefresh={_onRefresh}
                        refreshing={isRefreshing}
                        style={styles.listOrder}
                        data={listOrder}
                        renderItem={({ item, index }) =>
                            <View style={styles.itemContainer}>
                                <View style={[styles.itemRow, styles.itemJointNo, styles.itemNumber]}>
                                    <TextInput
                                        style={styles.input}
                                        value={String(item.JointNo)}
                                        editable={false}
                                    />
                                </View>
                                <View style={[styles.itemRow, styles.itemActutal]}>
                                    <TextInput
                                        style={styles.input}
                                        keyboardType='numeric'
                                        value={listUpdate[index]
                                            ? String(listUpdate[index].ActutalMHRS)
                                            : String(listOrder[index].ActutalMHRS)
                                        }
                                        onChangeText={
                                            valueUpdate => {
                                                let tempTable = [...listUpdate];
                                                const newItem = {
                                                    ...tempTable[index],
                                                    ActutalMHRS: valueUpdate,
                                                };
                                                tempTable.splice(index, 1, newItem);
                                                setListUpdate(tempTable);
                                            }
                                        }
                                    />
                                </View>
                            </View>
                        }
                        keyExtractor={item => item.RowIndex.toString()}
                    />
                    <Text style={styles.action}>Upload Image:</Text>
                    <View style={styles.actionContainer}>
                        {imageLoading
                            ? <TouchableOpacity style={[styles.buttonAction, styles.buttonChoose]} disabled={imageLoading}>
                                <ActivityIndicator size="large" color="white" />
                            </TouchableOpacity>
                            : <TouchableOpacity style={[styles.buttonAction, styles.buttonChoose]} onPress={_pressChooseImage}>
                                <Text style={styles.buttonTitle}>Choose</Text>
                            </TouchableOpacity>
                        }
                        {fileUrl != null
                            ? <TouchableOpacity style={[styles.buttonAction, styles.buttonView]} onPress={_pressViewImage}>
                                <Text style={styles.buttonTitle}>View</Text>
                            </TouchableOpacity>
                            : <TouchableOpacity disabled={true}
                                style={[styles.buttonAction, styles.buttonDisable]}>
                                <Text style={styles.buttonTitle}>View</Text>
                            </TouchableOpacity>
                        }
                        {fileUrl != null
                            ? <TouchableOpacity style={[styles.buttonAction, styles.buttonDelete]} onPress={_pressDeleteImage}>
                                <Text style={styles.buttonTitle}>Delete</Text>
                            </TouchableOpacity>
                            : <TouchableOpacity disabled={true}
                                style={[styles.buttonAction, styles.buttonDisable]}>
                                <Text style={styles.buttonTitle}>Delete</Text>
                            </TouchableOpacity>
                        }
                    </View>
                    <TouchableOpacity style={styles.buttonContainer} onPress={_submitData} autoFocus={true} visible={isShowModal}>
                        <Text style={styles.buttonTitle}>Submit to Server</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isShowModal}>
                    <SafeAreaView style={styles.safeArea}>
                        <View style={styleModal.modalContainer}>
                            <ImageBackground
                                style={styleModal.modalImage}
                                source={imageSource}>
                                <Icon name="times-circle" onPress={_pressCloseImage} style={styleModal.modalIcon} />
                            </ImageBackground>
                        </View>
                    </SafeAreaView>
                </Modal>
            </SafeAreaView>
        </View>
    );
}

const BASE_COLOR = '#344955';
const BASE_CELL_HEIGHT = 40;
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        padding: 16,
        flex: 1,
    },
    loading: {
        width: '100%',
        height: '100%',
    },
    listOrder: {
        width: '100%',
        height: 'auto',
    },
    itemContainer: {
        flexDirection: 'row',
        height: BASE_CELL_HEIGHT
    },
    itemRow: {
        borderColor: BASE_COLOR,
        borderWidth: 1,
        lineHeight: BASE_CELL_HEIGHT,
        paddingLeft: 4,
        paddingRight: 4,
        flex: 1,
    },
    itemHeader: {
        fontWeight: 'bold',
        color: BASE_COLOR,
        textAlign: 'center',
    },
    itemDrawing: {
        flex: 0,
        textAlign: 'left',
    },
    textDrawing: {
        color: '#b00020',
        fontSize: 15
    },
    itemNumber: {
        textAlign: 'right',
    },
    input: {
        height: '100%',
        color: BASE_COLOR,
    },

    actionContainer: {
        height: 48,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonChoose: {
        backgroundColor: '#007bff',
    },
    buttonView: {
        backgroundColor: '#28a745',
    },
    buttonDelete: {
        backgroundColor: '#dc3545'
    },
    buttonAction: {
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        width: '30%',
    },
    buttonDisable: {
        backgroundColor: 'gray',
        opacity: 0.7,
    },

    buttonContainer: {
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BASE_COLOR,
        borderRadius: 32,
        marginTop: 16,
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
    },
    action: {
        color: BASE_COLOR,
        fontSize: 18,
        marginTop: 12,
        marginBottom: 16,
    },
});
const styleModal = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    modalImage: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover',
        alignItems: 'flex-end',
    },
    modalIcon: {
        fontSize: 32,
        color: 'black',
        margin: 8,
        backgroundColor: 'white',
        opacity: 0.5,
    },
});