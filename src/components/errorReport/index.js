/**
 * @file index.js
 * @description Map index component
 *
 */

import React from 'react';

import './index.css';
import axios from 'axios';
import {
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import { mapStyle } from './../../constants';

const google=window.google

const mapOptions = {
  zoom: 17,
  disableDefaultUI: true,
  styles: mapStyle,
  zoomControl: true,
  zoomControlOptions: {
    style: google.maps.ZoomControlStyle.LARGE,
    position: google.maps.ControlPosition.RIGHT_TOP
  }
}

class GoogleMapErrorComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      lat: props.lat,
      lng: props.lng
    }
  }
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return (
      <GoogleMap
        defaultZoom={17}
        center={{ lat: this.state.lat, lng: this.state.lng}}
        ref={(reportMap) => {
          if (this.props.setMap){
            this.props.setMap(reportMap);
          }
        }}
        options={mapOptions}>
        {this.props.isMarkerShown &&
          <Marker
            position={{ lat: this.state.lat, lng: this.state.lng }}
            draggable={true}
            onDragEnd={(e)=> {
              this.props.onMarkerPositionChanged(e)
              this.setState({
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
              })
            }}
            defaultIcon="https://cdn.shippify.co/images/img-pin.svg"/>
        }
      </GoogleMap>
    )
  }
}

const MyMapComponent = withGoogleMap(GoogleMapErrorComponent)


/**
 *
 */
