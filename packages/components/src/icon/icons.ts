// this file contains all the icons that are used for maps
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
  Bed,
} from "@phosphor-icons/react/ssr";


import type {
  IconType,
  PopularIcon,
} from "@buzztrip/backend/types";



/**
 * A list of the most popular icons, derived from the icons object.
 */
export const popular: Record<PopularIcon, Icon> = {
  Bed: Bed,
  Car: Car,
  Camping: Tent,
  Hiking: PersonSimpleHike,
  Biking: PersonSimpleBike,
  House: HouseLine,
};

export const Icons: Record<IconType, Icon> = {
  // transport
  Train: Train,
  Car: Car,
  Taxi: Taxi,
  Plane: AirplaneTilt,
  Ferry: Boat,
  Motorbike: Motorcycle,
  Bicyle: Bicycle,
  Bus: Bus,
  // accommodation
  Hotel: BuildingApartment,
  Motel: Garage,
  House: HouseLine,
  //   Villa: {},
  Cabin: Tipi,
  Camping: Tent,
  Bed: Bed,
  // activities
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
  // places
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
  // food
  Pizza: Pizza,
  Burger: Hamburger,
  Sandwich: Bread,
  IceCream: IceCream,
  // Pasta: {},
  // Ramen: {},
  // Sushi: {},
  // Taco: {},
  // misc
  Folder: Folder,
  MapPin: MapPin,
  Compass: Compass,
  Map: MapTrifold,
  MapPinLine: MapPinLine,
};
