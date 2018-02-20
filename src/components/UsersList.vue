<template>
    <div>
        <create-user v-bind="createDialogOptions"
                     @create-user="onCreateUser"
                     @close-create-dialog="onCloseCreateDialog"></create-user>
        <delete-user v-bind="deleteDialogOptions"
                     @delete-user="onDeleteUser"
                     @close-delete-dialog="onCloseDeleteDialog"></delete-user>
        <v-btn color="primary" dark slot="activator"
               @click="showCreateDialog">
            <v-icon>add</v-icon>Create User
        </v-btn>
        <v-data-table
                v-bind:headers="headers"
                v-bind:items="allUsers"
                v-bind:pagination.sync="pagination"
                :total-items="totalItems"
                :loading="loading"
                hide-actions
                class="elevation-1">
            <template slot="headerCell" slot-scope="props">
                <v-tooltip bottom>
                  <span slot="activator">
                    {{ props.header.text }}
                  </span>
                  <span>
                    {{ props.header.text }}
                  </span>
                </v-tooltip>
            </template>
            <template slot="items" slot-scope="props">
                <td>{{ props.item.name }}</td>
                <td class="text-xs-right">{{ props.item.name }}</td>
                <td class="text-xs-right">{{ props.item.email }}</td>
                <td class="text-xs-right">
                    <v-btn flat icon color="pink" @click="showDeleteDialog(props.item)">
                        <v-icon>delete</v-icon>
                    </v-btn>
                </td>
            </template>
        </v-data-table>
        <div class="text-xs-center pt-2">
            <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
        </div>
    </div>
</template>

<script>
  import Queries from '../graphql/queries';
  import {CreateUser, DeleteUserById} from '../graphql/mutations';
  import CreateUserDialog from './CreateUser.vue';
  import DeleteUserDialog from './DeleteUser.vue';

  export default {
    data () {
      return {
        pagination: {rowsPerPage: 10},
        headers: [
          {
            text: 'Name',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          {
            text: 'Username',
            value: 'username',
            sortable: false
          },
          {
            text: 'Email',
            value: 'email',
            sortable: false
          },
          {
            text: '',
            sortable: false
          }
        ],
        allUsers: [],
        totalItems: 0,
        loading: true,
        customValidations: {},
        createDialogOptions: {show: false},
        deleteDialogOptions: {show: false, user: {}}
      }
    },
    methods: {
      showDeleteDialog(user){
        this.deleteDialogOptions = {user: user, show: true}
      },
      showCreateDialog(){
        this.createDialogOptions.show = true;
      },
      onCloseCreateDialog(){
        this.createDialogOptions.show = false;
      },
      onCloseDeleteDialog(){
        this.deleteDialogOptions.show = false;
      },
      onDeleteUser({userId}){
        this.$apollo.mutate({
          mutation: DeleteUserById,
          variables: {
            id: userId,
          }
        }).then(() => {
          this.$apollo.queries.allUsers.refetch();
          this.onCloseDeleteDialog();
        }).catch((error) => {
          console.error(error)
        })
      },
      onCreateUser(params){
        this.customValidation = {};
        this.$apollo.mutate({
          mutation: CreateUser,
          variables: params
        }).then(() => {
          this.$apollo.queries.allUsers.refetch();
          this.onCloseCreateDialog();
        }).catch(({message}) => {
          if(message.match(/unique constraint/) && message.match(/Field name = email/)){
            this.customValidation.emailNotUnique = true;
          }
        })
      }
    },
    apollo: {
      allUsers: {
        query: Queries.UsersListQuery,
        watchLoading(isLoading, countModifier) {
          this._data.loading = countModifier > 0;
        },
        variables() {
          const {rowsPerPage, page} = this.pagination;
          return {
            perPage: rowsPerPage,
            offset: (page -1)* rowsPerPage
          }
        },
        result: function(result){
          this.totalItems = result.data._allUsersMeta.count;
        }
      },
    },
    components: {
      'create-user': CreateUserDialog,
      'delete-user': DeleteUserDialog
    },
    computed: {
      pages () {
        return this.pagination.rowsPerPage ? Math.ceil(this.totalItems / this.pagination.rowsPerPage) : 0
      }
    }
  }
</script>
