import { Port_Server } from '../../utils/Core';
const GetWelderListAPI = async (projectCode, id, name, token) =>
  fetch(
    Port_Server
    + '/api/Drawing/GetWelderList?projectCode=' + projectCode
    + '&id=' + id
    + '&name=' + name,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
module.exports = GetWelderListAPI;