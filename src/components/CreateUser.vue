<template>
    <v-dialog v-model="dialog" persistent max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">User Profile</span>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-md>
                    <v-form v-model="valid" ref="form" lazy-validation>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-text-field v-model="user.name" label="Name" :rules="nameRules" required></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field v-model="user.email" label="Email" :rules="emailRules" required></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field v-model="user.password" label="Password" :rules="passwordRules" type="password" required></v-text-field>
                        </v-flex>
                    </v-layout>
                    </v-form>
                </v-container>
                <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="darken-1" flat @click="closeDialog">Close</v-btn>
                <v-btn color="green darken-1" flat @click="createUser">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
  export default {
    props: ['show'],
    watch: {
      show: function(){
        if(!this.dialog){
          this.$refs.form.reset();
        }
        this.dialog = this.show;
      }
    },
    data () {
      return {
        valid: false,
        user: {},
        nameRules: [
          (v) => !!v || 'Name is required',
          (v) => v && v.length <= 255 || 'Name must be less than 255 characters'
        ],
        emailRules: [
          (v) => !!v || 'E-mail is required',
          (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ],
        passwordRules: [
          (v) => !!v || 'Password is required',
          (v) => v && v.length >= 5 || 'Password must be greater than 5 characters'
        ],
        dialog: this._props.show
      }
    },
    methods: {
      createUser() {
        if(this.$refs.form.validate()) {
          const user = this.user;
          user.username = /^(\w+([\.-]?\w+)*)@.*$/.exec(user.email)[1];
          this.$emit('create-user', user);
        }
      },
      closeDialog() {
        this.$emit('close-create-dialog')
      }
    }
  }
</script>