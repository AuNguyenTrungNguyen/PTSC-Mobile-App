import { Port_Server } from '../../utils/Core';

export const GetConstructionListAPI = (projectCode, facilityCode, drawingNo, token) =>
  fetch(
    Port_Server
    + '/api/structural/Construction/GetConstructionList'
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

export const GetCurrentConstructionInfoAPI = (projectCode, drawingNo, sheet, rev, token) =>
  fetch(
    Port_Server
    + '/api/structural/Construction/GetCurrentConstructionInfo'
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

export const GetConstructionDetailAPI = (projectCode, facilityCode, drawingNo, sheet, rev, code, token) =>
  fetch(
    Port_Server
    + '/api/structural/Construction/GetConstructionDetail'
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

export const UpdateConstructionDetailAPI = (listItemUpdate, token) =>
  fetch(
    Port_Server
    + '/api/structural/Construction/UpdateConstructionDetailAndSendDIM',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listItemUpdate }),
    }
  ).then(res => res.json());

export const GetConstructionQCStatusListAPI = (projectCode, drawingNo, jointNo, location, type, code, token) =>
  fetch(
    Port_Server
    + '/api/structural/Construction/GetConstructionQCStatusList'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + drawingNo
    + '&jointNo=' + jointNo
    + '&location=' + location
    + '&type=' + type
    + '&code=' + code,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
