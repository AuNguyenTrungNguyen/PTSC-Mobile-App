import { StyleSheet } from 'react-native';

const BASE_COLOR = '#344955';
const CoreStyle = StyleSheet.create({

  textLink: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: BASE_COLOR,
  },
  textLinkWithLine: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    color: BASE_COLOR,
  },
  textNote: {
    color: BASE_COLOR,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 4,
  },

});

export default CoreStyle;