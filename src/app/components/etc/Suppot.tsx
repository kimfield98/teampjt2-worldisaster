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
    <div className="custom-scrollbar h-screen overflow-auto">
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
            className="select"
          >
            {selecteddID === "" ? <option>Choose a disaster to donate to.</option> : null}
            {disasters.map((disaster, index) => (
              <option
                key={index}
                value={disaster.dID}
              >
                {disaster.dTitle}
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

          <input className="input mr-1" type="text" name="amount" id="amount" placeholder="0.00" onChange={(event) => setAmount(event.target.value)} />
          <select
            aria-label="Choose Currency"
            id="currency"
            name="currency"
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
            className="select"
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
      <div className="card2">
        {donationHistory.length === 0 ? (
          <p>No donation records found yet.</p>
        ) : (
          donationHistory.map((donation, index) => (
            <div key={index}>
              <p>{donation.dTitle}</p>
              <p>Amount: {donation.amount} {donation.currency}</p>
              <p>Country: {donation.targetCountry}</p>
              <p>Disaster Type: {donation.dType}</p>
              <p>Alert Level: {donation.dAlertLevel}</p>
            </div>
          ))
        )}
      </div>
    </div>
    </div>
  );
};

export default Support;