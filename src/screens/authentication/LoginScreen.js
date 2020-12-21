import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, TextInput, Image, Text, TouchableOpacity, ActivityIndicator, Keyboard, Dimensions, StatusBar, Modal, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NetInfo from '@react-native-community/netinfo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AwesomeAlert from 'react-native-awesome-alerts';

import Helper from '../../utils/Helper';
import MessageAlert from '../../components/MessageAlert';
import LoginAPI from '../../apis/LoginAPI';
import GetDataLoginAPI from '../../apis/app/GetDataLoginAPI';
export default ({ navigation }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassord, setShowPassord] = useState(false);
  const [loading, setLoading] = useState(false);

  const PROJECT_CODE_DEFAULT = 'Select Project';
  const DISCIPLINE_CODE_DEFAULT = 'Select Module';

  const [isLoading, setIsLoading] = useState(true);
  const [projectList, setProjectList] = useState([]);
  const [disciplineList, setDisciplineList] = useState([]);

  const [projectCode, setProjectCode] = useState(PROJECT_CODE_DEFAULT);
  const [isVisibleProject, setIsVisibleProject] = useState(false);

  const [discicplineCode, setDisciplineCode] = useState(DISCIPLINE_CODE_DEFAULT);
  const [isVisibleDiscipline, setIsVisibleDiscipline] = useState(false);

  const nextInput = useRef(null);
  const _onSubmitEditingNextInput = () => {
    nextInput.current.focus();
  };

  useEffect(() => {
    getDataFromAPI();
  }, []);

  const getDataFromAPI = () => {
    setIsLoading(true);
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        ConfirmAlert();
      } else {
        getData();
      }
    });
  };

  const getData = () => {
    GetDataLoginAPI()
      .then(res => {
        if (res.success) {
          setProjectList(res.projectList);
          setDisciplineList(res.disciplineList);
          setIsLoading(false);
        } else {
          ConfirmAlert();
        }
      })
      .catch(() => {
        ConfirmAlert();
      });
  };

  const ConfirmAlert = () => {
    Alert.alert(
      'ERROR',
      'Check that you are using the company network and reload',
      [
        { text: 'Reload', onPress: () => { getDataFromAPI() } }
      ],
      { cancelable: false },
    );
  };

  const _onChangeUsername = text => {
    setUsername(text);
  };

  const _onChangePassword = text => {
    setPassword(text);
  };

  const _onPressClearUsername = () => {
    setUsername('');
  };

  const _onPressTogglePassword = () => {
    setShowPassord(!showPassord);
  };

  const _onPressLogin = () => {
    Keyboard.dismiss();
    setLoading(true);
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        MessageAlert('WARNING', 'Network not available!');
        setLoading(false);
      } else {
        if (username === '' || password === '') {
          MessageAlert('ERROR', 'The user name or password is invalid.');
          setLoading(false);
          return;
        }
        if (projectCode === PROJECT_CODE_DEFAULT) {
          MessageAlert('ERROR', 'Please select a project.');
          setLoading(false);
          return;
        }
        if (discicplineCode === DISCIPLINE_CODE_DEFAULT) {
          MessageAlert('ERROR', 'Please select a module.');
          setLoading(false);
          return;
        }
        LoginAPI(username, password)
          .then(res => {
            res = JSON.parse(res.data);
            if (res.error) {
              MessageAlert('ERROR', res.error_description);
              setLoading(false);
              return;
            }
            if (res.access_token) {
              Helper.storeData('TOKEN', res.access_token);
              Helper.storeData('USERNAME', res.userName);
              Helper.storeData('EXPIRES', res['.expires']);
              Helper.storeData('PROJECT_CODE', projectCode);
              Helper.storeData('DISCIPLINE_CODE', discicplineCode);
              Helper.storeData('DATACODE', 'PTSCMC');
              navigation.replace('Home');
            }
          })
          .catch(() => {
            MessageAlert('ERROR', 'Please check that you are using the company network!');
            setLoading(false);
          });
      }
    });
  };

  const _onPressSelectProject = () => {
    setIsVisibleProject(true);
  };

  const _onChangeProjectCode = (item) => {
    setProjectCode(item);
    setIsVisibleProject(false);
  };

  const _onPressSelectDiscipline = () => {
    setIsVisibleDiscipline(true);
  };

  const _onChangeDisciplineCode = (item) => {
    setDisciplineCode(item);
    setIsVisibleDiscipline(false);
  };

  return (
    <>
      <StatusBar barStyle='dark-content' />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAwareScrollView>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              resizeMode='stretch'
              source={require('../../images/background.jpg')}
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>PTSC M&C</Text>
          </View>
          <View style={styles.containerCenter} pointerEvents={loading ? 'none' : 'auto'}>
            <View style={styles.inputContainer}>
              <Icon name='user-circle' style={styles.inputIcon} />
              <TextInput
                style={styles.inputText}
                placeholder="Username ..."
                placeholderTextColor={'#5f707a'}
                value={username}
                onChangeText={_onChangeUsername}
                blurOnSubmit={false}
                onSubmitEditing={_onSubmitEditingNextInput}
              />
              {username == ''
                ? null
                : <Icon name="times-circle" onPress={_onPressClearUsername} style={styles.inputIcon} />}
            </View>
            <View style={[styles.inputContainer, styles.inputContainerLast]}>
              <Icon name="unlock-alt" style={styles.inputIcon} />
              <TextInput
                blurOnSubmit={true}
                ref={nextInput}
                style={styles.inputText}
                placeholder="Password ..."
                placeholderTextColor={'#5f707a'}
                value={password}
                secureTextEntry={!showPassord}
                onChangeText={_onChangePassword}
              />
              {password == ''
                ? null : (showPassord
                  ? <Icon name="eye-slash" onPress={_onPressTogglePassword} style={styles.inputIcon} />
                  : <Icon name="eye" onPress={_onPressTogglePassword} style={styles.inputIcon} />)}
            </View>
            <TouchableOpacity
              style={[styles.selectContainer, styles.inputContainerLast]}
              onPress={_onPressSelectProject}>
              <Text style={styles.selectText}>{projectCode}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.selectContainer, styles.inputContainerLast]}
              onPress={_onPressSelectDiscipline}>
              <Text style={styles.selectText}>{discicplineCode}</Text>
            </TouchableOpacity>
            {loading
              ? <TouchableOpacity style={styles.buttonContainer}>
                <ActivityIndicator size="large" color={OPP_COLOR} />
              </TouchableOpacity>
              : <TouchableOpacity style={styles.buttonContainer} onPress={_onPressLogin}>
                <Text style={styles.buttonTitle}>LOGIN</Text>
              </TouchableOpacity>}
          </View>
        </KeyboardAwareScrollView>
        <Modal
          animationType='fade'
          transparent={true}
          visible={isVisibleProject}>
          <View style={modals.dim}>
            <SafeAreaView>
              <View style={modals.container}>
                <View style={modals.list}>
                  <ScrollView>
                    {projectList.map((item) => {
                      return (
                        <TouchableOpacity style={modals.row} onPress={() => { _onChangeProjectCode(item) }}>
                          <Text style={modals.cell}>{item}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
                <View style={modals.action}>
                  <TouchableOpacity style={modals.button} onPress={() => { setIsVisibleProject(false) }} >
                    <Text style={modals.buttonTitle}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </View>
        </Modal>
        <Modal
          animationType='fade'
          transparent={true}
          visible={isVisibleDiscipline}>
          <View style={modals.dim}>
            <SafeAreaView>
              <View style={modals.container}>
                <View style={modals.list}>
                  <ScrollView>
                    {disciplineList.map((item) => {
                      return (
                        <TouchableOpacity style={modals.row} onPress={() => _onChangeDisciplineCode(item)}>
                          <Text style={modals.cell}>{item}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
                <View style={modals.action}>
                  <TouchableOpacity style={modals.button} onPress={() => setIsVisibleDiscipline(false)} >
                    <Text style={modals.buttonTitle}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </View>
        </Modal>
        <AwesomeAlert
          show={isLoading}
          showProgress={true}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
        />
      </SafeAreaView></>
  );
};

const BASE_COLOR = '#344955';
const OPP_COLOR = 'white';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  imageContainer: {
    height: Dimensions.get('window').height * 0.4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    height: Dimensions.get('window').height * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 42,
    color: BASE_COLOR,
    fontWeight: 'bold',
  },
  containerCenter: {
    height: Dimensions.get('window').height * 0.5,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 32,
    height: 48,
    width: '100%',
  },
  inputText: {
    fontSize: 16,
    flex: 1,
    height: '100%',
    color: BASE_COLOR,
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 16,
    fontSize: 20,
    color: BASE_COLOR,
  },
  inputContainerLast: {
    marginTop: 16,
  },
  selectContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 32,
    height: 48,
    width: '100%',
  },
  selectText: {
    fontSize: 16,
    color: BASE_COLOR,
  },
  buttonContainer: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
    borderRadius: 32,
    marginTop: 48,
    width: '100%',
  },
  buttonTitle: {
    color: OPP_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
const modals = StyleSheet.create({
  dim: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: OPP_COLOR,
    width: windowWidth * 0.85,
    height: undefined,
    maxHeight: windowHeight * 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  list: {
    padding: 16,
    width: windowWidth * 0.85,
    height: undefined,
  },
  row: {
    flexDirection: 'row',
    height: 36,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    alignItems: 'center',
  },
  cell: {
    flex: 5,
    color: BASE_COLOR,
    paddingLeft: 4,
    paddingRight: 4,
  },
  action: {
    width: windowWidth * 0.85,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 16,
    marginBottom: 16,
  },
  button: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BASE_COLOR,
    padding: 4,
    marginRight: 8,
  },
  buttonTitle: {
    color: OPP_COLOR,
  },
});