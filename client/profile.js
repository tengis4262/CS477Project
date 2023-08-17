window.onload = function () {
    fetchProfile();
    document.getElementById('updateUser').onclick = editProfile;
}


async function editProfile(evt) {
    evt.preventDefault();
    console.log('-----------')
    const body = {
        "email": document.getElementById('email').value,
        "firstname": document.getElementById('firstname').value,
        "lastname": document.getElementById('lastname').value,
        "pNumber": document.getElementById('pNumber').value,
        "address": document.getElementById('homeAdd').value,
    }
    console.log("body = ", body);
    const response = await sendRequest("/update", "POST", body)
    // const data = await response.json();
    console.log("res = ", response);
    if (response.firstname) {
        window.location.href = "home.html"
        alert("User updated Successfully")
    } else {
        // document.getElementById('error').innerHTML = "Please fiil out all the fields";
    }
}

async function fetchProfile() {
    const response = await sendRequest('/getUser', "GET", null);
    // const data = await response.json()
    document.getElementById('email').value = response.email || "";
    console.log(response);
    document.getElementById('firstname').value = response.firstname || "";
    document.getElementById('lastname').value = response.lastname || "";
    document.getElementById('pNumber').value = response.pNumber || "";
    document.getElementById('homeAdd').value = response.address || "";

}

async function sendRequest(path, method, body) {
    // console.log("sendRequest body = ",body ? JSON.stringify(body) : null )
    const response = await fetch('http://localhost:3000/user' + path, {
        method: method,
        body: body == null ? null :  JSON.stringify(body) ,
        headers: { authorization: localStorage.getItem("token"), 'Content-Type': 'application/json', }
    })
    const data = await response.json();
    return data;
}