import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Appearance } from 'react-native';
import Toast from 'react-native-simple-toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';
import AwesomeAlert from 'react-native-awesome-alerts';

import { GetDimCheckDetailAPI, UpdateDimCheckDetailAPI } from '../../../apis/structural/DimCheckAPI';

import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';
import Constant from '../../../utils/Constant';
import Header from '../../../components/Header';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';

const DimCheckDetailScreen = ({ route, navigation }) => {

  const { projectCode, subContractor, userLogin, rowIndex, drawingNo, link, jointNo, pieceNo1, pieceNo2, result01, result02 } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [pieceMark01, setPieceMark01] = useState({});
  const [pieceMark02, setPieceMark02] = useState({});

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });

  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}
            onPress={toggle}>
            <Ionicons
              size={24}
              name={isShowDescription.name} color={iconColor} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, isShowDescription]);

  useEffect(
    () => {
      callAPI(getDimCheckDetail);
    }, []
  );

  const toggle = () => {
    setIsShowDescription(prevState => {
      return {
        show: !prevState.show,
        name: prevState.name === 'arrow-up-circle-outline' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'
      }
    });
  };

  const callAPI = (executedAPI, showUI = false) => {
    if (!showUI) {
      setIsLoading(true);
    }
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

  const getDimCheckDetail = async () => {
    let token = await Helper.getData('TOKEN');
    GetDimCheckDetailAPI(projectCode, pieceNo1, pieceNo2, token)
      .then(res => {
        if (res.success) {
          let model01 = res.dataPieceMark01;
          model01.DIM_BeforeWeldResult = result01;
          setPieceMark01(model01);
          let model02 = res.dataPieceMark02;
          model02.DIM_BeforeWeldResult = result02;
          setPieceMark02(model02);
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

  const updateDimCheckDetail = async () => {
    let token = await Helper.getData('TOKEN');
    const weldMap = {
      RowIndex: rowIndex,
    };
    setIsUploading(true);
    UpdateDimCheckDetailAPI(weldMap, pieceMark01, pieceMark02, userLogin, token)
      .then(res => {
        if (res.success) {
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
        } else {
          Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        }
        setIsUploading(false);
      }).catch(() => {
        Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        setIsUploading(false);
      });
  };

  const _onPressChangeResult01 = result => {
    let model = { ...pieceMark01 };
    model.DIM_BeforeWeldResult = result;
    setPieceMark01(model);
  };

  const _onPressChangeResult02 = result => {
    let model = { ...pieceMark02 };
    model.DIM_BeforeWeldResult = result;
    setPieceMark02(model);
  };

  const _onPressSubmitToServer = async () => {
    callAPI(updateDimCheckDetail, true);
  };

  const _onPressManagePicture = async (item, pieceMarkNo) => {
    const dataCode = await Helper.getData('DATACODE');
    navigation.navigate(
      'DimCheckImage',
      {
        projectCode: projectCode,
        userLogin: userLogin,
        dataCode: dataCode,
        rowIndex: item.RowIndex,
        drawingNo: drawingNo,
        jointNo: jointNo,
        pieceMarkNo: pieceMarkNo,
      }
    );
  };





  const RenderDimCheckDetail = () => {
    return (
      <View style={styles.table}>
        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>PieceNo1:</Text>
            <Text style={styles.cellData}>{pieceNo1}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>PMDrawingNo:</Text>
            <Text style={styles.cellData}>{Formater.formatEmptyData(pieceMark01.PieceMarkDrawingNo)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>CSDrawingNo:</Text>
            <Text style={styles.cellData}>{Formater.formatEmptyData(pieceMark01.CuttingSheetDrawingNo)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>HeatNo:</Text>
            <Text style={styles.cellData}>{Formater.formatEmptyData(pieceMark01.HeatNo_TagNo)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>TraceNo:</Text>
            <Text style={styles.cellData}>{Formater.formatEmptyData(pieceMark01.TraceNo)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>Result:</Text>
            {
              pieceMark01.DIM_BeforeWeldResult
                ?
                pieceMark01.DIM_BeforeWeldResult == Constant.STATUS_ACCEPT
                  ?
                  <Text style={[styles.cellData, styles.labelAccept]}>{pieceMark01.DIM_BeforeWeldResult}</Text>
                  :
                  <Text style={[styles.cellData, styles.labelReject]}>{pieceMark01.DIM_BeforeWeldResult}</Text>
                :
                <Text style={styles.cellData}>{Formater.formatEmptyData(pieceMark01.DIM_BeforeWeldResult)}</Text>
            }
          </View>
          <View style={styles.row}>
            <View style={styles.cellAction}>
              <TouchableOpacity
                style={styles.buttonAccept}
                onPress={() => _onPressChangeResult01(Constant.STATUS_ACCEPT)}>
                <Text style={styles.labelAccept}>Accept</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cellAction}>
              <TouchableOpacity
                style={styles.buttonReject}
                onPress={() => _onPressChangeResult01(Constant.STATUS_REJECT)}>
                <Text style={styles.labelReject}>Reject</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cellAction}>
              <TouchableOpacity
                style={styles.buttonImage}
                onPress={() => { _onPressManagePicture(pieceMark01, pieceNo1) }}>
                <Text style={styles.labelImage}>Picture</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>PieceNo2:</Text>
            <Text style={styles.cellData}>{pieceNo2}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>PMDrawingNo:</Text>
            <Text style={styles.cellData}>{Formater.formatEmptyData(pieceMark02.PieceMarkDrawingNo)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>CSDrawingNo:</Text>
            <Text style={styles.cellData}>{Formater.formatEmptyData(pieceMark02.CuttingSheetDrawingNo)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>HeatNo:</Text>
            <Text style={styles.cellData}>{Formater.formatEmptyData(pieceMark02.HeatNo_TagNo)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>TraceNo:</Text>
            <Text style={styles.cellData}>{Formater.formatEmptyData(pieceMark02.TraceNo)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>Result:</Text>
            {
              pieceMark02.DIM_BeforeWeldResult
                ?
                pieceMark02.DIM_BeforeWeldResult == Constant.STATUS_ACCEPT
                  ?
                  <Text style={[styles.cellData, styles.labelAccept]}>{pieceMark02.DIM_BeforeWeldResult}</Text>
                  :
                  <Text style={[styles.cellData, styles.labelReject]}>{pieceMark02.DIM_BeforeWeldResult}</Text>
                :
                <Text style={styles.cellData}>{Formater.formatEmptyData(pieceMark02.DIM_BeforeWeldResult)}</Text>
            }
          </View>
          <View style={styles.row}>
            <View style={styles.cellAction}>
              <TouchableOpacity
                style={styles.buttonAccept}
                onPress={() => _onPressChangeResult02(Constant.STATUS_ACCEPT)}>
                <Text style={styles.labelAccept}>Accept</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cellAction}>
              <TouchableOpacity
                style={styles.buttonReject}
                onPress={() => _onPressChangeResult02(Constant.STATUS_REJECT)}>
                <Text style={styles.labelReject}>Reject</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cellAction}>
              <TouchableOpacity
                style={styles.buttonImage}
                onPress={() => { _onPressManagePicture(pieceMark02, pieceNo2) }}>
                <Text style={styles.labelImage}>Picture</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.buttonAction} onPress={_onPressSubmitToServer}>
            <Text style={styles.buttonTitle}>Submit to Server</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const headerData = {
    'Project': projectCode + '  -  ' + subContractor,
    'UserLogin': userLogin,
    'DrawingNo': { 'DrawingNo': drawingNo, 'Link': link },
    'JointNo': jointNo,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => { callAPI(getDimCheckDetail) }} />
        :
        <View style={styles.container}>
          {
            isShowDescription.show &&
            <Header data={headerData} />
          }
          <RenderDimCheckDetail />
        </View>
      }
      <AwesomeAlert
        show={isUploading}
        showProgress={true}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
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
    height: 36,
    marginBottom: 4,
  },
  infoTitle: {
    flex: 3,
  },
  infoData: {
    flex: 7,
    fontWeight: 'bold',
    color: BASE_COLOR,
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
    padding: 4,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 20,
    marginBottom: 4,
  },
  cellTitle: {
    flex: 3,
  },
  cellData: {
    flex: 7,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  cellAction: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
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
  buttonImage: {
    width: 70,
    borderColor: 'darkblue',
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelImage: {
    color: 'darkblue',
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
});

export default DimCheckDetailScreen;