import axios from 'axios';
import './axiosInterceptor';
import config from '../../config';

export default {
  getToken(payload) {
    const data = JSON.stringify({
      name: payload.username,
      pass: payload.password,
    });

    const config = JSON.stringify({
      headers: {
        'Content-Type': 'application/json',
      },
    });

    localStorage.clear();

    return axios.post('http://interview.agileengine.com/auth/', data, config)
      .then((res) => {
        localStorage.setItem('loggedIn', true);
        localStorage.setItem('username', payload.username);
        localStorage.setItem('auth_token', btoa(`${payload.username}:${payload.password}`));
        // @todo: This redirect should be done by vue-router.
        window.location.href = '/';
        Promise.resolve(res.data);
      })
      .catch(({ error }) => {
        localStorage.setItem('loggedIn', false);
        console.log('Issue with login');
        Promise.reject(error);
      });
  },

  addTodo(payload) {
    return axios.post('${BASE_API_URL}/api/v1/todos?_format=json', { title: payload.title, status: false })
      .then((response) => Promise.resolve(response.data))
      .catch((error) => Promise.reject(error));
  },

  editTodo({ id, title, status }) {
    return axios.patch('${BASE_API_URL}/api/v1/todos/${id}?_format=json', { title, status })
      .then((response) => Promise.resolve(response.data))
      .catch((error) => Promise.reject(error));
  },

  removeTodo(id) {
    return axios.delete('${BASE_API_URL}/api/v1/todos/${id}?_format=json')
      .then((response) => Promise.resolve(response.data))
      .catch((error) => Promise.reject(error));
  },

  getTodos() {
    return axios.get('${BASE_API_URL}/api/v1/todos/all?_format=json')
      .then((response) => Promise.resolve(response.data))
      .catch((error) => Promise.reject(error));
  },
};
