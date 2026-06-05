import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance, TextInput, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Networker from '../../../utils/Networker';
import Formater from '../../../utils/Formater';
import Helper from '../../../utils/Helper';
import CoreStyle from '../../../utils/CoreStyle';

import { GetFacilityListAPI } from '../../../apis/app/AppAPI';
import { GetPipeSupportDrawingNewAPI } from '../../../apis/general/GeneralAPI';

import { ListSelectData, ListLoadingData, ListEmptyData } from '../../../components/HelperUI';
import LoadingRefresh from '../../../components/LoadingRefresh';
import SelectPopup from '../../../components/SelectPopup';

const OpenPipeSupportDrawingScreen = ({ route, navigation }) => {

  const { projectCode } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [drawingList, setDrawingList] = useState(null);

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(() => {
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
  }, [navigation, isShowDescription]);
  const toggle = () => {
    setIsShowDescription(prevState => {
      return {
        show: !prevState.show,
        name: prevState.name === 'arrow-up-circle-outline' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'
      }
    });
  };

  const callAPI = executedAPI => {
    setIsSearching(true);
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true), setIsSearching(false) });
  };
  useEffect(
    () => {
      callAPI(getFacilityList);
    }, []
  );

  //-- Search Action
  const _onPressSearchDrawing = () => {
    Keyboard.dismiss();
    callAPI(gerDrawingData);
  };
  async function gerDrawingData({ facility = facilityCode, deckFilter = deck } = {}) {
    facility = (!facility || facility === FACILITY_CODE_DEFAULT) ? '' : facility;
    deckFilter = (!deckFilter || deckFilter === DECK_DEFAULT) ? '' : deckFilter;
    console.log('[PipeSupportDrawing] GetPipeSupportDrawingNewAPI params:', { projectCode, facility, drawingNo, deckFilter, cuttingPlanItem, ancillary });
    GetPipeSupportDrawingNewAPI(projectCode, facility, drawingNo, deckFilter, cuttingPlanItem, ancillary)
      .then(res => {
        console.log('[PipeSupportDrawing] GetPipeSupportDrawingNewAPI response:', JSON.stringify(res, null, 2));
        if (res.Success && res.Data) {
          setDrawingList(res.Data);
          setIsLoading(false);
          setIsError(false);
          setIsSearching(false);
        } else {
          setIsLoading(false);
          setIsError(true);
          setIsSearching(false);
        }
      })
      .catch((err) => {
        console.log('[PipeSupportDrawing] GetPipeSupportDrawingNewAPI error:', err);
        setIsLoading(false);
        setIsError(true);
        setIsSearching(false);
      });
  };

  //-- DrawingNo 
  const [drawingNo, setDrawingNo] = useState('');
  const _onChangeDrawingNo = value => {
    setDrawingNo(value);
  };

  //-- CuttingPlanItem 
  const [cuttingPlanItem, setCuttingPlanItem] = useState('');
  const _onChangeCuttingPlanItem = value => {
    setCuttingPlanItem(value);
  };

  //-- Ancillary 
  const [ancillary, setAncillary] = useState('');
  const _onChangeAncillary = value => {
    setAncillary(value);
  };

  //-- FacilityCode filter
  const FACILITY_CODE_DEFAULT = 'All Facility Code';
  const [isVisibleFacility, setIsVisibleFacility] = useState(false);
  const [facilityList, setFacilityList] = useState([]);
  const [facilityCode, setFacilityCode] = useState(FACILITY_CODE_DEFAULT);
  const getFacilityList = async () => {
    const token = await Helper.getData('TOKEN');
    GetFacilityListAPI(projectCode, token)
      .then(res => {
        if (res.success) {
          setFacilityList(res.data);
          setIsLoading(false);
          setIsError(false);
          setIsSearching(false);
        } else {
          setIsLoading(false);
          setIsError(true);
          setIsSearching(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsSearching(false);
      });
  };
  const _onChangeFacilityCode = data => {
    if (data !== facilityCode) {
      setFacilityCode(data);
    }
    setIsVisibleFacility(false);
  };
  const _onClearFacilityCode = () => {
    if (facilityCode !== FACILITY_CODE_DEFAULT) {
      setFacilityCode(FACILITY_CODE_DEFAULT);
    }
    setIsVisibleFacility(false);
  };

  //-- Deck filter
  const DECK_DEFAULT = 'All Deck';
  const [isVisibleDeck, setIsVisibleDeck] = useState(false);
  const [deck, setDeck] = useState(DECK_DEFAULT);
  const _onChangeDeck = async data => {
    if (data !== deck) {
      setDeck(data);
    }
    setIsVisibleDeck(false);
  };
  const _onClearDeck = () => {
    if (deck !== DECK_DEFAULT) {
      setDeck(DECK_DEFAULT);
    }
    setIsVisibleDeck(false);
  };

  //-- Render List
  const renderItem = ({ _, item }) => {
    const sheet = Formater.formatEmptyData(item.Sheet).toUpperCase();
    const rev = Formater.formatEmptyData(item.Rev).toUpperCase();
    const cuttingPlanItem = Formater.formatEmptyData(item.CuttingPlanItem).toUpperCase();
    const ancillary = Formater.formatEmptyData(item.Ancillary).toUpperCase();
    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <View style={styles.cellThree}>
            {
              item.WebLink
                ?
                <TouchableOpacity onPress={() => Helper.openDrawingPDF(navigation, item.WebLink, 'Pipe Support')}>
                  <Text style={CoreStyle.textLink}>{Formater.formatEmptyData(item.DrawingNo)}</Text>
                </TouchableOpacity>
                :
                <Text style={styles.textData}>{Formater.formatEmptyData(item.DrawingNo)}</Text>
            }
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>Sheet:</Text>
          </View>
          <View style={styles.cellOne}>
            <Text style={styles.textData}>{sheet}</Text>
          </View>
          <View style={styles.cellOne}>
            <Text>Rev:</Text>
          </View>
          <View style={styles.cellOne}>
            <Text style={styles.textData}>{rev}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>CPItem:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{cuttingPlanItem}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>Ancillary:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{ancillary}</Text>
          </View>
        </View>
        {
          item.WebLink
            ?
            <View style={styles.row}>
              <View style={styles.cellOne}>
                <Text>WebLink:</Text>
              </View>
              <View style={styles.cellThree}>
                <TouchableOpacity onPress={() => Helper.openDrawingPDF(navigation, item.WebLink, 'Pipe Support')}>
                  <Text style={CoreStyle.textLinkWithLine}>{item.WebLink.split('/').pop()}</Text>
                </TouchableOpacity>
              </View>
            </View>
            :
            null
        }
      </View>
    );
  };
  const RenderList = () => {
    {
      if (isSearching) {
        return <ListLoadingData />
      } else if (!drawingList) {
        return <ListSelectData title={'Please select Facility / Drawing / Deck'} />
      } else {
        return <ListEmptyData />
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(gerDrawingData)} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show
                ?
                (<View style={styles.headerContainer}>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction}>Project:</Text>
                    <Text style={styles.infoData}>{projectCode}</Text>
                  </View>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction}>FacilityCode:</Text>
                    <TouchableOpacity style={styles.selectInput} onPress={() => setIsVisibleFacility(true)}>
                      <Text style={styles.buttonTitleDark}>{facilityCode}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction}>Deck:</Text>
                    <TouchableOpacity style={styles.selectInput} onPress={() => setIsVisibleDeck(true)}>
                      <Text style={styles.buttonTitleDark}>{deck}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction}>DrawingNo:</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.inputText}
                        value={drawingNo}
                        onChangeText={_onChangeDrawingNo}
                        underlineColorAndroid='transparent'
                      />
                      {
                        drawingNo == ''
                          ? null
                          : <Icon name='times-circle' onPress={() => _onChangeDrawingNo('')} style={styles.inputIcon} />
                      }
                    </View>
                  </View>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction}>CPItem:</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.inputText}
                        value={cuttingPlanItem}
                        onChangeText={_onChangeCuttingPlanItem}
                        underlineColorAndroid='transparent'
                      />
                      {
                        cuttingPlanItem == ''
                          ? null
                          : <Icon name='times-circle' onPress={() => _onChangeCuttingPlanItem('')} style={styles.inputIcon} />
                      }
                    </View>
                  </View>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction}>Ancillary:</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.inputText}
                        value={ancillary}
                        onChangeText={_onChangeAncillary}
                        underlineColorAndroid='transparent'
                      />
                      {
                        ancillary == ''
                          ? null
                          : <Icon name='times-circle' onPress={() => _onChangeAncillary('')} style={styles.inputIcon} />
                      }
                    </View>
                  </View>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction} />
                    <TouchableOpacity
                      style={styles.searchButton}
                      onPress={_onPressSearchDrawing}
                      disabled={isSearching}>
                      <Text style={styles.buttonTitle}>Search Drawing</Text>
                    </TouchableOpacity>
                  </View>
                </View>)
                :
                null
            }
            {
              drawingList && drawingList.length
                ?
                <VirtualizedList
                  style={styles.table}
                  data={drawingList}
                  getItemCount={data => data.length}
                  getItem={(data, index) => {
                    return data[index];
                  }}
                  keyExtractor={(item, index) => index}
                  renderItem={renderItem}
                />
                :
                <RenderList />
            }
          </View>
      }
      <SelectPopup
        visible={isVisibleFacility}
        data={facilityList}
        onCancel={() => setIsVisibleFacility(false)}
        onClear={_onClearFacilityCode}
        onChangeItem={_onChangeFacilityCode} />
      <SelectPopup
        visible={isVisibleDeck}
        data={['CED', 'CLD', 'MND', 'MZD', 'SDD', 'TOD']}
        onCancel={() => setIsVisibleDeck(false)}
        onClear={_onClearDeck}
        onChangeItem={_onChangeDeck} />
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
    minHeight: 24,
    marginBottom: 4,
  },
  infoData: {
    flex: 7,
    fontWeight: 'bold',
    color: BASE_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowInfoAction: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    marginBottom: 4,
  },
  infoTitleAction: {
    flex: 3,
  },
  selectInput: {
    flexDirection: 'row',
    flex: 7,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    height: '100%',
    padding: 4,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
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
    justifyContent: 'center'
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
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 4,
    minHeight: 20,
  },
  checkBox: {
    fontWeight: 'bold',
    color: BASE_COLOR,
    width: 24,
    height: 24,
  },
  cellTitleLine: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellOne: {
    flex: 1,
    justifyContent: 'center',
  },
  cellThreeAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellTwo: {
    flex: 2,
    justifyContent: 'center',
  },
  cellThree: {
    flex: 3,
    justifyContent: 'center',
  },
  cellImageAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textData: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  textAccept: {
    fontWeight: 'bold',
    color: 'green',
  },
  textReject: {
    fontWeight: 'bold',
    color: 'red',
  },
  cellAction: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  buttonClean: {
    width: 70,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelClean: {
    color: BASE_COLOR,
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
    paddingTop: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  noDataText: {
    fontWeight: 'bold',
    color: BASE_COLOR,
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
  buttonTitleDark: {
    color: BASE_COLOR,
  },
});

export default OpenPipeSupportDrawingScreen;