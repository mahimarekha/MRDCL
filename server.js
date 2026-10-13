/* MRDCL Household Survey 
ortal — dependency-free Node.js server. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const { DatabaseSync } = require('node:sqlite');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 5890);
const DATASET = path.join(ROOT, 'data', 'households.geojson');
const MAP_LAYERS = path.join(ROOT, 'data', 'map-layers.json');
const BIFURCATED_LAYER = path.join(ROOT, 'data', 'bifurcated-buildings.geojson');
const DB_FILE = path.join(ROOT, 'database', 'mrdcl-surveys.db');
const UPLOAD_DIR = path.join(ROOT, 'data', 'uploads');
const LIBRARY_DIR = path.join(ROOT, 'data', 'library');
const UPDATED_QUESTIONNAIRE = path.resolve(ROOT, '..', 'updated questionnaire.docx');
const MAX_LIBRARY_FILE_BYTES = 8_000_000;
const MAX_PHOTO_BYTES = 15_000_000;
const LIBRARY_EXTENSIONS = new Set(['xlsx', 'xls', 'csv', 'docx', 'doc', 'pdf', 'geojson', 'json', 'kml', 'gpkg', 'zip', 'shp', 'dbf', 'shx', 'xml']);
const EDITABLE_FIELDS = new Set([
  'BuildingID', 'BuiType', 'StructType', 'NameOwnRep', 'Contact', 'HNoPlotNo', 'TPIN',
  'ColnyStrtN', 'SyTsNo', 'WardBlockN', 'Use', 'Extent', 'PlinthArea', 'Classifica',
  'Caste', 'FinanDepen', 'HHSize', 'NoAdults', 'NoChild', 'Govtbenefi', 'Borewell',
  'Courtcase', 'NameStruct', 'ReliType', 'Remarks', 'CommStatus', 'Trees', 'Occupation',
  'SkilledOcc', 'Craftsmen', 'ReliStruct', 'Cremetoriu', 'Email', 'SurvyeorNa',
  'Survey_Dat', 'Survey_Loc', 'UUID', 'email_id', 'Mandals', 'Zone', 'Income', 'Dist',
  'PCs', 'Assembly_C', 'S_Fall', 'Zone_1', 'Affected_S', 'Zonewise', 'no_of_Floo',
  'assigned_team', 'survey_status', 'verification_status', 'verification_date', 'field_notes', 'follow_up_date'
]);
function isEditableField(key) { return EDITABLE_FIELDS.has(key) || /^q_[a-z0-9_]{2,90}$/.test(key) || key === 'household_members' || key === 'occupier_members'; }
// The questionnaire is deliberately schema-driven.  Answers continue to live
// in each household's survey JSON (and baseline GIS attributes remain
// untouched); this table only decides which questions are shown in the form.
// Retiring a question hides it without deleting any answers already captured.
const QUESTIONNAIRE_SEED = [
  // Tab 1 — Primary observation
  ['q_location_ward','tab1','Survey information and location details','Name of location / ward','text'],
  ['q_district','tab1','Survey information and location details','District','select',['Rangareddy','Hyderabad','Medchal–Malkajgiri','Nalgonda','Other']],
  ['q_plot_no','tab1','Survey information and location details','Plot number','text'],
  ['q_survey_no','tab1','Survey information and location details','Survey number','text'],
  ['q_respondent_mobile','tab1','Survey information and location details','Respondent mobile number','tel'],
  ['q_land_ownership','tab1','Land ownership and tenure','Land ownership','select',['Private','Government','Religious institution']],
  ['q_ownership_status','tab1','Land ownership and tenure','Ownership status','select',['Titleholder','Customary right','License holder','Encroacher','Squatter','Other']],
  ['q_structure_legal_status','tab1','Land ownership and tenure','Legal status of structure','select',['Legal','Customary','Encroacher','Squatter','Other']],
  ['q_private_ownership','tab1','Land ownership and tenure','Type of ownership','select',['Individual','Joint','Other']],
  ['q_land_type','tab1','Land ownership and tenure','Type of land','select',['Barren','Residential','Commercial','Mixed use','Orchard (Fruit yard)','Recreational (Parks etc.)','Other']],
  ['q_structure_affected','tab1','Structures and assets','Is any structure affected?','select',['Yes','No']],
  ['q_structure_affected_date','tab1','Structures and assets','Date structure was affected','date'],
  ['q_structure_impact_scale','tab1','Structures and assets','Scale of impact','text'],
  ['q_structure_viability','tab1','Structures and assets','Viability of remaining structure','text'],
  ['q_structure_stories','tab1','Structures and assets','Number of storeys','select',['1','2','3','4','5']],
  ['q_construction_type','tab1','Structures and assets','Construction type','select',['Temporary - mud / brick / wood walls, thatched / tin roof','Semi-Permanent - tiled roof and normal cement floor','Permanent - RCC, single / double storey building']],
  ['q_structure_use','tab1','Structures and assets','Use of structure','select',['House','Hut','Other residential structure','Shops','Hotel','Small Eatery','Kiosk','Farm House','Petrol Pump','Clinic','STD Booth','Workshop','Vendors','Commercial Complex','Industry','Private Office','Other Commercial Structure','Residential-cum-Commercial Structure','Community Center','Club','Trust','Memorials','Other Community Structure','Temple','Church','Mosque','Gurudwara','Shrines','Sacred Grove','Mazaar / Dargah','Burial ground','Other Religious Structure','Government Office','Hospital','School','College','Bus Stop','Other Government Structure','Boundary Wall','Foundation','Cattle Shed','Other Private Structure','Other']],
  ['q_business_profession','tab1','Structures and assets','Business / profession carried out','text'],
  ['q_tenant_in_structure','tab1','Structures and assets','Tenant living in structure','select',['Yes','No']],
  ['q_tenant_structure_names','tab1','Structures and assets','Tenant name(s)','textarea'],
  ['q_employee_commercial','tab1','Structures and assets','Employees in commercial structure','select',['Yes','No']],
  ['q_employee_commercial_names','tab1','Structures and assets','Commercial employee name(s)','textarea'],
  ['q_employee_residential','tab1','Structures and assets','Employees in residential structure','select',['Yes','No']],
  ['q_employee_residential_names','tab1','Structures and assets','Residential employee name(s)','textarea'],
  ['q_social_category','tab1','Household and livelihood','Social category','select',['SC','ST','BC','OC','Other']],
  ['q_religion','tab1','Household and livelihood','Religion','select',['Hindu','Muslim','Christian','Buddhist','Jain','Other']],
  ['q_family_size_male_female','tab1','Household and livelihood','Family size (male / female)','text'],
  ['q_adult_dependants','tab1','Household and livelihood','Unmarried male dependants','number'],
  ['q_unmarried_female_dependants','tab1','Household and livelihood','Unmarried female dependants','number'],
  ['q_divorcee_widow','tab1','Household and livelihood','Divorcee / widow in household','select',['Yes','No']],
  ['q_minor_orphan','tab1','Household and livelihood','Minor / orphan in household','select',['Yes','No']],
  ['q_household_income','tab1','Household and livelihood','Annual household income','number'],
  ['q_vulnerability_status','tab1','Household and livelihood','Vulnerability status','textarea'],
  ['q_station_safety_concern','tab1','Household and livelihood','Station safety / access concern','select',['Yes','No','Not sure']],
  ['q_alternate_land','tab1','Household and livelihood','Alternative land available','select',['Yes','No']],
  ['q_relocation_choice','tab1','Household and livelihood','Relocation preference','select',['Self-Relocation','Project Assisted Relocation']],
  ['q_land_compensation_preference','tab1','Household and livelihood','Land compensation preference','select',['Land for Land','Cash for Land','TDR for Land']],
  ['q_structure_compensation_preference','tab1','Household and livelihood','Structure compensation preference','select',['Structure for Structure','Cash for Structure','TDR for Structure']],
  ['q_livelihood_loss','tab1','Household and livelihood','Livelihood loss expected','select',['Yes','No']],
  ['q_livelihood_loss_nature','tab1','Household and livelihood','Nature of livelihood loss','select',['Temporary','Permanent']],
  ['q_income_support','tab1','Household and livelihood','Income restoration / support required','textarea'],
  ['q_access_concern','tab1','Household and livelihood','Access concern','select',['Yes','No','Not sure']],
  ['q_social_network_disruption','tab1','Household and livelihood','Social network disruption','select',['Yes','No','Not sure']],
  ['q_land_restrictions','tab1','Household and livelihood','Land restriction','select',['Yes','No']],
  ['q_land_restrictions_details','tab1','Household and livelihood','Land restriction details','textarea'],
  ['q_women_over_18','tab1','Women, assets and benefits','Women over 18 years','number'],
  ['q_financial_decisions','tab1','Women, assets and benefits','Women take financial decisions','select',['Yes','No','No Response']],
  ['q_social_decisions','tab1','Women, assets and benefits','Women take social decisions','select',['Yes','No','No Response']],
  ['q_women_owned_assets','tab1','Women, assets and benefits','Women-owned assets','select',['Yes','No']],
  ['q_women_owned_assets_other','tab1','Women, assets and benefits','Other women-owned assets','text'],
  ['q_women_bank_account','tab1','Women, assets and benefits','Women have bank account','select',['Yes','No']],
  ['q_shg_membership','tab1','Women, assets and benefits','SHG membership','select',['Yes','No']],
  ['q_relocation_effect_shg','tab1','Women, assets and benefits','Effect of relocation on SHG','textarea'],
  ['q_benefit_schemes','tab1','Women, assets and benefits','Eligible benefit schemes','textarea'],
  ['q_women_govt_benefit','tab1','Women, assets and benefits','Women receive government benefit','select',['Yes','No']],
  ['q_women_benefit_details','tab1','Women, assets and benefits','Government benefit details','textarea'],
  ['household_members','tab1','Family members','Family member details','textarea'],
  // Tab 2 — Secondary observation
  ['q_present_land_use','tab2','Land and measurements','Present land use','select',['Cultivation','Orchard','Residential','Commercial','Forestation','Barren / Others']],
  ['q_total_landholding_acres','tab2','Land and measurements','Total landholding','number'],
  ['q_total_affected_plot_acres','tab2','Land and measurements','Affected plot area (acres)','number'],
  ['q_affected_land_acres','tab2','Land and measurements','Affected land area (acres)','number'],
  ['q_land_rate','tab2','Land and measurements','Market land rate','number'],
  ['q_revenue_rate','tab2','Land and measurements','Revenue land rate','number'],
  ['q_main_structure_river_distance','tab2','Land and measurements','Distance between main structure and river','number'],
  ['q_boundary_wall_river_distance','tab2','Land and measurements','Distance between boundary wall and river (m)','number'],
  ['q_affected_structure_dimensions','tab2','Land and measurements','Affected structure dimensions','text'],
  ['q_affected_boundary_dimensions','tab2','Land and measurements','Affected boundary wall dimensions','text'],
  ['q_total_structure_area_sqm','tab2','Land and measurements','Total structure area','number'],
  ['q_cultural_assets_nearby','tab2','Cultural assets','Cultural assets nearby','select',['Yes','No','Not sure']],
  ['q_cultural_asset_type_distance','tab2','Cultural assets','Cultural asset type and distance','textarea'],
  // Tab 3 — Others
  ['q_fruit_trees','tab3','Trees and crops','Fruit trees / crops','textarea'],
  ['q_nonfruit_trees','tab3','Trees and crops','Non-fruit trees','textarea'],
  ['q_total_trees','tab3','Trees and crops','Total trees','number'],
  ['q_census_no','tab3','Supplementary occupier / tenant details','Census number','text'],
  ['q_occupier_owner','tab3','Supplementary occupier / tenant details','Occupier / tenant / owner','select',['Occupier','Tenant','Owner']],
  ['q_occupier_name','tab3','Supplementary occupier / tenant details','Name','text'],
  ['q_occupier_father','tab3','Supplementary occupier / tenant details','Father / spouse name','text'],
  ['q_occupier_status','tab3','Supplementary occupier / tenant details','Occupancy status','select',['Agricultural Labourer','Agricultural Tenant / Lessee','Sharecropper','Tenant in Structure','Employee / Wage Earner in Residential / Commercial Structure']],
  ['q_occupier_social_category','tab3','Supplementary occupier / tenant details','Social category','select',['SC','ST','BC','OC','Other']],
  ['q_occupier_religious_category','tab3','Supplementary occupier / tenant details','Religious category','select',['Hindu','Muslim','Christian','Buddhist','Jain','Other']],
  ['q_occupier_family_size','tab3','Supplementary occupier / tenant details','Family size','number'],
  ['q_occupier_vulnerability','tab3','Supplementary occupier / tenant details','Vulnerability','textarea'],
  ['q_occupier_income','tab3','Supplementary occupier / tenant details','Annual income','number'],
  ['q_occupier_income_restoration','tab3','Supplementary occupier / tenant details','Income restoration requirement','textarea'],
  ['occupier_members','tab3','Supplementary family members','Family member details','textarea']
];
// Questions marked "Mark only one option" in the approved Word questionnaire.
// Keeping this list explicit means future restarts update only these system fields
// and never alter administrator-created questions.
const WORD_SINGLE_CHOICE_FIELD_KEYS = new Set([
  'q_private_ownership', 'q_land_type', 'q_structure_stories', 'q_construction_type', 'q_structure_use', 'q_religion',
  'q_station_safety_concern', 'q_relocation_choice', 'q_land_compensation_preference', 'q_structure_compensation_preference',
  'q_livelihood_loss_nature', 'q_access_concern', 'q_social_network_disruption', 'q_financial_decisions', 'q_social_decisions',
  'q_present_land_use', 'q_cultural_assets_nearby', 'q_occupier_status', 'q_occupier_religious_category'
]);
const STATIC_DIR = path.join(ROOT, 'public');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json; charset=utf-8', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const db = new DatabaseSync(DB_FILE);
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;');
const ghmcZoneCache = new Map();
let ghmcZoneFeatures = null;
const realtimeClients = new Set();

function now() { return new Date().toISOString(); }
function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(JSON.stringify(body));
}
function text(res, status, body) { res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end(body); }
function download(res, filename, contentType, body) {
  const bytes = Buffer.isBuffer(body) ? body : Buffer.from(body, 'utf8');
  res.writeHead(200, { 'Content-Type': contentType, 'Content-Disposition': `attachment; filename="${filename}"`, 'Content-Length': bytes.length, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(bytes);
}
function parseJson(value, fallback = {}) { try { return JSON.parse(value); } catch { return fallback; } }
function alphabetizeOptions(options) {
  return [...new Set((Array.isArray(options) ? options : []).map(value => String(value).trim()).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right, 'en', { sensitivity:'base', numeric:true }));
}
// Keep earlier records readable while presenting one clear operational
// vocabulary everywhere in the portal. Values are normalised on the way out,
// so this migration never deletes a historic survey value.
function surveyStatus(value) {
  const raw = String(value || '').trim();
  return ({ 'Not started':'Pending', 'In progress':'Pending', Completed:'Surveyed', 'Flagged/Revisit':'Flagged / Revisit' }[raw] || raw || 'Pending');
}
function hash(password, salt = crypto.randomBytes(16).toString('hex')) {
  return { salt, value: crypto.scryptSync(password, salt, 64).toString('hex') };
}
function secureEqual(left, right) {
  const a = Buffer.from(left || ''); const b = Buffer.from(right || '');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function parseCookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').filter(Boolean).map(item => {
    const point = item.indexOf('='); return [item.slice(0, point).trim(), decodeURIComponent(item.slice(point + 1))];
  }));
}
function currentUser(req) {
  const token = parseCookies(req).mrdcl_session;
  if (!token) return null;
  const row = db.prepare(`SELECT u.id, u.username, u.display_name, u.role, u.team_id, t.name AS team_name FROM sessions s JOIN users u ON u.id=s.user_id LEFT JOIN teams t ON t.id=u.team_id WHERE s.token=? AND s.expires_at>? AND u.deleted_at IS NULL`).get(token, now());
  return row || null;
}
function requireUser(req, res, roles = ['admin', 'editor', 'authority']) {
  const user = currentUser(req);
  if (!user) { json(res, 401, { error: 'Please sign in to continue.' }); return null; }
  if (!roles.includes(user.role)) { json(res, 403, { error: 'Your role does not have access to this action.' }); return null; }
  return user;
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''; let size = 0;
    req.on('data', chunk => { size += chunk.length; if (size > 22_000_000) reject(new Error('Request is too large.')); else body += chunk; });
    req.on('end', () => { try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error('Invalid JSON.')); } });
    req.on('error', reject);
  });
}
function toHousehold(row, includeGeometry = true) {
  const baseline = parseJson(row.baseline); const survey = parseJson(row.survey);
  const properties = { ...baseline, ...survey, household_id: row.id }; properties.survey_status = surveyStatus(properties.survey_status);
  return {
    id: row.id,
    geometry: includeGeometry ? parseJson(row.geometry, null) : undefined,
    baseline,
    survey,
    properties,
    revision: row.revision,
    updated_at: row.updated_at,
    updated_by: row.updated_by
  };
}
function auditValue(value) {
  if (value === undefined || value === null) return null;
  return typeof value === 'string' ? value : JSON.stringify(value);
}
function addAudit(user, action, householdId, detail, oldValue = null, newValue = null) {
  db.prepare('INSERT INTO audit_log (at, user_id, username, action, household_id, detail, old_value, new_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(now(), user.id, user.username, action, householdId || null, detail || null, auditValue(oldValue), auditValue(newValue));
}
function publishRealtime(type, payload = {}) {
  const message = `event: change\ndata: ${JSON.stringify({ type, at: now(), ...payload })}\n\n`;
  for (const client of realtimeClients) {
    if (client.res.writableEnded || client.res.destroyed) { realtimeClients.delete(client); continue; }
    try { client.res.write(message); } catch { realtimeClients.delete(client); }
  }
}
function isFieldUser(user) { return user.role === 'editor'; }
function isOfficeUser(user) { return user.role === 'authority'; }
function canAccessHousehold(user, rowOrItem) {
  if (!user || user.role === 'admin' || isOfficeUser(user)) return true;
  const item = rowOrItem?.properties ? rowOrItem : toHousehold(rowOrItem, false);
  const p = item.properties || {};
  return String(p.assigned_user_id || '') === String(user.id)
    || (!p.assigned_user_id && String(p.assigned_team || '') === String(teamForUser(user)));
}
function teamForUser(user) {
  if (user.team_name) return user.team_name;
  if (user.username === 'team1') return 'Team 1';
  if (user.username === 'team2') return 'Team 2';
  return user.display_name;
}
function xml(value) { return String(value ?? '').replace(/[<>&'\"]/g, char => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', "'":'&apos;', '"':'&quot;' }[char])); }
function exportRows() { return db.prepare('SELECT * FROM households ORDER BY id').all().map(row => toHousehold(row)); }
function exportProperties(item) { return { household_id: item.id, ...item.properties, gis_geometry_geojson: JSON.stringify(item.geometry) }; }
function csvCell(value) { const textValue = String(value ?? ''); return /[",\r\n]/.test(textValue) ? `"${textValue.replace(/"/g, '""')}"` : textValue; }
function buildCsv(rows) {
  const records = rows.map(exportProperties); const columns = [...new Set(records.flatMap(record => Object.keys(record)))];
  return [columns.map(csvCell).join(','), ...records.map(record => columns.map(column => csvCell(record[column])).join(','))].join('\r\n');
}
function polygonCoordinates(geometry) {
  if (!geometry) return [];
  if (geometry.type === 'Polygon') return [geometry.coordinates];
  if (geometry.type === 'MultiPolygon') return geometry.coordinates;
  return [];
}
function buildKml(rows) {
  const placemarks = rows.map(item => {
    const p = item.properties; const polygons = polygonCoordinates(item.geometry).map(polygon => `<Polygon><outerBoundaryIs><LinearRing><coordinates>${polygon[0].map(point => `${point[0]},${point[1]},0`).join(' ')}</coordinates></LinearRing></outerBoundaryIs></Polygon>`).join('');
    return `<Placemark><name>${xml(p.BuildingID || item.id)}</name><description>${xml(`Household ID: ${item.id}\nPlot: ${p.HNoPlotNo || 'Not recorded'}\nStatus: ${p.survey_status || 'Not started'}`)}</description>${polygons ? `<MultiGeometry>${polygons}</MultiGeometry>` : ''}</Placemark>`;
  }).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>MRDCL Household Survey Export</name>${placemarks}</Document></kml>`;
}
function crc32(buffer) { let crc = 0xffffffff; for (const byte of buffer) { crc ^= byte; for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1)); } return (crc ^ 0xffffffff) >>> 0; }
function zip(files) {
  let offset = 0; const locals = []; const directory = [];
  for (const file of files) {
    const name = Buffer.from(file.name); const raw = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data, 'utf8'); const compressed = zlib.deflateRawSync(raw); const crc = crc32(raw);
    const local = Buffer.alloc(30); local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0, 6); local.writeUInt16LE(8, 8); local.writeUInt32LE(crc, 14); local.writeUInt32LE(compressed.length, 18); local.writeUInt32LE(raw.length, 22); local.writeUInt16LE(name.length, 26);
    const central = Buffer.alloc(46); central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6); central.writeUInt16LE(0, 8); central.writeUInt16LE(8, 10); central.writeUInt32LE(crc, 16); central.writeUInt32LE(compressed.length, 20); central.writeUInt32LE(raw.length, 24); central.writeUInt16LE(name.length, 28); central.writeUInt32LE(offset, 42);
    const localFile = Buffer.concat([local, name, compressed]); locals.push(localFile); directory.push(Buffer.concat([central, name])); offset += localFile.length;
  }
  const directoryBytes = Buffer.concat(directory); const end = Buffer.alloc(22); end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10); end.writeUInt32LE(directoryBytes.length, 12); end.writeUInt32LE(offset, 16); return Buffer.concat([...locals, directoryBytes, end]);
}
function excelColumn(index) { let name = ''; for (let value = index + 1; value; value = Math.floor((value - 1) / 26)) name = String.fromCharCode(65 + ((value - 1) % 26)) + name; return name; }
function xlsxCell(value, index, row) { const safe = String(value ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').slice(0, 32767); return `<c r="${excelColumn(index)}${row}" t="inlineStr"><is><t${/^\s|\s$/.test(safe) ? ' xml:space="preserve"' : ''}>${xml(safe)}</t></is></c>`; }
function buildXlsxRecords(records, sheetName = 'Household register') {
  const columns = [...new Set(records.flatMap(record => Object.keys(record)))];
  const sheetRows = [columns, ...records.map(record => columns.map(column => record[column]))].map((values, rowIndex) => `<row r="${rowIndex + 1}">${values.map((value, index) => xlsxCell(value, index, rowIndex + 1)).join('')}</row>`).join('');
  const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sheetRows}</sheetData></worksheet>`;
  return zip([
    { name: '[Content_Types].xml', data: '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>' },
    { name: '_rels/.rels', data: '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' },
    { name: 'xl/workbook.xml', data: `<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${xml(String(sheetName).slice(0, 31))}" sheetId="1" r:id="rId1"/></sheets></workbook>` },
    { name: 'xl/_rels/workbook.xml.rels', data: '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>' },
    { name: 'xl/worksheets/sheet1.xml', data: sheet }
  ]);
}
function buildXlsx(rows) { return buildXlsxRecords(rows.map(exportProperties)); }
function xlsxNumberCell(value, index, row) {
  const number = Number(value);
  return `<c r="${excelColumn(index)}${row}"><v>${Number.isFinite(number) ? number : 0}</v></c>`;
}
function xlsxSafeSheetName(label, index, used) {
  const base = String(label || `Question ${index + 1}`).replace(/[\\/*?:\[\]]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 31) || `Question ${index + 1}`;
  let candidate = base; let suffix = 2;
  while (used.has(candidate.toLowerCase())) { const ending = ` ${suffix++}`; candidate = `${base.slice(0, 31 - ending.length)}${ending}`; }
  used.add(candidate.toLowerCase()); return candidate;
}
function xlsxChartStringCache(values) {
  return `<c:ptCount val="${values.length}"/>${values.map((value, index) => `<c:pt idx="${index}"><c:v>${xml(value)}</c:v></c:pt>`).join('')}`;
}
function xlsxChartNumberCache(values) {
  return `<c:formatCode>General</c:formatCode><c:ptCount val="${values.length}"/>${values.map((value, index) => `<c:pt idx="${index}"><c:v>${Number(value) || 0}</c:v></c:pt>`).join('')}`;
}
function xlsxChartSeries(name, column, formulaSheetName, categories, values, index, colour) {
  const lastRow = values.length + 1; const categoryFormula = `${formulaSheetName}!$A$2:$A$${lastRow}`; const valueFormula = `${formulaSheetName}!$${column}$2:$${column}$${lastRow}`;
  return `<c:ser><c:idx val="${index}"/><c:order val="${index}"/><c:tx><c:v>${xml(name)}</c:v></c:tx><c:spPr><a:solidFill><a:srgbClr val="${colour}"/></a:solidFill><a:ln><a:noFill/></a:ln></c:spPr><c:cat><c:strRef><c:f>${xml(categoryFormula)}</c:f><c:strCache>${xlsxChartStringCache(categories)}</c:strCache></c:strRef></c:cat><c:val><c:numRef><c:f>${xml(valueFormula)}</c:f><c:numCache>${xlsxChartNumberCache(values)}</c:numCache></c:numRef></c:val></c:ser>`;
}
function xlsxChartXml(title, sheetName, categories, baseline, current, type) {
  const quotedSheet = `'${sheetName.replace(/'/g, "''")}'`; const currentSeries = xlsxChartSeries('Current survey', 'C', quotedSheet, categories, current, type === 'compare' ? 1 : 0, '005EA8');
  const chartTitle = `<c:title><c:tx><c:rich><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="en-US" sz="1200" b="1"/><a:t>${xml(title)}</a:t></a:r><a:endParaRPr lang="en-US"/></a:p></c:rich></c:tx><c:layout/></c:title>`;
  if (type === 'pie') {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><c:chart>${chartTitle}<c:plotArea><c:layout/><c:pieChart><c:varyColors val="1"/>${currentSeries}<c:firstSliceAng val="0"/></c:pieChart></c:plotArea><c:legend><c:legendPos val="r"/><c:layout/></c:legend><c:plotVisOnly val="1"/></c:chart></c:chartSpace>`;
  }
  const baselineSeries = type === 'compare' ? xlsxChartSeries('Baseline', 'B', quotedSheet, categories, baseline, 0, '9FB3C8') : '';
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><c:chart>${chartTitle}<c:plotArea><c:layout/><c:barChart><c:barDir val="col"/><c:grouping val="clustered"/><c:varyColors val="0"/>${baselineSeries}${currentSeries}<c:gapWidth val="65"/><c:overlap val="0"/><c:axId val="48650112"/><c:axId val="48672768"/></c:barChart><c:catAx><c:axId val="48650112"/><c:scaling><c:orientation val="minMax"/></c:scaling><c:delete val="0"/><c:axPos val="b"/><c:tickLblPos val="nextTo"/><c:crossAx val="48672768"/><c:crosses val="autoZero"/><c:auto val="1"/><c:lblAlgn val="ctr"/><c:lblOffset val="100"/></c:catAx><c:valAx><c:axId val="48672768"/><c:scaling><c:orientation val="minMax"/></c:scaling><c:delete val="0"/><c:axPos val="l"/><c:majorGridlines/><c:numFmt formatCode="General" sourceLinked="1"/><c:tickLblPos val="nextTo"/><c:crossAx val="48650112"/><c:crosses val="autoZero"/><c:crossBetween val="between"/></c:valAx></c:plotArea><c:legend><c:legendPos val="r"/><c:layout/></c:legend><c:plotVisOnly val="1"/></c:chart></c:chartSpace>`;
}
function xlsxChartDrawingXml(index) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart"><xdr:twoCellAnchor editAs="oneCell"><xdr:from><xdr:col>4</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>1</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from><xdr:to><xdr:col>14</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>20</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:to><xdr:graphicFrame macro=""><xdr:nvGraphicFramePr><xdr:cNvPr id="2" name="Question chart ${index}"/><xdr:cNvGraphicFramePr/></xdr:nvGraphicFramePr><xdr:xfrm/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart"><c:chart r:id="rId1"/></a:graphicData></a:graphic></xdr:graphicFrame><xdr:clientData/></xdr:twoCellAnchor></xdr:wsDr>`;
}
function buildAnalysisXlsx(analyses) {
  const usedNames = new Set(); const source = analyses.length ? analyses : [{ label:'No selected questions', chartType:'bar', baseline:{}, current:{} }]; const files = [];
  const sheets = source.map((analysis, index) => {
    const sheetName = xlsxSafeSheetName(analysis.label, index, usedNames); const categories = [...new Set([...Object.keys(analysis.baseline || {}), ...Object.keys(analysis.current || {})])];
    const labels = categories.length ? categories : ['Not recorded']; const baseline = labels.map(value => Number(analysis.baseline?.[value]) || 0); const current = labels.map(value => Number(analysis.current?.[value]) || 0); const sheetNumber = index + 1;
    const rows = [`<row r="1">${xlsxCell('Response', 0, 1)}${xlsxCell('Baseline', 1, 1)}${xlsxCell('Current', 2, 1)}</row>`, ...labels.map((value, rowIndex) => `<row r="${rowIndex + 2}">${xlsxCell(value, 0, rowIndex + 2)}${xlsxNumberCell(baseline[rowIndex], 1, rowIndex + 2)}${xlsxNumberCell(current[rowIndex], 2, rowIndex + 2)}</row>`)].join('');
    files.push({ name:`xl/worksheets/sheet${sheetNumber}.xml`, data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><cols><col min="1" max="1" width="34" customWidth="1"/><col min="2" max="3" width="13" customWidth="1"/></cols><sheetData>${rows}</sheetData><drawing r:id="rId1"/></worksheet>` });
    files.push({ name:`xl/worksheets/_rels/sheet${sheetNumber}.xml.rels`, data:`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing${sheetNumber}.xml"/></Relationships>` });
    files.push({ name:`xl/drawings/drawing${sheetNumber}.xml`, data:xlsxChartDrawingXml(sheetNumber) });
    files.push({ name:`xl/drawings/_rels/drawing${sheetNumber}.xml.rels`, data:`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart" Target="../charts/chart${sheetNumber}.xml"/></Relationships>` });
    files.push({ name:`xl/charts/chart${sheetNumber}.xml`, data:xlsxChartXml(analysis.label, sheetName, labels, baseline, current, analysis.chartType) });
    return { sheetName, sheetNumber };
  });
  const contentTypes = [`<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>`, `<Default Extension="xml" ContentType="application/xml"/>`, `<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>`, ...sheets.flatMap(sheet => [`<Override PartName="/xl/worksheets/sheet${sheet.sheetNumber}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`, `<Override PartName="/xl/drawings/drawing${sheet.sheetNumber}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>`, `<Override PartName="/xl/charts/chart${sheet.sheetNumber}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/>`])].join('');
  files.unshift({ name:'[Content_Types].xml', data:`<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">${contentTypes}</Types>` }, { name:'_rels/.rels', data:'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' }, { name:'xl/workbook.xml', data:`<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheets.map(sheet => `<sheet name="${xml(sheet.sheetName)}" sheetId="${sheet.sheetNumber}" r:id="rId${sheet.sheetNumber}"/>`).join('')}</sheets></workbook>` }, { name:'xl/_rels/workbook.xml.rels', data:`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map(sheet => `<Relationship Id="rId${sheet.sheetNumber}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${sheet.sheetNumber}.xml"/>`).join('')}</Relationships>` });
  return zip(files);
}
function buildWord(rows) {
  const records = rows.map(exportProperties); const columns = [...new Set(records.flatMap(record => Object.keys(record)))];
  const header = columns.map(column => `<th>${xml(column.replace(/_/g, ' '))}</th>`).join(''); const body = records.map(record => `<tr>${columns.map(column => `<td>${xml(record[column])}</td>`).join('')}</tr>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><title>MRDCL Household Survey Export</title><style>body{font-family:Arial,sans-serif;font-size:9pt}h1{font-size:16pt;color:#102a43}table{border-collapse:collapse;width:100%}th,td{border:1px solid #d9e2ec;padding:4px;text-align:left;vertical-align:top}th{background:#102a43;color:#fff}</style></head><body><h1>MRDCL Household Survey Register</h1><p>Exported ${xml(new Date().toLocaleString())}. ${rows.length} household records.</p><table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table></body></html>`;
}
function ringPoints(ring) {
  const points = Array.isArray(ring) ? ring.filter(point => Array.isArray(point) && Number.isFinite(Number(point[0])) && Number.isFinite(Number(point[1]))).map(point => [Number(point[0]), Number(point[1])]) : [];
  if (points.length < 3) return [];
  const first = points[0]; const last = points[points.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) points.push([...first]);
  return points;
}
function shapeParts(geometry) { return polygonCoordinates(geometry).flatMap(polygon => polygon.map(ringPoints).filter(points => points.length >= 4)); }
function shapeBounds(points) {
  if (!points.length) return [0, 0, 0, 0];
  let xmin = points[0][0]; let ymin = points[0][1]; let xmax = xmin; let ymax = ymin;
  points.forEach(([x, y]) => { xmin = Math.min(xmin, x); ymin = Math.min(ymin, y); xmax = Math.max(xmax, x); ymax = Math.max(ymax, y); });
  return [xmin, ymin, xmax, ymax];
}
function shapefileContent(geometry) {
  const parts = shapeParts(geometry); if (!parts.length) { const empty = Buffer.alloc(4); empty.writeInt32LE(0, 0); return empty; }
  const points = parts.flat(); const bounds = shapeBounds(points); const content = Buffer.alloc(44 + parts.length * 4 + points.length * 16);
  content.writeInt32LE(5, 0); bounds.forEach((value, index) => content.writeDoubleLE(value, 4 + index * 8)); content.writeInt32LE(parts.length, 36); content.writeInt32LE(points.length, 40);
  let pointIndex = 0; parts.forEach((part, index) => { content.writeInt32LE(pointIndex, 44 + index * 4); pointIndex += part.length; });
  let offset = 44 + parts.length * 4; points.forEach(([x, y]) => { content.writeDoubleLE(x, offset); content.writeDoubleLE(y, offset + 8); offset += 16; });
  return content;
}
function shapefileHeader(fileLengthWords, bounds) {
  const header = Buffer.alloc(100); header.writeInt32BE(9994, 0); header.writeInt32BE(fileLengthWords, 24); header.writeInt32LE(1000, 28); header.writeInt32LE(5, 32); bounds.forEach((value, index) => header.writeDoubleLE(value, 36 + index * 8)); return header;
}
function dbfFieldName(name, used) {
  const stem = String(name || 'FIELD').toUpperCase().replace(/[^A-Z0-9_]/g, '_').replace(/^_+/, '') || 'FIELD'; let candidate = stem.slice(0, 10); let suffix = 1;
  while (used.has(candidate)) { const ending = String(suffix++); candidate = `${stem.slice(0, Math.max(1, 10 - ending.length))}${ending}`; }
  used.add(candidate); return candidate;
}
function buildDbf(records) {
  const columns = [...new Set(records.flatMap(record => Object.keys(record)))].slice(0, 250); const used = new Set(); const fields = columns.map(source => ({ source, name:dbfFieldName(source, used), width:254 }));
  const headerLength = 32 + fields.length * 32 + 1; const recordLength = 1 + fields.reduce((total, field) => total + field.width, 0); const output = Buffer.alloc(headerLength + recordLength * records.length + 1, 0x20); const today = new Date();
  output[0] = 3; output[1] = today.getFullYear() - 1900; output[2] = today.getMonth() + 1; output[3] = today.getDate(); output.writeUInt32LE(records.length, 4); output.writeUInt16LE(headerLength, 8); output.writeUInt16LE(recordLength, 10);
  fields.forEach((field, index) => { const offset = 32 + index * 32; Buffer.from(field.name, 'ascii').copy(output, offset); output[offset + 11] = 'C'.charCodeAt(0); output[offset + 16] = field.width; }); output[headerLength - 1] = 0x0d;
  records.forEach((record, rowIndex) => { let offset = headerLength + rowIndex * recordLength; output[offset++] = 0x20; fields.forEach(field => { const value = Buffer.from(String(record[field.source] ?? '').replace(/[\u0000-\u001f]/g, ' ').slice(0, field.width), 'utf8'); value.copy(output, offset, 0, Math.min(value.length, field.width)); offset += field.width; }); }); output[output.length - 1] = 0x1a;
  return { data:output, fields };
}
function buildShapefileZip(rows) {
  const contents = rows.map(item => shapefileContent(item.geometry)); const allPoints = rows.flatMap(item => shapeParts(item.geometry).flat()); const bounds = shapeBounds(allPoints); let offsetWords = 50;
  const shpRecords = []; const shxRecords = [];
  contents.forEach((content, index) => { const record = Buffer.alloc(8); record.writeInt32BE(index + 1, 0); record.writeInt32BE(content.length / 2, 4); shpRecords.push(record, content); const indexRecord = Buffer.alloc(8); indexRecord.writeInt32BE(offsetWords, 0); indexRecord.writeInt32BE(content.length / 2, 4); shxRecords.push(indexRecord); offsetWords += 4 + content.length / 2; });
  const records = rows.map(exportProperties); const dbf = buildDbf(records); const fieldMap = ['shapefile_field,full_attribute_name', ...dbf.fields.map(field => `${field.name},"${String(field.source).replace(/"/g, '""')}"`)].join('\r\n');
  return zip([{ name:'mrdcl_households.shp', data:Buffer.concat([shapefileHeader(offsetWords, bounds), ...shpRecords]) }, { name:'mrdcl_households.shx', data:Buffer.concat([shapefileHeader(50 + shxRecords.length * 4, bounds), ...shxRecords]) }, { name:'mrdcl_households.dbf', data:dbf.data }, { name:'mrdcl_households.prj', data:'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["degree",0.0174532925199433]]' }, { name:'mrdcl_households.cpg', data:'UTF-8' }, { name:'field-map.csv', data:fieldMap }]);
}
function pdfSafe(value) { return String(value ?? '').normalize('NFKD').replace(/[^\x20-\x7e]/g, '?').replace(/[\\()]/g, match => `\\${match}`); }
function pdfWrapped(label, value) {
  const prefix = `${label}: `; const words = String(value ?? 'Not recorded').replace(/\s+/g, ' ').trim().match(/.{1,86}(?:\s|$)|\S+?(?:\s|$)/g) || ['Not recorded'];
  return words.map((line, index) => `${index ? '  ' : prefix}${line.trim()}`);
}
function buildPdf(rows) {
  const lines = []; rows.forEach((item, recordIndex) => { const properties = exportProperties(item); lines.push(`MRDCL Household Survey Report — household ${recordIndex + 1} of ${rows.length}`, `Household ID: ${item.id}`, `Generated: ${new Date().toLocaleString()}`, ''); Object.keys(properties).sort().forEach(key => lines.push(...pdfWrapped(key.replace(/_/g, ' '), properties[key]))); lines.push('', ''); });
  const pages = []; for (let index = 0; index < lines.length; index += 46) pages.push(lines.slice(index, index + 46)); if (!pages.length) pages.push(['MRDCL Household Survey Report', 'No households were selected.']);
  const objects = []; const pageIds = pages.map((_, index) => 4 + index * 2); const contentIds = pageIds.map(id => id + 1); objects[1] = '<< /Type /Catalog /Pages 2 0 R >>'; objects[2] = `<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`; objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  pages.forEach((page, index) => { const content = `BT\n/F1 10 Tf\n44 800 Td\n${page.map((line, lineIndex) => `${lineIndex ? '0 -16 Td\n' : ''}(${pdfSafe(line)}) Tj`).join('\n')}\nET`; objects[pageIds[index]] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentIds[index]} 0 R >>`; objects[contentIds[index]] = `<< /Length ${Buffer.byteLength(content, 'utf8')} >>\nstream\n${content}\nendstream`; });
  let output = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'; const offsets = [0]; for (let index = 1; index < objects.length; index++) { offsets[index] = Buffer.byteLength(output, 'binary'); output += `${index} 0 obj\n${objects[index]}\nendobj\n`; } const xref = Buffer.byteLength(output, 'binary'); output += `xref\n0 ${objects.length}\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`; return Buffer.from(output, 'binary');
}
function sendExport(res, rows, type, fileStem) {
  const stamp = new Date().toISOString().slice(0, 10);
  const safeStem = String(fileStem || 'mrdcl-household-survey').replace(/[^A-Za-z0-9_-]+/g, '-');
  if (type === 'geojson') {
    const features = rows.map(item => ({ type: 'Feature', id: item.id, geometry: item.geometry, properties: exportProperties(item) }));
    download(res, `${safeStem}-${stamp}.geojson`, 'application/geo+json; charset=utf-8', JSON.stringify({ type: 'FeatureCollection', name: 'MRDCL household survey export', features })); return;
  }
  if (type === 'kml') { download(res, `${safeStem}-${stamp}.kml`, 'application/vnd.google-earth.kml+xml; charset=utf-8', buildKml(rows)); return; }
  if (type === 'xlsx') { download(res, `${safeStem}-${stamp}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buildXlsx(rows)); return; }
  if (type === 'word') { download(res, `${safeStem}-${stamp}.doc`, 'application/msword; charset=utf-8', buildWord(rows)); return; }
  if (type === 'csv') { download(res, `${safeStem}-${stamp}.csv`, 'text/csv; charset=utf-8', buildCsv(rows)); return; }
  if (type === 'shapefile') { download(res, `${safeStem}-${stamp}-shapefile.zip`, 'application/zip', buildShapefileZip(rows)); return; }
  if (type === 'pdf') { download(res, `${safeStem}-${stamp}-report.pdf`, 'application/pdf', buildPdf(rows)); return; }
  text(res, 400, 'Unsupported export type.');
}
function aggregateValues(values) {
  const counts = new Map();
  for (const raw of values) {
    const label = String(raw ?? '').trim() || 'Not recorded';
    counts.set(label, (counts.get(label) || 0) + 1);
  }
  const ordered = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  if (ordered.length <= 18) return Object.fromEntries(ordered);
  const visible = ordered.slice(0, 17); const other = ordered.slice(17).reduce((sum, [, count]) => sum + count, 0);
  return Object.fromEntries([...visible, ['Other values', other]]);
}
function geometryCentre(geometry) {
  const points = [];
  const collect = value => { if (!Array.isArray(value)) return; if (typeof value[0] === 'number' && typeof value[1] === 'number') points.push(value); else value.forEach(collect); };
  collect(geometry?.coordinates);
  if (!points.length) return null;
  const lons = points.map(point => point[0]); const lats = points.map(point => point[1]);
  return { latitude:(Math.min(...lats) + Math.max(...lats)) / 2, longitude:(Math.min(...lons) + Math.max(...lons)) / 2 };
}
function distanceMetres(one, two) {
  if (!one || !two) return null;
  const rad = value => value * Math.PI / 180; const earth = 6371000;
  const dLat = rad(two.latitude - one.latitude); const dLon = rad(two.longitude - one.longitude);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(one.latitude)) * Math.cos(rad(two.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * earth * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function pointInRing(point, ring) {
  let inside = false;
  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index++) {
    const [x, y] = ring[index]; const [previousX, previousY] = ring[previous];
    if (((y > point.latitude) !== (previousY > point.latitude)) && point.longitude < ((previousX - x) * (point.latitude - y)) / (previousY - y) + x) inside = !inside;
  }
  return inside;
}
function pointInGeometry(point, geometry) {
  const polygons = geometry?.type === 'Polygon' ? [geometry.coordinates] : geometry?.type === 'MultiPolygon' ? geometry.coordinates : [];
  return polygons.some(polygon => pointInRing(point, polygon[0]) && !polygon.slice(1).some(ring => pointInRing(point, ring)));
}
function ghmcZoneForGeometry(id, geometry) {
  if (ghmcZoneCache.has(id)) return ghmcZoneCache.get(id);
  let zoneName = 'Outside GHMC zone';
  try {
    if (!ghmcZoneFeatures) { const layerFile = JSON.parse(fs.readFileSync(MAP_LAYERS, 'utf8')); ghmcZoneFeatures = layerFile.layers?.find(layer => layer.id === 'zones')?.features || []; }
    const point = geometryCentre(geometry); const match = point && ghmcZoneFeatures.find(feature => pointInGeometry(point, feature.geometry));
    zoneName = String(match?.properties?.Zone_Name || zoneName);
  } catch { /* The household is still usable when a boundary layer is unavailable. */ }
  ghmcZoneCache.set(id, zoneName); return zoneName;
}
function init() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, display_name TEXT NOT NULL,
      password_hash TEXT NOT NULL, password_salt TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('admin','editor','authority')),
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expires_at TEXT NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE);
    CREATE TABLE IF NOT EXISTS households (
      id TEXT PRIMARY KEY, geometry TEXT NOT NULL, baseline TEXT NOT NULL, survey TEXT NOT NULL DEFAULT '{}',
      revision INTEGER NOT NULL DEFAULT 0, updated_at TEXT, updated_by TEXT
    );
    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT, at TEXT NOT NULL, user_id INTEGER, username TEXT NOT NULL,
      action TEXT NOT NULL, household_id TEXT, detail TEXT
    );
    CREATE TABLE IF NOT EXISTS photo_uploads (
      id INTEGER PRIMARY KEY AUTOINCREMENT, household_id TEXT NOT NULL, filename TEXT NOT NULL UNIQUE,
      original_name TEXT NOT NULL, mime_type TEXT NOT NULL, latitude REAL, longitude REAL,
      captured_at TEXT NOT NULL, uploaded_at TEXT NOT NULL, uploaded_by TEXT NOT NULL,
      FOREIGN KEY(household_id) REFERENCES households(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS questionnaire_fields (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      field_key TEXT NOT NULL UNIQUE,
      tab_id TEXT NOT NULL CHECK(tab_id IN ('tab1','tab2','tab3')),
      section_name TEXT NOT NULL,
      label TEXT NOT NULL,
      input_type TEXT NOT NULL DEFAULT 'text',
      options TEXT NOT NULL DEFAULT '[]',
      sort_order INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      is_custom INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      created_by TEXT,
      retired_at TEXT,
      retired_by TEXT
    );
    CREATE TABLE IF NOT EXISTS questionnaire_tabs (
      tab_id TEXT PRIMARY KEY CHECK(tab_id IN ('tab1','tab2','tab3')),
      label TEXT NOT NULL,
      sort_order INTEGER NOT NULL,
      updated_at TEXT,
      updated_by TEXT
    );
    CREATE TABLE IF NOT EXISTS custom_map_layers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      geojson TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#7c3aed',
      visible INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      created_by TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      updated_by TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS shared_library_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_name TEXT NOT NULL,
      stored_name TEXT NOT NULL UNIQUE,
      mime_type TEXT NOT NULL,
      extension TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      created_by TEXT NOT NULL
    );
  `);
  fs.mkdirSync(UPLOAD_DIR, { recursive:true });
  fs.mkdirSync(LIBRARY_DIR, { recursive:true });
  const userColumns = db.prepare('PRAGMA table_info(users)').all().map(column => column.name);
  if (!userColumns.includes('team_id')) db.exec('ALTER TABLE users ADD COLUMN team_id INTEGER REFERENCES teams(id)');
  if (!userColumns.includes('last_sync_at')) db.exec('ALTER TABLE users ADD COLUMN last_sync_at TEXT');
  // Soft deletion preserves the user row, household assignments, and audit
  // evidence while permanently removing portal access until an explicit future
  // restore workflow is introduced.
  if (!userColumns.includes('deleted_at')) db.exec('ALTER TABLE users ADD COLUMN deleted_at TEXT');
  if (!userColumns.includes('deleted_by')) db.exec('ALTER TABLE users ADD COLUMN deleted_by TEXT');
  // Additive migration: preserve existing audit history while recording the
  // before/after values required for review and conflict resolution.
  const auditColumns = db.prepare('PRAGMA table_info(audit_log)').all().map(column => column.name);
  if (!auditColumns.includes('old_value')) db.exec('ALTER TABLE audit_log ADD COLUMN old_value TEXT');
  if (!auditColumns.includes('new_value')) db.exec('ALTER TABLE audit_log ADD COLUMN new_value TEXT');
  const customLayerColumns = db.prepare('PRAGMA table_info(custom_map_layers)').all().map(column => column.name);
  if (!customLayerColumns.includes('source_file_id')) db.exec('ALTER TABLE custom_map_layers ADD COLUMN source_file_id INTEGER');
  seedExistingLibraryFiles();
  const addQuestion = db.prepare(`INSERT OR IGNORE INTO questionnaire_fields
    (field_key, tab_id, section_name, label, input_type, options, sort_order, active, is_custom, created_at, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0, ?, 'system')`);
  QUESTIONNAIRE_SEED.forEach(([fieldKey, tabId, section, label, inputType, options = []], index) => {
    addQuestion.run(fieldKey, tabId, section, label, inputType, JSON.stringify(options), index, now());
  });
  // One-time compatibility migration for older deployments where a Word
  // single-choice field was mistakenly imported as free text. Once a field is
  // already a select, an administrator's later edits to its choices are kept.
  // Existing survey values remain in household records in every case.
  const seedByFieldKey = new Map(QUESTIONNAIRE_SEED.map(seed => [seed[0], seed]));
  const updateChoiceField = db.prepare('UPDATE questionnaire_fields SET input_type=?, options=? WHERE field_key=? AND is_custom=0');
  const readChoiceField = db.prepare('SELECT input_type FROM questionnaire_fields WHERE field_key=? AND is_custom=0');
  WORD_SINGLE_CHOICE_FIELD_KEYS.forEach(fieldKey => {
    const seed = seedByFieldKey.get(fieldKey);
    const existing = readChoiceField.get(fieldKey);
    if (seed && existing && existing.input_type !== seed[4]) updateChoiceField.run(seed[4], JSON.stringify(seed[5] || []), fieldKey);
  });
  // The unit now travels with the calculated value rather than being fixed in
  // the question label. Only update the original supplied wording, never an
  // administrator's later question edit or any household answer.
  const migrateMeasurementQuestionLabel = db.prepare(`UPDATE questionnaire_fields
    SET label=? WHERE field_key=? AND is_custom=0 AND label=?`);
  [
    ['Total landholding', 'q_total_landholding_acres', 'Total landholding (acres)'],
    ['Distance between main structure and river', 'q_main_structure_river_distance', 'Distance between main structure and river (m)'],
    ['Total structure area', 'q_total_structure_area_sqm', 'Total structure area (sq m)']
  ].forEach(args => migrateMeasurementQuestionLabel.run(...args));
  const addQuestionTab = db.prepare('INSERT OR IGNORE INTO questionnaire_tabs (tab_id, label, sort_order) VALUES (?, ?, ?)');
  addQuestionTab.run('tab1', 'Primary observation', 1); addQuestionTab.run('tab2', 'Secondary observation', 2); addQuestionTab.run('tab3', 'Others', 3);
  // Rename only the initial technical labels. An administrator's own tab names
  // are never overwritten on restart.
  const renameInitialTab = db.prepare('UPDATE questionnaire_tabs SET label=? WHERE tab_id=? AND label=?');
  renameInitialTab.run('Primary observation', 'tab1', 'Tab 1 · Primary observation');
  renameInitialTab.run('Secondary observation', 'tab2', 'Tab 2 · Secondary observation');
  renameInitialTab.run('Others', 'tab3', 'Tab 3 · Others');
  renameInitialTab.run('Others', 'tab3', 'Other details');
  // Match the headings in the approved questionnaire while leaving any
  // administrator-created questions and their headings untouched.
  const renameInitialSection = db.prepare('UPDATE questionnaire_fields SET section_name=? WHERE section_name=? AND is_custom=0');
  [
    ['SECTION 1: SURVEY INFORMATION & LOCATION DETAILS', 'Survey information and location details'],
    ['SECTION 2: LAND OWNERSHIP & TENURE DETAILS', 'Land ownership and tenure'],
    ['SECTION 3: STRUCTURES & OTHER ASSETS', 'Structures and assets'],
    ['SECTION 3: STRUCTURES & OTHER ASSETS', 'Household and livelihood'],
    ['SECTION 3: STRUCTURES & OTHER ASSETS', 'Women, assets and benefits'],
    ['SECTION 3: STRUCTURES & OTHER ASSETS', 'Family members'],
    ['Secondary observation', 'Land and measurements'],
    ['Secondary observation', 'Cultural assets'],
    ['SECTION 2: TREES & CROPS', 'Trees and crops'],
    ['SUPPLEMENTARY SHEET FOR OCCUPIERS / TENANTS', 'Supplementary occupier / tenant details'],
    ['SUPPLEMENTARY SHEET FOR OCCUPIERS / TENANTS', 'Supplementary family members']
  ].forEach(([next, previous]) => renameInitialSection.run(next, previous));
  // The four interim structure-impact questions are no longer part of the
  // approved Section 3 form. Retire them instead of deleting them: every
  // existing household answer remains in its survey JSON and audit history.
  const retireSupersededStructureQuestions = db.prepare(`UPDATE questionnaire_fields
    SET active=0, retired_at=COALESCE(retired_at, ?), retired_by=COALESCE(retired_by, 'system')
    WHERE active=1 AND field_key IN ('q_structure_affected', 'q_structure_affected_date', 'q_structure_impact_scale', 'q_structure_viability')`);
  retireSupersededStructureQuestions.run(now());
  const createTeam = db.prepare('INSERT OR IGNORE INTO teams (name, created_at) VALUES (?, ?)');
  createTeam.run('Team 1', now()); createTeam.run('Team 2', now());
  if (db.prepare('SELECT COUNT(*) AS count FROM households').get().count === 0) {
    if (!fs.existsSync(DATASET)) throw new Error(`Missing baseline data: ${DATASET}. Run npm run import:households first.`);
    const source = JSON.parse(fs.readFileSync(DATASET, 'utf8'));
    const insert = db.prepare('INSERT INTO households (id, geometry, baseline) VALUES (?, ?, ?)');
    db.exec('BEGIN IMMEDIATE');
    try {
      for (const feature of source.features) insert.run(feature.id, JSON.stringify(feature.geometry), JSON.stringify(feature.properties));
      db.exec('COMMIT');
    } catch (error) { db.exec('ROLLBACK'); throw error; }
  }
  if (db.prepare('SELECT COUNT(*) AS count FROM users').get().count === 0) {
    const seedUsers = [
      ['admin', 'MRDCL Administrator', 'admin', process.env.ADMIN_PASSWORD || 'ChangeMe!589'],
      ['team1', 'Survey Team 1', 'editor', process.env.TEAM1_PASSWORD || 'Team1!589'],
      ['team2', 'Survey Team 2', 'editor', process.env.TEAM2_PASSWORD || 'Team2!589'],
      ['authority', 'MRDCL Authority', 'authority', process.env.AUTHORITY_PASSWORD || 'ViewOnly!589']
    ];
    const insert = db.prepare('INSERT INTO users (username, display_name, role, password_hash, password_salt, created_at) VALUES (?, ?, ?, ?, ?, ?)');
    for (const [username, display, role, password] of seedUsers) { const hashed = hash(password); insert.run(username, display, role, hashed.value, hashed.salt, now()); }
  }
  const seedTeam = db.prepare('UPDATE users SET team_id=(SELECT id FROM teams WHERE name=?) WHERE username=? AND team_id IS NULL');
  seedTeam.run('Team 1', 'team1'); seedTeam.run('Team 2', 'team2');
}

function readQuestionnaireFields(includeInactive = false) {
  const rows = db.prepare(`SELECT id, field_key, tab_id, section_name, label, input_type, options, sort_order, active, is_custom
    FROM questionnaire_fields ${includeInactive ? '' : 'WHERE active=1'} ORDER BY tab_id, sort_order, id`).all();
  return rows.map(row => {
    const options = parseJson(row.options, []);
    return { ...row, active:Boolean(row.active), is_custom:Boolean(row.is_custom), options:alphabetizeOptions(options) };
  });
}
function hasQuestionnaireUpdate(values) {
  return Object.keys(values).some(key => key.startsWith('q_') || key === 'household_members' || key === 'occupier_members');
}
function questionnaireIsComplete(values) {
  const fields = readQuestionnaireFields();
  return fields.length > 0 && fields.every(field => String(values[field.field_key] ?? '').trim() !== '');
}
function applyAutomaticSurveyStatus(previous, incoming, user, timestamp) {
  if (!hasQuestionnaireUpdate(incoming) || surveyStatus(previous.survey_status) === 'Verified') return;
  // A returned record becomes active fieldwork again as soon as the surveyor
  // edits it. The office can still flag it again after reviewing the revision.
  if (previous.verification_status === 'Correction required' && user.role === 'editor') incoming.verification_status = 'Pending';
  const proposed = { ...previous, ...incoming };
  incoming.survey_status = questionnaireIsComplete(proposed) ? 'Surveyed' : 'Pending';
  // Preserve the timezone on automatic timestamps. The browser converts this
  // ISO value to the survey device's local date/time for its datetime control.
  if (!String(proposed.Survey_Dat || '').trim()) incoming.Survey_Dat = timestamp;
  const editorHasKnownTeam = user.role === 'editor' && (user.team_name || user.username === 'team1' || user.username === 'team2');
  if (editorHasKnownTeam && ['', 'Unassigned', 'Not recorded'].includes(String(previous.assigned_team || '').trim())) incoming.assigned_team = teamForUser(user);
}
function readQuestionnaireTabs() { return db.prepare('SELECT tab_id, label, sort_order FROM questionnaire_tabs ORDER BY sort_order, tab_id').all(); }
function validateQuestionnaireDefinition(body) {
  const tabId = String(body.tab_id || '');
  const section = String(body.section_name || '').trim().replace(/\s+/g, ' ');
  const label = String(body.label || '').trim().replace(/\s+/g, ' ');
  const inputType = String(body.input_type || 'text');
  const options = alphabetizeOptions(Array.isArray(body.options) ? body.options.slice(0, 60) : []);
  if (!['tab1', 'tab2', 'tab3'].includes(tabId)) throw new Error('Choose Tab 1, Tab 2, or Tab 3.');
  if (section.length < 2 || section.length > 100) throw new Error('Section name must be between 2 and 100 characters.');
  if (label.length < 2 || label.length > 180) throw new Error('Question label must be between 2 and 180 characters.');
  if (!['text', 'textarea', 'number', 'date', 'tel', 'select'].includes(inputType)) throw new Error('Choose a supported response type.');
  if (inputType === 'select' && options.length < 2) throw new Error('A selection question needs at least two choices.');
  return { tabId, section, label, inputType, options };
}
function nextQuestionKey(label) {
  const stem = String(label).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 62) || 'new_question';
  let key = `q_custom_${stem}`; let suffix = 2;
  while (db.prepare('SELECT 1 FROM questionnaire_fields WHERE field_key=?').get(key)) key = `q_custom_${stem.slice(0, Math.max(2, 58 - String(suffix).length))}_${suffix++}`;
  return key;
}
function readCustomMapLayers() {
  return db.prepare('SELECT id, name, geojson, color, visible, source_file_id, created_at, created_by, updated_at, updated_by FROM custom_map_layers ORDER BY id').all().map(row => ({ ...row, geojson:parseJson(row.geojson, { type:'FeatureCollection', features:[] }), visible:Boolean(row.visible) }));
}
function validMapLayerGeojson(value) {
  const source = value && typeof value === 'object' ? value : null; const features = source?.type === 'FeatureCollection' ? source.features : source?.type === 'Feature' ? [source] : null;
  if (!Array.isArray(features) || !features.length || features.length > 10000) throw new Error('Use a GeoJSON FeatureCollection with 1–10,000 features.');
  if (features.some(feature => !feature || feature.type !== 'Feature' || !feature.geometry || !['Point','LineString','Polygon','MultiPoint','MultiLineString','MultiPolygon'].includes(feature.geometry.type))) throw new Error('Every imported GeoJSON feature needs a supported geometry.');
  const geojson = { type:'FeatureCollection', features };
  if (Buffer.byteLength(JSON.stringify(geojson), 'utf8') > 10_000_000) throw new Error('The shared GeoJSON layer must be smaller than 10 MB.');
  return geojson;
}
function safeLibraryName(value) {
  return path.basename(String(value || 'project-file')).replace(/[\u0000-\u001f"\\/\\]/g, '_').trim().slice(0, 180) || 'project-file';
}
function libraryExtension(name) { return path.extname(String(name || '')).slice(1).toLowerCase(); }
function libraryMime(extension) {
  return ({ xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', xls:'application/vnd.ms-excel', csv:'text/csv; charset=utf-8', docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document', doc:'application/msword', pdf:'application/pdf', geojson:'application/geo+json', json:'application/json', kml:'application/vnd.google-earth.kml+xml', gpkg:'application/geopackage+sqlite3', zip:'application/zip', shp:'application/octet-stream', dbf:'application/octet-stream', shx:'application/octet-stream', xml:'application/xml' }[extension] || 'application/octet-stream');
}
function seedExistingLibraryFiles() {
  const sources = [
    ['AS 589 household baseline.geojson', DATASET],
    ['Bifurcated buildings.geojson', BIFURCATED_LAYER],
    ['MRDCL supplied map layers.json', MAP_LAYERS],
    ['Musi Phase project configuration.xml', path.join(ROOT, 'work_589_project.xml')],
    ['Updated questionnaire.docx', UPDATED_QUESTIONNAIRE]
  ];
  const alreadyStored = db.prepare('SELECT id FROM shared_library_files WHERE original_name=?');
  const insert = db.prepare('INSERT INTO shared_library_files (original_name, stored_name, mime_type, extension, size_bytes, created_at, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)');
  for (const [originalName, source] of sources) {
    if (!fs.existsSync(source) || alreadyStored.get(originalName)) continue;
    const extension = libraryExtension(originalName); const size = fs.statSync(source).size;
    if (!LIBRARY_EXTENSIONS.has(extension) || size > MAX_LIBRARY_FILE_BYTES) continue;
    const storedName = `seed-${crypto.randomUUID()}.${extension}`;
    fs.copyFileSync(source, path.join(LIBRARY_DIR, storedName));
    try { insert.run(originalName, storedName, libraryMime(extension), extension, size, now(), 'system'); }
    catch (error) { try { fs.unlinkSync(path.join(LIBRARY_DIR, storedName)); } catch { /* no-op */ } throw error; }
  }
}
function libraryFile(row) {
  const extension = String(row.extension || '').toLowerCase();
  const mapLayer = db.prepare('SELECT id, name, color, visible FROM custom_map_layers WHERE source_file_id=? ORDER BY id LIMIT 1').get(row.id);
  return {
    id:Number(row.id), original_name:row.original_name, mime_type:row.mime_type, extension,
    size_bytes:Number(row.size_bytes), created_at:row.created_at, created_by:row.created_by,
    map_supported:['geojson','json'].includes(extension), map_layer:mapLayer ? { ...mapLayer, visible:Boolean(mapLayer.visible) } : null,
    download_url:`/api/library-files/${Number(row.id)}/download`
  };
}
function readLibraryFiles() { return db.prepare('SELECT * FROM shared_library_files ORDER BY id DESC').all().map(libraryFile); }
function readLibraryUpload(body) {
  const originalName = safeLibraryName(body.filename);
  const extension = libraryExtension(originalName);
  if (!LIBRARY_EXTENSIONS.has(extension)) throw new Error('Use Excel, CSV, Word, PDF, GeoJSON, KML, GeoPackage, or Shapefile support files.');
  const match = /^data:([^;,]+);base64,([A-Za-z0-9+/=]+)$/.exec(String(body.data_url || ''));
  if (!match) throw new Error('The selected file could not be read. Please choose it again.');
  const bytes = Buffer.from(match[2], 'base64');
  if (!bytes.length || bytes.length > MAX_LIBRARY_FILE_BYTES) throw new Error('Each shared file must be smaller than 8 MB.');
  return { originalName, extension, bytes };
}
// Musi project web-map coordinates are WGS 84 longitude/latitude.  CAD users
// need metre-based coordinates, so exports use the local projected system
// WGS 84 / UTM zone 44N (EPSG:32644), together with a matching .prj file.
const UTM_44N_WKT = 'PROJCS["WGS_1984_UTM_Zone_44N",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",500000],PARAMETER["False_Northing",0],PARAMETER["Central_Meridian",81],PARAMETER["Scale_Factor",0.9996],PARAMETER["Latitude_Of_Origin",0],UNIT["Meter",1]]';
function cadBaseName(value) { return safeLibraryName(value).replace(/\.[^.]+$/, '').replace(/[^A-Za-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 80) || 'mrdcl_layer'; }
function projectWgs84ToUtm44N(position) {
  const longitude = Number(position?.[0]); const latitude = Number(position?.[1]); const elevation = Number(position?.[2] || 0);
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude) || longitude < -180 || longitude > 180 || latitude < -80 || latitude > 84) throw new Error('This layer has a coordinate outside the WGS 84 range supported by the georeferenced CAD export.');
  const a = 6378137; const eccSquared = 0.0066943799901413165; const k0 = 0.9996; const latRad = latitude * Math.PI / 180; const lonRad = longitude * Math.PI / 180; const originRad = 81 * Math.PI / 180;
  const eccPrimeSquared = eccSquared / (1 - eccSquared); const n = a / Math.sqrt(1 - eccSquared * Math.sin(latRad) ** 2); const t = Math.tan(latRad) ** 2; const c = eccPrimeSquared * Math.cos(latRad) ** 2; const aTerm = Math.cos(latRad) * (lonRad - originRad);
  const m = a * ((1 - eccSquared / 4 - 3 * eccSquared ** 2 / 64 - 5 * eccSquared ** 3 / 256) * latRad - (3 * eccSquared / 8 + 3 * eccSquared ** 2 / 32 + 45 * eccSquared ** 3 / 1024) * Math.sin(2 * latRad) + (15 * eccSquared ** 2 / 256 + 45 * eccSquared ** 3 / 1024) * Math.sin(4 * latRad) - (35 * eccSquared ** 3 / 3072) * Math.sin(6 * latRad));
  const easting = k0 * n * (aTerm + (1 - t + c) * aTerm ** 3 / 6 + (5 - 18 * t + t ** 2 + 72 * c - 58 * eccPrimeSquared) * aTerm ** 5 / 120) + 500000;
  let northing = k0 * (m + n * Math.tan(latRad) * (aTerm ** 2 / 2 + (5 - t + 9 * c + 4 * c ** 2) * aTerm ** 4 / 24 + (61 - 58 * t + t ** 2 + 600 * c - 330 * eccPrimeSquared) * aTerm ** 6 / 720));
  if (latitude < 0) northing += 10000000;
  return [easting, northing, Number.isFinite(elevation) ? elevation : 0];
}
function dxfPair(code, value) { return `${code}\r\n${value}\r\n`; }
function dxfNumber(value) { return Number(value).toFixed(3); }
function dxfLayerName(value) { return String(value || 'MRDCL_LAYER').replace(/[<>\\/":;?*|=]/g, '_').replace(/[\r\n]/g, ' ').trim().slice(0, 120) || 'MRDCL_LAYER'; }
function dxfPointEntity(position, layerName) { const [x, y, z] = projectWgs84ToUtm44N(position); return `${dxfPair(0, 'POINT')}${dxfPair(8, layerName)}${dxfPair(10, dxfNumber(x))}${dxfPair(20, dxfNumber(y))}${dxfPair(30, dxfNumber(z))}`; }
function dxfPolylineEntity(coordinates, layerName, closed = false) {
  const points = coordinates.map(projectWgs84ToUtm44N); const distinct = closed && points.length > 1 && points[0][0] === points[points.length - 1][0] && points[0][1] === points[points.length - 1][1] ? points.slice(0, -1) : points;
  if (distinct.length < (closed ? 3 : 2)) return ''; let entity = `${dxfPair(0, 'LWPOLYLINE')}${dxfPair(8, layerName)}${dxfPair(90, distinct.length)}${dxfPair(70, closed ? 1 : 0)}`;
  distinct.forEach(([x, y, z]) => { entity += `${dxfPair(10, dxfNumber(x))}${dxfPair(20, dxfNumber(y))}${dxfPair(30, dxfNumber(z))}`; }); return entity;
}
function geometryToDxf(geometry, layerName) {
  if (!geometry) return ''; if (geometry.type === 'Point') return dxfPointEntity(geometry.coordinates, layerName);
  if (geometry.type === 'LineString') return dxfPolylineEntity(geometry.coordinates, layerName, false);
  if (geometry.type === 'Polygon') return (geometry.coordinates || []).map(ring => dxfPolylineEntity(ring, layerName, true)).join('');
  if (geometry.type === 'MultiPoint') return (geometry.coordinates || []).map(point => dxfPointEntity(point, layerName)).join('');
  if (geometry.type === 'MultiLineString') return (geometry.coordinates || []).map(line => dxfPolylineEntity(line, layerName, false)).join('');
  if (geometry.type === 'MultiPolygon') return (geometry.coordinates || []).flatMap(polygon => polygon || []).map(ring => dxfPolylineEntity(ring, layerName, true)).join('');
  return '';
}
function crc32(bytes) { let crc = 0xffffffff; for (const byte of bytes) { crc ^= byte; for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1)); } return (crc ^ 0xffffffff) >>> 0; }
function createStoredZip(files) {
  let offset = 0; const entries = []; const chunks = [];
  for (const file of files) {
    const name = Buffer.from(file.name, 'utf8'); const data = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data, 'utf8'); const checksum = crc32(data); const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0); header.writeUInt16LE(20, 4); header.writeUInt16LE(0x0800, 6); header.writeUInt16LE(0, 8); header.writeUInt16LE(0, 10); header.writeUInt16LE(0, 12); header.writeUInt32LE(checksum, 14); header.writeUInt32LE(data.length, 18); header.writeUInt32LE(data.length, 22); header.writeUInt16LE(name.length, 26); header.writeUInt16LE(0, 28);
    chunks.push(header, name, data); entries.push({ name, data, checksum, offset }); offset += header.length + name.length + data.length;
  }
  const centralOffset = offset;
  for (const entry of entries) { const header = Buffer.alloc(46); header.writeUInt32LE(0x02014b50, 0); header.writeUInt16LE(20, 4); header.writeUInt16LE(20, 6); header.writeUInt16LE(0x0800, 8); header.writeUInt16LE(0, 10); header.writeUInt16LE(0, 12); header.writeUInt16LE(0, 14); header.writeUInt32LE(entry.checksum, 16); header.writeUInt32LE(entry.data.length, 20); header.writeUInt32LE(entry.data.length, 24); header.writeUInt16LE(entry.name.length, 28); header.writeUInt16LE(0, 30); header.writeUInt16LE(0, 32); header.writeUInt16LE(0, 34); header.writeUInt16LE(0, 36); header.writeUInt32LE(0, 38); header.writeUInt32LE(entry.offset, 42); chunks.push(header, entry.name); offset += header.length + entry.name.length; }
  const trailer = Buffer.alloc(22); trailer.writeUInt32LE(0x06054b50, 0); trailer.writeUInt16LE(0, 4); trailer.writeUInt16LE(0, 6); trailer.writeUInt16LE(entries.length, 8); trailer.writeUInt16LE(entries.length, 10); trailer.writeUInt32LE(offset - centralOffset, 12); trailer.writeUInt32LE(centralOffset, 16); trailer.writeUInt16LE(0, 20); chunks.push(trailer); return Buffer.concat(chunks);
}
function georeferencedCadArchive(layer) {
  const geojson = validMapLayerGeojson(parseJson(layer.geojson)); const layerName = dxfLayerName(layer.name); const entities = geojson.features.map(feature => geometryToDxf(feature.geometry, layerName)).join('');
  if (!entities) throw new Error('The layer does not contain a geometry that can be written to DXF.'); const dxf = `999\r\nMRDCL georeferenced CAD export — EPSG:32644 WGS 84 / UTM zone 44N, metres\r\n0\r\nSECTION\r\n2\r\nHEADER\r\n9\r\n$ACADVER\r\n1\r\nAC1015\r\n9\r\n$INSUNITS\r\n70\r\n6\r\n0\r\nENDSEC\r\n0\r\nSECTION\r\n2\r\nENTITIES\r\n${entities}0\r\nENDSEC\r\n0\r\nEOF\r\n`;
  const base = cadBaseName(layer.name); const readme = `MRDCL georeferenced CAD export\r\n\r\nCoordinate reference system: WGS 84 / UTM zone 44N (EPSG:32644)\r\nUnits: metres\r\n\r\nOpen the DXF in CAD. Keep the .prj alongside the DXF when adding it to ArcGIS Pro or ArcScene so the coordinate system is recognised.\r\n`;
  return { filename:`${base}_EPSG32644_CAD.zip`, bytes:createStoredZip([{ name:`${base}.dxf`, data:dxf }, { name:`${base}.prj`, data:UTM_44N_WKT }, { name:'README.txt', data:readme }]) };
}
// Drawn layers are stored twice on purpose: the live map receives the layer
// immediately and the exact same GeoJSON is retained as a normal shared
// library file for download, audit, and later reuse.  Household records and
// supplied baseline layers are never involved in this workflow.
function createDrawnLibraryLayer(user, body) {
  const name = String(body.name || '').trim().replace(/\s+/g, ' ');
  const color = String(body.color || '#005ea8').trim();
  const geojson = validMapLayerGeojson(body.geojson);
  if (name.length < 2 || name.length > 80) throw new Error('Layer name must be between 2 and 80 characters.');
  if (!/^#[0-9a-fA-F]{6}$/.test(color)) throw new Error('Choose a valid layer colour.');
  const bytes = Buffer.from(JSON.stringify(geojson, null, 2), 'utf8');
  if (bytes.length > MAX_LIBRARY_FILE_BYTES) throw new Error('The drawn GeoJSON layer must be smaller than 8 MB.');
  const originalName = `${safeLibraryName(name).replace(/\.(geojson|json)$/i, '') || 'drawn-layer'}.geojson`;
  const storedName = `${crypto.randomUUID()}.geojson`;
  const stamp = now(); const storedPath = path.join(LIBRARY_DIR, storedName);
  fs.writeFileSync(storedPath, bytes);
  try {
    db.exec('BEGIN IMMEDIATE');
    const fileResult = db.prepare('INSERT INTO shared_library_files (original_name, stored_name, mime_type, extension, size_bytes, created_at, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)').run(originalName, storedName, libraryMime('geojson'), 'geojson', bytes.length, stamp, user.username);
    const fileId = Number(fileResult.lastInsertRowid);
    const layerResult = db.prepare('INSERT INTO custom_map_layers (name, geojson, color, visible, source_file_id, created_at, created_by, updated_at, updated_by) VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?)').run(name, JSON.stringify(geojson), color, fileId, stamp, user.username, stamp, user.username);
    db.exec('COMMIT');
    return { fileId, layerId:Number(layerResult.lastInsertRowid), name, color, featureCount:geojson.features.length };
  } catch (error) {
    try { db.exec('ROLLBACK'); } catch { /* Transaction may not have started. */ }
    try { fs.unlinkSync(storedPath); } catch { /* no-op */ }
    throw error;
  }
}

function setSecurityHeaders(res) {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'same-origin');
  // Field photos use camera/GPS only after the surveyor grants permission.
  // A deployed mobile portal must use HTTPS for browsers to grant these APIs.
  res.setHeader('Permissions-Policy', 'geolocation=(self), camera=(self), microphone=()');
  res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self' https://unpkg.com; script-src 'self' https://unpkg.com; img-src 'self' data: https://server.arcgisonline.com; connect-src 'self';");
}
async function api(req, res, url) {
  const pathname = url.pathname;
  if (req.method === 'POST' && pathname === '/api/login') {
    const body = await readBody(req); const username = String(body.username || '').trim().toLowerCase(); const password = String(body.password || '');
    const user = db.prepare('SELECT * FROM users WHERE username=? AND deleted_at IS NULL').get(username);
    if (!user || !secureEqual(hash(password, user.password_salt).value, user.password_hash)) { json(res, 401, { error: 'Invalid user ID or password.' }); return; }
    const token = crypto.randomBytes(32).toString('base64url');
    db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(now());
    db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').run(token, user.id, new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString());
    const syncAt = now();
    db.prepare('UPDATE users SET last_sync_at=? WHERE id=?').run(syncAt, user.id);
    addAudit(user, 'signed in', null, 'Successful portal login');
    publishRealtime('login', { username:user.username });
    res.setHeader('Set-Cookie', `mrdcl_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=43200`);
    const teamName = user.team_id ? db.prepare('SELECT name FROM teams WHERE id=?').get(user.team_id)?.name || null : null;
    json(res, 200, { user: { username:user.username, display_name:user.display_name, role:user.role, team_id:user.team_id || null, team_name:teamName, last_sync_at:syncAt } }); return;
  }
  if (req.method === 'POST' && pathname === '/api/logout') {
    const token = parseCookies(req).mrdcl_session; if (token) db.prepare('DELETE FROM sessions WHERE token=?').run(token);
    res.setHeader('Set-Cookie', 'mrdcl_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'); json(res, 200, { ok: true }); return;
  }
  if (req.method === 'GET' && pathname === '/api/me') { const user = currentUser(req); if (!user) { json(res, 401, { error: 'Not signed in.' }); } else json(res, 200, { user }); return; }
  // Questionnaire fields are shared definitions, not household values.  Every
  // active definition is rendered for every building; hiding one never removes
  // the value already stored on a household.
  if (req.method === 'GET' && pathname === '/api/questionnaire-schema') {
    if (!requireUser(req, res)) return;
    json(res, 200, { fields:readQuestionnaireFields(), tabs:readQuestionnaireTabs() }); return;
  }
  const questionnaireTabMatch = pathname.match(/^\/api\/questionnaire-tabs\/(tab[123])$/);
  if (questionnaireTabMatch && req.method === 'PUT') {
    const user = requireUser(req, res, ['admin']); if (!user) return;
    const tabId = questionnaireTabMatch[1]; const body = await readBody(req); const current = db.prepare('SELECT * FROM questionnaire_tabs WHERE tab_id=?').get(tabId);
    if (!current) { json(res, 404, { error:'Questionnaire tab not found.' }); return; }
    const label = Object.hasOwn(body, 'label') ? String(body.label || '').trim().replace(/\s+/g, ' ') : current.label;
    if (label.length < 2 || label.length > 80) { json(res, 400, { error:'Tab name must be between 2 and 80 characters.' }); return; }
    const direction = String(body.direction || '');
    if (direction && !['left', 'right'].includes(direction)) { json(res, 400, { error:'Invalid tab arrangement request.' }); return; }
    db.exec('BEGIN IMMEDIATE');
    try {
      if (direction) {
        const tabs = readQuestionnaireTabs(); const index = tabs.findIndex(tab => tab.tab_id === tabId); const other = tabs[index + (direction === 'left' ? -1 : 1)];
        if (other) { db.prepare('UPDATE questionnaire_tabs SET sort_order=?, updated_at=?, updated_by=? WHERE tab_id=?').run(other.sort_order, now(), user.username, tabId); db.prepare('UPDATE questionnaire_tabs SET sort_order=?, updated_at=?, updated_by=? WHERE tab_id=?').run(current.sort_order, now(), user.username, other.tab_id); }
      }
      db.prepare('UPDATE questionnaire_tabs SET label=?, updated_at=?, updated_by=? WHERE tab_id=?').run(label, now(), user.username, tabId);
      addAudit(user, 'updated questionnaire tab', null, `${current.label} → ${label}`, { tab_id:tabId, label:current.label, sort_order:current.sort_order }, { tab_id:tabId, label, direction }); db.exec('COMMIT');
    } catch (error) { db.exec('ROLLBACK'); throw error; }
    publishRealtime('questionnaire-schema', { action:'tab-updated', tab_id:tabId });
    json(res, 200, { tabs:readQuestionnaireTabs() }); return;
  }
  if (req.method === 'POST' && pathname === '/api/questionnaire-schema') {
    const user = requireUser(req, res, ['admin']); if (!user) return;
    try {
      const definition = validateQuestionnaireDefinition(await readBody(req));
      const sortOrder = db.prepare('SELECT COALESCE(MAX(sort_order), -1) AS max FROM questionnaire_fields WHERE tab_id=?').get(definition.tabId).max + 1;
      const fieldKey = nextQuestionKey(definition.label);
      const result = db.prepare(`INSERT INTO questionnaire_fields (field_key, tab_id, section_name, label, input_type, options, sort_order, active, is_custom, created_at, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?)`).run(fieldKey, definition.tabId, definition.section, definition.label, definition.inputType, JSON.stringify(definition.options), sortOrder, now(), user.username);
      const field = db.prepare('SELECT * FROM questionnaire_fields WHERE id=?').get(Number(result.lastInsertRowid));
      addAudit(user, 'added questionnaire question', null, `${definition.label} in ${definition.tabId}`, null, { field_key:fieldKey, ...definition });
      publishRealtime('questionnaire-schema', { action:'added', field_id:Number(result.lastInsertRowid) });
      json(res, 201, { field:{ ...field, options:definition.options, active:true, is_custom:true } });
    } catch (error) { json(res, 400, { error:error.message || 'Could not add the question.' }); }
    return;
  }
  const questionnaireFieldMatch = pathname.match(/^\/api\/questionnaire-schema\/(\d+)$/);
  if (questionnaireFieldMatch && req.method === 'PUT') {
    const user = requireUser(req, res, ['admin']); if (!user) return;
    const id = Number(questionnaireFieldMatch[1]); const existing = db.prepare('SELECT * FROM questionnaire_fields WHERE id=?').get(id);
    if (!existing) { json(res, 404, { error:'Question not found.' }); return; }
    try {
      const definition = validateQuestionnaireDefinition(await readBody(req));
      db.prepare('UPDATE questionnaire_fields SET tab_id=?, section_name=?, label=?, input_type=?, options=? WHERE id=?').run(definition.tabId, definition.section, definition.label, definition.inputType, JSON.stringify(definition.options), id);
      addAudit(user, 'updated questionnaire question', null, existing.label, { field_key:existing.field_key, label:existing.label }, { field_key:existing.field_key, ...definition });
      publishRealtime('questionnaire-schema', { action:'updated', field_id:id });
      json(res, 200, { field:readQuestionnaireFields(true).find(field => field.id === id) });
    } catch (error) { json(res, 400, { error:error.message || 'Could not update the question.' }); }
    return;
  }
  if (questionnaireFieldMatch && req.method === 'DELETE') {
    const user = requireUser(req, res, ['admin']); if (!user) return;
    const id = Number(questionnaireFieldMatch[1]); const existing = db.prepare('SELECT * FROM questionnaire_fields WHERE id=?').get(id);
    if (!existing) { json(res, 404, { error:'Question not found.' }); return; }
    if (!existing.active) { json(res, 200, { ok:true, already_retired:true }); return; }
    db.prepare('UPDATE questionnaire_fields SET active=0, retired_at=?, retired_by=? WHERE id=?').run(now(), user.username, id);
    addAudit(user, 'retired questionnaire question', null, existing.label, { field_key:existing.field_key, label:existing.label }, null);
    publishRealtime('questionnaire-schema', { action:'retired', field_id:id });
    json(res, 200, { ok:true }); return;
  }
  // Server-sent events are a persistent server realtime channel. They use the
  // authenticated session cookie and contain only a change notification; the
  // browser re-reads records through the normal role-checked API.
  if (req.method === 'GET' && pathname === '/api/realtime') {
    const user = requireUser(req, res); if (!user) return;
    const syncAt = now(); db.prepare('UPDATE users SET last_sync_at=? WHERE id=?').run(syncAt, user.id);
    res.writeHead(200, {
      'Content-Type':'text/event-stream; charset=utf-8', 'Cache-Control':'no-cache, no-transform',
      Connection:'keep-alive', 'X-Accel-Buffering':'no'
    });
    res.write(`retry: 2000\nevent: connected\ndata: ${JSON.stringify({ at:syncAt, username:user.username })}\n\n`);
    const client = { res, user }; realtimeClients.add(client);
    req.on('close', () => realtimeClients.delete(client));
    return;
  }
  if (req.method === 'GET' && pathname === '/api/map-layers') {
    if (!requireUser(req, res)) return;
    if (!fs.existsSync(MAP_LAYERS)) { json(res, 200, { layers: [] }); return; }
    json(res, 200, JSON.parse(fs.readFileSync(MAP_LAYERS, 'utf8'))); return;
  }
  if (req.method === 'GET' && pathname === '/api/library-files') {
    if (!requireUser(req, res)) return;
    json(res, 200, { files:readLibraryFiles(), max_file_bytes:MAX_LIBRARY_FILE_BYTES }); return;
  }
  if (req.method === 'POST' && pathname === '/api/library-files') {
    const user = requireUser(req, res); if (!user) return;
    try {
      const upload = readLibraryUpload(await readBody(req)); const storedName = `${crypto.randomUUID()}.${upload.extension}`;
      const stamp = now(); fs.writeFileSync(path.join(LIBRARY_DIR, storedName), upload.bytes);
      const result = db.prepare('INSERT INTO shared_library_files (original_name, stored_name, mime_type, extension, size_bytes, created_at, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)').run(upload.originalName, storedName, libraryMime(upload.extension), upload.extension, upload.bytes.length, stamp, user.username);
      const file = libraryFile(db.prepare('SELECT * FROM shared_library_files WHERE id=?').get(Number(result.lastInsertRowid)));
      addAudit(user, 'added shared library file', null, upload.originalName, null, { extension:upload.extension, size_bytes:upload.bytes.length }); publishRealtime('library-file', { action:'added', file_id:file.id }); json(res, 201, { file });
    } catch (error) { json(res, 400, { error:error.message || 'Could not add the shared file.' }); }
    return;
  }
  const libraryFileMatch = pathname.match(/^\/api\/library-files\/(\d+)$/);
  const libraryDownloadMatch = pathname.match(/^\/api\/library-files\/(\d+)\/download$/);
  const libraryMapMatch = pathname.match(/^\/api\/library-files\/(\d+)\/map-layer$/);
  if (libraryDownloadMatch && req.method === 'GET') {
    if (!requireUser(req, res)) return; const file = db.prepare('SELECT * FROM shared_library_files WHERE id=?').get(Number(libraryDownloadMatch[1]));
    if (!file || !fs.existsSync(path.join(LIBRARY_DIR, file.stored_name))) { json(res, 404, { error:'Shared file not found.' }); return; }
    download(res, safeLibraryName(file.original_name), libraryMime(file.extension), fs.readFileSync(path.join(LIBRARY_DIR, file.stored_name))); return;
  }
  if (libraryMapMatch && req.method === 'POST') {
    const user = requireUser(req, res); if (!user) return; const file = db.prepare('SELECT * FROM shared_library_files WHERE id=?').get(Number(libraryMapMatch[1]));
    if (!file || !fs.existsSync(path.join(LIBRARY_DIR, file.stored_name))) { json(res, 404, { error:'Shared file not found.' }); return; }
    if (!['geojson','json'].includes(String(file.extension).toLowerCase())) { json(res, 400, { error:'Only GeoJSON files can be added directly to the map. Keep KML, GeoPackage, and Shapefile files in the library for download or convert them to GeoJSON first.' }); return; }
    try {
      const geojson = validMapLayerGeojson(JSON.parse(fs.readFileSync(path.join(LIBRARY_DIR, file.stored_name), 'utf8'))); const body = await readBody(req); const color = String(body.color || '#005ea8').trim();
      if (!/^#[0-9a-fA-F]{6}$/.test(color)) throw new Error('Choose a valid layer colour.');
      const name = String(body.name || path.basename(file.original_name, path.extname(file.original_name))).trim().replace(/\s+/g, ' ').slice(0, 80) || 'Shared GIS layer'; const existing = db.prepare('SELECT * FROM custom_map_layers WHERE source_file_id=?').get(file.id); const stamp = now();
      let layerId;
      if (existing) { db.prepare('UPDATE custom_map_layers SET name=?, geojson=?, color=?, visible=1, updated_at=?, updated_by=? WHERE id=?').run(name, JSON.stringify(geojson), color, stamp, user.username, existing.id); layerId=existing.id; }
      else { const result = db.prepare('INSERT INTO custom_map_layers (name, geojson, color, visible, source_file_id, created_at, created_by, updated_at, updated_by) VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?)').run(name, JSON.stringify(geojson), color, file.id, stamp, user.username, stamp, user.username); layerId=Number(result.lastInsertRowid); }
      addAudit(user, existing ? 'updated shared GIS layer from library' : 'added shared GIS layer from library', null, name, null, { file_id:file.id, feature_count:geojson.features.length, color }); publishRealtime('map-layer', { action:existing ? 'updated' : 'added', layer_id:layerId, source_file_id:file.id }); json(res, 200, { layer:readCustomMapLayers().find(layer => layer.id === Number(layerId)) });
    } catch (error) { json(res, 400, { error:error.message || 'Could not add the shared GIS file to the map.' }); }
    return;
  }
  if (libraryFileMatch && req.method === 'DELETE') {
    const user = requireUser(req, res); if (!user) return; const file = db.prepare('SELECT * FROM shared_library_files WHERE id=?').get(Number(libraryFileMatch[1]));
    if (!file) { json(res, 404, { error:'Shared file not found.' }); return; }
    const linked = db.prepare('SELECT id FROM custom_map_layers WHERE source_file_id=?').all(file.id); db.exec('BEGIN IMMEDIATE');
    try { db.prepare('DELETE FROM custom_map_layers WHERE source_file_id=?').run(file.id); db.prepare('DELETE FROM shared_library_files WHERE id=?').run(file.id); db.exec('COMMIT'); }
    catch (error) { db.exec('ROLLBACK'); throw error; }
    try { fs.unlinkSync(path.join(LIBRARY_DIR, file.stored_name)); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    addAudit(user, 'deleted shared library file', null, file.original_name, { extension:file.extension, size_bytes:file.size_bytes }, null); publishRealtime('library-file', { action:'removed', file_id:file.id }); linked.forEach(layer => publishRealtime('map-layer', { action:'removed', layer_id:layer.id, source_file_id:file.id })); json(res, 200, { ok:true }); return;
  }
  if (req.method === 'GET' && pathname === '/api/custom-map-layers') {
    if (!requireUser(req, res)) return;
    json(res, 200, { layers:readCustomMapLayers() }); return;
  }
  if (req.method === 'POST' && pathname === '/api/custom-map-layers') {
    const user = requireUser(req, res); if (!user) return;
    try {
      const body = await readBody(req); const name = String(body.name || '').trim().replace(/\s+/g, ' '); const color = String(body.color || '#7c3aed').trim(); const geojson = validMapLayerGeojson(body.geojson);
      if (name.length < 2 || name.length > 80) throw new Error('Layer name must be between 2 and 80 characters.');
      if (!/^#[0-9a-fA-F]{6}$/.test(color)) throw new Error('Choose a valid layer colour.');
      const stamp = now(); const result = db.prepare('INSERT INTO custom_map_layers (name, geojson, color, visible, created_at, created_by, updated_at, updated_by) VALUES (?, ?, ?, 1, ?, ?, ?, ?)').run(name, JSON.stringify(geojson), color, stamp, user.username, stamp, user.username);
      addAudit(user, 'added shared GIS layer', null, name, null, { feature_count:geojson.features.length, color }); publishRealtime('map-layer', { action:'added', layer_id:Number(result.lastInsertRowid) }); json(res, 201, { layer:readCustomMapLayers().find(layer => layer.id === Number(result.lastInsertRowid)) });
    } catch (error) { json(res, 400, { error:error.message || 'Could not add the map layer.' }); }
    return;
  }
  if (req.method === 'POST' && pathname === '/api/drawn-map-layers') {
    const user = requireUser(req, res); if (!user) return;
    try {
      const result = createDrawnLibraryLayer(user, await readBody(req));
      addAudit(user, 'created shared GIS layer', null, result.name, null, { file_id:result.fileId, layer_id:result.layerId, feature_count:result.featureCount, color:result.color });
      publishRealtime('library-file', { action:'added', file_id:result.fileId });
      publishRealtime('map-layer', { action:'added', layer_id:result.layerId, source_file_id:result.fileId });
      json(res, 201, { file:libraryFile(db.prepare('SELECT * FROM shared_library_files WHERE id=?').get(result.fileId)), layer:readCustomMapLayers().find(layer => layer.id === result.layerId) });
    } catch (error) { json(res, 400, { error:error.message || 'Could not save the drawn GIS layer.' }); }
    return;
  }
  const customMapLayerCadMatch = pathname.match(/^\/api\/custom-map-layers\/(\d+)\/export\/cad$/);
  if (customMapLayerCadMatch && req.method === 'GET') {
    const user = requireUser(req, res); if (!user) return; const layer = db.prepare('SELECT * FROM custom_map_layers WHERE id=?').get(Number(customMapLayerCadMatch[1]));
    if (!layer) { json(res, 404, { error:'Map layer not found.' }); return; }
    try {
      const archive = georeferencedCadArchive(layer); addAudit(user, 'exported georeferenced CAD layer', null, layer.name, null, { layer_id:Number(layer.id), crs:'EPSG:32644', format:'DXF + PRJ ZIP' });
      download(res, archive.filename, 'application/zip', archive.bytes);
    } catch (error) { json(res, 400, { error:error.message || 'Could not create the georeferenced CAD export.' }); }
    return;
  }
  const customMapLayerMatch = pathname.match(/^\/api\/custom-map-layers\/(\d+)$/);
  if (customMapLayerMatch && req.method === 'PUT') {
    const user = requireUser(req, res); if (!user) return; const id = Number(customMapLayerMatch[1]); const previous = db.prepare('SELECT * FROM custom_map_layers WHERE id=?').get(id);
    if (!previous) { json(res, 404, { error:'Map layer not found.' }); return; }
    try {
      const body = await readBody(req); const name = body.name === undefined ? previous.name : String(body.name).trim().replace(/\s+/g, ' '); const color = body.color === undefined ? previous.color : String(body.color).trim(); const visible = body.visible === undefined ? previous.visible : body.visible ? 1 : 0; const geojson = body.geojson === undefined ? parseJson(previous.geojson) : validMapLayerGeojson(body.geojson);
      if (name.length < 2 || name.length > 80) throw new Error('Layer name must be between 2 and 80 characters.'); if (!/^#[0-9a-fA-F]{6}$/.test(color)) throw new Error('Choose a valid layer colour.');
      // When a layer was created from a library GeoJSON (including a drawn
      // layer), editing its shape also updates the downloadable source file.
      // This keeps the two representations in step without touching baseline
      // survey data or any unrelated library file.
      if (body.geojson !== undefined && previous.source_file_id) {
        const source = db.prepare('SELECT * FROM shared_library_files WHERE id=?').get(previous.source_file_id);
        if (!source || !fs.existsSync(path.join(LIBRARY_DIR, source.stored_name))) throw new Error('The linked GeoJSON source file is unavailable.');
        const bytes = Buffer.from(JSON.stringify(geojson, null, 2), 'utf8');
        if (bytes.length > MAX_LIBRARY_FILE_BYTES) throw new Error('The updated GeoJSON layer must be smaller than 8 MB.');
        const target = path.join(LIBRARY_DIR, source.stored_name); const temporary = `${target}.${crypto.randomUUID()}.tmp`;
        fs.writeFileSync(temporary, bytes); fs.renameSync(temporary, target);
        db.prepare('UPDATE shared_library_files SET size_bytes=? WHERE id=?').run(bytes.length, source.id);
      }
      db.prepare('UPDATE custom_map_layers SET name=?, geojson=?, color=?, visible=?, updated_at=?, updated_by=? WHERE id=?').run(name, JSON.stringify(geojson), color, visible, now(), user.username, id); addAudit(user, 'updated shared GIS layer', null, name, { name:previous.name, color:previous.color, visible:Boolean(previous.visible) }, { name, color, visible:Boolean(visible) }); publishRealtime('map-layer', { action:'updated', layer_id:id }); json(res, 200, { layer:readCustomMapLayers().find(layer => layer.id === id) });
    } catch (error) { json(res, 400, { error:error.message || 'Could not update the map layer.' }); }
    return;
  }
  if (customMapLayerMatch && req.method === 'DELETE') {
    const user = requireUser(req, res); if (!user) return; const id = Number(customMapLayerMatch[1]); const layer = db.prepare('SELECT * FROM custom_map_layers WHERE id=?').get(id); if (!layer) { json(res, 404, { error:'Map layer not found.' }); return; }
    db.prepare('DELETE FROM custom_map_layers WHERE id=?').run(id); addAudit(user, 'removed shared GIS layer', null, layer.name); publishRealtime('map-layer', { action:'removed', layer_id:id }); json(res, 200, { ok:true }); return;
  }
  if (req.method === 'GET' && pathname === '/api/bifurcated-buildings') {
    if (!requireUser(req, res)) return;
    if (!fs.existsSync(BIFURCATED_LAYER)) { json(res, 200, { type:'FeatureCollection', features:[] }); return; }
    json(res, 200, JSON.parse(fs.readFileSync(BIFURCATED_LAYER, 'utf8'))); return;
  }
  if (req.method === 'GET' && pathname === '/api/households') {
    const user = requireUser(req, res); if (!user) return;
    const q = (url.searchParams.get('q') || '').trim().toLowerCase(); const status = url.searchParams.get('status') || ''; const team = url.searchParams.get('team') || '';
    const rows = db.prepare('SELECT * FROM households').all();
    const features = rows.map(row => { const item = toHousehold(row); item.properties.ghmc_zone = ghmcZoneForGeometry(item.id, item.geometry); return item; }).filter(item => {
      const p = item.properties;
      const haystack = [item.id, p.NameOwnRep, p.BuildingID, p.HNoPlotNo, p.Contact, p.ColnyStrtN, p.TPIN].join(' ').toLowerCase();
      const teamMatches = !team || (team === 'Unassigned' ? !p.assigned_team || p.assigned_team === 'Unassigned' : p.assigned_team === team);
      return canAccessHousehold(user, item) && (!q || haystack.includes(q)) && (!status || surveyStatus(p.survey_status) === status) && teamMatches;
    }).map(item => ({ type: 'Feature', id: item.id, geometry: item.geometry, properties: { ...item.properties, revision: item.revision, updated_at: item.updated_at, updated_by: item.updated_by } }));
    json(res, 200, { type: 'FeatureCollection', features }); return;
  }
  const householdPhotosMatch = pathname.match(/^\/api\/households\/([^/]+)\/photos$/);
  if (householdPhotosMatch && req.method === 'GET') {
    const user = requireUser(req, res); if (!user) return; const id = decodeURIComponent(householdPhotosMatch[1]);
    const household = db.prepare('SELECT * FROM households WHERE id=?').get(id);
    if (!household) { json(res, 404, { error:'Household not found.' }); return; }
    if (!canAccessHousehold(user, household)) { json(res, 403, { error:'This household is not assigned to you.' }); return; }
    const photos = db.prepare('SELECT id, household_id, filename, original_name, mime_type, latitude, longitude, captured_at, uploaded_at, uploaded_by FROM photo_uploads WHERE household_id=? ORDER BY id DESC').all(id).map(photo => ({ ...photo, url:`/api/photos/${photo.id}/file`, download_url:`/api/photos/${photo.id}/download` }));
    json(res, 200, { photos }); return;
  }
  if (householdPhotosMatch && req.method === 'POST') {
    const user = requireUser(req, res, ['admin', 'editor']); if (!user) return; const id = decodeURIComponent(householdPhotosMatch[1]); const row = db.prepare('SELECT id FROM households WHERE id=?').get(id); if (!row) { json(res, 404, { error:'Household not found.' }); return; }
    const household = db.prepare('SELECT * FROM households WHERE id=?').get(id);
    if (!canAccessHousehold(user, household)) { json(res, 403, { error:'This household is not assigned to you.' }); return; }
    const body = await readBody(req); const mime = String(body.mime_type || ''); const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(body.data_url || ''));
    if (!match || match[1] !== mime) { json(res, 400, { error:'Use a JPG, PNG, or WebP photo.' }); return; }
    const bytes = Buffer.from(match[2], 'base64'); if (!bytes.length || bytes.length > MAX_PHOTO_BYTES) { json(res, 400, { error:'Photo must be smaller than 15 MB.' }); return; }
    const ext = ({ 'image/jpeg':'jpg', 'image/png':'png', 'image/webp':'webp' })[mime]; const filename = `${id.replace(/[^A-Za-z0-9_-]/g, '_')}-${crypto.randomUUID()}.${ext}`; const original = String(body.filename || `photo.${ext}`).slice(0, 180); const lat = Number(body.latitude); const lng = Number(body.longitude);
    fs.writeFileSync(path.join(UPLOAD_DIR, filename), bytes); const stamp = now(); const result = db.prepare('INSERT INTO photo_uploads (household_id, filename, original_name, mime_type, latitude, longitude, captured_at, uploaded_at, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(id, filename, original, mime, Number.isFinite(lat) ? lat : null, Number.isFinite(lng) ? lng : null, String(body.captured_at || stamp), stamp, user.username); addAudit(user, 'uploaded field photo', id, original, null, { original_name:original, latitude:Number.isFinite(lat) ? lat : null, longitude:Number.isFinite(lng) ? lng : null }); publishRealtime('photo', { household_id:id });
    json(res, 201, { photo:{ id:Number(result.lastInsertRowid), household_id:id, filename, original_name:original, mime_type:mime, latitude:Number.isFinite(lat) ? lat : null, longitude:Number.isFinite(lng) ? lng : null, captured_at:String(body.captured_at || stamp), uploaded_at:stamp, uploaded_by:user.username, url:`/api/photos/${Number(result.lastInsertRowid)}/file`, download_url:`/api/photos/${Number(result.lastInsertRowid)}/download` } }); return;
  }
  const householdMatch = pathname.match(/^\/api\/households\/([^/]+)$/);
  if (householdMatch && req.method === 'GET') {
    const user = requireUser(req, res); if (!user) return; const row = db.prepare('SELECT * FROM households WHERE id=?').get(decodeURIComponent(householdMatch[1]));
    if (!row) { json(res, 404, { error: 'Household not found.' }); return; }
    if (!canAccessHousehold(user, row)) { json(res, 403, { error:'This household is not assigned to you.' }); return; }
    const household = toHousehold(row); household.properties.ghmc_zone = ghmcZoneForGeometry(household.id, household.geometry); json(res, 200, { household }); return;
  }
  if (householdMatch && req.method === 'PUT') {
    const user = requireUser(req, res, ['admin', 'editor']); if (!user) return;
    const id = decodeURIComponent(householdMatch[1]); const body = await readBody(req); const row = db.prepare('SELECT * FROM households WHERE id=?').get(id);
    if (!row) { json(res, 404, { error: 'Household not found.' }); return; }
    if (!canAccessHousehold(user, row)) { json(res, 403, { error:'This household is not assigned to you.' }); return; }
    if (!Number.isInteger(body.revision) || body.revision !== row.revision) { json(res, 409, { error: 'This household was changed by another user. Reload it before saving.', household: toHousehold(row) }); return; }
    if (!body.data || typeof body.data !== 'object' || Array.isArray(body.data)) { json(res, 400, { error: 'A questionnaire data object is required.' }); return; }
    const incoming = {};
    for (const [key, rawValue] of Object.entries(body.data)) {
      if (!isEditableField(key)) continue;
      const value = rawValue === null ? null : String(rawValue).trim();
      // Building IDs and workflow fields are controlled by administrators.
      if (user.role !== 'admin' && ['BuildingID', 'assigned_team', 'verification_status', 'verification_date'].includes(key)) continue;
      if (user.role !== 'admin' && key === 'survey_status' && value === 'Verified') { json(res, 403, { error: 'Only an administrator can finalise a household as Verified.' }); return; }
      const lengthLimit = key.startsWith('q_') || key === 'household_members' || key === 'occupier_members' ? 12000 : 2000;
      if (value !== null && value.length > lengthLimit) { json(res, 400, { error: `${key} is too long.` }); return; }
      incoming[key] = value;
    }
    const previous = parseJson(row.survey);
    const timestamp = now();
    // Status is server-controlled so it remains correct for normal, offline,
    // and queued saves alike: started or incomplete work is Pending; a fully
    // answered questionnaire is Surveyed; review endpoints control Verified
    // and Flagged / Revisit.
    applyAutomaticSurveyStatus(previous, incoming, user, timestamp);
    const survey = { ...previous, ...incoming };
    const changed = Object.keys(incoming).filter(key => previous[key] !== incoming[key]);
    if (!changed.length) { json(res, 200, { household: toHousehold(row), unchanged: true }); return; }
    db.exec('BEGIN IMMEDIATE');
    try {
      db.prepare('UPDATE households SET survey=?, revision=revision+1, updated_at=?, updated_by=? WHERE id=? AND revision=?').run(JSON.stringify(survey), timestamp, user.username, id, row.revision);
      const before = Object.fromEntries(changed.map(key => [key, previous[key] ?? parseJson(row.baseline)[key] ?? null]));
      const after = Object.fromEntries(changed.map(key => [key, survey[key] ?? null]));
      addAudit(user, 'updated questionnaire', id, `Changed: ${changed.join(', ')}`, before, after); db.exec('COMMIT');
    } catch (error) { db.exec('ROLLBACK'); throw error; }
    publishRealtime('household', { household_id:id, changed });
    json(res, 200, { household: toHousehold(db.prepare('SELECT * FROM households WHERE id=?').get(id)), changed }); return;
  }
  const conflictResolutionMatch = pathname.match(/^\/api\/households\/([^/]+)\/resolve-conflict$/);
  if (conflictResolutionMatch && req.method === 'POST') {
    const user = requireUser(req, res, ['admin', 'editor']); if (!user) return;
    const id = decodeURIComponent(conflictResolutionMatch[1]); const body = await readBody(req);
    const row = db.prepare('SELECT * FROM households WHERE id=?').get(id);
    if (!row) { json(res, 404, { error:'Household not found.' }); return; }
    if (!canAccessHousehold(user, row)) { json(res, 403, { error:'This household is not assigned to you.' }); return; }
    if (!Number.isInteger(body.revision) || body.revision !== row.revision) { json(res, 409, { error:'The server copy changed again. Please compare the latest version.', household:toHousehold(row) }); return; }
    const resolution = String(body.resolution || '');
    if (!['keep_server', 'keep_mine', 'merge'].includes(resolution)) { json(res, 400, { error:'Choose a valid conflict resolution.' }); return; }
    const serverSurvey = parseJson(row.survey);
    if (resolution === 'keep_server') {
      addAudit(user, 'resolved sync conflict', id, 'Kept server version', body.local_data || null, serverSurvey);
      publishRealtime('conflict-resolved', { household_id:id });
      json(res, 200, { household:toHousehold(row), resolution }); return;
    }
    if (!body.data || typeof body.data !== 'object' || Array.isArray(body.data)) { json(res, 400, { error:'Conflict changes are required.' }); return; }
    const incoming = {};
    for (const [key, rawValue] of Object.entries(body.data)) {
      if (!isEditableField(key)) continue;
      if (user.role !== 'admin' && ['BuildingID', 'assigned_team', 'verification_status', 'verification_date'].includes(key)) continue;
      const value = rawValue === null ? null : String(rawValue).trim();
      const limit = key.startsWith('q_') || key === 'household_members' || key === 'occupier_members' ? 12000 : 2000;
      if (value !== null && value.length > limit) { json(res, 400, { error:`${key} is too long.` }); return; }
      incoming[key] = value;
    }
    applyAutomaticSurveyStatus(serverSurvey, incoming, user, now());
    const nextSurvey = { ...serverSurvey, ...incoming }; const changed = Object.keys(incoming).filter(key => serverSurvey[key] !== incoming[key]);
    if (changed.length) {
      const stamp = now();
      db.exec('BEGIN IMMEDIATE');
      try {
        db.prepare('UPDATE households SET survey=?, revision=revision+1, updated_at=?, updated_by=? WHERE id=? AND revision=?').run(JSON.stringify(nextSurvey), stamp, user.username, id, row.revision);
        addAudit(user, 'resolved sync conflict', id, resolution === 'keep_mine' ? 'Kept field version' : `Merged ${changed.join(', ')}`, Object.fromEntries(changed.map(key => [key, serverSurvey[key] ?? parseJson(row.baseline)[key] ?? null])), Object.fromEntries(changed.map(key => [key, nextSurvey[key] ?? null])));
        db.exec('COMMIT');
      } catch (error) { db.exec('ROLLBACK'); throw error; }
    } else addAudit(user, 'resolved sync conflict', id, 'No local changes remained after comparison');
    publishRealtime('conflict-resolved', { household_id:id, resolution });
    json(res, 200, { household:toHousehold(db.prepare('SELECT * FROM households WHERE id=?').get(id)), resolution, changed }); return;
  }
  const householdExportMatch = pathname.match(/^\/api\/households\/([^/]+)\/export\/(geojson|kml|xlsx|word|csv|shapefile|pdf)$/);
  if (householdExportMatch && req.method === 'GET') {
    const user = requireUser(req, res); if (!user) return;
    const id = decodeURIComponent(householdExportMatch[1]); const row = db.prepare('SELECT * FROM households WHERE id=?').get(id);
    if (!row) { json(res, 404, { error:'Household not found.' }); return; }
    if (!canAccessHousehold(user, row)) { json(res, 403, { error:'This household is not assigned to you.' }); return; }
    sendExport(res, [toHousehold(row)], householdExportMatch[2], `mrdcl-household-${id}`); return;
  }
  const householdHistoryMatch = pathname.match(/^\/api\/households\/([^/]+)\/history$/);
  if (householdHistoryMatch && req.method === 'GET') {
    const user = requireUser(req, res); if (!user) return;
    const id = decodeURIComponent(householdHistoryMatch[1]); const row = db.prepare('SELECT * FROM households WHERE id=?').get(id);
    if (!row) { json(res, 404, { error:'Household not found.' }); return; }
    if (!canAccessHousehold(user, row)) { json(res, 403, { error:'This household is not assigned to you.' }); return; }
    const items = db.prepare(`SELECT a.at, a.username, COALESCE(u.display_name, a.username) AS display_name, a.action, a.detail
      FROM audit_log a LEFT JOIN users u ON u.id=a.user_id WHERE a.household_id=? ORDER BY a.id DESC LIMIT 100`).all(id);
    const lastEditor = row.updated_by ? db.prepare('SELECT display_name FROM users WHERE username=?').get(row.updated_by)?.display_name || row.updated_by : null;
    json(res, 200, { last_editor:lastEditor, last_edited_at:row.updated_at || null, items }); return;
  }
  const householdReviewMatch = pathname.match(/^\/api\/households\/([^/]+)\/review$/);
  if (householdReviewMatch && req.method === 'GET') {
    const user = requireUser(req, res, ['admin', 'authority']); if (!user) return;
    const id = decodeURIComponent(householdReviewMatch[1]); const row = db.prepare('SELECT id FROM households WHERE id=?').get(id);
    if (!row) { json(res, 404, { error:'Household not found.' }); return; }
    const items = db.prepare('SELECT at, username, action, detail FROM audit_log WHERE household_id=? ORDER BY id DESC LIMIT 30').all(id);
    json(res, 200, { items }); return;
  }
  if (householdReviewMatch && req.method === 'POST') {
    const user = requireUser(req, res, ['admin', 'authority']); if (!user) return;
    const id = decodeURIComponent(householdReviewMatch[1]); const body = await readBody(req); const row = db.prepare('SELECT * FROM households WHERE id=?').get(id);
    if (!row) { json(res, 404, { error:'Household not found.' }); return; }
    if (!Number.isInteger(body.revision) || body.revision !== row.revision) { json(res, 409, { error:'This household was changed by another user. Reload it before reviewing.', household:toHousehold(row) }); return; }
    const decisions = { checked:['Checked', null], corrections:['Correction required', 'Flagged / Revisit'], approved:['Approved', 'Verified'] };
    if (!Object.hasOwn(decisions, body.decision)) { json(res, 400, { error:'Choose a valid review decision.' }); return; }
    const note = String(body.notes || '').trim(); if (note.length > 2000) { json(res, 400, { error:'Review note is too long.' }); return; }
    const previous = parseJson(row.survey); const [verificationStatus, nextSurveyStatus] = decisions[body.decision]; const timestamp = now(); const survey = { ...previous, verification_status:verificationStatus, review_notes:note || previous.review_notes || '' };
    if (nextSurveyStatus) survey.survey_status = nextSurveyStatus;
    if (body.decision === 'approved') survey.verification_date = timestamp;
    db.exec('BEGIN IMMEDIATE');
    try { db.prepare('UPDATE households SET survey=?, revision=revision+1, updated_at=?, updated_by=? WHERE id=? AND revision=?').run(JSON.stringify(survey), timestamp, user.username, id, row.revision); addAudit(user, body.decision === 'approved' ? 'verified and finalised household' : 'reviewed household', id, `${verificationStatus}${note ? ` — ${note}` : ''}`, { survey_status:previous.survey_status || 'Not started', verification_status:previous.verification_status || 'Pending', verification_date:previous.verification_date || null }, { survey_status:survey.survey_status || previous.survey_status || 'Not started', verification_status, verification_date:survey.verification_date || null }); db.exec('COMMIT'); } catch (error) { db.exec('ROLLBACK'); throw error; }
    publishRealtime('review', { household_id:id, decision:body.decision });
    json(res, 200, { household:toHousehold(db.prepare('SELECT * FROM households WHERE id=?').get(id)), decision:body.decision }); return;
  }
  if (req.method === 'GET' && pathname === '/api/dashboard-overview') {
    if (!requireUser(req, res, ['admin', 'authority'])) return;
    const rows = db.prepare('SELECT * FROM households').all(); const statusCounts = { Pending:0, Surveyed:0, Verified:0, 'Flagged / Revisit':0 }; const zones = new Map(); const ghmcZones = new Map(); const buildingIds = new Map(); const photos = db.prepare('SELECT household_id, latitude, longitude FROM photo_uploads').all(); const photosByHousehold = new Map(); const qualityHouseholds = { missing_photo:[], gps_off_location:[], duplicate_building_id:[], incomplete_form:[] };
    for (const photo of photos) { if (!photosByHousehold.has(photo.household_id)) photosByHousehold.set(photo.household_id, []); photosByHousehold.get(photo.household_id).push(photo); }
    let missingPhoto = 0; let offLocation = 0; let incomplete = 0;
    for (const row of rows) {
      const item = toHousehold(row); const p = item.properties; const status = surveyStatus(p.survey_status); statusCounts[status] = (statusCounts[status] || 0) + 1;
      const zoneName = String(p.Zone_1 || p.Zonewise || p.Zone || 'Not recorded').trim() || 'Not recorded'; const zone = zones.get(zoneName) || { zone:zoneName, total:0, done:0, pending:0, statuses:{ Pending:0, Surveyed:0, Verified:0, 'Flagged / Revisit':0 } }; zone.total++; zone.statuses[status] = (zone.statuses[status] || 0) + 1; if (['Surveyed','Verified'].includes(status)) zone.done++; else zone.pending++; zones.set(zoneName, zone);
      const ghmcZoneName = ghmcZoneForGeometry(item.id, item.geometry); const ghmcZone = ghmcZones.get(ghmcZoneName) || { zone:ghmcZoneName, total:0, done:0, pending:0, statuses:{ Pending:0, Surveyed:0, Verified:0, 'Flagged / Revisit':0 } }; ghmcZone.total++; ghmcZone.statuses[status] = (ghmcZone.statuses[status] || 0) + 1; if (['Surveyed','Verified'].includes(status)) ghmcZone.done++; else ghmcZone.pending++; ghmcZones.set(ghmcZoneName, ghmcZone);
      const building = String(p.BuildingID || '').trim(); if (building) { const ids = buildingIds.get(building) || []; ids.push(item.id); buildingIds.set(building, ids); }
      const householdPhotos = photosByHousehold.get(item.id) || []; if (!householdPhotos.length) { missingPhoto++; qualityHouseholds.missing_photo.push(item.id); }
      const centre = geometryCentre(item.geometry); if (centre && householdPhotos.some(photo => Number.isFinite(photo.latitude) && Number.isFinite(photo.longitude) && (distanceMetres(centre, { latitude:photo.latitude, longitude:photo.longitude }) || 0) > 250)) { offLocation++; qualityHouseholds.gps_off_location.push(item.id); }
      const required = ['NameOwnRep', 'HNoPlotNo', 'Survey_Dat', 'q_construction_type']; if (['Surveyed','Verified'].includes(status) && required.some(key => !String(p[key] ?? '').trim())) { incomplete++; qualityHouseholds.incomplete_form.push(item.id); }
    }
    qualityHouseholds.duplicate_building_id = [...buildingIds.values()].filter(ids => ids.length > 1).flat();
    const duplicateHouseholds = qualityHouseholds.duplicate_building_id.length;
    const today = now().slice(0, 10); const auditItems = db.prepare('SELECT a.at, a.username, a.action, a.household_id, a.detail, u.role, u.display_name FROM audit_log a LEFT JOIN users u ON u.id=a.user_id ORDER BY a.id DESC LIMIT 250').all(); const people = new Map(); const users = db.prepare('SELECT username, display_name, role, last_sync_at FROM users ORDER BY display_name').all(); let fieldToday = 0; let officeToday = 0;
    users.forEach(user => people.set(user.username, { username:user.username, display_name:user.display_name || user.username, role:user.role, today:0, last_activity:null, last_sync:user.last_sync_at || null }));
    for (const item of auditItems) {
      const isToday = item.at.slice(0, 10) === today; if (isToday && item.role === 'editor') fieldToday++; if (isToday && ['admin','authority'].includes(item.role)) officeToday++;
      const entry = people.get(item.username) || { username:item.username, display_name:item.display_name || item.username, role:item.role || 'unknown', today:0, last_activity:null, last_sync:null };
      if (isToday && /updated questionnaire|uploaded field photo|assigned household/.test(item.action)) entry.today++;
      if (!entry.last_activity || item.at > entry.last_activity) entry.last_activity = item.at; people.set(item.username, entry);
    }
    const total = rows.length; const done = statusCounts.Surveyed + statusCounts.Verified;
    json(res, 200, {
      generated_at:now(), total, status_counts:statusCounts,
      kpis:{ surveyed:done, pending:statusCounts.Pending, revisit:statusCounts['Flagged / Revisit'], verified:statusCounts.Verified },
      pipeline:[['Pending', statusCounts.Pending], ['Surveyed', statusCounts.Surveyed], ['Verified', statusCounts.Verified], ['Flagged / Revisit', statusCounts['Flagged / Revisit']]],
      team_activity:{ field_today:fieldToday, office_today:officeToday, users:[...people.values()].sort((a,b) => b.today - a.today || String(b.last_sync || b.last_activity).localeCompare(String(a.last_sync || a.last_activity))).slice(0,20) },
      musi_phase_zones:[...zones.values()].sort((a,b) => a.zone.localeCompare(b.zone)).map(zone => ({ ...zone, percent:zone.total ? Math.round((zone.done / zone.total) * 100) : 0 })),
      ghmc_zones:[...ghmcZones.values()].sort((a,b) => a.zone.localeCompare(b.zone)).map(zone => ({ ...zone, percent:zone.total ? Math.round((zone.done / zone.total) * 100) : 0 })),
      quality_flags:{ missing_photo:missingPhoto, gps_off_location:offLocation, duplicate_building_id:duplicateHouseholds, incomplete_form:incomplete }, quality_households:qualityHouseholds,
      recent_updates:auditItems.slice(0,12),
      performance:[...people.values()].filter(person => person.role === 'editor').sort((a,b) => b.today - a.today).slice(0,20)
    }); return;
  }
  if (req.method === 'GET' && pathname === '/api/dashboard') {
    const user = requireUser(req, res); if (!user) return;
    const rows = db.prepare('SELECT * FROM households').all().filter(row => canAccessHousehold(user, row)); const counts = { total: rows.length, Pending: 0, Surveyed: 0, Verified: 0, 'Flagged / Revisit': 0 };
    let updated = 0;
    for (const row of rows) { const status = surveyStatus(parseJson(row.survey).survey_status); counts[status] = (counts[status] || 0) + 1; if (row.updated_at) updated++; }
    json(res, 200, { counts, updated }); return;
  }
  if (req.method === 'GET' && pathname === '/api/analytics') {
    if (!requireUser(req, res, ['admin', 'authority'])) return;
    const field = String(url.searchParams.get('field') || '').trim();
    const baselineField = String(url.searchParams.get('baseline_field') || field).trim();
    if (!/^[A-Za-z][A-Za-z0-9_]{0,90}$/.test(field) || !/^[A-Za-z][A-Za-z0-9_]{0,90}$/.test(baselineField)) {
      json(res, 400, { error:'Choose a valid household field.' }); return;
    }
    const rows = db.prepare('SELECT baseline, survey FROM households').all(); const before = []; const current = [];
    for (const row of rows) {
      const baseline = parseJson(row.baseline); const survey = parseJson(row.survey);
      before.push(baseline[baselineField]);
      current.push(Object.hasOwn(survey, field) ? survey[field] : baseline[field]);
    }
    json(res, 200, { field, baseline_field:baselineField, total:rows.length, baseline:aggregateValues(before), current:aggregateValues(current) }); return;
  }
  if (req.method === 'GET' && pathname === '/api/analytics-export') {
    if (!requireUser(req, res, ['admin', 'authority'])) return;
    const fields = String(url.searchParams.get('fields') || '').split(',').map(value => value.trim()).filter(Boolean);
    const baselineFields = String(url.searchParams.get('baseline_fields') || '').split(',').map(value => value.trim()); const chartType = String(url.searchParams.get('chart_type') || 'pie').slice(0, 20);
    if (!fields.length || fields.length > 12 || fields.some(field => !/^[A-Za-z][A-Za-z0-9_]{0,90}$/.test(field)) || baselineFields.some(field => field && !/^[A-Za-z][A-Za-z0-9_]{0,90}$/.test(field))) { json(res, 400, { error:'Choose up to 12 valid questionnaire fields.' }); return; }
    const labels = new Map(readQuestionnaireFields().map(field => [field.field_key, field.label])); const rows = db.prepare('SELECT baseline, survey FROM households').all();
    const analyses = fields.map((field, index) => {
      const baselineField = baselineFields[index] || field; const before = []; const current = [];
      for (const row of rows) { const baseline = parseJson(row.baseline); const survey = parseJson(row.survey); before.push(baseline[baselineField]); current.push(Object.hasOwn(survey, field) ? survey[field] : baseline[field]); }
      return { label:labels.get(field) || field.replace(/^q_/, '').replace(/_/g, ' '), chartType, baseline:aggregateValues(before), current:aggregateValues(current) };
    });
    download(res, `mrdcl-question-analysis-${new Date().toISOString().slice(0, 10)}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buildAnalysisXlsx(analyses)); return;
  }
  if (req.method === 'GET' && pathname === '/api/dashboard-households') {
    const user = requireUser(req, res, ['admin', 'authority']); if (!user) return;
    const filter = String(url.searchParams.get('filter') || 'all'); const allowed = new Set(['all','pending','surveyed','flagged','verified']); if (!allowed.has(filter)) { json(res, 400, { error:'Choose a valid work status.' }); return; }
    const matches = status => ({ all:true, pending:status === 'Pending', surveyed:status === 'Surveyed', flagged:status === 'Flagged / Revisit', verified:status === 'Verified' }[filter]);
    const households = db.prepare('SELECT * FROM households').all().map(row => toHousehold(row, false)).filter(item => matches(surveyStatus(item.properties.survey_status))).map(item => ({ id:item.id, properties:item.properties, revision:item.revision, updated_at:item.updated_at, updated_by:item.updated_by }));
    json(res, 200, { filter, households }); return;
  }
  if (req.method === 'GET' && pathname === '/api/activity') {
    const user = requireUser(req, res); if (!user) return;
    const statement = isFieldUser(user)
      ? db.prepare('SELECT at, username, action, household_id, detail FROM audit_log WHERE user_id=? ORDER BY id DESC LIMIT 50')
      : db.prepare('SELECT at, username, action, household_id, detail FROM audit_log ORDER BY id DESC LIMIT 50');
    json(res, 200, { items:isFieldUser(user) ? statement.all(user.id) : statement.all() }); return;
  }
  if (req.method === 'GET' && pathname === '/api/audit-log') {
    const user = requireUser(req, res, ['admin']); if (!user) return;
    const items = db.prepare('SELECT id, at, username, action, household_id, detail, old_value, new_value FROM audit_log ORDER BY id DESC LIMIT 500').all();
    json(res, 200, { items }); return;
  }
  const photoDownloadMatch = pathname.match(/^\/api\/photos\/(\d+)\/download$/);
  if (photoDownloadMatch && req.method === 'GET') {
    const user = requireUser(req, res); if (!user) return; const photo = db.prepare('SELECT * FROM photo_uploads WHERE id=?').get(Number(photoDownloadMatch[1]));
    if (!photo || !fs.existsSync(path.join(UPLOAD_DIR, photo.filename))) { json(res, 404, { error:'Photo not found.' }); return; }
    const household = db.prepare('SELECT * FROM households WHERE id=?').get(photo.household_id);
    if (!canAccessHousehold(user, household)) { json(res, 403, { error:'This household is not assigned to you.' }); return; }
    download(res, photo.original_name, photo.mime_type, fs.readFileSync(path.join(UPLOAD_DIR, photo.filename))); return;
  }
  const photoFileMatch = pathname.match(/^\/api\/photos\/(\d+)\/file$/);
  if (photoFileMatch && req.method === 'GET') {
    const user = requireUser(req, res); if (!user) return; const photo = db.prepare('SELECT * FROM photo_uploads WHERE id=?').get(Number(photoFileMatch[1]));
    if (!photo || !fs.existsSync(path.join(UPLOAD_DIR, photo.filename))) { json(res, 404, { error:'Photo not found.' }); return; }
    const household = db.prepare('SELECT * FROM households WHERE id=?').get(photo.household_id);
    if (!canAccessHousehold(user, household)) { json(res, 403, { error:'This household is not assigned to you.' }); return; }
    const bytes = fs.readFileSync(path.join(UPLOAD_DIR, photo.filename)); res.writeHead(200, { 'Content-Type':photo.mime_type, 'Content-Length':bytes.length, 'Cache-Control':'private, no-store', 'X-Content-Type-Options':'nosniff' }); res.end(bytes); return;
  }
  if (req.method === 'GET' && pathname === '/api/photos') {
    const user = requireUser(req, res); if (!user) return; const mine = user.role !== 'admin';
    const rows = (mine ? db.prepare('SELECT * FROM photo_uploads WHERE uploaded_by=? ORDER BY id DESC').all(user.username) : db.prepare('SELECT * FROM photo_uploads ORDER BY id DESC').all()).filter(photo => canAccessHousehold(user, db.prepare('SELECT * FROM households WHERE id=?').get(photo.household_id)));
    json(res, 200, { photos:rows.map(photo => ({ ...photo, url:`/api/photos/${photo.id}/file`, download_url:`/api/photos/${photo.id}/download` })), scope:mine ? 'mine' : 'all' }); return;
  }
  const photoDeleteMatch = pathname.match(/^\/api\/photos\/(\d+)$/);
  if (photoDeleteMatch && req.method === 'DELETE') {
    const user = requireUser(req, res, ['admin']); if (!user) return; const photo = db.prepare('SELECT * FROM photo_uploads WHERE id=?').get(Number(photoDeleteMatch[1]));
    if (!photo) { json(res, 404, { error:'Photo not found.' }); return; }
    const source = path.join(UPLOAD_DIR, photo.filename); if (fs.existsSync(source)) fs.unlinkSync(source); db.prepare('DELETE FROM photo_uploads WHERE id=?').run(photo.id); addAudit(user, 'removed field photo', photo.household_id, photo.original_name); json(res, 200, { ok:true }); return;
  }
  if (req.method === 'GET' && pathname === '/api/my-work') {
    const user = requireUser(req, res); if (!user) return;
    const team = teamForUser(user);
    const items = db.prepare('SELECT * FROM households').all().map(row => toHousehold(row, false)).filter(item => item.properties.assigned_user_id === user.id || (!item.properties.assigned_user_id && item.properties.assigned_team === team)).map(item => ({ id:item.id, label:item.properties.NameOwnRep || item.properties.BuildingID || item.id, status:item.properties.survey_status || 'Not started', plot:item.properties.HNoPlotNo || 'Not recorded', updated_at:item.updated_at, assigned_team:item.properties.assigned_team, assigned_user:item.properties.assigned_user || '' }));
    json(res, 200, { team, items }); return;
  }
  if (req.method === 'GET' && pathname === '/api/team-management') {
    const user = requireUser(req, res, ['admin', 'authority']); if (!user) return;
    const households = db.prepare('SELECT * FROM households').all(); const counts = { 'Unassigned':0, 'Team 1':0, 'Team 2':0 }; const individualCounts = {};
    for (const row of households) { const survey = parseJson(row.survey); const team = survey.assigned_team || 'Unassigned'; counts[team] = (counts[team] || 0) + 1; if (survey.assigned_user_id) individualCounts[survey.assigned_user_id] = (individualCounts[survey.assigned_user_id] || 0) + 1; }
    const teams = db.prepare('SELECT id, name, created_at FROM teams ORDER BY name').all();
    const users = db.prepare('SELECT u.id, u.username, u.display_name, u.role, u.team_id, t.name AS team_name, u.created_at FROM users u LEFT JOIN teams t ON t.id=u.team_id WHERE u.deleted_at IS NULL ORDER BY u.role, u.display_name').all().map(item => ({ ...item, assigned: counts[item.team_name] || 0, individually_assigned:individualCounts[item.id] || 0 }));
    json(res, 200, { users, teams, counts, households: households.map(row => { const item = toHousehold(row); return { id:item.id, ...item.properties, ghmc_zone:ghmcZoneForGeometry(item.id, item.geometry) }; }) }); return;
  }
  if (req.method === 'POST' && pathname === '/api/teams') {
    const user = requireUser(req, res, ['admin']); if (!user) return; const body = await readBody(req); const name = String(body.name || '').trim().replace(/\s+/g, ' ');
    if (name.length < 2 || name.length > 60) { json(res, 400, { error:'Team name must be 2–60 characters.' }); return; }
    try { const result = db.prepare('INSERT INTO teams (name, created_at) VALUES (?, ?)').run(name, now()); addAudit(user, 'created team', null, name); publishRealtime('team', { action:'created' }); json(res, 201, { team:{ id:Number(result.lastInsertRowid), name } }); } catch { json(res, 409, { error:'A team with that name already exists.' }); } return;
  }
  if (req.method === 'PUT' && /^\/api\/teams\/\d+$/.test(pathname)) {
    const user = requireUser(req, res, ['admin']); if (!user) return; const teamId = Number(pathname.split('/').pop()); const body = await readBody(req); const name = String(body.name || '').trim().replace(/\s+/g, ' ');
    const team = db.prepare('SELECT * FROM teams WHERE id=?').get(teamId); if (!team) { json(res, 404, { error:'Team not found.' }); return; }
    if (name.length < 2 || name.length > 60) { json(res, 400, { error:'Team name must be 2–60 characters.' }); return; }
    try { db.prepare('UPDATE teams SET name=? WHERE id=?').run(name, teamId); addAudit(user, 'renamed team', null, `${team.name} → ${name}`); publishRealtime('team', { action:'renamed' }); json(res, 200, { ok:true, team:{ id:teamId, name } }); } catch { json(res, 409, { error:'A team with that name already exists.' }); } return;
  }
  if (req.method === 'DELETE' && /^\/api\/teams\/\d+$/.test(pathname)) {
    const user = requireUser(req, res, ['admin']); if (!user) return; const teamId = Number(pathname.split('/').pop()); const team = db.prepare('SELECT * FROM teams WHERE id=?').get(teamId); if (!team) { json(res, 404, { error:'Team not found.' }); return; }
    const rows = db.prepare('SELECT * FROM households').all().filter(row => parseJson(row.survey).assigned_team === team.name); const stamp = now(); const update = db.prepare('UPDATE households SET survey=?, revision=revision+1, updated_at=?, updated_by=? WHERE id=?');
    db.exec('BEGIN IMMEDIATE'); try { db.prepare('UPDATE users SET team_id=NULL WHERE team_id=?').run(teamId); for (const row of rows) { const survey = { ...parseJson(row.survey), assigned_team:'Unassigned' }; update.run(JSON.stringify(survey), stamp, user.username, row.id); addAudit(user, 'unassigned household after team removal', row.id, team.name); } db.prepare('DELETE FROM teams WHERE id=?').run(teamId); addAudit(user, 'removed team', null, team.name); db.exec('COMMIT'); } catch (error) { db.exec('ROLLBACK'); throw error; }
    publishRealtime('team', { action:'removed', household_ids:rows.map(row => row.id) });
    json(res, 200, { ok:true, unassigned:rows.length }); return;
  }
  if (req.method === 'PUT' && pathname === '/api/teams/members') {
    const user = requireUser(req, res, ['admin']); if (!user) return; const body = await readBody(req); const userId = Number(body.user_id); const teamId = body.team_id === null || body.team_id === '' ? null : Number(body.team_id);
    if (!Number.isInteger(userId) || (teamId !== null && !Number.isInteger(teamId))) { json(res, 400, { error:'Choose a valid user and team.' }); return; }
    if (teamId !== null && !db.prepare('SELECT id FROM teams WHERE id=?').get(teamId)) { json(res, 404, { error:'Team not found.' }); return; }
    const member = db.prepare('SELECT username FROM users WHERE id=? AND deleted_at IS NULL').get(userId); if (!member) { json(res, 404, { error:'Active user not found.' }); return; }
    db.prepare('UPDATE users SET team_id=? WHERE id=?').run(teamId, userId); const teamName = teamId === null ? 'No team' : db.prepare('SELECT name FROM teams WHERE id=?').get(teamId).name; addAudit(user, 'moved user to team', null, `${member.username} → ${teamName}`); publishRealtime('team-member', { username:member.username }); json(res, 200, { ok:true, team_name:teamName }); return;
  }
  if (req.method === 'POST' && pathname === '/api/assignments') {
    const user = requireUser(req, res, ['admin', 'authority']); if (!user) return; const body = await readBody(req);
    const ids = Array.isArray(body.household_ids) ? body.household_ids.map(item => String(item)) : []; const team = String(body.team || 'Keep current team'); const userId = body.user_id === null || body.user_id === '' || body.user_id === undefined ? null : Number(body.user_id);
    const validTeams = new Set(['Keep current team', 'Unassigned', ...db.prepare('SELECT name FROM teams').all().map(row => row.name)]); const assignee = userId === null ? null : db.prepare('SELECT u.id, u.username, t.name AS team_name FROM users u LEFT JOIN teams t ON t.id=u.team_id WHERE u.id=? AND u.deleted_at IS NULL').get(userId);
    if (!ids.length || !validTeams.has(team)) { json(res, 400, { error:'Select one or more households and a valid team.' }); return; }
    if (userId !== null && !assignee) { json(res, 404, { error:'Selected user was not found.' }); return; }
    const rows = db.prepare(`SELECT * FROM households WHERE id IN (${ids.map(() => '?').join(',')})`).all(...ids); const update = db.prepare('UPDATE households SET survey=?, revision=revision+1, updated_at=?, updated_by=? WHERE id=?'); const stamp = now();
    db.exec('BEGIN IMMEDIATE'); try { for (const row of rows) { const previous = parseJson(row.survey); const assignedTeam = team === 'Keep current team' ? (assignee?.team_name || previous.assigned_team || 'Unassigned') : team; const survey = { ...previous, assigned_team:assignedTeam, assigned_user_id:assignee?.id || '', assigned_user:assignee?.username || '' }; update.run(JSON.stringify(survey), stamp, user.username, row.id); addAudit(user, 'assigned household', row.id, `${assignedTeam}${assignee ? ` · ${assignee.username}` : ''}`, { assigned_team:previous.assigned_team || 'Unassigned', assigned_user:previous.assigned_user || '' }, { assigned_team:assignedTeam, assigned_user:assignee?.username || '' }); } db.exec('COMMIT'); } catch (error) { db.exec('ROLLBACK'); throw error; }
    publishRealtime('assignment', { household_ids:ids });
    json(res, 200, { ok:true, changed:rows.length }); return;
  }
  if (req.method === 'GET' && pathname === '/api/verification') {
    const user = requireUser(req, res, ['admin', 'authority']); if (!user) return;
    const items = db.prepare('SELECT * FROM households').all().map(row => toHousehold(row, false)).filter(item => ['Surveyed', 'Verified'].includes(surveyStatus(item.properties.survey_status))).map(item => ({ id:item.id, label:item.properties.NameOwnRep || item.properties.BuildingID || item.id, status:surveyStatus(item.properties.survey_status), verification:item.properties.verification_status || 'Pending', team:item.properties.assigned_team || 'Unassigned' }));
    json(res, 200, { items }); return;
  }
  if (req.method === 'POST' && pathname === '/api/verification/finalise') {
    const user = requireUser(req, res, ['admin', 'authority']); if (!user) return; const body = await readBody(req); const ids = Array.isArray(body.household_ids) ? body.household_ids.map(item => String(item)) : [];
    if (!ids.length) { json(res, 400, { error:'Select at least one completed household.' }); return; }
    const rows = db.prepare(`SELECT * FROM households WHERE id IN (${ids.map(() => '?').join(',')})`).all(...ids); const update = db.prepare('UPDATE households SET survey=?, revision=revision+1, updated_at=?, updated_by=? WHERE id=?'); const stamp = now();
    db.exec('BEGIN IMMEDIATE'); try { for (const row of rows) { const previous = parseJson(row.survey); const survey = { ...previous, survey_status:'Verified', verification_status:'Approved', verification_date:stamp }; update.run(JSON.stringify(survey), stamp, user.username, row.id); addAudit(user, 'verified and finalised household', row.id, 'Approved', { survey_status:previous.survey_status || 'Not started', verification_status:previous.verification_status || 'Pending', verification_date:previous.verification_date || null }, { survey_status:'Verified', verification_status:'Approved', verification_date:stamp }); } db.exec('COMMIT'); } catch (error) { db.exec('ROLLBACK'); throw error; }
    publishRealtime('verification', { household_ids:ids });
    json(res, 200, { ok:true, changed:rows.length }); return;
  }
  if (req.method === 'GET' && pathname === '/api/profile') {
    const user = requireUser(req, res); if (!user) return; json(res, 200, { user }); return;
  }
  if (req.method === 'PUT' && pathname === '/api/profile') {
    const user = requireUser(req, res); if (!user) return; const body = await readBody(req); const display = String(body.display_name || '').trim(); const password = String(body.password || '');
    if (!display || display.length > 100 || (password && password.length < 10)) { json(res, 400, { error:'Provide a display name and, if changing it, a password of at least 10 characters.' }); return; }
    if (password) { const hashed = hash(password); db.prepare('UPDATE users SET display_name=?, password_hash=?, password_salt=? WHERE id=?').run(display, hashed.value, hashed.salt, user.id); }
    else db.prepare('UPDATE users SET display_name=? WHERE id=?').run(display, user.id);
    const updated = db.prepare('SELECT id, username, display_name, role FROM users WHERE id=?').get(user.id); addAudit(updated, 'updated profile', null, null); json(res, 200, { user:updated }); return;
  }
  const exportMatch = pathname.match(/^\/api\/exports\/(geojson|kml|xlsx|word|csv|shapefile|pdf)$/);
  if (exportMatch && req.method === 'GET') {
    const user = requireUser(req, res, ['admin', 'authority']); if (!user) return;
    sendExport(res, exportRows(), exportMatch[1], 'mrdcl-household-survey'); return;
  }
  if (req.method === 'GET' && pathname === '/api/users') {
    if (!requireUser(req, res, ['admin'])) return;
    json(res, 200, { users: db.prepare('SELECT u.id, u.username, u.display_name, u.role, u.team_id, t.name AS team_name, u.created_at, u.deleted_at, u.deleted_by FROM users u LEFT JOIN teams t ON t.id=u.team_id ORDER BY u.deleted_at IS NOT NULL, u.username').all(), teams:db.prepare('SELECT id, name FROM teams ORDER BY name').all() }); return;
  }
  if (req.method === 'DELETE' && /^\/api\/users\/\d+$/.test(pathname)) {
    const user = requireUser(req, res, ['admin']); if (!user) return;
    const userId = Number(pathname.split('/').pop());
    const target = db.prepare('SELECT id, username, display_name, role, team_id, deleted_at, deleted_by FROM users WHERE id=?').get(userId);
    if (!target) { json(res, 404, { error:'User not found.' }); return; }
    if (target.id === user.id) { json(res, 400, { error:'You cannot delete the account you are currently using.' }); return; }
    if (target.deleted_at) { json(res, 200, { ok:true, already_deleted:true, user:{ id:target.id, username:target.username, deleted_at:target.deleted_at } }); return; }
    if (target.role === 'admin' && db.prepare("SELECT COUNT(*) AS count FROM users WHERE role='admin' AND deleted_at IS NULL").get().count <= 1) { json(res, 400, { error:'Keep at least one active administrator account.' }); return; }
    const stamp = now();
    db.exec('BEGIN IMMEDIATE');
    try {
      db.prepare('UPDATE users SET deleted_at=?, deleted_by=? WHERE id=?').run(stamp, user.username, target.id);
      db.prepare('DELETE FROM sessions WHERE user_id=?').run(target.id);
      addAudit(user, 'deleted user access', null, `${target.username} (${target.role})`, { id:target.id, username:target.username, display_name:target.display_name, role:target.role, team_id:target.team_id }, { deleted_at:stamp, deleted_by:user.username });
      db.exec('COMMIT');
    } catch (error) { db.exec('ROLLBACK'); throw error; }
    publishRealtime('user', { action:'deleted', user_id:target.id, username:target.username });
    json(res, 200, { ok:true, user:{ id:target.id, username:target.username, deleted_at:stamp } }); return;
  }
  if (req.method === 'POST' && pathname === '/api/users') {
    const user = requireUser(req, res, ['admin']); if (!user) return; const body = await readBody(req);
    const username = String(body.username || '').trim().toLowerCase(); const display = String(body.display_name || '').trim(); const password = String(body.password || ''); const role = String(body.role || ''); const teamId = body.team_id === null || body.team_id === '' || body.team_id === undefined ? null : Number(body.team_id);
    if (!/^[a-z0-9._-]{3,40}$/.test(username) || !display || password.length < 10 || !['admin', 'editor', 'authority'].includes(role)) { json(res, 400, { error: 'Use a 3–40 character user ID, display name, 10+ character password, and valid role.' }); return; }
    if (teamId !== null && (!Number.isInteger(teamId) || !db.prepare('SELECT id FROM teams WHERE id=?').get(teamId))) { json(res, 400, { error:'Choose a valid team.' }); return; }
    try { const hashed = hash(password); db.prepare('INSERT INTO users (username, display_name, role, team_id, password_hash, password_salt, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').run(username, display, role, teamId, hashed.value, hashed.salt, now()); addAudit(user, 'created user', null, `${username} (${role})`); publishRealtime('user', { action:'created', username }); json(res, 201, { ok: true }); } catch { json(res, 409, { error: 'That user ID already exists.' }); } return;
  }
  json(res, 404, { error: 'API route not found.' });
}
function serveStatic(req, res, url) {
  // The phone clients previously retained an early interface in their browser
  // cache. Always route the normal address to the current release URL once.
  if (url.pathname === '/' && url.searchParams.get('release') !== 'mobile-v99') {
    res.writeHead(302, { Location: '/?release=mobile-v99', 'Cache-Control': 'no-store, max-age=0' }); res.end(); return;
  }
  let requested = url.pathname === '/' ? '/index.html' : url.pathname;
  requested = path.normalize(requested).replace(/^([/\\])+/, ''); const file = path.join(STATIC_DIR, requested);
  if (!file.startsWith(STATIC_DIR) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { text(res, 404, 'Not found'); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store, max-age=0, must-revalidate', 'X-Content-Type-Options': 'nosniff' }); fs.createReadStream(file).pipe(res);
}
init();
const server = http.createServer(async (req, res) => {
  setSecurityHeaders(res); const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try { if (url.pathname.startsWith('/api/')) await api(req, res, url); else if (req.method === 'GET' || req.method === 'HEAD') serveStatic(req, res, url); else text(res, 405, 'Method not allowed'); }
  catch (error) { console.error(error); if (!res.headersSent) json(res, 500, { error: 'The server could not complete this request.' }); }
});
setInterval(() => {
  for (const client of realtimeClients) {
    if (client.res.writableEnded || client.res.destroyed) { realtimeClients.delete(client); continue; }
    try { client.res.write(`: keep-alive ${now()}\n\n`); } catch { realtimeClients.delete(client); }
  }
}, 20000).unref();
server.listen(PORT, '0.0.0.0', () => console.log(`MRDCL Household Survey Portal is running at http://localhost:${PORT}`));
