import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';

//-- Base
export const GetBatchNoListAPI = async (projectCode) => {
  const token = await Helper.getData('TOKEN');
  const subContractor = await Helper.getData('SUB_CONTRACTOR');
  return fetch(
    Port_Server
    + '/api/GRE/GetBatchNoList'
    + '?projectCode=' + projectCode
    + '&subContractor=' + subContractor,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetBonderListAPI = async (projectCode) => {
  const token = await Helper.getData('TOKEN');
  const subContractor = await Helper.getData('SUB_CONTRACTOR');
  return fetch(
    Port_Server
    + '/api/GRE/GetBonderList'
    + '?projectCode=' + projectCode
    + '&subContractor=' + subContractor,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};

//-- CONS
export const GetCurrentConstructionInfoAPI = async (projectCode, drawingNo, sheet, rev) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/GRE/GetCurrentConstructionInfo'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&sheet=' + sheet
    + '&rev=' + rev,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetConstructionListAPI = async (projectCode, facilityCode, drawingNo, jointNo) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/GRE/GetConstructionList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&jointNo=' + jointNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetConstructionDetailAPI = async (projectCode, facilityCode, drawingNo, sheet, rev, code) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/GRE/GetConstructionDetail'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&sheet=' + sheet
    + '&rev=' + rev
    + '&code=' + code,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const UpdateConstructionDetailAPI = async (projectCode, facilityCode, userUpdate, code, listItemUpdate) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/GRE/UpdateConstructionDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectCode, facilityCode, userUpdate, code, listItemUpdate }),
    }
  ).then(res => res.json());
};

//-- QC
export const GetQCPendingListAPI = async (projectCode, facilityCode, drawingNo, jointNo, code) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/GRE/GetQCPendingList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&jointNo=' + jointNo
    + '&code=' + code,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const UpdateQCPendingListAPI = async (userUpdate, code, listItemUpdate) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/GRE/UpdateQCPendingList',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, code, listItemUpdate }),
    }
  ).then(res => res.json());
};
