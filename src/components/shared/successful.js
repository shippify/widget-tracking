import React from 'react'

import './successful.css'

const Successful = ({text}) => (
  <div className="shpy-Successful-container">
    <div className="shpy-Successful">
      <img src="https://cdn.shippify.co/images/img-done.svg" alt=""/>
      <span>{text}</span>
    </div>
  </div>
)

export default Successful