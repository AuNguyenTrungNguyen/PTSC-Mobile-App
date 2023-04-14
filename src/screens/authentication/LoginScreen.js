import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, TextInput, Image, Text, TouchableOpacity, ActivityIndicator, Keyboard, Dimensions, Modal, ScrollView, Alert, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NetInfo from '@react-native-community/netinfo';

import { LoginAPI, GetProjectListAPI, GetModuleListAPI, GetRoleListAPI } from '../../apis/app/LoginAPI';

import Constant from '../../utils/Constant';
import Helper from '../../utils/Helper';
import { ENUM_QC_SCOPE } from '../../utils/Enum';
import MessageAlert from '../../components/MessageAlert';
import SelectPopup from '../../components/SelectPopup';

const LoginScreen = ({ navigation }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassord, setShowPassord] = useState(false);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);

  const PROJECT_CODE_DEFAULT = 'Select Project';
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [projectCode, setProjectCode] = useState(PROJECT_CODE_DEFAULT);
  const [isVisibleProject, setIsVisibleProject] = useState(false);

  // const DISCIPLINE_CODE_DEFAULT = 'Select Module';
  // const [isLoadingDiscipline, setIsLoadingDiscipline] = useState(false);
  // const [disciplineList, setDisciplineList] = useState([]);
  // const [disciplineCode, setDisciplineCode] = useState(DISCIPLINE_CODE_DEFAULT);
  // const [isVisibleDiscipline, setIsVisibleDiscipline] = useState(false);

  const ROLE_CODE_DEFAULT = 'Select Role';
  const [isLoadingRole, setIsLoadingRole] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [roleCode, setRoleCode] = useState(ROLE_CODE_DEFAULT);
  const [isVisibleRole, setIsVisibleRole] = useState(false);

  const nextInput = useRef(null);
  const _onSubmitEditingNextInput = () => {
    nextInput.current.focus();
  };

  useEffect(() => {
    nextInput.current.setNativeProps({
      style: {
        fontFamily: FONT
      },
    });
  }, []);

  const callAPI = (executedAPI, key) => {
    if (key === PROJECT_CODE_DEFAULT) {
      setIsLoadingProject(true);
      // } else if (key === DISCIPLINE_CODE_DEFAULT) {
      //   setIsLoadingDiscipline(true);
    } else if (key === ROLE_CODE_DEFAULT) {
      setIsLoadingRole(true);
    }
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoadingProject(false);
        // setIsLoadingDiscipline(false);
        setIsLoadingRole(false);
        confirmAlert();
      } else {
        executedAPI();
      }
    });
  };

  const getProjectList = () => {
    GetProjectListAPI(username)
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
          confirmAlert();
        }
      })
      .catch(() => {
        confirmAlert();
      });
  };
  // const getModuleList = () => {
  //   GetModuleListAPI()
  //     .then(res => {
  //       if (res.success) {
  //         // setIsLoadingDiscipline(false);
  //         if (!res.data.length) {
  //           MessageAlert('ERROR', 'Don\'t have any modules with this account.\nTry entering another account.');
  //         } else {
  //           setDisciplineList(res.data);
  //           setIsVisibleDiscipline(true);
  //         }
  //       } else {
  //         confirmAlert();
  //       }
  //     })
  //     .catch(() => {
  //       confirmAlert();
  //     });
  // };
  const getRoleList = () => {
    GetRoleListAPI(username)
      .then(res => {
        if (res.success) {
          setIsLoadingRole(false);
          if (!res.data.length) {
            MessageAlert('ERROR', 'Don\'t have any roles with this account.\nTry entering another account.');
          } else {
            setRoleList(res.data);
            setIsVisibleRole(true);
          }
        } else {
          confirmAlert();
        }
      })
      .catch(() => {
        confirmAlert();
      });
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
        // if (disciplineCode === DISCIPLINE_CODE_DEFAULT) {
        //   MessageAlert('ERROR', 'Please select a module.');
        //   setIsLoadingLogin(false);
        //   return;
        // }
        if (roleCode === ROLE_CODE_DEFAULT) {
          MessageAlert('ERROR', 'Please select a role.');
          setIsLoadingLogin(false);
          return;
        }
        LoginAPI(username, password)
          .then(res => {
            res = JSON.parse(res.data);
            if (res.error) {
              MessageAlert('ERROR', res.error_description);
              setIsLoadingLogin(false);
              setProjectCode(PROJECT_CODE_DEFAULT);
              // setDisciplineCode(DISCIPLINE_CODE_DEFAULT);
              setRoleCode(ROLE_CODE_DEFAULT);
              return;
            }
            if (res.access_token) {
              Helper.storeData('TOKEN', res.access_token);
              Helper.storeData('USERNAME', res.userName);
              Helper.storeData('EXPIRES', res['.expires']);
              Helper.storeData('PROJECT_CODE', projectCode);
              Helper.storeData('ROLE_CODE', roleCode);
              Helper.storeData('DATACODE', 'PTSCMC');

              //-- DisciplineCode
              if (roleCode === Constant.ROUTE__PIP_CONS
                || roleCode === Constant.ROUTE__PIP_QCWS
                || roleCode === Constant.ROUTE__PIP_QCDEPT) {

                if (roleCode === Constant.ROUTE__PIP_QCWS) {
                  Helper.storeData('QCSCOPE', ENUM_QC_SCOPE.QCWS.toString());
                }
                if (roleCode === Constant.ROUTE__PIP_QCDEPT) {
                  Helper.storeData('QCSCOPE', ENUM_QC_SCOPE.QCDEPT.toString());
                }

                const disciplineCode = Constant.ROUTE__PIPING;
                let route = roleCode;
                if (roleCode === Constant.ROUTE__PIP_QCWS || roleCode === Constant.ROUTE__PIP_QCDEPT) {
                  route = Constant.ROUTE__PIP_QC;
                  Helper.storeData('ROLE_CODE', route);
                }
                Helper.storeData('DISCIPLINE_CODE', disciplineCode);
                navigation.replace(route, {
                  screen: Constant.ROUTE__HOME,
                  params: { projectCode: projectCode, disciplineCode: disciplineCode }
                });
                return;
              }

              if (roleCode === Constant.ROUTE__STR_CONS
                || roleCode === Constant.ROUTE__STR_QCWS
                || roleCode === Constant.ROUTE__STR_QCDEPT) {

                if (roleCode === Constant.ROUTE__STR_QCWS) {
                  Helper.storeData('QCSCOPE', ENUM_QC_SCOPE.QCWS.toString());
                }
                if (roleCode === Constant.ROUTE__STR_QCDEPT) {
                  Helper.storeData('QCSCOPE', ENUM_QC_SCOPE.QCDEPT.toString());
                }

                const disciplineCode = Constant.ROUTE__STRUCTURAL;
                let route = roleCode;
                if (roleCode === Constant.ROUTE__STR_QCWS || roleCode === Constant.ROUTE__STR_QCDEPT) {
                  route = Constant.ROUTE__STR_QC;
                  Helper.storeData('ROLE_CODE', route);
                }
                Helper.storeData('DISCIPLINE_CODE', disciplineCode);
                navigation.replace(route, {
                  screen: Constant.ROUTE__HOME,
                  params: { projectCode: projectCode, disciplineCode: disciplineCode }
                });
                return;
              }

              if (roleCode === Constant.ROUTE__EIT_CONS
                || roleCode === Constant.ROUTE__EIT_QCWS
                || roleCode === Constant.ROUTE__EIT_QCDEPT) {

                if (roleCode === Constant.ROUTE__EIT_QCWS) {
                  Helper.storeData('QCSCOPE', ENUM_QC_SCOPE.QCWS.toString());
                }
                if (roleCode === Constant.ROUTE__EIT_QCDEPT) {
                  Helper.storeData('QCSCOPE', ENUM_QC_SCOPE.QCDEPT.toString());
                }

                const disciplineCode = Constant.ROUTE__ELECTRICAL;
                let route = roleCode;
                if (roleCode === Constant.ROUTE__EIT_QCWS || roleCode === Constant.ROUTE__EIT_QCDEPT) {
                  route = Constant.ROUTE__EIT_QC;
                  Helper.storeData('ROLE_CODE', route);
                }
                Helper.storeData('DISCIPLINE_CODE', disciplineCode);
                navigation.replace(route, {
                  screen: Constant.ROUTE__HOME,
                  params: { projectCode: projectCode, disciplineCode: disciplineCode }
                });
                return;
              }

              if (roleCode === Constant.ROUTE__PIP_VIEWER
                || roleCode === Constant.ROUTE__STR_VIEWER
                || roleCode === Constant.ROUTE__EIT_VIEWER
                || roleCode === Constant.ROUTE__VIEW_DRAWING) {
                Helper.storeData('ROLE_CODE', Constant.ROUTE__VIEW_DRAWING);
                navigation.replace(Constant.ROUTE__VIEW_DRAWING, {
                  screen: Constant.ROUTE__HOME,
                  params: { projectCode: projectCode }
                });
                return;
              }
            }
          })
          .catch(() => {
            MessageAlert('ERROR', 'Please check that you are using the company network!');
            setIsLoadingLogin(false);
            setProjectCode(PROJECT_CODE_DEFAULT);
            // setDisciplineCode(DISCIPLINE_CODE_DEFAULT);
            setRoleCode(ROLE_CODE_DEFAULT);
          });
      }
    });
  };


  const _onPressSelectProject = () => {
    if (username === '' || password === '') {
      MessageAlert('ERROR', 'The user name or password is invalid.');
      return;
    }
    setIsLoadingProject(true);
    LoginAPI(username, password)
      .then(res => {
        res = JSON.parse(res.data);
        if (res.access_token) {
          callAPI(getProjectList, PROJECT_CODE_DEFAULT);
          return;
        }
        setIsLoadingProject(false);
        MessageAlert('ERROR', res.error_description);
      })
      .catch(() => {
        confirmAlert();
      });
  };
  const _onChangeProjectCode = (item) => {
    setProjectCode(item);
    setIsVisibleProject(false);
  };

  // const _onPressSelectDiscipline = () => {
  //   if (username === '' || password === '') {
  //     MessageAlert('ERROR', 'The user name or password is invalid.');
  //     return;
  //   }
  //   setIsLoadingDiscipline(true);
  //   LoginAPI(username, password)
  //     .then(res => {
  //       res = JSON.parse(res.data);
  //       if (res.access_token) {
  //         callAPI(getModuleList, DISCIPLINE_CODE_DEFAULT);
  //         return;
  //       }
  //       setIsLoadingDiscipline(false);
  //       MessageAlert('ERROR', res.error_description);
  //     })
  //     .catch(() => {
  //       confirmAlert();
  //     });
  // };
  // const _onChangeDisciplineCode = (item) => {
  //   setDisciplineCode(item);
  //   setIsVisibleDiscipline(false);
  // };

  const _onPressSelectRole = () => {
    if (username === '' || password === '') {
      MessageAlert('ERROR', 'The user name or password is invalid.');
      return;
    }
    setIsLoadingRole(true);
    LoginAPI(username, password)
      .then(res => {
        res = JSON.parse(res.data);
        if (res.access_token) {
          callAPI(getRoleList, ROLE_CODE_DEFAULT);
          return;
        }
        setIsLoadingRole(false);
        MessageAlert('ERROR', res.error_description);
      })
      .catch(() => {
        confirmAlert
      });
  };
  const _onChangeRoleCode = code => {
    setRoleCode(code);
    setIsVisibleRole(false);
  };

  const confirmAlert = () => {
    setIsLoadingProject(false);
    // setIsLoadingDiscipline(false);
    setIsLoadingRole(false);
    MessageAlert('ERROR', 'Please check that you are using the company network!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.safeArea}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            resizeMode='stretch'
            source={require('../../images/backgroundTCT.jpg')}
          />
        </View>
        <View style={styles.safeArea}>
          <View style={styles.titleContainer}>
            {/* <Text style={styles.title}>PTSC</Text> */}
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
            {/* {
              isLoadingDiscipline
                ? <TouchableOpacity style={styles.selectContainer}>
                  <ActivityIndicator size="large" color={BASE_COLOR} />
                </TouchableOpacity>
                : <TouchableOpacity style={styles.selectContainer} onPress={_onPressSelectDiscipline}>
                  <Text style={styles.selectText}>{disciplineCode}</Text>
                </TouchableOpacity>
            } */}
            {
              isLoadingRole
                ? <TouchableOpacity style={styles.selectContainer}>
                  <ActivityIndicator size="large" color={BASE_COLOR} />
                </TouchableOpacity>
                : <TouchableOpacity style={styles.selectContainer} onPress={_onPressSelectRole}>
                  <Text style={styles.selectText}>{roleCode}</Text>
                </TouchableOpacity>
            }
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
      <SelectPopup
        visible={isVisibleProject}
        data={projectList}
        onChangeItem={_onChangeProjectCode}
        onCancel={() => setIsVisibleProject(false)} />
      {/* <SelectPopup
        visible={isVisibleDiscipline}
        data={disciplineList}
        onChangeItem={_onChangeDisciplineCode}
        onCancel={() => setIsVisibleDiscipline(false)} /> */}
      <SelectPopup
        multi={true}
        visible={isVisibleRole}
        data={roleList}
        onChangeItem={_onChangeRoleCode}
        onCancel={() => setIsVisibleRole(false)} />
    </SafeAreaView>
  );
};

const BASE_COLOR = '#344955';
const OPP_COLOR = 'white';
const BP_600 = 600;
const BP_750 = 750;
const FONT = Platform.OS === 'android' ? 'roboto-regular' : undefined;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  imageContainer: {
    height: Dimensions.get('window').height * 0.3,
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

export default LoginScreen;
