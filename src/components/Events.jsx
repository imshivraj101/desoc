import React from 'react'
import './Events.css'

const Events = () => {
  const genesisImg = null; // image not uploaded yet
  const technigmaImg = null;

  return (
    <div className="EventsWrapper">
      <div className="event-heading">
        <h2>Events by DESOC</h2>
      </div>

      <div className="eventlist">
        <div className="event-card">
          {genesisImg ? (
            <img src={genesisImg} alt="Genesis" />
          ) : (
            <div className="image-placeholder">Genesis Image</div>
          )}
          <p>Genesis</p>
        </div>
        <div className="event-card">
          {technigmaImg ? (
            <img src={technigmaImg} alt="Technigma" />
          ) : (
            <div className="image-placeholder">Technigma Image</div>
          )}
          <p>Technigma</p>
        </div>
      </div>
    </div>
  )
}

export default Events;
