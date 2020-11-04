import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TextInput, TouchableOpacity, Keyboard, FlatList } from 'react-native';
import { Overlay } from 'react-native-elements';
import NetInfo from '@react-native-community/netinfo';

import Helper from '../../utils/Helper';
import GetFacilityListAPI from '../../apis/app/GetFacilityListAPI';
import GetDrawingListAPI from '../../apis/drawing/GetDrawingListAPI';
import MessageAlert from '../../components/MessageAlert';
import LoadingRefresh from '../../components/LoadingRefresh';

export default ({ route, navigation }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const { projectCode } = route.params;

  const [drawingListDefault, setDrawingListDefault] = useState([]);
  const [drawingList, setDrawingList] = useState([]);
  const [drawingNo, setDrawingNo] = useState(null);

  const [isVisible, setIsVisible] = useState(false);
  const [facilityList, setFacilityList] = useState([]);
  const [facilityCode, setFacilityCode] = useState(null);

  useEffect(
    () => {
      getDataFromAPI();
    }, []
  );

  const getDataFromAPI = () => {
    // NetInfo.fetch().then(state => {
    //   if (!state.isConnected) {
    //     setIsLoading(false);
    //     setIsError(true);
    //     MessageAlert('WARNING', 'Network not available!');
    //   } else {
    setIsLoading(true);
    getData();
    //   }
    // });
  };

  const fakeDataFacility = [
    {
      "label": "HST-JACKET",
      "value": "HST-JACKET"
    },
    {
      "label": "FLARE BOOM",
      "value": "FLARE BOOM"
    },
    {
      "label": "HT1 WHP",
      "value": "HT1 WHP"
    },
    {
      "label": "HAI THACH",
      "value": "HT1"
    },
    {
      "label": "HV ROOM",
      "value": "HV ROOM"
    },
    {
      "label": "HT1 Topside",
      "value": "HT1 Topside"
    },
    {
      "label": "PQP JACKET",
      "value": "PQP JACKET"
    },
    {
      "label": "LV ROOM",
      "value": "LV ROOM"
    },
    {
      "label": "GO ROOM",
      "value": "GO ROOM"
    },
    {
      "label": "PQP TOPSIDE",
      "value": "PQP TOPSIDE"
    },
    {
      "label": "LQ & HELIDECK",
      "value": "LQ & HELIDECK"
    }
  ];
  const fakeDataDrawing = [
    {
      "DrawingNo": "B12-13-C-0502-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-C-1501-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-C-1502-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-C-1503-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-C-1504-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-C-1505-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-C-1515-SD",
      "Sheet": "1 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-C-1515-SD",
      "Sheet": "2 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-C-1516-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-C-1527-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-C-1528-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-C-1529-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-C-1530-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DF-0902-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DF-0903-SD",
      "Sheet": "2 of 6",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DF-0903-SD",
      "Sheet": "3 of 6",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DF-0903-SD",
      "Sheet": "4 of 6",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DF-0906-SD",
      "Sheet": "1 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DF-0906-SD",
      "Sheet": "2 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DF-0907-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DF-0908-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DF-0909-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DF-0910-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DF-0917-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0306-SD",
      "Sheet": "1 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0306-SD",
      "Sheet": "2 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0308-SD",
      "Sheet": "1 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0308-SD",
      "Sheet": "2 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0310-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0311-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0319-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0322-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0405-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0422-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0429-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0433-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0436-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0505-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0510-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0606-SD",
      "Sheet": "1 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0606-SD",
      "Sheet": "2 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0606-SD",
      "Sheet": "3 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0607-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0609-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0707-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0708-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0714-SD",
      "Sheet": "1 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0714-SD",
      "Sheet": "2 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0715-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0716-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0718-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0813-SD",
      "Sheet": "1 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0813-SD",
      "Sheet": "2 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0814-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-0905-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-1201-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-1401-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-1521-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-S101-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-S102-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DH-S103-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-0820-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-1007-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2701-SD",
      "Sheet": "1 of 4",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2701-SD",
      "Sheet": "2 of 4",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2701-SD",
      "Sheet": "3 of 4",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2702-SD",
      "Sheet": "1 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2702-SD",
      "Sheet": "2 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2703-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2704-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2705-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2706-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2707-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2708-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2709-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2710-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2711-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2712-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2713-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2714-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2715-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2716-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2717-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2718-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2719-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2720-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2721-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2722-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2723-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2724-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2726-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2727-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2728-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2729-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2730-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2731-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DO-2732-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DW-0309-SD",
      "Sheet": "1 of 4",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DW-0309-SD",
      "Sheet": "2 of 4",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DW-0309-SD",
      "Sheet": "3 of 4",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DW-0309-SD",
      "Sheet": "4 of 4",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DW-0316-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DW-0426-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DW-0427-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DW-0506-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DW-0511-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DW-0717-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DW-0735-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DW-0758-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DW-0805-SD",
      "Sheet": "1 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DW-0821-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DW-0904-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DW-0911-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DW-0915-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DW-1403-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DW-1405-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-DW-1520-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GI-0712-SD",
      "Sheet": "1 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GI-0712-SD",
      "Sheet": "2 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GI-0712-SD",
      "Sheet": "3 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GI-2601-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GI-2602-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GI-2603-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GI-2604-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GI-2605-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GI-2606-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GI-2607-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GI-2608-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GI-2609-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GI-2610-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GI-2611-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GI-2612-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0601-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0602-SD",
      "Sheet": "1 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0602-SD",
      "Sheet": "2 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0602-SD",
      "Sheet": "3 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0611-SD",
      "Sheet": "1 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0611-SD",
      "Sheet": "2 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0611-SD",
      "Sheet": "3 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0612-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0616-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0622-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0623-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0702-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0703-SD",
      "Sheet": "1 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0703-SD",
      "Sheet": "2 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0705-SD",
      "Sheet": "1 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0705-SD",
      "Sheet": "2 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0709-SD",
      "Sheet": "1 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0709-SD",
      "Sheet": "2 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0710-SD",
      "Sheet": "1 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0710-SD",
      "Sheet": "2 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0711-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0713-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0757-SD",
      "Sheet": "1 of 5",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0757-SD",
      "Sheet": "2 of 5",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0757-SD",
      "Sheet": "5 of 5",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-0837-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-1519-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-GU-1526-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-N-0415-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0301-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0302-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0304-SD",
      "Sheet": "1 of 10",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0304-SD",
      "Sheet": "2 of 10",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0304-SD",
      "Sheet": "3 of 10",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0304-SD",
      "Sheet": "5 of 10",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0304-SD",
      "Sheet": "6 of 10",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0304-SD",
      "Sheet": "7 of 10",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0304-SD",
      "Sheet": "8 of 10",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0305-SD",
      "Sheet": "1 of 6",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0305-SD",
      "Sheet": "2 of 6",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0305-SD",
      "Sheet": "3 of 6",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0305-SD",
      "Sheet": "4 of 6",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0305-SD",
      "Sheet": "5 of 6",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0305-SD",
      "Sheet": "6 of 6",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0312-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0313-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0317-SD",
      "Sheet": "1 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0317-SD",
      "Sheet": "2 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0317-SD",
      "Sheet": "3 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0320-SD",
      "Sheet": "1 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0320-SD",
      "Sheet": "2 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0320-SD",
      "Sheet": "3 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0401-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0402-SD",
      "Sheet": "1 of 5",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0403-SD",
      "Sheet": "1 of 5",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0403-SD",
      "Sheet": "2 of 5",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0403-SD",
      "Sheet": "3 of 5",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0403-SD",
      "Sheet": "4 of 5",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0403-SD",
      "Sheet": "5 of 5",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0404-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0407-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0408-SD",
      "Sheet": "1 of 9",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0408-SD",
      "Sheet": "2 of 9",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0408-SD",
      "Sheet": "3 of 9",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0408-SD",
      "Sheet": "4 of 9",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0408-SD",
      "Sheet": "5 of 9",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0408-SD",
      "Sheet": "7 of 9",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0408-SD",
      "Sheet": "8 of 9",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0408-SD",
      "Sheet": "9 of 9",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0409-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0410-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0411-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0412-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0413-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0416-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0417-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0418-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0419-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0420-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0431-SD",
      "Sheet": "1 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0431-SD",
      "Sheet": "2 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0431-SD",
      "Sheet": "3 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0434-SD",
      "Sheet": "1 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0434-SD",
      "Sheet": "2 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0434-SD",
      "Sheet": "3 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0501-SD",
      "Sheet": "1 of 6",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0501-SD",
      "Sheet": "2 of 6",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0501-SD",
      "Sheet": "5 of 6",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0503-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0504-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0508-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0512-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0513-SD",
      "Sheet": "1 of 7",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0513-SD",
      "Sheet": "2 of 7",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0513-SD",
      "Sheet": "3 of 7",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0513-SD",
      "Sheet": "4 of 7",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0513-SD",
      "Sheet": "5 of 7",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0513-SD",
      "Sheet": "6 of 7",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0513-SD",
      "Sheet": "7 of 7",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0516-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0517-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0518-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0519-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0603-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0604-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0608-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0610-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0615-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0619-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0706-SD",
      "Sheet": "1 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0706-SD",
      "Sheet": "2 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0706-SD",
      "Sheet": "3 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0732-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0806-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0808-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0809-SD",
      "Sheet": "1 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0809-SD",
      "Sheet": "2 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0836-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-0838-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-L360-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-P101-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-P102-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-P103-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-V350-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-X101-SD",
      "Sheet": "1 of 8",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-X101-SD",
      "Sheet": "2 of 8",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-X101-SD",
      "Sheet": "3 of 8",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-X101-SD",
      "Sheet": "4 of 8",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-X101-SD",
      "Sheet": "5 of 8",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-X101-SD",
      "Sheet": "7 of 8",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-X101-SD",
      "Sheet": "8 of 8",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-X102-SD",
      "Sheet": "1 of 8",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-X102-SD",
      "Sheet": "2 of 8",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-X102-SD",
      "Sheet": "3 of 8",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-X102-SD",
      "Sheet": "4 of 8",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-X102-SD",
      "Sheet": "5 of 8",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-X102-SD",
      "Sheet": "7 of 8",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-X102-SD",
      "Sheet": "8 of 8",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-X103-SD",
      "Sheet": "1 of 8",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-X103-SD",
      "Sheet": "2 of 8",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-X103-SD",
      "Sheet": "3 of 8",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-X103-SD",
      "Sheet": "4 of 8",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-X103-SD",
      "Sheet": "5 of 8",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-X103-SD",
      "Sheet": "7 of 8",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-X103-SD",
      "Sheet": "8 of 8",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-Y101-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-Y102-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-Y103-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-Z101-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-Z102-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-P-Z103-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-SV-0421-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-SV-0509-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-SV-0605-SD",
      "Sheet": "1 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-SV-0605-SD",
      "Sheet": "2 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-SV-0613-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-SV-0614-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-SV-0620-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-SV-0621-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-SV-0704-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0303-SD",
      "Sheet": "1 of 7",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0303-SD",
      "Sheet": "2 of 7",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0303-SD",
      "Sheet": "3 of 7",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0303-SD",
      "Sheet": "4 of 7",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0303-SD",
      "Sheet": "5 of 7",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0303-SD",
      "Sheet": "6 of 7",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0303-SD",
      "Sheet": "7 of 7",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0314-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0315-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0318-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0321-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0406-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0414-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0428-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0430-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0432-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0435-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0507-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0701-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0801-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0802-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0811-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0812-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0816-SD",
      "Sheet": "1 of 5",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0816-SD",
      "Sheet": "2 of 5",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0816-SD",
      "Sheet": "3 of 5",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0816-SD",
      "Sheet": "4 of 5",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0816-SD",
      "Sheet": "5 of 5",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0817-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0827-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0839-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0901-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-0916-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-1404-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-1509-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-1523-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-R101-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-R102-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VG-R103-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VT-L360-N1-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VT-T600-N6A/N6B-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VT-T600-N8-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VT-T600-N9-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VT-T700-N6-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VT-V340-N10/N11-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VT-V340-N12/N13-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VT-V340-N15/N16-SD",
      "Sheet": "1 of 5",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VT-V340-N15/N16-SD",
      "Sheet": "2 of 5",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VT-V340-N15/N16-SD",
      "Sheet": "4 of 5",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VT-V340-N15/N16-SD",
      "Sheet": "5 of 5",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VT-V350-N4A-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VT-V350-N4B-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VT-V440-N10-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VT-V440-N9-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VT-V490-N10-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VT-V490-N7-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VT-V490-N8-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VT-V900-N14-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VT-V900-N3-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VT-V900-N6A/N6B-SD",
      "Sheet": "1 of 3",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VT-V900-N8A/N8B-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VT-V920-N5A/N5B-SD",
      "Sheet": "1 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-VT-V920-N5A/N5B-SD",
      "Sheet": "2 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-WP-1001-SD",
      "Sheet": "2 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-WP-1002-SD",
      "Sheet": "1 of 4",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-WP-1002-SD",
      "Sheet": "2 of 4",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-WP-1003-SD",
      "Sheet": "1 of 2",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-WP-1004-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-WP-1005-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-WP-1008-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-WP-1009-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-WU-0424-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-WU-0425-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-WU-0803-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-WU-0804-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    },
    {
      "DrawingNo": "B12-13-WU-0815-SD",
      "Sheet": "1 of 1",
      "Rev": "C1",
      "FacilityCode": "HT1"
    }
  ];

  const getData = async () => {

    setDrawingList(fakeDataDrawing);
    setDrawingListDefault(fakeDataDrawing);
    setFacilityList(fakeDataFacility);
    setIsLoading(false);
    setIsError(false);

    // let token = await Helper.getData('TOKEN');
    // GetFacilityListAPI(projectCode, token)
    //   .then(res => {
    //     if (res.success) {
    //       setListFacility(res.data);
    //       setIsLoading(false);
    //       setIsError(false);
    //     } else {
    //       MessageAlert('ERROR', res.Message);
    //       setIsLoading(false);
    //       setIsError(true);
    //     }
    //   })
    //   .catch((error) => {
    //     MessageAlert('ERROR', error.toString());
    //     setIsLoading(false);
    //     setIsError(true);
    //   });
    // GetDrawingListAPI(username, projectCode, token)
    //   .then(res => {
    //     if (res.success) {
    //       setDrawingList(res.data);
    //       setDrawingListDefault(res.data);
    //       setIsLoading(false);
    //       setIsError(false);
    //     } else {
    //       MessageAlert('ERROR', res.Message);
    //       setIsLoading(false);
    //       setIsError(true);
    //     }
    //   })
    //   .catch((error) => {
    //     MessageAlert('ERROR', error.toString());
    //     setIsLoading(false);
    //     setIsError(true);
    //   });
  };

  const _onChangeDrawingNo = (text) => {
    setDrawingNo(text);
  };

  const _onChangeFacilityCode = (item) => {
    setFacilityCode(item.value);
  };

  const _onPressSearchDrawing = () => {
    if (isSearch === false) {
      setIsSearch(true);
    }
    let array = [];
    if (drawingNo) {
      const newData = drawingListDefault.filter(item => {
        const itemData = item.DrawingNo.toUpperCase();
        const drawingData = drawingNo.toUpperCase();
        return itemData.indexOf(drawingData) > -1;
      });
      array = newData;
      setDrawingList(array);
    }
  };

  const _onPressViewFitUp = () => {
    Keyboard.dismiss();
    navigation.navigate('DrawingDetail', { code: 'FitUp' });
  };

  const _onPressViewWeld = () => {
    Keyboard.dismiss();
    navigation.navigate('DrawingDetail', { code: 'Weld' });
  };

  const _onPressQRCodeFitUp = () => {
    Keyboard.dismiss();
    navigation.navigate('Camera', { code: 'FitUp' });
  };

  const _onPressQRCodeWeld = () => {
    Keyboard.dismiss();
    navigation.navigate('Camera', { code: 'Weld' });
  };

  /**
   * Drawing List
   **/
  const ListEmptyComponent = () => {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataTitle}>No have any data with</Text>
        <Text style={styles.noDataTitle}>ProjectCode: <Text style={styles.noDataText}>{projectCode}</Text></Text>
        {drawingNo ? <Text style={styles.noDataTitle}>DrawingNo: <Text style={styles.noDataText}>{drawingNo}</Text></Text> : null}
        {facilityCode ? <Text style={styles.noDataTitle}>FacilityCode: <Text style={styles.noDataText}>{facilityCode}</Text></Text> : null}
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>DrawingNo:</Text>
          <Text style={styles.cellData}>{item.DrawingNo}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Sheet:</Text>
          <Text style={styles.cellData}>{item.Sheet}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Rev:</Text>
          <Text style={styles.cellData}>{item.Rev}</Text>
        </View>
        <View style={styles.rowAction}>
          <TouchableOpacity style={styles.cellAction} onPress={_onPressViewFitUp}>
            <Text style={styles.textAction}>View Fit-Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cellAction} onPress={_onPressViewWeld}>
            <Text style={styles.textAction}>View Weld</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const memoized = useMemo(() => renderItem, [drawingList]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={getDataFromAPI} />
      {!isSearch && drawingList.length == 0
        ?
        <View style={styles.container}>
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataTitle}>No have any data with</Text>
            <Text style={styles.noDataTitle}>ProjectCode: <Text style={styles.noDataText}>{projectCode}</Text></Text>
          </View>
        </View>
        :
        <View style={styles.container}>

          <View style={styles.headerContainer}>
            <View style={styles.rowInfo}>
              <Text style={styles.infoTitle}>ProjectCode:</Text>
              <Text style={styles.infoData}>{projectCode}</Text>
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.infoTitle}>FacilityCode:</Text>
              <TouchableOpacity style={styles.searchInput} onPress={() => setIsVisible(true)}>
                <Text style={styles.buttonTitle}>Scan Weld Drawing</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.infoTitle}>DrawingNo:</Text>
              <TextInput
                style={styles.searchInput}
                value={drawingNo}
                onChangeText={_onChangeDrawingNo}
                placeholder='Enter Drawing No...'
                placeholderTextColor={BASE_COLOR}
                underlineColorAndroid='transparent'
              />
            </View>
          </View>
          <TouchableOpacity onPress={_onPressSearchDrawing}>
            <Text>SearchDrawing</Text>
          </TouchableOpacity>

          <FlatList
            style={styles.table}
            data={drawingList}
            ListEmptyComponent={ListEmptyComponent}
            contentContainerStyle={{ flexGrow: 1 }}
            renderItem={memoized}
            keyExtractor={item => item.DrawingNo.toString()}
          />

          <View style={styles.scanContainer}>
            <TouchableOpacity style={styles.buttonLeft} onPress={_onPressQRCodeFitUp}>
              <Text style={styles.buttonTitle}>Scan Fit-Up Drawing</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonRight} onPress={_onPressQRCodeWeld}>
              <Text style={styles.buttonTitle}>Scan Weld Drawing</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      <Overlay isVisible={isVisible} onBackdropPress={() => setIsVisible(false)}>
        <Text>Hello from Overlay!</Text>
      </Overlay>
    </SafeAreaView >
  );
};

const BASE_COLOR = '#344955';
const BASE_CELL_HEIGHT = 48;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: 'white',
  },

  headerContainer: {
    padding: 8,
    marginBottom: 4,
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
  searchInput: {
    flex: 7,
    borderColor: BASE_COLOR,
    borderBottomWidth: 1,
  },

  table: {
    flex: 1,
    marginBottom: 12,
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
    lineHeight: BASE_CELL_HEIGHT,
  },
  cellTitle: {
    flex: 3,
  },
  cellData: {
    flex: 7,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  rowAction: {
    flexDirection: 'row',
    lineHeight: BASE_CELL_HEIGHT,
    justifyContent: 'flex-end'
  },
  cellAction: {
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 8,
    padding: 4,
    marginRight: 8,
  },
  textAction: {
    color: BASE_COLOR,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },

  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    backgroundColor: 'white',
  },
  noDataTitle: {
    fontSize: 16,
  },
  noDataText: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },

  scanContainer: {
    height: 32,
    flexDirection: 'row',
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
    color: 'white',
  },
});
