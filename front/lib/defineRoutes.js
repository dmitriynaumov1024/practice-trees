import { nestedObjectMerge } from "./utils.js"

function DEFAULT_PROPS () {
    return { }
}

// parse props function moved out to do fewer allocations
function parseProps ({ params, query, props }) {
    let result = { }
    for (const key in props) {
        const propType = props[key]
        const rawPropValue = query[key] ?? params[key]
        if (propType == Number || propType == "number" || propType == "Number") {
            let val = Number(rawPropValue)
            if (Number.isNaN(val)) val = undefined
            result[key] = val
        }
        else if (propType == Boolean || propType == "boolean" || propType == "Boolean") {
            result[key] = (rawPropValue?.toLowerCase() == "true") || undefined
        }
        else if (propType == String || propType == "string" || propType == "String")
            result[key] = (rawPropValue != undefined) && String(rawPropValue) || rawPropValue
        else if (propType instanceof Function) 
            result[key] = propType(rawPropValue)
        else 
            result[key] = rawPropValue
    }
    return result
}

// create props
function createProps (props) {
    // support vue-router's default behavior
    if (props instanceof Function || props === true) return props
    // if no props return an empty object
    if (!props || typeof props != "object") return DEFAULT_PROPS
    // use parseProps function
    return ({ params, query }) => parseProps({ params, query, props })
}

// a custom function to define routes because default mode 
// is not sufficient any more  
function defineRoutes (...args) {
    let [ basePath, routes ] = (args.length >= 2) ? [ args[0], args[1] ] : [ "", args[0] ]
    return routes.map (route => ({
        name: route.name,
        path: basePath + route.path,
        component: route.component,
        props: createProps(route.props)
    }))
}

export { defineRoutes }
