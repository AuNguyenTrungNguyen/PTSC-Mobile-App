import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput, Keyboard, Appearance, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import SelectPopup from '../../../components/SelectPopup';
import { ListEmptyData } from '../../../components/HelperUI';
import { GetFacilityListAPI } from '../../../apis/app/AppAPI';
import { SearchCableControlAPI } from '../../../apis/eit/EITAPI';
import Helper from '../../../utils/Helper';

const MOCK_DATA = [
    {
        Id: 1, CableName: 'Cable-001',
        GlandingFrom_Result: 'Pass', GlandingTo_Result: 'Pass',
        GlandingFrom_EmployeeName: 'Nguyen Van A', GlandingFrom_EmployeeCode: 'EMP-001', GlandingFrom_EmployeeNationId: '001234567890', GlandingFrom_Error: null,
        GlandingTo_EmployeeName: 'Tran Thi B', GlandingTo_EmployeeCode: 'EMP-002', GlandingTo_EmployeeNationId: '001234567891', GlandingTo_Error: null,
        TerminationFrom_Result: 'Pass', TerminationTo_Result: 'Pass',
        TerminationFrom_EmployeeName: 'Hoang Van E', TerminationFrom_EmployeeCode: 'EMP-005', TerminationFrom_EmployeeNationId: '001234567894', TerminationFrom_Error: null,
        TerminationTo_EmployeeName: 'Vu Thi F', TerminationTo_EmployeeCode: 'EMP-006', TerminationTo_EmployeeNationId: '001234567895', TerminationTo_Error: null,
        Cable_Result: 'Pass', Cable_EmployeeName: 'Do Van I', Cable_EmployeeCode: 'EMP-009', Cable_EmployeeNationId: '001234567898', Cable_Error: null,
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

    //-- Facility Code
    const FACILITY_CODE_DEFAULT = 'All Facility Code';
    const [isVisibleFacility, setIsVisibleFacility] = useState(false);
    const [facilityList, setFacilityList] = useState([]);
    const [facilityCode, setFacilityCode] = useState(FACILITY_CODE_DEFAULT);
    useEffect(() => {
        const loadFacilityList = async () => {
            try {
                const token = await Helper.getData('TOKEN');
                const res = await GetFacilityListAPI(projectCode, token);
                if (res.success) setFacilityList(res.data);
            } catch (_) { }
        };
        loadFacilityList();
    }, []);
    const _onChangeFacilityCode = code => {
        setFacilityCode(code);
        setIsVisibleFacility(false);
    };
    const _onClearFacilityCode = () => {
        setFacilityCode(FACILITY_CODE_DEFAULT);
        setIsVisibleFacility(false);
    };

    //-- Cable Type
    const CABLE_TYPE_DEFAULT = 'Electrical';
    const CABLE_TYPE_LIST = ['Electrical', 'Instrument'];
    const [isVisibleCableType, setIsVisibleCableType] = useState(false);
    const [cableType, setCableType] = useState(CABLE_TYPE_DEFAULT);
    const _onChangeCableType = value => {
        setCableType(value);
        setIsVisibleCableType(false);
    };
    const _onClearCableType = () => {
        setCableType(CABLE_TYPE_DEFAULT);
        setIsVisibleCableType(false);
    };

    //-- Type of Work
    const TYPE_OF_WORK_LIST = ['Glanding', 'Termination', 'Cable'];
    const TYPE_OF_WORK_DEFAULT = 'Glanding';
    const [isVisibleTypeOfWork, setIsVisibleTypeOfWork] = useState(false);
    const [typeOfWorkSelected, setTypeOfWorkSelected] = useState(TYPE_OF_WORK_DEFAULT);
    const _onChangeTypeOfWork = value => {
        setTypeOfWorkSelected(value);
        setIsVisibleTypeOfWork(false);
    };
    const _onClearTypeOfWork = () => {
        setTypeOfWorkSelected(TYPE_OF_WORK_DEFAULT);
        setIsVisibleTypeOfWork(false);
    };

    //-- Employee Name
    const [employeeName, setEmployeeName] = useState('');

    //-- Employee Code
    const [employeeCode, setEmployeeCode] = useState('');

    //-- National ID
    const [nationalId, setNationalId] = useState('');

    //-- Results
    const [workerItems, setWorkerItems] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const PAGE_SIZE = 20;

    const _buildSearchParams = () => ({
        fc: (facilityCode && facilityCode !== FACILITY_CODE_DEFAULT) ? facilityCode : '',
        ct: cableType === 'Electrical' ? 'ElectricalCable' : cableType === 'Instrument' ? 'InstrumentCable' : '',
        type: typeOfWorkSelected,
    });

    //-- Search (page 1)
    const _onPressSearch = async () => {
        Keyboard.dismiss();
        setIsSearching(true);
        try {
            const { fc, ct, type } = _buildSearchParams();
            const res = await SearchCableControlAPI(projectCode, fc, ct, type, employeeName, employeeCode, nationalId, 1, PAGE_SIZE);
            if (res.Success && res.Data) {
                setWorkerItems(res.Data.Items || []);
                setCurrentPage(res.Data.Page || 1);
                setTotalPages(res.Data.TotalPages || 1);
                setTotalCount(res.Data.TotalCount || 0);
            } else {
                setWorkerItems([]);
                setCurrentPage(1);
                setTotalPages(1);
                setTotalCount(0);
            }
        } catch (_) {
            setWorkerItems([]);
        } finally {
            setIsSearching(false);
        }
    };

    //-- Change page
    const _onChangePage = async (newPage) => {
        if (newPage < 1 || newPage > totalPages || isSearching) return;
        setIsSearching(true);
        try {
            const { fc, ct, type } = _buildSearchParams();
            const res = await SearchCableControlAPI(projectCode, fc, ct, type, employeeName, employeeCode, nationalId, newPage, PAGE_SIZE);
            if (res.Success && res.Data) {
                setWorkerItems(res.Data.Items || []);
                setCurrentPage(res.Data.Page || newPage);
                setTotalPages(res.Data.TotalPages || totalPages);
                setTotalCount(res.Data.TotalCount || totalCount);
            }
        } catch (_) { }
        finally { setIsSearching(false); }
    };

    //-- Add Result
    const CABLE_TYPES = ['Electric Cable', 'Instrument Cable'];
    const ADD_RESULT_TYPES = ['Glanding', 'Termination', 'Cable'];
    const [isVisibleAddCableType, setIsVisibleAddCableType] = useState(false);
    const [isVisibleAddResult, setIsVisibleAddResult] = useState(false);
    const [selectedCableType, setSelectedCableType] = useState('');
    const _onPressAddResult = () => {
        setIsVisibleAddCableType(true);
    };
    const _onSelectCableType = cableType => {
        setSelectedCableType(cableType);
        setIsVisibleAddCableType(false);
        setIsVisibleAddResult(true);
    };
    const _onSelectAddResultType = type => {
        setIsVisibleAddResult(false);
        navigation.navigate('QualifyElectricalWorkersAdd', { projectCode, cableType: selectedCableType, type });
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

    const show = type => typeOfWorkSelected === type;

    const renderItem = (item, index) => {
        const glandingFrom = item.Glanding ? item.Glanding.find(g => g.Type === 'From') : null;
        const glandingTo = item.Glanding ? item.Glanding.find(g => g.Type === 'To') : null;
        const terminationFrom = item.Termination ? item.Termination.find(t => t.Type === 'From') : null;
        const terminationTo = item.Termination ? item.Termination.find(t => t.Type === 'To') : null;
        const cable = item.Cable ? (Array.isArray(item.Cable) ? item.Cable[0] : item.Cable) : null;
        return (
            <View key={item.Id || index} style={styles.box}>
                <DataRow label='Cable Name' value={item.CableName} />
                {show('Glanding') && item.Glanding && (
                    <>
                        <TypeGroupHeader title='Glanding' />
                        <SubSectionHeader title='Glanding From' />
                        <DataRow label='Result' value={glandingFrom ? glandingFrom.Result : null} />
                        <DataRow label='Employee Name' value={glandingFrom ? glandingFrom.EmployeeName : null} />
                        <DataRow label='Employee Code' value={glandingFrom ? glandingFrom.EmployeeCode : null} />
                        <DataRow label='Employee National ID' value={glandingFrom ? glandingFrom.EmployeeNationId : null} />
                        <DataRow label='Error' value={glandingFrom ? glandingFrom.Error : null} />
                        <SubSectionHeader title='Glanding To' />
                        <DataRow label='Result' value={glandingTo ? glandingTo.Result : null} />
                        <DataRow label='Employee Name' value={glandingTo ? glandingTo.EmployeeName : null} />
                        <DataRow label='Employee Code' value={glandingTo ? glandingTo.EmployeeCode : null} />
                        <DataRow label='Employee National ID' value={glandingTo ? glandingTo.EmployeeNationId : null} />
                        <DataRow label='Error' value={glandingTo ? glandingTo.Error : null} />
                    </>
                )}
                {show('Termination') && item.Termination && (
                    <>
                        <TypeGroupHeader title='Termination' />
                        <SubSectionHeader title='Termination From' />
                        <DataRow label='Result' value={terminationFrom ? terminationFrom.Result : null} />
                        <DataRow label='Employee Name' value={terminationFrom ? terminationFrom.EmployeeName : null} />
                        <DataRow label='Employee Code' value={terminationFrom ? terminationFrom.EmployeeCode : null} />
                        <DataRow label='Employee National ID' value={terminationFrom ? terminationFrom.EmployeeNationId : null} />
                        <DataRow label='Error' value={terminationFrom ? terminationFrom.Error : null} />
                        <SubSectionHeader title='Termination To' />
                        <DataRow label='Result' value={terminationTo ? terminationTo.Result : null} />
                        <DataRow label='Employee Name' value={terminationTo ? terminationTo.EmployeeName : null} />
                        <DataRow label='Employee Code' value={terminationTo ? terminationTo.EmployeeCode : null} />
                        <DataRow label='Employee National ID' value={terminationTo ? terminationTo.EmployeeNationId : null} />
                        <DataRow label='Error' value={terminationTo ? terminationTo.Error : null} />
                    </>
                )}
                {show('Cable') && item.Cable && (
                    <>
                        <TypeGroupHeader title='Cable' />
                        <DataRow label='Result' value={cable ? cable.Result : null} />
                        <DataRow label='Employee Name' value={cable ? cable.EmployeeName : null} />
                        <DataRow label='Employee Code' value={cable ? cable.EmployeeCode : null} />
                        <DataRow label='Employee National ID' value={cable ? cable.EmployeeNationId : null} />
                        <DataRow label='Error' value={cable ? cable.Error : null} />
                    </>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {isShowFilter && (
                    <View style={styles.headerContainer}>
                        {/* Facility Code */}
                        <View style={styles.rowInfoAction}>
                            <Text style={styles.infoTitleAction}>Facility Code:</Text>
                            <TouchableOpacity style={styles.selectContainer} onPress={() => setIsVisibleFacility(true)}>
                                <Text style={styles.buttonTitleDark}>{facilityCode}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Cable Type */}
                        <View style={styles.rowInfoAction}>
                            <Text style={styles.infoTitleAction}>Cable Type:</Text>
                            <TouchableOpacity style={styles.selectContainer} onPress={() => setIsVisibleCableType(true)}>
                                <Text style={styles.buttonTitleDark}>{cableType}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Type of Work */}
                        <View style={styles.rowInfoAction}>
                            <Text style={styles.infoTitleAction}>Type of Work:</Text>
                            <TouchableOpacity style={styles.selectContainer} onPress={() => setIsVisibleTypeOfWork(true)}>
                                <Text style={styles.buttonTitleDark}>{typeOfWorkSelected}</Text>
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
                            <TouchableOpacity style={styles.searchButton} onPress={_onPressSearch} disabled={isSearching}>
                                <Text style={styles.buttonTitle}>{isSearching ? 'Searching...' : 'Search'}</Text>
                            </TouchableOpacity>
                            <View style={{ width: 8 }} />
                            <TouchableOpacity style={styles.addButton} onPress={_onPressAddResult}>
                                <Text style={styles.buttonTitle}>Add Result</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {workerItems ? (
                    workerItems.length === 0
                        ? <ListEmptyData />
                        : (
                            <ScrollView style={styles.table} keyboardShouldPersistTaps='handled'>
                                {/* Pagination info */}
                                <View style={styles.paginationBar}>
                                    <TouchableOpacity
                                        style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
                                        onPress={() => _onChangePage(currentPage - 1)}
                                        disabled={currentPage === 1 || isSearching}>
                                        <Text style={styles.pageBtnText}>{'<'}</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.pageInfo}>
                                        {currentPage} / {totalPages}{'  '}({totalCount} records)
                                    </Text>
                                    <TouchableOpacity
                                        style={[styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled]}
                                        onPress={() => _onChangePage(currentPage + 1)}
                                        disabled={currentPage === totalPages || isSearching}>
                                        <Text style={styles.pageBtnText}>{'>'}</Text>
                                    </TouchableOpacity>
                                </View>
                                {workerItems.map(renderItem)}
                                <View style={{ height: 16 }} />
                            </ScrollView>
                        )
                ) : <ListEmptyData />}
            </View>

            <SelectPopup
                visible={isVisibleFacility}
                data={facilityList}
                onCancel={() => setIsVisibleFacility(false)}
                onClear={_onClearFacilityCode}
                onChangeItem={_onChangeFacilityCode}
            />
            <SelectPopup
                visible={isVisibleCableType}
                data={CABLE_TYPE_LIST}
                onCancel={() => setIsVisibleCableType(false)}
                onClear={_onClearCableType}
                onChangeItem={_onChangeCableType}
            />
            <SelectPopup
                visible={isVisibleTypeOfWork}
                data={TYPE_OF_WORK_LIST}
                onCancel={() => setIsVisibleTypeOfWork(false)}
                onClear={_onClearTypeOfWork}
                onChangeItem={_onChangeTypeOfWork}
            />
            <SelectPopup
                visible={isVisibleAddCableType}
                data={CABLE_TYPES}
                onCancel={() => setIsVisibleAddCableType(false)}
                onChangeItem={_onSelectCableType}
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
    paginationBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1,
        backgroundColor: '#f5f5f5',
    },
    pageBtn: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        backgroundColor: BASE_COLOR,
        borderRadius: 4,
    },
    pageBtnDisabled: {
        backgroundColor: '#aaa',
    },
    pageBtnText: {
        color: OPP_COLOR,
        fontWeight: 'bold',
        fontSize: 14,
    },
    pageInfo: {
        color: BASE_COLOR,
        fontSize: 13,
        fontWeight: 'bold',
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
