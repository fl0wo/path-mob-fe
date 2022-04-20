export default (state: any,
                action: { type: any; payload: any; }
) => {
  switch (action.type) {
    case "base":
      return action.payload
    case "livepath":
      return {
        ...state,
        livePaths : action.payload
      }
    case "liveupdate":
      return {
        ...state,
        wantMore : action.payload
      }
    case "selectedpath":
      return {
        ...state,
        selectedPaths : action.payload
      }
    case "bus":
      return {
        ...state,
        busStops:action.payload
      }
    case "newuser" :
      return {
        ...state,
        user: action.payload
      }
    default:
      return state;
  }
};