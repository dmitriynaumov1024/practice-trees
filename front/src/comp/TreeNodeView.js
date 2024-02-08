import { h } from "vue"
import { toggleExpandNode, renameNode, addNode, removeNode } from "@lib/treeUtils.js"
import ModalView from "../layout/modal.js"
import TreeNodeEdit from "./TreeNodeEdit.js"

const depthLimit = 16

const TreeNodeView = {
    props: {
        parent: Object,
        node: Object,
        depth: Number
    },
    emits: [
        "change"
    ],
    methods: {
        onEdit({ text, remove }) {
            this.editing = false
            if (text || remove) {
                if (remove) removeNode(this.parent, this.node)
                if (text != undefined && text != this.node.text) renameNode(this.node, text)
                this.$emit("change")
            }
        }
    },
    data() {
        return {
            editing: false
        }
    },
    render() {
        let node = this.node, 
            parent = this.parent, 
            depth = this.depth ?? 0
        return h("div", { }, [
            h("div", { class: ["flex-row", "flex-pad-05"] }, [
                node.nodes?.length ? h("span", { class: ["clickable"], onClick: ()=> toggleExpandNode(node) }, "+") : h("span", { class: ["clickable"] }, "\u2013"),
                h("span", { class: ["min-width-2", "background-opaque"], onClick: ()=> { this.editing = true } }, node.text),
                depth < depthLimit ? h("span", { class: ["clickable"], title: "Add node", onClick: ()=> { toggleExpandNode(node, true); addNode(node); this.$emit("change") } }, "\u21b5") : null
            ]),
            node.nodes?.length ? 
                h("div", { style: { "padding-left": "1.5rem", display: node.expand? "block" : "none" } }, node.nodes.map(child => {
                    return h(TreeNodeView, { parent: node, node: child, depth: depth + 1, onChange: ()=> this.$emit("change") })
                })) :
                null,
            this.editing ? 
                h(ModalView, { onResolve: this.onEdit }, {
                    header: ()=> "Tree node",
                    main: ({ resolve })=> h(TreeNodeEdit, { node: node, resolve: resolve })
                }) :
                null
        ])
    }
}

export default TreeNodeView
