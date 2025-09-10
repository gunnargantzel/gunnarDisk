import { useState, useCallback } from 'react';
import { useMsal } from '@azure/msal-react';
import DataverseService, { DiskTabRecord, CreateDiskTabRequest, UpdateDiskTabRequest } from '../services/dataverseService';

export const useDataverse = () => {
  const { instance } = useMsal();
  const [service] = useState(() => new DataverseService(instance));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: any) => {
    console.error('Dataverse error:', err);
    setError(err.message || 'En feil oppstod');
    setLoading(false);
  };

  const clearError = () => setError(null);

  // CREATE - Opprett ny diskgolfbane
  const createDiskTab = useCallback(async (data: CreateDiskTabRequest): Promise<DiskTabRecord | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await service.createDiskTab(data);
      setLoading(false);
      return result;
    } catch (err) {
      handleError(err);
      return null;
    }
  }, [service]);

  // READ - Hent alle diskgolfbaner
  const getAllDiskTabs = useCallback(async (): Promise<DiskTabRecord[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await service.getAllDiskTabs();
      setLoading(false);
      return result;
    } catch (err) {
      handleError(err);
      return [];
    }
  }, [service]);

  // READ - Hent spesifikk diskgolfbane
  const getDiskTabById = useCallback(async (id: string): Promise<DiskTabRecord | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await service.getDiskTabById(id);
      setLoading(false);
      return result;
    } catch (err) {
      handleError(err);
      return null;
    }
  }, [service]);

  // UPDATE - Oppdater diskgolfbane
  const updateDiskTab = useCallback(async (id: string, data: UpdateDiskTabRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await service.updateDiskTab(id, data);
      setLoading(false);
      return true;
    } catch (err) {
      handleError(err);
      return false;
    }
  }, [service]);

  // DELETE - Slett diskgolfbane
  const deleteDiskTab = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await service.deleteDiskTab(id);
      setLoading(false);
      return true;
    } catch (err) {
      handleError(err);
      return false;
    }
  }, [service]);

  // SEARCH - Søk etter diskgolfbaner
  const searchDiskTabs = useCallback(async (searchTerm: string): Promise<DiskTabRecord[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await service.searchDiskTabs(searchTerm);
      setLoading(false);
      return result;
    } catch (err) {
      handleError(err);
      return [];
    }
  }, [service]);

  return {
    // CRUD operations
    createDiskTab,
    getAllDiskTabs,
    getDiskTabById,
    updateDiskTab,
    deleteDiskTab,
    searchDiskTabs,
    
    // State
    loading,
    error,
    clearError
  };
};
