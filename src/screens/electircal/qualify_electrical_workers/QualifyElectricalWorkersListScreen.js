import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput, Keyboard, Appearance, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import SelectPopup from '../../../components/SelectPopup';
import MultiSelectPopup from '../../../components/MultiSelectPopup';
import { ListEmptyData } from '../../../components/HelperUI';

const MOCK_DATA = [
    {
        RowIndex: 1, TypeOfWork: 'Glanding', CableName: 'Cable-001',
        GlandingFromResult: 'Pass', GlandingToResult: 'Pass',
        GlandingFromName: 'Nguyen Van A', GlandingFromCode: 'EMP-001', GlandingFromNationalId: '001234567890', GlandingFromError: '',
        GlandingToName: 'Tran Thi B', GlandingToCode: 'EMP-002', GlandingToNationalId: '001234567891', GlandingToError: '',
    },
    {
        RowIndex: 2, TypeOfWork: 'Glanding', CableName: 'Cable-002',
        GlandingFromResult: 'Fail', GlandingToResult: 'Pass',
        GlandingFromName: 'Le Van C', GlandingFromCode: 'EMP-003', GlandingFromNationalId: '001234567892', GlandingFromError: 'Insulation damage',
        GlandingToName: 'Pham Thi D', GlandingToCode: 'EMP-004', GlandingToNationalId: '001234567893', GlandingToError: '',
    },
    {
        RowIndex: 3, TypeOfWork: 'Termination', CableName: 'Cable-003',
        TerminationFromResult: 'Pass', TerminationToResult: 'Pass',
        TerminationFromName: 'Hoang Van E', TerminationFromCode: 'EMP-005', TerminationFromNationalId: '001234567894', TerminationFromError: '',
        TerminationToName: 'Vu Thi F', TerminationToCode: 'EMP-006', TerminationToNationalId: '001234567895', TerminationToError: '',
    },
    {
        RowIndex: 4, TypeOfWork: 'Termination', CableName: 'Cable-004',
        TerminationFromResult: 'Pass', TerminationToResult: 'Fail',
        TerminationFromName: 'Dang Van G', TerminationFromCode: 'EMP-007', TerminationFromNationalId: '001234567896', TerminationFromError: '',
        TerminationToName: 'Bui Thi H', TerminationToCode: 'EMP-008', TerminationToNationalId: '001234567897', TerminationToError: 'Wrong connection',
    },
    {
        RowIndex: 5, TypeOfWork: 'Cable', CableName: 'Cable-005',
        CableResult: 'Pass',
        CableEmployeeName: 'Do Van I', CableEmployeeCode: 'EMP-009', CableEmployeeNationalId: '001234567898', CableError: '',
    },
    {
        RowIndex: 6, TypeOfWork: 'Cable', CableName: 'Cable-006',
        CableResult: 'Fail',
        CableEmployeeName: 'Ngo Thi J', CableEmployeeCode: 'EMP-010', CableEmployeeNationalId: '001234567899', CableError: 'Short circuit',
    },
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

    //-- Type of Work (multi-select)
    const TYPE_OF_WORK_OPTIONS = ['Glanding', 'Termination', 'Cable'];
    const [isVisibleTypeOfWork, setIsVisibleTypeOfWork] = useState(false);
    const [typeOfWorkSelected, setTypeOfWorkSelected] = useState([]);
    const typeOfWorkDisplayText = typeOfWorkSelected.length === 0 ? 'All' : typeOfWorkSelected.join(', ');

    //-- Employee Name
    const [employeeName, setEmployeeName] = useState('');

    //-- Employee Code
    const [employeeCode, setEmployeeCode] = useState('');

    //-- National ID
    const [nationalId, setNationalId] = useState('');

    //-- Results
    const [workerItems, setWorkerItems] = useState(null);

    //-- Search
    const _onPressSearch = () => {
        Keyboard.dismiss();
        // TODO: replace with real API call
        setWorkerItems(MOCK_DATA);
    };

    //-- Add Result
    const [isVisibleAddResult, setIsVisibleAddResult] = useState(false);
    const ADD_RESULT_TYPES = ['Glanding', 'Termination', 'Cable'];
    const _onPressAddResult = () => {
        setIsVisibleAddResult(true);
    };
    const _onSelectAddResultType = type => {
        setIsVisibleAddResult(false);
        navigation.navigate('QualifyElectricalWorkersAdd', { projectCode, type });
    };

    //-- Render helpers
    const DataRow = ({ label, value }) => (
        <View style={styles.rowData}>
            <Text style={styles.cellLabel}>{label}:</Text>
            <Text style={styles.cellValue}>{value || '-'}</Text>
        </View>
    );

    const SubSectionHeader = ({ title }) => (
        <View style={styles.subSectionHeader}>
            <Text style={styles.subSectionTitle}>{title}</Text>
        </View>
    );

    const TypeGroupHeader = ({ title }) => (
        <View style={styles.typeGroupHeader}>
            <Text style={styles.typeGroupTitle}>{title}</Text>
        </View>
    );

    const renderGlandingItem = item => (
        <View key={item.RowIndex} style={styles.box}>
            <DataRow label='Cable Name' value={item.CableName} />
            <SubSectionHeader title='Results' />
            <DataRow label='Glanding From Result' value={item.GlandingFromResult} />
            <DataRow label='Glanding To Result' value={item.GlandingToResult} />
            <SubSectionHeader title='Glanding From' />
            <DataRow label='Employee Name' value={item.GlandingFromName} />
            <DataRow label='Employee Code' value={item.GlandingFromCode} />
            <DataRow label='Employee National ID' value={item.GlandingFromNationalId} />
            <DataRow label='Error' value={item.GlandingFromError} />
            <SubSectionHeader title='Glanding To' />
            <DataRow label='Employee Name' value={item.GlandingToName} />
            <DataRow label='Employee Code' value={item.GlandingToCode} />
            <DataRow label='Employee National ID' value={item.GlandingToNationalId} />
            <DataRow label='Error' value={item.GlandingToError} />
        </View>
    );

    const renderTerminationItem = item => (
        <View key={item.RowIndex} style={styles.box}>
            <DataRow label='Cable Name' value={item.CableName} />
            <SubSectionHeader title='Results' />
            <DataRow label='Termination From Result' value={item.TerminationFromResult} />
            <DataRow label='Termination To Result' value={item.TerminationToResult} />
            <SubSectionHeader title='Termination From' />
            <DataRow label='Employee Name' value={item.TerminationFromName} />
            <DataRow label='Employee Code' value={item.TerminationFromCode} />
            <DataRow label='Employee National ID' value={item.TerminationFromNationalId} />
            <DataRow label='Error' value={item.TerminationFromError} />
            <SubSectionHeader title='Termination To' />
            <DataRow label='Employee Name' value={item.TerminationToName} />
            <DataRow label='Employee Code' value={item.TerminationToCode} />
            <DataRow label='Employee National ID' value={item.TerminationToNationalId} />
            <DataRow label='Error' value={item.TerminationToError} />
        </View>
    );

    const renderCableItem = item => (
        <View key={item.RowIndex} style={styles.box}>
            <DataRow label='Cable Name' value={item.CableName} />
            <SubSectionHeader title='Results' />
            <DataRow label='Cable Result' value={item.CableResult} />
            <SubSectionHeader title='Cable' />
            <DataRow label='Employee Name' value={item.CableEmployeeName} />
            <DataRow label='Employee Code' value={item.CableEmployeeCode} />
            <DataRow label='Employee National ID' value={item.CableEmployeeNationalId} />
            <DataRow label='Error' value={item.CableError} />
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {isShowFilter && (
                    <View style={styles.headerContainer}>
                        {/* Type of Work */}
                        <View style={styles.rowInfoAction}>
                            <Text style={styles.infoTitleAction}>Type of Work:</Text>
                            <TouchableOpacity style={styles.selectContainer} onPress={() => setIsVisibleTypeOfWork(true)}>
                                <Text style={styles.buttonTitleDark}>{typeOfWorkDisplayText}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Employee Name */}
                        <View style={styles.rowInfoAction}>
                            <Text style={styles.infoTitleAction}>Employee Name:</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.inputText}
                                    value={employeeName}
                                    onChangeText={setEmployeeName}
                                    underlineColorAndroid='transparent'
                                />
                                {employeeName !== '' && (
                                    <Icon name='times-circle' onPress={() => setEmployeeName('')} style={styles.inputIcon} />
                                )}
                            </View>
                        </View>

                        {/* Employee Code */}
                        <View style={styles.rowInfoAction}>
                            <Text style={styles.infoTitleAction}>Employee Code:</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.inputText}
                                    value={employeeCode}
                                    onChangeText={setEmployeeCode}
                                    underlineColorAndroid='transparent'
                                />
                                {employeeCode !== '' && (
                                    <Icon name='times-circle' onPress={() => setEmployeeCode('')} style={styles.inputIcon} />
                                )}
                            </View>
                        </View>

                        {/* National ID */}
                        <View style={styles.rowInfoAction}>
                            <Text style={styles.infoTitleAction}>National ID:</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.inputText}
                                    value={nationalId}
                                    onChangeText={setNationalId}
                                    underlineColorAndroid='transparent'
                                />
                                {nationalId !== '' && (
                                    <Icon name='times-circle' onPress={() => setNationalId('')} style={styles.inputIcon} />
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

                {workerItems ? (() => {
                    const show = type => typeOfWorkSelected.length === 0 || typeOfWorkSelected.includes(type);
                    const glandingItems = show('Glanding') ? workerItems.filter(i => i.TypeOfWork === 'Glanding') : [];
                    const terminationItems = show('Termination') ? workerItems.filter(i => i.TypeOfWork === 'Termination') : [];
                    const cableItems = show('Cable') ? workerItems.filter(i => i.TypeOfWork === 'Cable') : [];
                    const total = glandingItems.length + terminationItems.length + cableItems.length;
                    if (total === 0) return <ListEmptyData />;
                    return (
                        <ScrollView style={styles.table} keyboardShouldPersistTaps='handled'>
                            {glandingItems.length > 0 && (
                                <>
                                    <TypeGroupHeader title='Glanding' />
                                    {glandingItems.map(renderGlandingItem)}
                                </>
                            )}
                            {terminationItems.length > 0 && (
                                <>
                                    <TypeGroupHeader title='Termination' />
                                    {terminationItems.map(renderTerminationItem)}
                                </>
                            )}
                            {cableItems.length > 0 && (
                                <>
                                    <TypeGroupHeader title='Cable' />
                                    {cableItems.map(renderCableItem)}
                                </>
                            )}
                            <View style={{ height: 16 }} />
                        </ScrollView>
                    );
                })() : <ListEmptyData />}
            </View>

            <MultiSelectPopup
                visible={isVisibleTypeOfWork}
                title='Type of Work'
                options={TYPE_OF_WORK_OPTIONS}
                selected={typeOfWorkSelected}
                onConfirm={values => { setTypeOfWorkSelected(values); setIsVisibleTypeOfWork(false); }}
                onCancel={() => setIsVisibleTypeOfWork(false)}
            />
            <SelectPopup
                visible={isVisibleAddResult}
                data={ADD_RESULT_TYPES}
                onCancel={() => setIsVisibleAddResult(false)}
                onChangeItem={_onSelectAddResultType}
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
    typeGroupHeader: {
        backgroundColor: BASE_COLOR,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginTop: 8,
    },
    typeGroupTitle: {
        color: OPP_COLOR,
        fontWeight: 'bold',
        fontSize: 14,
    },
    subSectionHeader: {
        backgroundColor: '#e0e0e0',
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginTop: 6,
        marginBottom: 2,
        borderRadius: 4,
    },
    subSectionTitle: {
        color: BASE_COLOR,
        fontWeight: 'bold',
        fontSize: 12,
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
