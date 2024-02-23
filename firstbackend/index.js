const express=require("express")
require('dotenv').config()
const app=express()
// const port=3000;

const githubdata={
    "login": "RadheyMugdal",
    "id": 99124293,
    "node_id": "U_kgDOBeiERQ",
    "avatar_url": "https://avatars.githubusercontent.com/u/99124293?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/RadheyMugdal",
    "html_url": "https://github.com/RadheyMugdal",
    "followers_url": "https://api.github.com/users/RadheyMugdal/followers",
    "following_url": "https://api.github.com/users/RadheyMugdal/following{/other_user}",
    "gists_url": "https://api.github.com/users/RadheyMugdal/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/RadheyMugdal/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/RadheyMugdal/subscriptions",
    "organizations_url": "https://api.github.com/users/RadheyMugdal/orgs",
    "repos_url": "https://api.github.com/users/RadheyMugdal/repos",
    "events_url": "https://api.github.com/users/RadheyMugdal/events{/privacy}",
    "received_events_url": "https://api.github.com/users/RadheyMugdal/received_events",
    "type": "User",
    "site_admin": false,
    "name": "Radhey Mugdal",
    "company": null,
    "blog": "",
    "location": null,
    "email": null,
    "hireable": null,
    "bio": null,
    "twitter_username": null,
    "public_repos": 5,
    "public_gists": 0,
    "followers": 0,
    "following": 0,
    "created_at": "2022-02-06T12:01:06Z",
    "updated_at": "2024-01-27T06:51:08Z"
  }
app.get('/',(req,res)=>{
    res.send('Hello World')
})
app.get('/twitter',(req,res)=>{
    res.send('RadheyMugdal Twitter Home Page')
})

app.get('/login',(req,res)=>{
    res.send("<h1>Login to use App</h1>")
})

app.get('/github',(req,res)=>{
    res.json(githubdata)
})
app.listen(process.env.P,()=>{
    console.log(`Example app  listning on port ${port}`);
})