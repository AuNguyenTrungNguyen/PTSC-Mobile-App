import { Port_Server } from '../../utils/Core';

export const GetQCDrawingDetailAPI = async (projectCode, facilityCode, drawingNo, sheet, rev, code, token) =>
  fetch(Port_Server
    + '/api/QCUpdate/GetQCDrawingDetail?projectCode=' + projectCode
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

export const UpdateQCDrawingDetailAPI = (projectCode, facilityCode, drawingNo, keyUpdate, itemQCDrawingUpdate, token) =>
  fetch(
    Port_Server + '/api/QCUpdate/UpdateQCDrawingDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectCode, facilityCode, drawingNo, keyUpdate, itemQCDrawingUpdate }),
    }
  ).then(res => res.json());

export const GetQCInspectorListAPI = (projectCode, userLogin, token) =>
  fetch(
    Port_Server
    + '/api/QCUpdate/GetQCInspectorList?projectCode=' + 'DNWHP'
    + '&PMSUserLogin=' + userLogin,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());