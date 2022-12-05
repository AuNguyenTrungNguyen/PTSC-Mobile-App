import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Formater from '../utils/Formater';

const Header = props => {
  let array = [];
  for (let [key, value] of Object.entries(props.data)) {
    if (key === 'DrawingNo') {
      array.push({
        title: key,
        value: value.DrawingNo,
        link: value.Link,
      });
      continue;
    }
    if (key === 'CPName') {
      array.push({
        title: key,
        value: value.CPName,
        link: value.Link,
      });
      continue;
    }
    array.push({
      title: key,
      value: value,
    });
  };
  return (
    <View style={styles.headerContainer}>
      {array.map(item => {
        return (
          <View style={styles.headerRow} key={item.title}>
            <Text style={styles.headerTitle}>{Formater.formatEmptyData(item.title)}:</Text>
            <View style={styles.headerDataContainer}>
              {
                item.link && props.action
                  ?
                  <TouchableOpacity onPress={props.action}>
                    <Text style={styles.headerLink}>{Formater.formatEmptyData(item.value)}</Text>
                  </TouchableOpacity>
                  :
                  <Text style={styles.headerData}>{Formater.formatEmptyData(item.value)}</Text>
              }
            </View>
          </View>
        );
      })}
    </View>
  );
};

const BASE_COLOR = '#344955';
const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 28,
    marginBottom: 4,
  },
  headerTitle: {
    flex: 3,
  },
  headerDataContainer: {
    flex: 7,
    borderColor: BASE_COLOR,
    borderBottomWidth: 1,
  },
  headerData: {
    color: BASE_COLOR,
    fontWeight: 'bold',
  },
  headerLink: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: BASE_COLOR,
  },
});

export default Header;