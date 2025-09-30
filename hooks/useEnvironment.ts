'use client';

import { useState, useCallback } from 'react';
import { clientApi } from '../lib/clientApi';
import { DatabaseEnvironment } from '../lib/database';

export const useEnvironment = () => {
  const [environment, setEnvironment] = useState<DatabaseEnvironment>('main');

  // Switch environment
  const switchEnvironment = useCallback((newEnvironment: DatabaseEnvironment) => {
    setEnvironment(newEnvironment);
    clientApi.setEnvironment(newEnvironment);
  }, []);

  // Toggle between main and testnet
  const toggleEnvironment = useCallback(() => {
    const newEnvironment = environment === 'main' ? 'testnet' : 'main';
    switchEnvironment(newEnvironment);
  }, [environment, switchEnvironment]);

  // Check if current environment is testnet
  const isTestnet = environment === 'testnet';

  // Check if current environment is main
  const isMain = environment === 'main';

  return {
    environment,
    setEnvironment: switchEnvironment,
    toggleEnvironment,
    isTestnet,
    isMain,
    clientApi,
  };
}; 