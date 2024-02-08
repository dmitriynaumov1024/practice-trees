import express from "express"
import fs from "node:fs"

// stolen from
// https://www.npmjs.com/package/async-error-catcher?activeTab=code
function catchErrors (func) {
    if (!(func instanceof Function)) {
        throw new Error("func must be instance of Function")
    }

    return function (req, res, next, ...rest) {
        let promise = func(req, res, next, ...rest)
        if (promise?.catch) promise.catch(err => next(err))
    }
}

const httpMethods = [ "all", "get", "post", "put", "patch", "delete" ]

class Router 
{
    constructor (router) {
        this.router = router || express.Router()
        for (let method of httpMethods) {
            this[method] = (path, handler) => {
                return this.router[method](path, catchErrors(handler))
            }
        }
    }

    use (handler) {
        return this.router.use(catchErrors(handler))
    }
}

function createRouter () {
    return new Router()
}

function createRouterBuilder () {
    let log = []
    let builder = function (router) {
        for (let [method, args] of log) {
            router[method](...args)
        }
    }
    for (let method of httpMethods) {
        builder[method] = (path, handler) => {
            log.push([ method, [ path, handler ] ])
        }
    }
    builder.use = (handler) => {
        log.push([ "use", [ handler ] ])
    }
    return builder
}

class Application
{
    constructor(app) {
        this.app = app || express()
        this.raw = this.app
        this.raw.use(express.json())
        this.listen = (...args) => this.app.listen(...args)
        for (let method of httpMethods) {
            this[method] = (path, handler) => {
                return this.app[method](path, catchErrors(handler))
            }
        }
    }

    "static" (...args) {
        this.app.use(express.static(...args))
    }

    fallback (path) {
        try {
            let file = fs.readFileSync(path, { encoding: "utf8" })
            this.app.use((request, response)=> response.status(200).send(file))
        }
        catch (error) {
            // ignore
        }
    }

    use (...args) {
        if (args.length == 2) {
            let [ path, handler ] = args
            if (handler instanceof Router) {
                return this.app.use(path, handler.router)
            }
            else {
                return this.app.use(path, catchErrors(handler))
            }
        }
        if (args.length == 1) {
            let [ handler ] = args
            return this.app.use(catchErrors(handler))
        }
    }

    // optional params: [ route name, router builder function ]
    router(...args) {
        let result = new Router()
        if (args.length == 1) {
            let path = args[0]
            this.use(path, result)
        }
        if (args.length >= 2) {
            let path = args[0]
            let builderFunc = args[1]
            if (builderFunc instanceof Function) builderFunc(result)
            this.use(path, result)
        }
        return result
    }
}

function createExpress() {
    return new Application()
}

export {
    Router,
    Application,
    createRouter,
    createExpress,
    createRouterBuilder,
}
