import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:7027/api';

export const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
}); 