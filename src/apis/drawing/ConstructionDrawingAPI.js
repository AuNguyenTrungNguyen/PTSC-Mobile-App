import { Port_Server } from '../../utils/Core';

export const GetWelderListAPI = (projectCode, id, name, token) =>
  fetch(
    Port_Server
    + '/api/Drawing/GetWelderList?projectCode=' + projectCode
    + '&id=' + id
    + '&name=' + name,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const GetHeatNoListPopupAPI = (projectCode, itemCode, token) =>
  fetch(
    Port_Server
    + '/api/Drawing/GetHeatNoListPopup?projectCode=' + projectCode
    + '&itemCode=' + itemCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const GetHeatNoListAPI = (projectCode, heatNo, token) =>
  fetch(
    Port_Server
    + '/api/Drawing/GetHeatNoList?projectCode=' + projectCode
    + '&heatNo=' + heatNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const GetWPSListAPI = (projectCode, token) =>
  fetch(Port_Server + '/api/Drawing/GetWPSList?projectCode=' + projectCode, {
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    }
  }).then(res => res.json());

export const GetLocationListAPI = (projectCode, token) =>
  fetch(Port_Server + '/api/Drawing/GetLocationList?projectCode=' + projectCode, {
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    }
  }).then(res => res.json());

export const GetFittingTeamAPI = (projectCode, userLogin, token) =>
  fetch(
    Port_Server
    + '/api/Drawing/GetFittingTeam?projectCode=' + projectCode
    + '&PMSUserLogin=' + userLogin,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());