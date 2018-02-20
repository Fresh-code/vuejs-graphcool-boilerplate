import gql from 'graphql-tag'

const UsersListQuery = gql`
    query UsersListQuery($perPage: Int, $offset: Int) {
        allUsers(first: $perPage, skip: $offset) {
            id
            name
            email
            username
        },
        _allUsersMeta{
            count
        }
    }
`;

export default {UsersListQuery};