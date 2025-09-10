# 📚 API-dokumentasjon - Diskgolf PWA

Dette dokumentet beskriver alle API-endepunkter og datastrukturer som brukes i Diskgolf PWA.

## 🔗 Base URL

```
https://org5ce5b264.crm4.dynamics.com/api/data/v9.2
```

## 🔐 Autentisering

Alle API-kall krever en gyldig Bearer token fra Microsoft Entra ID.

### Headers

```http
Authorization: Bearer {access_token}
Content-Type: application/json
Accept: application/json
OData-MaxVersion: 4.0
OData-Version: 4.0
```

## 📊 Dataverse-entiteter

### DiskTab Entity

**Logical Name**: `cr597_disktab`  
**Display Name**: `DiskTab`  
**Primary Key**: `cr597_disktabid`

#### Feltbeskrivelse

| Feltnavn | Type | Beskrivelse | Påkrevd |
|----------|------|-------------|---------|
| `cr597_disktabid` | GUID | Primærnøkkel | ✅ |
| `cr597_banenavn` | Text | Navn på disc golf-bane | ✅ |
| `cr597_antallkurver` | Number | Antall kurver på banen | ✅ |
| `cr597_beskrivelse` | Text | Beskrivelse av banen | ❌ |
| `cr597_lokasjon` | Text | Lokasjon/sted for banen | ❌ |
| `createdon` | DateTime | Opprettelsesdato | ❌ |
| `modifiedon` | DateTime | Sist endret | ❌ |

## 🚀 API-endepunkter

### 1. Hent alle baner

**GET** `/cr597_disktabs`

Henter alle registrerte disc golf-baner.

#### Query Parameters

| Parameter | Type | Beskrivelse | Eksempel |
|-----------|------|-------------|----------|
| `$select` | String | Velg spesifikke felt | `cr597_banenavn,cr597_antallkurver` |
| `$filter` | String | Filtrer resultater | `cr597_antallkurver gt 9` |
| `$orderby` | String | Sorter resultater | `cr597_banenavn asc` |
| `$top` | Number | Begrens antall resultater | `10` |
| `$skip` | Number | Hopp over resultater | `20` |

#### Eksempel Request

```http
GET /api/data/v9.2/cr597_disktabs?$select=cr597_banenavn,cr597_antallkurver,cr597_lokasjon&$orderby=cr597_banenavn asc
Authorization: Bearer {token}
```

#### Eksempel Response

```json
{
  "@odata.context": "https://org5ce5b264.crm4.dynamics.com/api/data/v9.2/$metadata#cr597_disktabs",
  "value": [
    {
      "@odata.etag": "W/\"1234567890\"",
      "cr597_disktabid": "12345678-1234-1234-1234-123456789012",
      "cr597_banenavn": "Oslo Disc Golf Park",
      "cr597_antallkurver": 18,
      "cr597_lokasjon": "Oslo, Norge",
      "createdon": "2024-01-15T10:30:00Z"
    },
    {
      "@odata.etag": "W/\"0987654321\"",
      "cr597_disktabid": "87654321-4321-4321-4321-210987654321",
      "cr597_banenavn": "Bergen Disc Golf",
      "cr597_antallkurver": 12,
      "cr597_lokasjon": "Bergen, Norge",
      "createdon": "2024-01-16T14:20:00Z"
    }
  ]
}
```

### 2. Hent spesifikk bane

**GET** `/cr597_disktabs({id})`

Henter en spesifikk disc golf-bane basert på ID.

#### Path Parameters

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `id` | GUID | DiskTab-entitetens primærnøkkel |

#### Eksempel Request

```http
GET /api/data/v9.2/cr597_disktabs(12345678-1234-1234-1234-123456789012)
Authorization: Bearer {token}
```

#### Eksempel Response

```json
{
  "@odata.context": "https://org5ce5b264.crm4.dynamics.com/api/data/v9.2/$metadata#cr597_disktabs/$entity",
  "@odata.etag": "W/\"1234567890\"",
  "cr597_disktabid": "12345678-1234-1234-1234-123456789012",
  "cr597_banenavn": "Oslo Disc Golf Park",
  "cr597_antallkurver": 18,
  "cr597_beskrivelse": "En flott 18-hulls disc golf-bane i hjertet av Oslo",
  "cr597_lokasjon": "Oslo, Norge",
  "createdon": "2024-01-15T10:30:00Z",
  "modifiedon": "2024-01-15T10:30:00Z"
}
```

### 3. Opprett ny bane

