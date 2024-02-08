import { h } from "vue"
import TreeView from "@/comp/TreeView.js"

export default {
    props: {
        id: String
    },
    methods: {
        async getTree() {
            let { data } = await this.$axios.request({
                method: "get",
                url: "/api/tree/get",
                params: { id: this.id }
            })
            this.tree = data.tree
            this.success = data.success
            this.notFound = data.notFound
        },
        async persistTree() {
            if (!this.tree.clientModified) return
            this.tree.clientModified = undefined
            let { data } = await this.$axios.request({
                method: "post",
                url: "/api/tree/update",
                data: { tree: this.tree }
            })
            this.tree = data.tree
            this.success = data.success
        }
    },
    data() {
        return {
            tree: undefined,
            success: undefined,
            notFound: undefined,
            unwatchTree: undefined
        } 
    },
    mounted() {
        this.unwatchTree = this.$watch(()=> this.id, this.getTree, { immediate: true })
    },
    unmounted() {
        this.unwatchTree()
    },
    render() {
        return this.tree ?
            h(TreeView, { tree: this.tree, onSave: this.persistTree }) :
            this.notFound ?
                h("p", { }, `Tree #${this.id} not found`) :
                h("p", { }, "Loading, please wait...")
    }
}
