"use client";

import React, { useState } from "react";
import { Switch } from "@nextui-org/react";
import { useRecoilState } from "recoil";
import { filterState, yearState } from '../../recoil/dataRecoil';


export const Toggle = () => {
  const [rememberYear, setRememberYear] = useRecoilState<number>(yearState);
  const [filtering, setFiltering] = useRecoilState(filterState);
  const [selectLive, setSelectLive] = useState<boolean>(filtering.selectedLive);

  
  const handleLiveToggle = (isLive: boolean) => {
    setSelectLive(isLive);

    if (isLive) {
      setRememberYear(filtering.selectedYear);
      setFiltering({ ...filtering, selectedLive: isLive, selectedYear: 2023 });
    } else {
      setFiltering({ ...filtering, selectedLive: isLive, selectedYear: rememberYear });
    }
  };

  return (
    <div className="flex flex-col">
      <Switch isSelected={selectLive} onValueChange={handleLiveToggle} defaultSelected={selectLive} size="lg">
        <p>
          {selectLive ? (
            <p className="text-black"><p>Viewing real-time disasters</p> {'(Click to see archives)'}</p>
          ) : (
            <p className="text-black"><p>Viewing historical archives</p> {'(Click to see real-time disasters)'}</p>
          )}
        </p>
      </Switch>
    </div>
  );
};

export default Toggle;