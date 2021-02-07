class SavedEntry {
    constructor(index, {name, selected}, reloadPageWithThis, reloadPageDefault) {
        this.index = index
        this.name = name
        this.selected = selected
        this.reloadPageWithThis = reloadPageWithThis
        this.reloadPageDefault = reloadPageDefault

        this.mainDiv = document.createElement("div")
        this.mainDiv.className = "savedEntry"

        this.nameDiv = document.createElement("div")
        this.nameDiv.className = "nameDiv"
        this.nameDiv.innerHTML = this.name
        this.mainDiv.appendChild(this.nameDiv)

        this.loadButton = document.createElement("div")
        this.loadButton.className = "loadButton"
        this.loadButton.innerHTML = "Load"
        this.loadButton.onclick = () => this.reloadPageWithThis(this)
        this.mainDiv.appendChild(this.loadButton)

        this.removeButton = document.createElement("div")
        this.removeButton.className = "removeButton"
        this.removeButton.innerHTML = "x"
        this.removeButton.onclick = () => this.remove()
        this.mainDiv.appendChild(this.removeButton)
    }

    remove() {
        let saved = JSON.parse(localStorage.getItem("saved"))
        saved.splice(this.index, 1)

        localStorage.setItem("saved", JSON.stringify(saved))
        this.reloadPageDefault()
    }

    getDiv() {
        return this.mainDiv
    }
}