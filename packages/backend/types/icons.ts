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
  // Transport
  { id: "Train", title: "Train", categories: ["transport"] },
  { id: "Car", title: "Car", categories: ["transport"] },
  { id: "Taxi", title: "Taxi", categories: ["transport"] },
  { id: "Plane", title: "Plane", categories: ["transport"] },
  { id: "Ferry", title: "Ferry", categories: ["transport"] },
  { id: "Motorbike", title: "Motorbike", categories: ["transport"] },
  { id: "Bicyle", title: "Bicyle", categories: ["transport"] },
  { id: "Bus", title: "Bus", categories: ["transport"] },

  // Accommodation
  { id: "Hotel", title: "Hotel", categories: ["accommodation"] },
  { id: "Motel", title: "Motel", categories: ["accommodation"] },
  { id: "House", title: "House", categories: ["accommodation"] },
  { id: "Cabin", title: "Cabin", categories: ["accommodation"] },
  { id: "Camping", title: "Camping", categories: ["accommodation"] },
  { id: "Bed", title: "Bed", categories: ["accommodation"] },

  // Activities
  { id: "Hiking", title: "Hiking", categories: ["activities"] },
  { id: "Walking", title: "Walking", categories: ["activities"] },
  { id: "Biking", title: "Biking", categories: ["activities"] },
  { id: "Swimming", title: "Swimming", categories: ["activities"] },
  { id: "Sightseeing", title: "Sightseeing", categories: ["activities"] },
  { id: "Theater", title: "Theater", categories: ["activities"] },
  { id: "Concert", title: "Concert", categories: ["activities"] },
  { id: "Festival", title: "Festival", categories: ["activities"] },
  { id: "Shopping", title: "Shopping", categories: ["activities"] },
  { id: "Golf", title: "Golf", categories: ["activities"] },
  { id: "Tennis", title: "Tennis", categories: ["activities"] },
  { id: "Soccer", title: "Soccer", categories: ["activities"] },
  { id: "Football", title: "Football", categories: ["activities"] },
  { id: "Basketball", title: "Basketball", categories: ["activities"] },
  { id: "Volleyball", title: "Volleyball", categories: ["activities"] },
  { id: "Fishing", title: "Fishing", categories: ["activities"] },

  // Food
  { id: "Pizza", title: "Pizza", categories: ["food"] },
  { id: "Burger", title: "Burger", categories: ["food"] },
  { id: "Sandwich", title: "Sandwich", categories: ["food"] },
  { id: "IceCream", title: "Ice Cream", categories: ["food"] },

  // Places
  { id: "Beach", title: "Beach", categories: ["places"] },
  { id: "Mountain", title: "Mountain", categories: ["places"] },
  { id: "Park", title: "Park", categories: ["places"] },
  { id: "Fuel", title: "Fuel", categories: ["places"] },
  { id: "Hospital", title: "Hospital", categories: ["places"] },
  { id: "Pharmacy", title: "Pharmacy", categories: ["places"] },
  { id: "Supermarket", title: "Supermarket", categories: ["places"] },
  { id: "Restaurant", title: "Restaurant", categories: ["places"] },
  { id: "Bar", title: "Bar", categories: ["places"] },
  { id: "Cafe", title: "Cafe", categories: ["places"] },
  { id: "Church", title: "Church", categories: ["places"] },

  // Other
  { id: "Folder", title: "Folder", categories: ["other"] },
  { id: "MapPin", title: "Map Pin", categories: ["other"] },
  { id: "Compass", title: "Compass", categories: ["other"] },
  { id: "Map", title: "Map", categories: ["other"] },
  { id: "MapPinLine", title: "Map Pin Line", categories: ["other"] },
] as const;

export type IconType = typeof iconsList[number]["id"];
