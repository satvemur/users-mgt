import axios from 'axios';

export class UserService {
    
    getUsers() {
        return axios.get('/dbusers/all')
            .then(res => res.data);
    }
    saveUser(user) {
        return axios.post('/dbusers/save', user).then(res => res.data);
    }
    deleteUser(id) {
        return axios.delete('/dbusers/removeUser/'+ id).then(res => res.data);
    }
    deleteAllUsers() {
        return axios.delete('/dbusers/removeall').then(res => res.data);
    }
}