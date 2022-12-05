import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Toast from 'react-native-simple-toast';

import { GetTimeSheetWorkOrderListAPI } from '../../../apis/timesheet/TimeSheetAPI';
import { GetProjectListAPI } from '../../../apis/app/LoginAPI';
import { GetManHoursImpactListAPI, DeleteManHoursImpactAPI } from '../../../apis/general/GeneralAPI';

import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';
import Networker from '../../../utils/Networker';
import CoreStyle from '../../../utils/CoreStyle';

import SelectPopup from '../../../components/SelectPopup';
import SelectPopupTimeSheet from '../../../components/timesheet/SelectPopupTimeSheet';
import { ListEmptyData } from '../../../components/HelperUI';
import LoadingRefresh from '../../../components/LoadingRefresh';
import MessageAlert from '../../../components/MessageAlert';

const ManHoursImpactListScreen = ({ route, navigation }) => {

  const { projectCode, userLogin } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [impactList, setImpactList] = useState([]);

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

  const callAPI = (executedAPI, loading = true) => {
    if (loading) {
      setIsLoading(true);
    }
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true) });
  };

  useEffect(
    async () => {
      callAPI(getProjectList);
      callAPI(() => { getWorkOrderList(projectSelected) }, false);
      callAPI(getImpactList, false);
    }, []
  );
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const load = await Helper.getData('IMPACT_LOAD');
      const localProject = await Helper.getData('IMPACT_PROJECT');
      const localWorkOrder = await Helper.getData('IMPACT_WORK_ORDER');
      const localDate = await Helper.getData('IMPACT_DATE');
      if (load) {
        await Helper.storeData('IMPACT_LOAD', '');
        callAPI(() => { getImpactList({ localProject: localProject, localWorkOrder: localWorkOrder, localDate: localDate }) }, false);
      }
    });
    return unsubscribe;
  }, [navigation]);

  //-- Action
  const getImpactList = ({ localProject = projectSelected, localWorkOrder = workOrder, localDate = date } = {}) => {
    const workOrderSelected = localWorkOrder ? localWorkOrder : '';
    const dateSelected = localDate ? Formater.formatDateWithoutTimeSQL(localDate) : null;
    GetManHoursImpactListAPI(localProject, userLogin, workOrderSelected, dateSelected)
      .then(res => {
        if (res.Success) {
          setImpactList(res.Data);
          setIsLoading(false);
          setIsError(false);
        }
        else {
          setIsLoading(false);
          setIsError(true);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  };
  const _onPressCreateOrUpdate = async ({ item = null }) => {
    const dateValue = date ? date : new Date();
    if (!workOrder && !item) {
      MessageAlert('', 'Vui lòng chọn 1 LSX');
      return;
    }
    await Helper.storeData('IMPACT_PROJECT', projectSelected);
    await Helper.storeData('IMPACT_WORK_ORDER', workOrder);
    await Helper.storeData('IMPACT_DATE', Formater.formatDateWithoutTimeSQL(date));
    const companyCode = await Helper.getData('DATACODE');
    navigation.navigate(
      'ManHoursImpactDetail',
      {
        projectCode: projectSelected,
        userLogin: userLogin,
        companyCode: companyCode,
        title: item ? 'Update Impact' : 'Create Impact',

        workOrder: item?.WorkOrderNo ? item?.WorkOrderNo : workOrder,
        rowIndex: item?.RowIndex,
        dateItem: item?.Date ? Formater.formatDateSQL(item?.Date) : Formater.formatDateSQL(dateValue),
        factorTypeItem: item?.FactorType ? item?.FactorType : '',
        subFactorTypeItem: item?.SubFactorType ? item?.SubFactorType : '',
        mhrsItem: item?.Mhrs ? item?.Mhrs : 0,
        remarkItem: item?.Remark ? item?.Remark : '',
      }
    );
  };
  const _onPressManageImage = item => {
    navigation.navigate(
      'ManHoursImpactImage',
      {
        projectCode: projectSelected,
        facilityCode: item.FacilityCode,
        companyCode: item.CompanyCode,
        workOrderNo: item.WorkOrderNo,
        userLogin: userLogin,
        factorType: item.FactorType,
        date: Formater.formatDateData(item.Date)
      }
    );
  };
  const _onPressDeleteImpact = rowIndex => {
    DeleteManHoursImpactAPI(projectSelected, rowIndex)
      .then(res => {
        if (res.Success) {
          if (impactList !== null) {
            const newList = impactList.filter(i => i.RowIndex != rowIndex);
            setImpactList(newList);
          }
        }
        Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  };

  //-- ProjectCode
  const [projectList, setProjectList] = useState([]);
  const [isVisibleProject, setIsVisibleProject] = useState(false);
  const [projectSelected, setProjectSeletecd] = useState(projectCode);
  const getProjectList = () => {
    GetProjectListAPI(userLogin)
      .then(res => {
        if (res.success) {
          setProjectList(res.data);
          setIsLoading(false);
          setIsError(false);
        }
        else {
          setIsLoading(false);
          setIsError(true);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  };
  const _onChangeProjectCode = code => {
    setProjectSeletecd(code);
    setIsVisibleProject(false);
    callAPI(() => { getWorkOrderList(code) }, false);
  };

  //-- WorkOrder
  const [workOrderList, setWorkOrderList] = useState([]);
  const [isVisibleWorkOrder, setIsVisibleWorkOrder] = useState(false);
  const [workOrder, setWorkOrder] = useState('');
  const getWorkOrderList = async (code = projectSelected) => {
    const token = await Helper.getData('TOKEN');
    GetTimeSheetWorkOrderListAPI(code, userLogin, token)
      .then(res => {
        if (res.success) {
          setWorkOrderList(res.data);
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
  const _onChangeWorkOrder = data => {
    setWorkOrder(data);
    setDate(null);
    callAPI(() => { getImpactList({ localWorkOrder: data, localDate: null }) }, false);
    setIsVisibleWorkOrder(false);
  };
  const _onReloadWorkOrder = data => {
    setWorkOrderList(data);
  };

  //-- Date
  const [isVisibleDate, setIsVisibleDate] = useState(false);
  const [date, setDate] = useState(new Date());
  const _onPressSelectDate = () => {
    if (date) {
      setDate(new Date(Moment(date).format("YYYY-MM-DDT00:00:00")));
    } else {
      setDate(new Date());
    }
    setIsVisibleDate(true);
  };
  const _onChangeDate = selectedDate => {
    if (selectedDate) {
      setDate(selectedDate);
      callAPI(() => { getImpactList({ localDate: selectedDate }) }, false);
    }
    setIsVisibleDate(false);
  };





  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.box} onPress={() => { _onPressCreateOrUpdate({ item: item }) }}>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>No:</Text>
          </View>
          <View style={styles.cellThreeAction}>
            <View style={styles.cellOne}>
              <Text style={styles.textData}>{Formater.formatEmptyData(item.WorkOrderNo)}</Text>
            </View>
            <Ionicons name='md-image-outline' size={24} color={iconColor} onPress={() => { _onPressManageImage(item) }} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>Factor:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.FactorType)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>Sub Factor:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.SubFactorType)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>Ngày:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatDateData(item.Date)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>Mhrs:</Text>
          </View>
          <View style={styles.cellThreeAction}>
            <View style={styles.cellOne}>
              <Text style={styles.textData}>{Formater.formatZeroDigits(item.Mhrs)}</Text>
            </View>
            <Ionicons name='ios-backspace-outline' size={24} color={'red'} onPress={() => { _onPressDeleteImpact(item.RowIndex) }} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>Remark:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.Remark)}</Text>
          </View>
        </View>
      </TouchableOpacity >
    );
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getProjectList)} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show &&
              <View>
                <View style={styles.headerRow}>
                  <Text style={styles.headerCellTitle}>Dự án:</Text>
                  <View style={styles.headerCellAction}>
                    <Text style={styles.headerText}>{projectSelected}</Text>
                    <Ionicons onPress={() => { setIsVisibleProject(true); }}
                      style={styles.headerIcon} name='md-list-outline' size={20} color={BASE_COLOR} />
                  </View>
                </View>
                <View style={styles.headerRow}>
                  <Text style={styles.headerCellTitle}>LSX:</Text>
                  <View style={styles.headerCellAction}>
                    <Text style={styles.headerText}>{workOrder}</Text>
                    <Ionicons onPress={() => { setIsVisibleWorkOrder(true); }}
                      style={styles.headerIcon} name='md-list-outline' size={20} color={BASE_COLOR} />
                  </View>
                </View>
                <View style={styles.headerRow}>
                  <Text style={styles.headerCellTitle}>Ngày:</Text>
                  <View style={styles.headerCellAction}>
                    <Text style={styles.headerText}>{Formater.formatDateData(date)}</Text>
                    <Ionicons onPress={_onPressSelectDate}
                      style={styles.headerIcon} name='md-list-outline' size={20} color={BASE_COLOR} />
                  </View>
                </View>
                <View style={styles.actionContainer}>
                  <TouchableOpacity style={styles.button} onPress={_onPressCreateOrUpdate}>
                    <Text style={styles.buttonTitle}>Tạo mới</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }

            {
              impactList.length
                ?
                <>
                  <Text style={CoreStyle.textNote}>* Click an item to update impact</Text>
                  <VirtualizedList
                    style={styles.table}
                    data={impactList}
                    getItemCount={data => data.length}
                    getItem={(data, index) => {
                      return data[index];
                    }}
                    keyExtractor={(item, index) => index}
                    renderItem={renderItem}
                  />
                </>
                :
                <ListEmptyData />
            }
          </View>
      }
      <SelectPopupTimeSheet
        projectCode={projectSelected}
        visible={isVisibleWorkOrder}
        data={workOrderList}
        onChangeItem={_onChangeWorkOrder}
        onCancel={() => setIsVisibleWorkOrder(false)}
        onReload={_onReloadWorkOrder}
      />
      <SelectPopup
        visible={isVisibleProject}
        data={projectList}
        onChangeItem={_onChangeProjectCode}
        onCancel={() => setIsVisibleProject(false)} />
      <DateTimePickerModal
        isVisible={isVisibleDate}
        date={new Date(Moment(date).format("YYYY-MM-DDT00:00:00"))}
        mode={'date'}
        onConfirm={_onChangeDate}
        onCancel={() => setIsVisibleDate(false)}
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

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    marginBottom: 4,
    justifyContent: 'space-between'
  },
  headerCellTitle: {
    flex: 2,
  },
  headerCellAction: {
    flex: 7,
    flexDirection: 'row',
  },
  headerText: {
    flexShrink: 1,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  headerIcon: {
    marginLeft: 16,
    width: 24,
    height: 20,
  },
  actionContainer: {
    marginVertical: 12,
    height: 36,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
  },
  buttonTitle: {
    color: OPP_COLOR,
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
    minHeight: 16,
    marginBottom: 4,
  },
  cell: {
    flexDirection: 'row',
    flex: 1,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  cellOne: {
    flex: 1,
    justifyContent: 'center',
  },
  cellTwo: {
    flex: 2,
    justifyContent: 'center',
  },
  cellThree: {
    flex: 3,
    justifyContent: 'center',
  },
  cellThreeAction: {
    flex: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
  },
  textData: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },

});

export default ManHoursImpactListScreen;