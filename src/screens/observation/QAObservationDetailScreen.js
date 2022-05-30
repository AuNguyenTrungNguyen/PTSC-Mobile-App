import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Appearance, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import NetInfo from '@react-native-community/netinfo';
import Dialog from 'react-native-dialog';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import Toast from 'react-native-simple-toast';
import {
  GetObservationDisciplineAPI,
  GetObservationCategoryAPI,
  GetObservationSubjectionAPI,
  GetObservationProcessPeriodAPI,
  GetObservationRelevantTeamAPI,
  GetObservationRootCauseAPI,
  CreateOrUpdateObservationAPI
} from '../../apis/qa/QAAPI';

import Helper from '../../utils/Helper';
import Formater from '../../utils/Formater';
import Constant from '../../utils/Constant';
import Header from '../../components/Header';
import MessageAlert from '../../components/MessageAlert';
import LoadingRefresh from '../../components/LoadingRefresh';
import SelectPopup from '../../components/SelectPopup';

const QAObservationDetailScreen = ({ route, navigation }) => {

  const { projectCode, userLogin, observation, owner } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [observationDetail, setObservationDetail] = useState({});

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
      callAPI(getDisciplineList);
      if (observation) {
        var data = JSON.parse(observation);
        data.ProjectCode = projectCode;
        data.CreatebyUser = userLogin;
        data.ObservationDate = new Date(data.ObservationDate);
        setDescription(data.ObservationDesciption);
        setRemark(data.Remark);
        setObservationDetail(data);
      } else {
        setObservationDetail(defaultObservation);
      }
    }, []
  );

  const defaultObservation = {
    ProjectCode: projectCode,
    CreatebyUser: userLogin,
    RowIndex: 0,
    ObservationID: Constant.ID_TBA,
    ObservationDate: new Date(),
    DisciplineCode: '',
    ObservationDesciption: '',
    ObservationCategory: '',
    NonConformingRecord: '',
    SubjectionOfObservation: '',
    ProcessPeriod: '',
    RelevantTeam: '',
    RootCause: '',
    Remark: '',
    ObservationStatus: Constant.QA_OBSERVATION_DRAFT,
  }

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

  const getDisciplineList = async () => {
    let token = await Helper.getData('TOKEN');
    GetObservationDisciplineAPI(projectCode, token)
      .then(res => {
        if (res.success) {
          setDisciplineList(res.data);
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

  const [isVisibleDate, setIsVisibleDate] = useState(false);
  const _onChangeDate = selectedDate => {
    if (selectedDate != undefined) {
      observationDetail.ObservationDate = selectedDate;
    }
    setIsVisibleDate(false);
  };

  const [isVisibleDiscipline, setIsVisibleDiscipline] = useState(false);
  const [disciplineList, setDisciplineList] = useState([]);
  const _onChangeDiscipline = discipline => {
    if (observationDetail.DisciplineCode != discipline) {
      observationDetail.DisciplineCode = discipline;
      observationDetail.ObservationCategory = '';
      observationDetail.SubjectionOfObservation = '';
      observationDetail.ProcessPeriod = '';
      observationDetail.RelevantTeam = '';
      observationDetail.RootCause = '';
    }
    setIsVisibleDiscipline(false);
  };

  const [isVisibleDescription, setIsVisibleDescription] = useState(false);
  const [description, setDescription] = useState('');
  const _onChangeDescription = () => {
    observationDetail.ObservationDesciption = description;
    setIsVisibleDescription(false);
  };

  const [isVisibleCategory, setIsVisibleCategory] = useState(false);
  const [categoryList, setCategoryList] = useState(null);
  const _onPressVisibleCategory = async () => {
    if (observationDetail.DisciplineCode == '') {
      MessageAlert('ERROR', 'Please choose any Discipline!');
      return;
    }
    setIsVisibleCategory(true);
    let token = await Helper.getData('TOKEN');
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoading(false);
        setIsError(true);
        MessageAlert('WARNING', 'Network not available!');
      } else {
        GetObservationCategoryAPI(projectCode, observationDetail.DisciplineCode, token)
          .then(res => {
            if (res.success) {
              setCategoryList(res.data);
              setIsLoading(false);
              setIsError(false);
            } else {
              setIsLoading(false);
              setIsError(true);
              setIsVisibleCategory(false);
            }
          })
          .catch(() => {
            setIsLoading(false);
            setIsError(true);
            setIsVisibleCategory(false);
          });
      }
    });
  };
  const _onChangeCategory = category => {
    observationDetail.ObservationCategory = category;
    setIsVisibleCategory(false);
  };

  const [isVisibleNonConformingRecord, setIsVisibleNonConformingRecord] = useState(false);
  const _onChangeNonConformingRecord = data => {
    observationDetail.NonConformingRecord = data;
    setIsVisibleNonConformingRecord(false);
  };

  const [isVisibleSubjection, setIsVisibleSubjection] = useState(false);
  const [subjectionList, setSubjectionList] = useState(null);
  const _onPressVisibleSubjection = async () => {
    if (observationDetail.DisciplineCode == '') {
      MessageAlert('ERROR', 'Please choose any Discipline!');
      return;
    }
    setIsVisibleSubjection(true);
    let token = await Helper.getData('TOKEN');
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoading(false);
        setIsError(true);
        MessageAlert('WARNING', 'Network not available!');
      } else {
        GetObservationSubjectionAPI(projectCode, observationDetail.DisciplineCode, token)
          .then(res => {
            if (res.success) {
              setSubjectionList(res.data);
              setIsLoading(false);
              setIsError(false);
            } else {
              setIsLoading(false);
              setIsError(true);
              setIsVisibleSubjection(false);
            }
          })
          .catch(() => {
            setIsLoading(false);
            setIsError(true);
            setIsVisibleSubjection(false);
          });
      }
    });
  };
  const _onChangeSubjection = subjection => {
    observationDetail.SubjectionOfObservation = subjection;
    setIsVisibleSubjection(false);
  };

  const [isVisibleProcessPeriod, setIsVisibleProcessPeriod] = useState(false);
  const [processPeriodList, setProcessPeriodList] = useState(null);
  const _onPressVisibleProcessPeriod = async () => {
    if (observationDetail.DisciplineCode == '') {
      MessageAlert('ERROR', 'Please choose any Discipline!');
      return;
    }
    setIsVisibleProcessPeriod(true);
    let token = await Helper.getData('TOKEN');
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoading(false);
        setIsError(true);
        MessageAlert('WARNING', 'Network not available!');
      } else {
        GetObservationProcessPeriodAPI(projectCode, observationDetail.DisciplineCode, token)
          .then(res => {
            if (res.success) {
              setProcessPeriodList(res.data);
              setIsLoading(false);
              setIsError(false);
            } else {
              setIsLoading(false);
              setIsError(true);
              setIsVisibleProcessPeriod(false);
            }
          })
          .catch(() => {
            setIsLoading(false);
            setIsError(true);
            setIsVisibleProcessPeriod(false);
          });
      }
    });
  };
  const _onChangeProcessPeriod = processPeriod => {
    observationDetail.ProcessPeriod = processPeriod;
    setIsVisibleProcessPeriod(false);
  };

  const [isVisibleRelevantTeam, setIsVisibleRelevantTeam] = useState(false);
  const [relevantTeamList, setRelevantTeamList] = useState(null);
  const _onPressVisibleRelevantTeam = async () => {
    if (observationDetail.DisciplineCode == '') {
      MessageAlert('ERROR', 'Please choose any Discipline!');
      return;
    }
    setIsVisibleRelevantTeam(true);
    let token = await Helper.getData('TOKEN');
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoading(false);
        setIsError(true);
        MessageAlert('WARNING', 'Network not available!');
      } else {
        GetObservationRelevantTeamAPI(projectCode, observationDetail.DisciplineCode, token)
          .then(res => {
            if (res.success) {
              setRelevantTeamList(res.data);
              setIsLoading(false);
              setIsError(false);
            } else {
              setIsLoading(false);
              setIsError(true);
              setIsVisibleRelevantTeam(false);
            }
          })
          .catch(() => {
            setIsLoading(false);
            setIsError(true);
            setIsVisibleRelevantTeam(false);
          });
      }
    });
  };
  const _onChangeRelevantTeam = relevantTeam => {
    observationDetail.RelevantTeam = relevantTeam;
    setIsVisibleRelevantTeam(false);
  };

  const [isVisibleRootCause, setIsVisibleRootCause] = useState(false);
  const [rootCauseList, setRootCauseList] = useState(null);
  const _onPressVisibleRootCause = async () => {
    if (observationDetail.DisciplineCode == '') {
      MessageAlert('ERROR', 'Please choose any Discipline!');
      return;
    }
    setIsVisibleRootCause(true);
    let token = await Helper.getData('TOKEN');
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoading(false);
        setIsError(true);
        MessageAlert('WARNING', 'Network not available!');
      } else {
        GetObservationRootCauseAPI(projectCode, observationDetail.DisciplineCode, token)
          .then(res => {
            if (res.success) {
              setRootCauseList(res.data);
              setIsLoading(false);
              setIsError(false);
            } else {
              setIsLoading(false);
              setIsError(true);
              setIsVisibleRootCause(false);
            }
          })
          .catch(() => {
            setIsLoading(false);
            setIsError(true);
            setIsVisibleRootCause(false);
          });
      }
    });
  };
  const _onChangeRootCause = rootCause => {
    observationDetail.RootCause = rootCause;
    setIsVisibleRootCause(false);
  };

  const [isVisibleRemark, setIsVisibleRemark] = useState(false);
  const [remark, setRemark] = useState('');
  const _onChangeRemark = () => {
    observationDetail.Remark = remark;
    setIsVisibleRemark(false);
  };

  const _onPressManageImage = async () => {
    if (observationDetail.ObservationID === Constant.ID_TBA) {
      MessageAlert('ERROR', 'Please save Observation as Draft to continue');
      return;
    }
    const dataCode = await Helper.getData('DATACODE');
    navigation.navigate(
      'QAObservationImage',
      {
        projectCode: projectCode,
        userLogin: userLogin,
        dataCode: dataCode,
        id: observationDetail.ObservationID,
        rowIndex: observationDetail.RowIndex,
        status: observationDetail.ObservationStatus
      }
    );
  };

  const _onPressSubmitToServer = async status => {
    if (observationDetail.DisciplineCode == '') {
      MessageAlert('ERROR', 'DisciplineCode is required');
      return;
    }
    if (observationDetail.ObservationCategory == '') {
      MessageAlert('ERROR', 'ObservationCategory is required');
      return;
    }
    if (observationDetail.NonConformingRecord == '') {
      MessageAlert('ERROR', 'NonConformingRecord is required');
      return;
    }
    if (observationDetail.SubjectionOfObservation == '') {
      MessageAlert('ERROR', 'SubjectionOfObservation is required');
      return;
    }
    if (observationDetail.ProcessPeriod == '') {
      MessageAlert('ERROR', 'ProcessPeriod is required');
      return;
    }
    if (observationDetail.RelevantTeam == '') {
      MessageAlert('ERROR', 'RelevantTeam is required');
      return;
    }
    if (observationDetail.RootCause == '') {
      MessageAlert('ERROR', 'RootCause is required');
      return;
    }
    callAPI(() => { createOrUpdateObservation(status) }, true);
  };

  const createOrUpdateObservation = async status => {
    let token = await Helper.getData('TOKEN');
    setIsUploading(true);
    observationDetail.ObservationStatus = status;
    CreateOrUpdateObservationAPI(observationDetail, token)
      .then(res => {
        if (res.success) {
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
          if (observationDetail.ObservationID == Constant.ID_TBA) {
            observationDetail.RowIndex = res.data.RowIndex;
            observationDetail.ObservationID = res.data.ObservationID;
          }
        } else {
          Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        }
        setIsUploading(false);
      }).catch(() => {
        Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        setIsUploading(false);
      });
  }




  const RenderObservationDetail = () => {
    let isOwner = userLogin == owner;
    let isDisabled = observationDetail.ObservationStatus == Constant.QA_OBSERVATION_DRAFT && isOwner ? false : true;
    let iconColor = observationDetail.ObservationStatus == Constant.QA_OBSERVATION_DRAFT && isOwner ? BASE_COLOR : DISABLED_COLOR;
    return (
        <ScrollView style={styles.table} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.box}>
            <View style={styles.row}>
              <Text style={styles.cellTitle}>Id:</Text>
              <Text style={styles.cellData}>{observationDetail.ObservationID}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.cellTitle}>Status:</Text>
              <RenderStatus status={observationDetail.ObservationStatus} />
            </View>
            <View style={styles.row}>
              <Text style={styles.cellTitle}>Date:</Text>
              <View style={styles.cellData}>
                <TouchableOpacity style={styles.containerAction} disabled={isDisabled} onPress={() => setIsVisibleDate(true)}>
                  <Text style={styles.textAction}>{Formater.formatDateData(observationDetail.ObservationDate)}</Text>
                  <AntDesignIcon style={styles.iconAction} name='calendar' size={20} color={iconColor} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.cellTitle}>Discipline:</Text>
              <View style={styles.cellData}>
                <TouchableOpacity style={styles.containerAction} disabled={isDisabled} onPress={() => { setIsVisibleDiscipline(true) }}>
                  <Text style={styles.textAction}>{Formater.formatEmptyData(observationDetail.DisciplineCode)}</Text>
                  <Ionicons style={styles.iconAction} name='md-list' size={20} color={iconColor} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.cellTitle}>Description:</Text>
              <View style={styles.cellData}>
                <TouchableOpacity style={styles.containerAction} disabled={isDisabled} onPress={() => { setIsVisibleDescription(true) }}>
                  <Text style={styles.textAction}>{Formater.formatEmptyData(observationDetail.ObservationDesciption)}</Text>
                  <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={iconColor} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.cellTitle}>Category:</Text>
              <View style={styles.cellData}>
                <TouchableOpacity style={styles.containerAction} disabled={isDisabled} onPress={_onPressVisibleCategory}>
                  <Text style={styles.textAction}>{Formater.formatEmptyData(observationDetail.ObservationCategory)}</Text>
                  <Ionicons style={styles.iconAction} name='md-list' size={20} color={iconColor} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.cellTitle}>NonConforming Record:</Text>
              <View style={styles.cellData}>
                <TouchableOpacity style={styles.containerAction} disabled={isDisabled} onPress={() => { setIsVisibleNonConformingRecord(true) }}>
                  <Text style={styles.textAction}>{Formater.formatEmptyData(observationDetail.NonConformingRecord)}</Text>
                  <Ionicons style={styles.iconAction} name='md-list' size={20} color={iconColor} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.cellTitle}>Subjection:</Text>
              <View style={styles.cellData}>
                <TouchableOpacity style={styles.containerAction} disabled={isDisabled} onPress={_onPressVisibleSubjection}>
                  <Text style={styles.textAction}>{Formater.formatEmptyData(observationDetail.SubjectionOfObservation)}</Text>
                  <Ionicons style={styles.iconAction} name='md-list' size={20} color={iconColor} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.cellTitle}>Process Period:</Text>
              <View style={styles.cellData}>
                <TouchableOpacity style={styles.containerAction} disabled={isDisabled} onPress={_onPressVisibleProcessPeriod}>
                  <Text style={styles.textAction}>{Formater.formatEmptyData(observationDetail.ProcessPeriod)}</Text>
                  <Ionicons style={styles.iconAction} name='md-list' size={20} color={iconColor} />
                </TouchableOpacity>
              </View>
            </View><View style={styles.row}>
              <Text style={styles.cellTitle}>RelevantTeam:</Text>
              <View style={styles.cellData}>
                <TouchableOpacity style={styles.containerAction} disabled={isDisabled} onPress={_onPressVisibleRelevantTeam}>
                  <Text style={styles.textAction}>{Formater.formatEmptyData(observationDetail.RelevantTeam)}</Text>
                  <Ionicons style={styles.iconAction} name='md-list' size={20} color={iconColor} />
                </TouchableOpacity>
              </View>
            </View><View style={styles.row}>
              <Text style={styles.cellTitle}>RootCause:</Text>
              <View style={styles.cellData}>
                <TouchableOpacity style={styles.containerAction} disabled={isDisabled} onPress={_onPressVisibleRootCause}>
                  <Text style={styles.textAction}>{Formater.formatEmptyData(observationDetail.RootCause)}</Text>
                  <Ionicons style={styles.iconAction} name='md-list' size={20} color={iconColor} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.cellTitle}>Remark:</Text>
              <View style={styles.cellData}>
                <TouchableOpacity style={styles.containerAction} disabled={isDisabled} onPress={() => { setIsVisibleRemark(true) }}>
                  <Text style={styles.textAction}>{Formater.formatEmptyData(observationDetail.Remark)}</Text>
                  <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={iconColor} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.cellTitle}>Pictures:</Text>
              <TouchableOpacity style={styles.cellData} disabled={!isOwner} onPress={_onPressManageImage}>
                <Ionicons style={styles.iconAction} name='md-image-outline' size={20} color={!isOwner ? DISABLED_COLOR : BASE_COLOR} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.actionContainer}>
            {
              observationDetail.ObservationStatus == Constant.QA_OBSERVATION_DRAFT && isOwner
                ?
                <>
                  <TouchableOpacity style={styles.buttonLeft} onPress={() => { _onPressSubmitToServer(Constant.QA_OBSERVATION_DRAFT) }}>
                    <Text style={styles.buttonTitle}>Save as Draft</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonRight} onPress={() => { _onPressSubmitToServer(Constant.QA_OBSERVATION_FINAL) }}>
                    <Text style={styles.buttonTitle}>Save as Final</Text>
                  </TouchableOpacity>
                </>
                :
                <>
                  <TouchableOpacity style={styles.buttonLeftDisabled} disabled={true}>
                    <Text style={styles.buttonTitle}>Save as Draft</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonRightDisabled} disabled={true}>
                    <Text style={styles.buttonTitle}>Save as Final</Text>
                  </TouchableOpacity>
                </>
            }
          </View>
        </ScrollView>
    );
  };

  const RenderStatus = ({ status }) => {
    if (status == Constant.QA_OBSERVATION_DRAFT) {
      return (<Text style={styles.cellStatusDraft}>{Constant.STATUS_DRAFT}</Text>);
    }
    if (status == Constant.QA_OBSERVATION_FINAL) {
      return (<Text style={styles.cellStatusFinal}>{Constant.STATUS_FINAL}</Text>);
    }
    return (<Text style={styles.cellData}></Text>);
  };

  const headerData = {
    'ProjectCode': projectCode,
    'UserLogin': userLogin,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => { callAPI(getDisciplineList) }} />
        :
        <View style={styles.container}>
          {
            isShowDescription.show &&
            <Header data={headerData} />
          }
          <RenderObservationDetail />
        </View>
      }
      <DateTimePickerModal
        isVisible={isVisibleDate}
        date={observationDetail.ObservationDate}
        mode={'date'}
        onConfirm={_onChangeDate}
        onCancel={() => { setIsVisibleDate(false) }}
      />
      <SelectPopup
        visible={isVisibleDiscipline}
        data={disciplineList}
        onChangeItem={_onChangeDiscipline}
        onCancel={() => setIsVisibleDiscipline(false)} />
      <Dialog.Container visible={isVisibleDescription}>
        <Dialog.Title>{'Enter Description'}</Dialog.Title>
        <Dialog.Input
          multiline={true}
          numberOfLines={7}
          value={description}
          onChangeText={(text) => setDescription(text)}
          underlineColorAndroid={BASE_COLOR}
        />
        <Dialog.Button label='Cancle' onPress={() => {
          setIsVisibleDescription(false);
          setDescription(observationDetail.ObservationDesciption);
        }} />
        <Dialog.Button label='Enter' onPress={_onChangeDescription} />
      </Dialog.Container>
      <SelectPopup
        visible={isVisibleCategory}
        data={categoryList}
        onChangeItem={_onChangeCategory}
        onCancel={() => setIsVisibleCategory(false)} />
      <SelectPopup
        visible={isVisibleNonConformingRecord}
        data={[Constant.OPTION_YES, Constant.OPTION_NO]}
        onCancel={() => setIsVisibleNonConformingRecord(false)}
        onChangeItem={_onChangeNonConformingRecord} />
      <SelectPopup
        visible={isVisibleSubjection}
        data={subjectionList}
        onChangeItem={_onChangeSubjection}
        onCancel={() => setIsVisibleSubjection(false)} />
      <SelectPopup
        visible={isVisibleProcessPeriod}
        data={processPeriodList}
        onChangeItem={_onChangeProcessPeriod}
        onCancel={() => setIsVisibleProcessPeriod(false)} />
      <SelectPopup
        visible={isVisibleRelevantTeam}
        data={relevantTeamList}
        onChangeItem={_onChangeRelevantTeam}
        onCancel={() => setIsVisibleRelevantTeam(false)} />
      <SelectPopup
        visible={isVisibleRootCause}
        data={rootCauseList}
        onChangeItem={_onChangeRootCause}
        onCancel={() => setIsVisibleRootCause(false)} />
      <Dialog.Container visible={isVisibleRemark}>
        <Dialog.Title>{'Enter Remark'}</Dialog.Title>
        <Dialog.Input
          multiline={true}
          numberOfLines={7}
          value={remark}
          onChangeText={(text) => setRemark(text)}
          underlineColorAndroid={BASE_COLOR}
        />
        <Dialog.Button label='Cancle' onPress={() => {
          setIsVisibleRemark(false);
          setRemark(observationDetail.Remark);
        }} />
        <Dialog.Button label='Enter' onPress={_onChangeRemark} />
      </Dialog.Container>
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
const DISABLED_COLOR = '#a3a3a3';
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
    width: '100%',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 8,
    marginHorizontal: 4,
  },
  cellTitle: {
    flex: 1,
  },
  cellData: {
    flex: 2,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  cellStatusDraft: {
    flex: 2,
    fontWeight: 'bold',
    color: 'gray',
  },
  cellStatusFinal: {
    flex: 2,
    fontWeight: 'bold',
    color: 'green',
  },
  containerAction: {
    flexDirection: 'row',
  },
  textAction: {
    flexWrap: 'wrap',
    flexShrink: 1,
    fontWeight: 'bold',
    color: BASE_COLOR,
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
  buttonLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
    backgroundColor: BASE_COLOR,
  },
  buttonRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    backgroundColor: BASE_COLOR,
  },
  buttonLeftDisabled: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cccccc',
    borderColor: '#999999',
    borderWidth: 1,
    marginRight: 4,
  },
  buttonRightDisabled: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cccccc',
    borderColor: '#999999',
    borderWidth: 1,
    marginLeft: 4,
  },
  buttonTitle: {
    color: OPP_COLOR,
  },
});

export default QAObservationDetailScreen;