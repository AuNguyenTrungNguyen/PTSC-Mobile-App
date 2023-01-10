import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';

export const GetDrawingCompletePercentAPI = (projectCode, drawingNo, sheet, rev, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetDrawingCompletePercent'
    + '?projectCode=' + projectCode
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

export const GetDrawingCompleteAllPercentAPI = (projectCode, drawingNo, sheet, rev, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetDrawingCompleteAllPercent'
    + '?projectCode=' + projectCode
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

export const GetConstructionListAPI = (projectCode, facilityCode, drawingNo, weldNo, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetConstructionList'
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

export const GetCurrentConstructionInfoAPI = (projectCode, drawingNo, sheet, rev, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetCurrentConstructionInfo'
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
    + '/api/piping/GetConstructionDetail'
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

export const CheckDrawingRevAPI = (projectCode, drawingNo, sheet, rev, role, token) =>
  fetch(
    Port_Server
    + '/api/piping/CheckDrawingRev'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + drawingNo
    + '&sheet=' + sheet
    + '&rev=' + rev
    + '&role=' + role,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const UpdateConstructionDetailAPI = (projectCode, facilityCode, userUpdate, code, listItemUpdate, token) =>
  fetch(
    Port_Server
    + '/api/piping/UpdateConstructionDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectCode, facilityCode, userUpdate, code, listItemUpdate }),
    }
  ).then(res => res.json());



export const GetTeamReportAPI = (projectCode, disciplineCode, team, date, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetTeamReport'
    + '?projectCode=' + projectCode
    + '&disciplineCode=' + disciplineCode
    + '&team=' + team
    + '&date=' + date,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const GetTeamReportDetailAPI = (projectCode, team, date, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetTeamReportDetail'
    + '?projectCode=' + projectCode
    + '&team=' + team
    + '&date=' + date,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const GetQCStatusListAPI = (projectCode, code, facilityCode, drawingNo, weldNo, filterType, siteLocaion, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetQCStatusList'
    + '?projectCode=' + projectCode
    + '&code=' + code
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + drawingNo
    + '&weldNo=' + weldNo
    + '&filterType=' + filterType
    + '&siteLocation=' + siteLocaion,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());



export const GetReweldFromQCAPI = async (projectCode, drawingNo) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/piping/GetReweldFromQC',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectCode, drawingNo }),
    }
  ).then(res => res.json());
};

//-- Pipe Support
export const GetPipeSupportListAPI = async (projectCode, facilityCode, name) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/piping/GetPipeSupportList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + name,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetPipeSupportDetailAPI = async (projectCode, facilityCode, name) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/piping/GetPipeSupportDetail'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + name,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const UpdatePipeSupportDetailAPI = async (modelUpdate, modelColumnChange) => {
  const token = await Helper.getData('TOKEN');
  const userUpdate = await Helper.getData('USERNAME');
  return fetch(
    Port_Server
    + '/api/piping/UpdatePipeSupportDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, modelUpdate, modelColumnChange }),
    }
  ).then(res => res.json());
}