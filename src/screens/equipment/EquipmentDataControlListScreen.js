import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, Appearance, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GetEquipmentDataControlListAPI } from '../../apis/equipment/EquipmentAPI';

import Formater from '../../utils/Formater';
import Networker from '../../utils/Networker';

import Header from '../../components/Header';
import LoadingRefresh from '../../components/LoadingRefresh';

const EquipmentDataControlListScreen = ({ route, navigation }) => {

  const { equipmentCode } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [equipment, setEquipment] = useState({});

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
  const callAPI = (executedAPI, loading = true) => {
    if (loading) {
      setIsLoading(true);
    }
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true) });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <View
            style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}
            onPress={toggle}>
            <Ionicons
              size={24}
              name={isShowDescription.name} color={iconColor} />
          </View>
        </View>
      ),
    });
  }, [navigation, isShowDescription]);
  useEffect(
    () => {
      callAPI(getEquipment);
    }, []
  );

  const getEquipment = () => {
    GetEquipmentDataControlListAPI(equipmentCode)
      .then(res => {
        if (res.Success) {
          setEquipment(res.Data);
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

  const RenderDetail = () => {
    return (
      <ScrollView style={styles.table}>
        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>Useable Status:</Text>
            <View style={styles.cellData}>
              <View style={styles.containerAction}>
                {
                  RenderUseableStatus(equipment.UseableStatus)
                }
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>Ready Status:</Text>
            <View style={styles.cellData}>
              <View style={styles.containerAction}>
                {
                  RenderReadyStatus(equipment.ReadyStatus)
                }
              </View>
            </View>
          </View>
          <View style={styles.line} />
          {RenderCertNo()}
          <View style={styles.line} />
          <View style={styles.row}>
            <Text style={styles.cellTitle}>Project:</Text>
            <View style={styles.cellData}>
              <View style={styles.containerAction}>
                <Text style={styles.textAction}>{Formater.formatEmptyData(equipment.Project)}</Text>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>Department:</Text>
            <View style={styles.cellData}>
              <View style={styles.containerAction}>
                <Text style={styles.textAction}>{Formater.formatEmptyData(equipment.UsingDepartment)}</Text>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>Location:</Text>
            <View style={styles.cellData}>
              <View style={styles.containerAction}>
                <Text style={styles.textAction}>{Formater.formatEmptyData(equipment.UsingLocation)}</Text>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>Working Group:</Text>
            <View style={styles.cellData}>
              <View style={styles.containerAction}>
                <Text style={styles.textAction}>{Formater.formatEmptyData(equipment.WorkingGroup)}</Text>
              </View>
            </View>
          </View>
          {/* <View style={styles.row}>
            <Text style={styles.cellTitle}>Description:</Text>
            <View style={styles.cellData}>
              <View style={styles.containerAction}>
                <Text style={styles.textAction}>{Formater.formatEmptyData(equipment.UsingDescription)}</Text>
              </View>
            </View>
          </View> */}
          <View style={styles.row}>
            <Text style={styles.cellTitle}>Used (h/km):</Text>
            <View style={styles.cellData}>
              <View style={styles.containerAction}>
                <Text style={styles.textAction}>{Formater.formatThousand(equipment.CummulativeUsingTime)}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };
  const RenderReadyStatus = (status) => {
    return (
      status == 0
        ?
        <Text style={styles.textGray}>{'Issued'}</Text>
        :
        status == 1
          ?
          <Text style={styles.textGreen}>{'Receipt'}</Text>
          :
          status == 2
            ?
            <Text style={styles.textOrange}>{'Waitting For Handover'}</Text>
            :
            <Text style={styles.textRed}>{'Handover Without Return'}</Text>
    );
  };
  const RenderUseableStatus = (status) => {
    return (
      status == -2
        ?
        <Text style={styles.textGray}>{'Liquidated'}</Text>
        :
        status == -1
          ?
          <Text style={styles.textOrange}>{'Damaged Waiting For Liquidation'}</Text>
          :
          status == 0
            ?
            <Text style={styles.textRed}>{'Damaged'}</Text>
            :
            <Text style={styles.textGreen}>{'Normal'}</Text>
    );
  };
  const RenderCertNo = () => {
    var offsetInHours = new Date().getTimezoneOffset() / 60;
    const date = new Date()
    date.setTime(date.getTime() - (offsetInHours * 60 * 60 * 1000));
    var str = date.toISOString()
    str = str.substring(0, 10) + 'T00:00:00';
    var style = styles.textGreen;
    try {
      var expired = equipment.InspectionExpiredDate.substring(0, 10) + 'T00:00:00';
      const now = Date.parse(str);
      const expiredDate = Date.parse(expired);
      const diffTime = (expiredDate - now);
      const diffDays = diffTime / (1000 * 60 * 60);
      if (diffDays < 0) {
        style = styles.textRed;
      }
      else if (diffDays <= 168) {
        style = styles.textOrange;
      }
    } catch {
      style = styles.textGreen;
    }
    return (
      <>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Cert No:</Text>
          <View style={styles.cellData}>
            <View style={styles.containerAction}>
              <Text style={style}>{Formater.formatEmptyData(equipment.CertNo)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Inspection Date:</Text>
          <View style={styles.cellData}>
            <View style={styles.containerAction}>
              <Text style={style}>{Formater.formatDateData(equipment.InspectionDate)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Expired Date:</Text>
          <View style={styles.cellData}>
            <View style={styles.containerAction}>
              <Text style={style}>{Formater.formatDateData(equipment.InspectionExpiredDate)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Inspection Remark:</Text>
          <View style={styles.cellData}>
            <View style={styles.containerAction}>
              <Text style={style}>{Formater.formatEmptyData(equipment.UserRemarkForInspection)}</Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  const headerData = {
    'Group Code': equipment.GroupCode,
    'Equip. Code': equipmentCode,
    'Equip. Name': equipment.EquipmentName,
    'Equip. Cat': equipment.EquipmentCategory,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => { callAPI(getEquipment) }} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show &&
              <Header data={headerData} />
            }
            <RenderDetail />
          </View>
      }
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
    width: '100%',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 12,
    marginHorizontal: 4,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: BASE_COLOR,
  },
  cellTitle: {
    flex: 1,
  },
  cellData: {
    flex: 1,
    fontWeight: 'bold',
    color: BASE_COLOR,
    alignItems: 'flex-end'
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
  textGray: {
    flexWrap: 'wrap',
    flexShrink: 1,
    fontWeight: 'bold',
    color: '#787878',
  },
  textGreen: {
    flexWrap: 'wrap',
    flexShrink: 1,
    fontWeight: 'bold',
    color: 'green',
  },
  textOrange: {
    flexWrap: 'wrap',
    flexShrink: 1,
    fontWeight: 'bold',
    color: 'orange',
  },
  textRed: {
    flexWrap: 'wrap',
    flexShrink: 1,
    fontWeight: 'bold',
    color: 'red',
  },
  textBlue: {
    flexWrap: 'wrap',
    flexShrink: 1,
    fontWeight: 'bold',
    color: 'blue',
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
  },
  buttonTitle: {
    color: OPP_COLOR,
  },
});

export default EquipmentDataControlListScreen;