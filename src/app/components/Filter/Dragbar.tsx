"use client";

import React from "react";
import { Slider } from "@nextui-org/react";
import { useRecoilState } from "recoil";
import { filterState, yearState } from '../../recoil/dataRecoil';


export const Dragbar = () => {
  const [filtering, setFiltering] = useRecoilState(filterState);
  const [selectedYear, setSelectedYear] = useRecoilState(yearState);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setFiltering({ ...filtering, selectedYear: year });
  };

  return (
    <div className="card2">
      <Slider
        label="Slide to review disasters by year."
        size="sm"
        maxValue={2023}
        minValue={2000}
        getValue={(year) => `Y${year}`}
        value={selectedYear}
        onChange={(newYear) => {
          const year = Array.isArray(newYear) ? newYear[0] : newYear;
          handleYearChange(year);
        }}
        className="px-2"
      />
    </div>
  );
};

export default Dragbar;