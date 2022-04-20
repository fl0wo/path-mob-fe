import React from "react";

export function toArray(pos) {
    return [
        Number.parseFloat(pos.lat),
        Number.parseFloat(pos.long)
    ];
}

function calcCrow(lat1, lon1, lat2, lon2) {
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  lat1 = toRad(lat1);
  lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value)
{
  return Value * Math.PI / 180;
}

export const BusStopDrawer = ({
                               mapState: {width, height},
                               latLngToPixel,
                               busStoppes,
                               style = {strokeWidth: 5}
                           }) => {


    function getBusStops(bus,coordsAdj,allBusStops,stopsToCoordinateDict) {
        if (!bus) {
            return null;
        }

        const myLat = bus.latitude;
        const myLong = bus.longitude;

        let pixel = latLngToPixel(toArray({
          lat: bus.latitude,
          long:bus.longitude
        }))

        let lines = []

        lines.push(<circle cx={pixel[0]} cy={pixel[1]}
                           r={style.strokeWidth}
                           fill='red'/>)

      function closestStop(id) {
          const bus = allBusStops.filter(stop=>stop.code==id)[0]
        if(bus && bus.connections && bus.connections.length>0) {
          const shortestId = bus.connections
              .map(id => {
                return {
                  ... stopsToCoordinateDict[id],
                  id:id
                }
              }).sort((f,s)=>{
                  const first = calcCrow(myLat,myLong,f.lat,f.long)
                const second = calcCrow(myLat,myLong,s.lat,s.long)

                if (first < second) {
                    return -1;
                }
                if (first > second) {
                  return 1;
                }
                return 0;
              })
            [0].id

            return shortestId
          }

          return 'X'
      }

      for (let i = 0; i < coordsAdj.length; i++) {
          if(bus.code === closestStop(coordsAdj[i].id)) {
            console.log(bus.code + " , " + closestStop(coordsAdj[i].id))

            let pixel2 = latLngToPixel(toArray({lat:coordsAdj[i].lat,long:coordsAdj[i].long}))
            lines.push(<line
              key={i}
              x1={pixel[0]}
              y1={pixel[1]}
              x2={pixel2[0]}
              y2={pixel2[1]}
              style={
                {
                  stroke: 'green',
                  strokeWidth: 2
                }
              }
            />)
          }

        }

        return lines
    }

  function getMap() {
      let coordsStops =  {}

      busStoppes.forEach(stop=>{
        coordsStops[stop.code] = {
          lat:stop.latitude,
          long:stop.longitude
        }
      });
      return busStoppes.map(bus => {
        let coordsAdj = []
        if(bus.connections && bus.connections.length>0) {
          coordsAdj = bus.connections
            .map(id => {
              return {
                ... coordsStops[id],
                id:id
              }
            })
        }
        return getBusStops(bus, coordsAdj,busStoppes,coordsStops);
      });
  }

  return (
        <svg width={width} height={height}
             style={{top: 0, left: 0}}
        >
            {getMap()}
        </svg>
    )
}