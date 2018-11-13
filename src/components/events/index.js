/**
 * @file index.js
 * @description Map index component
 *
 */

import axios from "axios";
import React from "react";
import moment from "moment";
import Lightbox from "react-images";
import Gallery from "react-photo-gallery";

// import { getEventIcon, getEventLabel } from "../../utils.js";
import { EventType, Reason } from "../../constants.js";

import "./index.css";

/**
 *
 */
const Event = props => {
    let dateFormat = "MM/DD/YYYY";
    switch (props.locale) {
        case "es":
        case "pt":
            dateFormat = "DD/MM/YYYY";
            break;
        default:
        break;
    }
    return (
        <div className="shy-tracking-event-element">
            <div className="shy-tracking-events-info-box">
                {props.step === props.totalSteps - 1 ? (
                    <div className="shy-tracking-events-color">
                        <img alt="" className="pulse2" src={props.event.icon} />
                    </div>
                ) : (
                    <div className="shy-tracking-events-box">
                        <div className="shy-tracking-events-color">
                            <img alt="" src={props.event.icon} />
                        </div>
                        <div className="shy-tracking-events-divider" />
                    </div>
                )}
            </div>
            <div className="shy-tracking-events-info-box">
                <div>{props.event.title}</div>
                {props.event.subtitle && (
                    <div className="shy-tracking-events-dimmed-text-nopadding">
                        {props.event.subtitle}
                    </div>
                )}
                <div className="shy-tracking-events-dimmed-text">
                    {moment(props.event.date).format(`${dateFormat} - HH:mm`)}
                </div>
            </div>
        </div>
    );
};

/**
 *
 */
class TrackingShippingProofs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recieverName: "",
            recieverId: "",
            extra: window.translate("default_pof_text"),
            taskId: this.props.taskId
        };
    }
    componentDidMount() {
        const url = new URL('https://api.shippify.co')
        url.pathname = `/tasks/extra/${this.state.taskId}`
        axios
            .get(url)
            .then(
                function(response) {
                    let extraInfo = response.data.data.extras;
                    if (extraInfo === "null") {
                        this.setState({
                            recieverName: window.translate("no_info_available")
                        });
                    } else {
                        let extraInfoObj = JSON.parse(extraInfo);
                        let feedback = extraInfoObj.feedback;
                        if (!feedback) {
                            this.setState({
                                recieverName: window.translate("no_info_available")
                            });
                        } else {
                            let delivery_feedback = feedback.split("|");
                            this.setState({
                                recieverName: delivery_feedback[1],
                                recieverId: delivery_feedback[0]
                            });
                            if (extraInfo[2]) {
                                this.setState({
                                    extra: delivery_feedback[2]
                                });
                            }
                        }
                    }
                }.bind(this)
            )
            .catch(
                function(error) {
                    this.setState({
                        recieverName: "Error"
                    });
                }.bind(this)
            );
    }
    render() {
        return (
            <div className="shy-tracking-event-delivery-proof-ctn">
                <div className="shy-tracking-shipper-intro">
                    {window.translate("Shipping proofs")}
                </div>
                <div className="shy-tracking-event-element">
                    <div className="shy-tracking-events-info-box">
                        <div className="shy-tracking-events-box">
                            <div className="shy-tracking-events-color">
                                <img alt="" src="https://cdn.shippify.co/icons/icon-paste-gray.svg" />
                            </div>
                        </div>
                    </div>
                    <div className="shy-tracking-events-info-box">
                        <div>{this.state.recieverName}</div>
                        <div>{this.state.recieverId}</div>
                        {/* <div className="shy-tracking-events-dimmed-text">
              {this.state.extra}
            </div> */}
                    </div>
                </div>
            </div>
        );
    }
}

/**
 *
 */
