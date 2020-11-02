import { Port_Server } from '../../utils/Core';
const GetDrawingDetailAPI = async (projectCode, drawingNo, token) =>
  fetch(Port_Server + '/api/Drawing/GetDrawingDetail?projectCode=' + projectCode + '&drawingNo=' + drawingNo, {
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
module.exports = GetDrawingDetailAPI;