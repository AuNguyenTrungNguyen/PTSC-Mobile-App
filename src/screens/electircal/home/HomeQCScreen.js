import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Alert, Appearance, Dimensions, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';

import Helper from '../../../utils/Helper';
import Constant from '../../../utils/Constant';
import Header from '../../../components/Header';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';

const HomeQCScreen = ({ route, navigation }) => {

  const { projectCode, disciplineCode } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const isFocused = useIsFocused();

  let colorIcon = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={_onPressLogout} style={{ paddingRight: 16 }}>
          <Ionicons name='log-out-outline' size={24} color={colorIcon} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(
    () => {
      // callAPI(getNotifyNumber);
    }, [isFocused]
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

  const _onPressLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout }
      ],
      { cancelable: false }
    );
  };
  const logout = () => {
    Helper.clearData();
    navigation.replace(Constant.ROUTE__LOGIN);
  };


  const RenderItemBox = props => {
    let iconName = 'qr-code-outline';
    if (props.iconName) {
      iconName = props.iconName;
    }
    return (
      <>
        <View style={styles.line} />
        <View style={styles.cell}>
          {
            !props.disable &&
            <>
              <TouchableOpacity style={styles.itemContainer} onPress={props.onPress} activeOpacity={1}>
                <Text numberOfLines={2} style={styles.itemTitle}>{props.title}</Text>
                <Ionicons name={iconName} size={Dimensions.get('window').height > 700 ? 48 : 36} color={BASE_COLOR} style={styles.itemIcon} />
              </TouchableOpacity>
              {
                props.number
                  ?
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{props.number < 100 ? props.number : '99+'}</Text>
                  </View>
                  :
                  null
              }
            </>
          }
        </View></>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => { }} />
        :
        <View style={styles.container}>
          <Header data={{ 'Project': projectCode, 'Module': disciplineCode }}></Header>
          {/* <ScrollView style={styles.table}>
            {
              (spendNumbers.LamCheck || spendNumbers.DimForCutting)
                ?
                <View style={styles.line} />
                :
                null
            }
            <View style={styles.row}>
              <RenderItemBox title={'QC DIM\n Cutting'} onPress={_onPressManageDimForCutting} number={spendNumbers.DimForCutting} />
              <RenderItemBox title={'Lam Check\nTodo'} onPress={_onPressManageLamCheckTodo} number={spendNumbers.LamCheck} />
            </View>
            <View style={styles.row}>
              <RenderItemBox title={'QC DIM\n Weld'} onPress={_onPressManageDimCheck} number={spendNumbers.DimCheck} />
              <RenderItemBox title={'QC FitUp\n'} onPress={_onPressManageQCFitUp} number={spendNumbers.FitUp} />
            </View>
            <View style={styles.row}>
              <RenderItemBox title={'QC Visual\n'} onPress={_onPressManageQCVisual} number={spendNumbers.Visual} />
              <RenderItemBox title={'DIM After\nWeld'} onPress={_onPressManageDIMAfterWeld} number={spendNumbers.DimAfterWeld} />
            </View>
            <View style={styles.row}>
              <RenderItemBox title={'QA\nObservation'} onPress={_onPressQAObservation} />
              <RenderItemBox title={'QC\nHand Book'} onPress={_onPressQCHandBook} iconName={'md-book-outline'} />
            </View>
            <View style={styles.row}>
              <RenderItemBox title={'Welder Card'} onPress={_onPressOpenQCWelderCard} iconName={'md-card-outline'} />
              <RenderItemBox title={'Structure\nDrawing'} onPress={_onPressOpenStructuralDrawing} iconName={'md-document-text'} />
            </View>
          </ScrollView> */}
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
    flex: 1,
    padding: 16,
    backgroundColor: OPP_COLOR,
  },

  table: {
    flexGrow: 1,
  },
  line: {
    height: 18,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  itemContainer: {
    width: '90%',
    alignItems: 'center',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 12,
    padding: Dimensions.get('window').height > 700 ? 8 : 4,
  },
  itemTitle: {
    textAlign: 'center',
    color: BASE_COLOR,
    fontSize: Dimensions.get('window').height > 700 ? 16 : 14,
    marginVertical: Dimensions.get('window').height > 700 ? 16 : 12,
    minHeight: 40,
  },
  itemIcon: {
    color: BASE_COLOR,
    marginBottom: Dimensions.get('window').height > 700 ? 8 : 4,
    height: Dimensions.get('window').height > 700 ? 48 : 36,
    width: Dimensions.get('window').height > 700 ? 48 : 36,
  },
  badgeContainer: {
    width: 36,
    height: 36,
    padding: 2,
    borderRadius: 36 / 2,
    backgroundColor: '#FF8C00',
    position: 'absolute',
    top: -36 / 2,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: OPP_COLOR,
    fontWeight: 'bold'
  },
});

export default HomeQCScreen;