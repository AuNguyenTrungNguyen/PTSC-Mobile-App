import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput, ScrollView, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import SelectPopup from '../../../components/SelectPopup';

const QualifyElectricalWorkersAddScreen = ({ route, navigation }) => {

    const { projectCode } = route.params;

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

    //-- Evaluation
    const [evaluation, setEvaluation] = useState('');

    //-- Result
    const RESULT_DEFAULT = 'Select Result';
    const [isVisibleResult, setIsVisibleResult] = useState(false);
    const [resultList] = useState(['Pass', 'Fail']);
    const [result, setResult] = useState(RESULT_DEFAULT);
    const _onChangeResult = value => {
        setResult(value);
        setIsVisibleResult(false);
    };
    const _onClearResult = () => {
        setResult(RESULT_DEFAULT);
        setIsVisibleResult(false);
    };

    //-- Number ID
    const [numberID, setNumberID] = useState('');

    //-- Date of Birth
    const [isVisibleDOB, setIsVisibleDOB] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const _onPressSelectDOB = () => {
        setIsVisibleDOB(true);
    };
    const _onChangeDOB = selectedDate => {
        if (selectedDate) {
            setDateOfBirth(selectedDate);
        }
        setIsVisibleDOB(false);
    };
    const _onCloseDOB = () => {
        setIsVisibleDOB(false);
    };

    //-- Remark
    const [remark, setRemark] = useState('');

    //-- Save notification
    const [saveMessage, setSaveMessage] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(null);

    //-- Save
    const _onPressSave = () => {
        Keyboard.dismiss();
        // TODO: call save API
        // Mock success for now
        setSaveSuccess(true);
        setSaveMessage('Worker information saved successfully!');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>

                {/* Contractor Name */}
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Contractor Name:</Text>
                    <TouchableOpacity style={styles.selectContainer} onPress={() => setIsVisibleContractor(true)}>
                        <Text style={styles.selectText}>{contractorName}</Text>
                    </TouchableOpacity>
                </View>

                {/* Type of Work */}
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Type of Work:</Text>
                    <TouchableOpacity style={styles.selectContainer} onPress={() => setIsVisibleTypeOfWork(true)}>
                        <Text style={styles.selectText}>{typeOfWork}</Text>
                    </TouchableOpacity>
                </View>

                {/* Name */}
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Name:</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.inputText}
                            value={name}
                            onChangeText={setName}
                            underlineColorAndroid='transparent'
                            placeholder='Enter name'
                            placeholderTextColor='#aaa'
                        />
                        {name !== '' && (
                            <Icon name='times-circle' onPress={() => setName('')} style={styles.inputIcon} />
                        )}
                    </View>
                </View>

                {/* Evaluation */}
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Evaluation:</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.inputText}
                            value={evaluation}
                            onChangeText={setEvaluation}
                            underlineColorAndroid='transparent'
                            placeholder='Enter evaluation'
                            placeholderTextColor='#aaa'
                        />
                        {evaluation !== '' && (
                            <Icon name='times-circle' onPress={() => setEvaluation('')} style={styles.inputIcon} />
                        )}
                    </View>
                </View>

                {/* Result */}
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Result:</Text>
                    <TouchableOpacity style={styles.selectContainer} onPress={() => setIsVisibleResult(true)}>
                        <Text style={[styles.selectText, result === 'Pass' && { color: '#2e7d32' }, result === 'Fail' && { color: '#c62828' }]}>
                            {result}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Number ID */}
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Number ID:</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.inputText}
                            value={numberID}
                            onChangeText={setNumberID}
                            underlineColorAndroid='transparent'
                            placeholder='Enter number ID'
                            placeholderTextColor='#aaa'
                        />
                        {numberID !== '' && (
                            <Icon name='times-circle' onPress={() => setNumberID('')} style={styles.inputIcon} />
                        )}
                    </View>
                </View>

                {/* Date of Birth */}
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Date of Birth:</Text>
                    <TouchableOpacity style={styles.selectContainer} onPress={_onPressSelectDOB}>
                        <Text style={styles.selectText}>
                            {dateOfBirth ? Moment(dateOfBirth).format('DD/MM/YYYY') : 'Select date'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Remark */}
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Remark:</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.inputText}
                            value={remark}
                            onChangeText={setRemark}
                            underlineColorAndroid='transparent'
                            placeholder='Enter remark'
                            placeholderTextColor='#aaa'
                        />
                        {remark !== '' && (
                            <Icon name='times-circle' onPress={() => setRemark('')} style={styles.inputIcon} />
                        )}
                    </View>
                </View>

                {/* Notification area */}
                {saveMessage !== '' && (
                    <View style={[styles.messageBox, saveSuccess ? styles.messageSuccess : styles.messageError]}>
                        <Text style={styles.messageText}>{saveMessage}</Text>
                    </View>
                )}

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={_onPressSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>

            </ScrollView>

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
            <SelectPopup
                visible={isVisibleResult}
                data={resultList}
                onCancel={() => setIsVisibleResult(false)}
                onClear={_onClearResult}
                onChangeItem={_onChangeResult}
            />
            <DateTimePickerModal
                isVisible={isVisibleDOB}
                date={dateOfBirth ? new Date(Moment(dateOfBirth).format('YYYY-MM-DDT00:00:00')) : new Date()}
                mode='date'
                onConfirm={_onChangeDOB}
                onCancel={_onCloseDOB}
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
        padding: 12,
        backgroundColor: OPP_COLOR,
    },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    fieldLabel: {
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
        paddingVertical: 8,
    },
    selectText: {
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
        paddingVertical: 6,
    },
    inputIcon: {
        color: BASE_COLOR,
        fontSize: 16,
        paddingLeft: 4,
    },
    messageBox: {
        borderRadius: 4,
        padding: 10,
        marginBottom: 12,
    },
    messageSuccess: {
        backgroundColor: '#e8f5e9',
        borderColor: '#2e7d32',
        borderWidth: 1,
    },
    messageError: {
        backgroundColor: '#ffebee',
        borderColor: '#c62828',
        borderWidth: 1,
    },
    messageText: {
        fontSize: 13,
        textAlign: 'center',
    },
    saveButton: {
        backgroundColor: BASE_COLOR,
        borderRadius: 4,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 24,
    },
    saveButtonText: {
        color: OPP_COLOR,
        fontWeight: 'bold',
        fontSize: 15,
    },
});

export default QualifyElectricalWorkersAddScreen;
