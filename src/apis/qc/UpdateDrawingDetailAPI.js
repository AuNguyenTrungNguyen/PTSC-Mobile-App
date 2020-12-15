import { Port_Server } from '../..//utils/Core';
const UpdateDrawingDetailAPI = (projectCode, facilityCode, drawingNo, keyUpdate, itemQCDrawingUpdate, token) =>
  fetch(
    Port_Server + '/api/QCUpdate/UpdateDrawingDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectCode, facilityCode, drawingNo, keyUpdate, itemQCDrawingUpdate }),
    }
  ).then(res => res.json());
module.exports = UpdateDrawingDetailAPI;