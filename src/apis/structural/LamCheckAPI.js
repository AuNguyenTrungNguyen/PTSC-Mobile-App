import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';

export const GetLamCheckSpendingListAPI = (projectCode, drawingNo, jointNo, token) =>
  fetch(
    Port_Server
    + '/api/structural/LamCheck/GetLamCheckSpendingList'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + drawingNo
    + '&jointNo=' + jointNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const UpdateLamCheckSpendingListAPI = (listItemUpdate, token) =>
  fetch(
    Port_Server
    + '/api/structural/LamCheck/UpdateLamCheckSpendingList',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listItemUpdate }),
    }
  ).then(res => res.json());

// TODO REMOVE
export const GetLamCheckTodoListAPI = (projectCode, drawingNo, jointNo, token) =>
  fetch(
    Port_Server
    + '/api/structural/LamCheck/GetLamCheckTodoList'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + drawingNo
    + '&jointNo=' + jointNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
export const GetLamCheckTodoListScopeAPI = async (projectCode, drawingNo, jointNo, token) => {
  let scope = await Helper.getData('QCSCOPE');
  return fetch(
    Port_Server
    + '/api/structural/LamCheck/GetLamCheckTodoListScope'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + drawingNo
    + '&jointNo=' + jointNo
    + '&scope=' + scope,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
};

export const UpdateLamCheckTodoListAPI = (listItemUpdate, userUpdate, token) =>
  fetch(
    Port_Server
    + '/api/structural/LamCheck/UpdateLamCheckTodoList',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listItemUpdate, userUpdate }),
    }
  ).then(res => res.json());

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
