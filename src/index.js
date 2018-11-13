import React from "react";
import ReactDOM from "react-dom";
import Tracking from "./Tracking";
import Main from "./components/share/main"
import NotFound from "./components/share/notFound"
import axios from 'axios';

export const settings = {
    config: undefined,
    element: 'tracking-page'
}

export function init( config, element ) {
    console.log('settings before', config);

    settings.config = config;
    settings.element = element;
    console.log('settings init', settings);
    
    ReactDOM.render(<Main />, document.getElementById(element));

}

export function search( id ){
    
    // const url = new URL('https://api.shippify.co')
    axios.get(`http://localhost:8021/track/${id}?widget=true`)
    .then(function (response) {
        const payload =  response.data.data

        settings.config.isAuth = true;
        settings.config.data = payload.data;
        settings.config.user = payload.env;
        settings.config.isMonitor = false;
        
        ReactDOM.hydrate(<Tracking {...settings.config} />, document.getElementById(settings.element));
        
    })
    .catch(function (error) {
        ReactDOM.hydrate(<NotFound />, document.getElementById(settings.element));
    });

}
