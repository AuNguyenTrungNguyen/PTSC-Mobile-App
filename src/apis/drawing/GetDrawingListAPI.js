import { Port_Server } from '../../utils/Core';
const GetDrawingListAPI = async (username, projectCode, token) =>
  fetch(Port_Server + '/api/Drawing/GetDrawingList?username=' + username +'&projectCode=' + projectCode, {
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
module.exports = GetDrawingListAPI;