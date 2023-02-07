import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Dimensions, Alert, Modal, ActivityIndicator, PermissionsAndroid, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-simple-toast';
import FastImage from 'react-native-fast-image';
import ImageView from 'react-native-image-viewing';
import CameraRoll from '@react-native-community/cameraroll';


import { Port_Server } from '../../../utils/Core';
import {
  GetQCWelderAvatarAPI,
  DeleteQCWelderImageAPI
} from '../../../apis/qa/QAAPI';

import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';

import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';
import { ListEmptyData } from '../../../components/HelperUI';

const QCWelderCardAvatarSceen = ({ route, _ }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const { projectCode, userLogin, welderId, welderName } = route.params;

  const [isSelecting, setIsSelecting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUploadList, setImageUploadList] = useState([]);

  useEffect(
    () => {
      callAPI(getAvatar);
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

  //-- Load
  const getAvatar = async () => {
    GetQCWelderAvatarAPI(welderId)
      .then(res => {
        if (res.Success) {
          setAvatar(res.Data);
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

  //-- Delete
  // const _onPressDeleteImage = async id => {
  //   Alert.alert(
  //     'Delete Image',
  //     'Are you sure you want to delete this image',
  //     [
  //       {
  //         text: 'Delete',
  //         onPress: () => { deleteImage(id) },
  //       },
  //       {
  //         text: 'Cancel',
  //         style: 'cancel',
  //       },
  //     ],
  //     { cancelable: false }
  //   );
  // };
  // const deleteImage = id => {
  //   DeleteQCWelderImageAPI(id)
  //     .then(res => {
  //       Toast.show(res.Message.toString(), Toast.SHORT);
  //       if (res.Success) {
  //         let array = avatar.filter(image => image.Id !== id);
  //         setAvatar(array);
  //       }
  //     }).catch(() => {
  //       Toast.show('Please check that you are using the company network!', Toast.SHORT);
  //     });
  // }

  //-- Upload
  // const _onPressAddImage = () => {
  //   Alert.alert(
  //     'Add Image',
  //     'Please select an option',
  //     [
  //       {
  //         text: 'Open Gallery',
  //         onPress: _onPressOpenGallery,
  //       },
  //       {
  //         text: 'Open Camera',
  //         onPress: _onPressOpenCamera,
  //       },
  //       {
  //         text: 'Cancel',
  //         style: 'cancel',
  //       },
  //     ],
  //     { cancelable: false }
  //   );
  // };
  // const _onPressOpenGallery = () => {
  //   setIsLoading(true);
  //   ImagePicker.openPicker({
  //     multiple: true,
  //     maxFiles: 100,
  //   }).then(images => {
  //     imagesUpload = [];
  //     images.forEach(image => {
  //       imagesUpload.push({ URL: image.path });
  //     });
  //     setImageUploadList(imagesUpload);
  //     setIsSelecting(true);
  //   }).catch(() => {
  //     setIsLoading(false);
  //     setIsSelecting(false);
  //   });
  // };
  // const _onPressOpenCamera = () => {
  //   setIsLoading(true);
  //   ImagePicker.openCamera({
  //     cropping: false,
  //   })
  //     .then(image => {
  //       let imagesUpload = [];
  //       imagesUpload.push({ URL: image.path });
  //       setImageUploadList(imagesUpload);
  //       setIsSelecting(true);
  //     }).catch(() => {
  //       setIsLoading(false);
  //       setIsSelecting(false);
  //     });
  // };
  // const addFilesToBody = () => {
  //   const promises = imageUploadList.map(async (image) => {
  //     return await ImageResizer.createResizedImage(image.URL, 900, 450, 'PNG', 0)
  //       .then(res => {
  //         let file = {
  //           name: 'file',
  //           filename: res.name,
  //           data: RNFetchBlob.wrap(res.path),
  //         }
  //         return file;
  //       });
  //   });
  //   return Promise.all(promises);
  // };
  // const _onPressUploadImage = async () => {
  //   setIsUploading(true);
  //   const token = await Helper.getData('TOKEN');
  //   const dataCode = await Helper.getData('DATACODE');
  //   const username = await Helper.getData('USERNAME');

  //   let body = [
  //     { name: 'dataCode', data: dataCode },
  //     { name: 'projectCode', data: projectCode },
  //     { name: 'welderId', data: welderId },
  //     { name: 'username', data: username },
  //   ];

  //   addFilesToBody()
  //     .then(res => {
  //       body = body.concat(res);
  //       RNFetchBlob.fetch(
  //         'POST',
  //         Port_Server
  //         + '/api/QA/UploadQCWelderImage',
  //         {
  //           'Authorization': 'Bearer ' + token,
  //           'Content-Type': 'multipart/form-data',
  //         },
  //         body,
  //       )
  //         .then(res => {
  //           res = JSON.parse(res.data);
  //           if (res.Success) {
  //             setImageUploadList([]);
  //             setIsLoading(false);
  //             setIsSelecting(false);
  //             setIsUploading(false);
  //             Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
  //             callAPI(getAvatar);
  //           } else {
  //             Toast.show('Please check that you are using the company network!', Toast.SHORT);
  //             setIsLoading(false);
  //             setIsError(true);
  //             setIsUploading(false);
  //           }
  //         })
  //         .catch(() => {
  //           Toast.show('Please check that you are using the company network!', Toast.SHORT);
  //           setIsLoading(false);
  //           setIsError(true);
  //           setIsUploading(false);
  //         });
  //     });
  // };

  //-- Open
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [openImage, setOpenImage] = useState([]);
  const _onPressOpenImage = () => {
    setOpenImage([{ uri: avatar }]);
    setIsOpenImage(true);
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
                'SUCCESS',
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



  const renderItem = ({ item }) => {
    return (
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.imageItem} activeOpacity={1}
          onPress={() => { _onPressOpenImage(item.URL) }}>
          <FastImage
            style={styles.imageItem}
            source={{
              uri: item.URL,
            }}
          />
        </TouchableOpacity>
        {/* <View style={styles.infoContainer}>
          <Text style={styles.infoText}>{item.CreatebyUser.toUpperCase()}</Text>
          {
            item.CreatebyUser.toUpperCase() === userLogin.toUpperCase()
              ?
              (<TouchableOpacity
                style={styles.infoAction}
                onPress={() => _onPressDeleteImage(item.Id)}>
                <Text style={styles.buttonTitleDark}>Delete</Text>
              </TouchableOpacity>)
              :
              (<TouchableOpacity
                style={styles.itemDisabled}
                disabled={true}>
                <Text style={styles.textDisabled}>Delete</Text>
              </TouchableOpacity>)
          }
        </View> */}
      </View>
    );
  };
  const renderItemUpload = ({ item }) => {
    return (
      <View style={styles.imageContainer} key={item.URL}>
        <View style={styles.imageItem} activeOpacity={1} key={item.URL}>
          <FastImage
            style={styles.imageItem}
            source={{
              uri: item.URL,
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getAvatar)} />
        :
        <View style={styles.container}>
          <View style={styles.headerContainer}>
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
          </View>

          <View style={styles.table}>
            <View style={styles.imageContainer}>
              <TouchableOpacity style={styles.imageItem} activeOpacity={1}
                onPress={() => { _onPressOpenImage() }}>
                <FastImage
                  style={styles.imageItem}
                  source={{
                    uri: avatar,
                  }}
                />
              </TouchableOpacity>
              {/* <View style={styles.infoContainer}>
                <Text style={styles.infoText}>{item.CreatebyUser.toUpperCase()}</Text>
                {
                  item.CreatebyUser.toUpperCase() === userLogin.toUpperCase()
                    ?
                    (<TouchableOpacity
                      style={styles.infoAction}
                      onPress={() => _onPressDeleteImage(item.Id)}>
                      <Text style={styles.buttonTitleDark}>Delete</Text>
                    </TouchableOpacity>)
                    :
                    (<TouchableOpacity
                      style={styles.itemDisabled}
                      disabled={true}>
                      <Text style={styles.textDisabled}>Delete</Text>
                    </TouchableOpacity>)
                }
              </View> */}
            </View>
          </View>

          {/* {
            avatar && avatar.length > 0
              ?
              <View style={styles.safeArea}>
                <VirtualizedList
                  style={styles.table}
                  data={avatar}
                  getItemCount={(data) => data.length}
                  getItem={(data, index) => {
                    return data[index];
                  }}
                  keyExtractor={item => item.Id}
                  renderItem={renderItem}
                />
              </View>
              :
              <ListEmptyData />
          } */}

          {/* <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.buttonUpload} onPress={_onPressAddImage}>
              <Text style={styles.buttonTitle}>Add Images</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      }
      {/* <Modal visible={isSelecting} animationType='slide'>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.safeArea}>
              <VirtualizedList
                style={styles.table}
                data={imageUploadList}
                getItemCount={(data) => data.length}
                getItem={(data, index) => {
                  return data[index];
                }}
                keyExtractor={item => item.URL}
                renderItem={renderItemUpload}
              />
            </View>
            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.buttonLeft} onPress={() => {
                setIsLoading(false);
                setIsSelecting(false);
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
                    <Text style={styles.buttonTitle}>Upload</Text>
                  </TouchableOpacity>
              }
            </View>
          </View>
        </SafeAreaView>
      </Modal> */}
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
    minHeight: 32,
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
    height: (SCREEN_WIDTH - 28),
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
  buttonUploadDisabled: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cccccc',
    borderColor: '#999999',
    borderWidth: 1,
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

export default QCWelderCardAvatarSceen;