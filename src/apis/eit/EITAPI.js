import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';

//-- Cable Control
export const GetElectricalCableControlListAPI = async (projectCode, facilityCode, cableName) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/GetElectricalCableControlList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&cableName=' + cableName,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetElectricalCableControlDetailAPI = async rowIndex => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/GetElectricalCableControlDetail'
    + '?rowIndex=' + rowIndex,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const UpdateElectricalCableControlDetailAPI = async (modelUpdate, modelColumnChange) => {
  const token = await Helper.getData('TOKEN');
  const userUpdate = await Helper.getData('USERNAME');
  return fetch(
    Port_Server
    + '/api/eit/UpdateElectricalCableControlDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, modelUpdate, modelColumnChange }),
    }
  ).then(res => res.json());
};
export const GetElectricalCableControlReportAPI = async (projectCode, userLogin) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/GetElectricalCableControlReport'
    + '?projectCode=' + projectCode
    + '&userLogin=' + userLogin,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};

//-- Cable Damage
export const GetEITCableDamageLogListAPI = async (projectCode, drumNo) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/GetEITCableDamageLogList'
    + '?projectCode=' + projectCode
    + '&drumNo=' + drumNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetEITCableDamageLogDetailAPI = async (projectCode, drumNo) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/GetEITCableDamageLogDetail'
    + '?projectCode=' + projectCode
    + '&drumNo=' + drumNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const CreateOrUpdateEITCableDamageLogDataAPI = async (modelUpdate, modelColumnChange) => {
  const token = await Helper.getData('TOKEN');
  const userUpdate = await Helper.getData('USERNAME');
  return fetch(
    Port_Server
    + '/api/eit/CreateOrUpdateEITCableDamageLogData',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, modelUpdate, modelColumnChange }),
    }
  ).then(res => res.json());
};
export const DeleteEITCableDamageLogDataAPI = async rowIndex => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/eit/DeleteEITCableDamageLogData',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rowIndex }),
    }
  ).then(res => res.json());
};