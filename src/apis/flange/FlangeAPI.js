import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';

export const GetFlangeJointProgressListAPI = async (projectCode, facilityCode, lineNo) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/piping/GetFlangeJointProgressList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&lineNo=' + lineNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};

export const GetFlangeJointProgressDetailAPI = async (projectCode, facilityCode, lineNo, sheet) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/piping/GetFlangeJointProgressDetail'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&lineNo=' + lineNo
    + '&sheet=' + sheet,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
};

export const UpdateFlangeJointProgresslDetailAPI = async (userUpdate, listItemUpdate) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/piping/UpdateFlangeJointProgresslDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, listItemUpdate }),
    }
  ).then(res => res.json());
}


