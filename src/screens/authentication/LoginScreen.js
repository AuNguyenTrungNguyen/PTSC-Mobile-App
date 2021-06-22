import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, TextInput, Image, Text, TouchableOpacity, ActivityIndicator, Keyboard, Dimensions, Modal, ScrollView, Alert, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NetInfo from '@react-native-community/netinfo';
import AwesomeAlert from 'react-native-awesome-alerts';

import Constant from '../../utils/Constant';
import Helper from '../../utils/Helper';
import MessageAlert from '../../components/MessageAlert';
import LoginAPI from '../../apis/LoginAPI';
import GetDataLoginAPI from '../../apis/app/GetDataLoginAPI';
import GetProjectListAPI from '../../apis/app/GetProjectListAPI';
export default ({ navigation }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassord, setShowPassord] = useState(false);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);

  const PROJECT_CODE_DEFAULT = 'Select Project';
  const DISCIPLINE_CODE_DEFAULT = 'Select Module';

  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [projectList, setProjectList] = useState([]);

  const [isLoadingDiscipline, setIsLoadingDiscipline] = useState(true);
  const [disciplineList, setDisciplineList] = useState([]);

  const [projectCode, setProjectCode] = useState(PROJECT_CODE_DEFAULT);
  const [isVisibleProject, setIsVisibleProject] = useState(false);

  const [disciplineCode, setDisciplineCode] = useState(DISCIPLINE_CODE_DEFAULT);
  const [isVisibleDiscipline, setIsVisibleDiscipline] = useState(false);

  const nextInput = useRef(null);
  const _onSubmitEditingNextInput = () => {
    nextInput.current.focus();
  };

  useEffect(() => {
    callAPI(getModuleList, DISCIPLINE_CODE_DEFAULT);
    nextInput.current.setNativeProps({
      style: {
        fontFamily: FONT
      },
    });
  }, []);

  const callAPI = (executedAPI, key) => {
    if (key === PROJECT_CODE_DEFAULT) {
      setIsLoadingProject(true);
    } else if (key === DISCIPLINE_CODE_DEFAULT) {
      setIsLoadingDiscipline(true);
    }
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoadingProject(false);
        confirmAlert(key);
      } else {
        executedAPI();
      }
    });
  };

  const getModuleList = () => {
    GetDataLoginAPI()
      .then(res => {
        if (res.success) {
          setDisciplineList(res.disciplineList);
          setIsLoadingDiscipline(false);
        } else {
          confirmAlert(DISCIPLINE_CODE_DEFAULT);
        }
      })
      .catch(() => {
        confirmAlert(DISCIPLINE_CODE_DEFAULT);
      });
  };

  const confirmAlert = key => {
    if (key === DISCIPLINE_CODE_DEFAULT) {
      Alert.alert(
        'ERROR',
        'Check that you are using the company network and reload!',
        [{ text: 'Reload', onPress: () => { callAPI(getModuleList, DISCIPLINE_CODE_DEFAULT); } }],
        { cancelable: false },
      );
    } else if (key === PROJECT_CODE_DEFAULT) {
      Alert.alert(
        'ERROR',
        'Check that you are using the company network and reload!',
        [{ text: 'Reload', onPress: () => { callAPI(getProjectList, PROJECT_CODE_DEFAULT); } }],
        { cancelable: false },
      );
    }
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
    setIsLoadingLogin(true);
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        MessageAlert('WARNING', 'Network not available!');
        setIsLoadingLogin(false);
      } else {
        if (username === '' || password === '') {
          MessageAlert('ERROR', 'The user name or password is invalid.');
          setIsLoadingLogin(false);
          return;
        }
        if (projectCode === PROJECT_CODE_DEFAULT) {
          MessageAlert('ERROR', 'Please select a project.');
          setIsLoadingLogin(false);
          return;
        }
        if (disciplineCode === DISCIPLINE_CODE_DEFAULT) {
          MessageAlert('ERROR', 'Please select a module.');
          setIsLoadingLogin(false);
          return;
        }
        LoginAPI(username, password)
          .then(res => {
            res = JSON.parse(res.data);
            if (res.error) {
              MessageAlert('ERROR', res.error_description);
              setIsLoadingLogin(false);
              return;
            }
            if (res.access_token) {
              Helper.storeData('TOKEN', res.access_token);
              Helper.storeData('USERNAME', res.userName);
              Helper.storeData('EXPIRES', res['.expires']);
              Helper.storeData('PROJECT_CODE', projectCode);
              Helper.storeData('DISCIPLINE_CODE', disciplineCode);
              Helper.storeData('DATACODE', 'PTSCMC');
              let key;
              if (disciplineCode.toUpperCase() === Constant.STRUCTURAL) {
                key = Constant.STRUCTURAL
              } else {
                key = Constant.PIPING
              }
              navigation.replace(key, {
                screen: 'Home',
                params: { projectCode: projectCode, disciplineCode: disciplineCode }
              });
            }
          })
          .catch(() => {
            MessageAlert('ERROR', 'Please check that you are using the company network!');
            setIsLoadingLogin(false);
          });
      }
    });
  };

  const _onPressSelectProject = () => {
    if (username === '' || password === '') {
      MessageAlert('ERROR', 'The user name or password is invalid.');
    } else {
      callAPI(getProjectList, PROJECT_CODE_DEFAULT);
    }
  };

  const getProjectList = async () => {
    let token = await Helper.getData('TOKEN');
    GetProjectListAPI(username, token)
      .then(res => {
        if (res.success) {
          setIsLoadingProject(false);
          if (!res.data.length) {
            MessageAlert('ERROR', 'Don\'t have any projects with this account.\nTry entering another account.');
          } else {
            setProjectList(res.data);
            setIsVisibleProject(true);
          }
        } else {
          confirmAlert(PROJECT_CODE_DEFAULT);
        }
      })
      .catch(() => {
        confirmAlert(PROJECT_CODE_DEFAULT);
      });
  };

  const _onChangeProjectCode = (item) => {
    setProjectCode(item);
    setIsVisibleProject(false);
  };

  const _onPressSelectDiscipline = () => {
    if (!disciplineList.length) {
      MessageAlert('ERROR', 'No have any module code with this account.');
    } else {
      setIsVisibleDiscipline(true);
    }
  };

  const _onChangeDisciplineCode = (item) => {
    setDisciplineCode(item);
    setIsVisibleDiscipline(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.safeArea}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            resizeMode='stretch'
            source={require('../../images/background.jpg')}
          />
        </View>
        <View style={styles.safeArea}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>PTSC M&C</Text>
          </View>
          <View style={styles.containerCenter} pointerEvents={isLoadingLogin ? 'none' : 'auto'}>
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
            <View style={styles.inputContainer}>
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
            {
              isLoadingProject
                ? <TouchableOpacity style={styles.selectContainer}>
                  <ActivityIndicator size="large" color={BASE_COLOR} />
                </TouchableOpacity>
                : <TouchableOpacity style={styles.selectContainer} onPress={_onPressSelectProject}>
                  <Text style={styles.selectText}>{projectCode}</Text>
                </TouchableOpacity>
            }
            <TouchableOpacity
              style={styles.selectContainer}
              onPress={_onPressSelectDiscipline}>
              <Text style={styles.selectText}>{disciplineCode}</Text>
            </TouchableOpacity>
            {
              isLoadingLogin
                ? <TouchableOpacity style={styles.buttonContainer}>
                  <ActivityIndicator size="large" color={OPP_COLOR} />
                </TouchableOpacity>
                : <TouchableOpacity style={styles.buttonContainer} onPress={_onPressLogin}>
                  <Text style={styles.buttonTitle}>LOGIN</Text>
                </TouchableOpacity>
            }
          </View>
        </View>
      </View>
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
        show={isLoadingDiscipline}
        showProgress={true}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
      />
    </SafeAreaView>
  );
};

