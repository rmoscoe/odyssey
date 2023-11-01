import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function CSRFToken () {
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        const fetchCSRFToken = async () => {
            try {
                await axios.get('/api/csrf_cookie/');
            } catch (err) {
                console.error(err);
            }
        }

        fetchCSRFToken();
        const cookie = Cookies.get('csrftoken');
        cookie === null ? setCsrfToken('') : setCsrfToken(cookie ?? '');
    }, []);

    return (
        <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} className="csrf" />
    );
}