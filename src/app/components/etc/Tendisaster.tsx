"use client"
import React, {useState,useEffect} from 'react';
import { dataState, DataType } from '../../recoil/dataRecoil';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  return isToday ? date.toLocaleTimeString() : date.toLocaleDateString();
}

export default function TenDisaster() {
  const disasterInfo = useRecoilValue(dataState);
  const [sortedDisasters, setSortedDisasters] = useState<DataType[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);


  useEffect(() => {
    const sorted = [...disasterInfo].sort((a, b) => new Date(b.dDate).getTime() - new Date(a.dDate).getTime()).slice(0, 10);
    setSortedDisasters(sorted);
  }, [disasterInfo]);

  const handleRowClick = (id: string) => {
    setSelectedId(selectedId === id ? null : id);
  };

  return (
    <div className="bg-gray-200 p-4 rounded-lg">
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-800 dark:bg-gray-700">
            <tr>
              <th scope="col" className="py-3 px-6">Rank</th>
              <th scope="col" className="py-3 px-6">country</th>
              <th scope="col" className="py-3 px-6">Type</th>
              <th scope="col" className="py-3 px-6">Time</th>
            </tr>
          </thead>
          <tbody>
            {sortedDisasters.map((item, index) => (
              <>
                <tr key={item.dID} onClick={() => handleRowClick(item.dID)} className="cursor-pointer">
                  <td className="py-4 px-6">{index + 1}</td>
                  <td className="py-4 px-6">{item.dCountry}</td>
                  <td className="py-4 px-6">{item.dType}</td>
                  <td className="py-4 px-6">{formatDateTime(item.dDate)}</td>
                </tr>
                {selectedId === item.dID && (
                  <tr>
                    <td colSpan={4} className="py-4 px-6 bg-gray-100">
                      {item.dTitle || 'No Title'}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}