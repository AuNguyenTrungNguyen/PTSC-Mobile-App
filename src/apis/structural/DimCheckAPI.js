
import { Port_Server } from '../../utils/Core';

export const GetDimCheckListAPI = (projectCode, drawingNo, jointNo, token) =>
  fetch(
    Port_Server
    + '/api/structural/DimCheck/GetDimCheckList'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + drawingNo
    + '&jointNo=' + jointNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

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

export const UpdateDimCheckDetailAPI = (weldMap, pieceMark01, pieceMark02, userUpdate, token) =>
  fetch(
    Port_Server
    + '/api/structural/DimCheck/UpdateDimCheckDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ weldMap, pieceMark01, pieceMark02, userUpdate }),
    }
  ).then(res => res.json());

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
