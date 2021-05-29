import React from 'react';
import classes from './MapMarker.module.css'
import {mapMarkerImgs} from './mapMarkerImgs'
// import Image from 'next/image';
// import Link from 'next/link';

const MapMarker = (props) => {  
  let width = props.width;
  let height = props.height;
  let transform = 'translate(-50%, -50%)';  

  //if the marker is the center, double the width and update the transform
  if(Number(props.center.lat) === Number(props.lat) && Number(props.center.lng) === Number(props.lng) ){    
    width = width.split('px')[0]*2+'px';
    height = height.split('px')[0]*2+'px';
    transform = 'translate(-50%, -100%)'
  }  

  return (
    // <Link href={'/map/?id=1&title='+props.item.title+'&lat='+props.lat+'&lng='+props.lng}>
        <div className={classes.MapMarker} lat={props.lat} lng={props.lng} onClick={props.clicked}>
          {props.zoom >= 13 ?
            <img style={{
                width: width, height: height, 
                position: 'absolute', top: "50%", left: "50%", transform: transform,
                
              }} 
              src={mapMarkerImgs[props.item.pinCategory].img}
              alt={props.item.title}/>          
            :
            <img style={{
                width: '10px', height: '10px', 
                position: 'absolute', transform: 'translate(-50%, -50%)'
              }} 
              src={mapMarkerImgs[props.item.pinCategory].dot}
              alt={props.item.title}/>                  
          }
        </div>
    //   </Link>
      // <div className={classes.MapMarker} lat={props.lat} lng={props.lng} onClick={props.clicked}>
      //   {props.zoom >= 13 ?
      //     <Image style={{
      //         // width: width, height: height, 
      //         position: 'absolute', top: "50%", left: "50%", transform: transform,
              
      //       }}             
      //       width={width}
      //       height={height}
      //       src={mapMarkerImgs[props.item.pinCategory].img}
      //       alt={props.item.title}/>          
      //     :
      //     <Image style={{              
      //         position: 'absolute', transform: 'translate(-50%, -50%)'
      //       }}             
      //       width={'10px'}
      //       height={'10px'}
      //       src={mapMarkerImgs[props.item.pinCategory].dot}
      //       alt={props.item.title}/>                  
      //   }
      // </div>
    );
};

export default MapMarker;