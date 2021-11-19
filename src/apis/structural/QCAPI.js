
import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';

export const GetQCSpendListAPI = async (projectCode, drawingNo, jointNo, location, type, code, token) => {
  let scope = await Helper.getData('QCSCOPE');
  if (scope == null) {
    scope = '';
  }
  return fetch(
    Port_Server
    + '/api/structural/QC/GetQCSpendList'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + drawingNo
    + '&jointNo=' + jointNo
    + '&location=' + location
    + '&type=' + type
    + '&code=' + code
    + '&scope=' + scope,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
};

export const GetQCSpendListQRCodeAPI = async (projectCode, drawingNo, sheet, rev, jointNo, location, type, code, token) => {
  let scope = await Helper.getData('QCSCOPE');
  if (scope == null) {
    scope = '';
  }
  return fetch(
    Port_Server
    + '/api/structural/QC/GetQCSpendListQRCode'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + drawingNo
    + '&sheet=' + sheet
    + '&rev=' + rev
    + '&jointNo=' + jointNo
    + '&location=' + location
    + '&type=' + type
    + '&code=' + code
    + '&scope=' + scope,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
};

export const UpdateQCSpendListAPI = async (userUpdate, listItemUpdate, code, token) => {
  let projectCode = await Helper.getData('PROJECT_CODE');
  let disciplineCode = await Helper.getData('DISCIPLINE_CODE');
  return fetch(
    Port_Server
    + '/api/structural/QC//UpdateQCSpendList',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listItemUpdate, userUpdate, projectCode, disciplineCode, code }),
    }
  ).then(res => res.json());
};

export const GetQCImageAPI = (tableRowIndex, code, token) =>
  fetch(
    Port_Server
    + '/api/structural/QC/GetQCImage'
    + '?tableRowIndex=' + tableRowIndex
    + '&code=' + code,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const DeleteQCImageAPI = (id, token) =>
  fetch(
    Port_Server
    + '/api/structural/QC/DeleteQCImage',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    }
  ).then(res => res.json());

export const EditQCImageAPI = (id, note, token) =>
  fetch(
    Port_Server
    + '/api/structural/QC/EditQCImage',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, note }),
    }
  ).then(res => res.json());
