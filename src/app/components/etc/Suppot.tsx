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

  return (
    <div>
      <div className="card">
        <div className="cardTitle">Support Page</div>
        <div className="cardContent">
          <p className="mb-3">Explore disaster information and lend a helping hand.💌</p>
          <p>1️⃣ Select the type of disaster you want to help with,</p>
          <p>2️⃣ enter the currency and amount, and click the button.</p>
          <p>3️⃣ You will be redirected to the PayPal payment page.</p>
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
            {selecteddID === "" ? <option>Choose a disaster to donate to.</option> : null}
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
                  Select a disaster to donate to.
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
        <div className="custom-scrollbar h-screen overflow-auto relative h-[150px]">
          <table className="w-full text-left">
            <thead className="uppercase">
              <tr>
                <th scope="col" className="py-1 pl-3">Title</th>
                <th scope="col" className="py-1">Amount</th>
                <th scope="col" className="py-1">Country</th>
                <th scope="col" className="py-1">Disaster Type</th>
                <th scope="col" className="py-1">Alert Level</th>
              </tr>
            </thead>
            <tbody>
              {donationHistory.length === 0 ? (
                <tr>
                  <td className="card2">No donation records found yet.</td>
                </tr>
              ) : (
                donationHistory.map((donation, index) => (
                  <tr key={index}>
                    <td className="py-1 pl-5">{donation.dTitle}</td>
                    <td className="py-1">{donation.amount} {donation.currency}</td>
                    <td className="py-1">{donation.targetCountry}</td>
                    <td className="py-1">{donation.dType}</td>
                    <td className="py-1">{donation.dAlertLevel}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Support;