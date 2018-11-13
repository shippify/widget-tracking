/**
 * @file index.js
 * @description Map index component
 *
 */

import React from 'react';

import './index.css';


/**
 *
 */
class TrackingPackages extends React.Component {
  render() {
    const items = this.props.packages;
    return (
      <div id="shy-tracking-packages">
        <div className="shy-tracking-shipper-intro">
          {window.translate("Packages")}
        </div>
        <div className="shy-tracking-package-list">
          {
            items.map((_package, index) => {
              return (
                <div
                  key={index}
          		    className="shy-tracking-package-item"
                  style={{ 'backgroundColor': (index%2) ? '#fff' : '#f7f7f7'}}>
                    <div className="shy-tracking-package-item-qty">
                      { _package.qty }
                    </div>
                    <div className="shy-tracking-package-item-desc">
                      { decodeURI(_package.name) }
                    </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}


export default TrackingPackages;
