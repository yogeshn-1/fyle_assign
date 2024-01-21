const container=document.getElementById("repo_container")
const arr=[1,2,3,4,5]

for (const iterator of arr) {
    const repo=document.createElement("div")
repo.classList.add("m-2", "h-25", "w-50", "bg-info","border","border-1")
    container.append(repo)
}
