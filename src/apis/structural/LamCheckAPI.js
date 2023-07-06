import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';

export const GetLamCheckSpendingListQRCodeAPI = async (projectCode, drawingNo, jointNo, sheet, rev) => {
  const token = await Helper.getData('TOKEN');
  const subContractor = await Helper.getData('SUB_CONTRACTOR');
  return fetch(
    Port_Server
    + '/api/structural/LamCheck/GetLamCheckSpendingListQRCode'
    + '?projectCode=' + projectCode
    + '&subContractor=' + subContractor
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&jointNo=' + jointNo
    + '&sheet=' + sheet
    + '&rev=' + rev,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
};

export const UpdateLamCheckSpendingListAPI = async (listItemUpdate, token) => {
  let projectCode = await Helper.getData('PROJECT_CODE');
  let disciplineCode = await Helper.getData('DISCIPLINE_CODE');
  let userUpdate = await Helper.getData('USERNAME');
  return fetch(
    Port_Server
    + '/api/structural/LamCheck/UpdateLamCheckSpendingList',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listItemUpdate, userUpdate, projectCode, disciplineCode }),
    }
  ).then(res => res.json());
};

export const GetLamCheckTodoListQRCodeAPI = async (projectCode, drawingNo, jointNo, sheet, rev, type, isSpending) => {
  const token = await Helper.getData('TOKEN');
  const subContractor = await Helper.getData('SUB_CONTRACTOR');
  let scope = await Helper.getData('QCSCOPE');
  if (scope == null) {
    scope = '';
  }
  if (!sheet) {
    sheet = '';
  }
  if (!rev) {
    rev = '';
  }
  if (!isSpending) {
    isSpending = false;
  }
  return fetch(
    Port_Server
    + '/api/structural/LamCheck/GetLamCheckTodoListQRCode'
    + '?projectCode=' + projectCode
    + '&subContractor=' + subContractor
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&jointNo=' + jointNo
    + '&sheet=' + sheet
    + '&rev=' + rev
    + '&type=' + type
    + '&scope=' + scope
    + '&isSpending=' + isSpending,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
};

export const UpdateLamCheckTodoListAPI = async (listItemUpdate, userUpdate, token) => {
  let projectCode = await Helper.getData('PROJECT_CODE');
  let disciplineCode = await Helper.getData('DISCIPLINE_CODE');
  return fetch(
    Port_Server
    + '/api/structural/LamCheck/UpdateLamCheckTodoList',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listItemUpdate, userUpdate, projectCode, disciplineCode }),
    }
  ).then(res => res.json());
};

export const GetLamCheckTodoImageAPI = (tableRowIndex, token) =>
  fetch(
    Port_Server
    + '/api/structural/LamCheck/GetLamCheckTodoImage'
    + '?tableRowIndex=' + tableRowIndex,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const DeleteLamCheckTodoImageAPI = (id, token) =>
  fetch(
    Port_Server
    + '/api/structural/LamCheck/DeleteLamCheckTodoImage',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    }
  ).then(res => res.json());

export const EditLamCheckTodoImageAPI = (id, note, token) =>
  fetch(
    Port_Server
    + '/api/structural/LamCheck/EditLamCheckTodoImage',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, note }),
    }
  ).then(res => res.json());

export const GetLamCheckQCStatusListAPI = async (projectCode, drawingNo, jointNo, type) => {
  const token = await Helper.getData('TOKEN');
  const subContractor = await Helper.getData('SUB_CONTRACTOR');
  return fetch(
    Port_Server
    + '/api/structural/LamCheck/GetLamCheckQCStatusList'
    + '?projectCode=' + projectCode
    + '&subContractor=' + subContractor
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&jointNo=' + jointNo
    + '&type=' + type,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
};
