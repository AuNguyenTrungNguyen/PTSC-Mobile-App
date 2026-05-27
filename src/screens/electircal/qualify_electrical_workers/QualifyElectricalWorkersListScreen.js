import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput, Keyboard, Appearance, VirtualizedList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import SelectPopup from '../../../components/SelectPopup';
import { ListEmptyData } from '../../../components/HelperUI';

const MOCK_DATA = [
    { RowIndex: 1, Name: 'Nguyen Van A', NationalID: '001234567890', EmployeeCode: 'EMP-001' },
    { RowIndex: 2, Name: 'Tran Thi B', NationalID: '001234567891', EmployeeCode: 'EMP-002' },
    { RowIndex: 3, Name: 'Le Van C', NationalID: '001234567892', EmployeeCode: 'EMP-003' },
    { RowIndex: 4, Name: 'Pham Thi D', NationalID: '001234567893', EmployeeCode: 'EMP-004' },
    { RowIndex: 5, Name: 'Hoang Van E', NationalID: '001234567894', EmployeeCode: 'EMP-005' },
    { RowIndex: 6, Name: 'Vu Thi F', NationalID: '001234567895', EmployeeCode: 'EMP-006' },
    { RowIndex: 7, Name: 'Dang Van G', NationalID: '001234567896', EmployeeCode: 'EMP-007' },
    { RowIndex: 8, Name: 'Bui Thi H', NationalID: '001234567897', EmployeeCode: 'EMP-008' },
    { RowIndex: 9, Name: 'Do Van I', NationalID: '001234567898', EmployeeCode: 'EMP-009' },
    { RowIndex: 10, Name: 'Ngo Thi J', NationalID: '001234567899', EmployeeCode: 'EMP-010' },
];

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
    const TYPE_OF_WORK_DEFAULT = 'All';
    const [isVisibleTypeOfWork, setIsVisibleTypeOfWork] = useState(false);
    const [typeOfWorkList] = useState(['All', 'Glanding And Termination', 'Cable Testing and Check Sheet Completion']);
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

    //-- Results
    const [workerItems, setWorkerItems] = useState(null);

    //-- Search
    const _onPressSearch = () => {
        Keyboard.dismiss();
        // TODO: replace with real API call
        setWorkerItems(MOCK_DATA);
    };

    //-- Add Result
    const _onPressAddResult = () => {
        navigation.navigate('QualifyElectricalWorkersAdd', { projectCode });
    };

    //-- Render Item
    const renderItem = ({ item }) => (
        <View style={styles.box}>
            <View style={styles.rowData}>
                <Text style={styles.cellLabel}>Name:</Text>
                <Text style={styles.cellValue}>{item.Name}</Text>
            </View>
            <View style={styles.rowData}>
                <Text style={styles.cellLabel}>National ID:</Text>
                <Text style={styles.cellValue}>{item.NationalID}</Text>
            </View>
            <View style={styles.rowData}>
                <Text style={styles.cellLabel}>Employee Code:</Text>
                <Text style={styles.cellValue}>{item.EmployeeCode}</Text>
            </View>
        </View>
    );

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
                            <View style={{ width: 8 }} />
                            <TouchableOpacity style={styles.addButton} onPress={_onPressAddResult}>
                                <Text style={styles.buttonTitle}>Add Result</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {workerItems && workerItems.length > 0
                    ? <VirtualizedList
                        style={styles.table}
                        data={workerItems}
                        getItemCount={data => data.length}
                        getItem={(data, index) => data[index]}
                        keyExtractor={item => item.RowIndex.toString()}
                        renderItem={renderItem}
                    />
                    : <ListEmptyData />
                }
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
    addButton: {
        flex: 2,
        backgroundColor: '#2e7d32',
        borderRadius: 4,
        paddingVertical: 8,
        alignItems: 'center',
    },
    buttonTitle: {
        color: OPP_COLOR,
        fontWeight: 'bold',
        fontSize: 14,
    },
    table: {
        flex: 1,
    },
    box: {
        margin: 8,
        marginBottom: 0,
        padding: 10,
        borderColor: BASE_COLOR,
        borderWidth: 1,
        borderRadius: 8,
    },
    rowData: {
        flexDirection: 'row',
        paddingVertical: 3,
    },
    cellLabel: {
        width: 130,
        color: BASE_COLOR,
        fontWeight: 'bold',
        fontSize: 13,
    },
    cellValue: {
        flex: 1,
        color: '#333',
        fontSize: 13,
    },
});

export default QualifyElectricalWorkersListScreen;
