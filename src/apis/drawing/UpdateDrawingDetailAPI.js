import { Port_Server } from '../..//utils/Core';
const UpdateDrawingDetailAPI = (projectCode, facilityCode, drawingNo, userUpdate, keyUpdate, itemDrawingUpdate, token) =>
  fetch(
    Port_Server + '/api/Drawing/UpdateDrawingDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectCode, facilityCode, drawingNo, userUpdate, keyUpdate, itemDrawingUpdate }),
    }
  ).then(res => res.json());
module.exports = UpdateDrawingDetailAPI;