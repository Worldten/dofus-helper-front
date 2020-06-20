<template>
    <v-container class="mt-12" :key="componentKey">
    <v-col cols="auto"
      v-for="equip in info" :key="equip.id">
        <v-card
            color="#385F73"
            dark
          >
            <v-card-subtitle class="headline">Nom de l'équipement : {{equip.equipment_name}}<v-btn color="red" absolute dark right v-on:click="deleteEquip(equip.id)"><v-icon>mdi-delete</v-icon></v-btn></v-card-subtitle>
          </v-card>
    </v-col>
    <v-card
    flat
    class="py-12"
  >
    <v-card-text>
      <v-row
        align="center"
        justify="center"
      >
        <v-btn x-large color="primary" dark @click="dialog = true">Ajouter un équipement</v-btn>
      </v-row>
    </v-card-text>
  </v-card>
<v-dialog
        v-model="dialog"
        max-width="500px"
      >
        <v-card>
          <v-card-title>
            Nouvel équipement
          </v-card-title>
          <v-card-text>
            <v-form v-model="valid" ref="formNewEquipment">
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
                            v-model="Name"
                            :rules="nameRules"
                            label="Nom"
                            required
                            class="center"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12"
                            md="8"
                            offset="4">
                            <v-btn
                            :disabled="!valid"
                            color="success"
                            class="mr-4"
                            @click="validate(); dialog = false; Name = ''">
                            Validate
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              text
              @click="dialog = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
</template>

<script>
import axios from 'axios';
let config = {}
if(JSON.parse(localStorage.getItem('token'))){
  config = {
    headers: {
      'x-access-token': JSON.parse(localStorage.getItem('token')).accessToken,
    }
  }
}

  export default {
    data: () => ({
      componentKey: 0,
      dialog: false,
      Name: '',
      info: [],
      valid: false,
      isUpdated: true,
      nameRules: [
        v => !!v || 'Le nom est requis'
      ]
    }),
    mounted(){
            if(!JSON.parse(localStorage.getItem('token'))){
        window.location.href = "#/login"
      }
      axios.get('http://localhost:8000/api/v1/equipments/player/'+JSON.parse(localStorage.getItem('token')).id.toString(), config).then(response => (this.info = response.data.data))
    },
    updated(){
      if(this.isUpdated === false){
        axios.get('http://localhost:8000/api/v1/equipments/player/'+JSON.parse(localStorage.getItem('token')).id.toString(), config).then(response => (this.info = response.data.data))
        this.isUpdated = true;
      }
    },
    methods: {
      validate () {
        axios
      .post('http://localhost:8000/api/v1/equipments',{
        equipment_name: this.Name,
        player_id: JSON.parse(localStorage.getItem('token')).id
      },config)
      .then(() => (this.forceRerender()))
      .catch(function(error){
        console.log("Problème" + error)
      })
      },
      deleteEquip(id) {
        axios.delete('http://localhost:8000/api/v1/equipments/'+id, config).then(() => {
          this.isUpdated = false;
          this.forceRerender();
          }).catch(function(error) {
          console.log(error)
        })
      },
      forceRerender(){
        this.isUpdated = false;
        this.componentKey += 1;
      }
    }
  }
</script>
