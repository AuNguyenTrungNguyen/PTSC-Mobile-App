
import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';

export const GetPieceMarkCutListAPI = async (projectCode, facilityCode, drawingNo) => {
  const token = await Helper.getData('TOKEN');
  const subContractor = await Helper.getData('SUB_CONTRACTOR');
  return fetch(
    Port_Server
    + '/api/structural/PieceMark/GetPieceMarkCutList'
    + '?projectCode=' + projectCode
    + '&subContractor=' + subContractor
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + encodeURIComponent(drawingNo),
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};

export const GetPieceMarkPaintListAPI = async (projectCode, facilityCode, drawingNo) => {
  const token = await Helper.getData('TOKEN');
  const subContractor = await Helper.getData('SUB_CONTRACTOR');
  return fetch(
    Port_Server
    + '/api/structural/PieceMark/GetPieceMarkPaintList'
    + '?projectCode=' + projectCode
    + '&subContractor=' + subContractor
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + encodeURIComponent(drawingNo),
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};

export const GetCurrentPieceMarkInfoAPI = async (projectCode, drawingNo, sheet, rev, code) => {
  const token = await Helper.getData('TOKEN');
  const subContractor = await Helper.getData('SUB_CONTRACTOR');
  return fetch(
    Port_Server
    + '/api/structural/PieceMark/GetCurrentPieceMarkInfo'
    + '?projectCode=' + projectCode
    + '&subContractor=' + subContractor
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&sheet=' + sheet
    + '&rev=' + rev
    + '&code=' + code,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
};

export const GetPieceMarkDetailAndDIMAPI = async (projectCode, facilityCode, drawingNo, sheet, rev, code, pieceMarkNo, type) => {
  const token = await Helper.getData('TOKEN');
  const subContractor = await Helper.getData('SUB_CONTRACTOR');
  return fetch(
    Port_Server
    + '/api/structural/PieceMark/GetPieceMarkDetailAndDIM'
    + '?projectCode=' + projectCode
    + '&subContractor=' + subContractor
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&sheet=' + sheet
    + '&rev=' + rev
    + '&code=' + code
    + '&pieceMarkNo=' + pieceMarkNo
    + '&type=' + type,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
};

export const UpdatePieceMarkDetailAndDIMAPI = (userUpdate, listItemUpdate, token) =>
  fetch(
    Port_Server
    + '/api/structural/PieceMark/UpdatePieceMarkDetailAndDIM',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, listItemUpdate }),
    }
  ).then(res => res.json());
