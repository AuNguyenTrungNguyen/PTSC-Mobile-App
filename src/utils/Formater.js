import Moment from 'moment';

export default class Formater {

  static formatEmptyData = data => {
    return data ? data : '';
  };

  static formatDateData = data => {
    return data ? Moment(data).format("DD-MMM-YY") : '';
  };

  static formatDateDataTime = data => {
    return data ? Moment(data).format("DD-MMM-YY HH:mm") : '';
  };

  static formatTwoDigits = number => {
    try {
      return number.toFixed(2);
    } catch {
      return '0.00';
    }
  }

};