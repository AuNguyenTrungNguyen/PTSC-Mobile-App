import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput, ScrollView, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const QualifyElectricalWorkersAddScreen = ({ route, navigation }) => {

    const { projectCode, type } = route.params;

    //-- Glanding Results
    const [glandingFromResult, setGlandingFromResult] = useState('');
    const [glandingToResult, setGlandingToResult] = useState('');

    //-- Termination Results
    const [terminationFromResult, setTerminationFromResult] = useState('');
    const [terminationToResult, setTerminationToResult] = useState('');

    //-- Glanding From
    const [glandingFromEmployeeName, setGlandingFromEmployeeName] = useState('');
    const [glandingFromEmployeeCode, setGlandingFromEmployeeCode] = useState('');
    const [glandingFromEmployeeNationalId, setGlandingFromEmployeeNationalId] = useState('');
    const [glandingFromError, setGlandingFromError] = useState('');

    //-- Glanding To
    const [glandingToEmployeeName, setGlandingToEmployeeName] = useState('');
    const [glandingToEmployeeCode, setGlandingToEmployeeCode] = useState('');
    const [glandingToEmployeeNationalId, setGlandingToEmployeeNationalId] = useState('');
    const [glandingToError, setGlandingToError] = useState('');

    //-- Termination From
    const [terminationFromEmployeeName, setTerminationFromEmployeeName] = useState('');
    const [terminationFromEmployeeCode, setTerminationFromEmployeeCode] = useState('');
    const [terminationFromEmployeeNationalId, setTerminationFromEmployeeNationalId] = useState('');
    const [terminationFromError, setTerminationFromError] = useState('');

    //-- Termination To
    const [terminationToEmployeeName, setTerminationToEmployeeName] = useState('');
    const [terminationToEmployeeCode, setTerminationToEmployeeCode] = useState('');
    const [terminationToEmployeeNationalId, setTerminationToEmployeeNationalId] = useState('');
    const [terminationToError, setTerminationToError] = useState('');

    //-- Cable Name (common)
    const [cableName, setCableName] = useState('');

    //-- Cable
    const [cableResult, setCableResult] = useState('');
    const [cableEmployeeName, setCableEmployeeName] = useState('');
    const [cableEmployeeCode, setCableEmployeeCode] = useState('');
    const [cableEmployeeNationalId, setCableEmployeeNationalId] = useState('');
    const [cableError, setCableError] = useState('');

    //-- Save notification
    const [saveMessage, setSaveMessage] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(null);

    //-- Save
    const _onPressSave = () => {
        Keyboard.dismiss();
        // TODO: call save API
        setSaveSuccess(true);
        setSaveMessage('Worker information saved successfully!');
    };

    const FieldInput = ({ label, value, onChange }) => (
        <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>{label}:</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.inputText}
                    value={value}
                    onChangeText={onChange}
                    underlineColorAndroid='transparent'
                    placeholderTextColor='#aaa'
                />
                {value !== '' && (
                    <Icon name='times-circle' onPress={() => onChange('')} style={styles.inputIcon} />
                )}
            </View>
        </View>
    );

    const SectionHeader = ({ title }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>

                {/* Cable Name */}
                <FieldInput label='Cable Name' value={cableName} onChange={setCableName} />

                {/* Results */}
                <SectionHeader title='Results' />
                {type === 'Glanding' && <FieldInput label='Glanding From Result' value={glandingFromResult} onChange={setGlandingFromResult} />}
                {type === 'Glanding' && <FieldInput label='Glanding To Result' value={glandingToResult} onChange={setGlandingToResult} />}
                {type === 'Termination' && <FieldInput label='Termination From Result' value={terminationFromResult} onChange={setTerminationFromResult} />}
                {type === 'Termination' && <FieldInput label='Termination To Result' value={terminationToResult} onChange={setTerminationToResult} />}
                {type === 'Cable' && <FieldInput label='Cable Result' value={cableResult} onChange={setCableResult} />}

                {/* Glanding From */}
                {type === 'Glanding' && (
                    <>
                        <SectionHeader title='Glanding From' />
                        <FieldInput label='Employee Name' value={glandingFromEmployeeName} onChange={setGlandingFromEmployeeName} />
                        <FieldInput label='Employee Code' value={glandingFromEmployeeCode} onChange={setGlandingFromEmployeeCode} />
                        <FieldInput label='Employee National ID' value={glandingFromEmployeeNationalId} onChange={setGlandingFromEmployeeNationalId} />
                        <FieldInput label='Error' value={glandingFromError} onChange={setGlandingFromError} />
                    </>
                )}

                {/* Glanding To */}
                {type === 'Glanding' && (
                    <>
                        <SectionHeader title='Glanding To' />
                        <FieldInput label='Employee Name' value={glandingToEmployeeName} onChange={setGlandingToEmployeeName} />
                        <FieldInput label='Employee Code' value={glandingToEmployeeCode} onChange={setGlandingToEmployeeCode} />
                        <FieldInput label='Employee National ID' value={glandingToEmployeeNationalId} onChange={setGlandingToEmployeeNationalId} />
                        <FieldInput label='Error' value={glandingToError} onChange={setGlandingToError} />
                    </>
                )}

                {/* Termination From */}
                {type === 'Termination' && (
                    <>
                        <SectionHeader title='Termination From' />
                        <FieldInput label='Employee Name' value={terminationFromEmployeeName} onChange={setTerminationFromEmployeeName} />
                        <FieldInput label='Employee Code' value={terminationFromEmployeeCode} onChange={setTerminationFromEmployeeCode} />
                        <FieldInput label='Employee National ID' value={terminationFromEmployeeNationalId} onChange={setTerminationFromEmployeeNationalId} />
                        <FieldInput label='Error' value={terminationFromError} onChange={setTerminationFromError} />
                    </>
                )}

                {/* Termination To */}
                {type === 'Termination' && (
                    <>
                        <SectionHeader title='Termination To' />
                        <FieldInput label='Employee Name' value={terminationToEmployeeName} onChange={setTerminationToEmployeeName} />
                        <FieldInput label='Employee Code' value={terminationToEmployeeCode} onChange={setTerminationToEmployeeCode} />
                        <FieldInput label='Employee National ID' value={terminationToEmployeeNationalId} onChange={setTerminationToEmployeeNationalId} />
                        <FieldInput label='Error' value={terminationToError} onChange={setTerminationToError} />
                    </>
                )}

                {/* Cable */}
                {type === 'Cable' && (
                    <>
                        <SectionHeader title='Cable' />
                        <FieldInput label='Employee Name' value={cableEmployeeName} onChange={setCableEmployeeName} />
                        <FieldInput label='Employee Code' value={cableEmployeeCode} onChange={setCableEmployeeCode} />
                        <FieldInput label='Employee National ID' value={cableEmployeeNationalId} onChange={setCableEmployeeNationalId} />
                        <FieldInput label='Error' value={cableError} onChange={setCableError} />
                    </>
                )}

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
    sectionHeader: {
        backgroundColor: BASE_COLOR,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 4,
        marginBottom: 10,
        marginTop: 4,
    },
    sectionTitle: {
        color: OPP_COLOR,
        fontWeight: 'bold',
        fontSize: 13,
    },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    fieldLabel: {
        width: 140,
        color: BASE_COLOR,
        fontWeight: 'bold',
        fontSize: 12,
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
        marginTop: 8,
    },
    saveButtonText: {
        color: OPP_COLOR,
        fontWeight: 'bold',
        fontSize: 15,
    },
});

export default QualifyElectricalWorkersAddScreen;
