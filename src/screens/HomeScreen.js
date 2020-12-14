import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Alert, Appearance, FlatList } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-simple-toast';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Helper from '../utils/Helper';
import GetProjectListAPI from '../apis/app/GetProjectListAPI';
import MessageAlert from '../components/MessageAlert';
import LoadingRefresh from '../components/LoadingRefresh';

export default ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [listProject, setListProject] = useState([]);
  const [projectCode, setProjectCode] = useState(null);

  let colorIcon = Appearance.getColorScheme() === 'dark' ? 'white' : 'black';

  useEffect(() => {
    getDataFromAPI();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={_onPressLogout} style={{ paddingRight: 16 }}>
          <Ionicons name='log-out-outline' size={24} color={colorIcon} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const getDataFromAPI = () => {
    setIsLoading(true);
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoading(false);
        setIsError(true);
        MessageAlert('WARNING', 'Network not available!');
      } else {
        getData();
      }
    });
  };

  const getData = async () => {
    let username = await Helper.getData('USERNAME');
    let token = await Helper.getData('TOKEN');
    GetProjectListAPI(username, token)
      .then(res => {
        if (res.success) {
          setListProject(res.data);
          setIsLoading(false);
          setIsError(false);
        } else {
          setIsLoading(false);
          setIsError(true);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  };

  const _onPressLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout }
      ],
      { cancelable: false }
    );
  };

  const logout = () => {
    Helper.clearData();
    navigation.replace('Login');
  };

  const _onPressUpdateDrawing = async () => {
    if (projectCode == null) {
      Toast.show('Please select a project!', Toast.SHORT);
      return;
    }
    try {
      Helper.storeData('PROJECT_CODE', projectCode);
      navigation.navigate('DrawingList', { projectCode: projectCode });
    } catch (error) {
      MessageAlert('ERROR', error.toString());
    }
  };

  const _onPressViewReports = () => {
    if (projectCode == null) {
      Toast.show('Please select a project!', Toast.SHORT);
      return;
    }
    navigation.navigate('Reports', { projectCode: projectCode });
  };

  const Item = ({ item, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
      <Text>{item.value}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    const backgroundColor = item.value === projectCode ? SELECT_COLOR : OPP_COLOR;
    return (
      <Item
        item={item}
        onPress={() => {
          setProjectCode(item.value);
          Helper.storeData('DATACODE', item.DataCode);
        }}
        style={{ backgroundColor }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={getDataFromAPI} />
        :
        <View style={styles.container}>
          <FlatList
            data={listProject}
            renderItem={renderItem}
            keyExtractor={(item) => item.value}
          />
          <View style={styles.action}>
            <TouchableOpacity style={styles.buttonContainer} onPress={_onPressUpdateDrawing}>
              <Text style={styles.buttonTitle}>Realtime Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonContainerPadding} onPress={_onPressViewReports}>
              <Text style={styles.buttonTitle}>View Reports</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
    </SafeAreaView>
  );
};

const BASE_COLOR = '#344955';
const OPP_COLOR = 'white';
const SELECT_COLOR = '#adb6bb';
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: OPP_COLOR,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: OPP_COLOR,
  },

  item: {
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },

  action: {
    marginTop: 24,
  },
  buttonContainer: {
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
  },
  buttonContainerPadding: {
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
    marginTop: 8,
  },
  buttonTitle: {
    color: OPP_COLOR,
    fontSize: 16,
  },
});
