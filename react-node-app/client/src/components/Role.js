import axios from 'axios';

export async function getRole() {
    const api = axios.create({
        baseURL: 'http://localhost:3001',
        withCredentials: true
    })
    try {
        const response = await api.get('/getrole');
        return response.data.permission; 
        
    } catch (error) {
        console.log(error)
    }
}