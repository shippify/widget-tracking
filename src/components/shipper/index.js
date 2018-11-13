/**
 * @file index.js
 * @description Map index component
 *
 */

import React from 'react';

import './index.css';

/**
 *
 */
class TrackingShipper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      animate: false,
      showChat: false,
      showChatButton: false,
      chatButtonMessage: undefined,
      chatButtonState: undefined
    }
    this.showShipperChat = this.showShipperChat.bind(this);
    this.closeShipperChat = this.closeShipperChat.bind(this);
  }
  componentDidMount() {
    setTimeout(() => this.setState({ animate: true }), 5000);
    setTimeout(() => this.setState({ animate: false }), 15000);
  }
  showShipperChat(){
    this.setState({
      showChat: true
    });
    let recipientChatId = this.props.recipient.chatId;
    if (this.props.user){
      if (this.props.user.environment==="development" ||
          this.props.user.environment==="staging" ||
          this.props.user.environment==="testing"){
        recipientChatId = 'j5a2xb9w9najcofvs49zefwcdieezh0k9';
      }
    }
    let deliveryObj = {
      recipient : {
        name: this.props.recipient.name,
        email: this.props.recipient.email,
        chatId: recipientChatId
      },
      isMonitor: this.props.isMonitor,
      deliveryId: this.props.deliveryId,
      shipper: {
        name: this.props.shipper.information.shipperName,
        chatId: this.props.shipper.information.chatId,
        id: this.props.shipper.information.shipperId
      }
    }
    window.openChatWindow(deliveryObj);
  }
  closeShipperChat(){
    this.setState({
      showChat: false
    });
  }
  render() {
    let showChatButton = false;
    let chatButtonMessage = "";
    let chatButtonState = false;
    if (this.props.isMonitor) {
      showChatButton = true;
      chatButtonState = true;
      chatButtonMessage= window.translate("You can chat with your shipper now")
    }
    else if ((this.props.token) &&
      (
        this.props.isGoingToDropoff(this.props.status) ||
        this.props.isAtDropoff(this.props.status) || 
        this.props.isAtPickup(this.props.status) || 
        this.props.isOnDelivery(this.props.status) ||
        this.props.isDroppedOff(this.props.status))){
        showChatButton = true;
        chatButtonState = true;
        chatButtonMessage = window.translate("You can chat with your shipper now")
    }
    else if ((this.props.token) && (this.props.isProcessing(this.props.status) || this.props.isBroadcasting(this.props.status) ||
      this.props.isAssigned(this.props.status) )){
        showChatButton = true;
        chatButtonState = false;
        chatButtonMessage= window.translate("You can chat with your shipper later")
    }
    return (
      <div id="shy-tracking-shipper">
        <div className="shy-tracking-shipper-intro">
          {window.translate("Meet your Shipper")}
        </div>
        {
          this.props.shipper &&
          <div className="shy-tracking-shipper-info">

            <div className="shy-tracking-shipper-responsive-info">
              <div className="shy-tracking-shipper-responsive-text">
                <div className="shy-tracking-shipper-responsive-shipper-name">
                  {decodeURI(this.props.shipper.information.shipperName)}
                </div>
                <div className="shy-tracking-shipper-responsive-shipper-generic-text">
                  {window.translate("Shipper")}
                </div>
              </div>
              <div className="shy-tracking-shipper-responsive-icon-ctn">
                <img
                  alt=""
                  className="shy-tracking-shipper-responsive-icon-img"
                  src="https://cdn.shippify.co/icons/icon-user-white.svg">
                </img>
              </div>
            </div>

            <img
              alt=""
              className="shy-tracking-shipper-image"
              src={`https://admin.shippify.co/photos/shippers/${this.props.shipper.information.shipperId}/thumbnail.jpg`} />
            <div className="shy-tracking-shipper-info-col">
              <div className="shy-tracking-shipper-info-box">
                <div>
                  { decodeURI(this.props.shipper.information.shipperName) }
                </div>
                <div className={this.props.isAuth?"shy-tracking-shipper-info-dimmed-text":"shy-tracking-map-blur"}>
                  { this.props.isAuth?`ID: ${this.props.shipper.information.shipperId}`:`0000` }
                </div>
              </div>
              <div className="shy-tracking-shipper-info-bottom-row">
                <div className="shy-tracking-shipper-info-box">
                  <div>
                    {
                      this.props.isAuth ?
                      this.props.shipper.information.shipperVehicleModel :
                      'Car'
                    }
                  </div>
                  <div className={this.props.isAuth?"shy-tracking-shipper-info-dimmed-text":"shy-tracking-map-blur"}>
                    { this.props.isAuth?this.props.shipper.information.shipperVehiclePlate:'GGG-000' }
                  </div>
                </div>
                <div className="shy-tracking-divider"></div>
                <div className="shy-tracking-shipper-icon-container">
                  <img alt="" className="shy-tracking-shipper-vehicle-icon" src="https://cdn.shippify.co/icons/icon-car-side-gray.svg"></img>
                </div>
              </div>
            </div>
            {
              (showChatButton && !chatButtonState) &&
              <div id="shy-tracking-shipper-rad" className={(this.state.animate) ? "shy-tracking-shipper-radial open opaque" : "shy-tracking-shipper-radial opaque"}>
                <div className={(this.state.animate)? "shy-tracking-shipper-radial-text" : "shy-tracking-shipper-radial-text hidden"}>
                  {chatButtonMessage}
                </div>
                <button
                  className="shy-tracking-shipper-chat-icon-container"
                  onClick={this.showShipperChat}
                  disabled={!chatButtonState}>
                    <img alt="" className="shy-tracking-shipper-chat-icon" src="https://cdn.shippify.co/icons/icon-messenger-white.svg"></img>
                </button>
              </div>
            }
            {
              (showChatButton && chatButtonState) &&
              <div id="shy-tracking-shipper-rad" className={(this.state.animate) ? "shy-tracking-shipper-radial open" : "shy-tracking-shipper-radial"}>
                <div className={(this.state.animate)? "shy-tracking-shipper-radial-text" : "shy-tracking-shipper-radial-text hidden"}>
                  {chatButtonMessage}
                </div>
                <button
                  className="shy-tracking-shipper-chat-icon-container"
                  onClick={this.showShipperChat}
                  disabled={!chatButtonState}>
                    <img alt="" className="shy-tracking-shipper-chat-icon" src="https://cdn.shippify.co/icons/icon-messenger-white.svg"></img>
                </button>
              </div>
            }
          </div>
        }
        {
          !this.props.shipper &&
          <div className="shy-tracking-shipper-info">
            <div className="shy-tracking-shipper-non-image-ctn">
              <img alt="" className="shy-tracking-shipper-image-icon" src="https://cdn.shippify.co/images/img-shipper-avatar.svg" />
            </div>
            <div className="shy-tracking-shipper-info-col">
              <div className="shy-tracking-shipper-not-available-text">
                {window.translate("default_shipper_name_label")}
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}


export default TrackingShipper;
