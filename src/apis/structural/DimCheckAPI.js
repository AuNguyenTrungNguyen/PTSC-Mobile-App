import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';

export const GetDimCheckListQRCodeAPI = async (projectCode, drawingNo, jointNo, sheet, rev, type, isSpending, token) => {
  let scope = await Helper.getData('QCSCOPE');
  if (scope == null) {
    scope = '';
  }
  if (!sheet) {
    sheet = '';
  }
  if (!rev) {
    rev = '';
  }
  if (!isSpending) {
    isSpending = false;
  }
  return fetch(
    Port_Server
    + '/api/structural/DimCheck/GetDimCheckListQRCode'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + drawingNo
    + '&jointNo=' + jointNo
    + '&sheet=' + sheet
    + '&rev=' + rev
    + '&type=' + type
    + '&scope=' + scope
    + '&isSpending=' + isSpending,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
};

export const GetDimCheckDetailAPI = (projectCode, pieceMarkNo01, pieceMarkNo02, token) =>
  fetch(
    Port_Server
    + '/api/structural/DimCheck/GetDimCheckDetail'
    + '?projectCode=' + projectCode
    + '&pieceMarkNo01=' + pieceMarkNo01
    + '&pieceMarkNo02=' + pieceMarkNo02,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const UpdateDimCheckDetailAPI = async (weldMap, pieceMark01, pieceMark02, userUpdate, token) => {
  let projectCode = await Helper.getData('PROJECT_CODE');
  let disciplineCode = await Helper.getData('DISCIPLINE_CODE');
  return fetch(
    Port_Server
    + '/api/structural/DimCheck/UpdateDimCheckDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ weldMap, pieceMark01, pieceMark02, userUpdate, disciplineCode, projectCode }),
    }
  ).then(res => res.json());
};

export const GetDimCheckImageAPI = (tableRowIndex, token) =>
  fetch(
    Port_Server
    + '/api/structural/DimCheck/GetDimCheckImage'
    + '?tableRowIndex=' + tableRowIndex,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const DeleteDimCheckImageAPI = (id, token) =>
  fetch(
    Port_Server
    + '/api/structural/DimCheck/DeleteDimCheckImage',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    }
  ).then(res => res.json());

export const EditDimCheckImageAPI = (id, note, token) =>
  fetch(
    Port_Server
    + '/api/structural/DimCheck/EditDimCheckImage',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, note }),
    }
  ).then(res => res.json());
