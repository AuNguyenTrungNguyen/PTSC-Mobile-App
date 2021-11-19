import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';

export const GetDimCheckListScopeAPI = async (projectCode, drawingNo, jointNo, token) => {
  let scope = await Helper.getData('QCSCOPE');
  return fetch(
    Port_Server
    + '/api/structural/DimCheck/GetDimCheckListScope'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + drawingNo
    + '&jointNo=' + jointNo
    + '&scope=' + scope,
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
      body: JSON.stringify({ weldMap, pieceMark01, pieceMark02, userUpdate, disciplineCode }),
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
