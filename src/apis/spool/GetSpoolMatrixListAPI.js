import { Port_Server } from '../../utils/Core';
const GetSpoolMatrixListAPI = (projectCode, facilityCode, drawingNo, token) =>
  fetch(
    Port_Server
    + '/api/Drawing/GetSpoolMatrixList?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + encodeURIComponent(drawingNo),
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
module.exports = GetSpoolMatrixListAPI;