const BASE_COLOR = '#344955';
const OPP_COLOR = 'white';
const BP_600 = 600;
const BP_750 = 750;
const FONT = Platform.OS === 'android' ? 'roboto-regular' : undefined;
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
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Dimensions.get('window').height > BP_750 ? 24 : 8,
  },
  title: {
    fontSize: Dimensions.get('window').height > BP_600 ? 44 : 32,
    color: BASE_COLOR,
    fontWeight: 'bold',
  },
  containerCenter: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
    justifyContent: 'space-between',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 32,
    height: Dimensions.get('window').height > BP_600 ? 48 : 40,
    width: '100%',
  },
  inputText: {
    fontSize: Dimensions.get('window').height > BP_600 ? 16 : 12,
    flex: 1,
    height: '100%',
    color: BASE_COLOR,
    fontFamily: FONT
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 16,
    fontSize: Dimensions.get('window').height > BP_600 ? 20 : 16,
    color: BASE_COLOR,
  },
  selectContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 32,
    height: Dimensions.get('window').height > BP_600 ? 48 : 40,
    width: '100%',
  },
  selectText: {
    fontSize: Dimensions.get('window').height > BP_600 ? 16 : 12,
    color: BASE_COLOR,
    fontFamily: FONT
  },
  buttonContainer: {
    height: Dimensions.get('window').height > BP_600 ? 48 : 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
    borderRadius: 32,
    width: '100%',
  },
  buttonTitle: {
    color: OPP_COLOR,
    fontSize: Dimensions.get('window').height > BP_600 ? 16 : 12,
    fontWeight: 'bold',
    fontFamily: FONT
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
    flexShrink: 1,
    padding: 16,
    width: windowWidth * 0.85,
    height: undefined,
  },
  row: {
    flexDirection: 'row',
    minHeight: 36,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    alignItems: 'center',
  },
  cell: {
    flex: 5,
    color: BASE_COLOR,
    padding: 4,
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