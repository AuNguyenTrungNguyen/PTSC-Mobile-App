import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance, Keyboard, Platform, PermissionsAndroid, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageView from 'react-native-image-viewing';
import Toast from 'react-native-simple-toast';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from '@react-native-community/cameraroll';

import Networker from '../../../utils/Networker';
import Formater from '../../../utils/Formater';
import Helper from '../../../utils/Helper';

import { GetProjectListAPI } from '../../../apis/app/LoginAPI';
import { GetCertificateListAPI, GetQCWelderAvatarAPI, } from '../../../apis/qa/QAAPI';

import { ListLoadingData, ListEmptyData } from '../../../components/HelperUI';
import LoadingRefresh from '../../../components/LoadingRefresh';
import SelectPopup from '../../../components/SelectPopup';

const QCWelderCardDetailScreen = ({ route, navigation }) => {

  const { projectCode, welderId, welderName, DOB, companyID, nationalID, } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [certificateList, setCertificateList] = useState(null);

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
            onPress={_onPressAvatar}>
            <Ionicons
              size={24}
              name={'md-happy-outline'} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
            onPress={_onPressImage}>
            <Ionicons
              size={24}
              name={'md-image-outline'} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
            onPress={toggle}>
            <Ionicons
              size={24}
              name={isShowDescription.name} color={iconColor} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, isShowDescription]);
  const toggle = () => {
    setIsShowDescription(prevState => {
      return {
        show: !prevState.show,
        name: prevState.name === 'arrow-up-circle-outline' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'
      }
    });
  };

  const callAPI = (executedAPI, UI = false) => {
    if (UI) {
      setIsSearching(true);
    }
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true), setIsSearching(false) });
  };
  useEffect(
    () => {
      callAPI(getProjectList);
      callAPI(getData);
    }, []
  );

  //-- Search Action
  const _onPressSearch = () => {
    Keyboard.dismiss();
    callAPI(getData);
  };
  async function getData({ project = projectCodeFilter } = {}) {
    project = (!project || project === PROJECT_CODE_DEFAULT) ? '' : project;
    GetCertificateListAPI(welderId, project)
      .then(res => {
        if (res.Success && res.Data) {
          setCertificateList(res.Data);
          setIsLoading(false);
          setIsError(false);
          setIsSearching(false);
        } else {
          setIsLoading(false);
          setIsError(true);
          setIsSearching(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsSearching(false);
      });
  };

  //-- Avatar
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [openImage, setOpenImage] = useState([]);
  const _onPressAvatar = () => {
    callAPI(getAvatar, false);
  };
  const getAvatar = async () => {
    GetQCWelderAvatarAPI(welderId)
      .then(res => {
        if (res.Success) {
          if (res.Data) {
            setOpenImage([{ uri: res.Data }]);
            setIsOpenImage(true);
          }
          else {
            Toast.show(res.Message.toString(), Toast.SHORT);
          }
        }
      })
      .catch(() => {
      });
  };
  const _onPressSaveImage = async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermissionSaveStorage())) {
      Alert.alert(
        'WARNING',
        'Please accept iamge permissions to continue',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        { cancelable: false }
      );
    } else {
      saveImage();
    }
  };
  const saveImage = async () => {
    try {
      let indexFileName = openImage[0].uri.lastIndexOf('/');
      let imageName = openImage[0].uri.substring(indexFileName);
      let indexExtension = imageName.lastIndexOf('.');
      let imageExtension = imageName.substring(indexExtension + 1);
      let path = RNFetchBlob.fs.dirs.MainBundleDir + imageName;
      RNFetchBlob
        .config({
          fileCache: true,
          appendExt: imageExtension,
          path: path,
        })
        .fetch('GET', openImage[0].uri)
        .then((res) => {
          CameraRoll.save(res.path())
            .then(() => {
              Alert.alert(
                '',
                'Image saved successfully.',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                ],
              )
            })
            .catch(() => {
              Alert.alert(
                'ERROR',
                'An error occured while executing your request.',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                ],
              )
            });
        });
    } catch (error) {
      Alert.alert(
        'ERROR',
        'An error occured while executing your request.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
      )
    }
  };
  const hasAndroidPermissionSaveStorage = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  //-- Image
  const _onPressImage = async () => {
    const userLogin = await Helper.getData('USERNAME');
    Keyboard.dismiss();
    navigation.navigate(
      'QCWelderCardImage',
      {
        projectCode: projectCode,
        userLogin: userLogin,
        welderId: welderId,
        welderName: welderName,
      }
    );
  };

  //-- ProjectCode filter
  const PROJECT_CODE_DEFAULT = 'All Project Code';
  const [isVisibleProject, setIsVisibleProject] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [projectCodeFilter, setProjectCodeFilter] = useState(projectCode);
  const getProjectList = async () => {
    const userLogin = await Helper.getData('USERNAME');
    GetProjectListAPI(userLogin)
      .then(res => {
        if (res.success) {
          setProjectList(res.data);
          setIsLoading(false);
          setIsError(false);
          setIsSearching(false);
        } else {
          setIsLoading(false);
          setIsError(true);
          setIsSearching(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsSearching(false);
      });
  };
  const _onChangeProjectCode = data => {
    if (data !== projectCodeFilter) {
      setProjectCodeFilter(data);
    }
    setIsVisibleProject(false);
  };
  const _onClearProjectCode = () => {
    if (projectCodeFilter !== PROJECT_CODE_DEFAULT) {
      setProjectCodeFilter(PROJECT_CODE_DEFAULT);
    }
    setIsVisibleProject(false);
  };

  //-- Render List
  const renderItem = ({ _, item }) => {
    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>CertNo:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.CertNo)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>Project:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.ProjectCode)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>Discipline:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.Discipline)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>Code:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.Code)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>{'Welding\nProcess'}:</Text>
          </View>
          <View style={styles.cellOne}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.WeldingProcess)}</Text>
          </View>
          <View style={styles.cellOne}>
            <Text>{'Test\nPosition'}:</Text>
          </View>
          <View style={styles.cellOne}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.Test_Position)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>{'Qualified\nBM'}:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.Qualified_BaseMaterial)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>{'Qualified\nODMin'}:</Text>
          </View>
          <View style={styles.cellOne}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.Qualified_ODMin)}</Text>
          </View>
          <View style={styles.cellOne}>
            <Text>{'Qualified\nODMax'}:</Text>
          </View>
          <View style={styles.cellOne}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.Qualified_ODMax)}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>{'Qualified\nWTMin'}:</Text>
          </View>
          <View style={styles.cellOne}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.Qualified_WTMin)}</Text>
          </View>
          <View style={styles.cellOne}>
            <Text>{'Qualified\nWTMax'}:</Text>
          </View>
          <View style={styles.cellOne}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.Qualified_WTMax)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>{'Remark'}:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.CertRemark)}</Text>
          </View>
        </View>
      </View>
    );
  };
  const RenderList = () => {
    {
      if (isSearching || certificateList == null) {
        return <ListLoadingData />
      } else {
        return <ListEmptyData />
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getData)} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show
                ?
                (<View style={styles.headerContainer}>
                  <View style={styles.rowInfo}>
                    <Text style={styles.infoTitle}>WelderID:</Text>
                    <View style={styles.infoDataContainer}>
                      <Text style={styles.infoData}>{Formater.formatEmptyData(welderId)}</Text>
                    </View>
                  </View>
                  <View style={styles.rowInfo}>
                    <Text style={styles.infoTitle}>Name:</Text>
                    <View style={styles.infoDataContainer}>
                      <Text style={styles.infoData}>{Formater.formatEmptyData(welderName)}</Text>
                    </View>
                  </View>
                  <View style={styles.rowInfo}>
                    <Text style={styles.infoTitle}>BOD:</Text>
                    <View style={styles.infoDataContainer}>
                      <Text style={styles.infoData}>{Formater.formatDateData(DOB)}</Text>
                    </View>
                  </View>
                  <View style={styles.rowInfo}>
                    <Text style={styles.infoTitle}>NationalID:</Text>
                    <View style={styles.infoDataContainer}>
                      <Text style={styles.infoData}>{Formater.formatEmptyData(nationalID)}</Text>
                    </View>
                  </View>
                  <View style={styles.rowInfo}>
                    <Text style={styles.infoTitle}>ConpanyID:</Text>
                    <View style={styles.infoDataContainer}>
                      <Text style={styles.infoData}>{Formater.formatEmptyData(companyID)}</Text>
                    </View>
                  </View>

                  {/* Filter */}
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitle}>ProjectCode:</Text>
                    <TouchableOpacity style={styles.selectInput} onPress={() => setIsVisibleProject(true)}>
                      <Text style={styles.buttonTitleDark}>{projectCodeFilter}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitle} />
                    <TouchableOpacity
                      style={styles.searchButton}
                      onPress={_onPressSearch}
                      disabled={isSearching}>
                      <Text style={styles.buttonTitle}>Search Certificate</Text>
                    </TouchableOpacity>
                  </View>
                </View>)
                :
                null
            }
            {
              certificateList && certificateList.length
                ?
                <VirtualizedList
                  style={styles.table}
                  data={certificateList}
                  getItemCount={data => data.length}
                  getItem={(data, index) => {
                    return data[index];
                  }}
                  keyExtractor={(item, index) => index}
                  renderItem={renderItem}
                />
                :
                <RenderList />
            }
          </View>
      }
      <SelectPopup
        visible={isVisibleProject}
        data={projectList}
        onCancel={() => setIsVisibleProject(false)}
        onClear={_onClearProjectCode}
        onChangeItem={_onChangeProjectCode} />
      <ImageView
        visible={isOpenImage}
        images={openImage}
        imageIndex={0}
        onRequestClose={() => setIsOpenImage(false)}
        FooterComponent={
          ({ _ }) => {
            return (
              <SafeAreaView style={styles.bottomImageRoot}>
                <View style={styles.bottomImageContanier}>
                  <TouchableOpacity
                    style={styles.bottomSaveButton}
                    onPress={_onPressSaveImage} >
                    <Text style={styles.buttonTitleDark}>Save Image</Text>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            );
          }
        }
      />
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
    padding: 12,
    flex: 1,
    backgroundColor: OPP_COLOR,
  },

  headerContainer: {
    marginBottom: 8,
    padding: 4,
    paddingBottom: 0,
  },
  rowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 32,
    marginBottom: 4,
  },
  rowInfoAction: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    marginBottom: 4,
  },
  infoDataContainer: {
    flex: 7,
    borderColor: BASE_COLOR,
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  infoData: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  infoTitle: {
    flex: 3,
  },
  selectInput: {
    flexDirection: 'row',
    flex: 7,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    height: '100%',
    padding: 4,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    flex: 7,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    height: '100%',
    padding: 4,
    borderRadius: 2,
    alignItems: 'center',
  },
  inputText: {
    flex: 1,
    height: '100%',
    color: BASE_COLOR,
    paddingVertical: 0,
    justifyContent: 'center'
  },
  inputIcon: {
    marginLeft: 4,
    fontSize: 20,
    color: BASE_COLOR,
  },
  searchButton: {
    flex: 7,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    height: '100%',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
    borderRadius: 2,
  },

  table: {
    flexGrow: 1,
  },
  box: {
    flexDirection: 'column',
    width: '100%',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 4,
    minHeight: 20,
  },
  checkBox: {
    fontWeight: 'bold',
    color: BASE_COLOR,
    width: 24,
    height: 24,
  },
  cellTitleLine: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellOne: {
    flex: 1,
    justifyContent: 'center',
  },
  cellThreeAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellTwo: {
    flex: 2,
    justifyContent: 'center',
  },
  cellThree: {
    flex: 3,
    justifyContent: 'center',
  },
  cellImageAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textData: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  textAccept: {
    fontWeight: 'bold',
    color: 'green',
  },
  textReject: {
    fontWeight: 'bold',
    color: 'red',
  },
  cellAction: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonAccept: {
    width: 70,
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelAccept: {
    color: 'green',
  },
  buttonReject: {
    width: 70,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelReject: {
    color: 'red',
  },
  buttonClean: {
    width: 70,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelClean: {
    color: BASE_COLOR,
  },


  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    backgroundColor: OPP_COLOR,
  },
  noDataTitle: {
    paddingTop: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  noDataText: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },

  actionContainer: {
    marginTop: 12,
    height: 36,
    flexDirection: 'row',
  },
  buttonAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
  },
  buttonTitle: {
    color: OPP_COLOR,
  },
  buttonTitleDark: {
    color: BASE_COLOR,
  },

  bottomImageRoot: {
    flex: 1,
  },
  bottomImageContanier: {
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomSaveButton: {
    backgroundColor: OPP_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
});

export default QCWelderCardDetailScreen;