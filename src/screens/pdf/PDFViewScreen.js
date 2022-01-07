import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Alert } from 'react-native';
import Pdf from 'react-native-pdf';
import NetInfo from '@react-native-community/netinfo';
import { CreateTempDrawingNoAPI } from '../../apis/app/AppAPI';
import Helper from '../../utils/Helper';
import MessageAlert from '../../components/MessageAlert';

export default ({ route, navigation }) => {

  const { link } = route.params;

  const [url, setURL] = useState({ uri: link });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(
    () => {
      prepareSource();
    }, []
  );

  const callAPI = executedAPI => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        MessageAlert('WARNING', 'Network not available!');
      } else {
        executedAPI();
      }
    });
  };

  const prepareSource = () => {
    let check = link.includes('+');
    if (check) {
      callAPI(createTempDrawingNo);
    }
    else {
      setURL({ uri: link.replace(/ /g, '%20') });
      setIsLoading(false);
    }
  };

  const createTempDrawingNo = async () => {
    let userLogin = await Helper.getData('USERNAME');
    let token = await Helper.getData('TOKEN');
    CreateTempDrawingNoAPI(link, userLogin, token)
      .then(res => {
        if (res.success) {
          setURL({ uri: res.data.replace(/ /g, '%20') });
          setIsLoading(false);
        }
      })
      .catch(() => {
      });
  };



  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {
          !isLoading && <Pdf
            style={styles.pdf}
            source={url}
            backgroundColor={OPP_COLOR}
            fitPolicy={1}
            maxScale={3}
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
        }
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