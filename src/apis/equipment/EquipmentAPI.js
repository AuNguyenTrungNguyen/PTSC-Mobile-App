import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';

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
