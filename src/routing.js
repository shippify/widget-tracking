/**
 * @file routing.js
 * @description Returns a route given a group of points using the routing
 *              service and having the direction service as a fallback
 *
 */

import $ from 'jquery';


const MAX_WAYPOINTS_PER_REQUEST = 23
const SHIPPIFY_ROUTING_SERVICE_URL = 'https://routing.shippify.co';
const GOOGLE_ROUTING_SERVICE_URL = 'https://maps.googleapis.com';
const google=window.google

/**
 *
 */
const getRoute = async (points, waypoint) => {
  const pointSets = splitLink(points, MAX_WAYPOINTS_PER_REQUEST)
  const route = await pointSets.reduce(async (_route, pointSet) => {
    const [
      route,
      {bounds, points, distance, legs, steps, isUsingGraphhopper, googleSteps}
    ] = await Promise.all([
      _route,
      getShippifyRouteFragment(pointSet, waypoint)
    ])
    return {
      bounds: route.bounds.union(bounds),
      points: route.points.concat(points),
			distance: Number(route.distance) + Number(distance),
      legs: route.legs.concat(legs),
      steps: route.steps.concat(steps),
      isUsingGraphhopper,
      googleSteps: route.googleSteps.concat(googleSteps)
    }
  }, {
    bounds: new google.maps.LatLngBounds(),
    points: [],
		distance: 0,
    legs: [],
    steps: [],
    isUsingGraphhopper: false,
    googleSteps: []
  })
  return route
}

/**
 *
 */
const splitLink = (list, size) => {
	var chunks = []
	var index = 0
	while (index < list.length-1) {
		var start = index
		// var end = index + size
		chunks.push(list.slice(start, start + size))
		index = index + size - 1
	}
	return chunks
}

/**
 *
 */
const getShippifyRouteFragment = (points, waypoint) => {
  return new Promise((resolve, reject) => {
    if (points.length < 2) {
  		reject(new Error('Route can not be calculated with less than 2 points.'))
      return
  	}
  	const path = '/route/';
  	const pointQueryItem = `point=${points[0].latitude},${points[0].longitude}&point=${waypoint.lat},${waypoint.lng}&point=${points[1].latitude},${points[1].longitude}`;
  	const params = {
  		instructions: true,
  		optimize: true,
  		points_encoded: false,
  		type: 'json',
  		weighting: 'shortest',
  		way_point_max_distance: 100.0
  	};
    let url = `${SHIPPIFY_ROUTING_SERVICE_URL}${path}?${pointQueryItem}&${$.param(params)}`;
    return fetch(url, {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {

      const steps = [];
      for (var i=0; i<res.paths[0].instructions.length; i++) {
        steps.push(res.paths[0].instructions[i].interval)
        if (res.paths[0].instructions[i].sign === 5) {
          break;
        }
      }

      resolve({
        legs: [
          {
            start_location: new google.maps.LatLng(
              points[0].latitude,
              points[0].longitude
            ),
            end_location: new google.maps.LatLng(
              waypoint.lat,
              waypoint.lng
            )
          },
          {
            start_location: new google.maps.LatLng(
              waypoint.lat,
              waypoint.lng
            ),
            end_location: new google.maps.LatLng(
              points[points.length - 1].latitude,
              points[points.length - 1].longitude
            )
          }
        ],
        steps,
        bounds: {
          east: res.paths[0].bbox[2],
          north: res.paths[0].bbox[3],
          south: res.paths[0].bbox[1],
          west: res.paths[0].bbox[0]
        },
        points: res.paths[0].points.coordinates.map((coordinate) => ({
          latitude: coordinate[1], longitude: coordinate[0]
        })),
				distance: (res.paths[0].distance/1000).toFixed(2),
        isUsingGraphhopper: true
      })
    })
    .catch(error => {
      console.log('Routing Error:', error);
      reject(new Error('Routing failed'))
    })
  }).catch(function(reason) {
    return getRouteFragment(points)
  })
}

/**
 *
 */
const getRouteFragment = (points, waypoint) => {
  return new Promise((resolve, reject) => {
    if (points.length < 2) {
      reject(new Error('Route can not be calculated with less than 2 points.'))
      return
    }
    const url = new URL(GOOGLE_ROUTING_SERVICE_URL)
    url.pathname = '/maps/api/directions/json'
    const locations = points.map(({ latitude, longitude }) => (
      {
        lat: latitude,
        lng: longitude
      }
    ))
    const origin = locations[0]
    const destination = locations[locations.length - 1]

    const options = {
      origin,
      destination,
      waypoints: [{
        location: {
          lat: waypoint.lat,
          lng: waypoint.lng
        },
        stopover: true
      }],
      travelMode: google.maps.TravelMode.DRIVING
    }
    const service = new google.maps.DirectionsService()
    service.route(options, (response, status) => {

      if (status === google.maps.DirectionsStatus.MAX_WAYPOINTS_EXCEEDED) {
        reject(new Error('Route can not be calculated for more than 23 points.'))
        return
      }
      if (status === google.maps.DirectionsStatus.NOT_FOUND) {
        reject(new Error('Geocoding failed.'))
        return
      }
      if (status !== google.maps.DirectionsStatus.OK) {
        reject(new Error('Routing failed.'))
        return
      }
      const routeResults = [];
      for (var i = 0; i < response.routes.length; i++) {
        let routeDistance = 0;
        for (var j = 0; j < response.routes[i].legs.length; j++) {
          routeDistance += response.routes[i].legs[j].distance.value;
        }
        routeResults.push({
          'route': i,
          distance: routeDistance
        });
      }
      routeResults.sort(function(a, b) {
        return parseInt(a.distance) - parseInt(b.distance);
      });
			const distance = (routeResults[0]/1000).toFixed(2);
      const bounds = response.routes[0].bounds.toJSON()
      const points = response.routes[0].overview_path
      .map(({ lat, lng }) => ({
        latitude: lat(), longitude: lng()
      }))

      const route = {
        bounds,
        points,
				distance,
        legs: response.routes[0].legs.map((leg) => {
          return {
            start_location: leg.start_location,
            end_location: leg.end_location
          }
        }),
        googleSteps: response.routes[0].legs[0].steps,
        isUsingGraphhopper: false
      }
      resolve(route)
      return
    })
  })
}


export  { getRoute }