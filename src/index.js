import React from "react";
import ReactDOM from "react-dom";
import Tracking from "./Tracking";
import NotFound from "./components/shared/notFound"
import axios from 'axios';
import $ from 'jquery';
import {loadSourceChat} from '@helpers';


export function init( id , token , settings){
    
    loadSourceChat();
    axios.get(`https://api.shippify.co/track/${id}?token=${token}&widget=true`)
    .then(function (response) {
        
        const payload =  response.data.data
        settings.config={};
        settings.config.token = payload.token;
        settings.config.isAuth = true;
        settings.config.data = payload.data;
        settings.config.user = payload.env;
        settings.config.isMonitor = false;
        $('#'+ settings.element).css('position', 'relative')
        ReactDOM.render(<Tracking {...settings} {...settings.config} />, document.getElementById(settings.element), () => { 
            if (!document.getElementById('my-chat')) {
            $('#tracking-page').append('<div id="my-chat" style="position: absolute;z-index: 9000000;height: 500px;width: 370px;bottom: 0px;right: 0;"></div>')
            }
        }
    );
        
    })
    .catch(function (error) {
        console.log('ERROR>>>', error);
        
        ReactDOM.render(<NotFound />, document.getElementById(settings.element));
    });
    
}
