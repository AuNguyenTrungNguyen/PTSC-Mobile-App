import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Image, Dimensions, Alert, Modal } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-simple-toast';

import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';
import GetDrawingImageAPI from '../../apis/drawing/GetDrawingImageAPI';
import MessageAlert from '../../components/MessageAlert';
import LoadingRefresh from '../../components/LoadingRefresh';

export default ({ route }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [drawingImageList, setDrawingImageList] = useState([]);
  const [drawingImageListUpload, setDrawingImageListUpload] = useState([]);

  const { projectCode, facilityCode, drawingNo, code } = route.params;

  useEffect(
    () => {
      callAPI(getDrawingImage);
    }, []
  );

  const callAPI = executedAPI => {
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

  const getDrawingImage = async () => {
    let token = await Helper.getData('TOKEN');
    GetDrawingImageAPI(projectCode, facilityCode, drawingNo, code, token)
      .then(res => {
        if (res.success) {
          setDrawingImageList(res.data);
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
      'Add Drawig Picture',
      'Please select a option',
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
      setDrawingImageListUpload(imagesUpload);
      setIsUploading(true);
    }).catch(() => {
      setIsLoading(false);
      setIsUploading(false);
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
        setDrawingImageListUpload(imagesUpload);
        setIsUploading(true);
      }).catch(() => {
        setIsLoading(false);
        setIsUploading(false);
      });
  };

  const addFilesToBody = () => {
    const promises = drawingImageListUpload.map(async (image) => {
      return await ImageResizer.createResizedImage(image.uri, 800, 600, 'PNG', 0)
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

    let token = await Helper.getData('TOKEN');
    let username = await Helper.getData('USERNAME');
    let dataCode = await Helper.getData('DATACODE');

    let body = [
      { name: 'projectCode', data: projectCode },
      { name: 'facilityCode', data: facilityCode },
      { name: 'drawingNo', data: drawingNo },
      { name: 'code', data: code },
      { name: 'username', data: username },
      { name: 'dataCode', data: dataCode },
    ];

    addFilesToBody()
      .then(res => {
        body = body.concat(res);
        RNFetchBlob.fetch(
          'POST',
          Port_Server + '/api/Drawing/UploadDrawingImage',
          {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'multipart/form-data',
          },
          body,
        )
          .then(res => {
            res = JSON.parse(res.data);
            if (res.success) {
              setDrawingImageListUpload([]);
              setIsLoading(false);
              setIsUploading(false);
              Toast.show(res.Message, Toast.SHORT, ['RCTModalHostViewController']);
              callAPI(getDrawingImage);
            } else {
              Toast.show(res.Message, Toast.SHORT);
            }
          })
          .catch((error) => {
            Toast.show(error.toString(), Toast.SHORT);
          });
      });
  };

  const ListEmptyData = () => (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataTitle}>No have any picture</Text>
    </View>
  );

  const renderItem = ({ item }) => {
    return (
      <Image
        style={styles.imageItem}
        source={{
          uri: item.uri,
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getDrawingImage)} />
        :
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.rowInfo}>
              <Text style={styles.infoTitle}>DrawingNo:</Text>
              <View style={styles.infoDataLine}>
                <Text style={styles.infoData}>{drawingNo}</Text>
              </View>
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.infoTitle}>Type:</Text>
              <View style={styles.infoDataLine}>
                <Text style={styles.infoData}>{code}</Text>
              </View>
            </View>
          </View>
          {
            drawingImageList.length
              ?
              <View style={styles.safeArea}>
                <VirtualizedList
                  style={styles.table}
                  data={drawingImageList}
                  getItemCount={(data) => data.length}
                  getItem={(data, index) => {
                    return data[index];
                  }}
                  keyExtractor={(index) => {
                    return index;
                  }}
                  renderItem={renderItem}
                />
              </View>
              :
              <ListEmptyData />
          }
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.buttonUpload} onPress={_onPressAddImage}>
              <Text style={styles.buttonTitle}>Add Pictures</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      <Modal visible={isUploading} animationType='slide'>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.safeArea}>
              <VirtualizedList
                style={styles.table}
                data={drawingImageListUpload}
                getItemCount={(data) => data.length}
                getItem={(data, index) => {
                  return data[index];
                }}
                keyExtractor={(index) => {
                  return index;
                }}
                renderItem={renderItem}
              />
            </View>
            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.buttonLeft} onPress={_onPressUploadImage}>
                <Text style={styles.buttonTitle}>Upload Pictures</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonRight} onPress={() => { setIsLoading(false), setIsUploading(false) }}>
                <Text style={styles.buttonTitle}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
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
    padding: 16,
    flex: 1,
    backgroundColor: OPP_COLOR,
  },

  headerContainer: {
    marginBottom: 4,
  },
  rowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    marginBottom: 4,
  },
  infoTitle: {
    flex: 4,
  },
  infoDataLine: {
    flex: 6,
    borderColor: BASE_COLOR,
    borderBottomWidth: 1,
  },
  infoData: {
    color: BASE_COLOR,
  },

  table: {
    flexGrow: 0,
    borderColor: BASE_COLOR,
    borderWidth: 2,
    backgroundColor: OPP_COLOR,
  },
  imageItem: {
    width: SCREEN_WIDTH - 32 - 16,
    height: (SCREEN_WIDTH - 32 - 16) * 0.75,
    margin: 4,
    borderColor: BASE_COLOR,
    borderWidth: 2,
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
    marginTop: 8,
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
});