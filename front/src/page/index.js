import { h } from "vue"

export default {
    methods: {
        onFindClick() {
            this.$router.push("/tree/" + this.$refs.idInput.value)
        },
        async onCreateClick() {
            let { data } = await this.$axios.request({
                url: "/api/tree/create",
                method: "post"
            })
            if (data.success) {
                this.$router.push("/tree/" + data.tree.id)
            }
        }
    },
    render() {
        return h("div", { }, [
            h("h3", { class: ["mar-b-1"] }, "Trees"),
            h("div", { class: ["flex-stripe", "flex-pad-05", "mar-b-1"] }, [
                h("input", { class: ["flex-grow", "inline-input", "pad-025"], ref: "idInput", placeholder: "Tree id" }),
                h("button", { class: ["button", "button-1", "width-6"], onClick: this.onFindClick }, "Find")
            ]),
            h("div", { class: ["flex-stripe", "flex-pad-05", "mar-b-1"] }, [
                h("span", { class: ["flex-grow" ] }, "Create new Tree"),
                h("button", { class: ["button", "button-1", "width-6"], onClick: this.onCreateClick }, "Create")
            ]),
        ])
    }
}
