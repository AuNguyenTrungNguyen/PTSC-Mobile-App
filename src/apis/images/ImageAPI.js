import RNFetchBlob from 'rn-fetch-blob';
import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';

export const GetFlangeJointProgressImageAPI = async (tableRowIndex) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/image/GetFlangeJointProgressImage'
    + '?tableRowIndex=' + tableRowIndex,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};

export const UploadFlangeJointProgressImageAPI = async (body) => {
  const token = await Helper.getData('TOKEN');
  return RNFetchBlob.fetch(
    'POST',
    Port_Server
    + '/api/image/UploadFlangeJointProgressImage',
    {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'multipart/form-data',
    },
    body,
  ).then(res => JSON.parse(res.data));
};

export const DeleteImageAPI = (id, token) =>
  fetch(
    Port_Server
    + '/api/piping/DeleteImage',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    }
  ).then(res => res.json());

export const EditImageAPI = (id, note, token) =>
  fetch(
    Port_Server
    + '/api/piping/EditImage',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, note }),
    }
  ).then(res => res.json());
