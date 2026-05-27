import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

/**
 * MultiSelectPopup
 *
 * Props:
 *  - visible      : bool       — show/hide the modal
 *  - title        : string     — header title
 *  - options      : string[]   — list of selectable options
 *  - selected     : string[]   — currently selected values (default [])
 *  - onConfirm(selected: string[]) — called with new selection when OK pressed
 *  - onCancel()                — called when Cancel pressed
 */
const MultiSelectPopup = ({ visible, title = '', options = [], selected = [], onConfirm, onCancel }) => {

    const [temp, setTemp] = useState(selected);

    useEffect(() => {
        if (visible) setTemp(selected);
    }, [visible]);

    const _toggle = value => {
        setTemp(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    };

    return (
        <Modal animationType='fade' transparent={true} visible={visible}>
            <View style={styles.dimOverlay}>
                <View style={styles.container}>
                    {!!title && (
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>{title}</Text>
                        </View>
                    )}
                    <ScrollView style={styles.list}>
                        {options.map(item => {
                            const isSelected = temp.includes(item);
                            return (
                                <TouchableOpacity key={item} style={styles.row} onPress={() => _toggle(item)}>
                                    <Icon name={isSelected ? 'check-square' : 'square'} size={18} color={BASE_COLOR} solid={isSelected} style={styles.checkIcon} />
                                    <Text style={styles.rowText}>{item}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.btn} onPress={() => setTemp([])}>
                            <Text style={styles.btnText}>Clear</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.btn, styles.btnOk]} onPress={() => onConfirm && onConfirm(temp)}>
                            <Text style={[styles.btnText, { color: OPP_COLOR }]}>OK</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btn} onPress={onCancel}>
                            <Text style={styles.btnText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const BASE_COLOR = '#344955';
const OPP_COLOR = 'white';

const styles = StyleSheet.create({
    dimOverlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    container: {
        backgroundColor: OPP_COLOR,
        width: '85%',
        borderRadius: 8,
        overflow: 'hidden',
    },
    header: {
        backgroundColor: BASE_COLOR,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    headerTitle: {
        color: OPP_COLOR,
        fontWeight: 'bold',
        fontSize: 14,
    },
    list: {
        maxHeight: 220,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    checkIcon: {
        marginRight: 10,
    },
    rowText: {
        color: BASE_COLOR,
        fontSize: 14,
    },
    actions: {
        flexDirection: 'row',
        borderTopColor: '#eee',
        borderTopWidth: 1,
    },
    btn: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    btnOk: {
        backgroundColor: BASE_COLOR,
    },
    btnText: {
        color: BASE_COLOR,
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default MultiSelectPopup;
