import { Port_Server } from '../../utils/Core';
import RNFetchBlob from 'rn-fetch-blob';

export const LoginAPI = async (username, password) => {
  var formBody = new URLSearchParams();
  formBody.append('grant_type', 'password');
  formBody.append('userName', username);
  formBody.append('password', password);
  return await RNFetchBlob
    .config({
      trusty: true
    })
    .fetch(
      'POST',
      Port_Server + '/Token',
      {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      formBody.toString(),
    );
};

export const GetProjectListAPI = username =>
  fetch(
    Port_Server
    + '/api/App/GetProjectList'
    + '?username=' + username,
    {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json());

export const GetModuleListAPI = () =>
  fetch(
    Port_Server
    + '/api/App/GetModuleList',
    {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json());

export const GetRoleListAPI = username =>
  fetch(
    Port_Server
    + '/api/App/GetRoleList'
    + '?username=' + username,
    {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json());
