<template>
    <v-layout row justify-center>
        <v-dialog v-model="show" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">Confirm user deletion</v-card-title>
                <v-card-text>Do you want to delete user <b>{{user.username}}</b>?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="darken-1" flat @click="closeDialog">Cancel</v-btn>
                    <v-btn color="red darken-1" flat @click="deleteUser">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
  export default {
    props: ['show', 'user'],
    methods: {
      deleteUser() {
        const userId = this.user.id;
        this.$emit('delete-user', {userId});
      },
      closeDialog() {
        this.$emit('close-delete-dialog')
      }
    }
  }
</script>
