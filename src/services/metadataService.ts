import { IPublicClientApplication } from '@azure/msal-browser';
import { DATAVERSE_CONFIG } from '../config/dataverseConfig';

class MetadataService {
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
      scopes: [`${DATAVERSE_CONFIG.environmentUrl}/.default`],
      account: accounts[0]
    };

    try {
      const response = await this.msalInstance.acquireTokenSilent(silentRequest);
      return response.accessToken;
    } catch (error) {
      const popupRequest = {
        scopes: [`${DATAVERSE_CONFIG.environmentUrl}/.default`],
        prompt: 'select_account'
      };
      
      const response = await this.msalInstance.acquireTokenPopup(popupRequest);
      return response.accessToken;
    }
  }

  // Hent metadata for tabellen
  async getTableMetadata(): Promise<any> {
    const token = await this.getAccessToken();
    const url = `${DATAVERSE_CONFIG.environmentUrl}/api/data/${DATAVERSE_CONFIG.apiVersion}/EntityDefinitions(LogicalName='${DATAVERSE_CONFIG.tableConfig.logicalName}')?$expand=Attributes`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'OData-MaxVersion': '4.0',
        'OData-Version': '4.0'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Metadata API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  // Hent alle tilgjengelige felter for tabellen
  async getAvailableFields(): Promise<string[]> {
    try {
      const metadata = await this.getTableMetadata();
      const attributes = metadata.Attributes || [];
      
      return attributes.map((attr: any) => attr.LogicalName).filter((name: string) => 
        name.startsWith('cr597_') || 
        ['createdon', 'modifiedon', 'createdby', 'modifiedby'].includes(name)
      );
    } catch (error) {
      console.error('Error fetching metadata:', error);
      return [];
    }
  }
}

export default MetadataService;
