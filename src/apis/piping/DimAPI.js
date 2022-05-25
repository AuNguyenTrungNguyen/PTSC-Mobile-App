import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';

export const GetCurrentDimCuttingInfoAPI = (projectCode, drawingNo, sheet, rev, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetCurrentDimCuttingInfo'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + drawingNo
    + '&sheet=' + sheet
    + '&rev=' + rev,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const GetDimCuttingListAPI = (projectCode, facilityCode, drawingNo, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetDimCuttingList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + drawingNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const GetDimCuttingDetailAPI = async (projectCode, drawingNo, sheet, rev, token) => {
  return fetch(
    Port_Server
    + '/api/piping/GetDimCuttingDetail'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + drawingNo
    + '&sheet=' + sheet
    + '&rev=' + rev,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
};

export const UpdateDimCuttingDetailAPI = (userUpdate, listItemUpdate, location, team, token) =>
  fetch(
    Port_Server
    + '/api/piping/UpdateDimCuttingDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userUpdate, listItemUpdate, location, team }),
    }
  ).then(res => res.json());