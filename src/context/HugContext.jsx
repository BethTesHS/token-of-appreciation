import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const HugContext = createContext();

export const HugProvider = ({ children }) => {
  const [tokens, setTokens] = useState(0);
  const [requests, setRequests] = useState([]);
  const [history, setHistory] = useState([]);

  // 1. Fetch Initial Data
  useEffect(() => {
    const fetchData = async () => {
      // Get tokens
      const { data: walletData } = await supabase
        .from('token_wallet')
        .select('tokens')
        .eq('id', 1)
        .single();
      if (walletData) setTokens(walletData.tokens);

      // Get pending requests
      const { data: pendingData } = await supabase
        .from('hugs')
        .select('*')
        .eq('status', 'pending')
        .order('requested_at', { ascending: false });
      if (pendingData) setRequests(pendingData);

      // Get history (accepted hugs)
      const { data: historyData } = await supabase
        .from('hugs')
        .select('*')
        .eq('status', 'accepted')
        .order('accepted_at', { ascending: true });
      if (historyData) setHistory(historyData);
    };

    fetchData();

    // 2. Set up Real-time Subscriptions
    const channel = supabase.channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'hugs' },
        (payload) => {
          // Re-fetch hugs on any change to keep it simple and in-sync
          fetchData(); 
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'token_wallet' },
        (payload) => {
          setTokens(payload.new.tokens);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 3. App Actions (Writing to Supabase)
  const requestHug = async () => {
    if (tokens > 0) {
      // Deduct token
      await supabase
        .from('token_wallet')
        .update({ tokens: tokens - 1 })
        .eq('id', 1);

      // Insert new request
      await supabase
        .from('hugs')
        .insert([{ status: 'pending' }]);
    }
  };

  const acceptHug = async (id) => {
    await supabase
      .from('hugs')
      .update({ 
        status: 'accepted', 
        accepted_at: new Date().toISOString() 
      })
      .eq('id', id);
  };

  const refreshTokens = async () => {
    await supabase
      .from('token_wallet')
      .update({ tokens: 7 })
      .eq('id', 1);
  };

  return (
    <HugContext.Provider value={{ tokens, requests, history, requestHug, acceptHug, refreshTokens }}>
      {children}
    </HugContext.Provider>
  );
};