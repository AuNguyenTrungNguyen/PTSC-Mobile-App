import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Dimensions, Alert, Modal, ActivityIndicator, PermissionsAndroid, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-simple-toast';
import FastImage from 'react-native-fast-image';
import Dialog from 'react-native-dialog';
import ImageView from 'react-native-image-viewing';
import CameraRoll from '@react-native-community/cameraroll';

import { Port_Server } from '../../../utils/Core';
import {
  GetDimCheckImageAPI,
  DeleteDimCheckImageAPI,
  EditDimCheckImageAPI
} from '../../../apis/structural/DimCheckAPI';

import Helper from '../../../utils/Helper';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';
import { TextInput } from 'react-native-gesture-handler';

const DimCheckImageScreen = ({ route }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [imageListUpload, setImageListUpload] = useState([]);

  const { projectCode, userLogin, dataCode, rowIndex, drawingNo, jointNo, pieceMarkNo, imageCode } = route.params;

  const [isShowDialog, setIsShowDialog] = useState(false);
  const [pictureId, setPictureId] = useState(null);
  const [pictureNote, setPictureNote] = useState(null);

  const [isOpenImage, setIsOpenImage] = useState(false);
  const [openImage, setOpenImage] = useState([]);

  useEffect(
    () => {
      callAPI(getImage);
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

  const getImage = async () => {
    let token = await Helper.getData('TOKEN');
    GetDimCheckImageAPI(rowIndex, token)
      .then(res => {
        if (res.success) {
          setImageList(res.data);
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

  const _onPressAddImage = () => {
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
    }).then(images => {
      imagesUpload = [];
      images.forEach(image => {
        imagesUpload.push({ uri: image.path });
      });
      setImageListUpload(imagesUpload);
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
      .then(image => {
        let imagesUpload = [];
        imagesUpload.push({ uri: image.path });
        setImageListUpload(imagesUpload);
        setIsSelecting(true);
      }).catch(() => {
        setIsLoading(false);
        setIsSelecting(false);
      });
  };

  const addFilesToBody = () => {
    const promises = imageListUpload.map(async (image) => {
      return await ImageResizer.createResizedImage(image.uri, 900, 450, 'PNG', 0)
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

  const _onPressUploadImage = async () => {
    setIsUploading(true);
    let token = await Helper.getData('TOKEN');
    let body = [
      { name: 'dataCode', data: dataCode },
      { name: 'username', data: userLogin },
      { name: 'projectCode', data: projectCode },
      { name: 'drawingNo', data: drawingNo },
      { name: 'jointNo', data: jointNo },
      { name: 'rowIndex', data: rowIndex.toString() },
    ];

    if (imageCode) {
      body = body.concat({ name: 'code', data: imageCode });
    }

    addFilesToBody()
      .then(res => {
        body = body.concat(res);
        if (pictureNote) {
          body = body.concat({ name: 'note', data: pictureNote });
        }
        RNFetchBlob.fetch(
          'POST',
          Port_Server + '/api/structural/DimCheck/UploadDimCheckImage',
          {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'multipart/form-data',
          },
          body,
        )
          .then(res => {
            res = JSON.parse(res.data);
            if (res.success) {
              setImageListUpload([]);
              setIsLoading(false);
              setIsLoading(false);
              setIsSelecting(false);
              setIsUploading(false);
              setPictureNote(null);
              Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
              callAPI(getImage);
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
            setIsUploading(false);
          });
      });
  };

  const _onPressDeleteImage = async id => {
    Alert.alert(
      'Delete Picture',
      'Are you sure you want to delete this picture',
      [
        {
          text: 'Delete',
          onPress: () => { deleteImage(id) },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };

  const deleteImage = async id => {
    let token = await Helper.getData('TOKEN');
    DeleteDimCheckImageAPI(id, token)
      .then(res => {
        Toast.show(res.Message.toString(), Toast.SHORT);
        if (res.success) {
          let array = imageList.filter(image => image.id !== id);
          setImageList(array);
        }
      }).catch(() => {
        Toast.show('Please check that you are using the company network!', Toast.SHORT);
      });
  }

  const _onPressEditImage = (id, note) => {
    setIsShowDialog(true);
    setPictureId(id);
    setPictureNote(note);
  };

  const _onPressUpdateImage = async () => {
    let token = await Helper.getData('TOKEN');
    EditDimCheckImageAPI(pictureId, pictureNote, token)
      .then(res => {
        Toast.show(res.Message.toString(), Toast.SHORT);
        if (res.success) {
          let index = imageList.findIndex(image => image.id === pictureId);
          let array = [...imageList]
          array[index]['note'] = pictureNote;
          setImageList(array);
          setIsShowDialog(false);
          setPictureId(null);
          setPictureNote(null);
        }
      }).catch(() => {
        Toast.show('Please check that you are using the company network!', Toast.SHORT);
      });
  };

  const _onPressOpenImage = uri => {
    setOpenImage([{ uri: uri }]);
    setIsOpenImage(true);
  };

  const _onPressSaveImage = async () => {
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
      <Text style={styles.noDataTitle}>No have any picture</Text>
    </View>
  );

  const renderItem = ({ item }) => {
    return (
      <View style={styles.imageContainer}>
        <FastImage
          style={styles.imageItem}
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
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.imageItem} activeOpacity={1} onPress={() => { _onPressOpenImage(item.uri) }}>
          <FastImage
            style={styles.imageItem}
            source={{
              uri: item.uri,
            }}
          />
        </TouchableOpacity>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>{item.username}</Text>
          {
            item.username.toLowerCase() == userLogin.toLowerCase()
              ?
              (<TouchableOpacity
                style={styles.infoAction}
                onPress={() => _onPressDeleteImage(item.id)}>
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
            item.username.toLowerCase() == userLogin.toLowerCase()
              ?
              (<TouchableOpacity
                style={styles.infoAction}
                onPress={() => _onPressEditImage(item.id, item.note)}>
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
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getImage)} />
        :
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.rowInfo}>
              <Text style={styles.infoTitle}>DrawingNo:</Text>
              <View style={styles.infoDataLine}>
                <Text style={styles.infoData}>{drawingNo}</Text>
              </View>
            </View>
            {jointNo &&
              <View style={styles.rowInfo}>
                <Text style={styles.infoTitle}>JointNo:</Text>
                <View style={styles.infoDataLine}>
                  <Text style={styles.infoData}>{jointNo}</Text>
                </View>
              </View>
            }
            <View style={styles.rowInfo}>
              <Text style={styles.infoTitle}>PieceNo:</Text>
              <View style={styles.infoDataLine}>
                <Text style={styles.infoData}>{pieceMarkNo}</Text>
              </View>
            </View>
          </View>
          {
            imageList.length
              ?
              <View style={styles.safeArea}>
                <VirtualizedList
                  style={styles.table}
                  data={imageList}
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
            {
              <TouchableOpacity style={styles.buttonUpload} onPress={_onPressAddImage}>
                <Text style={styles.buttonTitle}>Add Pictures</Text>
              </TouchableOpacity>
            }
          </View>
        </View>
      }
      <Modal visible={isSelecting} animationType='slide'>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.safeArea}>
              <VirtualizedList
                style={styles.table}
                data={imageListUpload}
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
              <TouchableOpacity style={styles.buttonLeft} onPress={() => {
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
                  <TouchableOpacity style={styles.buttonRight} onPress={_onPressUploadImage}>
                    <Text style={styles.buttonTitle}>Upload Pictures</Text>
                  </TouchableOpacity>
              }
            </View>
          </View>
        </SafeAreaView>
      </Modal>
      <Dialog.Container visible={isShowDialog}>
        <Dialog.Title>{'Edit Picture Note'}</Dialog.Title>
        <Dialog.Input
          multiline={true}
          numberOfLines={7}
          value={pictureNote}
          placeholder={'Enter note to update'}
          onChangeText={(text) => setPictureNote(text)}
          underlineColorAndroid={BASE_COLOR}
        />
        <Dialog.Button label='Cancle' onPress={() => {
          setIsShowDialog(false);
          setPictureId(null);
          setPictureNote(null);
        }} />
        <Dialog.Button label='Update' onPress={_onPressUpdateImage} />
      </Dialog.Container>
      <ImageView
        visible={isOpenImage}
        images={openImage}
        imageIndex={0}
        onRequestClose={() => setIsOpenImage(false)}
        FooterComponent={
          ({ imageIndex }) => {
            return (
              <SafeAreaView style={styles.bottomImageRoot}>
                <View style={styles.bottomImageContanier}>
                  <TouchableOpacity
                    style={styles.bottomSaveButton}
                    onPress={_onPressSaveImage} >
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
  imageContainer: {
    width: SCREEN_WIDTH - 28,
    height: 'auto',
    marginBottom: 8,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageItem: {
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
});

export default DimCheckImageScreen;