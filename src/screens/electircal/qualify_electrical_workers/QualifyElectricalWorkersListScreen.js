import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput, Keyboard, Appearance, VirtualizedList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import SelectPopup from '../../../components/SelectPopup';
import { ListEmptyData } from '../../../components/HelperUI';

const MOCK_DATA = [
    { RowIndex: 1, ContractorName: 'PTSC M&C', TypeOfWork: 'Glanding And Termination', Name: 'Nguyen Van A', Evaluation: 'Good', Result: 'Pass', NumberID: 'ID-001', Remark: '', Check: true },
    { RowIndex: 2, ContractorName: 'PTSC M&C', TypeOfWork: 'Cable Testing and Check Sheet Completion', Name: 'Tran Thi B', Evaluation: 'Excellent', Result: 'Pass', NumberID: 'ID-002', Remark: '', Check: true },
    { RowIndex: 3, ContractorName: 'SPTS', TypeOfWork: 'Glanding And Termination', Name: 'Le Van C', Evaluation: 'Fair', Result: 'Fail', NumberID: 'ID-003', Remark: 'Re-test', Check: false },
    { RowIndex: 4, ContractorName: 'SPTS', TypeOfWork: 'Glanding And Termination', Name: 'Pham Thi D', Evaluation: 'Good', Result: 'Pass', NumberID: 'ID-004', Remark: '', Check: true },
    { RowIndex: 5, ContractorName: 'PTSC M&C', TypeOfWork: 'Cable Testing and Check Sheet Completion', Name: 'Hoang Van E', Evaluation: 'Good', Result: 'Pass', NumberID: 'ID-005', Remark: '', Check: true },
    { RowIndex: 6, ContractorName: 'VSP', TypeOfWork: 'Glanding And Termination', Name: 'Vu Thi F', Evaluation: 'Poor', Result: 'Fail', NumberID: 'ID-006', Remark: 'Training', Check: false },
    { RowIndex: 7, ContractorName: 'VSP', TypeOfWork: 'Cable Testing and Check Sheet Completion', Name: 'Dang Van G', Evaluation: 'Excellent', Result: 'Pass', NumberID: 'ID-007', Remark: '', Check: true },
    { RowIndex: 8, ContractorName: 'PTSC M&C', TypeOfWork: 'Glanding And Termination', Name: 'Bui Thi H', Evaluation: 'Fair', Result: 'Pass', NumberID: 'ID-008', Remark: '', Check: true },
    { RowIndex: 9, ContractorName: 'SPTS', TypeOfWork: 'Cable Testing and Check Sheet Completion', Name: 'Do Van I', Evaluation: 'Good', Result: 'Pass', NumberID: 'ID-009', Remark: '', Check: true },
    { RowIndex: 10, ContractorName: 'VSP', TypeOfWork: 'Glanding And Termination', Name: 'Ngo Thi J', Evaluation: 'Excellent', Result: 'Pass', NumberID: 'ID-010', Remark: '', Check: true },
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

    //-- Add Worker Information
    const _onPressAddWorker = () => {
        // TODO: navigate to add worker screen
    };

    //-- Render Item
    const renderItem = ({ item }) => (
        <View style={styles.box}>
            <View style={styles.rowData}>
                <Text style={styles.cellLabel}>Contractor Name:</Text>
                <Text style={styles.cellValue}>{item.ContractorName}</Text>
            </View>
            <View style={styles.rowData}>
                <Text style={styles.cellLabel}>Type Of Work:</Text>
                <Text style={styles.cellValue}>{item.TypeOfWork}</Text>
            </View>
            <View style={styles.rowData}>
                <Text style={styles.cellLabel}>Name:</Text>
                <Text style={styles.cellValue}>{item.Name}</Text>
            </View>
            <View style={styles.rowData}>
                <Text style={styles.cellLabel}>Evaluation:</Text>
                <Text style={styles.cellValue}>{item.Evaluation}</Text>
            </View>
            <View style={styles.rowData}>
                <Text style={styles.cellLabel}>Result:</Text>
                <Text style={[styles.cellValue, { color: item.Result === 'Pass' ? '#2e7d32' : '#c62828', fontWeight: 'bold' }]}>{item.Result}</Text>
            </View>
            <View style={styles.rowData}>
                <Text style={styles.cellLabel}>Number ID:</Text>
                <Text style={styles.cellValue}>{item.NumberID}</Text>
            </View>
            <View style={styles.rowData}>
                <Text style={styles.cellLabel}>Remark:</Text>
                <Text style={styles.cellValue}>{item.Remark || '-'}</Text>
            </View>
            <View style={styles.rowData}>
                <Text style={styles.cellLabel}>Check:</Text>
                <Text style={[styles.cellValue, { color: item.Check ? '#2e7d32' : '#c62828' }]}>{item.Check ? 'Yes' : 'No'}</Text>
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
                            <TouchableOpacity style={styles.addButton} onPress={_onPressAddWorker}>
                                <Text style={styles.buttonTitle}>Add Worker Information</Text>
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
