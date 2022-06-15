import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Dimensions, Alert, Modal, ActivityIndicator, PermissionsAndroid, Platform, Appearance } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-simple-toast';
import FastImage from 'react-native-fast-image';
import Dialog from 'react-native-dialog';
import ImageView from 'react-native-image-viewing';
import CameraRoll from '@react-native-community/cameraroll';
import { TextInput } from 'react-native-gesture-handler';

import Helper from '../../../utils/Helper';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';

import { GetNDTIssueListAPI, UploadNDTIssueListAPI, DeleteNDTIssueAPI, EditNDTIssueAPI } from '../../../apis/ndt/NDTAPI';

const NDTIssueScreen = ({ route, navigation }) => {

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  const toggle = () => {
    setIsShowDescription(prevState => {
      return {
        show: !prevState.show,
        name: prevState.name === 'arrow-up-circle-outline' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'
      }
    });
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}
          onPress={toggle}>
          <Ionicons size={24} name={isShowDescription.name} color={iconColor} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isShowDescription]);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [NDTIssueList, setNDTIssueList] = useState([]);
  const [NDTIssueListUpload, setNDTIssueListUpload] = useState([]);

  const { projectCode, rowIndex, spoolNo, jointNo, drawingNo, code, username } = route.params;

  const [isShowDialogEdit, setIsShowDialogEdit] = useState(false);
  const [pictureId, setPictureId] = useState(null);
  const [pictureNote, setPictureNote] = useState(null);

  const [isOpenPicture, setIsOpenPicture] = useState(false);
  const [openPicture, setOpenPicture] = useState([]);

  useEffect(
    () => {
      callAPI(getNDTIssueList);
    }, []
  );

  const callAPI = executedAPI => {
    setIsLoading(true);
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoading(false);
        setIsError(true);
        MessageAlert('WARNING', 'Network not available!');
      } else {
        executedAPI();
      }
    });
  };

  const getNDTIssueList = async () => {
    let token = await Helper.getData('TOKEN');
    GetNDTIssueListAPI(projectCode, jointNo, drawingNo, code, token)
      .then(res => {
        if (res.success) {
          setNDTIssueList(res.data);
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

  const _onPressAddPicture = () => {
    Alert.alert(
      'Add Drawing Picture',
      'Please select an option',
      [
        {
          text: 'Open Gallery',
          onPress: _onPressOpenGallery,
        },
        {
          text: 'Open Camera',
          onPress: _onPressOpenCamera,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };

  const _onPressOpenGallery = () => {
    setIsLoading(true);
    ImagePicker.openPicker({
      multiple: true,
      maxFiles: 100,
    }).then(pictures => {
      picturesUpload = [];
      pictures.forEach(picture => {
        picturesUpload.push({ uri: picture.path });
      });
      setNDTIssueListUpload(picturesUpload);
      setIsSelecting(true);
    }).catch(() => {
      setIsLoading(false);
      setIsSelecting(false);
    });
  };

  const _onPressOpenCamera = () => {
    setIsLoading(true);
    ImagePicker.openCamera({
      cropping: false,
    })
      .then(picture => {
        let picturesUpload = [];
        picturesUpload.push({ uri: picture.path });
        setNDTIssueListUpload(picturesUpload);
        setIsSelecting(true);
      }).catch(() => {
        setIsLoading(false);
        setIsSelecting(false);
      });
  };

  const addFilesToBody = () => {
    const promises = NDTIssueListUpload.map(async picture => {
      return await ImageResizer.createResizedImage(picture.uri, 900, 450, 'PNG', 0)
        .then(res => {
          let file = {
            name: 'file',
            filename: res.name,
            data: RNFetchBlob.wrap(res.path),
          }
          return file;
        });
    });
    return Promise.all(promises);
  };

  const _onPressUploadNDTIssueList = async () => {
    setIsUploading(true);
    let token = await Helper.getData('TOKEN');
    let dataCode = await Helper.getData('DATACODE');
    let body = [
      { name: 'projectCode', data: projectCode },
      { name: 'rowIndex', data: rowIndex.toString() },
      { name: 'jointNo', data: jointNo },
      { name: 'drawingNo', data: drawingNo },
      { name: 'code', data: code },
      { name: 'userUpdate', data: username },
      { name: 'dataCode', data: dataCode },
    ];

    addFilesToBody()
      .then(res => {
        body = body.concat(res);
        if (pictureNote) {
          body = body.concat({ name: 'note', data: pictureNote });
        }
        UploadNDTIssueListAPI(body, token)
          .then(res => {
            res = JSON.parse(res.data);
            if (res.success) {
              setNDTIssueListUpload([]);
              setIsLoading(false);
              setIsSelecting(false);
              setIsUploading(false);
              setPictureNote(null);
              Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
              callAPI(getNDTIssueList);
            } else {
              Toast.show('Please check that you are using the company network!', Toast.SHORT);
              setIsLoading(false);
              setIsError(true);
              setIsUploading(false);
            }
          })
          .catch(() => {
            Toast.show('Please check that you are using the company network!', Toast.SHORT);
            setIsLoading(false);
            setIsError(true);
            setIsUploading(false)
          });
      });
  };

  const _onPressDeleteNDTIssue = async id => {
    Alert.alert(
      'Delete Drawing Picture',
      'Are you sure you want to delete this picture',
      [
        {
          text: 'Delete',
          onPress: () => { deleteNDTIssue(id) },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };

  const deleteNDTIssue = async id => {
    let token = await Helper.getData('TOKEN');
    DeleteNDTIssueAPI(id, token)
      .then(res => {
        Toast.show(res.Message.toString(), Toast.SHORT);
        if (res.success) {
          let array = NDTIssueList.filter(picture => picture.id !== id);
          setNDTIssueList(array);
        }
      }).catch(() => {
        Toast.show('Please check that you are using the company network!', Toast.SHORT);
      });
  }

  const _onPressEditNDTIssue = (id, note) => {
    setIsShowDialogEdit(true);
    setPictureId(id);
    setPictureNote(note);
  };

  const editNDTIssue = async () => {
    let token = await Helper.getData('TOKEN');
    EditNDTIssueAPI(pictureId, pictureNote, token)
      .then(res => {
        Toast.show(res.Message.toString(), Toast.SHORT);
        if (res.success) {
          let index = NDTIssueList.findIndex(picture => picture.id === pictureId);
          let array = [...NDTIssueList]
          array[index]['note'] = pictureNote;
          setNDTIssueList(array);
          setIsShowDialogEdit(false);
          setPictureId(null);
          setPictureNote(null);
        }
      }).catch(() => {
        Toast.show('Please check that you are using the company network!', Toast.SHORT);
      });
  };

  const _onPressOpenPicture = uri => {
    setOpenPicture([{ uri: uri }]);
    setIsOpenPicture(true);
  };

  const _onPressSavePicture = async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermissionSaveStorage())) {
      Alert.alert(
        'WARNING',
        'Please accept picture permissions to continue',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        { cancelable: false }
      );
    } else {
      savePicture();
    }
  };

  const savePicture = async () => {
    try {
      let indexFileName = openPicture[0].uri.lastIndexOf('/');
      let pictureName = openPicture[0].uri.substring(indexFileName);
      let indexExtension = pictureName.lastIndexOf('.');
      let pictureExtension = pictureName.substring(indexExtension + 1);
      let path = RNFetchBlob.fs.dirs.MainBundleDir + pictureName;
      RNFetchBlob
        .config({
          fileCache: true,
          appendExt: pictureExtension,
          path: path,
        })
        .fetch('GET', openPicture[0].uri)
        .then((res) => {
          CameraRoll.save(res.path())
            .then(() => {
              Alert.alert(
                'SUCCESS',
                'Picture saved successfully.',
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

  const ListEmptyData = () => (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataTitle}>There aren't any issues</Text>
    </View>
  );

  const renderItem = ({ item }) => {
    return (
      <View style={styles.pictureContainer}>
        <FastImage
          style={styles.pictureItem}
          source={{
            uri: item.uri,
            priority: FastImage.priority.normal,
          }}
        />
      </View>
    );
  };

  const renderItemWithAction = ({ item }) => {
    return (
      <View style={styles.pictureContainer}>
        <TouchableOpacity style={styles.pictureItem} activeOpacity={1} onPress={() => { _onPressOpenPicture(item.uri) }}>
          <FastImage
            style={styles.pictureItem}
            source={{
              uri: item.uri,
            }}
          />
        </TouchableOpacity>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>{item.userUpdate}</Text>
          {
            item.userUpdate.toLowerCase() == username.toLowerCase()
              ?
              (<TouchableOpacity
                style={styles.infoAction}
                onPress={() => _onPressDeleteNDTIssue(item.id)}>
                <Text style={styles.buttonTitleDark}>Delete</Text>
              </TouchableOpacity>)
              :
              (<TouchableOpacity
                style={styles.itemDisabled}
                disabled={true}>
                <Text style={styles.textDisabled}>Delete</Text>
              </TouchableOpacity>)
          }
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>{item.note ? item.note : ''}</Text>
          {
            item.userUpdate.toLowerCase() == username.toLowerCase()
              ?
              (<TouchableOpacity
                style={styles.infoAction}
                onPress={() => _onPressEditNDTIssue(item.id, item.note)}>
                <Text style={styles.buttonTitleDark}>Edit</Text>
              </TouchableOpacity>)
              :
              (<TouchableOpacity
                style={styles.itemDisabled}
                disabled={true}>
                <Text style={styles.textDisabled}>Edit</Text>
              </TouchableOpacity>)
          }
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getNDTIssueList)} />
        :
        <View style={styles.container}>
          {
            isShowDescription.show
              ?
              <View style={styles.headerContainer}>
                <View style={styles.rowInfo}>
                  <Text style={styles.infoTitle}>ProjectCode:</Text>
                  <View style={styles.infoDataLine}>
                    <Text style={styles.infoData}>{projectCode.toUpperCase()}</Text>
                  </View>
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.infoTitle}>SpoolNo:</Text>
                  <View style={styles.infoDataLine}>
                    <Text style={styles.infoData}>{spoolNo.toUpperCase()}</Text>
                  </View>
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.infoTitle}>DrawingNo:</Text>
                  <View style={styles.infoDataLine}>
                    <Text style={styles.infoData}>{drawingNo.toUpperCase()}</Text>
                  </View>
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.infoTitle}>JointNo:</Text>
                  <View style={styles.infoDataLine}>
                    <Text style={styles.infoData}>{jointNo.toUpperCase()}</Text>
                  </View>
                </View>
              </View>
              :
              null
          }
          {
            NDTIssueList.length
              ?
              <View style={styles.safeArea}>
                <VirtualizedList
                  style={styles.table}
                  data={NDTIssueList}
                  getItemCount={(data) => data.length}
                  getItem={(data, index) => {
                    return data[index];
                  }}
                  keyExtractor={(index) => {
                    return index;
                  }}
                  renderItem={renderItemWithAction}
                />
              </View>
              :
              <ListEmptyData />
          }
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.buttonUpload} onPress={_onPressAddPicture}>
              <Text style={styles.buttonTitle}>Add Pictures</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      <Modal visible={isSelecting} animationType='slide'>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.safeArea}>
              <VirtualizedList
                style={styles.table}
                data={NDTIssueListUpload}
                getItemCount={(data) => data.length}
                getItem={(data, index) => {
                  return data[index];
                }}
                keyExtractor={(index) => {
                  return index;
                }}
                renderItem={renderItem}
              />
              <TextInput
                style={styles.note}
                multiline={true}
                value={pictureNote}
                placeholder={'Enter note'}
                onChangeText={(text) => setPictureNote(text)}
                underlineColorAndroid='transparent' />
            </View>
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.buttonLeft}
                onPress={() => {
                  setIsLoading(false);
                  setIsSelecting(false);
                  setPictureNote(null);
                }}>
                <Text style={styles.buttonTitle}>Cancel</Text>
              </TouchableOpacity>
              {
                isUploading
                  ?
                  <TouchableOpacity style={styles.buttonRight}>
                    <ActivityIndicator size='small' color={OPP_COLOR} />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={styles.buttonRight} onPress={_onPressUploadNDTIssueList}>
                    <Text style={styles.buttonTitle}>Upload Pictures</Text>
                  </TouchableOpacity>
              }
            </View>
          </View>
        </SafeAreaView>
      </Modal>
      <Dialog.Container visible={isShowDialogEdit}>
        <Dialog.Title>{'Edit Picture Note'}</Dialog.Title>
        <Dialog.Input
          multiline={true}
          numberOfLines={5}
          textAlignVertical={'top'}
          wrapperStyle={styles.dialogInputWrapper}
          value={pictureNote}
          placeholder={'Enter note to update'}
          onChangeText={(text) => setPictureNote(text)}
          underlineColorAndroid={OPP_COLOR}
        />
        <Dialog.Button label='Cancle' onPress={() => {
          setIsShowDialogEdit(false);
          setPictureId(null);
          setPictureNote(null);
        }} />
        <Dialog.Button label='Update' onPress={editNDTIssue} />
      </Dialog.Container>
      <ImageView
        visible={isOpenPicture}
        images={openPicture}
        imageIndex={0}
        onRequestClose={() => setIsOpenPicture(false)}
        FooterComponent={
          ({ imageIndex }) => {
            return (
              <SafeAreaView style={styles.bottomImageRoot}>
                <View style={styles.bottomImageContanier}>
                  <TouchableOpacity
                    style={styles.bottomSaveButton}
                    onPress={_onPressSavePicture} >
                    <Text style={styles.buttonTitleDark}>Save Picture</Text>
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
const SCREEN_WIDTH = Dimensions.get('window').width;
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
    minHeight: 24,
    marginBottom: 4,
  },
  infoTitle: {
    flex: 3,
  },
  infoDataLine: {
    flex: 7,
    borderColor: BASE_COLOR,
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  infoData: {
    color: BASE_COLOR,
    flexShrink: 1,
  },

  table: {
    flexGrow: 0,
    backgroundColor: OPP_COLOR,
  },
  note: {
    borderColor: OPP_COLOR,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    padding: 8,
    marginTop: 8,
    height: '20%',
    textAlignVertical: 'top'
  },
  pictureContainer: {
    width: SCREEN_WIDTH - 28,
    height: 'auto',
    marginBottom: 8,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pictureItem: {
    width: '100%',
    height: (SCREEN_WIDTH - 28) * 9 / 16,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    textAlign: 'center'
  },
  infoAction: {
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
  },
  itemDisabled: {
    backgroundColor: '#cccccc',
    borderColor: '#999999',
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  textDisabled: {
    color: '#666666',
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
    fontSize: 16,
  },

  actionContainer: {
    marginTop: 12,
    height: 36,
    flexDirection: 'row',
  },
  buttonUpload: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
  },
  buttonLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
    marginRight: 4,
  },
  buttonRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
    marginLeft: 4,
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

  dialogInputWrapper: {
    borderColor: 'lightgray',
    borderWidth: 1,
    paddingHorizontal: 8,
  },

});

export default NDTIssueScreen;