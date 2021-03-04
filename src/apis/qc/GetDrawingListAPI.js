import { Port_Server } from '../../utils/Core';
const GetDrawingListAPI = async (projectCode, facilityCode, weldNo, drawingNo, token) =>
  fetch(
    Port_Server
    + '/api/QCUpdate/GetDrawingList?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&weldNo=' + weldNo
    + '&drawingNo=' + drawingNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
module.exports = GetDrawingListAPI;