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
  static formatZeroDigits = number => {
    try {
      return number.toFixed(0);
    } catch {
      return '0';
    }
  }

  static formatDateSQL = data => {
    return Moment(data).format("YYYY-MM-DD HH:mm:ss");
  };

  static formatDateWithoutTimeSQL = data => {
    return Moment(data).format("YYYY-MM-DD");
  };

  static checkFormatNumber = input => {
    const regexNumber = /^\d+(\.\d+)?$/;
    return regexNumber.test(input) && input !== '';
  };

};