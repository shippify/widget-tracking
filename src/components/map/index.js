/**
 * @file index.js
 * @description Map index component
 *
 */

import React from 'react';
import axios from 'axios';
import Shipper from './shipper';
import {
  Marker,
  Polyline,
  GoogleMap,
  withGoogleMap
} from "react-google-maps";
import { InfoBox } from "react-google-maps/lib/components/addons/InfoBox";
import { mapStyle } from './../../constants';

import './index.css';

/**
 *
 */
const google=window.google

const mapOptions = {
  zoom: 15,
  disableDefaultUI: true,
  styles: mapStyle,
  draggable: true,
  zoomControl: true,
  zoomControlOptions: {
    style: google.maps.ZoomControlStyle.LARGE,
    position: google.maps.ControlPosition.RIGHT_BOTTOM
  }
}

/**
 *
 */
class MapCard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      titleText: window.translate("Current status"),
      cardText: this.props.cardText,
      showCard: this.props.showCard,
      showBox: true,
      cardColor: this.props.cardColor,
      cardIcon: "https://cdn.shippify.co/icons/icon-error-green-mini.svg"
    }
  }
  componentWillMount(){
    let showCard = this.state.showCard;
    let cardIcon = this.state.cardIcon;
    let cardColor = this.state.cardColor;
    let titleText = this.state.titleText;
    if (!showCard){
      titleText = window.translate("is your recipient information correct?")
    }
    if (cardColor === "r"){
      cardColor = "#ef404b"
      cardIcon = "https://cdn.shippify.co/icons/icon-error-red-mini.svg"
    } else if (cardColor === "g") {
      cardColor = "#12ce66"
      cardIcon = "https://cdn.shippify.co/icons/icon-error-green-mini.svg"
    } else {
      cardColor = "#757575"
      cardIcon = "https://cdn.shippify.co/icons/icon-error-gray-mini.svg"
    }
    this.setState({
      titleText: titleText,
      showBox: true,
      cardIcon: cardIcon,
      cardColor: cardColor
    });
  }
  render() {
    return (
      <div>
        {
          this.state.showBox &&
          <div>
            {
              this.state.showCard &&
              <div className="shy-tracking-map-gm-card-ctn">
                <div className="shy-tracking-map-gm-card">
                  <div className="shy-tracking-map-gm-card-title">
                    {this.state.titleText}
                  </div>
                  <div className="shy-tracking-map-gm-card-status-box">
                    <div className="shy-tracking-map-gm-card-icon-ctn">
                      <img
                        alt=""
                        className="shy-tracking-map-gm-card-icon"
                        src={this.state.cardIcon}></img>
                    </div>
                    <div className="shy-tracking-map-gm-card-message-box">
                      <div
                        className="shy-tracking-map-gm-card-message"
                        style={{color: this.state.cardColor}}>
                        {this.state.cardText}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
            {
              !this.state.showCard &&
              <div className="shy-tracking-map-gm-card-ctn">
                <div className="shy-tracking-map-gm-card" style={{height: "97px"}}>
                  <div className="shy-tracking-map-gm-card-title">
                    {this.state.titleText}
                  </div>
                  <div className="shy-tracking-map-gm-card-buttons">
                    <button
                      className="shy-tracking-map-gm-card-button-no"
                      onClick={this.props.openModal}>
                        {window.translate("No")}
                    </button>
                    <button
                      className="shy-tracking-map-gm-card-button-yes"
                      onClick={()=>{
                        this.props.closeInfoBox();
                        this.setState({showBox: false});
                        document.querySelector("#shy-tracking-map > div > div > div:nth-child(1) > div.gm-style-pbc").style.opacity = "0 !important;"
                        document.querySelector(".infoBox").style.display = "none !important;"
                      }}>
                        {window.translate("Yes")}
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    )
  }
}


class GoogleMapComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showInfoBox: true,
      mapBounds: this.props.mapBounds
    }
    this.closeInfoBox = this.closeInfoBox.bind(this);
  }
  componentDidUpdate(prevProps, prevState){
    if (prevProps.mapBounds !== this.props.mapBounds){
      if (this.props.shipper && (
        this.props.isGoingToDropoff(this.props.status) ||
        this.props.isAtDropoff(this.props.status) ||
        this.props.isDroppedOff(this.props.status)
      )){
        let bounds = new google.maps.LatLngBounds();
        bounds.extend(new google.maps.LatLng(this.props.dropoffLocation.lat, this.props.dropoffLocation.lng));
        if (!isNaN(this.props.shipper.location.lat()) && !isNaN(this.props.shipper.location.lng())){
          bounds.extend(new google.maps.LatLng(this.props.shipper.location.lat(), this.props.shipper.location.lng()));
          this.map.fitBounds(this.props.mapBounds);
        }
      }
    }
  }
  componentDidMount(){
    if (
      (
        this.props.isGoingToDropoff(this.props.status) ||
        this.props.isAtDropoff(this.props.status) ||
        this.props.isDroppedOff(this.props.status)
      ) &&
      this.props.shipper
    ) {
      if (!isNaN(this.props.shipper.location.lat()) && !isNaN(this.props.shipper.location.lng())){
        let bounds = new google.maps.LatLngBounds();
        bounds.extend(new google.maps.LatLng(this.props.dropoffLocation.lat, this.props.dropoffLocation.lng));
        bounds.extend(new google.maps.LatLng(this.props.shipper.location.lat(), this.props.shipper.location.lng()));
        this.map.fitBounds(bounds);
      }
    }
  }
  componentWillMount(){
    if ((this.props.isPendingToReview(this.props.status) ||
    this.props.isProcessing(this.props.status) ||
    this.props.isScheduled(this.props.status) ||
    this.props.isBroadcasting(this.props.status) ||
    this.props.isAssigned(this.props.status) ||
    this.props.isAtPickup(this.props.status) ||
    this.props.isOnDelivery(this.props.status)) && !this.props.token){
      this.setState({
        showInfoBox: false
      })
    }
  }
  closeInfoBox(){
    this.setState({
      showInfoBox: false
    })
  }
  render() {
    const props = this.props;
    const google=window.google

    return (
      <GoogleMap
        defaultZoom={15}
        options={mapOptions}
        defaultCenter={
          {
            lat: props.dropoffLocation.lat,
            lng: props.dropoffLocation.lng
          }
        }
        ref={(map) => {
          this.map = map;
        }}
        onCenterChanged={() => {
          if (this.map) {
            props.updateMapCenter(
              this.map.getCenter().lat(),
              this.map.getCenter().lng()
            );
          }
        }}>
        {
          ((this.state.showInfoBox) &&
          (!this.props.isGoingToDropoff(this.props.status) &&
          !this.props.isAtDropoff(this.props.status) &&
          !this.props.isDroppedOff(this.props.status))) &&
          <InfoBox
            position={
              new google.maps.LatLng(
                props.dropoffLocation.lat,
                props.dropoffLocation.lng
              )
            }
            options={{
              enableEventPropagation: true,
              pixelOffset: new google.maps.Size(32,-72)
            }}>
            <div>
              {
                props.isCanceled(props.status) &&
                <MapCard
                  cardText={window.translate("Canceled").toUpperCase()}
                  showCard={true}
                  cardColor="r"/>
              }
              {
                (
                  props.isReturned(props.status)
                ) &&
                <MapCard
                  cardText={window.translate("Returned").toUpperCase()}
                  showCard={true}
                  cardColor="r"/>
              }
              {
                (
                  props.isReturning(props.status)
                ) &&
                <MapCard
                  cardText={window.translate("Returning").toUpperCase()}
                  showCard={true}
                  cardColor="r"/>
              }
              {
                props.isCompleted(props.status) &&
                <MapCard
                  cardText={window.translate("Completed").toUpperCase()}
                  showCard={true}
                  cardColor="g"/>
              }
              {
                props.isConfirmedToPickup(props.status) &&
                <MapCard
                  cardText={window.translate("Shipper confirmed").toUpperCase()}
                  showCard={true}
                  cardColor="gr"/>
              }
              {
                (
                  (props.isPendingToReview(props.status) ||
                  props.isProcessing(props.status) ||
                  props.isScheduled(props.status) ||
                  props.isBroadcasting(props.status) ||
                  props.isAssigned(props.status)) &&
                  props.token
                )  &&
                <MapCard
                  cardText={window.translate("is your recipient information correct?")}
                  showCard={false}
                  closeInfoBox={this.closeInfoBox}
                  cardColor="gr"
                  openModal={props.openModal}/>
              }
            </div>
          </InfoBox>
        }
        {
          props.isMarkerShown &&
          <Marker
            position={{
              lat: props.dropoffLocation.lat,
              lng: props.dropoffLocation.lng
            }}
            draggable={false}
            icon={props.isCompleted(props.status) ?
              "https://cdn.shippify.co/icons/icon-pin-green.svg" :
              "https://cdn.shippify.co/icons/icon-pin-red.svg"
            }
            options={{ anchor: new google.maps.Point(0, 2)}}/>
        }
        {
          ((this.props.isGoingToDropoff(this.props.status) ||
          this.props.isAtDropoff(this.props.status) ||
          this.props.isDroppedOff(this.props.status)) &&
          props.shipper) &&
          <Shipper shipper={props.shipper}/>
        }
        {
          (this.props.isGoingToDropoff(this.props.status) ||
          this.props.isAtDropoff(this.props.status) ||
          this.props.isDroppedOff(this.props.status)) &&
          props.shipper &&
          props.shipper.firstPolyline &&
          <Polyline
            options={{
              strokeColor: '#FF0000',
              strokeOpacity: 0.00001,
              strokeWeight: 0
            }}
            path={props.shipper.firstPolyline.getPath()}/>
        }
        {
          (this.props.isGoingToDropoff(this.props.status) ||
          this.props.isAtDropoff(this.props.status) ||
          this.props.isDroppedOff(this.props.status)) &&
          props.deliveryPolyline &&
          <div>
            <Polyline
              options={{
                strokeColor: '#1FB6FF',
                strokeWeight: 3,
                zIndex: 3
              }}
              path={props.deliveryPolyline.getPath()}/>
            <Polyline
              options={{
                strokeColor: '#126892',
                strokeWeight: 5,
                zIndex: 2
              }}
              path={props.deliveryPolyline.getPath()}/>
          </div>
        }
      </GoogleMap>
    )
  }
}

