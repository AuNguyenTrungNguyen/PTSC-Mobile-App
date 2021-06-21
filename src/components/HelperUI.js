import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';

const EMPTY_DATA_TITLE = 'No have any data';

export const ListLoadingData = () => (
  <View style={styles.container}>
    <ActivityIndicator size='large' color={BASE_COLOR} />
  </View>
);

export const ListSelectData = props => (
  <View style={styles.container}>
    <Text style={styles.title}>{props.title}</Text>
  </View>
);

export const ListEmptyData = () => (
  <View style={styles.container}>
    <Text style={styles.title}>{EMPTY_DATA_TITLE}</Text>
  </View>
);

const BASE_COLOR = '#344955';
const OPP_COLOR = '#ffffff';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    backgroundColor: OPP_COLOR,
  },
  title: {
    paddingTop: 4,
    fontSize: 16,
  },
});
