import React, { useContext, createContext, useEffect, useState } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';
import { useToast } from './ToastContext';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0xF949E4BD49C2327BE3DC37AB680071fD8Cc71d12');
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

  const address = useAddress();
  const connect = useMetamask();

  const [account, setAccount] = useState(null);
   const { showToast } = useToast();

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await connect();
        setAccount(accounts[0]);
        showToast({ message: 'MetaMask wallet connected!', type: 'success' });
        
      } catch (error) {
        showToast({
          message: "Failed to connect wallet. Please try again.",
          type: 'error',
        });
      }
    } else {
      showToast({
        message: "Please install MetaMask to use this app.",
        type: 'error',
      });
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
				args: [
					address, // owner
					form.title, // title
					form.description, // description
					form.target,
					new Date(form.deadline).getTime(), // deadline,
					form.image,
				],
			});
      showToast({
        message: "Campaign created successfully!",
        type: 'success',
      });
    } catch (error) {
      showToast({
        message: "Failed to create campaign. Please try again.",
        type: 'error',
      });
    }
  }

  const getCampaigns = async () => {
    try {
      const campaigns = await contract.call('getCampaigns');

      const parsedCampaigns = campaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
        image: campaign.image,
        pId: i,
      }));

      return parsedCampaigns;
    } catch (error) {
      showToast({ message: 'Failed to fetch campaigns.', type: 'error' });
      console.error(error);
      return [];
    }
  };

  const getUserCampaigns = async () => {
    try {
      const allCampaigns = await getCampaigns();
      const filteredCampaigns = allCampaigns.filter(campaign => campaign.owner === address);
      return filteredCampaigns;
    } catch (error) {
      showToast({ message: 'Failed to fetch user campaigns.', type: 'error' });
      console.error(error);
      return [];
    }
  };

  const donate = async (pId, amount) => {
    try {
      const data = await contract.call('donateToCampaign', [pId], {
        value: ethers.utils.parseEther(amount),
      });
      showToast({ message: 'Donation successful!', type: 'success' });
      return data;
    } catch (error) {
      showToast({ message: 'Donation failed.', type: 'error' });
      console.error(error);
      return null;
    }
  };

  const getDonations = async (pId) => {
    try {
      const donations = await contract.call('getDonators', [pId]);
      const numberOfDonations = donations[0].length;

      const parsedDonations = [];

      for (let i = 0; i < numberOfDonations; i++) {
        parsedDonations.push({
          donator: donations[0][i],
          donation: ethers.utils.formatEther(donations[1][i].toString()),
        });
      }

      return parsedDonations;
    } catch (error) {
      showToast({ message: 'Failed to fetch donations.', type: 'error' });
      console.error(error);
      return [];
    }
  };

  const searchCampaigns = (campaigns, searchTerm) => {
    if (!searchTerm.trim()) return campaigns;

    const lowercased = searchTerm.toLowerCase();

    return campaigns.filter((campaign) =>
      campaign.title.toLowerCase().includes(lowercased) ||
      campaign.description.toLowerCase().includes(lowercased)
    );
};



  return (
    <StateContext.Provider
      value={{ 
        address,
        contract,
        connectWallet,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        isWalletConnected: !!account,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);