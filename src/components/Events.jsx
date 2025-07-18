import React from 'react';
import './Events.css';
import clickNcraft from '../assets/click_n_craft.png';
import sharkVerse from '../assets/shark_verse.png';
import aura from '../assets/aura.png';
import Committee from './Committee';

const Events = () => {
  return (
    <div className="EventsWrapper">
      <div className="event-heading">
        <h2>Events by DESOC</h2>
      </div>

      <div className="eventlist">
        <div className="event-card">
          <img src={clickNcraft} alt="Click 'n' Craft" />
          <p>Click 'n' Craft</p>
        </div>

        <div className="event-card">
          <img src={sharkVerse} alt="Shark Verse" />
          <p>Shark Verse</p>
        </div>

        <div className="event-card">
          <img src={aura} alt="Aura" />
          <p>Aura</p>
        </div>
      </div>
    </div>
  );
};

export default Events;
