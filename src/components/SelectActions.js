import React from 'react';
import { StyleSheet, SafeAreaView, View, FlatList, Text, TouchableOpacity, Dimensions, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SelectActions = ({ visible, title, data, onCancel }) => {
  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={visible}>
      <View style={modals.dim}>
        <SafeAreaView>
          <View style={modals.container}>
            <View style={modals.header}>
              <Text style={modals.headerText} numberOfLines={1}>{title}</Text>
              <TouchableOpacity style={modals.headerIcon} onPress={() => { onCancel() }}>
                <Ionicons name={'md-close'} size={24} color={BASE_COLOR} />
              </TouchableOpacity>
            </View>
            <View style={modals.list}>
              <FlatList
                data={data}
                renderItem={
                  ({ item, index }) => (
                    <TouchableOpacity style={modals.row} key={index} onPress={() => { item.callback(), onCancel() }}>
                      <Ionicons style={modals.cellIcon} name={item.icon} size={24} color={BASE_COLOR} />
                      <Text style={modals.cellText} numberOfLines={1}>{item.text}</Text>
                    </TouchableOpacity>)
                }
                keyExtractor={index => index}
                ItemSeparatorComponent={
                  () => {
                    return (
                      <View style={{ backgroundColor: BASE_COLOR, height: 1, width: '100%' }}>
                      </View>
                    );
                  }
                }
              />
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const BASE_COLOR = '#344955';
const OPP_COLOR = 'white';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const modals = StyleSheet.create({
  dim: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: OPP_COLOR,
    width: windowWidth * 0.85,
    height: undefined,
    maxHeight: windowHeight * 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  list: {
    padding: 4,
    paddingTop: 0,
    width: windowWidth * 0.85,
    maxHeight: windowHeight * 0.85 - 16,
  },
  row: {
    flexDirection: 'row',
    padding: 4,
    paddingHorizontal: 12,
    alignItems: 'center',
    minHeight: 48,
  },
  cellIcon: {
    marginRight: 12,
  },
  cellText: {
    flex: 1,
    color: BASE_COLOR,
  },
  cellData: {
    flex: 1,
    color: BASE_COLOR,
    textAlign: 'center',
    fontSize: 15,
  },
  header: {
    width: windowWidth * 0.85,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    paddingLeft: 16,
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerIcon: {
    width: 36,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SelectActions;