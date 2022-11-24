import { Port_Server } from '../../utils/Core';
import Helper from '../../utils/Helper';

export const GetObservationOverviewListAPI = (projectCode, discipline, id, description, token) =>
  fetch(
    Port_Server
    + '/api/QA/GetObservationOverviewList'
    + '?projectCode=' + projectCode
    + '&discipline=' + discipline
    + '&id=' + id
    + '&description=' + description,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const GetObservationListAPI = (projectCode, userLogin, token) =>
  fetch(
    Port_Server
    + '/api/QA/GetObservationList'
    + '?projectCode=' + projectCode
    + '&userLogin=' + userLogin,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const GetObservationDisciplineAPI = (projectCode, token) =>
  fetch(
    Port_Server
    + '/api/QA/GetObservationDiscipline'
    + '?projectCode=' + projectCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const GetObservationCategoryAPI = (projectCode, disciplineCode, token) =>
  fetch(
    Port_Server
    + '/api/QA/GetObservationCategory'
    + '?projectCode=' + projectCode
    + '&disciplineCode=' + disciplineCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const GetObservationSubjectionAPI = (projectCode, disciplineCode, token) =>
  fetch(
    Port_Server
    + '/api/QA/GetObservationSubjection'
    + '?projectCode=' + projectCode
    + '&disciplineCode=' + disciplineCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const GetObservationProcessPeriodAPI = (projectCode, disciplineCode, token) =>
  fetch(
    Port_Server
    + '/api/QA/GetObservationProcessPeriod'
    + '?projectCode=' + projectCode
    + '&disciplineCode=' + disciplineCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const GetObservationRelevantTeamAPI = (projectCode, disciplineCode, token) =>
  fetch(
    Port_Server
    + '/api/QA/GetObservationRelevantTeam'
    + '?projectCode=' + projectCode
    + '&disciplineCode=' + disciplineCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const GetObservationRootCauseAPI = (projectCode, disciplineCode, token) =>
  fetch(
    Port_Server
    + '/api/QA/GetObservationRootCause'
    + '?projectCode=' + projectCode
    + '&disciplineCode=' + disciplineCode,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());

export const CreateOrUpdateObservationAPI = (model, token) =>
  fetch(
    Port_Server
    + '/api/QA/CreateOrUpdateObservation',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model }),
    }
  ).then(res => res.json());

export const DeleteObservationAPI = (projectCode, id, token) =>
  fetch(
    Port_Server
    + '/api/QA/DeleteObservation',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectCode, id }),
    }
  ).then(res => res.json());

export const GetObservationImageAPI = (tableRowIndex, token) =>
  fetch(
    Port_Server
    + '/api/QA/GetObservationImage'
    + '?tableRowIndex=' + tableRowIndex,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

export const DeleteObservationImageAPI = (id, token) =>
  fetch(
    Port_Server
    + '/api/QA/DeleteObservationImage',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    }
  ).then(res => res.json());

export const EditObservationImageAPI = (id, note, token) =>
  fetch(
    Port_Server
    + '/api/QA/EditObservationImage',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, note }),
    }
  ).then(res => res.json());


export const GetWelderListAPI = async (id, name) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/QA/GetWelderList'
    + '?id=' + id
    + '&name=' + name,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};

export const GetCertificateListAPI = async (id, project) => {
  const token = await Helper.getData('TOKEN');
  return fetch(
    Port_Server
    + '/api/QA/GetCertificateList'
    + '?id=' + id
    + '&projectCode=' + project,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
};
