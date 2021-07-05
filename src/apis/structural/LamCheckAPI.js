
import { Port_Server } from '../../utils/Core';

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
