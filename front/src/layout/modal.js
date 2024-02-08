import { h } from "vue"

export default {
    emits: [
        "resolve"
    ],
    methods: {
        resolve(...args) {
            this.$emit("resolve", ...args)
        }
    },
    render() {
        return h("div", { class: ["modal-wrapper", "pad-1"] }, [
            h("div", { class: ["modal", "pad-1", "container-1", "background-opaque"] }, [
                h("div", { class: ["flex-stripe", "mar-b-1"] }, [
                    this.$slots.header(),
                    h("span", { class: "flex-grow" }, " "),
                    h("span", { class: "clickable", onClick: ()=> this.resolve({ }) }, "\u2a2f")
                ]),
                h("div", { class: ["mar-b-1"] }, [
                    this.$slots.main({ resolve: this.resolve })
                ]),
                this.$slots.footer ? 
                    h("div", { }, [
                        this.$slots.footer()
                    ]) : 
                    null
            ])
        ])
    }
}
