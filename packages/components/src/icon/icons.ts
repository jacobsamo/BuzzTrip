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
} from "@phosphor-icons/react/dist/ssr";

import type {
  AccommodationIcon,
  ActivitiesIcon,
  TransportIcon,
  FoodIcon,
  PlacesIcon,
  OtherIcon,
  IconType,
  PopularIcon,
} from "@buzztrip/db/types";


export const transport: Record<TransportIcon, Icon> = {
  Train: Train,
  Car: Car,
  Taxi: Taxi,
  Plane: AirplaneTilt,
  Ferry: Boat,
  Motorbike: Motorcycle,
  Bicyle: Bicycle,
  Bus: Bus,
};

export const accommodation: Record<AccommodationIcon, Icon> = {
  Hotel: BuildingApartment,
  Motel: Garage,
  House: HouseLine,
  //   Villa: {},
  Cabin: Tipi,
  Camping: Tent,
  Bed: Bed,
};

export const activities: Record<ActivitiesIcon, Icon> = {
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

export const food: Record<FoodIcon, Icon> = {
  Pizza: Pizza,
  Burger: Hamburger,
  Sandwich: Bread,
  IceCream: IceCream,
  // Pasta: {},
  // Ramen: {},
  // Sushi: {},
  // Taco: {},
};

export const places: Record<PlacesIcon, Icon> = {
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

export const other: Record<OtherIcon, Icon> = {
  Folder: Folder,
  MapPin: MapPin,
  Compass: Compass,
  Map: MapTrifold,
  MapPinLine: MapPinLine,
};

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
  ...transport,
  ...accommodation,
  ...activities,
  ...places,
  ...food,
  ...other,
};
