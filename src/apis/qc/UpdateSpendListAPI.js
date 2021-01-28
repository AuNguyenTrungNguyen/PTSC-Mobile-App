import { Port_Server } from '../../utils/Core';
const UpdateSpendListAPI = (projectCode, code, userUpdate, itemQCSpendUpdate, token) =>
  fetch(
    Port_Server + '/api/QCUpdate/UpdateSpendList',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectCode, code, userUpdate, itemQCSpendUpdate }),
    }
  ).then(res => res.json());
module.exports = UpdateSpendListAPI;