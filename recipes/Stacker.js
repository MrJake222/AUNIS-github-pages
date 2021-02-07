class Stacker {
    stack(count) {
        // return count

        let stacks = Math.floor(count / 64)
        let remaining = count % 64

        let output = ""

        if (stacks > 1)
            output += `${stacks} stacks`
        else if (stacks > 0)
            output += `${stacks} stack`

        if (remaining > 0) {
            if (stacks > 0)
                output += " + "

            output += `${remaining}`
        }

        return output
    }
}