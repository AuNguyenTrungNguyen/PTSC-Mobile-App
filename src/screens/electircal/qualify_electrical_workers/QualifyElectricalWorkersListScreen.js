import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput, Keyboard, Appearance, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import SelectPopup from '../../../components/SelectPopup';
import { ListSelectData } from '../../../components/HelperUI';

const QualifyElectricalWorkersListScreen = ({ route, navigation }) => {

    const { projectCode } = route.params;

    const [isShowFilter, setIsShowFilter] = useState(true);
    const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center', marginRight: 8 }}
                    onPress={() => setIsShowFilter(prev => !prev)}>
                    <Icon name={isShowFilter ? 'chevron-up' : 'chevron-down'} size={18} color={iconColor} />
                </TouchableOpacity>
            ),
        });
    }, [navigation, isShowFilter]);

    //-- Contractor Name
    const CONTRACTOR_DEFAULT = 'Select Contractor';
    const [isVisibleContractor, setIsVisibleContractor] = useState(false);
    const [contractorList, setContractorList] = useState([]);
    const [contractorName, setContractorName] = useState(CONTRACTOR_DEFAULT);
    const _onChangeContractor = value => {
        setContractorName(value);
        setIsVisibleContractor(false);
    };
    const _onClearContractor = () => {
        setContractorName(CONTRACTOR_DEFAULT);
        setIsVisibleContractor(false);
    };

    //-- Type of Work
    const TYPE_OF_WORK_DEFAULT = 'Select Type of Work';
    const [isVisibleTypeOfWork, setIsVisibleTypeOfWork] = useState(false);
    const [typeOfWorkList, setTypeOfWorkList] = useState([]);
    const [typeOfWork, setTypeOfWork] = useState(TYPE_OF_WORK_DEFAULT);
    const _onChangeTypeOfWork = value => {
        setTypeOfWork(value);
        setIsVisibleTypeOfWork(false);
    };
    const _onClearTypeOfWork = () => {
        setTypeOfWork(TYPE_OF_WORK_DEFAULT);
        setIsVisibleTypeOfWork(false);
    };

    //-- Name
    const [name, setName] = useState('');

    //-- Search
    const _onPressSearch = () => {
        Keyboard.dismiss();
        // TODO: call search API
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {isShowFilter && (
                    <View style={styles.headerContainer}>
                        {/* Contractor Name */}
                        <View style={styles.rowInfoAction}>
                            <Text style={styles.infoTitleAction}>Contractor Name:</Text>
                            <TouchableOpacity style={styles.selectContainer} onPress={() => setIsVisibleContractor(true)}>
                                <Text style={styles.buttonTitleDark}>{contractorName}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Type of Work */}
                        <View style={styles.rowInfoAction}>
                            <Text style={styles.infoTitleAction}>Type of Work:</Text>
                            <TouchableOpacity style={styles.selectContainer} onPress={() => setIsVisibleTypeOfWork(true)}>
                                <Text style={styles.buttonTitleDark}>{typeOfWork}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Name */}
                        <View style={styles.rowInfoAction}>
                            <Text style={styles.infoTitleAction}>Name:</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.inputText}
                                    value={name}
                                    onChangeText={setName}
                                    underlineColorAndroid='transparent'
                                />
                                {name !== '' && (
                                    <Icon name='times-circle' onPress={() => setName('')} style={styles.inputIcon} />
                                )}
                            </View>
                        </View>

                        {/* Search Button */}
                        <View style={styles.rowInfoAction}>
                            <Text style={styles.infoTitleAction} />
                            <TouchableOpacity style={styles.searchButton} onPress={_onPressSearch}>
                                <Text style={styles.buttonTitle}>Search</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <ListSelectData title={'Please enter search criteria'} />
            </View>

            <SelectPopup
                visible={isVisibleContractor}
                data={contractorList}
                onCancel={() => setIsVisibleContractor(false)}
                onClear={_onClearContractor}
                onChangeItem={_onChangeContractor}
            />
            <SelectPopup
                visible={isVisibleTypeOfWork}
                data={typeOfWorkList}
                onCancel={() => setIsVisibleTypeOfWork(false)}
                onClear={_onClearTypeOfWork}
                onChangeItem={_onChangeTypeOfWork}
            />
        </SafeAreaView>
    );
};

const BASE_COLOR = '#344955';
const OPP_COLOR = 'white';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: OPP_COLOR,
    },
    container: {
        flex: 1,
        backgroundColor: OPP_COLOR,
    },
    headerContainer: {
        padding: 8,
        borderBottomColor: BASE_COLOR,
        borderBottomWidth: 1,
    },
    rowInfoAction: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoTitleAction: {
        width: 130,
        color: BASE_COLOR,
        fontWeight: 'bold',
        fontSize: 13,
    },
    selectContainer: {
        flex: 1,
        borderColor: BASE_COLOR,
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    buttonTitleDark: {
        color: BASE_COLOR,
        fontSize: 13,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: BASE_COLOR,
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
    },
    inputText: {
        flex: 1,
        color: BASE_COLOR,
        fontSize: 13,
        paddingVertical: 4,
    },
    inputIcon: {
        color: BASE_COLOR,
        fontSize: 16,
        paddingLeft: 4,
    },
    searchButton: {
        flex: 1,
        backgroundColor: BASE_COLOR,
        borderRadius: 4,
        paddingVertical: 8,
        alignItems: 'center',
    },
    buttonTitle: {
        color: OPP_COLOR,
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default QualifyElectricalWorkersListScreen;
