import { LoginResponse } from './models/login-response';
import axios from 'axios';
import { ProfileResponse } from './models/profile-response';
import { BusPosition, PositionsResponse, TaxiPosition } from './models/positions-response';

let jwt:any = null;
const LOCALURL = "http://localhost:3401";
const BASEURL = LOCALURL
// "http://141.94.250.185:3401";

const login = async (email: string, pwd: string) => {

  const params = new URLSearchParams();
  params.append('email', email);
  params.append('password', pwd);

  return axios
    .post<LoginResponse>(BASEURL + "/login", params)
    .then((res) => {
      jwt = res.data.token;
      return res.data.token;
    });
}

const register = async (name: string, email: string, pwd: string) => {

    const params = new URLSearchParams();
    params.append('email', email);
    params.append('password', pwd);
    params.append('name', name);

    return axios.post(BASEURL + "/register",params)
        .then((res: { data: { token: String; }; })=>{
            jwt = res.data.token;
            return jwt;
        });
}

const registerKid = async (name: string,
                           kidId: string,
                           lat:number,
                           long:number) => {

  return axios.post(BASEURL + "/profile/kid/add",
    {
    childId : kidId,
    childName : name,
    lat: lat,
    long: long
  },header(jwt))
    .then((res: any)=>{
      return res;
    })
    .catch(handleError);

}

const getBus = async () => {
    return axios.get<BusPosition[]>(BASEURL + "/bus/all",header(jwt))
      .then(r=>{
        return r
      })
      .catch(handleError);
}


const getMyKids = async () => {
    if (jwt==null) return null;

    return axios.get<PositionsResponse[]>(BASEURL + "/positions/",header(jwt))
        .then(r=>r)
        .catch(handleError);

}

const me = async () => {
    if (jwt==null) return null;

    return axios.get<ProfileResponse>(BASEURL + "/profile",header(jwt))
        .then(identity)
        .catch(handleError);
}

const myEvent = async (eventId: any) => {
    if (jwt==null) return null;

    return axios.post(BASEURL + "/profile/event/show",
        {
            id : eventId
        },
        header(jwt))
        .then(identity)
        .catch(handleError);
}

const myEventAdd = async (eventName: string, eventDurationMinutes:string) => {
  if (jwt==null) return null;

  return axios.post(BASEURL + "/profile/event/add",
    {
      title : eventName,
      duration : eventDurationMinutes
    },
    header(jwt))
    .then(identity)
    .catch(handleError);
}

function handleError(err: any) {
    return err.response.data;
}

function header(jwt: String) {
    return {
        headers: {}
    };
}

let identity=(res: any)=>{
  //alert(JSON.stringify(res))
  return res
};

export {register,login, getMyKids, me, myEvent,registerKid, myEventAdd , getBus}