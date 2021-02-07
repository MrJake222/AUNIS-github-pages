listEntries = []
nameResolver = new NameResolver()
stacker = new Stacker()

window.onload = () => {
    // Load URL params
    let url = new URL(window.location);
    let params = new URLSearchParams(url.search.slice(1));

    let searchQuery = params.get("search")
    if (searchQuery == null)
        searchQuery = ""

    document.getElementById("search").value = searchQuery

    // Add all recipes to listEntries
    Object.values(recipes).forEach((recipe) => {
        let entry = new ListEntry(recipe, () => reloadPageDefault())
        entry.setSelectedAndCountFromParams(params)
        listEntries.push(entry)
    })

    loadResults()
    loadList(searchQuery)
    loadSaved()
}

function loadResults() {
    let overallCost = {}

    listEntries
        .filter(entry => entry.selected)
        .forEach((entry) => {
            let cost = entry.getOverallCost()
            // console.log(entry.name, entry.count, cost)

            Object.keys(cost).forEach(key => {
                let count = cost[key]

                if (!(key in overallCost))
                    overallCost[key] = 0

                overallCost[key] += count
            })
        })

    // a[0] - name
    // a[1] - count
    // overallCost is now an array
    overallCost = Object.entries(overallCost)

    let costElement = document.getElementById("overallCost")
    let addFunc = (tab) => {
        let key = tab[0]
        let count = Math.round(tab[1])
        let costEntry = new CostEntry(key, count)
        costElement.appendChild(costEntry.getDiv())
    }

    // Add all except energy
    overallCost
        .filter(a => a[0] != "energy")
        .sort((a, b) => (a[1] < b[1]))
        .forEach((tab) => addFunc(tab))

    // Add energy
    overallCost
        .filter(a => a[0] == "energy")
        .forEach(tab => addFunc(tab))
}

function loadList(filter) {
    list = document.getElementById("list")
    list.innerHTML = ""

    listEntries
        .filter(entry => entry.selected)
        .sort((a, b) => a.name > b.name)
        .forEach((entry) => {
            list.appendChild(entry.getDiv())
        })

    listEntries
        // .filter(entry => !entry.selected && entry.name.toLowerCase().includes(filter.toLowerCase()))
        .filter(entry => entry.name.toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => a.name > b.name)
        .forEach((entry) => {
            list.appendChild(entry.getDiv())
        })
}

function loadSaved() {
    let saved = JSON.parse(localStorage.getItem("saved"))
    if (saved == null)
        return
    
    let savedDiv = document.getElementById("saved")

    // Saved is an array of objects like {"name": name, "selected": selected}
    for (let index=0; index<saved.length; index++) {
        data = saved[index]

        let entry = new SavedEntry(index, data, (entry) => {
            // Reload page callback
            // Called when Load button pressed
            reloadPage(document.getElementById("search").value, entry.selected)
        }, () => reloadPageDefault())
        savedDiv.appendChild(entry.getDiv())
    }
}

function reloadPageDefault() {
    reloadPageSelected(document.getElementById("search").value)
}

function reloadPageSelected(searchQuery) {
    let selectedEntries = listEntries.filter(entry => entry.selected)
    reloadPage(searchQuery, selectedEntries)
}

function reloadPage(searchQuery, selectedEntries) {
    let params = new URLSearchParams()

    // Add selected items (don't care about the previous URL, they are selected in onload)
    for (let i=0; i<selectedEntries.length; i++) {
        let entry = selectedEntries[i]
        params.append(entry.name, entry.count);
    }

    // Add search query
    params.set("search", searchQuery)

    window.location = window.location.toString().split("?")[0] + "?" + params.toString()
}

function onSearchSubmit(event) {
    reloadPageDefault()
    return false
}

function clearSearch(event) {
    reloadPageSelected("")
    return false
}

function clearSelected(event) {
    reloadPage(document.getElementById("search").value, [])
}

function costSave() {
    let selected = listEntries
        .filter(entry => entry.selected)
        .map(entry => ({"name": entry.name, "count": entry.count}))

    let saved = JSON.parse(localStorage.getItem("saved"))
    if (saved == null)
        saved = []
    
    let name = prompt("Name")
    let obj = {
        "name": name,
        "selected": selected
    }

    saved.push(obj)
    localStorage.setItem("saved", JSON.stringify(saved))

    reloadPageDefault()
}
