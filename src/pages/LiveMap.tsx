import { styled, Typography } from '@mui/material';
import React, { Fragment, useContext } from 'react';
import { Helmet } from 'react-helmet';

import { AppContext } from '../contexts';
import { APP_TITLE, PAGE_TITLE_HOME } from '../utils/constants';
// @ts-ignore
import App from '../containers/app/logon.js'
// @ts-ignore
import { IntervalExample } from '../containers/components/interval.js';
import { connect } from 'react-redux';
import { Map } from 'pigeon-maps';
import { stamenToner } from 'pigeon-maps/providers';
// @ts-ignore
import { BusStopDrawer, toArray } from '../containers/components/busstopdrawer.js';

import useWindowDimensions from '../utils/window-dimensions';
import { getBus } from '../containers/api';
import { setBusStops, setLivePaths } from '../utils/actions';

const LiveMap = (props:any) => {

  const { height, width } = useWindowDimensions();

  if (!props.busStops || props.busStops.length==0)
    getBus().then((r)=>{
      props.setBus(r?.data)
    })

  function min(a:number,b:number){
    return a<b?a:b;
  }

  function getBusStops(busStops:any) {
    let center = busStops.length>0?
      toArray({lat: busStops[0].latitude,long:busStops[0].longitude}) :
      null

    return <Map
      provider={stamenToner}
      defaultCenter={center}
      defaultZoom={18}
      width={min(800,width-(width*20/100))}
      height={min(600,height-(height*20/100))}
    >
      <BusStopDrawer busStoppes={busStops}/>
    </Map>;  }

  return (
    <div>

      <div>
        width: {width} ~ height: {height}
      </div>

    {
      <div>
        <div>
          <IntervalExample></IntervalExample>
        </div>
        <div>
          {props.number}
        </div>
        <Fragment key={'livemap'}>
          {getBusStops(props.busStops)}
        </Fragment>
      </div>
    }
  </div>
  );
};

const mapStateToProps = (state:any) => ({
  ...state
});

const mapDispatchToProps = (dispatch: any) => ({
  setBus: (paths: any) => {
    dispatch(setBusStops(paths));
  }
});


export default connect(mapStateToProps,mapDispatchToProps)(LiveMap);