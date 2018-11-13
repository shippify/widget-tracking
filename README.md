# Tracking

This library provide tracking page components.

### Usage

Include these files in your page:
```html
<script src="/tracking/build/tracking.0.0.1.js" type="text/javascript"></script>
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
  deliveryId: "t-shiinc-00001",
  deliveryStatus: 1
}
```
Render
```js
TrackingWidget.init(
  config,
  domElement
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
