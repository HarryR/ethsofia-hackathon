import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ProtectShit from './components/ProtectShit.vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'

const routes = [
    {path:'/', component:HelloWorld},
    {path:'/upload', component:ProtectShit}
] as Readonly<RouteRecordRaw[]>;

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

createApp(App).use(router).mount('#app')
