import React from 'react';
import { StyleSheet, SafeAreaView, View, Alert } from 'react-native';
import Pdf from 'react-native-pdf';

export default ({ route, navigation }) => {

  const { link } = route.params;

  const prepareSource = () => {
    const result = link.replace(/ /g, '%20');
    return { uri: result };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pdf
          style={styles.pdf}
          source={prepareSource()}
          backgroundColor={OPP_COLOR}
          fitPolicy={1}
          maxScale={2}
          activityIndicatorProps={{ color: BASE_COLOR, progressTintColor: BASE_COLOR }}
          onError={() => {
            Alert.alert(
              'ERROR',
              'An error occured while executing your request.',
              [
                {
                  text: 'Back',
                  style: 'cancel',
                  onPress: () => {
                    navigation.goBack();
                  },
                },
              ],
              { cancelable: false },
            );
          }}
        />
      </View>
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
    padding: 8,
    flex: 1,
    backgroundColor: OPP_COLOR,
  },
  pdf: {
    flex: 1,
  }
});