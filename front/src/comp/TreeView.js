import { h, resolveComponent } from "vue"
import TreeNodeView from "./TreeNodeView.js"
import { toggleExpandNode, addNode } from "@lib/treeUtils.js"

export default {
    props: {
        tree: Object
    },
    emits: [
        "save"
    ],
    methods: {
        onChange() {
            this.tree.clientModified = true
        }
    },
    render() {
        return h("div", { }, [
            h("div", { class: ["flex-stripe", "flex-pad-1", "mar-b-1"] }, [
                h("h3", { }, `Tree #${this.tree.id}`),
                h("span", { class: ["clickable"], title: "Add node", onClick: ()=> { addNode(this.tree); this.onChange() } }, "\u21b5"),
                this.tree.clientModified ? h("span", { class: ["clickable", "text-accent"], onClick: ()=> this.$emit("save") }, "Save changes") : null,
                h("span", { class: ["flex-grow"] }, " ")
            ]),
            this.tree.nodes.length ? 
                this.tree.nodes.map(node => h(TreeNodeView, { parent: this.tree, node: node, onChange: this.onChange })) :
                h("button", { class: ["button", "button-2", "button-block", "pad-1", "accent-weak", "text-gray"], onClick: ()=> { addNode(this.tree); this.onChange() } }, "Add first node")
        ])
    }
}
