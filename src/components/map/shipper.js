/**
 * @file shipper.js
 * @description Returns a Shipper Component so that it could be rendered in the map
 *
 */

import * as React from 'react';
import { Marker } from "react-google-maps";

import {
  smallVehicle,
  mediumVehicle,
  largeVehicle,
  extraLargeVehicle
} from './../../constants';


/**
 *
 */
const google=window.google


const Shipper = (props) => {
  let scale = 0.5;
  let vehicle = mediumVehicle;
  switch(props.shipper.information.shipperCapacity) {
    case 1:
      break;
    case 2:
      scale = 0.8;
      vehicle = smallVehicle;
      break;
    case 4:
      vehicle = largeVehicle;
      break;
    case 5:
      vehicle = extraLargeVehicle;
      break;
    default:
    break
  }
  const iconShipper = {
    scale,
    path: vehicle.top,
    fillColor: '#13CD65',
    fillOpacity: 1,
    strokeColor: '#000000',
    strokeWeight: 0.5,
    strokeOpacity: 1,
    anchor: new google.maps.Point(10, 20)
  }
  const iconShipperShadow = {
    scale,
    path: vehicle.bottom,
    fillColor: '#000000',
    fillOpacity: 1,
    strokeColor:'#000000',
    strokeWeight: 1,
    anchor: new google.maps.Point(10, 20)
  }
  if (props.shipper.rotation) {
    iconShipper.rotation = props.shipper.rotation;
    iconShipperShadow.rotation = props.shipper.rotation;
  }
  return (
    <div>
      <Marker
        zIndex={4}
        draggable={false}
        icon={iconShipperShadow}
        position={props.shipper.location}/>
      <Marker
        zIndex={5}
        draggable={false}
        icon={iconShipper}
        position={props.shipper.location}/>
    </div>
  )
}


export default Shipper;
