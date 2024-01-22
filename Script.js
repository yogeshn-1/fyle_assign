const repoContainer=document.getElementById("repo_container")
const paginationContainer=document.getElementById("pagination_container")

const token="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"
const username="UlisesGascon"
const url = `https://api.github.com/users/${username}`;
const repoUrl=`${url}/repos?page=1&per_page=100`;
const repoTagUrl = `https://api.github.com/repos/${username}`;
const headers = { Authorization: `token ${token}` };

let repoPerPage=10;
let userRepoGlobal=null
let repoTopic=null

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

function displayPage(page){
    repoContainer.innerHTML = '';
    const startIndex = (page - 1) * repoPerPage;
    const endIndex = startIndex + repoPerPage;
    const reposToDisplay = userRepoGlobal.slice(startIndex, endIndex);
    reposToDisplay.forEach(repo => {
        const repoDiv = document.createElement('div');
        repoDiv.classList.add("m-2","p-2", "bg-success-subtle","border","border-1","repo_card","rounded-1")
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
    const totalPages = Math.ceil(userRepoGlobal.length / repoPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-outline-primary', 'page-btn');
        button.textContent = i;
        button.addEventListener('click', () => displayPage(i));
        paginationContainer.appendChild(button);
    }
}

fetch(repoUrl,{headers})
    .then(res=>res.json())
    .then(userRepo=>{
        userRepoGlobal=userRepo
        console.log(userRepoGlobal)
        displayPage(1);
        createPageButtons()
    })
    .catch(error => {
        console.error(error);
    });

let repoCount=document.getElementById("repo_per_page")
repoCount.addEventListener("change",function(e){
    repoPerPage=e.target.value
    displayPage(1)
    createPageButtons()
})

document.addEventListener('DOMContentLoaded', function () {
    const repoSelect = document.getElementById('repo_per_page');
    repoSelect.selectedIndex = 0;
});