**POST** `/cr597_disktabs`

Oppretter en ny disc golf-bane.

#### Request Body

```json
{
  "cr597_banenavn": "Trondheim Disc Golf",
  "cr597_antallkurver": 15,
  "cr597_beskrivelse": "En utfordrende bane med varierende terreng",
  "cr597_lokasjon": "Trondheim, Norge"
}
```

#### Eksempel Request

```http
POST /api/data/v9.2/cr597_disktabs
Authorization: Bearer {token}
Content-Type: application/json

{
  "cr597_banenavn": "Trondheim Disc Golf",
  "cr597_antallkurver": 15,
  "cr597_beskrivelse": "En utfordrende bane med varierende terreng",
  "cr597_lokasjon": "Trondheim, Norge"
}
```

#### Eksempel Response

```json
{
  "@odata.context": "https://org5ce5b264.crm4.dynamics.com/api/data/v9.2/$metadata#cr597_disktabs/$entity",
  "@odata.etag": "W/\"9876543210\"",
  "cr597_disktabid": "11111111-2222-3333-4444-555555555555",
  "cr597_banenavn": "Trondheim Disc Golf",
  "cr597_antallkurver": 15,
  "cr597_beskrivelse": "En utfordrende bane med varierende terreng",
  "cr597_lokasjon": "Trondheim, Norge",
  "createdon": "2024-01-17T09:15:00Z",
  "modifiedon": "2024-01-17T09:15:00Z"
}
```

### 4. Oppdater bane

**PATCH** `/cr597_disktabs({id})`

Oppdaterer en eksisterende disc golf-bane.

#### Path Parameters

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `id` | GUID | DiskTab-entitetens primærnøkkel |

#### Request Body

```json
{
  "cr597_banenavn": "Trondheim Disc Golf - Oppdatert",
  "cr597_antallkurver": 18,
  "cr597_beskrivelse": "En utfordrende bane med varierende terreng og nye kurver"
}
```

#### Eksempel Request

```http
PATCH /api/data/v9.2/cr597_disktabs(11111111-2222-3333-4444-555555555555)
Authorization: Bearer {token}
Content-Type: application/json
If-Match: W/"9876543210"

{
  "cr597_banenavn": "Trondheim Disc Golf - Oppdatert",
  "cr597_antallkurver": 18,
  "cr597_beskrivelse": "En utfordrende bane med varierende terreng og nye kurver"
}
```

#### Eksempel Response

```json
{
  "@odata.context": "https://org5ce5b264.crm4.dynamics.com/api/data/v9.2/$metadata#cr597_disktabs/$entity",
  "@odata.etag": "W/\"1234567890\"",
  "cr597_disktabid": "11111111-2222-3333-4444-555555555555",
  "cr597_banenavn": "Trondheim Disc Golf - Oppdatert",
  "cr597_antallkurver": 18,
  "cr597_beskrivelse": "En utfordrende bane med varierende terreng og nye kurver",
  "cr597_lokasjon": "Trondheim, Norge",
  "createdon": "2024-01-17T09:15:00Z",
  "modifiedon": "2024-01-17T10:30:00Z"
}
```

### 5. Slett bane

**DELETE** `/cr597_disktabs({id})`

Sletter en disc golf-bane.

#### Path Parameters

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `id` | GUID | DiskTab-entitetens primærnøkkel |

#### Eksempel Request

```http
DELETE /api/data/v9.2/cr597_disktabs(11111111-2222-3333-4444-555555555555)
Authorization: Bearer {token}
If-Match: W/"1234567890"
```

#### Eksempel Response

```http
HTTP/1.1 204 No Content
```

## 🔍 Søk og filtrering

### Filtreringsoperatører

| Operatør | Beskrivelse | Eksempel |
|----------|-------------|----------|
| `eq` | Lik | `cr597_antallkurver eq 18` |
| `ne` | Ikke lik | `cr597_antallkurver ne 9` |
| `gt` | Større enn | `cr597_antallkurver gt 15` |
| `ge` | Større enn eller lik | `cr597_antallkurver ge 18` |
| `lt` | Mindre enn | `cr597_antallkurver lt 20` |
| `le` | Mindre enn eller lik | `cr597_antallkurver le 18` |
| `contains` | Inneholder | `contains(cr597_banenavn,'Oslo')` |
| `startswith` | Starter med | `startswith(cr597_banenavn,'Bergen')` |
| `endswith` | Slutter med | `endswith(cr597_banenavn,'Park')` |

### Søkeeksempler

