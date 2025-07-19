import React from 'react';
import clickNcraft from '../assets/click_n_craft.png';
import sharkVerse from '../assets/shark_verse.png';
import aura from '../assets/aura.png';
import Committee from './Committee';

const Events = () => {
  return (
    <div>
      <div className="flex justify-center items-center mt-12">
        <h2 className="bg-red-600 text-white text-[2.2rem] px-5 py-2.5 rounded-lg w-fit">
          Events by DESOC
        </h2>
      </div>

      <div className="flex justify-center items-start gap-20 mt-15 flex-wrap">
        <div className="flex flex-col items-center w-50 bg-none border-none shadow-none p-0">
          <img src={clickNcraft} alt="Click 'n' Craft" className="w-full h-50 rounded-lg object-cover bg-none shadow-none" />
          <p className="mt-2.5 text-base text-center font-medium text-gray-700">Click 'n' Craft</p>
        </div>

        <div className="flex flex-col items-center w-50 bg-none border-none shadow-none p-0">
          <img src={sharkVerse} alt="Shark Verse" className="w-full h-50 rounded-lg object-cover bg-none shadow-none" />
          <p className="mt-2.5 text-base text-center font-medium text-gray-700">Shark Verse</p>
        </div>

        <div className="flex flex-col items-center w-50 bg-none border-none shadow-none p-0">
          <img src={aura} alt="Aura" className="w-full h-50 rounded-lg object-cover bg-none shadow-none" />
          <p className="mt-2.5 text-base text-center font-medium text-gray-700">Aura</p>
        </div>
      </div>
    </div>
  );
};

export default Events;
