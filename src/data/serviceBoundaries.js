export const BORDER_NORTH_LATITUDE = 42.11249786499128;
export const BORDER_EAST_LONGITUDE = -93.50245309137533;
export const BORDER_SOUTH_LATITUDE = 41.94664427464395;
export const BORDER_WEST_LONGITUDE = -93.79180211954629;

const isInServiceBoundary = (latitude, longitude) => {
  return (
    latitude <= BORDER_NORTH_LATITUDE &&
    latitude >= BORDER_SOUTH_LATITUDE &&
    longitude <= BORDER_EAST_LONGITUDE &&
    longitude >= BORDER_WEST_LONGITUDE
  );
};

export default isInServiceBoundary;
