import {Port_Server} from '../../Core';
const GetDrawingListAPI = async (username, token) =>
  fetch(Port_Server + '/api/Drawing/GetDrawingList?username=' + username, {
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
module.exports = GetDrawingListAPI;