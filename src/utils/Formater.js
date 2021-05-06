import Moment from 'moment';

export default class Formater {

  static formatEmptyData = data => {
    return data ? data : '';
  };

  static formatDateData = data => {
    return data ? Moment(data).format("DD-MMM-YY") : '';
  };

  static formatEmptyNumber = number => {
    return number ? number : '0';
  }

};