/**
 * @file index.js
 * @description Map index component
 *
 */

import React from 'react';

import './main.css';


/**
 *
 */
class NotFound extends React.Component {
  render() {
    return (
      <div id="shy-tracking-notFound" className="shy-tracking-main">
        <img src="https://cdn.shippify.co/web/images/latest/img-not-found.svg" alt=" shippify"/>
      </div>
    )
  }
}


export default NotFound;
