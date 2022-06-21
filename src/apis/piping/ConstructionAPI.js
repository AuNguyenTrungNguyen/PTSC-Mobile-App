import { Port_Server } from '../../utils/Core';

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
