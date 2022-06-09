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

export const GetTeamListAPI = (projectCode, filterType, token) =>
  fetch(
    Port_Server
    + '/api/App/GetTeamList'
    + '?projectCode=' + projectCode
    + '&filterType=' + filterType,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const GetTeamListFilterAPI = (projectCode, disciplineCode, filterType, token) =>
  fetch(
    Port_Server
    + '/api/App/GetTeamListFilter'
    + '?projectCode=' + projectCode
    + '&disciplineCode=' + disciplineCode
    + '&filterType=' + filterType,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const GetPieceMarkNoListAPI = (projectCode, facilityCode, pieceMarkNo, token) =>
  fetch(
    Port_Server
    + '/api/App/GetPieceMarkNoList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&pieceMarkNo=' + pieceMarkNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const GetSerialNoAndHeatNoListAPI = (projectCode, itemCode, token) =>
  fetch(
    Port_Server
    + '/api/App/GetSerialNoAndHeatNoList'
    + '?projectCode=' + projectCode
    + '&itemCode=' + itemCode,
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

export const GetInspectorListAPI = (projectCode, disciplineCode, filterType, token) =>
  fetch(
    Port_Server
    + '/api/App/GetInspectorList'
    + '?projectCode=' + projectCode
    + '&disciplineCode=' + disciplineCode
    + '&filterType=' + encodeURIComponent(filterType),
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const GetNotifyNumberScopeAPI = async (projectCode, token) => {
  let scope = await Helper.getData('QCSCOPE');
  if (scope == null) {
    scope = '';
  }
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

export const GetPIPNotifyNumberAPI = (projectCode, token) =>
  fetch(
    Port_Server + '/api/App/GetPIPNotifyNumber?projectCode=' + projectCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

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

export const CheckDrawingRevAPI = (projectCode, drawingNo, sheet, token) =>
  fetch(
    Port_Server
    + '/api/App/CheckDrawingRev'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + drawingNo
    + '&sheet=' + sheet,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const CreateTempDrawingNoAPI = (url, userLogin, token) =>
  fetch(
    Port_Server
    + '/api/App/CreateTempDrawingNo',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, userLogin }),
    }
  ).then(res => res.json());
