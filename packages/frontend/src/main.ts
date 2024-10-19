import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ProtectShit from './components/ProtectShit.vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import QList from './components/QList.vue'

const routes = [
    {path:'/', component:HelloWorld},
    {path:'/upload', component:ProtectShit},
    {path:'/questions', component:QList},
    {path:'/q/:id', component:ProtectShit, name: 'q', props: true}
] as Readonly<RouteRecordRaw[]>;

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

createApp(App).use(router).mount('#app')
