class CostEntry {
    constructor(name, count) {
        this.name = nameResolver.resolve(name)
        this.count = count

        this.mainDiv = document.createElement("div")
        this.mainDiv.className = "costEntry"

        this.nameDiv = document.createElement("div")
        this.nameDiv.className = "nameDiv"
        this.nameDiv.innerHTML = this.name
        this.mainDiv.appendChild(this.nameDiv)

        this.countDiv = document.createElement("div")
        this.countDiv.className = "countDiv"
        this.countDiv.innerHTML = Number(this.count).toLocaleString()
        this.mainDiv.appendChild(this.countDiv)
    }

    getDiv() {
        return this.mainDiv
    }
}