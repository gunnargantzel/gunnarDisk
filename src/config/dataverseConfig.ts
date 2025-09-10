// Dataverse konfigurasjon
export const DATAVERSE_CONFIG = {
  // Din Dataverse-organisasjon URL
  environmentUrl: 'https://org5ce5b264.crm4.dynamics.com',
  
  // API versjon
  apiVersion: 'v9.2',
  
  // Tabell konfigurasjon
  tableConfig: {
    logicalName: 'cr597_disktabs',
    primaryIdField: 'cr597_disktabid',
    primaryNameField: 'cr597_id',
    displayName: 'DiskTab'
  },
  
  // Felter som skal brukes
  fields: {
    id: 'cr597_disktabid',
    name: 'cr597_id', // Primary name field
    holes: 'cr597_holes', // Antall kurver - må sjekkes mot faktisk tabell
    description: 'cr597_description', // Beskrivelse - må sjekkes mot faktisk tabell
    location: 'cr597_location', // Lokasjon - må sjekkes mot faktisk tabell
    createdOn: 'createdon',
    modifiedOn: 'modifiedon'
  }
};

// API endpoints
export const API_ENDPOINTS = {
  baseUrl: `${DATAVERSE_CONFIG.environmentUrl}/api/data/${DATAVERSE_CONFIG.apiVersion}`,
  tableUrl: `${DATAVERSE_CONFIG.environmentUrl}/api/data/${DATAVERSE_CONFIG.apiVersion}/${DATAVERSE_CONFIG.tableConfig.logicalName}`
};
