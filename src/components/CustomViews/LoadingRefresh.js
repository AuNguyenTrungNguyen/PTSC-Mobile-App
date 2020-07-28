import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const BASE_COLOR = '#344955';

const LoadingRefresh = ({isLoading, isRefresh, _onPressRefresh}) => {
    return (
        isLoading
            ? <View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
                {isRefresh
                    ? <TouchableOpacity style={{ alignItems: 'center' }} activeOpacity={1} onPress={_onPressRefresh}>
                        <Icon name='refresh-circle-outline' size={48} color={BASE_COLOR} />
                        <Text style={{ fontSize: 16, marginTop: 16 }}>Press to refresh</Text>
                    </TouchableOpacity>
                    : <ActivityIndicator size='large' color={BASE_COLOR} />
                }
            </View>
            : null
    );
};

module.exports = LoadingRefresh;