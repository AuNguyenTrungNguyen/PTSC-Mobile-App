import { Port_Server } from '../../utils/Core';
const GetManpowerListAPI = (projectCode, username, date, token) =>
  fetch(
    Port_Server
    + '/api/Reports/GetManpowerList?projectCode=' + projectCode
    + '&username=' + username
    + '&date=' + date,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
module.exports = GetManpowerListAPI;