#### Søk etter baner med mer enn 15 kurver

```http
GET /api/data/v9.2/cr597_disktabs?$filter=cr597_antallkurver gt 15
```

#### Søk etter baner som inneholder "Oslo"

```http
GET /api/data/v9.2/cr597_disktabs?$filter=contains(cr597_banenavn,'Oslo')
```

#### Kombinert søk

```http
GET /api/data/v9.2/cr597_disktabs?$filter=cr597_antallkurver ge 12 and contains(cr597_lokasjon,'Norge')
```

#### Sortering

```http
GET /api/data/v9.2/cr597_disktabs?$orderby=cr597_banenavn asc,cr597_antallkurver desc
```

## ❌ Feilhåndtering

### HTTP Status Codes

| Kode | Beskrivelse | Løsning |
|------|-------------|----------|
| `200` | OK | Forespørsel vellykket |
| `201` | Created | Ressurs opprettet |
| `204` | No Content | Ressurs slettet |
| `400` | Bad Request | Ugyldig forespørsel |
| `401` | Unauthorized | Manglende eller ugyldig token |
| `403` | Forbidden | Ingen tilgang til ressurs |
| `404` | Not Found | Ressurs ikke funnet |
| `409` | Conflict | Konflikt (f.eks. optimistic concurrency) |
| `500` | Internal Server Error | Serverfeil |

### Feilmeldinger

#### 400 Bad Request

```json
{
  "error": {
    "code": "0x80040265",
    "message": "Invalid property 'cr597_invalid_field' was found in the request.",
    "innererror": {
      "message": "Invalid property 'cr597_invalid_field' was found in the request.",
      "type": "Microsoft.OData.ODataException",
      "stacktrace": "..."
    }
  }
}
```

#### 401 Unauthorized

```json
{
  "error": {
    "code": "0x80040217",
    "message": "Authentication failed.",
    "innererror": {
      "message": "Authentication failed.",
      "type": "Microsoft.Crm.CrmException",
      "stacktrace": "..."
    }
  }
}
```

#### 409 Conflict (Optimistic Concurrency)

```json
{
  "error": {
    "code": "0x80040265",
    "message": "The version of the existing record doesn't match the RowVersion property provided in the request.",
    "innererror": {
      "message": "The version of the existing record doesn't match the RowVersion property provided in the request.",
      "type": "Microsoft.Crm.CrmException",
      "stacktrace": "..."
    }
  }
}
```

## 🔄 Paginering

### Hent flere sider

```http
# Første side
GET /api/data/v9.2/cr597_disktabs?$top=10&$skip=0

# Andre side
GET /api/data/v9.2/cr597_disktabs?$top=10&$skip=10

# Tredje side
GET /api/data/v9.2/cr597_disktabs?$top=10&$skip=20
```

### Bruk av @odata.nextLink

```json
{
  "@odata.context": "https://org5ce5b264.crm4.dynamics.com/api/data/v9.2/$metadata#cr597_disktabs",
  "@odata.nextLink": "https://org5ce5b264.crm4.dynamics.com/api/data/v9.2/cr597_disktabs?$skip=10",
  "value": [
    // ... første 10 resultater
  ]
}
```

## 📊 Metadata

### Hent entitetsmetadata

```http
GET /api/data/v9.2/$metadata#EntityDefinitions('cr597_disktab')
```

### Hent feltmetadata

```http
GET /api/data/v9.2/$metadata#EntityDefinitions('cr597_disktab')/Properties
```

## 🧪 Testing

### Test-endepunkter

For testing kan du bruke følgende endepunkter:

```bash
# Test autentisering
curl -H "Authorization: Bearer {token}" \
     https://org5ce5b264.crm4.dynamics.com/api/data/v9.2/cr597_disktabs

# Test opprettelse
curl -X POST \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{"cr597_banenavn":"Test Bane","cr597_antallkurver":9}' \
     https://org5ce5b264.crm4.dynamics.com/api/data/v9.2/cr597_disktabs
```

### Postman Collection

En Postman-kolleksjon kan eksporteres med følgende konfigurasjon:

```json
{
  "info": {
    "name": "Diskgolf PWA API",
    "description": "API for Disc Golf Course Registration"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://org5ce5b264.crm4.dynamics.com/api/data/v9.2"
    },
    {
      "key": "token",
      "value": "{{access_token}}"
    }
  ]
}
```

---

**Denne API-dokumentasjonen oppdateres ved endringer i Dataverse-skjemaet.** 🔄
