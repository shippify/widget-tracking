/**
 * @file constants.js
 * @description Tracking page constants
 *
 */


/**
 *
 */
export const DeliveryStatus = {
  draft: "draft",
  pendingToReview: "pending_to_review",
  scheduled: "scheduled",
  processing: "processing",
  broadcasting: "broadcasting",
  assigned: "assigned",
  confirmedToPickup: "confirmed_to_pickup",
  atPickup: "at_pickup",
  onDelivery: "on_delivery",
  goingToDropoff: "going_to_dropoff",
  atDropoff: "at_dropoff",
  droppedOff: "dropped_off",
  completed: "completed",
  notPickedUp: "not_picked_up",
  canceled: "canceled",
  returning: "returning",
  returned: "returned",
  holdByCourier: "hold_by_courier"
}

export const Reason = {
  "ADDRESS DOES NOT EXIST": "ADDRESS DOES NOT EXIST",
	"DANGER ZONE": "DANGER ZONE",
	"DELIVERY CANCELLED BY COMPANY": "DELIVERY CANCELLED BY COMPANY",
	"OTHER": "OTHER",
	"RECIPIENT REJECTED PACKAGE": "RECIPIENT REJECTED PACKAGE",
	"PACKAGE WITH DAMAGE OR LOST": "PACKAGE WITH DAMAGE OR LOST",
	"PERSON NOT AUTHORIZED TO RECEIVE PRODUCT": "PERSON NOT AUTHORIZED TO RECEIVE PRODUCT",
	"ADDRESS NOT FOUND, NEED CHANGE": "ADDRESS NOT FOUND, NEED CHANGE",
  address_does_not_exist: "Address does not exist",
  person_not_authorized_to_receive_product: "Person not authorized to receive product",
  recipient_rejected_package:"Recipient rejected package",
  package_damaged_on_route:"Package damaged on route",
  delivery_cancelled_by_company:"Delivery cancelled by company",
  other: "other",
  danger_zone: "Danger zone",
  hold_by_courier: "Hold by courier"
}
/**
 *
 */
export const EventType = {
  deliveryStatusUpdate: "DELIVERY_STATUS_UPDATE",
  deliveryAttempt: "DELIVERY_ATTEMPT",
  notDelivery: "NOT_DELIVERY"
}

/**
 *
 */
