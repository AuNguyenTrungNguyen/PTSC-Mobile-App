import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance } from 'react-native';
import Moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';
import AwesomeAlert from 'react-native-awesome-alerts';
import Dialog from "react-native-dialog";

import Networker from '../../../utils/Networker';
import Constant from '../../../utils/Constant';
import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';

import { GetFlangeJointDetailAPI, UpdateFlangeJointDetailAPI } from '../../../apis/flange/FlangeAPI';

import LoadingRefresh from '../../../components/LoadingRefresh';
import Header from '../../../components/Header';
import { ListLoadingData, ListEmptyData } from '../../../components/HelperUI';
import SelectPopup from '../../../components/SelectPopup';

const FlangeJointProgressDetailScreen = ({ route, navigation }) => {

  const { projectCode, facilityCode, lineNo, sheet, userLogin } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [detailList, setDetailList] = useState(null);
  const [updateList, setUpdateList] = useState([]);

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(
    () => {
      navigation.setOptions({
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
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
    }, [navigation, isShowDescription]
  );
  const toggle = () => {
    setIsShowDescription(prevState => {
      return {
        show: !prevState.show,
        name: prevState.name === 'arrow-up-circle-outline' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'
      }
    });
  };
  const callAPI = executedAPI => {
    setIsLoading(false);
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true) });
  };

  useEffect(
    () => {
      callAPI(getDetailList);
    }, []
  );

  //-- Get Data
  const getDetailList = () => {
    GetFlangeJointDetailAPI(projectCode, facilityCode, lineNo, sheet)
      .then(res => {
        if (res.Success) {
          setDetailList(res.Data);
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

  //-- Submit Data
  const checkConstructionDetail = () => {
    let messages = [];
    // if (code == Constant.CODE_FITUP) {
    //   updateList.map(item => {
    //     const date = item['FittingDate'];
    //     const heat01 = item['Heat01'];
    //     const heat02 = item['Heat02'];
    //     const batchNo = item['AdhesiveBatchNo'];
    //     const ENVHum = item['ENVHumidity'];
    //     const ENVTemp = item['ENVTemp'];
    //     const ActualInsertionDepth = item['ActualInsertionDepth'];

    //     if ((date && heat01 && heat02 && batchNo && ENVHum && ENVTemp)
    //       || (!date && !heat01 && !heat02 && !batchNo && !ENVHum && !ENVTemp && !ActualInsertionDepth)
    //     ) {
    //       return item;
    //     }

    //     const keys = Object.keys(item);
    //     const column = keys.filter(i => (i !== 'RowIndex' && i !== 'Id'));
    //     const objIndex = detailList.findIndex(obj => obj.RowIndex == item.RowIndex);
    //     const oldItem = detailList[objIndex];

    //     if ((column.indexOf('FittingDate') >= 0 && !date) || (column.indexOf('FittingDate') < 0 && !oldItem['FittingDate'])) {
    //       messages.push('Date');
    //     }
    //     if ((column.indexOf('Heat01') >= 0 && !heat01) || (column.indexOf('Heat01') < 0 && !oldItem['Heat01'])) {
    //       messages.push('HeatNo01');
    //     }
    //     if ((column.indexOf('Heat02') >= 0 && !heat02) || (column.indexOf('Heat02') < 0 && !oldItem['Heat02'])) {
    //       messages.push('Heat02');
    //     }
    //     if ((column.indexOf('AdhesiveBatchNo') >= 0 && !batchNo) || (column.indexOf('AdhesiveBatchNo') < 0 && !oldItem['AdhesiveBatchNo'])) {
    //       messages.push('Method');
    //     }
    //     if ((column.indexOf('ENVHumidity') >= 0 && !ENVHum) || (column.indexOf('ENVHumidity') < 0 && !oldItem['ENVHumidity'])) {
    //       messages.push('ENVHum');
    //     }
    //     if ((column.indexOf('ENVTemp') >= 0 && !ENVTemp) || (column.indexOf('ENVTemp') < 0 && !oldItem['ENVTemp'])) {
    //       messages.push('ENVTemp');
    //     }
    //     if ((column.indexOf('ActualInsertionDepth') >= 0 && !ActualInsertionDepth) || (column.indexOf('ActualInsertionDepth') < 0 && !oldItem['ActualInsertionDepth'])) {
    //       messages.push('ActualInsertionDepth');
    //     }
    //     return item;
    //   });
    // }
    // else {
    //   updateList.map(item => {
    //     const startTime = item['CuringStartTime'];
    //     const endTime = item['CuringEndTime'];
    //     const bonderID = item['BonderID'];
    //     const Lubricant = item['Lubricant'];

    //     if ((startTime && endTime && bonderID && Lubricant)
    //       || (!startTime && !endTime && !bonderID && !Lubricant)) {
    //       return item;
    //     }

    //     const keys = Object.keys(item);
    //     const column = keys.filter(i => (i !== 'RowIndex' && i !== 'Id'));
    //     const objIndex = detailList.findIndex(obj => obj.RowIndex == item.RowIndex);
    //     const oldItem = detailList[objIndex];

    //     if ((column.indexOf('CuringStartTime') >= 0 && !startTime) || (column.indexOf('CuringStartTime') < 0 && !oldItem['CuringStartTime'])) {
    //       messages.push('CuringStartTime');
    //     }
    //     if ((column.indexOf('CuringEndTime') >= 0 && !endTime) || (column.indexOf('CuringEndTime') < 0 && !oldItem['CuringEndTime'])) {
    //       messages.push('CuringEndTime');
    //     }
    //     if ((column.indexOf('BonderID') >= 0 && !bonderID) || (column.indexOf('BonderID') < 0 && !oldItem['BonderID'])) {
    //       messages.push('BonderID');
    //     }
    //     if ((column.indexOf('Lubricant') >= 0 && !Lubricant) || (column.indexOf('Lubricant') < 0 && !oldItem['Lubricant'])) {
    //       messages.push('Lubricant');
    //     }
    //     return item;
    //   });
    // }
    return messages;
  };
  const updateDetailList = async () => {
    const listUpdate = Helper.handleListUpdate(updateList);
    setIsUploading(true);
    UpdateFlangeJointDetailAPI(projectCode, facilityCode, userLogin, listUpdate)
      .then(res => {
        if (res.Success) {
          setUpdateList([]);
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
  const _onPressSubmitToServer = async () => {
    // let error = [];
    if (updateList.length) {
      // error = checkConstructionDetail();
      // if (error.length) {
      //   let uniqueError = [];
      //   uniqueError = [...new Set(error)];
      //   MessageAlert('ERROR', '\nPlesase enter: ' + uniqueError.join(', '));
      //   return;
      // }
      callAPI(updateDetailList);
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
  };

  //-- Update Local Data
  const [indexUpdate, setIndexUpdate] = useState(-1);
  const [keyUpdate, setKeyUpdate] = useState('');
  const onChangeData = (data, localIndex = indexUpdate, localKey = keyUpdate) => {
    let array = [...detailList];
    array[localIndex][localKey] = data;
    setDetailList(array);

    array = [...updateList];
    const rowIndex = detailList[localIndex].RowIndex;
    const objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      array.push({ RowIndex: rowIndex, [localKey]: data });
    } else {
      array[objIndex][localKey] = detailList[localIndex][localKey];
    }
    setUpdateList(array);
  };

  //-- Date
  const [isVisibleDate, setIsVisibleDate] = useState(false);
  const [dateDisplay, setDateDisplay] = useState(new Date());
  const _onPressSelectDate = (value, index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    if (value) {
      setDateDisplay(new Date(Moment(value).format("YYYY-MM-DDT00:00:00")));
    } else {
      setDateDisplay(new Date());
    }
    setIsVisibleDate(true);
  };
  const _onChangeDate = selectedDate => {
    if (selectedDate != undefined) {
      const value = Formater.formatDateZero(selectedDate);
      onChangeData(value);
    }
    setIsVisibleDate(false);
  };

  //-- Clear
  const _onPressClear = (index) => {
    const valueClear = null;

    let array = [...detailList];
    array[index]['RequestToQCDate'] = valueClear;
    array[index]['TightenedDate'] = valueClear;

    array[index]['Method'] = valueClear;
    array[index]['Lubrication'] = valueClear;
    array[index]['ToolSerialNo'] = valueClear;
    setDetailList(array);

    array = [...updateList];
    const rowIndex = detailList[index].RowIndex;
    const objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      array.push({
        RowIndex: rowIndex,
        ['RequestToQCDate']: valueClear,
        ['TightenedDate']: valueClear,

        ['Method']: valueClear,
        ['Lubrication']: valueClear,
        ['ToolSerialNo']: valueClear,
      });
    } else {
      array[objIndex]['RequestToQCDate'] = valueClear;
      array[objIndex]['TightenedDate'] = valueClear;

      array[objIndex]['Method'] = valueClear;
      array[objIndex]['Lubrication'] = valueClear;
      array[objIndex]['ToolSerialNo'] = valueClear;
    }
    setUpdateList(array);
  };
  //-- Image
  const _onPressImage = async item => {
    navigation.navigate(Constant.ROUTE__COMMON, {
      screen: 'Image',
      params: {
        userLogin: userLogin,
        projectCode: projectCode,
        rowIndex: item.RowIndex,
        jointNo: item.FlangeJointNos,
        type: Constant.IMAGE_TYPE_FLANGE,
        title: 'Flange Image'
      }
    });
  };

  //-- Render Header
  const headerData = {
    'Project': projectCode,
    'Facility': facilityCode,
    'LineNo': lineNo,
    'Sheet': sheet,
    'UserLogin': userLogin,
  };

  //-- Render Detail
  const RenderDetail = () => {
    {
      if (detailList == null) {
        return <ListLoadingData />
      } else if (!detailList.length) {
        return <ListEmptyData />
      }
    }
  };
  const renderItem = ({ index, item }) => {
    return (
      <View style={styles.box} key={item.RowIndex}>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
          </View>
          <View style={styles.cellData}>
            <TouchableOpacity
              style={styles.itemAction}
              onPress={() => _onPressImage(item)}>
              <Text style={styles.itemText}>Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.itemAction}
              onPress={() => _onPressClear(index)}>
              <Text style={styles.itemText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text style={styles.titleBaseText}>{'Flange\nJoint:'}</Text>
          </View>
          <View style={styles.cellTitle}>
            <Text style={styles.textBlue}>{Formater.formatEmptyData(item.FlangeJointNo)}</Text>
          </View>
          <View style={styles.cellTitle}>
            <Text style={styles.titleBaseText}>{'Torque:'}</Text>
          </View>
          <View style={styles.cellTitle}>
            <Text style={styles.textBlue}>
              {
                !item.Torque
                  ?
                  Formater.formatEmptyData(item.Torque)
                  :
                  Formater.formatTwoDigits(item.Torque)
              }
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text style={styles.titleRedText}>{'RequestToQC\nDate'}:</Text>
          </View>
          <View style={styles.cellData}>
            <Text style={styles.textData}>{Formater.formatDateData(item.RequestToQCDate)}</Text>
            <TouchableOpacity onPress={() => _onPressSelectDate(item.RequestToQCDate, index, 'RequestToQCDate')}>
              <AntDesignIcon style={styles.iconAction} name='clockcircleo' size={20} color={BASE_COLOR} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text style={styles.titleRedText}>{'Tightened\nDate'}:</Text>
          </View>
          <View style={styles.cellData}>
            <Text style={styles.textData}>{Formater.formatDateData(item.TightenedDate)}</Text>
            <TouchableOpacity onPress={() => _onPressSelectDate(item.TightenedDate, index, 'TightenedDate')}>
              <AntDesignIcon style={styles.iconAction} name='clockcircleo' size={20} color={BASE_COLOR} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text style={styles.redText}>Method:</Text>
          </View>
          <View style={styles.cellData}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.Method)}</Text>
            <TouchableOpacity onPress={() => { _onPressShowMethodPopup(index, 'Method') }}>
              <Ionicons style={styles.iconAction} name='md-list' size={20} color={BASE_COLOR} />
            </TouchableOpacity>
          </View>
          <View style={styles.cellPercent} />
        </View>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text style={styles.redText}>Lubricant:</Text>
          </View>
          <View style={styles.cellData}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.Lubrication)}</Text>
            <TouchableOpacity onPress={() => { _onPressShowLubricantPopup(index, 'Lubrication') }}>
              <Ionicons style={styles.iconAction} name='md-list' size={20} color={BASE_COLOR} />
            </TouchableOpacity>
          </View>
          <View style={styles.cellPercent} />
        </View>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text style={styles.redText}>ToolSerialNo:</Text>
          </View>
          <View style={styles.cellData}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.ToolSerialNo)}</Text>
            <TouchableOpacity onPress={() => _onPressSelectText(item.ToolSerialNo, index, 'ToolSerialNo')}>
              <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  //-- Method
  const [isVisibleMethod, setIsVisibleMethod] = useState(false);
  const _onPressShowMethodPopup = (index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    setIsVisibleMethod(true);
  };
  const _onPressClearMethod = () => {
    onChangeMethod(null);
    setIsVisibleMethod(false);
  };
  const onChangeMethod = data => {
    onChangeData(data);
    setIsVisibleMethod(false);
  };

  //-- Lubricant
  const [isVisibleLubricant, setIsVisibleLubricant] = useState(false);
  const _onPressShowLubricantPopup = (index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    setIsVisibleLubricant(true);
  };
  const _onPressClearLubricant = () => {
    onChangeLubricant(null);
    setIsVisibleLubricant(false);
  };
  const onChangeLubricant = data => {
    onChangeData(data);
    setIsVisibleLubricant(false);
  };

  //-- ToolSerialNo
  const [isVisibleText, setIsVisibleText] = useState(false);
  const [textDisplay, setTextDisplay] = useState('');
  const _onPressSelectText = (value, index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    if (value) {
      setTextDisplay(value.toString());
    } else {
      setTextDisplay('');
    }
    setIsVisibleText(true);
  };
  const _onChangeText = () => {
    const text = textDisplay.trim();
    setTextDisplay(text);
    onChangeData(text);
    setIsVisibleText(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getDetailList)} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show &&
              <Header data={headerData} />
            }
            {
              detailList && detailList.length
                ?
                <>
                  <VirtualizedList
                    style={styles.table}
                    data={detailList}
                    getItemCount={data => data.length}
                    getItem={(data, index) => {
                      return data[index];
                    }}
                    keyExtractor={(item, index) => index}
                    renderItem={renderItem}
                  />
                </>
                :
                <RenderDetail />
            }
            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.button} onPress={_onPressSubmitToServer}>
                <Text style={styles.buttonTitle}>Submit to Server</Text>
              </TouchableOpacity>
            </View>
          </View>
      }
      <AwesomeAlert
        progressColor={BASE_COLOR}
        show={isUploading}
        showProgress={true}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
      />
      <DateTimePickerModal
        isVisible={isVisibleDate}
        headerTextIOS={'Update ' + keyUpdate + ':'}
        date={dateDisplay}
        mode={'date'}
        onConfirm={_onChangeDate}
        onCancel={() => { setIsVisibleDate(false) }}
      />

      <SelectPopup
        visible={isVisibleMethod}
        data={['Hand', 'Hydraulic', 'Tensional_2part', 'Tensional_4part']}
        onChangeItem={onChangeMethod}
        onCancel={() => setIsVisibleMethod(false)}
        onClear={_onPressClearMethod}
      />
      <SelectPopup
        visible={isVisibleLubricant}
        data={['Molykote-P1000', 'N/A']}
        onChangeItem={onChangeLubricant}
        onCancel={() => setIsVisibleLubricant(false)}
        onClear={_onPressClearLubricant} />

      <Dialog.Container visible={isVisibleText}>
        <Dialog.Title>{'Update ' + keyUpdate + ':'}</Dialog.Title>
        <Dialog.Input
          value={textDisplay}
          placeholder={'Enter ' + keyUpdate}
          onChangeText={(text) => setTextDisplay(text)}
          underlineColorAndroid={BASE_COLOR}
        />
        <Dialog.Button label='Cancel' onPress={() => { setIsVisibleText(false) }} />
        <Dialog.Button label='OK' onPress={_onChangeText} />
      </Dialog.Container>
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
    margin: 4,
    minHeight: 20,
  },
  itemAction: {
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    marginLeft: 12,
  },
  itemText: {
    color: BASE_COLOR,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },

  cellTitle: {
    flex: 1,
    justifyContent: 'center',
  },
  cellData: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },


  titleBaseText: {
    color: BASE_COLOR,
  },
  titleRedText: {
    color: 'red',
  },
  textBlue: {
    fontWeight: 'bold',
    color: 'blue',
  },
  textData: {
    fontWeight: 'bold',
    color: 'green',
  },
  iconAction: {
    marginLeft: 4,
    width: 20,
    height: 20,
  },

  actionContainer: {
    marginTop: 12,
    height: 36,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
    marginLeft: 4,
  },
  buttonTitle: {
    color: OPP_COLOR,
  },
});

export default FlangeJointProgressDetailScreen;