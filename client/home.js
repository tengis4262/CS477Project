window.onload = function () {
    fetchUser();
    fetchPost();
    fetchUsers();
    document.getElementById('profile').onclick = goToProfile;
    document.getElementById('logout-btn').onclick = logOut;
    document.getElementById('addPost').onclick = addPost;
}


async function fetchUser(evt) {
    const response = await fetch('http://localhost:3000/user/check', { headers: { authorization: localStorage.getItem("token") } })
    const user = await response.json();

    if (!user.firstname) {
        console.log(user)
        window.location.href = "profile.html"
    }
    let html = `
    <h4>Welcome, ${user.firstname || ""}</h4>
    <p>Email: ${user.email || ""}</p>
    `
    document.getElementById('userWelcome').innerHTML = html;
}
async function followUsers(id) {
    const response = await sendRequest("user/follow", "POST", { userId: "" + id });
    fetchUsers();
    fetchPost();
    console.log(response);
}
function goToProfile() {
    window.location.href = "profile.html"
}
function logOut() {
    localStorage.removeItem('token')
    window.location.href = "index.html";
}
async function fetchUsers(evt) {
    const { users, mainUser } = await sendRequest('user', "GET", null);
    var result = document.getElementById('userList');
    result.innerHTML = "";
    const res = users.map(user => {
        let txt = mainUser.follows.includes(user._id) ? "Unfollow" : "Follow";
        result.innerHTML += `
        <li>
    <i class="fas fa-user"></i>${user.firstname}, ${user.lastname}
    <br>
    <span class="username">@${user.username}</span>
    <button id="followButton" class="follow-btn" onclick="followUsers('${user._id}')">${txt}</button>
</li>

        
    `;
    }
    );

}
async function fetchPost() {
    const post = await sendRequest('user/post', "GET", null);
    let div = document.getElementById('userPost');
    console.log(post)
    div.innerHTML = "";
    post.map(({ _id, text, user, createdAt, like, comments }) => {
        const firstname = user.firstname;
        const formattedDate = new Date(createdAt).toLocaleString(); // You can adjust the date format as needed

        div.innerHTML += `
        <div class="user-info">
            <span class="user-name">${firstname} </span></br>
            <span class="pororo">@${user.username}</span>
            <span class="post-date">${formattedDate}</span>
            </div>
            <p class="post-content">${text}</p>
            <div class="post-actions">
            <button class="like-btn" onclick ="like('${_id}')"><i class="far fa-heart"></i> ${like} Like</button>
            <button class="comment-btn" onclick="openCommentPopup('${_id}')"><i class="far fa-comment"></i> ${comments.length} Comment</button>
        </div>
    </br>
    `;
    });
}


function openCommentPopup(id) {
    document.getElementById("commentPopup").style.display = "block";
    console.log(id);
    document.getElementById("submitComment").onclick = () => submitComment(id);
}
function closeCommentPopup() {
    document.getElementById("commentPopup").style.display = "none";
}
async function submitComment(id) {
    // Retrieve the comment from the textarea
    const commentText = document.getElementById("commentTextarea").value;
    console.log("id isequals", id);
    // Build the request payload
    const payload = {
        comment: commentText
    };
    document.getElementById("commentTextarea").value = "";
    // Send the POST request to add the comment
    const response = await sendRequest(`user/post/${id}/comment`, "POST", payload);

    // Check for success
    if (response === "Success") {
        await fetchPost(); // Refresh the posts to display the updated comment count
    } else {
        alert("An error occurred while posting your comment. Please try again.");
    }

    // Close the comment popup
    closeCommentPopup();
}
async function like(id) {
    // console.log(id);
    await sendRequest("user/post/" + id, "POST");
    await fetchPost();
}

async function sendRequest(path, method, body) {
    const response = await fetch('http://localhost:3000/' + path, {
        method: method,
        body: body ? JSON.stringify(body) : null,
        headers: { authorization: localStorage.getItem("token"), 'Content-Type': 'application/json' }
    })
    const data = await response.json();
    return data;
}

async function addPost() {
    const response = await sendRequest("user/post", "POST", { text: document.getElementById("newPost").value });
    fetchPost();
}