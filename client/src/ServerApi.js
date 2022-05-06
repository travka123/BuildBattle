class ServerApi {

    static async signin(login, password) {

        const response = await fetch('https://localhost:7208/signin', {
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

        return {status: response.status, ...(response.status === 200 ? {token: await response.text()} : {})};
    }
}

export default ServerApi;