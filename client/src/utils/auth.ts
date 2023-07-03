import axios from 'axios';

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

    async login(user: {username: string, password: string}) {
        try {
            const response = await axios.post('/api/users/login', user);
            const token = response.data.token;
            localStorage.setItem('odysseyToken', JSON.stringify(token));
            return token;
        } catch (err) {
            return null;
        }
    }

    logout() {
        localStorage.removeItem('odysseyToken');
    }
}

export default new Auth;