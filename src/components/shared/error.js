import React from 'react'

import './error.css'

/**
 *
 */
const Error = ({text}) => (
  <div className="shpy-Error-container">
    <div className="shpy-Error">
      <img src="https://cdn.shippify.co/images/img-error.svg" alt=""/>
      <span>{text}</span>
    </div>
  </div>
)


export default Error