export const smallVehicle = {
  top: "M12.4,31.5222a2.1858,2.1858,0,0,1-.5.3h0a2.1814,2.1814,0,0,0-.5-.4,4.3492,4.3492,0,0,0-.7-.6,4.62,4.62,0,0,1-.7-.7,6.0341,6.0341,0,0,0-.8-.8l-.2-.2c.1-.2.3-.3.4-.5.3-.4.5-.7.8-1.1a8.56,8.56,0,0,0,1.1-2.4,5.2739,5.2739,0,0,0,.3-1.2,4.2529,4.2529,0,0,0,.2-1.1c.1-.9.1-2.1.1-2.8h.5a63.6175,63.6175,0,0,0,1-9.1H12a1.9093,1.9093,0,0,0,.3-.8h-.4a.9984.9984,0,0,0-.4-.5,3.67,3.67,0,0,0-.6-1.5v-.8h0c-.4-5.4,1.8-7.1,1.8-7.1a5.6846,5.6846,0,0,0-3.1,0c-1.7,2.2-1.8,5.6-1.8,6.6-2.2.4-2.5,2.9-2.5,2.9a.9984.9984,0,0,0-.4.5H4.5a1.5652,1.5652,0,0,0,.4,1,1.1493,1.1493,0,0,0,.9-.6c.1-.1.1-.3.4-.3a7.8335,7.8335,0,0,1,2.1-.2,5.2278,5.2278,0,0,0,.6,1.6v4.2a2.85,2.85,0,0,1,1.9,1.2.438.438,0,0,0-.1.3c0,.2.1.5.1.7,0,.3-.5.1-.5.1a5.5371,5.5371,0,0,0-1.8-.2,11.019,11.019,0,0,0-1.8.2s-.4.2-.5-.1c0-.2.1-.5.1-.7a.438.438,0,0,0-.1-.3,6.1351,6.1351,0,0,0-1.2,3.1v.4a2.2019,2.2019,0,0,0,.1.8v-.1a9.2465,9.2465,0,0,0,.1,2.2,3.5529,3.5529,0,0,0,.2,1,3.5822,3.5822,0,0,0,.4,1.1,10.0759,10.0759,0,0,0,1.2,2.3,7.6321,7.6321,0,0,0,.8,1.1c0,.1.1.1.1.2-.2.2-.4.5-.6.7a4.62,4.62,0,0,1-.7.7c-.2.2-.4.5-.6.6l-.4.4c-.2-.2-.4-.3-.6-.5v.1a11.26,11.26,0,0,0,1.4,5.6c.6,1,1.2,1,1.2,1l2.5.1H11l2.4-.1s.1,0,.4-.2C13.1,36.7222,12.2,34.9222,12.4,31.5222Zm-.8-20.5Zm-3.9,16.3a11.2516,11.2516,0,0,1-1.2-2.1c-.3-.7-.6-1.3-.8-1.9a3.2923,3.2923,0,0,0,2.8,1.9,3.3959,3.3959,0,0,0,2.7-1.7c-.2.4-.3.9-.5,1.3a11.9456,11.9456,0,0,1-1.2,2.2,8.65,8.65,0,0,1-.7,1l-.3.3h0A3.9153,3.9153,0,0,1,7.7,27.3222Zm1.6,5.3c-.3,0-.5.1-.8.1h0a4.6778,4.6778,0,0,1-2.8-.9c.1-.1.3-.1.5-.2a9.2225,9.2225,0,0,0,.8-.5l.9-.6c.2-.2.5-.4.7-.6l.2.2c.3.3.6.5.9.8l.9.6a2.9941,2.9941,0,0,0,.8.4,1.69,1.69,0,0,0,.5.2C11,32.2222,10.2,32.5222,9.3,32.6222Z",
  bottom: "M17.5,21.7222a4.167,4.167,0,0,0-2.3-2.8l.4-7.8v-.1h.6a.6.6,0,0,0,0-1.2h-.8a6.3737,6.3737,0,0,0,.2-.7h.2c.4-.1.3-.3-.1-.5a16.4133,16.4133,0,0,0,.2-2.3c0-3.2-1.3-5.8-2.8-5.8s-2.8,2.6-2.8,5.8,1.3,5.8,2.8,5.8h.3a50.1289,50.1289,0,0,1-1,7.9h-.6a6.062,6.062,0,0,0-1.1-3.1,3.8655,3.8655,0,0,0-1.9-1.2c-.1.1-.2.1-.4.1a.9015.9015,0,0,0-.5.1H7.7c-.2.1-.4.1-.6.2h0c-.1.1-.3.2-.4.3-.1,0-.1.1-.2.1l-.2.2-.3.3a6.1351,6.1351,0,0,0-1.2,3.1H4.2a58.59,58.59,0,0,1-1-8.9,2.1,2.1,0,0,0,1.6,0h0a1.5653,1.5653,0,0,1-.4-1v-.1a1.0464,1.0464,0,0,0-.9-.2l-.3-.2a.4661.4661,0,0,0-.6-.5h0a.1385.1385,0,0,0,0-.2c.4-.6-.3-.5-.3-.5s-2.1.5-1.2.8c.5.1.8.1,1-.1a.0979.0979,0,0,0,.1.1.0979.0979,0,0,0-.1.1,2.7609,2.7609,0,0,0-.8.6H.6a.6.6,0,0,0,0,1.2h.5v.1l.5,9,1.6,7,.3,1.4a5.4554,5.4554,0,0,0,1.3,2.5,5.1452,5.1452,0,0,0,3.6,1.5h0a1.95,1.95,0,0,0,.8-.1,12.9106,12.9106,0,0,0,2.1-.5c.2,2.8,1.3,5,2.8,5s2.8-2.6,2.8-5.8c0-2.3-.7-4.4-1.6-5.3l.4-1.3A2.5259,2.5259,0,0,0,17.5,21.7222Z"
}

/**
 *
 */