class TrackingErrorReport extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      long_address: decodeURI(this.props.dropoffInfo.address),
      apt_address: decodeURI(this.props.dropoffInfo.instructions),
      recipient: decodeURI(this.props.recieverInfo.name),
      phoneNumber: decodeURI(this.props.recieverInfo.phonenumber),
      mail: decodeURI(this.props.recieverInfo.email),
      isVisible: true,
      lat: this.props.lat,
      lng: this.props.lng,
      map: undefined,
      okButtonText: "OK",
      showError: false,
      addressError: false,
      instructionsError: false,
      nameError: false,
      phoneError: false,
      mailError: false,
      errorMessage: window.translate("Something went wrong, please try again"),
      showResultsContent: false
    };
    this.setMap = this.setMap.bind(this);
    this.changeAddress = this.changeAddress.bind(this);
    this.submitErrorReport = this.submitErrorReport.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.canSubmitErrorReport = this.canSubmitErrorReport.bind(this);
    this.onMarkerPositionChanged = this.onMarkerPositionChanged.bind(this);
    this.closeReportModal = this.closeReportModal.bind(this);
  };

  closeReportModal(){
    this.setState({
      showResultsContent: false,
      errorMessage: window.translate("Something went wrong, please try again")
    });
    this.props.closeModal();
  }
  componentDidMount(){
    document.body.style.overflowY = "hidden";
  }
  componentWillUnmount(){
    document.body.style.overflowY = "auto";
  }
  submitErrorReport(){
    this.setState({
      okButtonText: window.translate("Loading ...")
    });
    let postObject = {
      id: this.props.taskId,
      contact: {
        name: this.state.recipient,
        email: this.state.mail ?  this.state.mail : '',
        phonenumber: this.state.phoneNumber ? this.state.phoneNumber : this.state.phoneNumber
      },
      location: {
        address: this.state.long_address,
        lat: this.state.lat,
        lng: this.state.lng,
        instructions: this.state.apt_address === "undefined" ? "" : this.state.apt_address,
      }
    }
    let selfAxios = this;
    // const url = new URL('https://api.shippify.co')
    
    axios.post('http://localhost:8021/track/fix/address', postObject)
    .then(function (response) {
      let errorMessage
      if(response.data.data && response.data.data.event && response.data.data.event.state !== 'open'){
        errorMessage = window.translate("Thanks, your information was changed successfully");
        selfAxios.props.updateInfo(selfAxios.state);
      }else if(response.data.data && response.data.data.event && response.data.data.event.level === 'low'){
        errorMessage = window.translate('The information changes already was reported');
      }else{
        errorMessage = window.translate('We cant process your address correction for more of 2 km. Please contact with the e-commerce store');
      }
      selfAxios.setState({
        showResultsContent: true,
        errorMessage: errorMessage,
        showError: false
      })
    })
    .catch(function (error) {
      console.log(error);
      if (error.status === 400){
        selfAxios.setState({
          showError: true,
          errorMessage: window.translate("This information is already saved"),
          okButtonText: "OK"
        })
      }
      else {
        selfAxios.setState({
          showError: true,
          errorMessage: window.translate("Something went wrong, please try again"),
          okButtonText: "OK"
        });
        //window.location.reload()
      }

    });
  }

  changeAddress(lat, lng, newPlace){
    this.setState({
      lat: lat,
      lng: lng,
      long_address: newPlace
    })
  }

  setMap(map) {
    if (!this.state.map){
      this.setState({
        map
      })
    }
    addAutocompleteListener({
      map: this.state.map,
      changeAddress: this.changeAddress
    })
  }

  canSubmitErrorReport() {
    
    let long_address = this.state.long_address;
    // let apt_address = this.state.apt_address;
    //if (apt_address === "undefined") { return false;}
    let recipient = this.state.recipient;
    let phoneNumber = this.state.phoneNumber;
    let email = this.state.mail;
    let mail_re = /^\S+@\S+\.\S+$/
    let phone_re = /^([0-9_ ().+-])+$/;

    let requiredMail, requirePhone 
    if ( email && email.length > 0 && mail_re.test(email) ) {
      requiredMail = true
    }else{
      requiredMail = false
    }
    if (phoneNumber && phoneNumber.length >= 5 && phone_re.test(phoneNumber) ) {
      requirePhone = true
    }else{
      requirePhone = false
    }

    return (
      long_address.length > 10 &&
      recipient.length > 2 &&
      (requiredMail || requirePhone)
    );
  }

  onMarkerPositionChanged(e) {
    this.setState({
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    })
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { latLng: e.latLng },
      function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          const place = results[0];
          let address = '';
          if (place.name && !place.formatted_address.startsWith(place.name)) {
            address = `${place.name}, ${place.formatted_address}`;
          } else {
            address = `${place.formatted_address}`;
          }
          this.setState({
            long_address: address
          });
        }
      }.bind(this)
    );
  }

  handleInputChange(event) {
    const target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    if (value === "undefined"){
      value = "";
    }
    let name = target.name;
    let mail_re = /^\S+@\S+\.\S+$/
    let phone_re = /^([0-9_ ().+-])+$/;
    // if (name === "long_address"){
    //   if (value.length <= 10){
    //     this.setState({
    //       addressError: true
    //     })
    //   } else {
    //     this.setState({
    //       addressError: false
    //     })
    //   }
    // }
    if (name === "recipient"){
      if (value.length <= 2){
        this.setState({
          nameError: true
        })
      } else {
        this.setState({
          nameError: false
        })
      }
    }
    if (name === "mail"){
      if (!mail_re.test(value)){
        this.setState({
          mailError: true
        })
      } else {
        this.setState({
          mailError: false
        })
      }
    }
    if (name === "phoneNumber"){
      if (!phone_re.test(value)){
        this.setState({
          phoneError: true
        })
      }else {
        this.setState({
          phoneError: false
        })
      }
    }

    this.setState({
      [name]: value
    });
  }
    render() {
      if(this.props.isOpen){
        return (
            <div className="shy-tracking-modal-error-report-ctn">
              <div className="shy-v1-modal">
                <div className="shy-v1-modal-content shy-content-report-error-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="shy-v1-modal-content-header">
                    <span className="shy-v1-header-content">
                      <div className="icon-v1-margin-right-lg">
                        <img className="icon-error" src="https://cdn.shippify.co/icons/icon-warning-white.svg" alt=""/>
                      </div>
                      {window.translate("Report problem")}
                    </span>
                    <img
                      src="https://cdn.shippify.co/dash/general/img/close-gray.svg"
                      className="shy-v1-modal-close"
                      alt="Close"
                      onClick={() => this.closeReportModal()}/>
                  </div>
                  {
                    !this.state.showResultsContent &&
                    <div className="shy-v1-modal-content-body shy-change-status-modal">
                      <div className="shy-tracking-modal-error-report-info-text"> {window.translate("Check if the recipient information displayed is correct. If there is a problem, please report it and add the right information")} </div>

                      <div className="shy-tracking-modal-error-report-address-ctn">

                        <div className="shy-tracking-modal-error-report-dimmed-text">
                          {window.translate("Address")}
                        </div>

                        <MyMapComponent
                          isMarkerShown
                          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3&libraries=drawing,places,geometry&key=AIzaSyBGhvLIKDkKTKmSUyE6EmdQwWu4uz3Fbqc"
                          loadingElement={<div style={{ height: `100%` }} />}
                          containerElement={<div />}
                          mapElement={<div id="shy-tracking-modal-error-report-map-ctn" />}
                          options={mapOptions}
                          lat={this.state.lat}
                          lng={this.state.lng}
                          onMarkerPositionChanged={this.onMarkerPositionChanged}
                          setMap={ this.state.map ? undefined : this.setMap}
                        />

                          <input
                                 id="shy-tracking-modal-error-report-input-full"
                                 className="shy-tracking-modal-error-report-input-full"
                                 type="text"
                                 name="long_address"
                                 value={this.state.long_address === "undefined" ? "" : this.state.long_address}
                                 onChange={this.handleInputChange}
                                 autoComplete="on"
                                 placeholder={window.translate("Address")} />
                          <input
                                 className="shy-tracking-modal-error-report-input-full"
                                 type="text"
                                 name="apt_address"
                                 value={this.state.apt_address === "undefined" ? "" : this.state.apt_address}
                                 onChange={this.handleInputChange}
                                 placeholder={window.translate("Instructions")}/>
                           {
                            (this.state.addressError) &&
                            <div className="shy-tracking-modal-error-report-error-ind-msg">
                              {window.translate("Please enter a valid Delivery address")}
                            </div>
                           }
                           {
                            (this.state.instructionsError) &&
                            <div className="shy-tracking-modal-error-report-error-ind-msg">
                              El nombre ingresado no es valido
                            </div>
                           }
                      </div>

                      <div className="shy-tracking-modal-error-report-recipient-ctn">
                        <div className="shy-tracking-modal-error-report-dimmed-text">
                          {window.translate("Recipient")}
                        </div>

                        <input
                               className="shy-tracking-modal-error-report-input-full"
                               style={{marginTop: "0px"}}
                               type="text"
                               name="recipient"
                               value={this.state.recipient === "undefined" ? "" : this.state.recipient}
                               onChange={this.handleInputChange}
                               placeholder={window.translate("Name")} />
                        <input
                               className="shy-tracking-modal-error-report-input-half"
                               type="text"
                               name="phoneNumber"
                               value={this.state.phoneNumber === "undefined" ? "" : this.state.phoneNumber}
                               onChange={this.handleInputChange}
                               placeholder={window.translate("Phone")} />
                        <input
                               className="shy-tracking-modal-error-report-input-half"
                               style={{marginRight: "0px"}}
                               type="email"
                               name="mail"
                               value={this.state.mail === "undefined" ? "" : this.state.mail}
                               onChange={this.handleInputChange}
                               placeholder={window.translate("Email")} />
                        {
                         (this.state.nameError) &&
                         <div className="shy-tracking-modal-error-report-error-ind-msg">
                           {window.translate("Please enter your name")}
                         </div>
                        }
                        {
                         (this.state.phoneError) &&
                         <div className="shy-tracking-modal-error-report-error-ind-msg">
                           {window.translate("Please enter a valid phone number greater than 5 digits")}
                         </div>
                        }
                        {
                         (this.state.mailError) &&
                         <div className="shy-tracking-modal-error-report-error-ind-msg">
                           {window.translate("Please enter a valid email")}
                         </div>
                        }
                      </div>
                    </div>
                  }
                  {
                    this.state.showResultsContent &&
                    <div className="shy-v1-modal-content-body shy-change-status-modal">
                      <div className="shy-v1-modal-results-content-text">
                        {this.state.errorMessage}
                      </div>
                    </div>
                  }
                  <div className="shy-tracking-modal-error-report-footer">
                    {
                      (this.state.showError) &&
                      <div className="shy-tracking-modal-error-report-error-msg">
                        {this.state.errorMessage}
                      </div>
                    }
                    {
                      !this.state.showResultsContent &&
                      <button
                        className="shy-tracking-modal-error-report-ok-button"
                        onClick = {()=>{
                          this.submitErrorReport();
                        }}
                        disabled={!this.canSubmitErrorReport()}>
                        {this.state.okButtonText}
                      </button>
                    }
                  </div>
                </div>
              </div>
            </div>
        )
      } else {
        return <div></div>
      }
  }
}

const addAutocompleteListener = (props) => {
  if (props.map){
    const input = document.getElementById("shy-tracking-modal-error-report-input-full");
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', props.map);
    autocomplete.addListener('place_changed', function() {
      const place = autocomplete.getPlace();
      try {
        // let address = '';
        // if (place.name && !place.formatted_address.startsWith(place.name)) {
        //   address = `${place.name}, ${place.formatted_address}`;
        // } else {
        //   address = `${place.formatted_address}`;
        // }
        props.changeAddress(place.geometry.location.lat(), place.geometry.location.lng(), place.formatted_address);

      } catch (err) {
        console.log(err);
      }
    });
  }
}

// const updateMap = (location, map) => {
//   map.panTo(location);
// }

/**
 *
 */
// const updateMarker = (location) => {
//   // window.importPickupMarker.setPosition(location);
// }

export default TrackingErrorReport;
