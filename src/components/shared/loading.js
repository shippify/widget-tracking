import React from 'react'

import './loading.css'

function getIcon(mini) {
  return mini ?
    "https://cdn.shippify.co/gifs/gif-coffee-machine.gif" :
    "https://cdn.shippify.co/images/img-loading.svg"
}
function getClass(mini) {
  return mini ? 'shpy-Loading-imgMini' : 'shpy-Loading-img spy-Loading-loader'
}
function getClassSpan(mini) {
  return mini ? 'shpy-Loading-spanMini' : 'shpy-Loading-span'
}

const Loading = ({mini = false, message}) => (
  <div className="shpy-Loading-container">
    <img className={getClass(mini)} src={getIcon(mini)} alt="Processing"/>
    <span className={getClassSpan(mini)}>
      {
        message
      }
      ...
    </span>
  </div>
)

export default Loading