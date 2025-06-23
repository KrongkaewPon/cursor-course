import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';

export interface ApiKey {
  id: string;
  name: string;
  usage: number;
  api_key: string;
  limit?: number;
  created_at: string;
}

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApiKeys();
    // eslint-disable-next-line
  }, []);

  const fetchApiKeys = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setError(error.message);
    } else if (data) {
      setApiKeys(data);
    }
    setLoading(false);
  };

  const createApiKey = async (name: string, limit?: number) => {
    const realKeyPart = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);
    const fullKey = `tvly-${realKeyPart}`;
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        name,
        api_key: fullKey,
        limit: limit ?? null,
      })
      .select()
      .single();
    if (error) {
      setError(error.message);
      return null;
    } else if (data) {
      setApiKeys(prev => [data, ...prev]);
      return data;
    }
    return null;
  };

  const updateApiKey = async (id: string, name: string, limit?: number) => {
    const { data, error } = await supabase
      .from('api_keys')
      .update({ name, limit: limit ?? null })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      setError(error.message);
      return null;
    } else if (data) {
      setApiKeys(keys => keys.map(k => (k.id === id ? data : k)));
      return data;
    }
    return null;
  };

  const deleteApiKey = async (id: string) => {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);
    if (error) {
      setError(error.message);
      return false;
    } else {
      setApiKeys(keys => keys.filter(k => k.id !== id));
      return true;
    }
  };

  return {
    apiKeys,
    loading,
    error,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    setApiKeys, // for advanced use
  };
} 