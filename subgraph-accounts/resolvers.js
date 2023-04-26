const { AuthenticationError } = require('./utils/errors');

const resolvers = {
  Query: {
    user: async (_, { id }, { dataSources }) => {
      const user = await dataSources.accountsApi.getUser(id);
      if (!user) {
        throw new Error('No user found for this Id');
      }
      return user;
    },
    me: async (_, __, { dataSources, userId }) => {
      if (!userId) throw AuthenticationError();
      const user = await dataSources.accountsApi.getUser(userId);
      return user;
    },
  },
  Mutation: {
    updateProfile: async (_, { updateProfileInput }, { dataSources, userId }) => {
      if (!userId) throw AuthenticationError();
      try {
        const updatedUser = await dataSources.accountsApi.updateUser({
          userId,
          userInfo: updateProfileInput,
        });
        return {
          code: 200,
          success: true,
          message: 'Profile successfully updated!',
          user: updatedUser,
        };
      } catch (err) {
        return {
          code: 400,
          success: false,
          message: err.message,
        };
      }
    },
  },
  User: {
    __resolveType: ({ role }) => {
      return role;
    },
  },
  Guest: {
    __resolveReference: ({ id }, { dataSources }) => {
      return dataSources.accountsApi.getUser(id)
    },
  },
  Host: {
    __resolveReference: ({ id }, { dataSources }) => {
      return dataSources.accountsApi.getUser(id)
    },
  },
  Location: {
    host: ({ hostId }) => {
      return dataSources.accountsApi.getUser(hostId)
    },
  },
};

module.exports = resolvers;
