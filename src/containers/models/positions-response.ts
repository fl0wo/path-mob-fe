export interface PositionsResponse{
  _id:String
  who:String
  color:String
  positions:[{
    coords:{
      lat:Number
      long:Number
    }
    _id:String
    timestamp:Number
  }]
}

export interface BusPosition{
  code:String
  latitude:String
  longitude:String
  name:String
  country:String
  address:String
  shortDescription:String
  connections:Array<String>
}



export interface SupportedExtra {
  bags: boolean;
  max_bags: number;
  animals: boolean;
  max_passengers: number;
  pos: boolean;
  low_car: boolean;
}

export interface Fleet {
  id: string;
  name: string;
  phone: string;
  supported_extra: SupportedExtra;
  seconds_for_booking: number;
}

export interface Pickup {
  id: string;
  full_address: string;
  address: string;
  building_number: string;
  latitude: number;
  longitude: number;
}

export interface Booking {
  blocked: boolean;
  message: string;
}

export interface Area {
  blocked: boolean;
}

export interface TaxiPosition {
  status: string;
  eta: number;
  fleet: Fleet;
  pickups: Pickup[];
  booking: Booking;
  area: Area;
  terms_and_conditions: string;
  cancellation_policies: string;
}



  export interface Segment {
    departureDateTime: Date;
    arrivalDateTime: Date;
    departureStationCode: string;
    arrivalStationCode: string;
    carrier: string;
    travelMode: string;
    line: string;
    kind: string;
  }

  export interface Solution {
    solutionId: string;
    departureStationCode: string;
    arrivalStationCode: string;
    departureDateTime: Date;
    arrivalDateTime: Date;
    segments: Segment[];
  }

  export interface Offer {
    offerId: string;
    availability: number;
    totalPriceInCents: number;
  }

  export interface Combination {
    outboundSolutionId: string;
    inboundSolutionId: string;
    offers: Offer[];
  }

  export interface SolutionsBus {
    currency: string;
    solutions: Solution[];
    combinations: Combination[];
  }


