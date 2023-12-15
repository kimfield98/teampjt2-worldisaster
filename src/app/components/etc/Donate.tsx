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

      if (approvalUrl) {
        // window.location.href = approvalUrl;
        window.open(approvalUrl, '_blank')?.focus();

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
        <div className="cardTitle">Donations Guideline</div>
        <div className="cardContent" style={{ margin: "10px 20px 10px", padding: "10px" }}>
          <p>Please select a disaster you would like to donate to. Our team of experts have carefully curated a list of disasters that we can support with this feature. Remember that even the smallest donation means a lot to those affected.</p>
          <br />
          <p>Your donations will be handled with care, and upon request, our team will provide a receipt acknowledging your donation. In time, we can also provide detailed information on how/where the funds were routed.</p>
        </div>
      </div>

      <div className="card">
        <div className="cardTitle">Donation Options</div>
        <div>
          <select
            id="1"
            value={selecteddID}
            onChange={(event) => setSelecteddID(event.target.value)}
            className="select ml-[20px]"
          >
            {selecteddID === "" ? <option>Select a disaster.</option> : null}
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
                  Select a disaster to see an overview.
                </div>
              </div>
              :
              <>
                <div className="card2" style={{ backgroundColor: '#f5f7f9' }}>
                  <div className="cardContent">
                    <p>
                      {supportDetail.dTitle}. {supportDetail.dDescription}
                    </p> <br />
                    {supportDetail.dUrl == null ? null :
                      <button
                        onClick={() => {
                          if (supportDetail.dUrl) {
                            window.open(supportDetail.dUrl, '_blank')?.focus();
                          }
                        }}
                        style={{ color: 'blue', fontStyle: 'italic' }}
                        className='hover:text-gray-500 active:text-gray-300'
                      >
                        Visit GDACS for more details.
                      </button>
                    }
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
          <button className="btn" onClick={handleButtonClick} style={{ padding: '10px' }}>Donate via Paypal</button>
        </div>
      </div>

      <div className="card">
        <div className="cardTitle">Your Donation History</div>
        {donationHistory.length === 0 ? (
          <div style={{ margin: "10px 20px 10px", padding: "10px" }}>
            <p>
              You have not made a donation through our platform in the past. If you believe this is an error,
              please <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-800">contact us</a> immediately,
              and we will resolve the issue promptly. </p> <br />
            <p>Remember, whether you choose to donate through us or elsewhere,
              your generosity is invaluable, and even the smallest contribution can make a significant difference.
            </p>
          </div>
        ) : (
          <div className="custom-scrollbar overflow-auto h-[150px]">
            <table className="w-full text-left p-5">
              <thead className="uppercase">
                <tr>
                  <th scope="col" className="py-1 pl-3">You are an invaluable member of our
                    community. Your donations mean the world to those affected by the disaster. Thank you.</th>
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
        )}
      </div>
      {/* <div className="card">
        <div className="cardTitle">Donation History</div>
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
      </div> */}
    </div>
  );
};

export default Support;