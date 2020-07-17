import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';

import GetListOrderAPI from '../apis/GetListOrder';
import UpdateActutalsAPI from '../apis/UpdateActutalsAPI';
import MessageAlert from './CustomViews/MessageAlert';

export default () => {

    const [isLoading, setIsLoading] = useState(true);
    const [listOrder, setListOrder] = useState([]);
    const [listUpdate, setListUpdate] = useState([]);
    const [drawingNo, setDrawingNo] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const _onRefresh = () => {
        setIsRefreshing(true);
        Keyboard.dismiss();
        getDataFromAPI();
    }

    const _onPressSubmitData = () => {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                MessageAlert('WARNING', 'The internet not connect.');
            } else {
                updateActutalsToServer();
            }
        });
    };

    const checkNumber = input => {
        const regexNumber = /^[0-9]*$/;
        return input !== '' && regexNumber.test(input);
    };

    const getDataFromAPI = async () => {
        try {
            let projectCode = await AsyncStorage.getItem('PROJECT_CODE');
            let username = await AsyncStorage.getItem('USERNAME');
            let barcode = await AsyncStorage.getItem('BARCODE');
            GetListOrderAPI(projectCode, username, barcode)
                .then(res => {
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
        };
    };

    const updateActutalsToServer = async () => {
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

        if (!listOrderUpdate.length) {
            MessageAlert('WARNING', 'No any data changes!');
            return;
        }

        try {
            let projectCode = await AsyncStorage.getItem('PROJECT_CODE');
            let barcode = await AsyncStorage.getItem('BARCODE');
            UpdateActutalsAPI(projectCode, barcode, listOrderUpdate)
                .then(res => {
                    if (res.success) {
                        MessageAlert('SUCCESS', res.responseText);
                    } else {
                        MessageAlert('ERROR', res.responseText);
                    }
                    getDataFromAPI();
                }).catch(error => {
                    MessageAlert('CATCH', error.toString());
                });
        } catch (error) {
            MessageAlert('CATCH', error.toString());
        };
    };

    useEffect(() => {
        getDataFromAPI();
    }, []);

    return (
        <View style={styles.safeArea}>
            {isLoading ? <ActivityIndicator size='large' color={BASE_COLOR} style={styles.loading} /> : null}
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <FlatList
                        style={{ flex: 1 }}
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
                    <TouchableOpacity style={styles.buttonContainer} onPress={_onPressSubmitData} autoFocus={true}>
                        <Text style={styles.buttonTitle}>Submit to Server</Text>
                    </TouchableOpacity>
                </View>
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
    buttonContainer: {
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BASE_COLOR,
        borderRadius: 32,
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
    },
});