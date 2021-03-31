import { Port_Server } from '../../utils/Core';
const GetSpendNumbersAPI = (projectCode, token) =>
  fetch(
    Port_Server + '/api/QCUpdate/GetSpendNumbers?projectCode=' + projectCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
module.exports = GetSpendNumbersAPI;