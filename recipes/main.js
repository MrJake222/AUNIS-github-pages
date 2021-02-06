listEntries = []
nameResolver = new NameResolver()

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
        let entry = new ListEntry(recipe, () => reloadPage(searchQuery))
        entry.setSelectedAndCountFromParams(params)
        listEntries.push(entry)
    })

    loadResults()
    loadList(searchQuery)
}

function loadResults() {
    let overallCost = {}

    listEntries
        .filter(entry => entry.selected)
        .sort((a, b) => a.name > b.name)
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

    overallCost = Object.entries(overallCost)
        .sort((a, b) => a[1] < b[1])

    // overallCost is now an array
    let costElement = document.getElementById("overallCost")
    overallCost.forEach((tab) => {
        let key = tab[0]
        let count = Math.round(tab[1])
        let costEntry = new CostEntry(key, count)
        costElement.appendChild(costEntry.getDiv())
    })
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

function reloadPage(searchQuery) {
    let params = new URLSearchParams()

    // Add selected items (don't care about the previous URL, they are selected in onload)
    let selectedEntries = listEntries.filter(entry => entry.selected)
    for (let i=0; i<selectedEntries.length; i++) {
        let entry = selectedEntries[i]
        params.append(entry.name, entry.count);
    }

    // Add search query
    params.set("search", searchQuery)

    window.location = window.location.toString().split("?")[0] + "?" + params.toString()
}

function onSearchSubmit(event) {
    let searchQuery = document.getElementById("search").value
    reloadPage(searchQuery)
    return false
}
