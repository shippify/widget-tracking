/**
 * @file index.js
 * @description Map index component
 *
 */

import React from 'react';

import {
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import axios from 'axios';
import { fromJS } from 'immutable';
import {
  mapStyle,
  REQUIRED_FIELD_ERR
} from './../../constants';
import Loading from './../shared/loading';
import Error from './../shared/error';
import Successful from './../shared/successful';

import './index.css';
import './../../form.css';
import './../../dialog.css';

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


/**
 *
 */
class GoogleMapErrorComponent extends React.Component {
  render() {
    return (
      <GoogleMap
        defaultZoom={17}
        center={{
          lat: this.props.lat,
          lng: this.props.lng
        }}
        ref={(map) => {
          addAutocompleteListener({
            map,
            changeAddress: this.props.changeAddress
          })
        }}
        options={mapOptions}>
        <Marker
          position={{
            lat: this.props.lat,
            lng: this.props.lng
          }}
          draggable={true}
          onDragEnd={(e)=> {
            this.props.onMarkerPositionChanged(e)
          }}
          defaultIcon="https://cdn.shippify.co/images/img-pin.svg"/>
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
    super(props);
    this.state = {
      data: fromJS({
        contact: {
          name: decodeURI(this.props.recieverInfo.name),
          email: decodeURI(this.props.recieverInfo.email),
          phonenumber: decodeURI(this.props.recieverInfo.phonenumber)
        },
        location: {
          address: decodeURI(this.props.dropoffInfo.address),
          instructions: decodeURI(this.props.dropoffInfo.instructions || ""),
          latitude: this.props.lat,
          longitude: this.props.lng
        }
      }),
      validations: fromJS({
        location: {
          address: ""
        },
        contact: {
          name: "",
          email: "",
          phonenumber: ""
        }
      }),
      loading: false,
      succeed: false,
      failed: false
    }
  }
  componentDidUpdate() {
    if (!this.state.loading && this.state.failed) {
      setTimeout(() => this.setState({
        loading: false,
        succeed: false,
        failed: false
      }), 2000);
    }
  }
  componentDidMount(){
    document.body.style.overflowY = "hidden";
  }
  componentWillUnmount(){
    document.body.style.overflowY = "auto";
  }
  changeContactName = (e) => {
    this.setState({
      data: this.state.data.setIn(['contact', 'name'], e)
    })
  }
  changeContactEmail = (e) => {
    this.setState({
      data: this.state.data.setIn(['contact', 'email'], e)
    })
  }
  changeContactPhonenumber = (e) => {
    this.setState({
      data: this.state.data.setIn(['contact', 'phonenumber'], e)
    })
  }
  changeLocationAddress = (e) => {
    this.setState({
      data: this.state.data.setIn(['location', 'address'], e)
    })
  }
  changeLocationInstructions = (e) => {
    this.setState({
      data: this.state.data.setIn(['location', 'instructions'], e)
    })
  }
  onMarkerPositionChanged = (e) => {
    const self = this;
    this.setState({
      data: self.state.data.setIn(['location', 'latitude'], e.latLng.lat())
                          .setIn(['location', 'longitude'], e.latLng.lng())
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
            data: self.state.data.setIn(['location', 'address'], address)
          });
        }
      }.bind(this)
    );
  }
  validateContactName = () => {
    const self = this;
    return new Promise((resolve, reject) => {
      if (self.state.data.getIn(['contact', 'name'], '').length === 0) {
        self.setState({
          validations: self.state.validations.setIn(
            ['contact', 'name'],
            REQUIRED_FIELD_ERR
          )
        }, () => reject(false))
        return
      }
      self.setState({
        validations: self.state.validations.setIn(['contact', 'name'], "")
      }, () => resolve(true))
    })
  }
  validateContactEmail = () => {
    const self = this;
    return new Promise((resolve, reject) => {
      if (self.state.data.getIn(['contact', 'email'], '').length === 0) {
        if (
          self.state.data.getIn(
            ['contact', 'phonenumber'], ''
          ).length !== 0
        ) {
          self.setState({
            validations: self.state.validations.setIn(['contact', 'email'], "")
          }, () => resolve(true))
        } else {
          self.setState({
            validations: self.state.validations.setIn(
              ['contact', 'email'],
              REQUIRED_FIELD_ERR
            )
          }, () => reject(false))
        }
        return
      }
      self.setState({
        validations: self.state.validations.setIn(['contact', 'email'], "")
      }, () => resolve(true))
    })
  }
  validateContactPhonenumber = () => {
    const self = this;
    return new Promise((resolve, reject) => {
      if (self.state.data.getIn(['contact', 'phonenumber'], '').length === 0) {
        if (
          self.state.data.getIn(
            ['contact', 'email'], ''
          ).length !== 0
        ) {
          self.setState({
            validations: self.state.validations.setIn(
              ['contact', 'phonenumber'], ""
            )
          }, () => resolve(true))
        } else {
          self.setState({
            validations: self.state.validations.setIn(
              ['contact', 'phonenumber'],
              REQUIRED_FIELD_ERR
            )
          }, () => reject(false))
        }
        return
      }
      self.setState({
        validations: self.state.validations.setIn(
          ['contact', 'phonenumber'], ""
        )
      }, () => resolve(true))
    })
  }
  validateLocationAddress = () => {
    const self = this;
    return new Promise((resolve, reject) => {
      if (self.state.data.getIn(['location', 'address'], '').length === 0) {
        self.setState({
          validations: self.state.validations.setIn(
            ['location', 'address'],
            REQUIRED_FIELD_ERR
          )
        }, () => reject(false))
        return
      }
      self.setState({
        validations: self.state.validations.setIn(['location', 'address'], "")
      }, () => resolve(true))
    })
  }
  changeAddress = (address, lat, lng) => {
    this.setState({
      data: this.state.data.setIn(['location', 'address'], address)
                           .setIn(['location', 'latitude'], lat)
                           .setIn(['location', 'longitude'], lng)
    })
  }
  save = () => {
   
    const self = this;
    Promise
    .all([
      this.validateContactName(),
      this.validateContactEmail(),
      this.validateContactPhonenumber(),
      this.validateLocationAddress()
    ])
    .then(value => {
      self.setState({
        loading: true,
        succeed: false,
        failed: false
      }, () => {
        axios.post(
          // 'https://api.shippify.co/track/fix/address',
          'http://localhost:8021/track/fix/address',
          {
            id: self.props.taskId,
            token: self.props.token,
            contact: {
              name: self.state.data.getIn(['contact', 'name'], ''),
              email: self.state.data.getIn(['contact', 'email'], ''),
              phonenumber: self.state.data.getIn(['contact', 'phonenumber'])
            },
            location: {
              address: self.state.data.getIn(['location', 'address']),
              lat: self.state.data.getIn(['location', 'latitude']),
              lng: self.state.data.getIn(['location', 'longitude']),
              instructions: self.state.data.getIn(['location', 'instructions'])
            }
          } 
        )
        .then(function (response) {
          self.setState({
            message: window.translate('The information changes already was reported'),
            loading: false,
            succeed: true
          })
        })
        .catch(function (error) {
          if (error.status === 400) {
            self.setState({
              message: window.translate("This information is already saved"),
              loading: false,
              succeed: true
            })
          } else {
            self.setState({
              message: window.translate("Something went wrong, please try again"),
              loading: false,
              failed: true
            });
          }
        });
      })
    })
    .catch(error => {
      console.log('ERROR!!!', error);
    })
  }
  render() {
    return (
      <div className="shy-dialog" onClick={() => this.props.closeModal()}>
        <div className="shy-dialog-content-wrapper">
          <div
            className="shy-dialog-content"
            onClick={(e) => e.stopPropagation()}>
            <div className="shy-dialog-header">
              <div className="shy-dialog-header-content">
                <img
                  className="icon-error"
                  src="https://cdn.shippify.co/icons/icon-warning-white.svg"
                  alt=""/>
                { window.translate("Report problem") }
              </div>
              <img
                className="shy-dialog-close"
                src="https://cdn.shippify.co/icons/icon-close-gray.svg"
                alt=""
                onClick={() => this.props.closeModal()}/>
            </div>
            <div className="shy-dialog-body shy-report-error-dialog">
              {
                this.state.loading &&
                <Loading
                  mini
                  message={window.translate('Processing')}/>
              }
              {
                !this.state.loading &&
                this.state.succeed &&
                <Successful text={this.state.message}/>
              }
              {
                !this.state.loading &&
                 this.state.failed &&
                 <Error text={this.state.message}/>
              }
              {
                !this.state.loading &&
                !this.state.succeed &&
                !this.state.failed &&
                <div>
                  <div className="shy-dialog-body-text-detail">
                    { window.translate("Check if the recipient information displayed is correct. If there is a problem, please report it and add the right information") }
                  </div>
                  <div className="shy-report-error-fields margin-top-m">
                    <div className="shy-report-error-field">
                      <div className="shy-form-field-label">
                        { window.translate("Recipient") }
                      </div>
                      <div className="shy-form-field">
                        <input
                          type="text"
                          placeholder={window.translate("Email")}
                          className={
                            this.state.validations.getIn(['contact', 'email']) ?
                            "shy-form-field-input has-error" :
                            "shy-form-field-input"
                          }
                          value={this.state.data.getIn(['contact', 'email'], "")}
                          onChange={(e) => this.changeContactEmail(e.target.value)}
                          onBlur={() => {
                            this.validateContactEmail().catch(err => {})
                          }}/>
                      </div>
                      {
                        (this.state.validations.getIn(['contact', 'email'], '').length > 0) &&
                        <div className="shy-form-error">
                          {
                            window.translate(this.state.validations.getIn(['contact', 'email']))
                          }
                        </div>
                      }
                    </div>
                    <div className="shy-report-error-field">
                      <div className="shy-form-field">
                        <input
                          type="text"
                          placeholder={window.translate("Phone")}
                          className={
                            this.state.validations.getIn(['contact', 'phonenumber']) ?
                            "shy-form-field-input has-error" :
                            "shy-form-field-input"
                          }
                          value={this.state.data.getIn(['contact', 'phonenumber'], "")}
                          onChange={(e) => this.changeContactPhonenumber(e.target.value)}
                          onBlur={() => {
                            this.validateContactPhonenumber().catch(err => {})
                          }}/>
                      </div>
                      {
                        (this.state.validations.getIn(['contact', 'phonenumber'], '').length > 0) &&
                        <div className="shy-form-error">
                          {
                            window.translate(this.state.validations.getIn(['contact', 'phonenumber']))
                          }
                        </div>
                      }
                    </div>
                  </div>
                  <div className="margin-top-m">
                    <div className="shy-form-field">
                      <input
                        type="text"
                        placeholder={window.translate("Name")}
                        className={
                          this.state.validations.getIn(['contact', 'name']) ?
                          "shy-form-field-input has-error" :
                          "shy-form-field-input"
                        }
                        value={this.state.data.getIn(['contact', 'name'], "")}
                        onChange={(e) => this.changeContactName(e.target.value)}
                        onBlur={() => {
                          this.validateContactName().catch(err => {})
                        }}/>
                    </div>
                    {
                      (this.state.validations.getIn(['contact', 'name'], '').length > 0) &&
                      <div className="shy-form-error">
                        {
                          window.translate(this.state.validations.getIn(['contact', 'name']))
                        }
                      </div>
                    }
                  </div>
                  <div className="margin-top-m">
                    <div className="shy-form-field-label">
                      { window.translate("Address") }
                    </div>
                    <div className="shy-form-field">
                      <MyMapComponent
                        isMarkerShown
                        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3&libraries=drawing,places,geometry&key=AIzaSyBGhvLIKDkKTKmSUyE6EmdQwWu4uz3Fbqc"
                        loadingElement={<div style={{ height: `100%` }}/>}
                        containerElement={<div style={{ width: `100%` }}/>}
                        mapElement={<div id="shy-tracking-modal-error-report-map-ctn" />}
                        options={mapOptions}
                        lat={this.state.data.getIn(['location', 'latitude'])}
                        lng={this.state.data.getIn(['location', 'longitude'])}
                        onMarkerPositionChanged={this.onMarkerPositionChanged}
                        changeAddress={this.changeAddress}/>
                    </div>
                  </div>
                  <div className="margin-top-m">
                    <div className="shy-form-field">
                      <input
                        type="text"
                        id="shy-autocomplete-address"
                        className={
                          this.state.validations.getIn(['location', 'address']) ?
                          "shy-form-field-input has-error" :
                          "shy-form-field-input"
                        }
                        value={this.state.data.getIn(['location', 'address'])}
                        placeholder={window.translate("Address")}
                        onChange={(e) => this.changeLocationAddress(e.target.value)}
                        onBlur={() => {
                          this.validateLocationAddress().catch(err => {})
                        }}/>
                    </div>
                    {
                      this.state.validations.getIn(['location', 'address']) &&
                      <div className="shy-form-error">
                        {
                          window.translate(this.state.validations.getIn(['location', 'address']))
                        }
                      </div>
                    }
                  </div>
                  <div className="margin-top-m">
                    <div className="shy-form-field">
                      <input
                        type="text"
                        className="shy-form-field-input"
                        onChange={(e) => this.changeLocationInstructions(e.target.value)}
                        placeholder={window.translate("Instructions")}
                        value={this.state.data.getIn(['location', 'instructions'], "")}/>
                    </div>
                  </div>
                  <div className="shy-dialog-body-buttons">
                    <button
                      className="shy-btn shy-btn-primary"
                      onClick={() => this.save()}>
                      { window.translate('OK') }
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const addAutocompleteListener = (props) => {
  if(props.map) {
    const input = document.getElementById("shy-autocomplete-address");
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', props.map);
    autocomplete.addListener('place_changed', function() {
      const place = autocomplete.getPlace();
      try {
        let address = '';
        if (place.name && !place.formatted_address.startsWith(place.name)) {
          address = `${place.name}, ${place.formatted_address}`;
        } else {
          address = `${place.formatted_address}`;
        }
        props.changeAddress(
          place.formatted_address,
          place.geometry.location.lat(),
          place.geometry.location.lng()
        );
        console.log(address);
        
      } catch (err) {
        console.log(err);
      }
    });
  }
}


export default TrackingErrorReport;