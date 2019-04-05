/**
 * @file index.js
 * @description Tracking page index file
 *
 */

import React from "react";
import io from "socket.io-client";

import "./prototypes.js";
import { DeliveryStatus } from "./constants";
import TrackingMap from "./components/map";
import TrackingEvents from "./components/events";
import TrackingShipper from "./components/shipper";
import TrackingPackages from "./components/packages";
import TrackingErrorReport from "./components/errorReport";
import { getRoute } from './routing';
import "./index.css";

window.translate = function(string) {
    return string;
};

const google = window.google;
let socket;


const CMD_SHIPPER_STATUS_UPDATE = "UpdateLocation";
const CMD_DELIVERY_STATUS_UPDATE = "update_status_task";
const CHANNEL_PREFIX_SHIPPER_ID = "shipper_location_";
const CHANNEL_PREFIX_DELIVERY_ID = "task_";

/**
 *
 */
function listenChannelsIn(elemArr, prefixEntityChannel, channelType) {
    let channelsArr = elemArr.map(elem => {
        return `${prefixEntityChannel}${elem}`;
    });
    socket.emit(`swap_${channelType}_channel`, channelsArr.join(","));
}

/*
Delivery status update payload
{
  "id": "t-shieam-15844",
  "city": 2,
  "company": 2,
  "state": 3,
  "status": "assigned",
  "date": "Thu Aug 03 2017 17:38:22 GMT+0000 (UTC)",
  "route": "t-shieam-15844",
  "lang": "en",
  "timestamp": 1501781902.7
}
*/

/*
Shipper location update
{
  lng: -79.8920683145402,
  lat: -2.16994968343833
}
*/

/**
 *
 */
