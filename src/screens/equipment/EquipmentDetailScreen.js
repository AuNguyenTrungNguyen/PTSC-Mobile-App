import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { GetEquipmentBookingListAPI } from '../../apis/equipment/EquipmentAPI';

import Formater from '../../utils/Formater';
import Networker from '../../utils/Networker';

import Header from '../../components/Header';
import { ListEmptyData } from '../../components/HelperUI';
import LoadingRefresh from '../../components/LoadingRefresh';

const EquipmentDetailScreen = ({ route, navigation }) => {

  const { code, category } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [equipmentBookingList, setEquipmentBookingList] = useState(null)

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
  const toggle = () => {
    setIsShowDescription(prevState => {
      return {
        show: !prevState.show,
        name: prevState.name === 'arrow-up-circle-outline' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'
      }
    });
  };

  useEffect(
    () => {
      callAPI(getEquipmentBookingList);
    }, []
  );

  const callAPI = (executedAPI, loading = true) => {
    if (loading) {
      setIsLoading(true);
    }
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true) });
  };

  //-- Get
  const getEquipmentBookingList = () => {
    GetEquipmentBookingListAPI(code)
      .then(res => {
        if (res.Success) {
          setEquipmentBookingList(res.Data);
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

  //-- Detail
  const _onPressBookingDetail = async item => {
    navigation.navigate(
      'EquipmentTimesheet',
      {
        id: item.Id,
        code: item.EquipmentCode,
        category: item.EquipmentCategory,
        project: item.ProjectCode,
        department: item.DepartmentCode,
      }
    );
  };

  //-- Render List
  const renderItem = ({ _, item }) => {
    return (
      <TouchableOpacity style={styles.box} onPress={() => _onPressBookingDetail(item)}>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>Project:</Text>
          </View>
          <View style={styles.cellOne}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.ProjectCode)}</Text>
          </View>
          <View style={styles.cellOne}>
            <Text>Dept:</Text>
          </View>
          <View style={styles.cellOne}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.DepartmentCode)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>{'Booking \nStart Date'}:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatDateDataTime(item.StartDate)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>{'Booking \nEnd Date'}:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatDateDataTime(item.EndDate)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const headerData = {
    'Code': code,
    'Category': category,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => { callAPI(getEquipmentBookingList) }} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show &&
              <Header data={headerData} />
            }
            {
              equipmentBookingList && equipmentBookingList.length
                ?
                <VirtualizedList
                  style={styles.table}
                  data={equipmentBookingList}
                  getItemCount={data => data.length}
                  getItem={(data, index) => {
                    return data[index];
                  }}
                  keyExtractor={(item, index) => index}
                  renderItem={renderItem}
                />
                :
                <ListEmptyData />
            }
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
    flexDirection: 'column',
    width: '100%',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 4,
    minHeight: 20,
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
  textData: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
});

export default EquipmentDetailScreen;