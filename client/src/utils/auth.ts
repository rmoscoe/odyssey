import axios from 'axios';
import Cookies from 'js-cookie';

interface Token {
    key: string;
    expires_at: string;
}

class Auth {
    loggedIn() {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    isTokenExpired(token: Token) {
        try {
            const expiration = new Date(token.expires_at);
            const current = new Date();
            return expiration < current;
        } catch (err) {
            return false;
        }
    }

    getToken() {
        const tokenString = localStorage.getItem('odysseyToken');
        return tokenString ? JSON.parse(tokenString) : null;
    }

    async login(user: {username: string, password: string}, csrftoken: string | null | undefined) {
        try {
            const response = await axios.post('/api/users/login/', user, { headers: { 'X-CSRFToken': csrftoken }});
            console.log(response);
            const token = response.data.token;
            localStorage.setItem('odysseyToken', JSON.stringify(token));
            return token;
        } catch (err) {
            return null;
        }
    }

    async logout() {
        try {
            const token = this.getToken();
            localStorage.removeItem('odysseyToken');
            await axios.post('/api/users/logout/', { user_id: token.user_id }, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') }});
        }
        catch (err) {
            console.error(err);
        }
    }
}

export default new Auth;