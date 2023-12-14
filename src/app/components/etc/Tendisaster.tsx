"use client"
import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { dataState, DataType } from '../../recoil/dataRecoil';
import ReactPaginate from 'react-paginate';
import { useRouter } from 'next/navigation';

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  return date.toDateString() === now.toDateString() ? date.toLocaleTimeString() : date.toLocaleDateString();
}

export default function TenDisaster() {
  const disasterInfo = useRecoilValue(dataState);
  const [sortedDisasters, setSortedDisasters] = useState<DataType[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const filtered = disasterInfo.filter(item => item.dStatus === 'ongoing' || item.dStatus === 'real-time');
    const startIndex = currentPage * itemsPerPage;
    const selectedDisasters = filtered.slice(startIndex, startIndex + itemsPerPage);
    setSortedDisasters(selectedDisasters);
  }, [disasterInfo, currentPage]);

  const handleDetailView = (item: DataType) => {
    router.push(`/earth?lat=${item.dLatitude}&lon=${item.dLongitude}&height=1000000&did=${item.dID}`);
  };

  const handleRowClick = (id: string) => {
    setSelectedId(selectedId === id ? null : id);
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  // 페이지 변경 핸들러
  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  // 각 페이지의 항목에 대한 전체 순위를 계산
  const getRank = (index:number) => {
    return currentPage * itemsPerPage + index + 1;
  };

  const totalPages = Math.ceil(disasterInfo.filter(item => item.dStatus === 'ongoing' || item.dStatus === 'real-time').length / itemsPerPage);

  return (
    <div className="card2 custom-scrollbar overflow-auto">
      <div className="cardTitle mt-1 flex justify-between items-center">
        <span>Ongoing Disaster List</span>
        <div>
          <label htmlFor="itemsPerPage" className="mr-2 text-sm font-medium text-gray-700">Items per page</label>
          <input 
            type="number" 
            id="itemsPerPage"
            min="1" 
            value={itemsPerPage} 
            onChange={handleItemsPerPageChange} 
            className="w-16 text-center border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>
      <div className="relative">
        <table className="w-full text-left border-collapse">
        <thead className="bg-gray-300 text-center">
          <tr>
            <th scope="col" className="py-3 px-2 border-b border-gray-300 w-8">Rank</th>
            <th scope="col" className="py-3 px-2 border-b border-gray-300 w-40 ellipsis">Country</th>
            <th scope="col" className="py-3 px-2 border-b border-gray-300 ellipsis">Type</th>
            <th scope="col" className="py-3 px-2 border-b border-gray-300 min-w-[8rem] flex-grow ellipsis">Time</th>
          </tr>
        </thead>
          <tbody>
            {sortedDisasters.map((item, index) => (
              <>
                <tr 
                  key={item.dID} 
                  onClick={() => handleRowClick(item.dID)}
                  className={`cursor-pointer ${item.dStatus === 'real-time' ? 'text-blue-600 font-semibold' : 'text-gray-700'} hover:bg-gray-200 transition duration-150 ease-in-out border-b border-gray-300`}
                >
                  <td className="py-2 px-2 text-center">{getRank(index)}</td>
                  <td className="py-2 px-2 text-center ">{item.dCountry}</td>
                  <td className="py-2 px-2 text-center">{item.dType}</td>
                  <td className="py-2 px-2 text-center">{formatDateTime(item.dDate)}</td>
                </tr>
                {selectedId === item.dID && (
                  <tr className="transition-all duration-300">
                    <td colSpan={4} className="p-3 bg-gray-100 border-b border-gray-300">
                      <div className="flex justify-between items-center">
                        <span>{item.dTitle || 'No Title'}</span>
                        <button 
                          className="inline-flex text-white bg-sky-400 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                          onClick={() => handleDetailView(item)}
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
            </tbody>
            </table>
      </div>
      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        pageCount={totalPages}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"pagination flex justify-center mt-4 items-center"}
        activeClassName={"active bg-gray-300 rounded-full"}
        disabledClassName={"disabled text-gray-500"}
        previousClassName={"mx-1 w-8 h-8 flex justify-center items-center rounded-full border border-gray-300 hover:bg-gray-200"}
        nextClassName={"mx-1 w-8 h-8 flex justify-center items-center rounded-full border border-gray-300 hover:bg-gray-200"}
        breakClassName={"mx-1"}
        pageClassName={"page m-1"}
        pageLinkClassName={"w-8 h-8 flex justify-center items-center rounded-full border border-gray-300 hover:bg-gray-200"}
        previousLinkClassName={"w-full h-full flex justify-center items-center"}
        nextLinkClassName={"w-full h-full flex justify-center items-center"}
        breakLinkClassName={"px-3 py-2"}
      />
    </div>
  );
}