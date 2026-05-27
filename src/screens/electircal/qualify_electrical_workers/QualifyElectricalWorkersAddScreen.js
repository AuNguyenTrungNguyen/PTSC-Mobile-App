import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput, ScrollView, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const QualifyElectricalWorkersAddScreen = ({ route, navigation }) => {

    const { projectCode } = route.params;

    //-- Name
    const [name, setName] = useState('');

    //-- National ID
    const [nationalID, setNationalID] = useState('');

    //-- Employee Code
    const [employeeCode, setEmployeeCode] = useState('');

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

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>

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

                {/* National ID */}
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>National ID:</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.inputText}
                            value={nationalID}
                            onChangeText={setNationalID}
                            underlineColorAndroid='transparent'
                            placeholder='Enter national ID'
                            placeholderTextColor='#aaa'
                        />
                        {nationalID !== '' && (
                            <Icon name='times-circle' onPress={() => setNationalID('')} style={styles.inputIcon} />
                        )}
                    </View>
                </View>

                {/* Employee Code */}
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Employee Code:</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.inputText}
                            value={employeeCode}
                            onChangeText={setEmployeeCode}
                            underlineColorAndroid='transparent'
                            placeholder='Enter employee code'
                            placeholderTextColor='#aaa'
                        />
                        {employeeCode !== '' && (
                            <Icon name='times-circle' onPress={() => setEmployeeCode('')} style={styles.inputIcon} />
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
