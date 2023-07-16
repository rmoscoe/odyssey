import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CSRFToken () {
    const [csrfToken, setCsrfToken] = useState('');

    function getCookie(name: string) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    
    useEffect(() => {
        const fetchCSRFToken = async () => {
            try {
                await axios.get('/api/csrf_cookie/');
            } catch (err) {
                console.error(err);
            }
        }

        fetchCSRFToken();
        const cookie = getCookie('csrftoken');
        cookie === null ? setCsrfToken('') : setCsrfToken(cookie);
    }, []);

    return (
        <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} className="csrf" />
    );
}