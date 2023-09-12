'use strict';
const { Model } = require('sequelize');
const Listing = require('./listing');
const Amenity = require('./amenity');
module.exports = (sequelize, DataTypes) => {
  class ListingAmenities extends Model {}
  ListingAmenities.init(
    {
      ListingId: {
        type: DataTypes.STRING,
        references: {
          model: 'Listings',
          key: 'id',
        },
      },
      AmenityId: {
        type: DataTypes.STRING,
        references: {
          model: 'Amenities',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'ListingAmenities',
      timestamps: false,
    }
  );
  return ListingAmenities;
};
