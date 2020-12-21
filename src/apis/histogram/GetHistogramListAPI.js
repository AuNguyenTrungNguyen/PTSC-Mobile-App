import { Port_Server } from '../../utils/Core';
const GetHistogramListAPI = ((projectCode, token) =>
  fetch(Port_Server + '/api/Reports/GetHistogramList?projectCode=' + projectCode, {
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    }
  }).then(res => res.json()));
module.exports = GetHistogramListAPI;