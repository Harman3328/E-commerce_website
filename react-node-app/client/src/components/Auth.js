import Cookies from 'universal-cookie';
import axios from 'axios';

export async function checkLogin() {
  const api = axios.create({
    baseURL: 'http://localhost:3001',
    withCredentials: true
  });

  try {
    const response = await api.get('/verifyaccesstoken');

    if (response.data.isValid) {
      return response.data.isValid;
    } else {
      const resp = await api.get('/verifyRefreshToken');

      if (resp.data.success) {
        const cookies = new Cookies();
        cookies.set('accessToken', resp.data.accessToken, {
          path: '/', httpOnly: false,
          secure: true
        });
        return resp.data.success;
      } else {
        return resp.data.success;
      }
    }
  } catch (error) {
    console.log(error);
  }
}
