import { Port_Server } from '../../utils/Core';
const GetTopFacilityCodeAPI = async (projectCode, drawingNo, sheet, rev, token) =>
  fetch(
    Port_Server
    + '/api/Drawing/GetFacilityCodeByDrawing?projectCode=' + projectCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&sheet=' + sheet
    + '&rev=' + rev,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
module.exports = GetTopFacilityCodeAPI;