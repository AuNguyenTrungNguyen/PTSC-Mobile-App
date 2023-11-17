import { Port_Server } from '../../utils/Core';

export const GetQCCompletePercentAPI = (projectCode, drawingNo, sheet, rev, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetQCCompletePercent'
    + '?projectCode=' + projectCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&sheet=' + sheet
    + '&rev=' + rev,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const GetQCListAPI = (projectCode, facilityCode, drawingNo, weldNo, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetQCList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&weldNo=' + weldNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const GetQCListSubContractorAPI = (projectCode, subContractor, facilityCode, drawingNo, weldNo, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetQCListSubContractor'
    + '?projectCode=' + projectCode
    + '&subContractor=' + subContractor
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&weldNo=' + weldNo,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const GetCurrentQCInfoAPI = (projectCode, drawingNo, sheet, rev, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetCurrentQCInfo'
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

export const GetCurrentQCInfoSubContractorAPI = (projectCode, subContractor, drawingNo, sheet, rev, token) =>
    fetch(
      Port_Server
      + '/api/piping/GetCurrentQCInfoSubContractor'
      + '?projectCode=' + projectCode
      + '?subContractor=' + subContractor
      + '&drawingNo=' + encodeURIComponent(drawingNo)
      + '&sheet=' + sheet
      + '&rev=' + rev,
      {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      }).then(res => res.json());

export const GetQCDetailAPI = (projectCode, facilityCode, drawingNo, sheet, rev, code, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetQCDetail'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&sheet=' + sheet
    + '&rev=' + rev
    + '&code=' + code,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const GetQCDetailSubContractorAPI = (projectCode, subContractor, facilityCode, drawingNo, sheet, rev, code, token) =>
    fetch(
      Port_Server
      + '/api/piping/GetQCDetailSubContractor'
      + '?projectCode=' + projectCode
      + '&subContractor=' + subContractor
      + '&facilityCode=' + facilityCode
      + '&drawingNo=' + encodeURIComponent(drawingNo)
      + '&sheet=' + sheet
      + '&rev=' + rev
      + '&code=' + code,
      {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      }).then(res => res.json());

export const UpdateQCDetailAPI = (projectCode, facilityCode, userUpdate, code, listItemUpdate, token) =>
  fetch(
    Port_Server
    + '/api/piping/UpdateQCDetail',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectCode, facilityCode, userUpdate, code, listItemUpdate }),
    }
  ).then(res => res.json());

export const GetSpendListAPI = (projectCode, facilityCode, drawingNo, weldNo, siteLocaion, code, ndtFilter, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetSpendList'
    + '?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&weldNo=' + weldNo
    + '&siteLocation=' + siteLocaion
    + '&code=' + code
    + '&filterType=' + ndtFilter,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const GetSpendListSubContractorAPI = (projectCode, subContractor, facilityCode, drawingNo, weldNo, siteLocaion, code, ndtFilter, token) =>
  fetch(
    Port_Server
    + '/api/piping/GetSpendListSubContractor'
    + '?projectCode=' + projectCode
    + '&subContractor=' + subContractor
    + '&facilityCode=' + facilityCode
    + '&drawingNo=' + encodeURIComponent(drawingNo)
    + '&weldNo=' + weldNo
    + '&siteLocation=' + siteLocaion
    + '&code=' + code
    + '&filterType=' + ndtFilter,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const UpdateSpendListAPI = (projectCode, userUpdate, code, listItemUpdate, token) =>
  fetch(
    Port_Server
    + '/api/piping/UpdateSpendList',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectCode, userUpdate, code, listItemUpdate }),
    }
  ).then(res => res.json());