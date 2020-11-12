import { Port_Server } from '../../utils/Core';
const GetDrawingListAPI = async (projectCode, facilityCode, drawingNo, token) =>
  fetch(
    Port_Server
    + '/api/Drawing/GetDrawingList?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + drawingNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
module.exports = GetDrawingListAPI;