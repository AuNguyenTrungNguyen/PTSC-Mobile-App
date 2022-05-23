import { Port_Server } from '../../utils/Core';

export const GetTimeSheetTeamLeaderInfoAPI = (userLogin, token) =>
  fetch(
    Port_Server
    + '/api/TimeSheet/GetTimeSheetTeamLeaderInfo'
    + '?userLogin=' + userLogin,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const GetTimeSheetWorkOrderListAPI = (projectCode, userLogin, token) =>
  fetch(
    Port_Server
    + '/api/TimeSheet/GetTimeSheetWorkOrderList'
    + '?projectCode=' + projectCode
    + '&userLogin=' + userLogin,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      }
    }).then(res => res.json());

export const GetTimeSheetWorkerListAPI = (projectCode, userLogin, token) =>
  fetch(
    Port_Server
    + '/api/TimeSheet/GetTimeSheetWorkerList'
    + '?projectCode=' + projectCode
    + '&userLogin=' + userLogin,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      }
    }).then(res => res.json());

export const GetTimeSheetWorkerListOTAPI = (projectCode, userLogin, date, token) =>
  fetch(
    Port_Server
    + '/api/TimeSheet/GetTimeSheetWorkerListOT'
    + '?projectCode=' + projectCode
    + '&userLogin=' + userLogin
    + '&date=' + date,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      }
    }).then(res => res.json());

export const UpdateTimeSheetListAPI = (projectCode, departmentCode, userUpdate, dateUpdate, listItemUpdate, token) =>
  fetch(
    Port_Server
    + '/api/TimeSheet/UpdateTimeSheetList',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectCode, departmentCode, userUpdate, dateUpdate, listItemUpdate }),
    }
  ).then(res => res.json());

export const UpdateTimeSheetOTAPI = (projectCode, departmentCode, userUpdate, dateUpdate, listItemUpdate, token) =>
  fetch(
    Port_Server
    + '/api/TimeSheet/UpdateTimeSheetOT',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectCode, departmentCode, userUpdate, dateUpdate, listItemUpdate }),
    }
  ).then(res => res.json());

export const GetTimeSheetAllWorkerListAPI = (department, userLogin, id, name, type, token) =>
  fetch(
    Port_Server
    + '/api/TimeSheet/GetTimeSheetAllWorkerList'
    + '?departmentCode=' + department
    + '&userLogin=' + userLogin
    + '&id=' + id
    + '&name=' + name
    + '&type=' + type,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const UpdateTimeSheetWorkerListAPI = (teamLeaderId, teamLeaderName, listItemUpdate, token) =>
  fetch(
    Port_Server
    + '/api/TimeSheet/UpdateTimeSheetWorkerList',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ teamLeaderId, teamLeaderName, listItemUpdate }),
    }
  ).then(res => res.json());