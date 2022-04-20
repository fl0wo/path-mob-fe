export interface ProfileResponse{
  role:String
  verified:Boolean
  name:String
  email:String
  verification:String
  childrens:[{
    _id:String
    name:String
    id:String
    color:String
  }],
  events:[{
    _id:String
    title:String
    date_start:Date
    date_end:Date
    childrens:[{
      _id:String
      name:String
      id:String
    }]
  }]
}