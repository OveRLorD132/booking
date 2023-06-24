import { createApp } from "vue";

import { createRouter, createWebHashHistory } from "vue-router";

import RentMain from './RentMain.vue';

import App from './Rent.vue';

import HostInfo from './components/HostInfo.vue';

let routes = [
  { path: '/', component: App },
  { path: '/host', component: HostInfo}
]

let router = createRouter({
  history: createWebHashHistory(),
  routes
})

let app = createApp(RentMain);

app.use(router)

app.mount('#app');