import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, TextInput, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';

import LoadDataRoleAPI from '../apis/LoadDataRole';
import MessageAlert from './CustomViews/MessageAlert';


const BASE_COLOR = '#344955';
const OPP_COLOR = 'white';

const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        MessageAlert('CATCH', error.toString());
    }
};
export default ({ route, navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [listProject, setListProject] = useState([]);
    const [projectCode, setProjectCode] = useState(null);
    const [barcode, setBarcode] = useState(null);

    const getDataFromAPI = async () => {
        try {
            let username = await AsyncStorage.getItem('USERNAME');
            LoadDataRoleAPI(username)
                .then(res => {
                    if (res == null) {
                        setIsLoading(false);
                        return;
                    }
                    if (res.Message != null) {
                        MessageAlert('ERROR', res.Message);
                        setIsLoading(false);
                        return;
                    }
                    setListProject(res);
                    setIsLoading(false);
                    setBarcode('LSX18090015');
                })
                .catch(error => {
                    setIsLoading(false);
                    MessageAlert('CATCH', error.toString());
                });
        } catch (error) {
            setIsLoading(false);
            MessageAlert('CATCH', error.toString());
        }
    };

    const _onChangeProjectCode = (value) => {
        setProjectCode(value);
    };

    const _onPressBarcodeScanner = () => {
        navigation.navigate('Camera');
    };

    const validateValues = () => {
        if (projectCode == null) {
            MessageAlert('ERROR', 'Please select a project.');
            return;
        }
        if (barcode == null) {
            MessageAlert('ERROR', 'Please scan a barcode.');
            return;
        }
        try {
            storeData('PROJECT_CODE', projectCode);
            storeData('BARCODE', barcode);
        } catch (error) {
            MessageAlert('CATCH', error.toString());
        }
    };

    const _onPressTrackingBarcode = () => {
        validateValues();
        navigation.navigate('Update');
    };

    const _onPressUploadImage = () => {
        validateValues();
        navigation.navigate('Upload');
    };

    useEffect(() => {
        getDataFromAPI();
        if (route.params?.barCode) {
            setBarcode(route.params?.barCode);
        }
    }, []);

    return (
        <View style={styles.safeArea}>
            {isLoading ? <ActivityIndicator size='large' color={BASE_COLOR} style={styles.loading} /> : null}
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <View style={styles.containerCenter}>
                        <Dropdown
                            label='Select Poject'
                            data={listProject}
                            onChangeText={_onChangeProjectCode}
                            baseColor={BASE_COLOR}
                            textColor={BASE_COLOR}
                        />
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                editable={false}
                                placeholder='Scan a Barcode'
                                placeholderTextColor={BASE_COLOR}
                                value={barcode}
                            />
                            <Icon name='camera' style={styles.icon} onPress={_onPressBarcodeScanner} />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.buttonContainer}
                        onPress={_onPressTrackingBarcode}>
                        <Text style={styles.buttonTitle}>Tracking WO with Barcode</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonContainer}
                        onPress={_onPressUploadImage}>
                        <Text style={styles.buttonTitle}>Upload Barcode image </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    containerCenter: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },

    loading: {
        width: '100%',
        height: '100%',
    },

    inputContainer: {
        marginTop: 48,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: BASE_COLOR,
        borderBottomWidth: 1,
        height: 48,
    },
    input: {
        fontSize: 16,
        flex: 1,
        height: '100%',
        color: BASE_COLOR,
    },
    icon: {
        marginLeft: 16,
        fontSize: 30,
        color: BASE_COLOR,
    },

    buttonContainer: {
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BASE_COLOR,
        borderRadius: 32,
        marginTop: 24,
    },
    buttonTitle: {
        color: OPP_COLOR,
        fontSize: 16,
    },
});
