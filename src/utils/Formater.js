import Moment from 'moment';

export default class Formater {

  static formatEmptyData = data => {
    return data ? data : '';
  };

  static formatDateData = data => {
    return data ? Moment(data).format("DD-MMM-YY") : '';
  };

  static formatTwoDigits = number => {
    try {
      return number.toFixed(2);
    } catch {
      return '0.00';
    }
  }

};