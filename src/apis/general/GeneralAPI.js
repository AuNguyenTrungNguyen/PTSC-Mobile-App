import { Port_Server } from '../../utils/Core';

export const GetTimeSheetWorkerListAPI = (userLogin, token) =>
  fetch(
    Port_Server
    + '/api/General/GetTimeSheetWorkerList'
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
    + '/api/General/GetTimeSheetWorkOrderList'
    + '?projectCode=' + projectCode
    + '&userLogin=' + userLogin,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      }
    }).then(res => res.json());

export const UpdateTimeSheetListlAPI = (userInsert, models, token) =>
  fetch(
    Port_Server 
    + '/api/General/UpdateTimeSheetList',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInsert, models }),
    }
  ).then(res => res.json());

export const GetManHoursImpactListAPI = (projectCode, userLogin, token) =>
  fetch(
    Port_Server
    + '/api/General/GetManHoursImpactList'
    + '?projectCode=' + projectCode
    + '&userLogin=' + userLogin,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const UpdateManHoursImpactDetailAPI = (userInsert, model, token) =>
  fetch(
    Port_Server
    + '/api/General/UpdateManHoursImpactDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInsert, model }),
    }
  ).then(res => res.json());

export const GetManHoursImpactImageAPI = (workOrderNo, factorType, date, token) =>
  fetch(
    Port_Server
    + '/api/General/GetManHoursImpactImage'
    + '?workOrderNo=' + workOrderNo
    + '&factorType=' + factorType
    + '&date=' + date,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const DeleteManHoursImpactImageAPI = (id, token) =>
  fetch(
    Port_Server
    + '/api/General/DeleteManHoursImpactImage',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    }
  ).then(res => res.json());

export const EditManHoursImpactImageAPI = (id, note, token) =>
  fetch(
    Port_Server
    + '/api/General/EditManHoursImpactImage',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, note }),
    }
  ).then(res => res.json());
