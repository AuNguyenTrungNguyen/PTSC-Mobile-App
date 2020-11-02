import { Port_Server } from '../utils/Core';
const LoginAPI = async (username, password) => {
    var formBody = new URLSearchParams();
    formBody.append('grant_type', 'password');
    formBody.append('userName', username);
    formBody.append('password', password);
    return await fetch(
        Port_Server + '/Token',
        {
            method: 'POST',
            body: formBody.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        }
    ).then(res => res.json());
}
module.exports = LoginAPI;