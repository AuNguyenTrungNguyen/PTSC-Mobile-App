import { sub } from 'react-native-reanimated';
import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';

export const GetCurrentDimCuttingInfoAPI = (projectCode, drawingNo, sheet, rev, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetCurrentDimCuttingInfo'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&sheet=' + sheet
    + '&rev=' + rev,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
export const GetCurrentDimCuttingInfoSubContractorAPI = (projectCode, subContractor, drawingNo, sheet, rev, token) =>
    fetch(
      Port_Server
      + '/api/piping/GetCurrentDimCuttingInfoSubContractor'
      + '?projectCode=' + projectCode
      + '&subContractor=' + subContractor
      + '&drawingNo=' + encodeURIComponent(drawingNo)
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
    + '&drawingNo=' + encodeURIComponent(drawingNo),
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
export const GetDimCuttingListSubContractorAPI = (projectCode, subContractor, facilityCode, drawingNo, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetDimCuttingSubContractorList'
    + '?projectCode=' + projectCode
    + '&subContractor=' + subContractor
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + encodeURIComponent(drawingNo),
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
export const GetDimCuttingDetailAPI = (projectCode, drawingNo, sheet, rev, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetDimCuttingDetail'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&sheet=' + sheet
    + '&rev=' + rev,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
  export const GetDimCuttingDetailSubContractorAPI = (projectCode, subContractor, drawingNo, sheet, rev, token) =>
    fetch(
      Port_Server
      + '/api/piping/GetDimCuttingSubContractorDetail'
      + '?projectCode=' + projectCode
      + '&subContractor=' + subContractor
      + '&drawingNo=' + encodeURIComponent(drawingNo)
      + '&sheet=' + sheet
      + '&rev=' + rev,
      {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      }).then(res => res.json());
export const UpdateDimCuttingDetailAPI = (projectCode, drawingNo, sheet, rev, userUpdate, listItemUpdate, listSecondUpdate, location, team, token) =>
  fetch(
    Port_Server
    + '/api/piping/UpdateDimCuttingDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectCode, drawingNo, sheet, rev, userUpdate, listItemUpdate, listSecondUpdate, location, team }),
    }
  ).then(res => res.json());

export const GetDimCuttingQCListAPI = (projectCode, drawingNo, weldNo, location, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetDimCuttingQCList'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&weldNo=' + weldNo
    + '&location=' + location,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
export const UpdateDimCuttingQCListAPI = (projectCode, userUpdate, listItemUpdate, token) =>
  fetch(
    Port_Server
    + '/api/piping/UpdateDimCuttingQCList',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectCode, userUpdate, listItemUpdate }),
    }
  ).then(res => res.json());