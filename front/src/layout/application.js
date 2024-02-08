import { h } from "vue"
import { RouterView } from "vue-router"

export default {
    render() {
        return [
            h("div", { class: ["width-container", "pad-1"], style: { "background-color": "var(--color-back-0)" } }, [
                h(RouterView, { })
            ])
        ]
    }
}
