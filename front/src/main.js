import { createApp } from "vue"
import { createWebHistory } from "vue-router" 
import { routerWrapper } from "@lib/routerWrapper.js"
import { axiosWrapper } from "@lib/axiosWrapper.js"

import applicationView from "@/layout/application.js"
import routes from "@/route/main.js"

let router = routerWrapper({
    history: createWebHistory(),
    routes: routes
})

let axios = axiosWrapper({
    baseURL: window.location.origin,
    validateStatus: ()=> true
}) 

let app = createApp(applicationView)
app.use(router)
app.use(axios)
app.mount("#app-root")

// import styles
import "@style/index.js"