class TrackingPhotoGallery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: [],
            taskId: this.props.taskId,
            currentImage: 0,
            isLightboxOpen: false,
            isLoading: false
        };
        this.toggleLightbox = this.toggleLightbox.bind(this);
        this.gotoNext = this.gotoNext.bind(this);
        this.gotoPrevious = this.gotoPrevious.bind(this);
    }
    componentDidMount() {
        const url = new URL('https://api.shippify.co')
        url.pathname = `/photos/directory/task/${this.state.taskId}`

        this.setState({
            isLoading: true
        });
        axios
            .get(url)
            .then(
                function(response) {
                    if (response.data.files) {
                        let photos = [];
                        response.data.files.map(
                            function(elem) {
                                photos.push({
                                    src: `/photos/tasks/${this.state.taskId}/${elem}`,
                                    width: 1,
                                    height: 1
                                });
                            }.bind(this)
                        );
                        this.setState({
                            photos,
                            isLoading: false
                        });
                    } else {
                        this.setState({
                            photos: [],
                            isLoading: false
                        });
                    }
                }.bind(this)
            )
            .catch(
                function(error) {
                    console.log(error);
                    this.setState({
                        photos: [],
                        isLoading: false
                    });
                }.bind(this)
            );
    }
    toggleLightbox(event, obj) {
        this.setState({
            currentImage: obj ? obj.index : 0,
            isLightboxOpen: obj ? true : false
        });
    }
    gotoPrevious() {
        this.setState({
            currentImage: this.state.currentImage - 1
        });
    }
    gotoNext() {
        this.setState({
            currentImage: this.state.currentImage + 1
        });
    }
    render() {
        return (
            <div className="shy-tracking-event-photo-gallery-ctn">
                <div className="shy-tracking-event-element">
                    <div className="shy-tracking-events-info-box">
                        <div className="shy-tracking-events-box">
                            <div className="shy-tracking-events-color">
                                <img alt="" src="https://cdn.shippify.co/icons/icon-camera-gray.svg" />
                            </div>
                        </div>
                    </div>
                    <div
                        className="shy-tracking-events-info-box"
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        <div className="shy-tracking-events-gallery-title">
                            {window.translate("Photos")}
                        </div>
                        {!this.state.isLoading && this.state.photos.length === 0 && (
                            <div className="shy-tracking-events-dimmed-text">
                                {window.translate("photos_text")}
                            </div>
                        )}
                        <div className="shy-tracking-events-gallery-ctn">
                            <Gallery photos={this.state.photos} onClick={this.toggleLightbox} />
                            <Lightbox
                                images={this.state.photos}
                                onClose={this.toggleLightbox}
                                onClickPrev={this.gotoPrevious}
                                onClickNext={this.gotoNext}
                                currentImage={this.state.currentImage}
                                isOpen={this.state.isLightboxOpen}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

/**
 *
 */
class TrackingEvents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: [],
            problemReason: false,
            taskId: this.props.taskId,
            comment: "",
            listNotDelivery: []
        };
    }
    getParamsNotDelivery() {
        const url = new URL('https://api.shippify.co')
        url.pathname = `/track/${this.state.taskId}/events`
        axios
            .get(url, {
                payload: {
                    deliveryId: "t-shieam-16180",
                    delivery_state: "returning",
                    type: "NOT_DELIVERY"
                }
            })
            .then(
                function(response) {
                    this.setState({
                        listNotDelivery: response.data.data
                    });
                }.bind(this)
            )
            .catch(
                function(error) {
                    this.setState({
                        problemReason: "Error"
                    });
                }.bind(this)
            );
    }
    getTransformedEvents(events) {
        let flatEvents = [];
        const transformedEvents = {};
        const uniqueEvents = this.getUniqueEvents(events);
        if (this.state.listNotDelivery.length <= 0) {
            this.getParamsNotDelivery();
        }
        const uniqueProblem = this.getUniqueProblem(events);
        let countAttemp = 0;
        let countnotdeli = 0;
        let attemp = [];
        let notdeli = [];
        for (var i = 0; i < uniqueProblem[0].length; i++) {
            if (uniqueProblem[0][i].type === "DELIVERY_ATTEMPT") {
                attemp.push(uniqueProblem[0][i]);
            }
        }
        for (var j = 0; j < uniqueProblem[0].length; j++) {
            if (uniqueProblem[0][j].type === "NOT_DELIVERY") {
                notdeli.push(uniqueProblem[0][j]);
            }
        }

        for (let key in uniqueEvents) {
            flatEvents = flatEvents.concat(uniqueEvents[key]);
        }
        // let translationPickedUp = window.translate("Picked Up");
        if (flatEvents.length) {
            let selectedDate = new Date();
            if (this.props.isPickedUp(flatEvents[flatEvents.length - 1].deliveryStatus)) {
                flatEvents.map( (events, idx) => {
                    if (this.props.isOnDelivery(events.deliveryStatus)) {
                        selectedDate = events.date;
                    }
                    return events
                });
                transformedEvents["0"] = {
                    title: window.translate("Picked up"),
                    date: selectedDate, // antes no tenia nada, es decir estaba cogiendo fecha actual
                    icon: "https://cdn.shippify.co/icons/icon-draft-green.svg"
                };
            } else {
                if (uniqueEvents.length > 1) {
                    flatEvents.map((events, idx) => {
                        if (this.props.isConfirmedToPickup(events.deliveryStatus)) {
                            selectedDate = events.date;
                        }
                        return events
                    });
                } else {
                    selectedDate = flatEvents[flatEvents.length - 1].date;
                }
                transformedEvents["0"] = {
                    title: window.translate("Scheduled Pickup"),
                    date: selectedDate,
                    icon: "https://cdn.shippify.co/icons/icon-draft-blue.svg"
                };
            }
        } else {
            transformedEvents["0"] = {
                title: window.translate("Scheduled Pickup"),
                date: new Date(),
                icon: "https://cdn.shippify.co/icons/icon-draft-blue.svg"
            };
        }
        uniqueEvents.map((events, idx) => {
            let params = "";
            if (this.state.listNotDelivery[idx]) {
                params = this.state.listNotDelivery[
                    this.state.listNotDelivery.length === 1 ? idx : idx + 1
                ]
                    ? JSON.parse(
                          this.state.listNotDelivery[
                              this.state.listNotDelivery.length === 1 ? idx : idx + 1
                          ].params
                      )["notes"]["reason"]
                    : "";
            }

            const lastEvent = events[events.length - 1] || {};

            if (uniqueEvents[idx + 1]) {
                if (attemp.length > 0) {
                    if (uniqueEvents[idx + 1][0].deliveryStatus === "hold_by_courier") {
                        params = JSON.parse(attemp[countAttemp].params)["notes"]["reason"];
                        countAttemp++;
                    }
                }
                transformedEvents[`${idx + 1}`] = {
                    title:
                        idx > 0
                            ? `${idx + 1}º ${window.translate("attempt")}: ${window.translate(
                                  Reason[params]
                              )}`
                            : window.translate(Reason[params]),
                    date: uniqueEvents[idx + 1] ? uniqueEvents[idx + 1][0].date : lastEvent.date,
                    icon: "https://cdn.shippify.co/icons/icon-draft-red.svg"
                };
            } else {
                if (this.props.isOnDelivery(lastEvent.deliveryStatus)) {
                    transformedEvents[`${idx + 1}`] = {
                        title:
                            idx > 0
                                ? `${idx + 1}º ${window.translate("attempt")}: ${window.translate(
                                      "On delivery"
                                  )}`
                                : window.translate("On delivery"),
                        subtitle: window.translate(
                            "Our Shipper is doing a route of deliveries. Soon you'll be next."
                        ),
                        date: lastEvent.date,
                        icon: "https://cdn.shippify.co/icons/icon-draft-blue.svg"
                    };
                }
                if (this.props.isGoingToDropoff(lastEvent.deliveryStatus)) {
                    transformedEvents[`${idx + 1}`] = {
                        title:
                            idx > 0
                                ? `${idx + 1}º ${window.translate("attempt")}: ${window.translate(
                                      "Going to your address"
                                  )}`
                                : window.translate("Going to your address"),
                        date: lastEvent.date,
                        icon: "https://cdn.shippify.co/icons/icon-draft-blue.svg"
                    };
                }
                if (this.props.isDroppedOff(lastEvent.deliveryStatus)) {
                    transformedEvents[`${idx + 1}`] = {
                        title:
                            idx > 0
                                ? `${idx + 1}º ${window.translate("attempt")}: ${window.translate(
                                      "Waiting for proof of delivery"
                                  )}`
                                : window.translate("Waiting for proof of delivery"),
                        date: lastEvent.date,
                        icon: "https://cdn.shippify.co/icons/icon-draft-blue.svg"
                    };
                }
                if (this.props.isCompleted(lastEvent.deliveryStatus)) {
                    transformedEvents[`${idx + 1}`] = {
                        title:
                            idx > 0
                                ? `${idx + 1}º ${window.translate("attempt")}: ${window.translate(
                                      "Delivered"
                                  )}`
                                : window.translate("Delivered"),
                        date: lastEvent.date,
                        icon: "https://cdn.shippify.co/icons/icon-draft-green.svg"
                    };
                }
                if (this.props.isReturning(lastEvent.deliveryStatus)) {
                    if (notdeli.length > 0) {
                        if (
                            (uniqueEvents[idx + 1]
                                ? uniqueEvents[idx + 1][0].deliveryStatus
                                : lastEvent.deliveryStatus) === "returning"
                        ) {
                            params = JSON.parse(notdeli[countnotdeli].params)
                                ? JSON.parse(notdeli[countnotdeli].params)["notes"]["reason"]
                                : Reason[params];
                            countnotdeli++;
                        }
                    }
                    transformedEvents[`${idx + 1}`] = {
                        title:
                            idx > 0
                                ? `${idx + 1}º ${window.translate("attempt")}: ${window.translate(
                                      Reason[params]
                                  )}`
                                : window.translate(Reason[params]),
                        date: uniqueEvents[idx + 1]
                            ? uniqueEvents[idx + 1][0].date
                            : lastEvent.date,
                        icon: "https://cdn.shippify.co/icons/icon-draft-red.svg"
                    };
                    transformedEvents[`${idx + 2}`] = {
                        title:
                            idx > 0
                                ? `${idx + 1}º ${window.translate("attempt")}: ${window.translate(
                                      "Returning to the warehouse"
                                  )}`
                                : window.translate("Returning to the warehouse"),
                        date: lastEvent.date,
                        icon: "https://cdn.shippify.co/icons/icon-draft-red.svg"
                    };
                }
                if (this.props.isReturned(lastEvent.deliveryStatus)) {
                    transformedEvents[`${idx + 1}`] = {
                        title:
                            idx > 0
                                ? `${idx + 1}º ${window.translate("attempt")}: ${window.translate(
                                      Reason[params]
                                  )}`
                                : window.translate(Reason[params]),
                        date: uniqueEvents[idx + 1]
                            ? uniqueEvents[idx + 1][0].date
                            : lastEvent.date,
                        icon: "https://cdn.shippify.co/icons/icon-draft-red.svg"
                    };
                    transformedEvents[`${idx + 2}`] = {
                        title:
                            idx > 0
                                ? `${idx + 1}º ${window.translate("attempt")}: ${window.translate(
                                      "Returned"
                                  )}`
                                : window.translate("Returned"),
                        date: lastEvent.date,
                        icon: "https://cdn.shippify.co/icons/icon-draft-red.svg"
                    };
                }
                if (this.props.isCanceled(lastEvent.deliveryStatus)) {
                    transformedEvents[`${idx + 1}`] = {
                        title: window.translate("Canceled"),
                        date: lastEvent.date,
                        icon: "https://cdn.shippify.co/icons/icon-draft-red.svg"
                    };
                }
                if (this.props.isHoldByCourier(lastEvent.deliveryStatus)) {
                    transformedEvents[`${idx + 1}`] = {
                        title:
                            idx > 0
                                ? `${idx + 1}º ${window.translate("attempt")}: ${window.translate(
                                      "Hold by courier"
                                  )}`
                                : window.translate("Hold by courier"),
                        date: lastEvent.date,
                        icon: "https://cdn.shippify.co/icons/icon-draft-yellow.svg"
                    };
                }
                if (this.props.isAtDropoff(lastEvent.deliveryStatus)) {
                    transformedEvents[`${idx + 1}`] = {
                        title:
                            idx > 0
                                ? `${idx + 1}º ${window.translate("attempt")}: ${window.translate(
                                      "At dropoff"
                                  )}`
                                : window.translate("At dropoff"),
                        date: lastEvent.date,
                        icon: "https://cdn.shippify.co/icons/icon-draft-blue.svg"
                    };
                }
            }
            return events
        });
        return transformedEvents;
    }
    getUniqueEvents(events) {
        events = this.getEventsByAttempts(events);
        const newEvent = [];

        return events.reduce((attempts, attempt) => {
            attempts.push(
                attempt
                    .reverse()
                    .reduce((evts, event) => {
                        if (!evts.find(e => e.deliveryStatus === event.deliveryStatus)) {
                            evts.push(event);
                        } else {
                            if (
                                event.deliveryStatus === "returning" &&
                                event.type === EventType.notDelivery
                            ) {
                                newEvent.push(event);
                            }
                        }
                        return evts;
                    }, [])
                    .reverse()
            );
            return attempts;
        }, []);
    }
    getUniqueProblem(events) {
        events = this.getEventsProblems(events);
        return events.reduce((attempts, attempt) => {
            attempts.push(
                attempt
                    .reverse()
                    .reduce((evts, event) => {
                        if (
                            !evts.find(
                                e =>
                                    e.deliveryStatus === event.deliveryStatus &&
                                    e.type === EventType.notDelivery
                            )
                        ) {
                            evts.push(event);
                        }
                        return evts;
                    }, [])
                    .reverse()
            );
            return attempts;
        }, []);
    }
    getEventsByAttempts(events) {
        const eventsByAttemps = [];
        for (let i = 0; i < events.length; i++) {
            if (eventsByAttemps.length === 0) {
                eventsByAttemps.push([]);
            }
            if (events[i].type === EventType.deliveryAttempt) {
                eventsByAttemps.push([]);
            } else {
                eventsByAttemps[eventsByAttemps.length - 1].push(events[i]);
            }
        }
        return eventsByAttemps;
    }
    getEventsProblems(events) {
        const eventsByProblems = [];
        for (let i = 0; i < events.length; i++) {
            if (eventsByProblems.length === 0) {
                eventsByProblems.push([]);
            }
            if (
                events[i].type === EventType.deliveryAttempt ||
                events[i].type === EventType.notDelivery
            ) {
                eventsByProblems[eventsByProblems.length - 1].push(events[i]);
            }
        }
        return eventsByProblems;
    }
    render() {
        let events = [];
        let transformedEvents = this.getTransformedEvents(this.props.events);
        Object.keys(transformedEvents).forEach(function(key, idx) {
            events.push(
                <Event
                    key={idx}
                    step={idx}
                    totalSteps={Object.keys(transformedEvents).length}
                    event={transformedEvents[key]}
                />
            );
        });
        return (
            <div id="shy-tracking-events">
                <div className="shy-tracking-shipper-intro"> {window.translate("Timeline")} </div>
                <div className="shy-tracking-events-list">{events}</div>
                {this.props.isAuth && (
                    <div className="full-width">
                        <TrackingShippingProofs taskId={this.props.taskId} />
                        <TrackingPhotoGallery
              taskId={this.props.taskId}/>
                    </div>
                )}
            </div>
        );
    }
}

export default TrackingEvents;
