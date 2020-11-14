import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Dimensions, Alert, Modal, ActivityIndicator } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-simple-toast';
import FastImage from 'react-native-fast-image';

import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';
import GetDrawingImageAPI from '../../apis/drawing/GetDrawingImageAPI';
import MessageAlert from '../../components/MessageAlert';
import LoadingRefresh from '../../components/LoadingRefresh';

export default ({ route }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
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
        setDrawingImageListUpload(imagesUpload);
        setIsSelecting(true);
      }).catch(() => {
        setIsLoading(false);
        setIsSelecting(false);
      });
  };

  const addFilesToBody = () => {
    const promises = drawingImageListUpload.map(async (image) => {
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
              setIsLoading(false);
              setIsSelecting(false);
              setIsUploading(false);
              Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
              callAPI(getDrawingImage);
            } else {
              Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
              setIsLoading(false);
              setIsError(true);
              setIsUploading(false);
            }
          })
          .catch(() => {
            Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
            setIsLoading(false);
            setIsError(true);
            setIsUploading(false);
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
      <Modal visible={isSelecting} animationType='slide'>
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
              {isUploading
                ?
                <TouchableOpacity style={styles.buttonLeft}>
                  <ActivityIndicator size='small' color={OPP_COLOR} />
                </TouchableOpacity>
                :
                <TouchableOpacity style={styles.buttonLeft} onPress={_onPressUploadImage}>
                  <Text style={styles.buttonTitle}>Upload Pictures</Text>
                </TouchableOpacity>}
              <TouchableOpacity style={styles.buttonRight} onPress={() => { setIsLoading(false), setIsSelecting(false) }}>
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
  imageContainer: {
    width: SCREEN_WIDTH - 28,
    height: (SCREEN_WIDTH - 28) * 9 / 16,
    marginBottom: 8,
    padding: 1,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageItem: {
    width: '100%',
    height: '100%',
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
});