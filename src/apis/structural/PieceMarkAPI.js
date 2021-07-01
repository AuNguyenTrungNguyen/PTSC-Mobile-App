
import { Port_Server } from '../../utils/Core';

export const GetPieceMarkCutListAPI = (projectCode, facilityCode, drawingNo, token) =>
  fetch(
    Port_Server
    + '/api/structural/PieceMark/GetPieceMarkCutList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + drawingNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const GetPieceMarkPaintListAPI = (projectCode, facilityCode, drawingNo, token) =>
  fetch(
    Port_Server
    + '/api/structural/PieceMark/GetPieceMarkPaintList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + drawingNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const GetCurrentPieceMarkInfoAPI = (projectCode, drawingNo, sheet, rev, code, token) =>
  fetch(
    Port_Server
    + '/api/structural/PieceMark/GetCurrentPieceMarkInfo'
    + '?projectCode=' + projectCode
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

export const GetPieceMarkDetailAPI = (projectCode, facilityCode, drawingNo, sheet, rev, code, pieceMarkNo, type, token) =>
  fetch(
    Port_Server
    + '/api/structural/PieceMark/GetPieceMarkDetail'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + drawingNo
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

export const UpdatePieceMarkDetailAPI = (listItemUpdate, token) =>
  fetch(
    Port_Server
    + '/api/structural/PieceMark/UpdatePieceMarkDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listItemUpdate }),
    }
  ).then(res => res.json());
