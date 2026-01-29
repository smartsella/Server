import React, { createContext, useContext, useState, useEffect } from 'react';

const PartnerContext = createContext();

export const usePartner = () => {
  const context = useContext(PartnerContext);
  if (!context) {
    throw new Error('usePartner must be used within a PartnerProvider');
  }
  return context;
};

export const PartnerProvider = ({ children }) => {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check sessionStorage for existing session
    const storedPartner = sessionStorage.getItem('partner_session');
    if (storedPartner) {
      try {
        setPartner(JSON.parse(storedPartner));
      } catch (error) {
        console.error("Failed to parse partner session", error);
        sessionStorage.removeItem('partner_session');
      }
    }
    setLoading(false);
  }, []);

  const login = (partnerData) => {
    setPartner(partnerData);
    sessionStorage.setItem('partner_session', JSON.stringify(partnerData));
  };

  const logout = () => {
    setPartner(null);
    sessionStorage.removeItem('partner_session');
  };

  const register = (registrationData) => {
    // Initialize properties array with the first property being registered
    const newPartner = {
      ...registrationData,
      id: Date.now(),
      joinedAt: new Date().toISOString(),
      properties: [registrationData] // Start tracking properties list
    };
    login(newPartner);
  };

  const addProperty = (propertyData) => {
    if (!partner) return;

    // Create a new property object
    const newProperty = {
      ...propertyData,
      id: Date.now()
    };

    // If properties array exists, append. Else create it from current partner state (legacy support)
    const updatedPartner = {
      ...partner,
      properties: [...(partner.properties || [partner]), newProperty]
    };

    login(updatedPartner);
  };

  return (
    <PartnerContext.Provider value={{ partner, login, logout, register, addProperty, loading }}>
      {children}
    </PartnerContext.Provider>
  );
};

export default PartnerProvider;