import axios from 'axios';
import Cookies from 'js-cookie';

interface Token {
    model: string;
    pk: string;
    fields: {
        user: number;
        created: string;
        expires_at: string;
    }
}

class Auth {
    loggedIn() {
        const token = this.getToken();
        console.log("auth.ts 12 Token: " + JSON.stringify(token));
        return !token ? false : !this.isTokenExpired(token);
    }

    isTokenExpired(token: Token) {
        try {
            const expiration = new Date(token.fields.expires_at);
            const current = new Date();
            if (expiration < current) {
                localStorage.removeItem('odysseyToken');
            }
            return expiration < current;
        } catch (err) {
            return false;
        }
    }

    getToken() {
        const tokenString = localStorage.getItem('odysseyToken');
        const token = tokenString ? JSON.parse(tokenString) : undefined;
        return token;
    }

    async login(user: {username: string, password: string}, csrftoken: string | null | undefined) {
        try {
            const response = await axios.post('/api/users/login/', user, { headers: { 'X-CSRFToken': csrftoken }});
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
            await axios.post('/api/users/logout/', { user_id: token.fields.user }, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') }});
        }
        catch (err) {
            console.error(err);
        }
    }
}

export default new Auth;