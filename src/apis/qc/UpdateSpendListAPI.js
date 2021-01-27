import { Port_Server } from '../../utils/Core';
const UpdateSpendListAPI = (projectCode, code, itemQCSpendUpdate, token) =>
  fetch(
    Port_Server + '/api/QCUpdate/UpdateSpendList',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectCode, code, itemQCSpendUpdate }),
    }
  ).then(res => res.json());
module.exports = UpdateSpendListAPI;