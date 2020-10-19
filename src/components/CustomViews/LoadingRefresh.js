import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const BASE_COLOR = '#344955';

const LoadingRefresh = ({ isLoading, isError, _onPressRefresh }) => {
    return (
        isLoading
            ?
            <View style={{ width: '100%', height: '100%', justifyContent: 'center', backgroundColor: 'white' }}>
                <ActivityIndicator size='large' color={BASE_COLOR} />
            </View>
            : isError
                ?
                <View style={{ width: '100%', height: '100%', justifyContent: 'center', backgroundColor: 'white' }}>
                    <TouchableOpacity style={{ alignItems: 'center' }} activeOpacity={1} onPress={_onPressRefresh}>
                        <Text style={{ fontSize: 16, marginBottom: 16, color: BASE_COLOR }}>An error occured while executing your request.</Text>
                        <Icon name='sync-circle-outline' size={48} color={BASE_COLOR} />
                        <Text style={{ fontSize: 16, marginTop: 16, color: BASE_COLOR }}>Press to refresh!</Text>
                    </TouchableOpacity>
                </View>
                :
                null
    );
};

module.exports = LoadingRefresh;