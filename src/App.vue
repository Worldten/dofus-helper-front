<template>
  <v-app>
    <v-app-bar
      app
      color=""
      dark
    >
      <div class="d-flex align-center">
        <v-tabs>
          <v-tab to="/items">items</v-tab>
          <v-tab to="/login">login</v-tab>
          <v-tab to="/equipments">equipment</v-tab>
        </v-tabs>
      </div>

      <v-spacer></v-spacer>

      <div v-if="this.logged == true" >
        <v-btn
          @click="logout()"
          text
        >
          <span class="mr-2">Logout</span>
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </div>
      <div v-else>
        <v-btn
          text
          @click="login()"
        >
          <span class="mr-2">login</span>
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </div>

    </v-app-bar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    logged: false
  }),
  mounted(){
    if(localStorage.getItem('token')){
      this.logged = true
    }
  },
  methods: {
    logout(){
      localStorage.clear();
      window.location.href= '#/login'
    },
    login(){
      window.location.href= '#/login'
    }
  }

};
</script>
