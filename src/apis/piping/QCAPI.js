import { Port_Server } from '../../utils/Core';

export const GetSpendNumbersAPI = (projectCode, token) =>
  fetch(
    Port_Server + '/api/piping/GetSpendNumbers?projectCode=' + projectCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const GetQCListAPI = (projectCode, facilityCode, drawingNo, weldNo, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetQCList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + drawingNo
    + '&weldNo=' + weldNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const GetCurrentQCInfoAPI = (projectCode, drawingNo, sheet, rev, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetCurrentQCInfo'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + drawingNo
    + '&sheet=' + sheet
    + '&rev=' + rev,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const GetQCDetailAPI = (projectCode, facilityCode, drawingNo, sheet, rev, code, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetQCDetail'
    + '?projectCode=' + projectCode
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

export const UpdateQCDetailAPI = (projectCode, facilityCode, userUpdate, code, listItemUpdate, token) =>
  fetch(
    Port_Server
    + '/api/piping/UpdateQCDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectCode, facilityCode, userUpdate, code, listItemUpdate }),
    }
  ).then(res => res.json());

export const GetSpendListAPI = (projectCode, drawingNo, weldNo, siteLocaion, code, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetSpendList'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + drawingNo
    + '&weldNo=' + weldNo
    + '&siteLocation=' + siteLocaion
    + '&code=' + code,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const UpdateSpendListAPI = (projectCode, userUpdate, code, listItemUpdate, token)=>
  fetch(
    Port_Server
    + '/api/piping/UpdateSpendList',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectCode, userUpdate, code, listItemUpdate }),
    }
  ).then(res => res.json());