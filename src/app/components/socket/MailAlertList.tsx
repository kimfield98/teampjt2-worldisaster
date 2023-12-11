"use client";
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRecoilState } from 'recoil';
import { mailAlarmState, PostAlertInfo } from '../../recoil/dataRecoil';

export function MailAlertList() {
  const [alertInfo, setAlertInfo] = useRecoilState(mailAlarmState);
  const [alertData, setAlertData] = useState<PostAlertInfo[]>([]);

  const token = Cookies.get('access-token');

  useEffect(() => {
    const token = Cookies.get('access-token');
    const getAlertData = async () => {
      try {
        const response = await axios('https://worldisaster.com/api/emailAlerts',{
          headers: {Authorization: `Bearer ${token}`}
        })
        console.log("이용자의 알림정보를 받아옴",response.data);
        setAlertData(response.data);
      } catch(error) {
        console.log("error",error);
      }
    }
    getAlertData();
  },[alertInfo]);

  const deleteHandeler = async (objectId:string) => {
    if (!confirm("알림을 삭제하시겠습니까?"))
    return;
    try {
      const response = await axios.delete(`https://worldisaster.com/api/emailAlerts/${objectId}`,{
        headers: {Authorization: `Bearer ${token}`}
      })
      console.log('Alert deleted successfully', response.data);
      setAlertInfo(prev => ({...prev, updated: new Date()}));
      alert("삭제되었습니다.")
    } catch(error) {
      alert("삭제에 실패하였습니다.")
      console.log("error",error);
    }
  };

  return (
    <div className=' border-white border-5 divide-gray-300 w-full rounded-xl mt-2 overflow-hidden'>
    <table className='w-full'>
      <thead className="bg-gray-50">
          <tr>
              <th className="p-2 text-xs text-gray-500">
                  ID
              </th>
              <th className="p-2 text-xs text-gray-500">
                  Country
              </th>
              <th className="p-2 text-xs text-gray-500">
                  create at
              </th>
              <th className="p-2 text-xs text-gray-500">
                  Delete
              </th>
          </tr>
      </thead>
        <tbody className="bg-white divide-y divide-gray-300">  
          {alertData&& alertData.length > 0 ? alertData.map((data:any,index:number) => (
            <tr className="whitespace-nowrap" key={index}>
              <td className="p-2 text-sm text-gray-500">
                  {index+1}
              </td>
              <td className="p-2">
                  <div className="text-sm text-gray-900">
                    {data.alertCountryName}
                  </div>
              </td>
              <td className="p-2 text-sm text-gray-500">
                    {data.createdAt.slice(0,10)}
              </td>
              <td className="p-2">
                  <button className="px-4 py-1 text-sm text-red-400 bg-red-200 rounded-full" onClick={()=>{deleteHandeler(data.objectId)}}>
                    Delete
                  </button>
              </td>
            </tr>
          )): 
            <tr>
              <td colSpan={4} className=" text-center p-2 text-sm text-gray-500 ">
                  No Data
              </td>
            </tr>}
        </tbody>
    </table>
  </div>
  )
}
export default MailAlertList;
