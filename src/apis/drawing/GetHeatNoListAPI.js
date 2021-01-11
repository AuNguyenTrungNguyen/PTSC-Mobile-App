import { Port_Server } from '../../utils/Core';
const GetHeatNoListAPI = (projectCode, itemCode, token) =>
  fetch(
    Port_Server
    + '/api/Drawing/GetHeatNoList?projectCode=' + projectCode
    + '&itemCode=' + itemCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
module.exports = GetHeatNoListAPI;