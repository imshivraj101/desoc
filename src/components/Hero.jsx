import React from 'react';
import desocCover from '../assets/desoc_cover.png';
import desoc from '../assets/desoc.png';
import name from '../assets/name.png';
import Genesis from '../assets/genesis.png';

import Events from "./Events";
import Committee from './Committee';

const Hero = () => {
  return (
    <div className="relative w-full overflow-x-hidden">
      <div
        className="fixed top-0 left-0 w-full h-screen bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: `url(${desocCover})`,
        }}
      />

      <div className="bg-white text-black w-[90vw] mx-auto min-h-screen rounded-t-[10px] pt-24 mt-24 relative z-10">
        <div className="flex justify-between px-24 gap-24">
          <div>
            <img src={name} alt="DESOC Name" className="w-[500px]" />
          </div>
          <div>
            <img src={desoc} alt="DESOC Logo" className="w-[500px] pt-12" />
          </div>
        </div>

        <div>
          <h3 className="pt-12 text-3xl text-center">
            "Inspiring a future where technology and design harmoniously advance
            society through innovation and creativity."
          </h3>
        </div>

        <div className="flex justify-center">
          <h2 className="mt-15 bg-red-600 text-white text-[2.2rem] px-5 py-2.5 rounded-lg w-fit">
            Ongoing Event: Genesis
          </h2>
        </div>

        <div className="flex flex-row justify-center pt-24 gap-12">
          <div>
            <img src={Genesis} alt="Genesis Event" className="w-[600px] rounded-lg" />
          </div>
          <div className="max-w-[600px] text-3xl p-5">
            <p>
              Happening now: <strong>Workshop on Tech x Design</strong><br />
              Date: <strong>October 15th</strong><br />
              Time: <strong>6:00 PM</strong><br />
            </p>
            <p className="text-2xl">
              Dive deep into emerging trends, ideas, and opportunities in a
              creatively engineered space!
            </p>
            <button className="mt-45 px-7 py-3 bg-black text-white text-lg font-semibold border-none rounded-lg cursor-pointer transition-all duration-300 ease-in-out shadow-lg uppercase tracking-wider hover:bg-gray-700 hover:scale-105 hover:shadow-xl">
              Explore Live
            </button>
          </div>
        </div>

        <Events/>
        <Committee/>
      </div>
    </div>
  );
};

export default Hero;