/**
 *
 */
const MapComponent = withGoogleMap(GoogleMapComponent)


/**
 *
 */
class TrackingMap extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showThanks: false,
      showCanceled: true,
      ratedMessage: ""
    }
    this.saveDeliveryStars = this.saveDeliveryStars.bind(this);
  }
  saveDeliveryStars(stars){
    let selfAxios = this;
    setTimeout(function(){
      selfAxios.setState({
        showThanks: true
      })
      const url = new URL('https://api.shippify.co')
      url.pathname = `/track/rate/${this.props.taskId}`
      axios.post(url, {
        stars: stars,
        token: this.props.token
      })
      .then(function (response) {
        selfAxios.setState({
          ratedMessage: window.translate("Thanks for your feedback!")
        });
        window.location.reload()
      })
      .catch(function (error) {
        console.log(error);
        selfAxios.setState({
          ratedMessage: window.translate("Something went wrong, please try again")
        });
        window.location.reload()
      });
    }.bind(this), 100);
  }
  render() {
    return (
      <div>
        {
          (true) &&
          <div>
            <div className={(this.props.logo) ? "shy-tracking-map-delivery-info" : "shy-tracking-map-delivery-info-no-co"}>

              <div className={(this.props.logo) ? "shy-tracking-map-widget-icon-ctn" : "shy-tracking-map-widget-icon-ctn-no-co"}>
                <img alt="" className="shy-tracking-map-widget-icon" src="https://cdn.shippify.co/icons/icon-link-gray.svg"></img>
              </div>
              <div className= "shy-tracking-map-element-box">
                <div className="shy-tracking-map-task-id"> {this.props.taskId} </div>
                <div className="shy-tracking-map-dimmed-text shy-tracking-map-generic-text"> {window.translate("Reference ID")}</div>
              </div>
            </div>
            {
              (this.props.isGoingToDropoff(this.props.status) ||
              this.props.isAtDropoff(this.props.status) ||
              this.props.isDroppedOff(this.props.status)) &&
              <div className="shy-tracking-map-recording-live-box">
                <div className="shy-tracking-map-recording-live-text">
                  LIVE &nbsp;
                </div>
                <div className="shy-tracking-map-recording-pulse">
                </div>
              </div>
            }
            {
              this.props.logo &&
              <div className="shy-tracking-map-company-logo-ctn">
                <img className="shy-tracking-map-company-logo" src={this.props.logo} alt=""/>
              </div>
            }
              <MapComponent
                isMarkerShown
                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3&libraries=drawing,places,geometry&key=AIzaSyBGhvLIKDkKTKmSUyE6EmdQwWu4uz3Fbqc"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div />}
                mapElement={<div id="shy-tracking-map" />}
                options={mapOptions}
                map={this.props.map}
                token={this.props.token}
                deliveryPolyline={this.props.deliveryPolyline}
                updateMapCenter={this.props.updateMapCenter}
                shipper={this.props.shipper}
                status={this.props.status}
                isAssigned={this.props.isAssigned}
                isBroadcasting={this.props.isBroadcasting}
                isScheduled={this.props.isScheduled}
                isPickedUp={this.props.isPickedUp}
                isCanceled={this.props.isCanceled}
                isOnDelivery={this.props.isOnDelivery}
                isGoingToDropoff={this.props.isGoingToDropoff}
                isAtDropoff={this.props.isAtDropoff}
                isDroppedOff={this.props.isDroppedOff}
                isCompleted={this.props.isCompleted}
                isReturning={this.props.isReturning}
                isAtPickup={this.props.isAtPickup}
                isReturned={this.props.isReturned}
                isHoldByCourier={this.props.isHoldByCourier}
                openModal={this.props.openModal}
                dropoffLocation={this.props.dropoffInfo.location}
                isProcessing={this.props.isProcessing}
                isPendingToReview={this.props.isPendingToReview}
                isConfirmedToPickup={this.props.isConfirmedToPickup}
                mapBounds={this.props.mapBounds}
                taskId={this.props.taskId}/>
            <div className="shy-tracking-map-info-list">
              <div className="shy-tracking-map-contact">
                <div className="shy-tracking-map-element-box">
                  <div className="shy-tracking-map-icon-ctn">
                    <img alt="" className="shy-tracking-map-icon" src="https://cdn.shippify.co/icons/icon-user-gray.svg"></img>
                  </div>
                </div>
                <div className="shy-tracking-map-element-box">
                  <div className={this.props.isAuth? "":"shy-tracking-map-blur"}>
                    { this.props.isAuth?decodeURI(this.props.recieverInfo.name ? this.props.recieverInfo.name : '' ): 'User Name' }
                  </div>
                  <div className={this.props.isAuth?"shy-tracking-map-dimmed-text":"shy-tracking-map-blur"}>
                    { this.props.isAuth?decodeURI(this.props.recieverInfo.phonenumber ? (this.props.recieverInfo.phonenumber !=="undefined" ? this.props.recieverInfo.phonenumber : '') : '' ):'+593000000' }
                  </div>
                  <div className={this.props.isAuth?"shy-tracking-map-dimmed-text":"shy-tracking-map-blur"}>
                    { this.props.isAuth?decodeURI(this.props.recieverInfo.email ? (this.props.recieverInfo.email !=="undefined" ? this.props.recieverInfo.email: '' ) : '' ):'email@shippify.com' }
                  </div>
                </div>
              </div>
              <div className="shy-tracking-map-location">
                <div className="shy-tracking-map-element-box">
                  <div className="shy-tracking-map-icon-ctn">
                    <img alt="" className="shy-tracking-map-icon" src="https://cdn.shippify.co/icons/icon-place-gray.svg"></img>
                  </div>
                </div>
                <div className="shy-tracking-map-element-box">
                  <div className={this.props.isAuth?"shy-tracking-map-dimmed-text":"shy-tracking-map-blur"}>
                    { this.props.isAuth?decodeURI(this.props.dropoffInfo.location.address):"742 Avenida Siempreviva, Springfield." }
                  </div>
                  {
                    this.props.dropoffInfo.location.instructions &&
                    <div className={this.props.isAuth?"shy-tracking-map-dimmed-text":"shy-tracking-map-blur"}>
                      { this.props.isAuth?decodeURI(this.props.dropoffInfo.location.instructions):"preguntar por los simpson" }
                    </div>
                  }
                </div>
              </div>
            </div>
            {
              (!this.props.isCanceled(this.props.status) &&
               !this.props.isCompleted(this.props.status) &&
               !this.props.isReturning(this.props.status) &&
               !this.props.isReturned(this.props.status) &&
                this.props.token) &&
              <div>
                <div className="shy-tracking-map-divider"></div>
                <div className="shy-tracking-map-footer">
                  <div> {window.translate("Confirm that the recipient information is correct")} </div>
                    <div className="shy-tracking-map-report-error-ctn">
                      <button className="shy-tracking-map-report-error-btn" onClick = {this.props.openModal}>
                        {window.translate("Report problem").toUpperCase()}
                      </button>
                    </div>
                </div>
              </div>
            }
          </div>
        }
        {
          (
           ( this.props.isPendingToReview(this.props.status) ||
            this.props.isBroadcasting(this.props.status) ||
            this.props.isProcessing(this.props.status) ||
            this.props.isScheduled(this.props.status) ||
            this.props.isAssigned(this.props.status)) &&
            document.querySelector("#shy-tracking-map > div > div > div:nth-child(1) > div.gm-style-pbc")
          )  &&
          <div className="shy-tracking-map-dimmed-overlay">
          </div>
        }
        {
          (this.props.isCanceled(this.props.status) && this.state.showCanceled) &&
          <div className="shy-tracking-modal-error-report-ctn">
            <div className="shy-v1-modal">
              <div className="shy-v1-modal-content-canceled" onClick={(e) => e.stopPropagation()}>
                <div className="shy-v1-modal-content-canceled-header">
                  <span className="shy-v1-header-content">
                    <div className="icon-v1-margin-right-lg">
                      <img className="icon-error" src="https://cdn.shippify.co/icons/icon-warning-white.svg" alt=""/>
                    </div>
                    {window.translate("notdelivered_message_title")}
                  </span>
                  <img
                    src="https://cdn.shippify.co/dash/general/img/close-gray.svg"
                    className="shy-v1-modal-close"
                    alt="Close"
                    onClick={() => {
                      this.setState({
                        showCanceled: false
                      })
                    }}/>
                </div>

                <div className="shy-v1-modal-content-canceled-body shy-change-status-modal">
                  <div className="shy-tracking-map-resp-box">
                    <div className= "shy-tracking-map-element-box">
                      <div className="shy-tracking-map-task-id"> {this.props.taskId} </div>
                      <div className="shy-tracking-map-dimmed-text shy-tracking-map-generic-text"> {window.translate("Reference ID")}</div>
                    </div>
                  </div>
                  <div className="shy-tracking-map-additional-phases">
                    <div className="shy-tracking-map-additional-phases-cancelled-img">
                      <img
                        alt=""
                        width="100"
                        height="100"
                        src="https://cdn.shippify.co/images/img-no-results.svg">
                      </img>
                    </div>
                    <div className="shy-tracking-map-additional-phases-main-text">
                      {window.translate("notdelivered_message_title")}
                    </div>
                    <div className="shy-tracking-map-additional-phases-secondary-text">
                      {window.translate("notdelivered_message_summary")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        {
          (this.props.isCompleted(this.props.status) && !this.props.stars && this.props.token) &&
          <div className="shy-tracking-modal-error-report-ctn">
            <div className="shy-v1-modal">
              <div className="shy-v1-modal-content-canceled shy-v1-modal-content-completed" onClick={(e) => e.stopPropagation()}>
                <div className="shy-v1-modal-content-canceled-header">
                  <span className="shy-v1-header-content">
                    <div className="icon-v1-margin-right-lg">
                      <img className="icon-error" src="https://cdn.shippify.co/icons/icon-check-white.svg" alt=""/>
                    </div>
                    {window.translate("Delivered successfully")}
                  </span>
                  <img
                    src="https://cdn.shippify.co/dash/general/img/close-gray.svg"
                    className="shy-v1-modal-close"
                    alt="Close"
                    style={{visibility: "hidden"}}
                    onClick={() => {
                      this.setState({
                        showCanceled: false
                      })
                    }}/>
                </div>

                <div className="shy-v1-modal-content-canceled-body shy-change-status-modal">
                  <div>
                    <div className="shy-tracking-map-resp-box">
                      <div className= "shy-tracking-map-element-box">
                        <div className="shy-tracking-map-task-id"> {this.props.taskId} </div>
                        <div className="shy-tracking-map-dimmed-text shy-tracking-map-generic-text"> {window.translate("Reference ID")}</div>
                      </div>
                    </div>
                    <div className="shy-tracking-map-additional-phases">
                      <div className="shy-tracking-map-additional-phases-cancelled-img">
                        <img
                          alt=""
                          width="100"
                          height="100"
                          src="https://cdn.shippify.co/images/img-shipping-box.svg">
                        </img>
                      </div>
                      <div className="shy-tracking-map-additional-phases-main-text">
                        {window.translate("Delivered successfully")}
                      </div>
                      <div className="shy-tracking-map-additional-phases-divider"></div>
                      {
                        (!this.state.showThanks) &&
                        <div className="shy-tracking-map-additional-phases-secondary-text">
                          {window.translate("Please rate the delivery")}
                        </div>
                      }
                      {
                        (!this.state.showThanks) &&
                          <div className="shy-tracking-rating rating rating2">
                            <a className="shy-tracking-rating-star" href="#5" onClick={()=>{this.saveDeliveryStars(5)}} title="5 stars">★</a>
                            <a className="shy-tracking-rating-star" href="#4" onClick={()=>{this.saveDeliveryStars(4)}} title="4 stars">★</a>
                            <a className="shy-tracking-rating-star" href="#3" onClick={()=>{this.saveDeliveryStars(3)}} title="3 stars">★</a>
                            <a className="shy-tracking-rating-star" href="#2" onClick={()=>{this.saveDeliveryStars(2)}} title="2 stars">★</a>
                            <a className="shy-tracking-rating-star" href="#1" onClick={()=>{this.saveDeliveryStars(1)}} title="1 star">★</a>
                          </div>
                      }
                      {
                        (this.state.showThanks) &&
                        <div className="shy-tracking-map-additional-phases-secondary-text">
                          {this.state.ratedMessage}
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}


export default TrackingMap;