export const mediumVehicle = {
  top: "M24.5661,17.7037a.6621.6621,0,0,1-.3473.1107c-.9045,0-1.562-2.1654-1.4687-4.8366.0845-2.4177.7564-4.4037,1.5535-4.7621-.0122-.4094-.02-.6522-.02-.6522s.2918-3.169-3.4319-3.8035a7.0633,7.0633,0,0,1-3.0333-1.1053S16.7684,2.0113,13.54,2c-3.2279.0113-4.2782.6548-4.2782.6548A7.0633,7.0633,0,0,1,6.229,3.76c-3.7239.6346-3.3908,3.3859-3.4321,3.8035A13.0579,13.0579,0,0,0,1.9806,12.37c-.1328,2.7371.5754,3.5549.5612,4.2629q-.0155.7682-.0325,1.5265a1.1916,1.1916,0,0,1,.91-.1409,1.5858,1.5858,0,0,1,.852-1.2625,18.8781,18.8781,0,0,1,7.9632-2.0986,18.8558,18.8558,0,0,1,7.9372,2.0856,1.591,1.591,0,0,1,.8653,1.3794c.2745-.3023.8948-.1457,1.3991.1983a2.2741,2.2741,0,0,1,.76,1.6681c.02.4856-.2338.2749-.2338.2749v.0007a.1721.1721,0,0,0-.2333.0273c-.0058.0067-.0118.0164-.0184.0228-.1756.1756-1.2466-.6448-1.4838-.8317a.1635.1635,0,0,0-.1071-.0251l-.1262.0042c-.1168,2.5176-.2863,6.5774-.2863,8.9379a93.0078,93.0078,0,0,1-.9579,9.7891c-1.98-.2042-3.2978-2.1348-3.8874-3.2228.6209-2.0137,2.1258-11.9377.9679-13.0956-1.2062-1.2062-5.2077-1.3093-5.5984-1.3164-.3908.0071-4.41.11-5.6165,1.3164C4.4414,23.0441,5.9875,33.2235,6.59,35.05c-.7007,1.849-1.4631,2.4979-1.9591,2.7281a90.0971,90.0971,0,0,1-.9719-9.47l-.2329-8.8426c-.016.0008-.0341-.0049-.0479.0059a10.3666,10.3666,0,0,1-.9132.6385c-.0426,1.8551-.0791,3.4765-.0827,4.4746-.0067,1.9144.2286,5.677.485,9.5538a10.8286,10.8286,0,0,0-.4162,4.778,14.1008,14.1008,0,0,0,1.2062,4.4766c.04.3857.0787.7435.1159,1.0685C4.304,49.115,13.54,49.0319,13.54,49.0319s9.2366.0831,9.7673-4.5706c.0462-.4044.0955-.8748.146-1.3714-1.1357-.25-1.3555-1.7164-1.1524-4.7851.1575-2.3786,1.1076-4.35,1.9531-4.7513.2589-3.6642.45-7.1516.4439-8.9691C24.6934,23.1718,24.6362,20.5089,24.5661,17.7037ZM16.3633,41.2776a19.7952,19.7952,0,0,1-4.1291.4169A17.96,17.96,0,0,1,6.2248,40.76a5.9086,5.9086,0,0,1,.9231-5.1447c.5562.26,1.5888.4461,4.0628.4461,2.5937,0,3.5994-.2056,4.1378-.4855C17.1273,38.7889,16.7458,40.52,16.3633,41.2776Z",
  bottom: "M24.5224,33.4683a.73.73,0,0,0-.3021.0852c.2589-3.6642.45-7.1516.4439-8.9691-.005-1.4126-.0622-4.0754-.1323-6.8806.7556-.4669,1.3781-2.4033,1.4592-4.7259.0933-2.6711-.5644-4.8366-1.4687-4.8366a.64.64,0,0,0-.253.0745c-.0122-.4094-.02-.6522-.02-.6522s.2918-3.169-3.4319-3.8035a7.0633,7.0633,0,0,1-3.0333-1.1053S16.7343,2.0113,13.5063,2c-3.2279.0113-4.2782.6548-4.2782.6548A7.0633,7.0633,0,0,1,6.1949,3.76C2.471,4.3946,2.804,7.1459,2.7628,7.5636A13.0579,13.0579,0,0,0,1.9465,12.37c-.1328,2.7371.5754,3.5549.5612,4.2629q-.0155.7694-.0327,1.5291A2.0725,2.0725,0,0,0,2.14,18.32a2.275,2.275,0,0,0-.76,1.6686c-.02.4856.2338.2748.2338.2748v0a.1719.1719,0,0,1,.2333.0259l.0184.02c.0727.0727.3081-.0417.5652-.1963-.0426,1.8537-.0791,3.474-.0827,4.4717-.0067,1.9144.2286,5.677.485,9.5538a10.8286,10.8286,0,0,0-.4162,4.778,14.1008,14.1008,0,0,0,1.2062,4.4766c.04.3857.0787.7435.1159,1.0685.5308,4.6537,9.7672,4.5706,9.7672,4.5706s9.2366.0831,9.7673-4.5706c.0462-.4044.0955-.8748.146-1.3714a1.6545,1.6545,0,0,0,.37.0516c.9045,0,2.1078-2.1654,2.2011-4.8366S25.4268,33.4683,24.5224,33.4683Z"
}

