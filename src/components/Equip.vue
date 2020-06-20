<template>
    <v-container class="mt-12" :key="componentKey">
        For the equip {{ $route.params.id }}
        {{ info.equipment_name }}
        <v-col cols="auto"
          v-for="objet in recipe" :key="objet.id">
            <div>Nom de l'équipement : {{ objet }}</div>
          </v-col>
          <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
            <template v-slot:activator="{ on, attrs }">
              <v-row justify="center">
                <v-btn
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  Ajouter des items
                </v-btn>
              </v-row>
            </template>
            <v-card>
              <v-toolbar dark color="primary">
                <v-btn icon dark @click="forceRerender(); dialog = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Items</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items><v-form><v-text-field
              v-model="name"
              label="Nom de l'item"
              required
              class="mt-4"
              @keyup="keyUpName()"
            ></v-text-field></v-form></v-toolbar-items>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn dark text @click="saveItems();dialog = false">Save</v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-row class="d-flex col-12" no-gutter>
                <v-col class="col-3"
                v-for="item in items" :key="item.id">
                    Nom : {{ item.item_name }} - Level : {{ item.item_level }}<br>
                    Type : {{ item.item_type }}<br><v-row class="col-4">
                    <v-btn
                      color="primary"
                      dark
                      @click="add(item)"
                      ><v-icon dark>mdi-plus</v-icon>
                    </v-btn>
                  </v-row>
                </v-col>
              </v-row>
              Si vous voulez plus d'item utilisez le champ de recherche en haut
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
      info: '',
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      isUpdated: true,
      name: '',
      items: '',
      recipe: {
        objets:[

        ]
      },
    }),
    watch: {
        $route(){
            axios.get('http://localhost:8000/api/v1/equipments/'+this.$route.params.id, config).then(response => (this.info = response.data.data))
        }
    },
    methods: {
      forceRerender(){
        this.isUpdated = false;
        this.componentKey += 1;
      },
      keyUpName(){
        axios.post('http://localhost:8000/api/v1/items/filter', {name: this.name}).then(response => {
          this.items = response.data.data
        }).catch(error => console.log("Error" + error))
      },
      add(object){
        var isPresentItem = false
        var isPresentItemRecipe = false

        var objName = object.item_name
        var objToAdd = {
          name: objName,
          id: object.id,
          quantity: 1
        }
        this.recipe.objets.equipment_items.forEach(objet =>{
          if(objet.id === object.id){
            objet.quantity += 1;
            isPresentItem = true
          }
        })
        if(isPresentItem === false){
          this.recipe.objets.equipment_items.push(objToAdd)
        }


        for(const [i] of object.item_recipe.entries()){
          isPresentItemRecipe = false
          var items = JSON.stringify(object.item_recipe[i]).split('"')
          var itemName = items[1]
          var itemId = items[4].slice(1,-1)
          var itemType = items[15]
          var itemQty = parseInt(items[20].slice(1,-2))
          var itemRecipe = {
            name: itemName,
            id: itemId,
            type: itemType,
            quantity: itemQty
          }
          this.recipe.objets.equipment_recipe.forEach(objet =>{
            if(objet.id === itemId){
              objet.quantity += itemQty
              isPresentItemRecipe = true
            }
          })
          if(isPresentItemRecipe == false){
            this.recipe.objets.equipment_recipe.push(itemRecipe)
          }
        }
      },
      saveItems(){
        axios.put('http://localhost:8000/api/v1'+this.$route.path,{
          equipment_items: this.recipe.objets.equipment_items,
          equipment_recipe: this.recipe.objets.equipment_recipe
        } ,config).then(response => {
          console.log("Items sent" + response)
        }).catch(error => console.log("Errror"+ error))
      }
    },
    mounted(){
      console.log("mounted")
      axios.get('http://localhost:8000/api/v1/items/limit/50').then(response => {
        this.items = response.data.data
      }).catch(error => console.log("Error" + error))
      axios.get('http://localhost:8000/api/v1'+this.$route.path, config).then(response => {
        this.recipe.objets = response.data.data
      }).catch(error => console.log("Error" + error))
    },
    updated(){
      if(this.isUpdated === false){
        console.log("updated")
        axios.get('http://localhost:8000/api/v1/items/limit/50').then(response => {
          this.items = response.data.data
        }).catch(error => console.log("Error" + error))
        axios.get('http://localhost:8000/api/v1'+this.$route.path, config).then(response => {
          this.recipe.objets = response.data.data
        }).catch(error => console.log("Error" + error))
        this.isUpdated = true
      }

    }
  }
</script>
