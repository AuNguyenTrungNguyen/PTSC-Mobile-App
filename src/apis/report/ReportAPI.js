import { Port_Server } from '../../utils/Core';

export const GetConstructionDisciplineListAPI = (projectCode, token) =>
  fetch(
    Port_Server + '/api/Reports/GetConstructionDisciplineList?projectCode=' + projectCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      }
    }
  ).then(res => res.json());

export const GetConstructionFacilityListAPI = (projectCode, token) =>
  fetch(
    Port_Server + '/api/Reports/GetConstructionFacilityList?projectCode=' + projectCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      }
    }
  ).then(res => res.json());

export const GetConstructionListAPI = async (projectCode, facilityCode, disciplineCode, token) =>
  fetch(
    Port_Server
    + '/api/Reports/GetConstructionList?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode
    + '&disciplineCode=' + disciplineCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const GetDisciplineListByFacilityAPI = (projectCode, facilityCode, token) =>
  fetch(
    Port_Server
    + '/api/Reports/GetDisciplineListByFacility?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const GetSumFacilityAPI = (projectCode, facilityCode, token) =>
  fetch(
    Port_Server
    + '/api/Reports/GetSumFacility?projectCode=' + projectCode
    + '&facilityCode=' + facilityCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const GetHistogramListAPI = (projectCode, token) =>
  fetch(
    Port_Server + '/api/Reports/GetHistogramList?projectCode=' + projectCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      }
    }
  ).then(res => res.json());

export const GetManpowerListAPI = (projectCode, username, date, token) =>
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
    }
  ).then(res => res.json());