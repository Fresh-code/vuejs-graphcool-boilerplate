import gql from 'graphql-tag'

export const CreateUser = gql`
    mutation insertUser($name: String!, $username: String!, $email: String!, $password: String!) {
        createUser(name: $name, username:$username, email:$email, password: $password) {
            id
        }
    }
`;

export const ModifyUser = gql`
    mutation modifyUser($id: ID!, $name: String!, $password: String!){
        updateUser(id: $id, name: $name, password: $password){
            id
        }
    }
`;

export const DeleteUserById = gql`
    mutation deleteUserById($id: ID!){
        deleteUser(id:$id) {
            id
        }
    }
`;
