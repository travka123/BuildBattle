const connectionStr = 'https://localhost:7208';

class ServerApi {

    static async signin(login, password) {

        const response = await fetch(`${connectionStr}/signin`, {
            method: 'POST',
            body : JSON.stringify({
                mode: 'cors',
                login : login,
                password : password,
            }),
            headers: {
                'Content-Type' : 'application/json'
            },
        });

        const data = await response.json();

        return {status: response.status, ...(response.status === 200 ? {token: data.jwt} : {})};
    }

    static async signup(login, password) {

        const response = await fetch(`${connectionStr}/signup`, {
            method: 'POST',
            body : JSON.stringify({
                mode: 'cors',
                login : login,
                password : password,
            }),
            headers: {
                'Content-Type' : 'application/json'
            },
        });

        const data = await response.json();

        return {status: response.status, ...(response.status === 200 ? {token: data.jwt} : {})};
    }
}

export default ServerApi;