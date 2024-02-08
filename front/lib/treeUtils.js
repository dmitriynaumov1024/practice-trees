export function toggleExpandNode (node, expand) {
    expand ??= !node.expand
    node.expand = expand
}

export function renameNode (node, text) {
    node.text = text
}

export function addNode (parent) {
    parent.nodes ??= [ ]
    parent.nodes.push({ text: "<new node>" })
}

export function removeNode (parent, node) {
    parent.nodes ??= [ ]
    parent.nodes = parent.nodes.filter(n => n != node)
}
