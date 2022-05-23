
import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';

export const GetImageAPI = (tableRowIndex, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetImage'
    + '?tableRowIndex=' + tableRowIndex,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const GetDrawingImageAPI = (projectCode, facilityCode, drawingNo, sheet, jointNo, code, role, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetDrawingImage'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + drawingNo
    + '&sheet=' + sheet
    + '&jointNo=' + jointNo
    + '&code=' + code
    + '&role=' + role,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const DeleteImageAPI = (id, token) =>
  fetch(
    Port_Server
    + '/api/piping/DeleteImage',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    }
  ).then(res => res.json());

export const EditImageAPI = (id, note, token) =>
  fetch(
    Port_Server
    + '/api/piping/EditImage',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, note }),
    }
  ).then(res => res.json());
