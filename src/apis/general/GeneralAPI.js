import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';

export const GetPipeSupportDrawingAPI = async (projectCode, facilityCode, drawingNo, deck) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/General/GetPipeSupportDrawing'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + drawingNo
    + '&location=' + deck,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
}




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
