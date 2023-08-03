const { AuthenticationError, ForbiddenError } = require('./utils/errors');

const resolvers = {
  Query: {
    hostListings: async (_, __, { dataSources, userId, userRole }) => {
      if (!userId) throw AuthenticationError();

      if (userRole === 'Host') {
        return dataSources.listingsApi.getListingsForUser(userId);
      } else {
        throw ForbiddenError('Only hosts have access to listings.');
      }
    },
    listing: (_, { id }, { dataSources }) => {
      return dataSources.listingsApi.getListing(id);
    },
    featuredListings: (_, __, { dataSources }) => {
      const limit = 3;
      return dataSources.listingsApi.getFeaturedListings(limit);
    },
    listingAmenities: (_, __, { dataSources }) => {
      return dataSources.listingsApi.getAllAmenities();
    },
  },
  Mutation: {
    createListing: async (_, { listing }, { dataSources, userId, userRole }) => {
      if (!userId) throw AuthenticationError();

      const {
        title,
        description,
        photoThumbnail,
        numOfBeds,
        costPerNight,
        locationType,
        amenities,
      } = listing;

      if (userRole !== 'Host') {
        return {
          code: 400,
          success: false,
          message: 'Only hosts can create new listings',
        };
      }

      try {
        const newListing = await dataSources.listingsApi.createListing({
          title,
          description,
          photoThumbnail,
          numOfBeds,
          costPerNight,
          hostId: userId,
          locationType,
          amenities,
        });

        return {
          code: 200,
          success: true,
          message: 'Listing successfully created!',
          listing: newListing,
        };
      } catch (err) {
        return {
          code: 400,
          success: false,
          message: err.message,
        };
      }
    },
    updateListing: async (_, { listingId, listing }, { dataSources, userId }) => {
      if (!userId) throw AuthenticationError();

      try {
        const updatedListing = await dataSources.listingsApi.updateListing({ listingId, listing });

        return {
          code: 200,
          success: true,
          message: 'Listing successfully updated!',
          listing: updatedListing,
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
  Listing: {
    __resolveReference: ({ id }, { dataSources }) => {
      return dataSources.listingsApi.getListing(id)
    },
    host: ({ hostId }) => {
      return { id: hostId }
    },
    totalCost: async ({ id }, { checkInDate, checkOutDate }, { dataSources }) => {
      const { totalCost } = await dataSources.listingsApi.getTotalCost({
        id,
        checkInDate,
        checkOutDate,
      });

      return totalCost;
    },
  },
  Booking: {
    listing: ({ listingId }, _, { dataSources }) => {
      return dataSources.listingsApi.getListing(listingId);
    },
    totalPrice: async ({ listingId, checkInDate, checkOutDate }, _, { dataSources }) => {
      const { totalCost } = await dataSources.listingsApi.getTotalCost({
        id: listingId,
        checkInDate,
        checkOutDate,
      });
      return totalCost;
    },
  },
  AmenityCategory: {
    ACCOMMODATION_DETAILS: 'Accommodation Details',
    SPACE_SURVIVAL: 'Space Survival',
    OUTDOORS: 'Outdoors',
  },
};

module.exports = resolvers;
