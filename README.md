# Tracking

This library provide tracking page components.

### Usage for integration 

For the implementation you will need the apiId and apiSecret that are available in the configurations of your company. 
These credentials must be sent in the header and the ( ID of the task / Reference ID ) in the url of the following enpoint:

``` https://api.shippify.co/v1/deliveries/token/{id}```

This must be done on the backend side so that the credentials are not exposed in the frontend (it is most recommended when generating the token)


Include these files in your page:
```html
<script src="https://cdn.shippify.co/dash/src/widget-tracking/tracking.0.0.1.js" type="text/javascript"></script>
```
Use the following configuration based on the components you need to render:
```js
const config = {
    sections: {
        map: true,
        events: true,
        shipper: true,
        packages: true
    },
    element: "#tracking-page"
};
```
Render html
```html
<div id="tracking-page"></div>
```

Render
```js
TrackingWidget.init(
  deliveryId ,
  token, 
  config
);
```

<br/>

### Development

```sh
  $ yarn install
  $ yarn start
```

### Production

```sh
  $ yarn build
```
