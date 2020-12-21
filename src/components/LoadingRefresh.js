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
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', padding: 12 }}>
          <Text style={{ color: BASE_COLOR }}>An error occured while executing your request.</Text>
          <Text style={{ marginTop: 16, color: BASE_COLOR }}>Please check that you are using the company network!</Text>
          <Text style={{ marginTop: 16, color: BASE_COLOR }}>Press to refresh!</Text>
          <TouchableOpacity
            style={{ marginTop: 16 }}
            onPress={_onPressRefresh}>
            <Icon name='sync-circle-outline' size={48} color={BASE_COLOR} />
          </TouchableOpacity>
        </View>
        :
        null
  );
};

module.exports = LoadingRefresh;