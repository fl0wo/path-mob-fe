import { createStore } from "redux";
import reducer from '../utils/reducer'

export const INIT_BASE = {
  jwt: null,
  map: null,
  user:null,
  events:null,
  isLive:true,
  selectedPaths:null,
  livePaths:[],
  number:1,
  wantMore:true,
  busStops:[]
};

function configureStore(base:any = INIT_BASE) {
  return createStore(reducer,base);
}

export default configureStore;
