import { IPublicClientApplication } from '@azure/msal-browser';
import { DATAVERSE_CONFIG, API_ENDPOINTS } from '../config/dataverseConfig';
import { dataverseScopes } from '../authConfig';

export interface DiskTabRecord {
  cr597_disktabid?: string;
  cr597_banenavn: string;
  cr597_antallkurver: number;
  cr597_beskrivelse?: string;
  cr597_lokasjon?: string;
  createdon?: string;
  modifiedon?: string;
}

export interface CreateDiskTabRequest {
  cr597_banenavn: string;
  cr597_antallkurver: number;
  cr597_beskrivelse?: string;
  cr597_lokasjon?: string;
}

export interface UpdateDiskTabRequest {
  cr597_banenavn?: string;
  cr597_antallkurver?: number;
  cr597_beskrivelse?: string;
  cr597_lokasjon?: string;
}

class DataverseService {
  private msalInstance: IPublicClientApplication;

  constructor(msalInstance: IPublicClientApplication) {
    this.msalInstance = msalInstance;
  }

  private async getAccessToken(): Promise<string> {
    const accounts = this.msalInstance.getAllAccounts();
    if (accounts.length === 0) {
      throw new Error('No accounts found. Please login first.');
    }

    const silentRequest = {
      scopes: dataverseScopes,
      account: accounts[0]
    };

    try {
      const response = await this.msalInstance.acquireTokenSilent(silentRequest);
      return response.accessToken;
    } catch (error) {
      // Hvis silent token acquisition feiler, prøv popup
      const popupRequest = {
        scopes: dataverseScopes,
        prompt: 'select_account'
      };
      
      const response = await this.msalInstance.acquireTokenPopup(popupRequest);
      return response.accessToken;
    }
  }

  private async makeRequest(url: string, options: RequestInit = {}): Promise<any> {
    const token = await this.getAccessToken();
    
    const defaultHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'OData-MaxVersion': '4.0',
      'OData-Version': '4.0'
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Dataverse API error: ${response.status} - ${errorText}`);
    }

    if (response.status === 204) {
      return null; // No content for DELETE operations
    }

    return await response.json();
  }

  // CREATE - Opprett ny diskgolfbane
  async createDiskTab(data: CreateDiskTabRequest): Promise<DiskTabRecord> {
    const url = API_ENDPOINTS.tableUrl;
    
    const payload = {
      [DATAVERSE_CONFIG.fields.name]: data.cr597_banenavn,
      [DATAVERSE_CONFIG.fields.holes]: data.cr597_antallkurver,
      [DATAVERSE_CONFIG.fields.description]: data.cr597_beskrivelse || '',
      [DATAVERSE_CONFIG.fields.location]: data.cr597_lokasjon || ''
    };

    const response = await this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    return response;
  }

  // READ - Hent alle diskgolfbaner
  async getAllDiskTabs(): Promise<DiskTabRecord[]> {
    const url = `${API_ENDPOINTS.tableUrl}?$select=${Object.values(DATAVERSE_CONFIG.fields).join(',')}&$orderby=${DATAVERSE_CONFIG.fields.name} asc`;
    
    const response = await this.makeRequest(url);
    return response.value || [];
  }

  // READ - Hent spesifikk diskgolfbane
  async getDiskTabById(id: string): Promise<DiskTabRecord> {
    const url = `${API_ENDPOINTS.tableUrl}(${id})?$select=${Object.values(DATAVERSE_CONFIG.fields).join(',')}`;
    
    const response = await this.makeRequest(url);
    return response;
  }

  // UPDATE - Oppdater diskgolfbane
  async updateDiskTab(id: string, data: UpdateDiskTabRequest): Promise<void> {
    const url = `${API_ENDPOINTS.tableUrl}(${id})`;
    
    const payload: any = {};
    if (data.cr597_banenavn !== undefined) payload[DATAVERSE_CONFIG.fields.name] = data.cr597_banenavn;
    if (data.cr597_antallkurver !== undefined) payload[DATAVERSE_CONFIG.fields.holes] = data.cr597_antallkurver;
    if (data.cr597_beskrivelse !== undefined) payload[DATAVERSE_CONFIG.fields.description] = data.cr597_beskrivelse;
    if (data.cr597_lokasjon !== undefined) payload[DATAVERSE_CONFIG.fields.location] = data.cr597_lokasjon;

    await this.makeRequest(url, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  }

  // DELETE - Slett diskgolfbane
  async deleteDiskTab(id: string): Promise<void> {
    const url = `${API_ENDPOINTS.tableUrl}(${id})`;
    
    await this.makeRequest(url, {
      method: 'DELETE'
    });
  }

  // SEARCH - Søk etter diskgolfbaner
  async searchDiskTabs(searchTerm: string): Promise<DiskTabRecord[]> {
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const url = `${API_ENDPOINTS.tableUrl}?$filter=contains(${DATAVERSE_CONFIG.fields.name},'${encodedSearchTerm}')&$select=${Object.values(DATAVERSE_CONFIG.fields).join(',')}&$orderby=${DATAVERSE_CONFIG.fields.name} asc`;
    
    const response = await this.makeRequest(url);
    return response.value || [];
  }
}

export default DataverseService;
