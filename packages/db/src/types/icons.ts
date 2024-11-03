export const transportIconList = [
  "Train",
  "Car",
  "Taxi",
  "Plane",
  "Ferry",
  "Motorbike",
  "Bicyle",
  "Bus",
] as const;

export type TransportIcon = typeof transportIconList[number];


export const accommodationIconList = [
  "Hotel",
  "Motel",
  "House",
  "Cabin",
  "Camping",
  "Bed",
] as const;

export type AccommodationIcon = typeof accommodationIconList[number];

export const activitiesIconList = [
  "Hiking",
  "Walking",
  "Biking",
  "Swimming",
  "Sightseeing",
  "Theater",
  "Concert",
  "Festival",
  "Shopping",
  "Golf",
  "Tennis",
  "Soccer",
  "Football",
  "Basketball",
  "Volleyball",
  "Fishing",
] as const;

export type ActivitiesIcon = typeof activitiesIconList[number];

export const foodIconList = [
  "Pizza",
  "Burger",
  "Sandwich",
  "IceCream",
  // Pasta: {},
  // Ramen: {},
  // Sushi: {},
  // Taco: {},
] as const;

export type FoodIcon = typeof foodIconList[number];

export const placesIconList = [
  "Beach",
  "Mountain",
  "Park",
  "Fuel",
  "Hospital",
  "Pharmacy",
  "Supermarket",
  "Restaurant",
  "Bar",
  "Cafe",
  "Church",
] as const;

export type PlacesIcon = typeof placesIconList[number];

export const otherIconList = [
  "Folder",
  "MapPin",
  "Compass",
  "Map",
  "MapPinLine",
] as const;

export type OtherIcon = typeof otherIconList[number];

export const popularIconList = [
  "Bed",
  "Car",
  "Camping",
  "Hiking",
  "Biking",
  "House",
] as const;

export type PopularIcon = typeof popularIconList[number];

export const iconsList = [
  ...transportIconList,
  ...accommodationIconList,
  ...activitiesIconList,
  ...placesIconList,
  ...foodIconList,
  ...otherIconList,
] as const;

export type IconType = typeof iconsList[number];