class Tracking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map: {
                center: this.props.data.shipper
                    ? new google.maps.LatLng(
                          this.props.data.shipper.location.lat,
                          this.props.data.shipper.location.lng
                      )
                    : new google.maps.LatLng(
                          this.props.data.delivery.dropoff.location.lat,
                          this.props.data.delivery.dropoff.location.lng
                      )
            },
            user: this.props.user,
            isModalOpen: false,
            token: this.props.token === "undefined" ? undefined : this.props.token,
            isAuth: this.props.isAuth,
            isMonitor: this.props.isMonitor,
            delivery: this.props.data.delivery,
            shipper: this.props.data.shipper
                ? {
                      information: this.props.data.shipper.info,
                      location: new google.maps.LatLng(
                          this.props.data.shipper.location.lat,
                          this.props.data.shipper.location.lng
                      ),
                      isAnimating: false,
                      lastVertex: 1
                  }
                : undefined,
            company: this.props.data.company,
            locale: this.props.data.locale,
            deliveryPolyline: undefined,
            preferences: this.props.data.preferences && JSON.parse(this.props.data.preferences),
            mapBounds: new google.maps.LatLngBounds().extend(
                new google.maps.LatLng(
                    this.props.data.delivery.dropoff.location.lat,
                    this.props.data.delivery.dropoff.location.lng
                )
            )
        };
        this.animate = this.animate.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.listenEvents = this.listenEvents.bind(this);
        this.animateShipper = this.animateShipper.bind(this);
        this.updateMapCenter = this.updateMapCenter.bind(this);
        this.updateDeliveryInfo = this.updateDeliveryInfo.bind(this);
        this.shipperStatusUpdate = this.shipperStatusUpdate.bind(this);
        this.deliveryStatusUpdate = this.deliveryStatusUpdate.bind(this);
    }
    componentDidMount() {
        this.listenEvents(
            this.state.delivery.id,
            this.state.shipper && this.state.shipper.information.shipperId
        );
        if (
            (this.isGoingToDropoff(this.state.delivery.status) ||
                this.isAtDropoff(this.state.delivery.status) ||
                this.isDroppedOff(this.state.delivery.status)) &&
            this.state.shipper
        ) {
            this.shipperStatusUpdate({
                lat: this.state.shipper.location.lat(),
                lng: this.state.shipper.location.lng()
            });
        }
    }
    isPickedUp(status) {
        return (
            [
                DeliveryStatus.onDelivery,
                DeliveryStatus.goingToDropoff,
                DeliveryStatus.atDropoff,
                DeliveryStatus.droppedOff,
                DeliveryStatus.completed,
                DeliveryStatus.returning,
                DeliveryStatus.returned,
                DeliveryStatus.holdByCourier
            ].indexOf(status) >= 0
        );
    }
    isPendingToReview(status) {
        return status === DeliveryStatus.pendingToReview;
    }
    isScheduled(status) {
        return status === DeliveryStatus.scheduled;
    }
    isProcessing(status) {
        return status === DeliveryStatus.processing;
    }
    isBroadcasting(status) {
        return status === DeliveryStatus.broadcasting;
    }
    isAssigned(status) {
        return status === DeliveryStatus.assigned;
    }
    isConfirmedToPickup(status) {
        return status === DeliveryStatus.confirmedToPickup;
    }
    isAtPickup(status) {
        return status === DeliveryStatus.atPickup;
    }
    isOnDelivery(status) {
        return status === DeliveryStatus.onDelivery;
    }
    isGoingToDropoff(status) {
        return status === DeliveryStatus.goingToDropoff;
    }
    isAtDropoff(status) {
        return status === DeliveryStatus.atDropoff;
    }
    isDroppedOff(status) {
        return status === DeliveryStatus.droppedOff;
    }
    isCompleted(status) {
        return status === DeliveryStatus.completed;
    }
    isReturning(status) {
        return status === DeliveryStatus.returning;
    }
    isReturned(status) {
        return status === DeliveryStatus.returned;
    }
    isHoldByCourier(status) {
        return status === DeliveryStatus.holdByCourier;
    }
    isCanceled(status) {
        return status === DeliveryStatus.canceled;
    }
    listenEvents(deliveryId, shipperId) {
        const self = this;
        // socket = io("wss://live.shippify.co");
        socket = io("http://staging.shippify.co:3001");
        socket.on("connect", function() {
            listenChannelsIn([deliveryId], CHANNEL_PREFIX_DELIVERY_ID, "delivery");
            if (shipperId) {
                listenChannelsIn([shipperId], CHANNEL_PREFIX_SHIPPER_ID, "courier");
            }
        });
        socket.on(CMD_SHIPPER_STATUS_UPDATE, data => {
            self.shipperStatusUpdate(data);
        });
        socket.on(CMD_DELIVERY_STATUS_UPDATE, data => {
            if (self.isAssigned(data._status) && !self.state.shipper) {
                window.location.reload();
            }
            self.deliveryStatusUpdate(data);
        });
        window.socket = socket;
    }
    deliveryStatusUpdate(data) {
        const events = (this.state.delivery && this.state.delivery.events) || [];
        events.push({
            deliveryStatus: data._status,
            date: data.date
        });
        this.setState(
            prevState => ({
                ...prevState,
                delivery: {
                    ...prevState.delivery,
                    status: data._status,
                    events
                }
            }),
            () => {
                if (
                    this.isGoingToDropoff(this.state.delivery.status) ||
                    this.isAtDropoff(this.state.delivery.status) ||
                    this.isDroppedOff(this.state.delivery.status)
                ) {
                    this.shipperStatusUpdate({
                        lat: this.state.shipper.location.lat(),
                        lng: this.state.shipper.location.lng()
                    });
                }
            }
        );
    }
    shipperStatusUpdate(data) {
        const self = this;
        if (((new Date().getTime() - this.state.lastShipperUpdateTime)/1000) > 10) {
          this.setState({
            lastShipperUpdateTime: new Date().getTime()
          }, () => {
            const shipper = this.state.shipper || {};
            if (typeof(data.location) == "string"){
              let parsedData = JSON.parse(data.location);
              data.location = parsedData;
              data.lat = parseFloat(data.location.lat);
              data.lng = parseFloat(data.location.lng);
            }
            const dropoffLocation = new google.maps.LatLng(
              this.state.delivery.dropoff.location.lat,
              this.state.delivery.dropoff.location.lng
            )
    
            shipper.location = shipper.location || new google.maps.LatLng(
              data.lat,
              data.lng
            );
    
            let bounds = new google.maps.LatLngBounds();
            bounds.extend(dropoffLocation);
            if (shipper.location){
              bounds.extend(shipper.location);
            }
            self.setState({
              mapBounds: bounds
            })
    
            if (!shipper.isAnimating){
              shipper.firstPolyline = new google.maps.Polyline({
                path: []
              })
              shipper.secondPolyline = new google.maps.Polyline({
                path: []
              });
            }
    
            if (shipper.isAnimating){
              shipper.isAnimating = false;
              shipper.firstPolyline = new google.maps.Polyline({
                path: []
              })
              shipper.secondPolyline = new google.maps.Polyline({
                path: []
              });
            }
    
            getRoute([
              {
                latitude: shipper.location.lat(),
                longitude: shipper.location.lng()
              }, {
                latitude: this.props.data.delivery.dropoff.location.lat,
                longitude: this.props.data.delivery.dropoff.location.lng
              }
            ], { lat: data.lat, lng: data.lng }).then(route => {
              if (!shipper.isAnimating) {
                shipper.isAnimating = true;
                shipper.startLocation = route.legs[0].start_location
                shipper.endLocation = route.legs[0].end_location
                if (route.isUsingGraphhopper) {
                  for (var i=0; i<route.steps.length; i++) {
                    const interval = route.steps[i];
                    for (var j=0; j<interval.length; j++) {
                      shipper.firstPolyline.getPath().push(
                        new google.maps.LatLng(
                          route.points[interval[j]].latitude,
                          route.points[interval[j]].longitude
                        )
                      )
                    }
                  }
                } else {
                  const steps = route.googleSteps;
                  for (let j=0; j<steps.length; j++) {
                    const nextSegment = steps[j].path;
                    for (var k=0; k<nextSegment.length; k++) {
                      shipper.firstPolyline.getPath().push(nextSegment[k]);
                    }
                  }
                }
                self.setState(
                  {
                    shipper,
                    deliveryPolyline: new google.maps.Polyline({
                      path: route.points.map((p) => ({
                        lat: p.latitude,
                        lng: p.longitude
                      }))
                    })
                  }, () => {
                    self.animateShipper()
                  }
                )
              } else {
                const heading = google.maps.geometry.spherical.computeHeading(
                  shipper.location,
                  dropoffLocation
                );
                shipper.rotation = heading;
                self.setState({ shipper })
              }
            })
          })
        }
      }
      animate(d) {
        const shipper = this.state.shipper;
        if (!shipper.isAnimating) {
          shipper.isAnimating = false;
          return;
        }
        if (d > shipper.eol) {
          shipper.location = shipper.endLocation;
          shipper.isAnimating = false;
          this.setState({ shipper })
          return;
        }
        const p = shipper.firstPolyline.GetPointAtDistance(d);
        const lastPosition = shipper.location;
        shipper.location = p;
        shipper.rotation = google.maps.geometry.spherical.computeHeading(lastPosition, p);
        //shipper.timerHandle = setTimeout(this.animate(d+5), 80);
        if (shipper.secondPolyline.getPath().getLength() > 20) {
          shipper.secondPolyline = new google.maps.Polyline(
            [shipper.firstPolyline.getPath().getAt(shipper.lastVertex - 1)]
          );
        }
        if (shipper.firstPolyline.GetIndexAtDistance(d) < shipper.lastVertex + 2) {
          if (shipper.secondPolyline.getPath().getLength() > 1) {
            shipper.secondPolyline.getPath().removeAt(shipper.secondPolyline.getPath().getLength() - 1);
          }
          shipper.secondPolyline.getPath().insertAt(
            shipper.secondPolyline.getPath().getLength(),
            shipper.firstPolyline.GetPointAtDistance(d)
          );
        } else {
          shipper.secondPolyline.getPath().insertAt(
            shipper.secondPolyline.getPath().getLength(),
            shipper.endLocation
          );
        }
        setTimeout(() => {
          this.setState({ shipper }, () => {
            this.animate(d+5)
          })
        }, 80);
      }
      animateShipper() {
        const shipper = this.state.shipper;
        shipper.eol = shipper.firstPolyline.Distance();
        shipper.location = shipper.firstPolyline.getPath().getAt(0);
        shipper.secondPolyline = new google.maps.Polyline({
          path: [shipper.firstPolyline.getPath().getAt(0)]
        });
        this.setState({ shipper }, () => this.animate(5));
      }
      openModal() {
        this.setState({ isModalOpen: true });
      }
      closeModal() {
        this.setState({ isModalOpen: false });
      }
      updateDeliveryInfo(data) {
        let previousState = JSON.parse(JSON.stringify(this.state.delivery));
        previousState.recipient = {
          email: data.mail,
          name: data.recipient,
          phonenumber: data.phoneNumber
        }
        previousState.dropoff.location = {
          address: data.long_address,
          lat: data.lat,
          lng: data.lng,
          instructions: data.apt_address
        }
        this.setState({
          delivery: previousState
        })
      }
      updateMapCenter(lat, lng) {
        this.setState({
          map: {
            lat, lng
          }
        })
      }
    render() {
        const { sections } = this.props;

        return (
            <div className="shy-tracking-page">
                {this.state.preferences && (
                    <div
                        id="shy-tracking-page-header"
                        style={{
                            backgroundColor: `#${this.state.preferences.color}`
                        }}
                    />
                )}
                {!this.state.preferences && (
                    <div
                        id="shy-tracking-page-header-no-pref"
                        style={{
                            backgroundColor: "#ef404b"
                        }}
                    />
                )}
                <div className="shy-tracking-page-body">
                    {this.state.isModalOpen && (
                        <div className="shy-tracking-modal-error-report">
                            <TrackingErrorReport
                                taskId={this.state.delivery.id}
                                isOpen={this.state.isModalOpen}
                                closeModal={this.closeModal}
                                recieverInfo={this.state.delivery.recipient}
                                dropoffInfo={this.state.delivery.dropoff.location}
                                updateInfo={this.updateDeliveryInfo}
                                lat={this.state.delivery.dropoff.location.lat}
                                lng={this.state.delivery.dropoff.location.lng}
                            />
                        </div>
                    )}
                    {sections.map && this.state.delivery && (
                        <div className="shy-tracking-section-map">
                            <TrackingMap
                                map={this.state.map}
                                stars={this.state.delivery.rating}
                                token={this.state.token}
                                deliveryPolyline={this.state.deliveryPolyline}
                                updateMapCenter={this.updateMapCenter}
                                taskId={this.state.delivery.id}
                                recieverInfo={this.state.delivery.recipient}
                                dropoffInfo={this.state.delivery.dropoff}
                                openModal={this.openModal}
                                status={this.state.delivery.status}
                                isAssigned={this.isAssigned}
                                isBroadcasting={this.isBroadcasting}
                                isPickedUp={this.isPickedUp}
                                isScheduled={this.isScheduled}
                                isProcessing={this.isProcessing}
                                isCanceled={this.isCanceled}
                                isOnDelivery={this.isOnDelivery}
                                isGoingToDropoff={this.isGoingToDropoff}
                                isAtDropoff={this.isAtDropoff}
                                isDroppedOff={this.isDroppedOff}
                                isCompleted={this.isCompleted}
                                isReturning={this.isReturning}
                                isReturned={this.isReturned}
                                isHoldByCourier={this.isHoldByCourier}
                                isConfirmedToPickup={this.isConfirmedToPickup}
                                isPendingToReview={this.isPendingToReview}
                                isAtPickup={this.isAtPickup}
                                shipper={this.state.shipper}
                                isAuth={this.props.isAuth}
                                logo={this.state.preferences && this.state.preferences.logo}
                                mapBounds={this.state.mapBounds}
                            />
                        </div>
                    )}
                    <div className="shy-tracking-section">
                        {sections.events && (
                            <div className="shy-tracking-section-half">
                                <TrackingEvents
                                    taskId={this.state.delivery.id}
                                    status={this.state.delivery.status}
                                    locale={this.state.locale}
                                    isPickedUp={this.isPickedUp}
                                    isCanceled={this.isCanceled}
                                    isOnDelivery={this.isOnDelivery}
                                    isGoingToDropoff={this.isGoingToDropoff}
                                    isAtDropoff={this.isAtDropoff}
                                    isDroppedOff={this.isDroppedOff}
                                    isCompleted={this.isCompleted}
                                    isReturning={this.isReturning}
                                    isReturned={this.isReturned}
                                    isConfirmedToPickup={this.isConfirmedToPickup}
                                    isHoldByCourier={this.isHoldByCourier}
                                    events={this.state.delivery.events || []}
                                    isAuth={this.props.isAuth}
                                    pickupDate={this.state.delivery.pickup.date}
                                />
                            </div>
                        )}
                        {(sections.shipper || sections.packages) && (
                            <div className="shy-tracking-section-col">
                                {sections.shipper && (
                                    <div className="shy-tracking-section-half">
                                        <TrackingShipper
                                            shipper={this.state.shipper}
                                            deliveryId={this.state.delivery.id}
                                            recipient={this.state.delivery.recipient}
                                            recieverInfo={this.state.delivery.recipient}
                                            dropoffInfo={this.state.delivery.dropoff}
                                            openModal={this.openModal}
                                            status={this.state.delivery.status}
                                            isAssigned={this.isAssigned}
                                            isBroadcasting={this.isBroadcasting}
                                            isPickedUp={this.isPickedUp}
                                            isScheduled={this.isScheduled}
                                            isAtPickup={this.isAtPickup}
                                            isProcessing={this.isProcessing}
                                            isCanceled={this.isCanceled}
                                            isOnDelivery={this.isOnDelivery}
                                            isGoingToDropoff={this.isGoingToDropoff}
                                            isAtDropoff={this.isAtDropoff}
                                            isDroppedOff={this.isDroppedOff}
                                            isCompleted={this.isCompleted}
                                            isReturning={this.isReturning}
                                            isReturned={this.isReturned}
                                            isHoldByCourier={this.isHoldByCourier}
                                            isConfirmedToPickup={this.isConfirmedToPickup}
                                            isPendingToReview={this.isPendingToReview}
                                            token={this.state.token}
                                            user={this.state.user}
                                            isMonitor={this.state.isMonitor}
                                            isAuth={this.props.isAuth}
                                        />
                                    </div>
                                )}
                                {sections.packages && (
                                    <div className="shy-tracking-section-half">
                                        <TrackingPackages
                                            packages={
                                                (this.state.delivery &&
                                                    this.state.delivery.products) ||
                                                []
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="shy-tracking-page-footer">
                    <span> Deliveries with &nbsp;</span>{" "}
                    <img alt="" src="https://cdn.shippify.co/icons/icon-heart-red.svg" />{" "}
                    <span>&nbsp; by Shippify </span>
                </div>
            </div>
        );
    }
}

export default Tracking;
