import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-simple-toast';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Helper from '../helper/Helper';
import GetProjectListAPI from '../apis/GetProjectListAPI';
import MessageAlert from './CustomViews/MessageAlert';
import LoadingRefresh from './CustomViews/LoadingRefresh';

export default ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [listProject, setListProject] = useState([]);
  const [projectCode, setProjectCode] = useState(null);

  useEffect(() => {
    getDataFromAPI();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={_onPressLogout} style={{ paddingRight: 16 }}>
          <Ionicons name='log-out-outline' size={24} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const getDataFromAPI = () => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoading(false);
        setIsError(true);
        MessageAlert('WARNING', 'Network not available!');
      } else {
        setIsLoading(true);
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
          MessageAlert('ERROR', res.Message);
          setIsLoading(false);
          setIsError(true);
        }
      })
      .catch((error) => {
        MessageAlert('ERROR', error.toString());
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
    navigation.navigate('Login');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const _onChangeProjectCode = (item) => {
    setProjectCode(item.value);
  };

  const _onPressUpdateDrawing = () => {
    if (projectCode == null) {
      Toast.show('Please select a project!', Toast.SHORT);
      return;
    }
    try {
      Helper.storeData('PROJECT_CODE', projectCode);
      navigation.navigate('DrawingList');
    } catch (error) {
      MessageAlert('ERROR', error.toString());
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={getDataFromAPI} />
      <View style={styles.container}>
        <View style={styles.containerCenter}>
          <DropDownPicker
            items={listProject}
            onChangeItem={_onChangeProjectCode}
            defaultValue={null}
            placeholder='Select Project'
            containerStyle={styles.selectContainer}
            style={styles.select}
            itemStyle={styles.selectItem}
            activeItemStyle={styles.selectActiveItem}
          />
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.action}>
              <TouchableOpacity style={styles.buttonContainer} onPress={_onPressUpdateDrawing}>
                <Text style={styles.buttonTitle}>Update Progress for Drawing</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonContainer} onPress={null}>
                <Text style={styles.buttonTitle}>Update Mhrs for Work Order</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonContainer} onPress={null}>
                <Text style={styles.buttonTitle}>Update QC Status for STR DIM</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonContainer} onPress={null}>
                <Text style={styles.buttonTitle}>Update QC Status for STR FU</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonContainer} onPress={null}>
                <Text style={styles.buttonTitle}>Update QC Status for STR VS</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonContainer} onPress={null}>
                <Text style={styles.buttonTitle}>Update QC Status for PIP DIM</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonContainer} onPress={null}>
                <Text style={styles.buttonTitle}>Update QC Status for PIP FU</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonContainer} onPress={null}>
                <Text style={styles.buttonTitle}>Update QC Status for PIP VS</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const BASE_COLOR = '#344955';
const OPP_COLOR = 'white';
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: OPP_COLOR,
  },
  containerCenter: {
    flex: 1,
    padding: 16,
  },

  selectContainer: {
    height: 50,
    marginBottom: 32,
  },
  select: {
    borderColor: BASE_COLOR,
  },
  selectItem: {
    justifyContent: 'flex-start',
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1
  },
  selectActiveItem: {
    backgroundColor: 'azure',
  },

  action: {
    flex: 1,
    justifyContent: 'space-between'
  },
  buttonContainer: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
  },
  buttonTitle: {
    color: OPP_COLOR,
    fontSize: 16,
  },
});
