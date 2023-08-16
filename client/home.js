window.onload = function(){
    fetchUser();
    fetchPost();
}
async function fetchUser(evt){
    const response = await fetch('http://localhost:3000/user/check',{headers:{authorization: localStorage.getItem("token")}})
    const user = await response.json();

    console.log(user)
    if(!user.firstname){
        window.location.href = "profile.html"
    }
    const post = 
    document.getElementById('userPost').in
}
async function fetchPost(){
    const response  = await fetch('http://localhost:3000/user/post',{headers:{authorization: localStorage.getItem("token")}})
    const post = await response.json();
    console.log(post)
    document.getElementById('userPost').innerHTML = post.map((a)=>a.text);
}