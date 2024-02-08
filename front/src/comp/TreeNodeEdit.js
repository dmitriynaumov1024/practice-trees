import { h } from "vue"

export default {
    props: {
        node: Object,
        resolve: Function
    },
    mounted() {
        this.$refs.titleInput.focus()
    },
    render() {
        return [
            h("div", { class: ["mar-b-2"] }, [
                h("input", { class: ["inline-input", "pad-025", "block"], value: this.node.text, ref: "titleInput" })
            ]),
            h("div", { class: ["flex-stripe"] }, [
                h("button", { class: ["button", "button-2", "accent-bad"], onClick: ()=> this.resolve({ remove: true }) }, "Remove"),
                h("span", { class: ["flex-grow"] }, " "),
                h("button", { class: ["button", "button-1"], onClick: ()=> this.resolve({ text: this.$refs.titleInput.value }) }, "Done")
            ])
        ]
    }
}

