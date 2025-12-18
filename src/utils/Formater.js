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
  static formatThousand = number => {
    try {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

  static formatDateZero = date => {
    date = date ? date : new Date();
    var format = Moment(date).format("YYYY-MM-DD");
    return new Date(format + 'T00:00:00.000Z')
  }

  static formatDateValid = date => {
    if (date != null) {
      var format = Moment(date).format("YYYY-MM-DD");
      return new Date(format + 'T00:00:00.000Z')
    }
    return null;
  }

  static checkFormatNumber = input => {
    const regexNumber = /^\d+(\.\d+)?$/;
    return regexNumber.test(input) && input !== '';
  };

};