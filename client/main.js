window.onload = function () {
    const signup = document.getElementById('signup');
    const signin = document.getElementById('signin');
    if (signup) {
        signup.onclick = signUp;
    }
    if (signIn) {
        signin.onclick = signIn;
    }
}

async function fetchUsers() {
    const response = await fetch('http://localhost:3000/user');
    const users = await response.json();

    console.log(users)
}


async function signUp(evt) {
    evt.preventDefault();
    console.log('-----------')
    const response = await fetch('http://localhost:3000/user', {
        method: 'POST',
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json();
    if (response.status === 200) {
        window.location.href = "index.html"
    } else {
        console.log(data.message);
        document.getElementById('error').innerHTML = data.message;
    }
}
async function signIn(evt) {
    evt.preventDefault();
    console.log("----------------------");
    const response = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
        }),
        headers: {
            'Content-Type': 'application/json',
            // authorization: localStorage.getItem("token")
        }
    })
    const data = await response.json();
    if (response.status === 200) {
        console.log(data.jwt)
        localStorage.setItem("token", data.jwt);
        window.location.href = "home.html"
    } else {
        console.log(data.message);
        document.getElementById('error').innerHTML = data.message;
    }

}
async function fetchUser() {
    const response = await fetch('http://localhost:3000/user/check', { headers: { authorization: localStorage.getItem("token") } })
    const user = await response.json();

}
