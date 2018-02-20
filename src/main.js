// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import VueApollo from 'vue-apollo'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import Routes from './router'

let uri = process.env.SIMPLE_API;
if(process.env.GC_URI){
  let reg = /.+?\:\/\/.+?(\/.+?)$/;
  let gcEpPath = reg.exec( process.env.SIMPLE_API )[1];
  uri = `${window.location.protocol}//${process.env.GC_URI}${gcEpPath}`
}
const networkInterface = createNetworkInterface({ uri });

const apolloClient = new ApolloClient({
  networkInterface,
});

const router = new VueRouter({
  routes: Routes
});

Vue.use(VueApollo);
Vue.use(Vuetify);
Vue.use(VueRouter);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

// Start the app
new Vue({
  el: '#app',
  apolloProvider,
  render: h => h(App),
  router: router
});
