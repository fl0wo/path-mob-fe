import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setBusStops } from '../../utils/actions';
import { Point } from 'pigeon-maps';
import Button from '@mui/material/Button';
import { getBus } from '../api';

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

const BusStopDrawer = ({
                               mapState: {width, height},
                               latLngToPixel,
                         pixelToLatLng,
                               busStoppes,
                               style = {strokeWidth: 5, abWith:10},
  busStops,setBus
                           }) => {

  let [wantSearch,setSearch] = useState(false)

  let [a,setA] = useState(null)
  let [b,setB] = useState(null)


  function getBusStops(bus,allBusStops,stopsToCoordinateDict) {
        if (!bus) {
            return null;
        }

        const myLat = bus.latitude;
        const myLong = bus.longitude;

        let pixel = latLngToPixel(toArray({
          lat: bus.latitude,
          long:bus.longitude
        }))

        return (
          <>
            <circle cx={pixel[0]} cy={pixel[1]} r={style.strokeWidth} fill='red'/>
            <text x={pixel[0]} y={pixel[1]}>{bus.shortDescription}</text>
          </>
        )


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
/*
      for (let i = 0; i < coordsAdj.length; i++) {
          if(bus.code === closestStop(coordsAdj[i].id)) {
            //cog(bus.code + " , " + closestStop(coordsAdj[i].id))

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
*/
    }


  function onClick(e:any) {
    if(!wantSearch)return;

    let currentTargetRect = e.currentTarget.getBoundingClientRect();
    const x = e.pageX - currentTargetRect.left,
      y = e.pageY - currentTargetRect.top;

    let pixel:Point = pixelToLatLng(toArray({
      lat: x,
      long:y
    }))

    if(a && b){
      setB(null)
      setA(pixel)
    } else if (!a) {
      setA(pixel)
    } else {
      setB(pixel)
    }

/*
    setBus(busStops.concat([
      {"code":"test","latitude":pixel[0]+'',"longitude":pixel[1]+'',"name":"Borca di Cadore-Agip-Strada Statale 51 di Alemagna","virtualStation":"cb5c4b17-a260-42ca-99d9-42c6cd22324f","connections":[],"country":"IT","shortDescription":"Borca di Cadore-Agip","address":"Strada Statale 51 di Alemagna","owners":["cortinaexpress"]}
    ]))
*/

  }

  function onkeyDown(e: any) {
  }

  function switchSearchMode(){
    setSearch(!wantSearch);
  }

  function getClosestStop(a, busStops) {
    let bestId = -1;
    let bestD = 10000000000;
    for(let i=0;i<busStops.length;i++){
      if(distance(a,busStops[i])<bestD){
        bestD=distance(a,busStops[i])
        bestId = i;
      }
    }

    return bestId
  }

  function getLine(a, busStop) {
    let pixel = latLngToPixel(toArray({lat:a.latitude,long:a.longitude}))
    let pixel2 = latLngToPixel(toArray({lat:busStop.latitude,long:busStop.longitude}))

    return <line
      key={a.latitude+''}
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
    />
  }

  function getSPA(a, b, busStops) {
    if(!a || !b) return null
    a = {latitude:Number.parseFloat(a[0]),longitude:Number.parseFloat(a[1])}
    b = {latitude:Number.parseFloat(b[0]),longitude:Number.parseFloat(b[1])}

    const idBestStopFromA = getClosestStop(a,busStops)
    const idBestStopFromB = getClosestStop(b,busStops)

    if(idBestStopFromA==-1 || idBestStopFromB==-1){
      console.log('noclose stop')
      return null
    }
    const lineA = getLine(a,busStops[idBestStopFromA])
    const lineB = getLine(b,busStops[idBestStopFromB])

    return [lineA,lineB];
  }

  function getMap() {
      let coordsStops =  {}

      busStoppes.forEach(stop=>{
        coordsStops[stop.code] = {
          lat:stop.latitude,
          long:stop.longitude
        }
      });
      const busStops = busStoppes.map(bus => {
        return getBusStops(bus,busStoppes,coordsStops);
      })

    function toPointOnMap(a,c,isStart) {
      if(!a)return null
      let p = latLngToPixel(toArray({
        lat: a[0]+'',
        long:a[1]+''
      }))
      return a ?
        <>
          <text x={p[0]} y={p[1]-15}>{isStart?"START":"END"}</text>
          <circle cx={p[0]} cy={p[1]} r={style.abWith} style={{borderRadius:3,borderBlockColor:'black'}} fill={c}  />
        </>
      : null;
    }

      const withA = toPointOnMap(a,'blue',true)
      const withB = toPointOnMap(b, 'blue',false)

      const spa = getSPA(a,b,busStoppes)

      return busStops.concat([withA,withB,spa])

  }

  return (
    <div>
      <Button
        style={{color:"#000",position:'absolute'}}
        onClick={switchSearchMode}>
        {wantSearch ? "SEARCHING ENABLED" : "SEARCHING DISABLED"}
      </Button>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div onClick={onClick} onKeyDown={onkeyDown}>
        <svg width={width} height={height}
             style={{top: 0, left: 0}}>
          {getMap()}
        </svg>
      </div>
    </div>
    )
}


const mapStateToProps = (state:any) => ({
  ...state
});

const mapDispatchToProps = (dispatch: any) => ({
  setBus: (paths: any) => {
    dispatch(setBusStops(paths));
  }
});

function distance(a, b) {
  const lat1=Number.parseFloat(a.latitude)
  const lon1=Number.parseFloat(a.longitude)
  const lat2=Number.parseFloat(b.latitude)
  const lon2=Number.parseFloat(b.longitude)
  let x = deg2rad( lon1 - lon2 ) * Math.cos( deg2rad( (lat1+lat2) /2 ) );
  let y = deg2rad( lat1 - lat2 );
  let dist = 6371000.0 * Math.sqrt( x*x +y*y );

  return dist;
}

function deg2rad(degrees) {
  var pi = Math.PI;
  return degrees * (pi/180);
}
export default connect(mapStateToProps,mapDispatchToProps)(BusStopDrawer);