/**
 *
 */
export const largeVehicle = {
  top: "M22.6,33.7h0a.3674.3674,0,0,1,.3-.1c.2,0,.3.1.5.2.2-5,.4-9.8.4-11.1,0-1.2-.1-3.7-.3-6.5-.2.3-.3.5-.5.6h0c-.2.1-.3.2-.4.2-.9,0-1.6-2.2-1.5-4.8.1-2.4.8-4.4,1.6-4.8h0c0-.4-.1-.9-.1-1.2-.4-3.9-.5-4.1-1.1-4.7A4.65,4.65,0,0,0,18.2.6c-1,0-4-.3-5.4-.5A6.602,6.602,0,0,0,11.4,0C10,.2,7,.5,6,.5a4.8042,4.8042,0,0,0-3.3.9,1.7556,1.7556,0,0,0-.4.5l-1,5.4-.4,7v1a1.8839,1.8839,0,0,1,.8.2l-.1-2.6A1.9294,1.9294,0,0,1,3.7,11s4-.5,6.2-.5,7.3.4,7.3.4c2.1,0,1.9,2.2,1.9,2.2L19,15.6a1.9968,1.9968,0,0,1,.9-.2.95.95,0,0,1,.8,1c0,.9,0,.9-.7.9s-.9-.3-.9-.3h0l-.6,28.3v.4a4.2549,4.2549,0,0,1-2.3-1.1,4.5,4.5,0,0,1-1-2.8l1.4-23.6s.1-1.8-1.5-1.8c0,0-3.7-.3-5.5-.3-1.7,0-5.2.4-5.2.4-1.6,0-1.5,1.8-1.5,1.8L4.1,41.7c.1,4.6-1.4,4.3-1.6,4.2,0-.2-.1-.4-.1-.6L1.7,16.9h0a1.5465,1.5465,0,0,1-.8.3l.3,25.9c.1,1.9.2,3.4.2,4.4a3.4893,3.4893,0,0,0,.5,1.9,3.3264,3.3264,0,0,0,1.4.7H20.8a3.3264,3.3264,0,0,0,1.4-.7,3.4893,3.4893,0,0,0,.5-1.9s.1-1.9.2-4.6c-.1.1-.2.3-.4.4-.1,0-.6.1-.7.1h0c-.7-.2-1.4-1.7-1.2-4.8C20.8,36.1,21.8,34.1,22.6,33.7ZM5.4,20.9a.6452.6452,0,0,1,.6-.6H9.4c1,0,2,0,3,.1a.6047.6047,0,0,1,.6.3c.1.1.1.2.1.4a22.6024,22.6024,0,0,0,.1,2.6v.5a.5764.5764,0,0,1-.6.6H6.1a.6835.6835,0,0,1-.7-.7Zm-1,26.8A2.8546,2.8546,0,0,1,6,43.8h6.9a4.9589,4.9589,0,0,1,3.7,3.9Z",
  bottom: "M23.3,34.05c.2-5,.4-9.8.4-11.1,0-1.2-.1-3.7-.3-6.5a8.589,8.589,0,0,0,.9-4.1c.2-2.6-.5-4.8-1.4-4.8-.1,0-.1,0-.2.1,0-.4-.1-.9-.1-1.2-.4-3.9-.5-4.1-1.1-4.7a4.65,4.65,0,0,0-3.3-.9c-1,0-4-.3-5.4-.5a6.602,6.602,0,0,0-1.4-.1C10,.45,7,.75,6,.75a4.8042,4.8042,0,0,0-3.3.9,1.7556,1.7556,0,0,0-.4.5l-1,5.4-.4,7v1H.8a.95.95,0,0,0-.8,1c0,.9,0,.9.7.9H.8l.3,25.9c.1,1.9.2,3.4.2,4.4a3.4893,3.4893,0,0,0,.5,1.9,3.3264,3.3264,0,0,0,1.4.7H20.7a3.3264,3.3264,0,0,0,1.4-.7,3.4893,3.4893,0,0,0,.5-1.9s.1-1.9.2-4.6a7.5945,7.5945,0,0,0,1.4-4.4C24.4,36.55,24,34.65,23.3,34.05Z"
};

/**
 *
 */
