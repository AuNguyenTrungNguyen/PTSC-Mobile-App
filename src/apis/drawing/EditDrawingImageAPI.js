import { Port_Server } from '../../utils/Core';
const EditDrawingImageAPI = (id, note, token) =>
  fetch(
    Port_Server + '/api/Drawing/EditDrawingImage',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, note }),
    }
  ).then(res => res.json());
module.exports = EditDrawingImageAPI;