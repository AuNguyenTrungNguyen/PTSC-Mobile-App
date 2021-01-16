import { Port_Server } from '../../utils/Core';
const GetWPSListAPI = (projectCode, token) =>
  fetch(Port_Server + '/api/Drawing/GetWPSList?projectCode=' + projectCode, {
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    }
  }).then(res => res.json());
module.exports = GetWPSListAPI;