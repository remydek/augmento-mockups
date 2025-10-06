import React from 'react'

export default function Collectible() {
  return (
    <div className="collectible-overlay">
      <div className="collectible-modal">
        <div className="collectible-content">
          <div className="collectible-bubble">
            <div className="collectible-title">Collectible</div>
            <div className="collectible-reward">
              <img src="/coin.png" alt="Coin" className="collectible-coin" />
              <span className="collectible-amount">+100</span>
            </div>
            <button className="collectible-claim-btn">CLAIM</button>
            <div className="collectible-pointer"></div>
          </div>
        </div>
      </div>
    </div>
  )
}