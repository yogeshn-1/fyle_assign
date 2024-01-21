const container=document.getElementById("repo_container")
const arr=[1,2,3,4,5]

const token="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"
const username="tomkerkhove"
const url = `https://api.github.com/users/${username}`;
const repoUrl=`${url}/repos`;
const headers = { Authorization: `token ${token}` };
const repoPerPage=10;

fetch(url,{headers})
    .then(res=>res.json())
    .then(userData => {
        console.log(userData)
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

fetch(repoUrl,{headers})
    .then(res=>res.json())
    .then(userRepo=>{
        console.log(userRepo)
        const container=document.getElementById("repo_container")
        const paginationContainer=document.getElementById("pagination_container")

        function displayPage(page){
            container.innerHTML = '';
            const startIndex = (page - 1) * perPage;
            const endIndex = startIndex + perPage;
            const reposToDisplay = userRepo.slice(startIndex, endIndex);
            reposToDisplay.forEach(repo => {
                const repoDiv = document.createElement('div');
                repoDiv.classList.add("m-2","p-2", "bg-info","border","border-1","repo_card","rounded-1")
                repoDiv.id = repo.id;
                repoDiv.innerHTML = `
                    <h5>${repo.name}</h5>
                    <p>${repo.description || 'No description available'}</p>
                `;
                container.appendChild(repoDiv);
            });
        }

        function createPageButtons() {
            const totalPages = Math.ceil(userRepo.length / repoPerPage);
            for (let i = 1; i <= totalPages; i++) {
                const button = document.createElement('button');
                button.classList.add('btn', 'btn-outline-primary', 'page-btn');
                button.textContent = i;
                button.addEventListener('click', () => displayPage(i));
                paginationContainer.appendChild(button);
            }
        }
        displayPage(1);
        createPageButtons()
    })
    .catch(error => {
        console.error(error);
    });

    