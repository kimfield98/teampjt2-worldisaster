"use client"
import React, {useState,useEffect} from 'react';
import { dataState, DataType } from '../../recoil/dataRecoil';
import { useRecoilValue } from 'recoil';

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
    const filteredAndSorted = [...disasterInfo]
      .filter(item => item.dStatus === 'ongoing' || item.dStatus === 'real-time')
      .sort((a, b) => new Date(b.dDate).getTime() - new Date(a.dDate).getTime());
    setSortedDisasters(filteredAndSorted);
  }, [disasterInfo]);
  
  

  const handleRowClick = (id: string) => {
    setSelectedId(selectedId === id ? null : id);
  };

  return (
    <div className="card custom-scrollbar overflow-auto h-[150px]">
      <div className="cardTitle mt-1">Ongoing Disaster List</div>
      <div className="relative">
        <table className="w-full text-left">
          <thead className="uppercase pl-3">
            <tr>
              <th scope="col" className="py-1">Rank</th>
              <th scope="col" className="py-1">country</th>
              <th scope="col" className="py-1">Type</th>
              <th scope="col" className="py-1">Time</th>
            </tr>
          </thead>
          <tbody>
            {sortedDisasters.map((item, index) => (
              <>
                <tr 
                  key={item.dID} 
                  onClick={() => handleRowClick(item.dID)} 
                  style={item.dStatus === 'real-time' ? { color: '#1d4ed8' } : {}}
                >
                  <td className="py-1 pl-5">{index + 1}</td>
                  <td className="py-1">{item.dCountry}</td>
                  <td className="py-1">{item.dType}</td>
                  <td className="py-1">{formatDateTime(item.dDate)}</td>
                </tr>
                {selectedId === item.dID && (
                  <tr>
                    <td colSpan={4} className="p-5 bg-gray-100">
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