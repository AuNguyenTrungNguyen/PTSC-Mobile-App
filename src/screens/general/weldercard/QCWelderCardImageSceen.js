import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Alert, Modal, ActivityIndicator, PermissionsAndroid, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import ImagePicker from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-simple-toast';
import FastImage from 'react-native-fast-image';
import ImageView from 'react-native-image-viewing';
import CameraRoll from '@react-native-community/cameraroll';


import { Port_Server } from '../../../utils/Core';
import {
  GetObservationImageAPI,
  DeleteObservationImageAPI,
  EditObservationImageAPI
} from '../../../apis/qa/QAAPI';

import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';

import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';

const QCWelderCardImageSceen = ({ route, navigation }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState('');
  const [imageUpload, setImageUpload] = useState('');

  const { welderId, welderName } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
            onPress={_onPressUploadImage}>
            {
              imageUpload
                ?
                <Ionicons
                  size={24}
                  name={'md-save-outline'} color={BASE_COLOR} />
                :
                null
            }
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, imageUpload]);

  useEffect(
    () => {
      // callAPI(getImage);
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
    // TODO
    const token = await Helper.getData('TOKEN');
    setImage('');
    // GetObservationImageAPI(welderId, token)
    //   .then(res => {
    //     if (res.success) {
    //       setImageList(res.data);
    //       setIsLoading(false);
    //       setIsError(false);
    //     } else {
    //       setIsLoading(false);
    //       setIsError(true);
    //     }
    //   })
    //   .catch(() => {
    //     setIsLoading(false);
    //     setIsError(true);
    //   });
  };

  //-- Actions
  const _onPressChangeImage = () => {
    Alert.alert(
      'Change Image',
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
  const _onPressDeleteImage = async id => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image',
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
    // TODO
    const token = await Helper.getData('TOKEN');
    setImage('');
    setImageUpload('');
    // DeleteObservationImageAPI(id, token)
    //   .then(res => {
    //     Toast.show(res.Message.toString(), Toast.SHORT);
    //     if (res.success) {
    //       let array = imageList.filter(image => image.id !== id);
    //       setImageList(array);
    //     }
    //   }).catch(() => {
    //     Toast.show('Please check that you are using the company network!', Toast.SHORT);
    //   });
  }

  //-- Upload
  const _onPressOpenGallery = () => {
    ImagePicker.openPicker({
      multiple: false,
    }).then(image => {
      setImageUpload(image.path);
    }).catch(() => {
    });
  };
  const _onPressOpenCamera = () => {
    ImagePicker.openCamera({
      cropping: false,
    })
      .then(image => {
        setImageUpload(image.path);
      }).catch(() => {
      });
  };

  const _onPressUploadImage = async () => {
    // TODO
    const token = await Helper.getData('TOKEN');
    setImage(imageUpload);
    setImageUpload('');
    // setIsUploading(true);
    // let body = [
    //   // { name: 'dataCode', data: dataCode },
    //   // { name: 'username', data: userLogin },
    //   // { name: 'projectCode', data: projectCode },
    //   // { name: 'rowIndex', data: rowIndex.toString() },
    //   { name: 'id', data: welderId },
    // ];

    // addFilesToBody()
    //   .then(res => {
    //     body = body.concat(res);
    //     RNFetchBlob.fetch(
    //       'POST',
    //       Port_Server + '/api/QA/UploadObservationImage',
    //       {
    //         'Authorization': 'Bearer ' + token,
    //         'Content-Type': 'multipart/form-data',
    //       },
    //       body,
    //     )
    //       .then(res => {
    //         res = JSON.parse(res.data);
    //         if (res.success) {
    //           setImageUpload('');
    //           setIsLoading(false);
    //           setIsLoading(false);
    //           setIsSelecting(false);
    //           setIsUploading(false);
    //           Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
    //         } else {
    //           Toast.show('Please check that you are using the company network!', Toast.SHORT);
    //           setIsLoading(false);
    //           setIsError(true);
    //           setIsUploading(false);
    //         }
    //       })
    //       .catch(() => {
    //         Toast.show('Please check that you are using the company network!', Toast.SHORT);
    //         setIsLoading(false);
    //         setIsError(true);
    //         setIsUploading(false);
    //       });
    //   });
  };
  const addFilesToBody = () => {
    // const promises = imageUpload.map(async (image) => {
    //   return await ImageResizer.createResizedImage(image.uri, 900, 450, 'PNG', 0)
    //     .then(res => {
    //       let file = {
    //         name: 'file',
    //         filename: res.name,
    //         data: RNFetchBlob.wrap(res.path),
    //       }
    //       return file;
    //     });
    // });
    // return Promise.all(promises);
  };

  //-- Open
  /* const [isOpenImage, setIsOpenImage] = useState(false);
  const [openImage, setOpenImage] = useState([]);
  const _onPressOpenImage = uri => {
    setOpenImage([{ uri: uri }]);
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
  }; */



  const WelderImage = () => (
    <View style={styles.noDataContainer}>
      <View style={styles.imageContainer}>
        {image || imageUpload
          ?
          <FastImage
            style={styles.imageItem}
            source={{
              uri: image ? image : imageUpload,
              priority: FastImage.priority.normal,
            }}
          />
          :
          <Ionicons
            size={96}
            name={'md-person-circle-outline'} color={BASE_COLOR} />
        }
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getImage)} />
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

          <WelderImage />

          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.buttonLeft} onPress={_onPressChangeImage}>
              <Text style={styles.buttonTitle}>Change</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonRight} onPress={_onPressDeleteImage}>
              <Text style={styles.buttonTitle}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      {/* <ImageView
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
                    <Text style={styles.buttonTitleDark}>Save Image</Text>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            );
          }
        }
      /> */}
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
    width: '100%',
    height: '100%',
    borderColor: BASE_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageItem: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  idText: {
    flex: 1,
    textAlign: 'center',
    color: BASE_COLOR,
    fontWeight: 'bold',
    marginTop: 4,
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

export default QCWelderCardImageSceen;