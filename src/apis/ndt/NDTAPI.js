import { Port_Server } from '../../utils/Core';
import RNFetchBlob from 'rn-fetch-blob';

export const GetNDTNumbersAPI = (projectCode, token) =>
  fetch(
    Port_Server + '/api/NDTUpdate/GetNDTNumbers?projectCode=' + projectCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const GetNDTDetailListAPI = (projectCode, spoolNo, actualType, code, token) =>
  fetch(
    Port_Server + '/api/NDTUpdate/GetNDTDetailList?projectCode=' + projectCode
    + '&spoolNo=' + spoolNo
    + '&actualType=' + actualType
    + '&code=' + code,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const UpdateNDTDetailListAPI = (code, userUpdate, itemNDTUpdate, token) =>
  fetch(
    Port_Server + '/api/NDTUpdate/UpdateNDTDetailList',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, userUpdate, itemNDTUpdate }),
    }
  ).then(res => res.json());

export const GetNDTIssueListAPI = async (projectCode, jointNo, drawingNo, code, token) =>
  fetch(
    Port_Server
    + '/api/NDTUpdate/GetNDTIssueList?projectCode=' + projectCode
    + '&jointNo=' + jointNo
    + '&drawingNo=' + drawingNo
    + '&code=' + code,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const UploadNDTIssueListAPI = async (body, token) => {
  return await RNFetchBlob.fetch(
    'POST',
    Port_Server + '/api/NDTUpdate/UploadNDTIssueList',
    {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'multipart/form-data',
    },
    body,
  );
}

export const DeleteNDTIssueAPI = (id, token) =>
  fetch(
    Port_Server + '/api/NDTUpdate/DeleteNDTIssue',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    }
  ).then(res => res.json());

export const EditNDTIssueAPI = (id, note, token) =>
  fetch(
    Port_Server + '/api/NDTUpdate/EditNDTIssue',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, note }),
    }
  ).then(res => res.json());