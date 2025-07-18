import React from 'react';
import './Hero.css';
import desocCover from '../assets/desoc_cover.png';
import desoc from '../assets/desoc.png';
import name from '../assets/name.png';
import Genesis from '../assets/genesis.png';
import Events from "./Events";

const Hero = () => {
  return (
    <div className="HeroWrapper">
      <div
        className="HeroBackground"
        style={{
          backgroundImage: `url(${desocCover})`,
        }}
      />

      <div className="HeroContentBox">
        <div className="HeroLogo">
          <div className="titley">
            <img src={name} alt="DESOC Name" />
          </div>
          <div className="dsoc">
            <img src={desoc} alt="DESOC Logo" />
          </div>
        </div>

        <div className="about">
          <h3>
            "Inspiring a future where technology and design harmoniously advance
            society through innovation and creativity."
          </h3>
        </div>

          <div className="event-name">

             <h2> Ongoing Event: Genesis</h2>
          </div>

        <div className="upcoming-event">

          <div className="event-image">
            <img src={Genesis} alt="Genesis Event" />
          </div>
          <div className="event-details">
           
            <p>

              Happening now: <strong>Workshop on Tech x Design</strong><br />
              Date: <strong>October 15th</strong><br />
              Time: <strong>6:00 PM</strong><br />
            
              
            </p>

              <p className='event-description'>
            Dive deep into emerging trends, ideas, and opportunities in a
              creatively engineered space!
              </p>
            <button className="event-button">Explore Live</button>
          </div>
        </div>

        <Events/>
      </div>
      
    </div>
    
  );
};

export default Hero;
