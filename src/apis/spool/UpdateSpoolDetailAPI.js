import { Port_Server } from '../../utils/Core';
const UpdateSpoolDetailAPI = (projectCode, itemSpoolUpdate, token) =>
  fetch(
    Port_Server + '/api/Drawing/UpdateSpoolDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectCode, itemSpoolUpdate }),
    }
  ).then(res => res.json());
module.exports = UpdateSpoolDetailAPI;