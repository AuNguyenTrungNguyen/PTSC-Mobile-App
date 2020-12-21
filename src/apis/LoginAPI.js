import { Port_Server } from '../utils/Core';
import RNFetchBlob from 'rn-fetch-blob';
const LoginAPI = async (username, password) => {
  var formBody = new URLSearchParams();
  formBody.append('grant_type', 'password');
  formBody.append('userName', username);
  formBody.append('password', password);
  return await RNFetchBlob
    .config({
      trusty: true
    })
    .fetch(
      'POST',
      Port_Server + '/Token',
      {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      formBody.toString(),
    );
}
module.exports = LoginAPI;