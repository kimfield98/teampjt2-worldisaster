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
    <div className="card2">
      <Switch isSelected={selectLive} onValueChange={handleLiveToggle} defaultSelected={selectLive} size="lg"></Switch>
      <div className="mt-2 px-1">
        {selectLive ? (
          <p><p>Viewing <b>real-time</b> disasters</p> {'(Click toggle to see archives)'}</p>
        ) : (
          <p><p>Viewing historical <b>archives</b></p> {'(Click toggle to see real-time disasters)'}</p>
        )}
      </div>
    </div>
  );
};

export default Toggle;