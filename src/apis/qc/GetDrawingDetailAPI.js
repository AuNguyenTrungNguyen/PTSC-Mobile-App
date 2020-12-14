import { Port_Server } from '../../utils/Core';

const GetDrawingDetailAPI = async (projectCode, facilityCode, drawingNo, sheet, rev, code, token) =>
  fetch(Port_Server
    + '/api/QCUpdate/GetDrawingDetail?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + drawingNo
    + '&sheet=' + sheet
    + '&rev=' + rev
    + '&code=' + code,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
module.exports = GetDrawingDetailAPI;