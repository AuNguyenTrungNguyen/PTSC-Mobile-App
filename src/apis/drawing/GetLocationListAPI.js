import { Port_Server } from '../../utils/Core';
const GetLocationListAPI = (projectCode, token) =>
  fetch(Port_Server + '/api/Drawing/GetLocationList?projectCode=' + projectCode, {
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    }
  }).then(res => res.json());
module.exports = GetLocationListAPI;