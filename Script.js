const repoContainer=document.getElementById("repo_container")
const paginationContainer=document.getElementById("pagination_container")

const token="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"
const username="UlisesGascon"
const url = `https://api.github.com/users/${username}`;
const baserepoUrl=`${url}/repos`;
const initialRepo=`${baserepoUrl}?page=1&per_page=10`;
const repoTagUrl = `https://api.github.com/repos/${username}`;
const headers = { Authorization: `token ${token}` };

let repoPerPage=10;
let userRepoGlobal=null
let repoTopic=null
let currentPage=1

fetch(url,{headers})
    .then(res=>res.json())
    .then(userData => {
    const userInfoElement = document.getElementById('owner_name');
    userInfoElement.innerHTML = `${userData.name}`;

    const userBio=document.getElementById("owner_bio")
    userBio.innerHTML=`${userData.bio}`;

    const userImage=document.getElementById("owner_img")
    userImage.setAttribute("src",`${userData.avatar_url}`)

    const userUrl=document.getElementById("owner_url")
    userUrl.innerHTML=`${userData.blog}`

    const userLocation=document.getElementById("owner_address")
    userLocation.innerHTML=`${userData.location}`

})
.catch(error => {
    console.error(error);
});

function fetchRepo(url){
    fetch(url,{headers})
    .then(res=>res.json())
    .then(userRepo=>{
        userRepoGlobal=userRepo
        displayRepo()
        createPageButtons()
    })
    .catch(error => {
        console.error(error);
    });
}

function getTags(repo,tagdiv){
    fetch(`${repoTagUrl}/${repo.name}/topics`, { headers })
        .then(res => res.json())
        .then(topics => {
            repoTopic=topics
            repoTopic.names.forEach(name=>{
            tagdiv.innerHTML+=`
            <span class="mx-1 p-1 bg-body-tertiary rounded-1 fs-6" role="button">${name}<span>
            `})
        })
        .catch(error => {
            console.error('Error fetching topics:', error);
         })
}

function displayRepo(){
    repoContainer.innerHTML = '';
    userRepoGlobal.forEach(repo => {
        const repoDiv = document.createElement('div');
        repoDiv.classList.add("m-2","p-2", "bg-success-subtle","repo_card","rounded-1","d-flex","flex-column","justify-content-center")
        repoDiv.id = repo.id;
        repoDiv.innerHTML = `
            <h5>${repo.name}</h5>
            <p>${repo.description || 'No description available'}</p>
        `;
        const tagdiv=document.createElement('div');
        tagdiv.classList.add("d-flex","m-0")
        getTags(repo,tagdiv)
        repoDiv.appendChild(tagdiv)
        repoContainer.appendChild(repoDiv);
    });
}

function createPageButtons() {
    paginationContainer.innerHTML=''
    const totalPages = repoPerPage==10?10:repoPerPage==20?5:repoPerPage==50?2:1;
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-outline-primary', 'page-btn');
        button.textContent = i;
        button.addEventListener('click', () => {
            currentPage = i;
            repoUrl=baserepoUrl+`?page=${i}`+`&per_page=${repoPerPage}`
            fetchRepo(repoUrl)
        });
        if (i === currentPage) {
            button.classList.add('active');
        }
        paginationContainer.appendChild(button);
    }
}

let repoCount=document.getElementById("repo_per_page")
repoCount.addEventListener("change",function(e){
    repoPerPage=e.target.value
    currentPage=1
    repoUrl=baserepoUrl+`?page=${currentPage}`+`&per_page=${repoPerPage}`
    fetchRepo(repoUrl)
})

document.addEventListener('DOMContentLoaded', function () {
    const repoSelect = document.getElementById('repo_per_page');
    repoSelect.selectedIndex = 0;
});

fetchRepo(initialRepo)
