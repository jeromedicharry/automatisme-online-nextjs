import { gql } from '@apollo/client';

export const GET_RELAY_POINTS = gql`
  query getRelayPoints(
    $zipCode: String!
    $city: String!
    $userAddress: String!
    $limit: Int = 5
  ) {
    relayPoints(
      zipCode: $zipCode
      city: $city
      userAddress: $userAddress
      sortByDistance: true
      maxDistance: 20
      limit: $limit
    ) {
      success
      relay_points {
        id
        name
        address
        city
        zipCode
        latitude
        longitude
        distance_km
        distance_meters
        user_coordinates {
          lat
          lon
        }
        relay_coordinates {
          lat
          lon
        }
        distance_calculation {
          user_lat
          user_lon
          relay_lat
          relay_lon
          raw_distance_km
          calculation_method
        }
      }
      metadata {
        processed_by
        processing_time
        total_points
        distance_calculated
        sorted_by_distance
        calculation_method
        coordinate_precision
        distance_stats {
          min_distance_km
          max_distance_km
          avg_distance_km
          total_points_with_distance
        }
      }
    }
  }
`;
