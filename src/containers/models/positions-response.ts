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
