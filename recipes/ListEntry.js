class ListEntry {
    constructor(recipe, reloadPageCallback) {
        this.recipe = recipe
        this.name = recipe.output
        this.reloadPageCallback = reloadPageCallback

        this.mainDiv = document.createElement("div")
        this.mainDiv.className = "listEntry"

        this.addButton = document.createElement("div")
        this.addButton.className = "addButton"
        this.addButton.innerText = "+"
        this.addButton.onclick = () => this.addButtonClicked()
        this.mainDiv.appendChild(this.addButton)

        this.nameDiv = document.createElement("div")
        this.nameDiv.className = "nameDiv"
        this.nameDiv.innerHTML = nameResolver.resolve(this.name)
        this.nameDiv.title = this.generateTitle()
        this.mainDiv.appendChild(this.nameDiv)

        // Output count (I think it'll confuse the people)
        // this.outCountDiv = document.createElement("div")
        // this.outCountDiv.className = "outCountDiv"
        // this.outCountDiv.innerHTML = "x" + this.recipe.quantity
        // this.mainDiv.appendChild(this.outCountDiv)
    }

    addButtonClicked() {
        // Toggle
        this.selected ^= true
        if (this.selected) this.count = 1
        this.reloadPageCallback()
    }

    countChanged() {
        this.count = this.numberInput.value
        this.reloadPageCallback()
    }

    setSelected(selected) {
        this.selected = selected

        if (selected) {
            this.mainDiv.classList.add("selected")
            this.addButton.innerText = "-"

            this.numberInput = document.createElement("input")
            this.numberInput.type = "number"
            this.numberInput.className = "numberInput"
            this.numberInput.onchange = () => this.countChanged()
            this.mainDiv.appendChild(this.numberInput)
        }

        else
            this.mainDiv.classList.remove("selected")
    }

    setSelectedAndCountFromParams(params) { 
        this.setSelected(params.has(this.name))

        if (this.selected) {
            this.count = params.get(this.name)
            this.numberInput.value = this.count
        }
    }

    generateTitle() {
        let title = "Ingredients required to craft " + this.recipe.quantity + " " + this.name + ":\n"

        Object.keys(this.recipe.input).forEach(key => {
            let count = this.recipe.input[key]
            title += key + ": " + count + "\n"
        })

        return title
    }

    getOverallCost() {
        let cost = {}
        let craftingsRequired = this.count / this.recipe.quantity

        Object.keys(this.recipe.input).forEach(key => {
            let count = this.recipe.input[key]
            count *= craftingsRequired

            if (!(key in cost))
                cost[key] = 0

            cost[key] += count
        })

        return cost

    }

    getDiv() {
        return this.mainDiv
    }
}