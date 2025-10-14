import React from "react";

interface PetEnergyBarProps {
  energy: number; // Energy level, from 0 to 100
}

const PetEnergyBar: React.FC<PetEnergyBarProps> = ({ energy }) => {
  return (
    <div className="card p-4 bg-white shadow-lg rounded-lg flex flex-col justify-center items-center space-y-2">
      <div className="text-sm font-semibold text-[#192752]">Pet's Energy</div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#28a5ff] transition-all duration-500 ease-in-out"
          style={{ width: `${energy}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{energy}% Energy</div>
    </div>
  );
};

export default PetEnergyBar;
