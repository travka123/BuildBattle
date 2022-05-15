const connectionStr = 'https://localhost:7208';

class ServerApi {

    constructor(jwt) {

        this.jwt = jwt;
    }

    static async signin(login, password) {

        const response = await fetch(`${connectionStr}/signin`, {
            method: 'POST',
            mode: 'cors',
            body : JSON.stringify({
                login : login,
                password : password,
            }),
            headers: {
                'Content-Type' : 'application/json'
            },
        });

        return {status: response.status, ...(response.status === 200 ? {token: (await response.json()).jwt} : {})};
    }

    static async signup(login, password) {

        const response = await fetch(`${connectionStr}/signup`, {
            method: 'POST',
            mode: 'cors',
            body : JSON.stringify({
                login : login,
                password : password,
            }),
            headers: {
                'Content-Type' : 'application/json'
            },
        });

        return {status: response.status, ...(response.status === 200 ? {token: (await response.json()).jwt} : {})};
    }

    async stats() {

        const response = await fetch(`${connectionStr}/stats`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${this.jwt}`
            }
        });

        return {status: response.status, ...(response.status === 200 ? {stats: (await response.json())} : {})};
    }

    async history() {

        const response = await fetch(`${connectionStr}/history`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${this.jwt}`
            }
        });

        return {status: response.status, ...(response.status === 200 ? {history: (await response.json())} : {})};
    }
}

export default ServerApi;