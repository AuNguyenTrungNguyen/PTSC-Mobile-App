import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';

export const GetDrawingLinkAPI = (projectCode, drawingNo, sheet, rev, token) =>
  fetch(
    Port_Server
    + '/api/App/GetDrawingLink?projectCode=' + projectCode
    + '&drawingNo=' + drawingNo
    + '&sheet=' + sheet
    + '&rev=' + rev,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const GetFacilityListAPI = (projectCode, token) =>
  fetch(
    Port_Server
    + '/api/App/GetFacilityList?projectCode=' + projectCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      }
    }
  ).then(res => res.json());

export const GetLocationListAPI = (projectCode, disciplineCode, token) =>
  fetch(
    Port_Server
    + '/api/App/GetLocationList'
    + '?projectCode=' + projectCode
    + '&disciplineCode=' + disciplineCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      }
    }).then(res => res.json());

export const GetFittingTeamListAPI = (projectCode, filterType, token) =>
  fetch(
    Port_Server
    + '/api/App/GetFittingTeamList'
    + '?projectCode=' + projectCode
    + '&filterType=' + filterType,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const GetPieceMarkListAPI = (projectCode, drawingNo, token) =>
  fetch(
    Port_Server
    + '/api/App/GetPieceMarkList'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + drawingNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const GetWelderListAPI = (projectCode, id, name, token) =>
  fetch(
    Port_Server
    + '/api/App/GetWelderList'
    + '?projectCode=' + projectCode
    + '&id=' + id
    + '&name=' + name,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const GetWPSListAPI = (projectCode, disciplineCode, token) =>
  fetch(
    Port_Server
    + '/api/App/GetWPSList'
    + '?projectCode=' + projectCode
    + '&disciplineCode=' + disciplineCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      }
    }).then(res => res.json());

// TODO REMOVE
export const GetNotifyNumberAPI = (projectCode, token) =>
  fetch(
    Port_Server + '/api/App/GetNotifyNumber?projectCode=' + projectCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
export const GetNotifyNumberScopeAPI = async (projectCode, token) => {
  let scope = await Helper.getData('QCSCOPE');
  return fetch(
    Port_Server
    + '/api/App/GetNotifyNumberScope'
    + '?projectCode=' + projectCode
    + '&scope=' + scope,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
};

export const GetFactorTypeAPI = (projectCode, token) =>
  fetch(
    Port_Server
    + '/api/App/GetFactorType'
    + '?projectCode=' + projectCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
