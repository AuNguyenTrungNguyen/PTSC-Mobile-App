import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';


//-- NEW
export const GetDailyTaskPlanListAPI = async (equipmentCode, projectCode, facilityCode) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/Equipment/GetDailyTaskPlanList'
    + '?equipmentCode=' + equipmentCode
    + '&projectCode=' + projectCode
    + '&facilityCode=' + facilityCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetWorkRequestHeaderListAPI = async (documentNo, projectCode) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/Equipment/GetWorkRequestHeaderList'
    + '?documentNo=' + documentNo
    + '&projectCode=' + projectCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetMajorEquipmentGroupCodeListAPI = async (groupCode, equipmentDescription) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/Equipment/GetMajorEquipmentGroupCodeList'
    + '?groupCode=' + groupCode
    + '&equipmentDescription=' + equipmentDescription,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetMajorEquipmentEquipmentCodeListAPI = async (groupCode, equipmentName) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/Equipment/GetMajorEquipmentEquipmentCodeList'
    + '?groupCode=' + groupCode
    + '&equipmentName=' + equipmentName,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetMajorEquipmentTimesheetDailyListAPI = async (documentNo, equipmentCode) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/Equipment/GetMajorEquipmentTimesheetDailyList'
    + '?documentNo=' + documentNo
    + '&equipmentCode=' + equipmentCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const CreateMajorEquipmentTimesheetDailyAPI = async (userUpdate, modelUpdate) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/Equipment/CreateMajorEquipmentTimesheetDaily',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, modelUpdate }),
    }
  ).then(res => res.json());
};
export const UpdateMajorEquipmentTimesheetDailyAPI = async (userUpdate, modelUpdate, modelColumnChange) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/Equipment/UpdateMajorEquipmentTimesheetDaily',
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
export const DeleteMajorEquipmentTimesheetDailyAPI = async (modelUpdate) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/Equipment/DeleteMajorEquipmentTimesheetDaily',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ modelUpdate }),
    }
  ).then(res => res.json());
};
export const GetMajorEquipmentUserListAPI = async (code, name) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/Equipment/GetMajorEquipmentUserList'
    + '?code=' + code
    + '&name=' + name,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};

//-- OLD
export const GetEquipmentListAPI = async code => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/Equipment/GetEquipmentList'
    + '?code=' + code,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetEquipmentDetailAPI = async code => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/Equipment/GetEquipmentDetail'
    + '?code=' + code,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetEquipmentBookingListAPI = async code => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/Equipment/GetEquipmentBookingList'
    + '?code=' + code,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetEquipmentBookingDetailAPI = async id => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/Equipment/GetEquipmentBookingDetail'
    + '?id=' + id,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const UpdateEquipmentBookingDetailAPI = async (modelUpdate, modelColumnChange) => {
  const token = await Helper.getData('TOKEN');
  const userUpdate = await Helper.getData('USERNAME');
  return fetch(
    Port_Server
    + '/api/Equipment/UpdateEquipmentBookingDetail',
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
export const GetEquipmentWastageReasonListAPI = async () => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/Equipment/GetEquipmentWastageReasonList',
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};

//-- Lifting Plan
export const GetEquipmentNameListAPI = async name => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/Equipment/GetEquipmentNameList'
    + '?name=' + name,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const GetEquipmentLiftingPlanListAPI = async name => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/Equipment/GetEquipmentLiftingPlanList'
    + '?name=' + name,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
export const UpdateEquipmentLiftingPlanAPI = async (modelUpdate, modelColumnChange) => {
  const token = await Helper.getData('TOKEN');
  const userUpdate = await Helper.getData('USERNAME');
  return fetch(
    Port_Server
    + '/api/Equipment/UpdateEquipmentLiftingPlanAPI',
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