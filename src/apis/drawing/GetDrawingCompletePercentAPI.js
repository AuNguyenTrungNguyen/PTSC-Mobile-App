import { Port_Server } from '../../utils/Core';
const GetDrawingCompletePercentAPI = (projectCode, drawingNo, sheet, rev, token) =>
  fetch(
    Port_Server
    + '/api/Drawing/GetDrawingCompletePercent?projectCode=' + projectCode
    + '&drawingNo=' + drawingNo
    + '&sheet=' + sheet
    + '&rev=' + rev,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
module.exports = GetDrawingCompletePercentAPI;