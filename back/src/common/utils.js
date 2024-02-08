// some utility functions
import crypto from "node:crypto"
import fs from "node:fs/promises"

function randomId() {
    return crypto.randomUUID().slice(-8)
}

async function fileExists (path) {
    try {
        await fs.access(path)
        return true
    }
    catch (error) {
        return false
    }
}

export {
    randomId,
    fileExists
}
