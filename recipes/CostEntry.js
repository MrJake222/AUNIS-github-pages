class CostEntry {
    constructor(name, count) {
        this.name = name
        this.count = count

        this.mainDiv = document.createElement("div")
        this.mainDiv.className = "costEntry"
        this.mainDiv.classList.add(this.getSpecialClass())

        this.nameDiv = document.createElement("div")
        this.nameDiv.className = "nameDiv"
        this.nameDiv.innerHTML = nameResolver.resolve(this.name)
        this.mainDiv.appendChild(this.nameDiv)

        this.countDiv = document.createElement("div")
        this.countDiv.className = "countDiv"
        
        if (this.name == "aunis:naquadah_shard")
            this.genNaquadahTooltip()

        if (this.name == "energy")
            this.countDiv.innerHTML = Number(this.count).toLocaleString()
        else
            this.countDiv.innerHTML = stacker.stack(this.count)

        this.mainDiv.appendChild(this.countDiv)
    }

    getSpecialClass() {
        if (this.name == "aunis:naquadah_shard")
            return "naquadahShards"

        if (this.name == "minecraft:ender_pearl")
            return "enderPearls"

        return null
    }

    genNaquadahTooltip() {
        const fortuneMapping = {
            // Mapping for how many shards drops from one ore (average)
            "Regular": 7,
            "Fortune I": 8.5,
            "Fortune II": 10,
            "Fortune III": 11.5,
            "Silk Touch + Crucible": 13.6
        }

        let tooltip = ""
        Object.keys(fortuneMapping).forEach(key => {
            let val = fortuneMapping[key]
            let oreCount = Math.ceil(this.count / val)
            tooltip += `${key}: ${oreCount} ores\n`
        })

        // this.nameDiv.title = tooltip
        this.countDiv.title = tooltip
    }

    getDiv() {
        return this.mainDiv
    }
}