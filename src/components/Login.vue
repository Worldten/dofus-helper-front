<template>
  <v-form v-model="valid" ref="formSignUp">
    <v-container class="mt-12">
      <v-card
      class="mx-auto mt-12"
      max-width="700"
    >
        <v-row>
          <v-col
            cols="12"
            md="8"
            offset="2"
          >
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
              class="center"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            md="8"
            offset="2"
          >
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              :type="password ? 'password' : 'text'"
              label="Password"
              required
              class="center"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            md="8"
            offset="5"
          >
            <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="validate">
            Validate
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-form>
</template>

<script>
import axios from 'axios';
  export default {
    data: () => ({
      valid: false,
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Password is required'
      ]
    }),
    methods: {
      validate () {
        axios
      .post('http://localhost:8000/api/v1/players/login',{
        mail: this.email,
        password: this.password
      })
      .then(function(response){
         localStorage.setItem('token', JSON.stringify(response.data))
         window.location.href= '#/items'
      })
      .catch(function(error){
        console.log("Mauvaise combinaison de mail/mot de passe" + error)
      })
      }
    }
  }
</script>
