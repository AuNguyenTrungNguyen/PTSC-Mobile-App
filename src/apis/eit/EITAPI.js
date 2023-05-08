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