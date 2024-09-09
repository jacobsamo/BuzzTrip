// this file contains all the icons that are used in the application
import { Icon } from "@phosphor-icons/react";

import {
  // Transport
  Train,
  Car,
  Taxi,
  AirplaneTilt,
  Boat,
  Motorcycle,
  Bicycle,
  Bus,
  //accommodation
  BuildingApartment,
  Garage,
  HouseLine,
  Tipi,
  Tent,
  // Activities
  PersonSimpleHike,
  PersonSimpleWalk,
  PersonSimpleBike,
  PersonSimpleSwim,
  Binoculars,
  FilmReel,
  Guitar,
  MicrophoneStage,
  ShoppingBag,
  Golf,
  TennisBall,
  SoccerBall,
  Football,
  Basketball,
  Volleyball,
  FishSimple,
  // Places
  Island,
  Mountains,
  Park,
  GasPump,
  Hospital,
  Asclepius,
  Basket,
  Martini,
  BeerStein,
  Coffee,
  Church,
  // Food
  Pizza,
  Hamburger,
  Bread,
  IceCream,
  // Other
  MapPin,
  MapTrifold,
  MapPinLine,
  Compass,
  Folder,
} from "@phosphor-icons/react/dist/ssr";

export const transport = {
  Train: Train,
  Car: Car,
  Taxi: Taxi,
  Plane: AirplaneTilt,
  Ferry: Boat,
  Motorbike: Motorcycle,
  Bicyle: Bicycle,
  Bus: Bus,
};

export const accommodation = {
  Hotel: BuildingApartment,
  Motel: Garage,
  House: HouseLine,
  //   Villa: {},
  Cabin: Tipi,
  Camping: Tent,
};

export const activities = {
  Hiking: PersonSimpleHike,
  Walking: PersonSimpleWalk,
  Biking: PersonSimpleBike,
  Swimming: PersonSimpleSwim,
  Sightseeing: Binoculars,
  // Museum: {},
  Theater: FilmReel,
  Concert: Guitar,
  Festival: MicrophoneStage,
  Shopping: ShoppingBag,
  // Spa: {},
  Golf: Golf,
  Tennis: TennisBall,
  Soccer: SoccerBall,
  Football: Football,
  Basketball: Basketball,
  Volleyball: Volleyball,
  // Kayaking: {},
  // Diving: {},
  Fishing: FishSimple,
};

export const food = {
  Pizza: Pizza,
  Burger: Hamburger,
  Sandwich: Bread,
  IceCream: IceCream,
  // Pasta: {},
  // Ramen: {},
  // Sushi: {},
  // Taco: {},
};

export const places = {
  Beach: Island,
  Mountain: Mountains,
  Park: Park,
  Fuel: GasPump,
  Hospital: Hospital,
  Pharmacy: Asclepius,
  Supermarket: Basket,
  Restaurant: Martini,
  Bar: BeerStein,
  Cafe: Coffee,
  Church: Church,
};

export const other = {
  MapPin: MapPin,
  Map: MapTrifold,
  MapPinLine: MapPinLine,
  Compass: Compass,
  Folder: Folder,
};

export const Icons = {
  ...transport,
  ...accommodation,
  ...activities,
  ...places,
  ...food,
  ...other,
};
