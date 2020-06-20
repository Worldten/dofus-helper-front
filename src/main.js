import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import Login from './components/Login.vue'
import Items from './components/Items.vue'
import HelloWorld from './components/HelloWorld.vue'
import SignUp from './components/SignUp.vue'
import Equipment from './components/Equipment.vue'
import Equip from './components/Equip.vue'
import vuetify from './plugins/vuetify';

Vue.use(VueRouter);

Vue.config.productionTip = false

const routes = [{
  path: '/items',
  component: Items
},
{
  path: '/login',
  component: Login
},
{
  path: '/helloworld',
  component: HelloWorld
},
{
  path: '/signup',
  component: SignUp
},
{
  path: '/equipments',
  component: Equipment
},
{
  path: '/equipments/:id',
  component: Equip
}
];

const router = new VueRouter({ routes });

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