export const extraLargeVehicle = {
  top: "M24.3,17.4c-.9,0-1.6-2.2-1.5-4.8a7.7191,7.7191,0,0,1,.2-1.5c.1-.1.2-.3.3-.9a4.1839,4.1839,0,0,0,.1-.7A2.747,2.747,0,0,1,24.3,8V6.7L24,6.4a7.96,7.96,0,0,0-.7-2c-.7-1.4-3.2-2-3.6-2a8.65,8.65,0,0,1-1-.7.0979.0979,0,0,1-.1-.1,2.1859,2.1859,0,0,1-.5-.3h0a9.5607,9.5607,0,0,0-4.6-1h0A9.9885,9.9885,0,0,0,8.4,1.6a1.1655,1.1655,0,0,0-.7.2c-.2.1-.3.2-.5.3-.1.1-.3.2-.4.3h0c-1,.3-2.6.9-3.2,1.9a4.4651,4.4651,0,0,0-.5,2,3.3291,3.3291,0,0,1-.3.6h0L2.7,8.6h.1a.8109.8109,0,0,1,.7.5h1c2.1-1.9,6.8-1.9,7.8-1.9.9,0,5.7,0,7.8,1.9h.8s.3-.5.7-.5c.5,0,1.5.8,1.5.8l.1.1c-.1.5-.3,1-.4,1.5a1.9821,1.9821,0,0,1-1.1-.3,3.49,3.49,0,0,1-.9-.6c1.1,1.9.8,7.1.8,7.1l-.3,27.1-1.2.9v-28s.1-3.1-1.2-4.8c-1.2-1.4-5.4-1.3-6.6-1.3h-.4c-1.3,0-6.2,0-7.6,1.3-1.6,1.5-1.2,4.8-1.2,4.8l-.2.2s-.9-5,.7-7.6h0c-.4.1-.6.5-1.3.8H2.2l-.4,6.5h.1a1.6456,1.6456,0,0,0,.9,1.5h.1l-2.8,1H0V41.3c0,5.2-.1,9.4,10.4,9.4h.2c4.5,0,7-.8,8.4-2.1h0l5.4-4.1V42.4a1.2684,1.2684,0,0,1-.6.1c-1.1-.2-1.4-1.7-1.2-4.8.2-2.2,1-4.1,1.8-4.7V17.9a.7493.7493,0,0,0-.1-.5ZM13.5,40.5c-.4.3-1.1.9-4.2.9s-3.8-.5-4.2-.9c-.4-.3-2.2-12.4-1-13.5,1.1-1,4.9-1.1,5.3-1.1s4.1.1,5.2,1.1C15.7,28.1,13.9,40.1,13.5,40.5Z",
  bottom: "M26.3,38c0-3-.7-5.1-1.6-5.1h-.2c-.1,0-.1.1-.2.1V17.7a1.4862,1.4862,0,0,0,.1-.6h.1V17c.8-.5,1.4-2.4,1.5-4.7.1-2.7-.6-4.8-1.5-4.8h-.1c-.1,0-.1.1-.2.1V6.3L23.9,6a7.96,7.96,0,0,0-.7-2c-.7-1.4-3.2-2-3.6-2a8.65,8.65,0,0,1-1-.7.0979.0979,0,0,1-.1-.1A2.1859,2.1859,0,0,1,18,.9h0a9.5607,9.5607,0,0,0-4.6-1h0A9.9885,9.9885,0,0,0,8.3,1.2a6.1245,6.1245,0,0,1-.6.4c-.2.1-.3.2-.5.3-.1.1-.3.2-.4.3h0c-1,.3-2.6.9-3.2,1.9a4.4651,4.4651,0,0,0-.5,2,3.3291,3.3291,0,0,1-.3.6h0L2.7,8.4a5.1362,5.1362,0,0,0-1.4.8A1.1978,1.1978,0,0,0,1,10a1.054,1.054,0,0,0,.5.8,1.8553,1.8553,0,0,0,1.1-.2l-.4,6.5h.1a1.6456,1.6456,0,0,0,.9,1.5H2.9l-2.8,1H0V41.3c0,5.2-.1,9.4,10.4,9.4h.2c3.9,0,6.4-.6,7.9-1.6h0a1.38,1.38,0,0,0,.4-.3l5.5-4.2V42.5C25.5,41.9,26.2,40.2,26.3,38Z"
};

/**
 *
 */
export const mapStyle = [
  {
    "featureType": "administrative",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#444444"
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [
      {
        "color": "#f2f2f2"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "all",
    "stylers": [
      {
        "saturation": -100
      },
      {
        "lightness": 45
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "all",
    "stylers": [
      {
        "color": "#46bcec"
      },
      {
        "visibility": "on"
      }
    ]
  }
];
