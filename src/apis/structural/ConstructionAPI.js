import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';

// export const GetConstructionListAPI = (projectCode, facilityCode, drawingNo, token) =>
//   fetch(
//     Port_Server
//     + '/api/structural/Construction/GetConstructionList'
//     + '?projectCode=' + projectCode
//     + '&facilityCode=' + facilityCode
//     + '&drawingNo=' + drawingNo,
//     {
//       headers: {
//         'Authorization': 'Bearer ' + token,
//         'Content-Type': 'application/json',
//       },
//     }
//   ).then(res => res.json());
export const GetConstructionListSubContractorAPI = async (projectCode, facilityCode, drawingNo) => {
  const token = await Helper.getData('TOKEN');
  const subContractor = await Helper.getData('SUB_CONTRACTOR');
  return fetch(
    Port_Server
    + '/api/structural/Construction/GetConstructionListSubContractor'
    + '?projectCode=' + projectCode
    + '&subContractor=' + subContractor
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + drawingNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};

export const GetCurrentConstructionInfoAPI = async (projectCode, drawingNo, sheet, rev) => {
  const token = await Helper.getData('TOKEN');
  const subContractor = await Helper.getData('SUB_CONTRACTOR');
  return fetch(
    Port_Server
    + '/api/structural/Construction/GetCurrentConstructionInfo'
    + '?projectCode=' + projectCode
    + '&subContractor=' + subContractor
    + '&drawingNo=' + drawingNo
    + '&sheet=' + sheet
    + '&rev=' + rev,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
};

export const GetConstructionDetaiFilterlAPI = (projectCode, facilityCode, drawingNo, sheet, rev, joint, code, token) =>
  fetch(
    Port_Server
    + '/api/structural/Construction/GetConstructionDetailFilter'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + drawingNo
    + '&sheet=' + sheet
    + '&rev=' + rev
    + '&joint=' + joint
    + '&code=' + code,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const UpdateConstructionDetailAPI = (projectCode, facilityCode, userUpdate, code, listItemUpdate, token) =>
  fetch(
    Port_Server
    + '/api/structural/Construction/UpdateConstructionDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectCode, facilityCode, userUpdate, code, listItemUpdate }),
    }
  ).then(res => res.json());

export const GetConstructionQCStatusListAPI = async (projectCode, drawingNo, jointNo, location, type, code) => {
  const token = await Helper.getData('TOKEN');
  const subContractor = await Helper.getData('SUB_CONTRACTOR');
  return fetch(
    Port_Server
    + '/api/structural/Construction/GetConstructionQCStatusList'
    + '?projectCode=' + projectCode
    + '&subContractor=' + subContractor
    + '&drawingNo=' + drawingNo
    + '&jointNo=' + jointNo
    + '&location=' + location
    + '&type=' + type
    + '&code=' + code,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
};

export const GetReweldFromQCAPI = async (projectCode, drawingNo) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/structural/Construction/GetReweldFromQC',
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
