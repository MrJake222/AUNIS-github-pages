class NameResolver {
    constructor() {
        this.missing = []
    }

    resolve(name) {
        if (name in langNames)
            return langNames[name]

        if (name in langNamesMinecraft)
            return langNamesMinecraft[name]

        this.missing.push(name)
        console.warn("Missing name mapping for " + name)
        return name
    }
}