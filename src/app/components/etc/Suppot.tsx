"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { dataState, DataType } from "../../recoil/dataRecoil";
import { useRecoilState } from "recoil";

interface Disaster {
  objectId: number;
  dID: string;
  dSource: string;
  dStatus: string;
  dAlertLevel: string;
  dTitle: string;
}
interface DonationHistoryItem {
  email: string;
  name: string;
  amount: number;
  currency: string;
  targetCountry: string;
  dTitle: string;
  dID: string;
  dType: string;
  dAlertLevel: string;
}

const Support: React.FC = () => {
  const [data, setdata] = useRecoilState(dataState);
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [selecteddID, setSelecteddID] = useState<string>("");
  const [amount, setAmount] = useState<string>('0');
  const [currency, setCurrency] = useState<string>("USD");
  const [supportDetail, setSupportDetail] = useState<DataType | null>(null);
  const [selectedDonationId, setSelectedDonationId] = useState<string | null>(null);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('access-token');
        const res = await axios.get('https://worldisaster.com/api/support', {
          headers: {
            'Authorization': `Bearer ${token}`,
            withCredentials: true,
          }
        });
        console.log('Log: Successfully loaded donations history', res);
        setDisasters(res.data);
      } catch (error) {
        console.error('Log: Failed to load donations history', error);
      }
    };

    fetchData();
  }, []);

  const token = Cookies.get('access-token');

  const handleButtonClick = async () => {

    try {
      const response = await axios.post('https://worldisaster.com/api/support/paypal',
        {
          dID: selecteddID,
          amount,
          currency,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            withCredentials: true,
          },
        }
      );
      console.log('Log: Clicked the donation button', response);
      const approvalUrl = response.data.approvalUrl;
      console.log(approvalUrl);

      if (approvalUrl) {
        window.location.href = approvalUrl;
      } else {
        console.error('Log: Approval URL is undefined!');
      }

    } catch (error) {
      console.error('Log: Error: ', error);
    }
  };

  useEffect(() => {
    if (data.length === 0) {
      const loadData = async () => {
        try {
          const [oldData, newData] = await Promise.all([
            axios.get('https://worldisaster.com/api/oldDisasters'),
            axios.get('https://worldisaster.com/api/newDisasters'),
          ]);
          setdata(oldData.data.concat(newData.data));
        } catch (err) {
          console.log('Log: Failed to load data:', err);
        }
      };
      loadData();
    } else {
      const selectedDisaster = data.find((disaster) => disaster.dID === selecteddID);
      if (selectedDisaster) {
        setSupportDetail(selectedDisaster);
      } else {
        setSupportDetail(null);
      }
    }
  }, [selecteddID]);

  const [donationHistory, setDonationHistory] = useState<DonationHistoryItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('access-token');
        const res = await axios.get('https://worldisaster.com/api/support/history', {
          headers: {
            'Authorization': `Bearer ${token}`,
            withCredentials: true,
          }
        });
        setDonationHistory(res.data);
        console.log('Log: Successfully loaded your donation history:', res);
      } catch (error) {
        console.error('Log: Failed to load your donation history:', error);
      }
    };

    fetchData();
  }, []);

  const handleDonationClick = (dID: string) => {
    setSelectedDonationId(selectedDonationId === dID ? null : dID);
  };

  return (
    <div>
      <div className="card">
        <div className="cardTitle">Donations</div>
        <div className="cardContent">
          <p className="mb-3">Our team of expects have enabled a donation feature on specific disasters that need a helping hand. Please follow these steps to support those in need:</p>
          <p>(1) Select a disaster that you want to donate to.</p>
          <p>(2) Enter the currency and amount. Even the smallest donation helps.</p>
          <p>(3) Upon clicking 'Donate', You will be redirected to Paypal to complete the transaction.</p>
        </div>
      </div>
      <div className="card">
        <div className="cardTitle">Form</div>
        <div>
          <select
            id="1"
            value={selecteddID}
            onChange={(event) => setSelecteddID(event.target.value)}
            className="select ml-[20px]"
          >
            {selecteddID === "" ? <option>Select a disaster to donate to.</option> : null}
            {disasters.map((disaster, index) => (
              <option
                key={index}
                value={disaster.dID}
              >
                {truncateText(disaster.dTitle, 50)}
              </option>
            ))}
          </select>

          <div>
            {!supportDetail ?
              <div className="card2">
                <div className="cardContent">
                  Select a disaster to donate to (Details shown here)
                </div>
              </div>
              :
              <>
                <div className="card2">
                  <div className="cardContent">
                    {supportDetail.dTitle} {'\n'}
                    {supportDetail.dAlertLevel} {'\n'}
                    {supportDetail.dStatus} {'\n'}
                  </div>
                </div>
              </>
            }
          </div>

          <input className="input ml-[20px]" type="text" name="amount" id="amount" placeholder="0.00" onChange={(event) => setAmount(event.target.value)} />
          <select
            aria-label="Choose Currency"
            id="currency"
            name="currency"
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
            className="select ml-[10px]"
          >
            <option>USD</option>
            <option>EUR</option>
          </select>
        </div>
        <div className="btnBox">
          <button className="btn" onClick={handleButtonClick}>Donate</button>
        </div>
      </div>

      <div className="card">
        <div className="cardTitle">History</div>
        <div className="custom-scrollbar overflow-auto h-[150px]">
          <table className="w-full text-left p-5">
            <thead className="uppercase">
              <tr>
                <th scope="col" className="py-1 pl-3">Thank you for your help!</th>
              </tr>
            </thead>
            <tbody className="p-3">
              {donationHistory.map((donation, index) => (
                <>
                  <tr
                    key={index}
                    onClick={() => handleDonationClick(donation.dID)}
                    className="cursor-pointer"
                  >
                    <td className="card2 py-1 mx-5">{donation.dTitle}</td>
                  </tr>
                  {selectedDonationId === donation.dID && (
                    <tr>
                      <td colSpan={1} className="p-5 bg-gray-100">
                        Amount: {donation.amount} {donation.currency} <br />
                        Country: {donation.targetCountry} <br />
                        Disaster Type: {donation.dType} <br />
                        Alert Level: {donation.dAlertLevel}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Support;