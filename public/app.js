const DEFAULT_LAYER_PREFS = { buildings:{ name:'Survey buildings', color:'#e6b84d' }, bifurcated:{ name:'Bifurcated buildings', color:'#a855f7' }, river:{ name:'Musi River', color:'#187bb5' }, musi_buffer:{ name:'Musi River buffer', color:'#8b3cb8' }, zones:{ name:'Zone boundary', color:'#173f63' }, circles:{ name:'Circle boundaries', color:'#087f8c' }, wards:{ name:'Ward boundaries', color:'#7655a6' } };
// GHMC's current 300 wards. Keep the number with the selected value so that
// similarly named locations remain unambiguous in surveys and exports.
const GHMC_WARD_OPTIONS = `1|Keesara
2|Chandrapuri Colony
3|Jawahar Nagar
4|Dammaiguda
5|Nagaram
6|Ghatkesar
7|Edulabad
8|Pocharam
9|Medipally
10|Peerzadiguda
11|Boduppal
12|Chengicherla
13|Vampuguda
14|Kapra
15|Dr AS Rao Nagar
16|Kushaiguda
17|Cherlapally
18|Shakthi Sai Nagar
19|H.B. Colony
20|Mallapur
21|Nacharam
22|HMT Nagar
23|Chilkanagar
24|Beerappagadda
25|Habsiguda
26|Ramanthapur
27|Venkat Reddy Nagar
28|Uppal
29|Nagole
30|Kothapet
31|Chaitanyapuri
32|Gaddiannaram
33|Saroornagar
34|Doctors Colony
35|RK Puram
36|NTR Nagar
37|Lingojiguda
38|Champapet
39|Kharmanghat
40|Bairamalguda
41|Hastinapuram
42|BN Reddy Nagar
43|Vanasthalipuram
44|Chintalkunta
45|Mansoorabad
46|GSI
47|Lecturers Colony
48|High Court Colony
49|Sahebnagar
50|Hayathnagar
51|Kuntloor
52|Pedda Amberpet
53|Thorrur
54|Kongara Kalan
55|Adibatla
56|Turkayamjal
57|Nadargul
58|Prashanthi Hills
59|Jillelaguda
60|Meerpet
61|Badangpet
62|Balapur
63|Shaheen Nagar
64|Pahadi Shareef
65|Jalpally
66|Thukkuguda
67|Mankhal
68|Bandlaguda
69|Noori Nagar
70|Barkas
71|Kanchanbagh
72|Chandrayangutta
73|Riyasat Nagar
74|Lalitha Bagh
75|Jangammet
76|Phool Bagh
77|Quadri Chaman
78|Gowlipura
79|Talab Chanchalam
80|Yakutpura
81|Dabeerpura
82|Rein Bazar
83|Madannapet
84|Bhanu Nagar
85|Santosh Nagar
86|IS SADAN
87|Saraswati Nagar
88|Saidabad
89|Asmangadh
90|Moosarambagh
91|Old Malakpet
92|MCH Colony
93|Akberbagh
94|Chawani
95|Kala Dera
96|Azampura
97|Purani Haveli
98|Pathergatti
99|Hari Bowli
100|Qazipura
101|Ghansi Bazar
102|Purana Pul
103|Doodh Bowli
104|Shah Ali Banda
105|Falaknuma
106|Jahanuma
107|Nawab Saheb Kunta
108|Teegal Kunta
109|Chandu Lal Baradari
110|Ramnasthpura
111|Kishanbagh
112|Attapur
113|Hyderguda
114|Suleman Nagar
115|Shastripuram
116|Katedan
117|Mailardevpally
118|Shamshabad
119|Kothwalguda
120|Rajendra Nagar
121|Bandlaguda Jagir
122|Kismatpur
123|Hydershahkote
124|Narsingi
125|Kokapet
126|Gandipet
127|Manikonda
128|Neknampur
129|Nizam Colony
130|Nanalnagar
131|Tolichowki
132|Golconda
133|Ibrahimbagh
134|Langar Houz
135|Gudimalkapur
136|Karwan
137|Tappachabutra
138|Ziaguda
139|Asif Nagar
140|Padmanabha Nagar
141|Mehdipatnam
142|Syed Nagar
143|Vijayanagar Colony
144|Ahmed Nagar
145|Shanti Nagar
146|Red Hills
147|Mallepally
148|Dattatreya Nagar
149|Manghalhat
150|Goshamahal
151|Begum Bazar
152|Jambagh
153|Exhibition Grounds
154|Gunfoundry
155|Barkatpura
156|Kachiguda
157|Golnaka
158|Patel Nagar
159|Amberpet
160|Bagh Amberpet
161|Tilak Nagar
162|Nallakunta
163|Adikmet
164|Bagh Lingampally
165|Gandhi Nagar
166|Kavadiguda
167|Bakaram
168|Bholakpur
169|Musheerabad
170|Ramnagar
171|Bapuji Nagar
172|Boudha Nagar
173|Tarnaka
174|Seethaphalmandi
175|Chilkalguda
176|Mettuguda
177|Lalapet
178|North Lalaguda
179|Addagutta
180|East Anandbagh
181|Mirjalguda
182|Goutham Nagar
183|Malkajgiri
184|Balram Nagar
185|Vinayak Nagar
186|Moula Ali
187|Kakatiya Nagar
188|Neredmet
189|Yapral
190|Turkapally
191|Macha Bollaram
192|Temple Alwal
193|Venkatapuram
194|Bhudevi Nagar
195|Kanajiguda
196|Monda Market
197|Padmarao Nagar
198|Bansilalpet
199|Ramgopalpet
200|Begumpet
201|Ameerpet
202|SR Nagar
203|BK Guda
204|Sanathnagar
205|Erragadda
206|Vengal Rao Nagar
207|Srinagar Colony
208|Yousufguda
209|AG Colony
210|Krishna Nagar
211|Rahamath Nagar
212|Karmika Nagar
213|Rajeev Nagar
214|Borabanda
215|Jubilee Hills
216|Venkateshwara Colony
217|Irrum Manzil
218|Somajiguda
219|Khairatabad
220|Himayathnagar
221|Banjara Hills
222|Film Nagar
223|Shaikpet
224|OU Colony
225|Gachibowli
226|Nallagandla
227|Serilingampally
228|Masjid Banda
229|Sri Ram Nagar
230|Anjaiah Nagar
231|HITEC City
232|Madhapur
233|Izzath Nagar
234|Kondapur
235|Matrusri Nagar
236|Hafeezpet
237|Madeenaguda
238|Chanda Nagar
239|Deepthisri Nagar
240|Miyapur
241|Maktha Mahabubpet
242|Mayuri Nagar
243|Hyder Nagar
244|Bhagya Nagar Colony
245|Shamshiguda
246|Allwyn Colony
247|Vivekananda Nagar Colony
248|Venkateshwara Nagar
249|Kukatpally
250|Balaji Nagar
251|Vasanth Nagar
252|KPHB Colony
253|Kaithalapur
254|Gayatri Nagar
255|Allapur
256|Moti Nagar
257|Moosapet
258|Prashanth Nagar
259|Balanagar
260|Fateh Nagar
261|Prakash Nagar
262|Old Bowenpally
263|Tellapur
264|Hasmathpet
265|Muthangi
266|Patancheruvu
267|JP Colony
268|Ramachandrapuram (RC Puram)
269|Bharathi Nagar
270|Beeramguda
271|Ameenpur
272|Bollaram
273|Nizampet
274|Bachupally
275|Bhandari Layout
276|Pragathi Nagar
277|Mahadevpuram
278|Gajularamaram
279|Rodamestri Nagar
280|Jagathgiri Gutta
281|Ranga Reddy Nagar
282|Chintal
283|Giri Nagar
284|Ganesh Nagar
285|Padma Nagar
286|Quthbullapur
287|Pet Basheerabad
288|Kompally
289|Doolapally
290|Subhash Nagar
291|Shapur Nagar
292|Saibaba Nagar
293|Suraram
294|Bahadurpally
295|Bowrampet
296|Dundigal
297|Medchal
298|Pudur-Kistapur
299|Gundlapochampally
300|Shamirpet`.split('\n').map(line => {
  const [number, name] = line.split('|');
  return { number: Number(number), name };
}).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
function savedLayerPrefs() { try { return { ...DEFAULT_LAYER_PREFS, ...JSON.parse(localStorage.getItem('mrdcl-layer-preferences') || '{}') }; } catch { return { ...DEFAULT_LAYER_PREFS }; } }
const state = { user: null, map: null, baseLayer: null, geoLayer: null, bifurcatedLayer: null, photoLayer: null, musiPhaseLayer: null, musiPhaseLegend: null, musiSubZoneHighlight:null, selectedHouseholdHighlight:null, highlightedMusiSubZone:null, basemapLayers: new Map(), basemapId: 'imagery', basemapVisible: true, attributionControl: null, basemapAttribution: null, baseLayerById: new Map(), layerById: new Map(), overlays: new Map(), mapLayerData:new Map(), customLayers:new Map(), overlayControl: null, allFeatures: [], featureById: new Map(), features: [], selected: null, dirty: new Map(), installPrompt: null, lastRefresh: null, activeTool: null, selectedZone: null, selectedTeamId: null, teamNotice: '', activityMarkup: '', measureMode:false, measureUnit:'m', measurePoints:[], measureLine:null, measureMarkers:[], coordinateMarker:null, drawingMode:null, drawingPoints:[], drawingPreview:null, drawingMarkers:[], editingDrawingLayerId:null, layerContext:null, attributeLayerId:null, attributeKeys:[], filters: { q: '', status: '', team: '' }, layerPrefs: savedLayerPrefs(), detailSheet:'half', pendingByHousehold:new Map(), sync:{ status:'offline', lastAt:null }, realtime:null, realtimeTimer:null, autoSaveTimer:null, autoSaveInFlight:false, queueFlushing:false, questionnaireSchema:[], questionnaireTabs:[{ tab_id:'tab1', label:'Primary observation', sort_order:1 },{ tab_id:'tab2', label:'Secondary observation', sort_order:2 },{ tab_id:'tab3', label:'Others', sort_order:3 }], activeQuestionnaireTab:'tab1', activeDetailTab:'tab1', questionnaireEditMode:false, dashboardFocusIds:new Set(), dashboardQuality:{}, dashboardAnalyses:[] };
function portalResumeKey() { return `mrdcl-portal-resume:${state.user?.username || 'guest'}`; }
function rememberPortalLocation() {
  if (!state.user || !state.selectedZone) return;
  try {
    localStorage.setItem(portalResumeKey(), JSON.stringify({
      zone: String(state.selectedZone), householdId: state.selected?.id || null,
      questionnaireTab: state.activeQuestionnaireTab || 'tab1', detailTab: state.activeDetailTab || 'tab1', tool: state.activeTool || null,
      detailOpen: $('#appView')?.classList.contains('detail-panel-open') || false, savedAt: Date.now()
    }));
  } catch { /* A blocked browser storage setting must not interrupt field work. */ }
}
function readPortalResume() {
  try {
    const saved = JSON.parse(localStorage.getItem(portalResumeKey()) || 'null');
    return saved && saved.zone ? saved : null;
  } catch { return null; }
}
function clearPortalResume() { try { localStorage.removeItem(portalResumeKey()); } catch { /* no-op */ } }
const fieldGroups = [
  { title: 'Workflow & verification', fields: [
    ['assigned_team', 'Assigned team', 'select', ['Unassigned', 'Team 1', 'Team 2']],
    ['survey_status', 'Survey status', 'select', ['Pending', 'Surveyed', 'Verified', 'Flagged / Revisit']],
    ['verification_status', 'Verification', 'select', ['Pending', 'Checked', 'Correction required', 'Approved']],
    ['verification_date', 'Verification date', 'datetime-local'],
    ['Survey_Dat', 'Survey date / time', 'datetime-local'],
    ['follow_up_date', 'Follow-up date', 'date'], ['field_notes', 'Field notes / correction notes', 'textarea']
  ]},
  { title: 'Household identity', fields: [
    ['NameOwnRep', 'Owner / representative name'], ['Contact', 'Contact number', 'tel'], ['BuildingID', 'Building ID'], ['HNoPlotNo', 'House / plot number'], ['TPIN', 'TPIN'], ['Classifica', 'Land / tenure classification', 'select', ['Patta', 'Govt', 'Private', 'Other']], ['Caste', 'Social category'], ['Income', 'Income category', 'select', ['BPL', 'APL', 'Other']]
  ]},
  { title: 'Household composition & livelihood', fields: [
    ['HHSize', 'Household size', 'number'], ['NoAdults', 'Number of adults', 'number'], ['NoChild', 'Number of children', 'number'], ['FinanDepen', 'Financial dependency', 'select', ['Yes', 'No']], ['Occupation', 'Primary occupation'], ['SkilledOcc', 'Skilled occupation'], ['Craftsmen', 'Craftsmen details'], ['Govtbenefi', 'Government benefits', 'select', ['Yes', 'No']]
  ]},
  { title: 'Structure & use', fields: [
    ['BuiType', 'Building type'], ['StructType', 'Structure type'], ['NameStruct', 'Structure description'], ['Use', 'Current use'], ['Extent', 'Extent'], ['PlinthArea', 'Plinth area'], ['no_of_Floo', 'Number of floors', 'number'], ['CommStatus', 'Commercial status']
  ]},
  { title: 'Services, legal & cultural', fields: [
    ['Borewell', 'Borewell', 'select', ['Yes', 'No']], ['Trees', 'Trees', 'select', ['Yes', 'No']], ['Courtcase', 'Court case', 'select', ['Yes', 'No']], ['ReliType', 'Religion'], ['ReliStruct', 'Religious structure'], ['Cremetoriu', 'Crematorium / graveyard', 'select', ['Yes', 'No']], ['Remarks', 'Remarks', 'textarea']
  ]},
  { title: 'Location & survey record', fields: [
    ['ColnyStrtN', 'Colony / street name'], ['SyTsNo', 'Survey / TS number'], ['WardBlockN', 'Ward / block'], ['Mandals', 'Mandal'], ['Dist', 'District'], ['Zone', 'GIS feature category (baseline)'], ['Zone_1', 'Musi Phase sub-zone'], ['Zonewise', 'Musi Phase corridor zone'], ['Affected_S', 'Affected status'], ['S_Fall', 'Affected feature'], ['SurvyeorNa', 'Surveyor name'], ['Survey_Dat', 'Survey date / time'], ['Survey_Loc', 'Survey location'], ['UUID', 'Survey UUID'], ['email_id', 'Surveyor email', 'email']]
  }
];
// These sections reproduce the field-survey questionnaire.  They are kept in
// the survey overlay, so the original QGIS attribute table is never altered.
fieldGroups.push(
  { title: 'Questionnaire: survey details', collapsible: true, fields: [
    ['q_chainage_km', 'Chainage / kilometre'], ['q_respondent_mobile', 'Respondent mobile number', 'tel']
  ]},
  { title: 'Questionnaire: land ownership & use', collapsible: true, fields: [
    ['q_land_ownership', '10. Land ownership', 'select', ['Private', 'Government', 'Religious trust', 'Community', 'Other']], ['q_ownership_status', '11. Ownership status', 'select', ['Titleholder', 'Customary right', 'Licensee', 'Encroacher', 'Squatter', 'Other']], ['q_private_ownership', '12. Private ownership type', 'select', ['Individual', 'Joint', 'Other']], ['q_owner_occupier', '13. Owner / occupier name'], ['q_father_name', "14. Father’s / spouse’s name"], ['q_land_type', '15. Land type', 'select', ['Irrigated', 'Non-irrigated', 'Barren', 'Forest', 'Residential', 'Commercial', 'Pond', 'Other']], ['q_present_land_use', '16. Present land use', 'select', ['Cultivation', 'Orchard', 'Residential', 'Commercial', 'Forestation', 'Barren / other']], ['q_total_landholding_acres', '17. Total household landholding (acres)', 'number'], ['q_total_affected_plot_acres', '18. Total affected plot area (acres)', 'number'], ['q_affected_land_acres', '19. Affected land / plot (acres)', 'number'], ['q_land_rate', '20. Market / revenue land rate'], ['q_agricultural_labourer', '21. Agricultural labourer?', 'select', ['Yes', 'No']], ['q_agricultural_labourer_names', '21a. Agricultural labourer name(s)', 'textarea'], ['q_tenant_lessee', '22. Tenant / lessee?', 'select', ['Yes', 'No']], ['q_tenant_lessee_names', '22a. Tenant / lessee name(s)', 'textarea'], ['q_sharecropper', '23. Sharecropper?', 'select', ['Yes', 'No']], ['q_sharecropper_names', '23a. Sharecropper name(s)', 'textarea']
  ]},
  { title: 'Questionnaire: affected structures', collapsible: true, fields: [
    ['q_structure_affected', '24. Is a structure affected?', 'select', ['Yes', 'No']], ['q_main_structure_river_distance', '25. Main structure distance from river'], ['q_boundary_wall_river_distance', '26. Boundary wall distance from river'], ['q_affected_structure_dimensions', '27. Affected structure: length × width × height'], ['q_affected_boundary_dimensions', '28. Affected boundary: length × height'], ['q_total_structure_area_sqm', '29. Total structure area (sq m)', 'number'], ['q_structure_impact_scale', '30. Scale of impact'], ['q_structure_viability', '31. Remaining structure viable?', 'select', ['Yes', 'No', 'Not sure']], ['q_construction_type', '32. Construction type', 'select', ['Temporary', 'Semi-permanent', 'Permanent']], ['q_structure_stories', '33. Number of stories', 'number'], ['q_structure_age', '34. Age of structure (years)', 'number'], ['q_structure_market_value', '35. Market value of structure'], ['q_structure_use', '36. Structure use', 'select', ['Residential', 'Commercial', 'Mixed use', 'Community', 'Religious', 'Government', 'Private', 'Other']], ['q_structure_legal_status', '37. Legal status of structure'], ['q_business_profession', '38. Head of business / profession'], ['q_tenant_in_structure', '39. Tenant in structure?', 'select', ['Yes', 'No']], ['q_tenant_structure_names', '39a. Tenant name(s)', 'textarea'], ['q_employee_commercial', '39b. Employee in commercial structure?', 'select', ['Yes', 'No']], ['q_employee_commercial_names', '39c. Commercial employee name(s)', 'textarea'], ['q_employee_residential', '39d. Employee in residential structure?', 'select', ['Yes', 'No']], ['q_employee_residential_names', '39e. Residential employee name(s)', 'textarea']
  ]},
  { title: 'Questionnaire: trees, crops & household profile', collapsible: true, fields: [
    ['q_fruit_trees', '40. Fruit trees affected', 'number'], ['q_nonfruit_trees', '40a. Non-fruit trees affected', 'number'], ['q_total_trees', '40b. Total trees affected', 'number'], ['q_crop_loss', '41. Crop loss?', 'select', ['Yes', 'No']], ['q_social_category', '42. Social category'], ['q_religion', '43. Religion'], ['q_male_members', '44. Male members', 'number'], ['q_female_members', '44a. Female members', 'number'], ['q_total_members', '44b. Total household members', 'number'], ['q_adult_dependants', '45. Unmarried son / brother / other adult dependants'], ['q_household_income', '46. Household income']
  ]},
  { title: 'Questionnaire: vulnerability & resettlement', collapsible: true, fields: [
    ['q_vulnerability_status', '47. Vulnerability status', 'textarea'], ['q_mobility_challenges', '48. Mobility challenges / disability needs', 'textarea'], ['q_metro_design_needs', '49. Metro design / accessibility needs', 'textarea'], ['q_station_safety_concern', '50. Station safety / access concern', 'textarea'], ['q_alternate_land', '51. Alternate land available?', 'select', ['Yes', 'No']], ['q_relocation_choice', '52. Relocation preference'], ['q_land_compensation_preference', '53. Land compensation preference'], ['q_structure_compensation_preference', '54. Structure compensation preference'], ['q_livelihood_loss', '55. Livelihood loss expected?', 'select', ['Yes', 'No']], ['q_livelihood_loss_nature', '56. Nature of livelihood loss'], ['q_income_support', '57. Income restoration support required'], ['q_access_concern', '58. Access concern after project', 'textarea'], ['q_social_network_disruption', '59. Social-network disruption concern', 'textarea'], ['q_land_restrictions', '60. Land-use restrictions', 'textarea'], ['q_resettlement_details', '60a. Additional resettlement details', 'textarea']
  ]},
  { title: 'Questionnaire: gender, assets & benefits', collapsible: true, fields: [
    ['q_women_over_18', '61. Number of women above 18 years', 'number'], ['q_financial_decisions', '62. Women participate in financial decisions?', 'select', ['Yes', 'No']], ['q_social_decisions', '63. Women participate in social decisions?', 'select', ['Yes', 'No']], ['q_women_owned_assets', '64. Women-owned assets'], ['q_women_bank_account', '65. Women have bank account?', 'select', ['Yes', 'No']], ['q_shg_membership', '66. SHG membership?', 'select', ['Yes', 'No']], ['q_relocation_effect_shg', '67. Effect of relocation on SHG', 'textarea'], ['q_benefit_schemes', '68. Benefits / welfare schemes received', 'textarea'], ['q_women_govt_benefit', '69. Women benefit from government schemes?', 'select', ['Yes', 'No']], ['q_asset_inventory', 'Asset inventory — Homestead/farm land, house, four-wheeler, two-wheeler, cell phone, personal computer, other (item: Yes/No)', 'textarea'], ['q_benefit_inventory', 'Benefit inventory — loan, house, employment, training, other (scheme and Yes/No)', 'textarea'], ['household_members', 'Family members — Name | Age | Sex | Marital status | Education | Occupation (one per line)', 'textarea']
  ]},
  { title: 'Questionnaire: cultural heritage & occupant / tenant schedule', collapsible: true, fields: [
    ['q_cultural_assets_nearby', '71. Cultural assets nearby?', 'select', ['Yes', 'No']], ['q_cultural_asset_type_distance', '72. Cultural asset type and distance', 'textarea'], ['q_cultural_alignment_importance', '73. Alignment / station culturally important?', 'textarea'], ['q_census_no', 'Supplementary 1. Census number'], ['q_occupier_owner', 'Supplementary 2. Owner name'], ['q_occupier_name', 'Supplementary 3. Occupier name'], ['q_occupier_father', 'Supplementary 4. Occupier father’s / spouse’s name'], ['q_occupier_status', 'Supplementary 5. Occupier status', 'select', ['Agricultural labourer', 'Tenant', 'Sharecropper', 'Tenant in structure', 'Employee', 'Other']], ['q_occupier_social_category', 'Supplementary 6. Social category'], ['q_occupier_religious_category', 'Supplementary 7. Religious category'], ['q_occupier_male', 'Supplementary 8. Family male members', 'number'], ['q_occupier_female', 'Supplementary 8a. Family female members', 'number'], ['q_occupier_total', 'Supplementary 8b. Family total members', 'number'], ['q_occupier_vulnerability', 'Supplementary 9. Vulnerability (woman headed / disability / BPL)', 'textarea'], ['q_occupier_income', 'Supplementary 10. Income'], ['q_occupier_income_restoration', 'Supplementary 11. Income-restoration requirement', 'textarea'], ['occupier_members', 'Supplementary 12. Occupier family — Name | Age | Sex | Marital status | Education | Occupation (one per line)', 'textarea']
  ]}
);
const fieldName = Object.assign(Object.fromEntries(fieldGroups.flatMap(group => group.fields.map(field => [field[0], field[1]]))), { PCs:'Parliamentary constituency (record only)', Assembly_C:'Assembly constituency (record only)' });
// These values are retained in the baseline/record/export data, but are not
// repeated as separate inputs when the equivalent household field is already
// shown in the questionnaire.
const HIDDEN_REPEATED_FIELDS = new Set(['q_owner_occupier', 'q_construction_type', 'q_structure_stories', 'q_structure_use', 'q_social_category', 'q_religion', 'q_total_members']);
const $ = selector => document.querySelector(selector);
function escapeHtml(value) { return String(value ?? '').replace(/[&<>'"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[ch])); }
function titleCase(value) { return String(value || '').replace(/_/g, ' '); }
function householdLabel(p) { return p.NameOwnRep || p.BuildingID || p.HNoPlotNo || 'Unnamed household'; }
function statusOf(p) { return ({ 'Not started':'Pending', 'In progress':'Pending', Completed:'Surveyed', 'Flagged/Revisit':'Flagged / Revisit' }[p?.survey_status] || p?.survey_status || 'Pending'); }
function statusClass(status) { return ({ Pending:'pending', Surveyed:'surveyed', Verified:'verified', 'Flagged / Revisit':'flagged' }[status] || 'pending'); }
function displayValue(value) { return value === null || value === undefined || value === '' || value === '0.0' ? '—' : escapeHtml(value); }
function errorMessage(error) { return error?.message || 'Something went wrong. Please try again.'; }
function isAdmin() { return state.user?.role === 'admin'; }
function isOffice() { return state.user?.role === 'authority'; }
function isField() { return state.user?.role === 'editor'; }
function canReview() { return isAdmin() || isOffice(); }
function roleLabel(role) { return ({ admin:'Admin', authority:'Office', editor:'Field' }[role] || role || 'User'); }
function canEditQuestionField(key, value) { if (['survey_status', 'verification_status', 'verification_date'].includes(key)) return false; return state.user?.role === 'admin' || (state.user?.role === 'editor' && !['BuildingID', 'assigned_team'].includes(key)); }
function draftKey(householdId) { return `mrdcl-questionnaire-draft:${state.user?.username || 'guest'}:${householdId}`; }
function saveDraft() { if (!state.selected) return; const key = draftKey(state.selected.id); if (!state.dirty.size) { localStorage.removeItem(key); deleteIndexedDraft(key).catch(() => {}); return; } const values = Object.fromEntries(state.dirty); localStorage.setItem(key, JSON.stringify({ saved_at:new Date().toISOString(), values })); putIndexedDraft(key, values).catch(() => {}); }
function restoreDraft(household) { try { const draft = JSON.parse(localStorage.getItem(draftKey(household.id)) || 'null'); const values = draft?.values; if (!values || typeof values !== 'object') return false; state.dirty = new Map(Object.entries(values).filter(([key, value]) => String(household.properties[key] ?? '') !== String(value ?? ''))); return state.dirty.size > 0; } catch { localStorage.removeItem(draftKey(household.id)); return false; } }
async function restoreIndexedDraft(household) { try { const saved = await getIndexedDraft(draftKey(household.id)); const values = saved?.values; if (!values || typeof values !== 'object') return false; state.dirty = new Map(Object.entries(values).filter(([key, value]) => String(household.properties[key] ?? '') !== String(value ?? ''))); return state.dirty.size > 0; } catch { return false; } }
function clearDraft(householdId) { const key = draftKey(householdId); localStorage.removeItem(key); deleteIndexedDraft(key).catch(() => {}); }
function questionnaireCoverage(household) { const keys = state.questionnaireSchema.map(field => field.field_key); const answered = keys.filter(key => String(household.properties[key] ?? '').trim() !== '').length; return { answered, total:keys.length, percent:keys.length ? Math.round((answered / keys.length) * 100) : 0 }; }
async function api(url, options = {}) {
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(data.error || `Request failed (${response.status})`); error.status = response.status; error.data = data; throw error; }
  return data;
}
function formatFileSize(bytes) {
  const size = Number(bytes || 0); if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(size >= 10 * 1024 * 1024 ? 0 : 1)} MB`;
}
function readProjectFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.onerror = () => reject(new Error('The selected file could not be read.'));
    reader.onload = () => resolve(reader.result); reader.readAsDataURL(file);
  });
}
let guideStepIndex = 0;
const guideSteps = [
  { title:'Find the work area', text:'Use the Musi Phase map to enter the approved survey area. Select a building on the map or open Project Register to search households.' },
  { title:'Record and save survey work', text:'Complete the questionnaire, add photos from camera or gallery, and save changes. If the network drops, drafts and queued updates remain on this device until they sync.' },
  { title:'Use shared project files', text:'Open Data library to upload or download shared Excel, Word, PDF, and GIS files. GeoJSON files can also be added to Map layers for everyone.' }
];
function guideKey() { return `mrdcl-portal-guide-seen:${state.user?.username || 'guest'}`; }
function renderGuideStep() {
  const step = guideSteps[guideStepIndex]; const holder = $('#guideStep'); if (!holder) return;
  holder.innerHTML = `<span>Step ${guideStepIndex + 1} of ${guideSteps.length}</span><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.text)}</p>`;
  document.querySelectorAll('.guide-progress i').forEach((dot, index) => dot.classList.toggle('active', index <= guideStepIndex));
  $('#guideBack').hidden = guideStepIndex === 0; $('#guideNext').textContent = guideStepIndex === guideSteps.length - 1 ? 'Finish' : 'Next';
}
function openPortalGuide() { guideStepIndex = 0; renderGuideStep(); if (!$('#guideDialog').open) $('#guideDialog').showModal(); }
function finishPortalGuide() { try { localStorage.setItem(guideKey(), '1'); } catch { /* A privacy setting must not block portal use. */ } if ($('#guideDialog').open) $('#guideDialog').close(); }
function showPortalGuideForNewUser() { try { if (!localStorage.getItem(guideKey())) openPortalGuide(); } catch { openPortalGuide(); } }
function sharedFileRow(file, compact = false) {
  const mapAction = file.map_supported ? (file.map_layer
    ? `<button class="button secondary" type="button" data-library-remove-map="${file.map_layer.id}">Remove from layers</button>`
    : `<button class="button secondary" type="button" data-library-add-map="${file.id}">Add to map layers</button>`) : '';
  return `<article class="library-file ${compact ? 'compact':''}"><div class="library-file-icon">${file.map_supported ? '⌖' : '▤'}</div><div><b>${escapeHtml(file.original_name)}</b><small>${escapeHtml(String(file.extension || 'file').toUpperCase())} · ${formatFileSize(file.size_bytes)} · added by ${escapeHtml(file.created_by)}</small>${file.map_supported ? `<em>${file.map_layer ? `Shown as “${escapeHtml(file.map_layer.name)}”` : 'GeoJSON — available for map layers'}</em>` : ''}</div><div class="library-file-actions"><a class="button secondary" href="${escapeHtml(file.download_url)}">Download</a><button class="button secondary" type="button" data-library-share="${escapeHtml(file.download_url)}" data-library-share-name="${escapeHtml(file.original_name)}">Share link</button>${mapAction}${compact ? '' : `<button class="button danger" type="button" data-library-delete="${file.id}" data-library-name="${escapeHtml(file.original_name)}">Delete</button>`}</div></article>`;
}
async function renderDataLibrary(content) {
  content.innerHTML = '<p class="tool-copy">Loading shared data library…</p>';
  const data = await api('/api/library-files'); const files = data.files || [];
  content.innerHTML = `<section class="library-intro"><h3>Shared data library</h3><button id="openPortalGuide" class="text-button" type="button">How to use this portal</button></section><section class="library-upload"><h3>Add a shared file</h3><p>Excel, CSV, Word, PDF, GeoJSON, KML, GeoPackage, Shapefile, and XML support files up to 8 MB.</p><form id="libraryUploadForm" class="library-upload-form"><label>Choose file<input id="libraryUploadFile" type="file" accept=".xlsx,.xls,.csv,.docx,.doc,.pdf,.geojson,.json,.kml,.gpkg,.zip,.shp,.dbf,.shx,.xml" required></label><button class="button primary" type="submit">Add to library</button><p id="libraryNotice" class="tool-notice"></p></form></section><section class="library-list-section"><div class="library-list-head"><h3>Project files</h3><span>${files.length} file${files.length === 1 ? '' : 's'}</span></div><div class="library-file-list">${files.length ? files.map(file => sharedFileRow(file)).join('') : '<p class="tool-copy">No shared files yet. Add the first project file above.</p>'}</div></section>`;
  $('#openPortalGuide').addEventListener('click', openPortalGuide);
  $('#libraryUploadForm').addEventListener('submit', async event => {
    event.preventDefault(); const file = $('#libraryUploadFile').files?.[0]; const notice = $('#libraryNotice'); const button = event.submitter;
    if (!file) { notice.textContent = 'Choose a file first.'; return; }
    if (file.size > 8_000_000) { notice.textContent = 'Choose a file smaller than 8 MB.'; return; }
    button.disabled = true; button.textContent = 'Adding…'; notice.textContent = 'Reading file…';
    try { await api('/api/library-files', { method:'POST', body:JSON.stringify({ filename:file.name, data_url:await readProjectFile(file) }) }); await renderToolContent('library'); }
    catch (error) { notice.textContent = errorMessage(error); button.disabled = false; button.textContent = 'Add to library'; }
  });
}
async function loadQuestionnaireSchema() {
  const data = await api('/api/questionnaire-schema');
  state.questionnaireSchema = data.fields || [];
  if (Array.isArray(data.tabs) && data.tabs.length) state.questionnaireTabs = data.tabs;
  state.questionnaireSchema.forEach(field => { fieldName[field.field_key] = field.label; });
  renderQuestionnaireTabNav();
  return state.questionnaireSchema;
}
const OFFLINE_DB = 'mrdcl-field-queue-v1';
function openOfflineDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(OFFLINE_DB, 2);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains('operations')) {
        const store = request.result.createObjectStore('operations', { keyPath:'id', autoIncrement:true });
        store.createIndex('by_user', 'username'); store.createIndex('by_household', 'householdId');
      }
      if (!request.result.objectStoreNames.contains('drafts')) request.result.createObjectStore('drafts', { keyPath:'key' });
    };
    request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error || new Error('Offline storage is unavailable.'));
  });
}
async function queueItems() {
  const db = await openOfflineDb();
  return new Promise((resolve, reject) => { const request = db.transaction('operations', 'readonly').objectStore('operations').getAll(); request.onsuccess = () => resolve(request.result || []); request.onerror = () => reject(request.error); });
}
async function putQueueItem(item) {
  const db = await openOfflineDb();
  return new Promise((resolve, reject) => { const request = db.transaction('operations', 'readwrite').objectStore('operations').put(item); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
}
async function deleteQueueItem(id) {
  const db = await openOfflineDb();
  return new Promise((resolve, reject) => { const request = db.transaction('operations', 'readwrite').objectStore('operations').delete(id); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error); });
}
async function putIndexedDraft(key, values) {
  const db = await openOfflineDb();
  return new Promise((resolve, reject) => { const request = db.transaction('drafts', 'readwrite').objectStore('drafts').put({ key, values, savedAt:Date.now() }); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error); });
}
async function getIndexedDraft(key) {
  const db = await openOfflineDb();
  return new Promise((resolve, reject) => { const request = db.transaction('drafts', 'readonly').objectStore('drafts').get(key); request.onsuccess = () => resolve(request.result || null); request.onerror = () => reject(request.error); });
}
async function deleteIndexedDraft(key) {
  const db = await openOfflineDb();
  return new Promise((resolve, reject) => { const request = db.transaction('drafts', 'readwrite').objectStore('drafts').delete(key); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error); });
}
async function removeConflictOperations(householdId) {
  const items = await queueItems();
  await Promise.all(items.filter(item => item.username === state.user?.username && item.householdId === householdId && item.status === 'conflict').map(item => deleteQueueItem(item.id)));
}
function updateSyncIndicator() {
  const indicator = $('#syncIndicator'); if (!indicator) return;
  const pending = [...state.pendingByHousehold.values()].filter(item => item.status !== 'conflict').length;
  const conflict = [...state.pendingByHousehold.values()].filter(item => item.status === 'conflict').length;
  const ago = state.sync.lastAt ? Math.max(0, Math.floor((Date.now() - state.sync.lastAt) / 1000)) : null;
  const text = conflict ? `${conflict} needs review` : pending ? `${pending} pending sync${pending === 1 ? '' : 's'}` : state.sync.status === 'synced' ? `Synced ${ago === null ? 'now' : `${ago}s ago`}` : state.sync.status === 'reconnecting' ? 'Reconnecting…' : 'Offline';
  indicator.textContent = text; indicator.dataset.state = conflict ? 'attention' : state.sync.status;
}
async function refreshPendingOperations() {
  if (!state.user) return;
  try {
    const items = (await queueItems()).filter(item => item.username === state.user.username);
    state.pendingByHousehold = new Map();
    items.forEach(item => { if (item.householdId) state.pendingByHousehold.set(item.householdId, item); });
    updateSyncIndicator(); renderList();
  } catch { /* IndexedDB is optional only in browsers that block local storage. */ }
}
async function enqueueOperation(operation) {
  const nowMs = Date.now(); const items = await queueItems();
  // Coalesce repeated questionnaire edits for one household into one ordered
  // save, so a field worker can continue editing safely while offline.
  const existing = operation.type === 'household-save' && items.find(item => item.username === state.user?.username && item.type === operation.type && item.householdId === operation.householdId && item.status !== 'conflict');
  if (existing) {
    const prior = JSON.parse(existing.body); const next = JSON.parse(operation.body);
    existing.body = JSON.stringify({ ...prior, data:{ ...(prior.data || {}), ...(next.data || {}) } });
    existing.updatedAt = nowMs; await putQueueItem(existing);
  } else await putQueueItem({ ...operation, username:state.user?.username, status:'pending', attempts:0, createdAt:nowMs, updatedAt:nowMs, nextAttemptAt:nowMs });
  await refreshPendingOperations();
}
function isNetworkFailure(error) { return !navigator.onLine || !error?.status || error.status >= 500 || error.status === 408 || error.status === 429; }
async function sendOrQueue(operation) {
  try {
    if (!navigator.onLine) throw new Error('Offline');
    const result = await api(operation.url, { method:operation.method, body:operation.body }); state.sync.status = 'synced'; state.sync.lastAt = Date.now(); updateSyncIndicator(); return result;
  } catch (error) {
    if (!isNetworkFailure(error)) throw error;
    await enqueueOperation(operation); return { queued:true };
  }
}
async function flushOfflineQueue() {
  if (state.queueFlushing || !state.user || !navigator.onLine) return;
  state.queueFlushing = true;
  try {
    const items = (await queueItems()).filter(item => item.username === state.user.username).sort((a,b) => a.createdAt - b.createdAt);
    for (const item of items) {
      if (item.status === 'conflict') break;
      if ((item.nextAttemptAt || 0) > Date.now()) break;
      try {
        await api(item.url, { method:item.method, body:item.body }); await deleteQueueItem(item.id); state.sync.status = 'synced'; state.sync.lastAt = Date.now();
      } catch (error) {
        if (error.status === 409) { item.status = 'conflict'; item.conflict = error.data?.household || null; item.updatedAt = Date.now(); await putQueueItem(item); break; }
        if (!isNetworkFailure(error)) { item.status = 'failed'; item.error = errorMessage(error); item.updatedAt = Date.now(); await putQueueItem(item); break; }
        item.attempts = (item.attempts || 0) + 1; item.nextAttemptAt = Date.now() + Math.min(60000, 2000 * (2 ** Math.min(item.attempts, 5))); item.updatedAt = Date.now(); await putQueueItem(item); break;
      }
    }
  } finally { state.queueFlushing = false; await refreshPendingOperations(); }
}
function startRealtime() {
  state.realtime?.close(); if (!state.user || !window.EventSource) return;
  state.sync.status = navigator.onLine ? 'reconnecting' : 'offline'; updateSyncIndicator();
  const stream = new EventSource('/api/realtime'); state.realtime = stream;
  stream.addEventListener('connected', () => { state.sync.status = 'synced'; state.sync.lastAt = Date.now(); updateSyncIndicator(); flushOfflineQueue(); });
  stream.addEventListener('change', event => {
    state.sync.status = 'synced'; state.sync.lastAt = Date.now(); updateSyncIndicator();
    const change = (() => { try { return JSON.parse(event.data); } catch { return {}; } })();
    clearTimeout(state.realtimeTimer); state.realtimeTimer = setTimeout(async () => { try {
      if (change.type === 'questionnaire-schema') {
        await loadQuestionnaireSchema();
        if (state.selected) renderQuestionnaire(state.selected);
      }
      await Promise.all([loadBuildingBase(), refreshHouseholds(), refreshSidebar(), loadCustomMapLayers()]);
      // Keep the supervisor dashboard current when field or office work changes
      // a questionnaire on any connected device.
      if (!$('#dashboardView').hidden && $('#dashboardView').querySelector('.dashboard-shell')) await openDashboard();
    } catch { /* EventSource retries when a network change occurs. */ } }, 180);
  });
  stream.onerror = () => { state.sync.status = navigator.onLine ? 'reconnecting' : 'offline'; updateSyncIndicator(); };
}
const BASEMAPS = {
  imagery: { label:'Satellite imagery (Esri)', url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution:'Satellite imagery © Esri', nativeZoom:19 },
  imageryLabels: { label:'Satellite imagery + labels (Esri)', tileUrls:['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}','https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'], attribution:'Satellite imagery © Esri', nativeZoom:19 }
};
function setBasemap(id, visible = true) {
  const definition = BASEMAPS[id]; if (!definition || !state.map) return;
  if (state.attributionControl && state.basemapAttribution) state.attributionControl.removeAttribution(state.basemapAttribution);
  state.basemapLayers.forEach(layer => state.map.removeLayer(layer));
  state.basemapId = id; state.basemapVisible = visible;
  let layer = state.basemapLayers.get(id);
  if (!layer) { const urls = definition.tileUrls || [definition.url]; layer = L.layerGroup(urls.map(url => L.tileLayer(url, { maxZoom:19, maxNativeZoom:definition.nativeZoom, ...(definition.options || {}) }))); state.basemapLayers.set(id, layer); }
  state.basemapAttribution = visible ? definition.attribution : null;
  if (visible) { layer.addTo(state.map); state.attributionControl?.addAttribution(definition.attribution); }
}
function initMap() {
  state.map = L.map('map', { zoomControl: false, preferCanvas: true, attributionControl: false, maxZoom:19 });
  state.attributionControl = L.control.attribution({ position: 'bottomright', prefix: false }).addTo(state.map);
  setBasemap('imagery');
  L.control.zoom({ position: 'bottomleft' }).addTo(state.map);
  state.map.on('click', event => { if (state.drawingMode) { if (event.originalEvent) L.DomEvent.stop(event.originalEvent); addDrawingPoint(event.latlng); return; } if (state.measureMode) addMeasurementPoint(event.latlng); });
  renderMapLegend();
}
function isDrawerLayout() { return window.matchMedia('(max-width: 1023px)').matches; }
function setPhonePanel(panel) {
  const app = $('#appView');
  const isDrawer = isDrawerLayout(); const open = isDrawer && Boolean(panel);
  app.classList.toggle('mobile-register-open', isDrawer && panel === 'register');
  app.classList.toggle('mobile-tool-open', isDrawer && panel === 'tool');
  app.classList.toggle('mobile-detail-open', isDrawer && panel === 'detail');
  app.classList.toggle('detail-sheet-half', isDrawer && panel === 'detail' && state.detailSheet === 'half');
  app.classList.toggle('detail-sheet-full', isDrawer && panel === 'detail' && state.detailSheet === 'full');
  document.body.classList.toggle('drawer-open', open);
  if (state.map) setTimeout(() => state.map.invalidateSize(), 250);
}
function setDetailSheet(mode) {
  if (!isDrawerLayout()) return;
  if (mode === 'closed') { closeSurveyToMap(); return; }
  state.detailSheet = mode === 'full' ? 'full' : 'half'; setPhonePanel('detail');
}
function closeTools() {
  state.activeTool = null; $('#appView').classList.remove('tool-panel-open'); setPhonePanel(null); $('#toolPanel').setAttribute('aria-hidden', 'true'); $('#openTools').setAttribute('aria-expanded', 'false'); $('#toolBackdrop').hidden = true; document.querySelectorAll('.rail-button[data-tool]').forEach(button => button.classList.remove('active')); rememberPortalLocation();
}
function closeSurveyToMap() { clearSelectedHouseholdHighlight(); $('#appView').classList.remove('detail-panel-open', 'detail-sheet-half', 'detail-sheet-full'); setPhonePanel(null); rememberPortalLocation(); }
function returnToPhaseMap() {
  closeTools(); closeSurveyToMap(); clearMusiSubZoneHighlight(); state.selected = null; state.selectedZone = null; clearPortalResume();
  [state.geoLayer, state.baseLayer, state.bifurcatedLayer, state.photoLayer].forEach(layer => layer?.remove());
  showZoneLanding();
}
function layerPreference(id) { return state.layerPrefs[id] || DEFAULT_LAYER_PREFS[id] || { name:titleCase(id), color:'#516b84' }; }
function layerTitle(id) { return layerPreference(id).name || titleCase(id); }
function layerColor(id, fallback) { return layerPreference(id).color || fallback; }
function renderMapLegend() {
  const el = $('#mapLegend'); if (!el) return;
  const dot = (id, fallback) => `<i class="legend-dot" style="background:${escapeHtml(layerColor(id, fallback))}"></i>`;
  const configured = [['buildings',state.baseLayer,'#e6b84d'],['bifurcated',state.bifurcatedLayer,'#a855f7'],['musi_buffer',state.overlays.get('musi_buffer'),'#8b3cb8']].filter(([, layer]) => layer && state.map?.hasLayer(layer)); const custom = [...state.customLayers.values()].filter(item => item.layer && state.map?.hasLayer(item.layer));
  const labels = [...configured.map(([id,,color]) => `<span>${dot(id,color)}${escapeHtml(layerTitle(id))}</span>`), ...custom.map(item => `<span><i class="legend-dot" style="background:${escapeHtml(item.color)}"></i>${escapeHtml(item.name)}</span>`)].join('');
  el.innerHTML = `<div class="legend-layers">${labels || '<span>No GIS layers visible</span>'}</div><div class="legend-status"><b>Survey status</b><span><i class="legend-dot pending"></i>Pending</span><span><i class="legend-dot surveyed"></i>Surveyed</span><span><i class="legend-dot verified"></i>Verified</span><span><i class="legend-dot flagged"></i>Flagged / Revisit</span></div>`;
}
function applyLayerPreferences() {
  state.baseLayer?.setStyle(buildingBaseStyle); state.bifurcatedLayer?.setStyle({ color:layerColor('bifurcated','#a855f7'), weight:1, fill:false, opacity:.8 });
  state.overlays.forEach((layer, id) => layer.setStyle(overlayStyle(id))); renderMapLegend();
}
function saveLayerPreferences() { localStorage.setItem('mrdcl-layer-preferences', JSON.stringify(state.layerPrefs)); applyLayerPreferences(); }
function measureDistanceMetres() { return state.measurePoints.slice(1).reduce((total, point, index) => total + state.measurePoints[index].distanceTo(point), 0); }
function displayDistance(metres) { const values = { m:[metres,'m'], km:[metres / 1000,'km'], mi:[metres / 1609.344,'mi'], ft:[metres * 3.28084,'ft'] }; const [value,unit] = values[state.measureUnit] || values.m; return `${value >= 10 ? value.toFixed(1) : value.toFixed(2)} ${unit}`; }
function redrawMeasurement() { const value = measureDistanceMetres(); $('#measureValue').textContent = displayDistance(value); if (state.measureLine) state.map.removeLayer(state.measureLine); state.measureMarkers.forEach(marker => state.map.removeLayer(marker)); state.measureMarkers = []; if (state.measurePoints.length) { state.measureLine = L.polyline(state.measurePoints, { color:'#005ea8', weight:3, dashArray:'8 6' }).addTo(state.map); state.measureMarkers = state.measurePoints.map(point => L.circleMarker(point, { radius:5, color:'#fff', weight:2, fillColor:'#005ea8', fillOpacity:1 }).addTo(state.map)); } else state.measureLine = null; }
function clearMeasurement() { state.measurePoints = []; redrawMeasurement(); }
function setMeasureMode(active) { if (active) { if (state.drawingMode || !$('#drawingPanel').hidden) cancelDrawing(); $('#coordinatePanel').hidden = true; $('#locateCoordinates').classList.remove('active'); $('#locateCoordinates').setAttribute('aria-expanded', 'false'); } state.measureMode = active; $('#measureDistance').setAttribute('aria-pressed', String(active)); $('#measureDistance').classList.toggle('active', active); $('#measureDistance').textContent = active ? 'Measuring…' : 'Measure'; $('#measurePanel').hidden = !active; state.map.getContainer().style.cursor = active ? 'crosshair' : ''; if (!active) clearMeasurement(); }
function addMeasurementPoint(latlng) { state.measurePoints.push(latlng); redrawMeasurement(); }
function setCoordinatePanel(open) { if (open && state.measureMode) setMeasureMode(false); if (open && (state.drawingMode || !$('#drawingPanel').hidden)) cancelDrawing(); $('#coordinatePanel').hidden = !open; $('#locateCoordinates').classList.toggle('active', open); $('#locateCoordinates').setAttribute('aria-expanded', String(open)); if (open) setTimeout(() => $('#coordinateLatitude').focus(), 0); }
function clearCoordinateLocation() { if (state.coordinateMarker) state.map.removeLayer(state.coordinateMarker); state.coordinateMarker = null; $('#coordinateLatitude').value = ''; $('#coordinateLongitude').value = ''; $('#coordinateNotice').textContent = ''; }
function mapPinIcon(type = 'photo') {
  const isPhoto = type === 'photo'; const fill = isPhoto ? '#005ea8' : '#167c58'; const label = isPhoto ? 'Field photo' : 'Located coordinates';
  const symbol = isPhoto
    ? '<path d="M12 16.5h12v9H12z" fill="white"/><path d="M15 14h6l1.2 2.2h-8.4z" fill="white"/><circle cx="18" cy="21" r="2.5" fill="#005ea8" stroke="white" stroke-width="1.3"/>'
    : '<path d="M18 13.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zm0 11.2a3.7 3.7 0 1 1 0-7.4 3.7 3.7 0 0 1 0 7.4z" fill="white"/><path d="M18 10v5M18 27v5M10 21h5M21 21h5" stroke="white" stroke-width="1.7" stroke-linecap="round"/>';
  return L.divIcon({ className:`survey-map-pin ${isPhoto ? 'survey-map-pin-photo' : 'survey-map-pin-location'}`, html:`<span role="img" aria-label="${label}"><svg viewBox="0 0 36 46" aria-hidden="true"><path d="M18 1.5C8.9 1.5 2.5 8.7 2.5 17.2c0 12.2 15.5 27.3 15.5 27.3s15.5-15.1 15.5-27.3C33.5 8.7 27.1 1.5 18 1.5z" fill="${fill}" stroke="white" stroke-width="2"/>${symbol}</svg></span>`, iconSize:[36,46], iconAnchor:[18,45], popupAnchor:[0,-42] });
}
function locateCoordinates(latitude, longitude) { const lat = Number(latitude); const lng = Number(longitude); const notice = $('#coordinateNotice'); if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) { notice.textContent = 'Enter a latitude from −90 to 90 and longitude from −180 to 180.'; return; } if (state.coordinateMarker) state.map.removeLayer(state.coordinateMarker); state.coordinateMarker = L.marker([lat, lng], { title:'Located coordinates', riseOnHover:true, icon:mapPinIcon('location') }).addTo(state.map).bindPopup(`<b>Located point</b><br>${lat.toFixed(6)}, ${lng.toFixed(6)}`).openPopup(); state.map.setView([lat, lng], Math.max(state.map.getZoom(), 17), { animate:true }); notice.textContent = `Located ${lat.toFixed(6)}, ${lng.toFixed(6)}.`; }
function clearDrawingCanvas() { if (state.drawingPreview) state.map?.removeLayer(state.drawingPreview); state.drawingPreview = null; state.drawingMarkers.forEach(marker => state.map?.removeLayer(marker)); state.drawingMarkers = []; state.drawingPoints = []; }
function drawingGeometry() {
  const points = state.drawingPoints.map(point => [point.lng, point.lat]);
  if (state.drawingMode === 'point' && points.length >= 1) return { type:'Point', coordinates:points[0] };
  if (state.drawingMode === 'line' && points.length === 2) return { type:'LineString', coordinates:points };
  if (state.drawingMode === 'polyline' && points.length >= 2) return { type:'LineString', coordinates:points };
  if (state.drawingMode === 'polygon' && points.length >= 3) return { type:'Polygon', coordinates:[[...points, points[0]]] };
  return null;
}
function redrawDrawing() {
  if (state.drawingPreview) state.map.removeLayer(state.drawingPreview); state.drawingMarkers.forEach(marker => state.map.removeLayer(marker)); state.drawingPreview = null; state.drawingMarkers = [];
  if (!state.drawingPoints.length) return;
  const color = $('#drawingLayerColor')?.value || '#005ea8';
  const pointStyle = { radius:5, color:'#fff', weight:2, fillColor:color, fillOpacity:1, interactive:false };
  state.drawingMarkers = state.drawingPoints.map(point => L.circleMarker(point, pointStyle).addTo(state.map));
  if (state.drawingMode === 'point') state.drawingPreview = L.circleMarker(state.drawingPoints[0], { radius:9, color, weight:2, fillColor:color, fillOpacity:.25, interactive:false }).addTo(state.map);
  else if (state.drawingMode === 'polygon' && state.drawingPoints.length >= 3) state.drawingPreview = L.polygon(state.drawingPoints, { color, weight:2, fillColor:color, fillOpacity:.18, interactive:false }).addTo(state.map);
  else if (state.drawingPoints.length >= 2) state.drawingPreview = L.polyline(state.drawingPoints, { color, weight:2.5, dashArray:'7 5', interactive:false }).addTo(state.map);
}
function setDrawingCursor(active) { state.map?.getContainer().classList.toggle('drawing-active', active); if (state.map) state.map.getContainer().style.cursor = active ? 'crosshair' : ''; }
function openDrawingPanel(layer = null) {
  if (state.measureMode) setMeasureMode(false); $('#coordinatePanel').hidden = true; $('#locateCoordinates').classList.remove('active'); $('#locateCoordinates').setAttribute('aria-expanded', 'false');
  clearDrawingCanvas(); setDrawingCursor(false); state.drawingMode = null; state.editingDrawingLayerId = layer ? Number(layer.id) : null;
  const geometryType = layer?.geojson?.features?.[0]?.geometry?.type || 'Point';
  $('#drawingTitle').textContent = layer ? `Replace shape: ${layer.name}` : 'Draw a shared GIS layer';
  $('#drawingLayerName').value = layer?.name || '';
  $('#drawingLayerColor').value = layer?.color || '#005ea8';
  $('#drawingShapeType').value = /Polygon/.test(geometryType) ? 'polygon' : /LineString/.test(geometryType) ? 'polyline' : 'point';
  $('#drawingNotice').textContent = layer ? 'Draw a replacement shape, then save. The linked downloadable GeoJSON will be updated.' : 'Choose a shape type, start drawing, and click the map to add points.';
  $('#startDrawing').textContent = 'Start drawing'; $('#saveDrawnLayer').textContent = layer ? 'Save updated shape' : 'Save shared layer'; $('#drawingPanel').hidden = false;
}
function cancelDrawing() { clearDrawingCanvas(); setDrawingCursor(false); state.drawingMode = null; state.editingDrawingLayerId = null; $('#drawingPanel').hidden = true; }
function startDrawing() {
  const name = $('#drawingLayerName').value.trim(); const mode = $('#drawingShapeType').value;
  if (name.length < 2) { $('#drawingNotice').textContent = 'Enter a layer name before drawing.'; $('#drawingLayerName').focus(); return; }
  clearDrawingCanvas(); state.drawingMode = mode; setDrawingCursor(true); $('#startDrawing').textContent = mode === 'point' ? 'Click map to place point' : 'Click map to add points'; $('#drawingNotice').textContent = mode === 'point' ? 'Click the map once to place the point.' : `Click the map to define ${mode === 'line' ? 'a two-point line' : mode === 'polyline' ? 'a polyline' : 'a polygon'}. Use Undo point if needed.`;
}
function addDrawingPoint(latlng) { if (state.drawingMode === 'point') state.drawingPoints = [latlng]; else if (state.drawingMode === 'line') state.drawingPoints = [...state.drawingPoints.slice(0, 1), latlng]; else state.drawingPoints.push(latlng); redrawDrawing(); const count = state.drawingPoints.length; const required = state.drawingMode === 'line' || state.drawingMode === 'polyline' ? 'At least 2' : 'At least 3'; $('#drawingNotice').textContent = state.drawingMode === 'point' ? 'Point placed. Save the shared layer or click again to move it.' : `${count} point${count === 1 ? '' : 's'} added. ${required} are required.`; }
function undoDrawingPoint() { if (!state.drawingPoints.length) return; state.drawingPoints.pop(); redrawDrawing(); $('#drawingNotice').textContent = state.drawingPoints.length ? 'Last point removed.' : 'No points yet. Click the map to add a point.'; }
async function saveDrawnLayer() {
  const geometry = drawingGeometry(); const notice = $('#drawingNotice'); const button = $('#saveDrawnLayer'); const name = $('#drawingLayerName').value.trim();
  if (!geometry) { notice.textContent = state.drawingMode === 'line' || state.drawingMode === 'polyline' ? 'A line or polyline needs at least 2 points.' : state.drawingMode === 'polygon' ? 'A polygon needs at least 3 points.' : 'Place a point on the map first.'; return; }
  const geojson = { type:'FeatureCollection', features:[{ type:'Feature', properties:{ name }, geometry }] }; button.disabled = true; button.textContent = 'Saving…';
  try {
    if (state.editingDrawingLayerId) await api(`/api/custom-map-layers/${state.editingDrawingLayerId}`, { method:'PUT', body:JSON.stringify({ name, color:$('#drawingLayerColor').value, geojson }) });
    else await api('/api/drawn-map-layers', { method:'POST', body:JSON.stringify({ name, color:$('#drawingLayerColor').value, geojson }) });
    const wasEditing = Boolean(state.editingDrawingLayerId); cancelDrawing(); await loadCustomMapLayers(); if (state.activeTool === 'layers') await renderToolContent('layers'); showNotice(wasEditing ? 'Shared GIS layer and downloadable GeoJSON updated.' : 'Shared GIS layer saved to the Data library and added to the map.');
  } catch (error) { notice.textContent = errorMessage(error); button.disabled = false; button.textContent = state.editingDrawingLayerId ? 'Save updated shape' : 'Save shared layer'; }
}
function selectedCustomLayer() { return state.layerContext ? state.customLayers.get(Number(state.layerContext.id)) || state.layerContext : null; }
function closeLayerContextMenu() { $('#layerContextMenu').hidden = true; }
function openLayerContextMenu(layer, event) {
  if (!layer || !state.map) return; state.layerContext = layer;
  const menu = $('#layerContextMenu'); const stage = state.map.getContainer().closest('.map-stage'); const point = event?.containerPoint || state.map.latLngToContainerPoint(event?.latlng || state.map.getCenter());
  $('#layerContextTitle').textContent = layer.name; menu.hidden = false;
  const width = menu.offsetWidth || 210; const height = menu.offsetHeight || 240;
  menu.style.left = `${Math.max(8, Math.min(point.x + 10, stage.clientWidth - width - 8))}px`;
  menu.style.top = `${Math.max(8, Math.min(point.y + 10, stage.clientHeight - height - 8))}px`;
}
function zoomToCustomLayer(layer = selectedCustomLayer()) {
  if (!layer?.layer) return; closeLayerContextMenu(); const bounds = layer.layer.getBounds?.();
  if (bounds?.isValid()) state.map.fitBounds(bounds, { padding:[38, 38], maxZoom:18 });
}
function openLayerProperties(layer = selectedCustomLayer()) {
  if (!layer) return; closeLayerContextMenu(); state.layerContext = layer; $('#attributeTablePanel').hidden = true;
  $('#layerPropertiesTitle').textContent = `Properties: ${layer.name}`; $('#layerPropertiesName').value = layer.name; $('#layerPropertiesColor').value = layer.color; $('#layerPropertiesVisible').checked = Boolean(layer.visible); $('#layerPropertiesNotice').textContent = 'Changes apply only to this shared GIS layer.'; $('#layerPropertiesPanel').hidden = false;
}
function closeLayerProperties() { $('#layerPropertiesPanel').hidden = true; }
async function saveLayerProperties() {
  const layer = selectedCustomLayer(); if (!layer) return; const button = $('#saveLayerProperties'); const notice = $('#layerPropertiesNotice'); const name = $('#layerPropertiesName').value.trim();
  if (name.length < 2) { notice.textContent = 'Enter a layer name with at least two characters.'; return; }
  button.disabled = true; button.textContent = 'Saving…';
  try { await api(`/api/custom-map-layers/${layer.id}`, { method:'PUT', body:JSON.stringify({ name, color:$('#layerPropertiesColor').value, visible:$('#layerPropertiesVisible').checked }) }); await loadCustomMapLayers(); state.layerContext = state.customLayers.get(Number(layer.id)); notice.textContent = 'Layer properties saved.'; if (state.activeTool === 'layers') await renderToolContent('layers'); }
  catch (error) { notice.textContent = errorMessage(error); }
  finally { button.disabled = false; button.textContent = 'Save properties'; }
}
function attributeKeysForLayer(layer) { const keys = new Set(state.attributeKeys.length ? state.attributeKeys : []); for (const feature of layer.geojson?.features || []) Object.keys(feature.properties || {}).forEach(key => keys.add(key)); return [...keys].filter(key => key && key.length <= 80).slice(0, 40); }
function renderAttributeTable(layer = state.attributeLayerId && state.customLayers.get(Number(state.attributeLayerId))) {
  if (!layer) return; const keys = attributeKeysForLayer(layer); state.attributeKeys = keys;
  const headers = keys.map(key => `<th>${escapeHtml(key)}</th>`).join(''); const rows = (layer.geojson?.features || []).map((feature, index) => `<tr><td>${index + 1}</td>${keys.map(key => `<td><input data-attribute-index="${index}" data-attribute-key="${escapeHtml(key)}" value="${escapeHtml(String(feature.properties?.[key] ?? ''))}" aria-label="Feature ${index + 1}, ${escapeHtml(key)}"></td>`).join('')}</tr>`).join('');
  $('#attributeTableContent').innerHTML = `<table class="attribute-table"><thead><tr><th>Feature</th>${headers}</tr></thead><tbody>${rows || '<tr><td colspan="2">No features in this layer.</td></tr>'}</tbody></table>`;
}
function openAttributeTable(layer = selectedCustomLayer()) {
  if (!layer) return; closeLayerContextMenu(); state.layerContext = layer; state.attributeLayerId = Number(layer.id); state.attributeKeys = []; $('#layerPropertiesPanel').hidden = true; $('#attributeTableTitle').textContent = `Attribute table: ${layer.name}`; $('#attributeTableNotice').textContent = 'Edit values and save when ready.'; renderAttributeTable(layer); $('#attributeTablePanel').hidden = false;
}
function closeAttributeTable() { $('#attributeTablePanel').hidden = true; state.attributeLayerId = null; state.attributeKeys = []; }
function addLayerAttribute() {
  const layer = state.attributeLayerId && state.customLayers.get(Number(state.attributeLayerId)); if (!layer) return; const next = window.prompt('New attribute name'); if (!next?.trim()) return;
  const key = next.trim().replace(/\s+/g, '_').replace(/[^A-Za-z0-9_]/g, '').slice(0, 80); if (!key) { $('#attributeTableNotice').textContent = 'Use letters, numbers, and underscores for an attribute name.'; return; }
  if (attributeKeysForLayer(layer).includes(key)) { $('#attributeTableNotice').textContent = 'That attribute already exists.'; return; }
  layer.geojson.features.forEach(feature => { feature.properties = { ...(feature.properties || {}), [key]:'' }; }); state.attributeKeys = [...attributeKeysForLayer(layer), key]; renderAttributeTable(layer); $('#attributeTableNotice').textContent = `Added ${key}. Save the table to publish it.`;
}
async function saveLayerAttributes() {
  const layer = state.attributeLayerId && state.customLayers.get(Number(state.attributeLayerId)); if (!layer) return; const notice = $('#attributeTableNotice'); const button = $('#saveLayerAttributes'); const geojson = JSON.parse(JSON.stringify(layer.geojson));
  $('#attributeTableContent').querySelectorAll('[data-attribute-index]').forEach(input => { const index = Number(input.dataset.attributeIndex); const key = input.dataset.attributeKey; if (!geojson.features[index]) return; geojson.features[index].properties = { ...(geojson.features[index].properties || {}), [key]:input.value }; });
  button.disabled = true; button.textContent = 'Saving…';
  try { await api(`/api/custom-map-layers/${layer.id}`, { method:'PUT', body:JSON.stringify({ geojson }) }); await loadCustomMapLayers(); const updated = state.customLayers.get(Number(layer.id)); state.layerContext = updated; state.attributeLayerId = Number(layer.id); state.attributeKeys = []; $('#attributeTableTitle').textContent = `Attribute table: ${updated.name}`; renderAttributeTable(updated); notice.textContent = 'Attribute table saved. The downloadable GeoJSON is also updated.'; }
  catch (error) { notice.textContent = errorMessage(error); }
  finally { button.disabled = false; button.textContent = 'Save attribute table'; }
}
function xmlEscape(value) { return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;'); }
function kmlCoordinates(coordinates) { return coordinates.map(point => `${point[0]},${point[1]},${point[2] || 0}`).join(' '); }
function geometryToKml(geometry) {
  if (!geometry) return ''; if (geometry.type === 'Point') return `<Point><coordinates>${geometry.coordinates[0]},${geometry.coordinates[1]},${geometry.coordinates[2] || 0}</coordinates></Point>`;
  if (geometry.type === 'LineString') return `<LineString><tessellate>1</tessellate><coordinates>${kmlCoordinates(geometry.coordinates)}</coordinates></LineString>`;
  if (geometry.type === 'Polygon') return `<Polygon><outerBoundaryIs><LinearRing><coordinates>${kmlCoordinates(geometry.coordinates[0] || [])}</coordinates></LinearRing></outerBoundaryIs></Polygon>`;
  const parts = geometry.type === 'MultiPoint' ? geometry.coordinates.map(point => ({ type:'Point', coordinates:point })) : geometry.type === 'MultiLineString' ? geometry.coordinates.map(line => ({ type:'LineString', coordinates:line })) : geometry.type === 'MultiPolygon' ? geometry.coordinates.map(polygon => ({ type:'Polygon', coordinates:polygon })) : [];
  return `<MultiGeometry>${parts.map(geometryToKml).join('')}</MultiGeometry>`;
}
function downloadLayerData(layer, format) {
  if (!layer) return; const safeName = String(layer.name || 'shared-layer').replace(/[^A-Za-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '') || 'shared-layer';
  const isKml = format === 'kml'; const content = isKml ? `<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>${xmlEscape(layer.name)}</name>${(layer.geojson.features || []).map((feature, index) => `<Placemark><name>${xmlEscape(feature.properties?.name || `${layer.name} ${index + 1}`)}</name>${geometryToKml(feature.geometry)}</Placemark>`).join('')}</Document></kml>` : JSON.stringify(layer.geojson, null, 2);
  const blob = new Blob([content], { type:isKml ? 'application/vnd.google-earth.kml+xml' : 'application/geo+json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `${safeName}.${isKml ? 'kml' : 'geojson'}`; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 0);
}
async function removeCustomLayerFromContext() {
  const layer = selectedCustomLayer(); if (!layer || !window.confirm(`Remove ${layer.name} from shared map layers? Its GeoJSON file remains in the Data library.`)) return; closeLayerContextMenu();
  try { await api(`/api/custom-map-layers/${layer.id}`, { method:'DELETE' }); closeLayerProperties(); closeAttributeTable(); await loadCustomMapLayers(); if (state.activeTool === 'layers') await renderToolContent('layers'); }
  catch (error) { showNotice(errorMessage(error), true); }
}
function enableFloatingPanel(panelId) {
  const panel = $(panelId); const handle = panel?.querySelector('[data-drag-handle]'); if (!panel || !handle || handle.dataset.dragReady) return; handle.dataset.dragReady = '1'; let drag = null;
  handle.addEventListener('pointerdown', event => { if (event.button !== undefined && event.button !== 0) return; if (event.target.closest('button,input,select,textarea')) return; const stage = state.map?.getContainer().closest('.map-stage'); if (!stage) return; const rect = panel.getBoundingClientRect(); const stageRect = stage.getBoundingClientRect(); drag = { offsetX:event.clientX - rect.left, offsetY:event.clientY - rect.top, stage }; panel.style.right = 'auto'; handle.setPointerCapture?.(event.pointerId); event.preventDefault(); });
  handle.addEventListener('pointermove', event => { if (!drag) return; const width = panel.offsetWidth; const height = panel.offsetHeight; const x = Math.max(6, Math.min(event.clientX - drag.stage.getBoundingClientRect().left - drag.offsetX, drag.stage.clientWidth - width - 6)); const y = Math.max(6, Math.min(event.clientY - drag.stage.getBoundingClientRect().top - drag.offsetY, drag.stage.clientHeight - height - 6)); panel.style.left = `${x}px`; panel.style.top = `${y}px`; });
  const stop = event => { if (!drag) return; try { handle.releasePointerCapture?.(event.pointerId); } catch { /* no-op */ } drag = null; }; handle.addEventListener('pointerup', stop); handle.addEventListener('pointercancel', stop);
}
function toolRows(items, options = {}) {
  return items.length ? `<div class="management-list">${items.map(item => `<label class="management-row">${options.selectable ? `<input type="checkbox" value="${escapeHtml(item.id)}">` : ''}<span><b>${escapeHtml(item.label || item.display_name || item.id || item.username)}</b><small>${escapeHtml(item.meta || item.status || item.role || '')}</small></span>${item.badge ? `<em>${escapeHtml(item.badge)}</em>` : ''}</label>`).join('')}</div>` : '<p class="tool-copy">No records are available.</p>';
}
function dashboardFields() {
  const selected = [
    ['q_construction_type', 'Structure type (current)', 'BuiType'],
    ['q_land_ownership', 'Land ownership', 'Classifica'],
    ['q_present_land_use', 'Present land use', 'Use'],
    ['q_livelihood_loss', 'Livelihood loss expected', 'q_livelihood_loss'],
    ['survey_status', 'Survey status', 'survey_status'],
    ['Classifica', 'Land / tenure classification', 'Classifica'],
    ['BuiType', 'Building type', 'BuiType'],
    ['StructType', 'Structure type (baseline)', 'StructType'],
    ['Use', 'Current use', 'Use'],
    ['Caste', 'Social category', 'Caste'],
    ['Income', 'Income category', 'Income']
  ];
  const known = new Set(selected.map(item => item[0]));
  for (const group of fieldGroups) for (const [key, label] of group.fields) if (!known.has(key)) { selected.push([key, label, key]); known.add(key); }
  for (const field of state.questionnaireSchema) if (!known.has(field.field_key)) { selected.push([field.field_key, field.label, field.field_key]); known.add(field.field_key); }
  return selected;
}
function chartColours() { return ['#005ea8','#d27d2d','#087f5b','#6a4c9c','#a33d74','#3175b9','#88661a','#5d6e7e','#c84d2c','#327675']; }
function chartRows(counts, comparison = null) {
  const keys = [...new Set([...Object.keys(counts), ...Object.keys(comparison || {})])]; const max = Math.max(1, ...keys.map(key => Math.max(counts[key] || 0, comparison?.[key] || 0)));
  return `<div class="chart-bars">${keys.map((key, index) => `<div class="chart-row"><span>${escapeHtml(key)}</span><div class="chart-track"><i style="width:${((counts[key] || 0) / max) * 100}%;background:${chartColours()[index % chartColours().length]}"></i>${comparison ? `<b style="width:${((comparison[key] || 0) / max) * 100}%"></b>` : ''}</div><em>${comparison ? `${comparison[key] || 0} → ${counts[key] || 0}` : counts[key] || 0}</em></div>`).join('')}</div>`;
}
function chartPie(counts) {
  const entries = Object.entries(counts); const total = Math.max(1, entries.reduce((sum, [, count]) => sum + count, 0)); let current = 0; const polar = angle => { const radians = (angle - 90) * Math.PI / 180; return [80 + 62 * Math.cos(radians), 80 + 62 * Math.sin(radians)]; };
  const slices = entries.map(([, count], index) => { const start = current; current += (count / total) * 360; const colour = chartColours()[index % chartColours().length]; if (current - start >= 359.99) return `<circle cx="80" cy="80" r="62" fill="${colour}"/>`; const [x1,y1] = polar(start); const [x2,y2] = polar(current); return `<path d="M80 80 L${x1.toFixed(3)} ${y1.toFixed(3)} A62 62 0 ${current - start > 180 ? 1 : 0} 1 ${x2.toFixed(3)} ${y2.toFixed(3)} Z" fill="${colour}"/>`; }).join('');
  return `<div class="chart-pie-layout"><svg class="chart-pie-svg" viewBox="0 0 160 160" role="img" aria-label="Pie chart of ${total} households">${slices}<circle cx="80" cy="80" r="38" fill="#fff"/><text x="80" y="76" text-anchor="middle" class="chart-pie-value">${total}</text><text x="80" y="94" text-anchor="middle" class="chart-pie-caption">households</text></svg><div class="chart-key">${entries.map(([key, count], index) => `<span><i style="background:${chartColours()[index % chartColours().length]}"></i>${escapeHtml(key)} <b>${count}</b></span>`).join('')}</div></div>`;
}
async function renderAnalyticsDashboard(content) {
  const fields = dashboardFields(); const defaultField = fields[0];
  content.innerHTML = `<section class="management-section analytics-panel"><h3>Household analysis</h3><p class="tool-copy">Choose any question or attribute, then choose how to display the current survey data. Baseline values are read-only and remain available for comparison.</p><div class="analytics-controls"><label class="compact-label">Question / attribute<select id="analyticsField">${fields.map(([key, label, baseline]) => `<option value="${escapeHtml(key)}" data-baseline="${escapeHtml(baseline)}">${escapeHtml(label)}</option>`).join('')}</select></label><label class="compact-label">Chart type<select id="analyticsChart"><option value="pie">Pie chart</option><option value="bar">Bar chart</option><option value="compare">Baseline vs current</option></select></label></div><div id="analyticsResult" class="analytics-result" aria-live="polite">Loading analysis…</div></section>`;
  const load = async () => {
    const select = $('#analyticsField'); const option = select.options[select.selectedIndex]; const chartType = $('#analyticsChart').value; const result = $('#analyticsResult'); result.textContent = 'Loading analysis…';
    try {
      const data = await api(`/api/analytics?field=${encodeURIComponent(select.value)}&baseline_field=${encodeURIComponent(option.dataset.baseline || select.value)}`);
      const title = escapeHtml(option.textContent); const body = chartType === 'pie' ? chartPie(data.current) : chartRows(data.current, chartType === 'compare' ? data.baseline : null);
      result.innerHTML = `<div class="analytics-heading"><b>${title}</b><small>${data.total} households · ${chartType === 'compare' ? 'baseline → current' : 'current survey values'}</small></div>${body}`;
    } catch (error) { result.textContent = errorMessage(error); }
  };
  $('#analyticsField').addEventListener('change', load); $('#analyticsChart').addEventListener('change', load); await load();
}
function dashboardTime(value) { if (!value) return 'No activity recorded'; const time = new Date(value); return Number.isNaN(time.getTime()) ? 'No activity recorded' : time.toLocaleString(); }
function closeDashboard() { const view = $('#dashboardView'); view.hidden = true; view.innerHTML = ''; if (state.activeTool === 'dashboard') state.activeTool = null; rememberPortalLocation(); setTimeout(() => state.map?.invalidateSize(), 50); }
function musiPhaseSubZone(feature) { return String(feature?.properties?.Zone_1 || feature?.properties?.Zonewise || feature?.properties?.Zone || 'Not recorded').trim() || 'Not recorded'; }
function updateZoneHighlightControl() {
  const button = $('#clearZoneHighlight');
  if (!button) return;
  const selectedZone = state.highlightedMusiSubZone;
  const focusedCount = state.dashboardFocusIds?.size || 0;
  const hasTemporarySelection = Boolean(selectedZone || focusedCount || state.musiSubZoneHighlight);
  button.hidden = !hasTemporarySelection;
  button.textContent = selectedZone ? `Clear ${selectedZone} highlight` : focusedCount ? `Clear ${focusedCount} highlighted household${focusedCount === 1 ? '' : 's'}` : 'Clear map selection';
}
function clearMusiSubZoneHighlight() {
  state.highlightedMusiSubZone = null;
  if (state.musiSubZoneHighlight) state.musiSubZoneHighlight.remove();
  state.musiSubZoneHighlight = null;
  updateZoneHighlightControl();
}
function clearSelectedHouseholdHighlight() {
  if (state.selectedHouseholdHighlight) state.selectedHouseholdHighlight.remove();
  state.selectedHouseholdHighlight = null;
}
function updateSelectedHouseholdHighlight() {
  clearSelectedHouseholdHighlight();
  const feature = state.selected && state.featureById.get(state.selected.id);
  if (!feature || !state.map) return;
  state.selectedHouseholdHighlight = L.geoJSON(feature, {
    interactive:false,
    style:{ color:'#00e5ff', weight:4.5, opacity:1, fillColor:'#00e5ff', fillOpacity:.42 }
  }).addTo(state.map);
  state.selectedHouseholdHighlight.bringToFront();
}
function clearMapSelection() {
  // Removes temporary dashboard/map filtering only; no household data is changed.
  state.dashboardFocusIds.clear();
  clearMusiSubZoneHighlight();
  restoreDashboardMapStyles();
  updateZoneHighlightControl();
}
function highlightHouseholdFeatures(features) {
  clearMusiSubZoneHighlight();
  if (!features.length || !state.map) return features;
  state.musiSubZoneHighlight = L.geoJSON({ type:'FeatureCollection', features }, {
    interactive:false,
    style:{ color:'#e11d48', weight:3.5, opacity:1, fillColor:'#ffe84a', fillOpacity:.52 }
  }).addTo(state.map);
  state.musiSubZoneHighlight.bringToFront();
  updateZoneHighlightControl();
  return features;
}
function highlightMusiSubZone(zone) {
  if (!zone || zone === 'All zones') { clearMusiSubZoneHighlight(); return []; }
  const features = highlightHouseholdFeatures(state.allFeatures.filter(feature => musiPhaseSubZone(feature) === zone));
  state.highlightedMusiSubZone = zone;
  updateZoneHighlightControl();
  return features;
}
function zoomDashboardZone(zone) {
  closeDashboard();
  const selected = highlightMusiSubZone(zone);
  if (!zone || zone === 'All zones') { $('#zoomBuildings').click(); return; }
  const layers = selected.map(feature => state.baseLayerById.get(feature.id) || state.layerById.get(feature.id)).filter(Boolean);
  const bounds = L.featureGroup(layers).getBounds(); if (bounds.isValid()) state.map.fitBounds(bounds, { padding:[28,28], maxZoom:18 });
}
function zoomDashboardGhmcZone(zone) {
  closeDashboard();
  const selected = !zone || zone === 'All zones' ? highlightHouseholdFeatures([]) : highlightHouseholdFeatures(state.allFeatures.filter(feature => String(feature.properties?.ghmc_zone || 'Outside GHMC zone') === zone));
  if (!zone || zone === 'All zones') { $('#zoomBuildings').click(); return; }
  const layers = selected.map(feature => state.baseLayerById.get(feature.id) || state.layerById.get(feature.id)).filter(Boolean);
  const bounds = L.featureGroup(layers).getBounds(); if (bounds.isValid()) state.map.fitBounds(bounds, { padding:[28,28], maxZoom:18 });
}
async function renderDashboardQuestionChart() {
  const fields = dashboardFields(); const select = $('#dashboardQuestion'); const option = select.options[select.selectedIndex]; const type = $('#dashboardChartType').value; const result = $('#dashboardQuestionResult'); result.textContent = 'Loading question analysis…';
  try { const data = await api(`/api/analytics?field=${encodeURIComponent(select.value)}&baseline_field=${encodeURIComponent(option.dataset.baseline || select.value)}`); const chart = type === 'pie' ? chartPie(data.current) : chartRows(data.current, type === 'compare' ? data.baseline : null); result.innerHTML = `<div class="analytics-heading"><b>${escapeHtml(option.textContent)}</b><small>${type === 'compare' ? 'Baseline → current survey values' : 'Current survey values'}</small></div>${chart}`; } catch (error) { result.textContent = errorMessage(error); }
}
async function openDashboard() {
  closeTools(); const view = $('#dashboardView'); view.hidden = false; view.innerHTML = '<div class="dashboard-loading">Loading MRDCL survey dashboard…</div>';
  try {
    const data = await api('/api/dashboard-overview'); if (view.hidden) return;
    const musiPhaseZones = data.musi_phase_zones || []; const ghmcZones = data.ghmc_zones || [];
    const kpis = [['Total households', data.total, 'neutral'], ['Surveyed', data.kpis.surveyed, 'complete'], ['Pending', data.kpis.pending, 'progress'], ['Revisit / in field', data.kpis.revisit, 'attention'], ['Verified', data.kpis.verified, 'verified']];
    const pipeline = data.pipeline.map(([label, count], index) => `<div class="pipeline-step step-${index}"><span>${index + 1}</span><b>${count}</b><small>${escapeHtml(label)}</small></div>`).join('');
    const quality = [['Missing photo', data.quality_flags.missing_photo, 'Photos needed before field close-out'], ['GPS off-location', data.quality_flags.gps_off_location, 'Photo farther than 250 m from building'], ['Duplicate Building ID', data.quality_flags.duplicate_building_id, 'Check controlled register identifiers'], ['Incomplete submitted form', data.quality_flags.incomplete_form, 'Submitted / verified records with key gaps']];
    const zoneRows = musiPhaseZones.map(zone => `<tr><td><button type="button" data-dashboard-zone="${escapeHtml(zone.zone)}">${escapeHtml(zone.zone)}</button></td><td>${zone.total}</td><td><div class="zone-progress"><i style="width:${zone.percent}%"></i></div><b>${zone.percent}%</b></td><td>${zone.pending}</td><td>${zone.statuses.Verified || 0}</td></tr>`).join('');
    const ghmcRows = ghmcZones.map(zone => `<tr><td>${escapeHtml(zone.zone)}</td><td>${zone.total}</td><td><div class="zone-progress"><i style="width:${zone.percent}%"></i></div><b>${zone.percent}%</b></td><td>${zone.pending}</td><td>${zone.statuses.Verified || 0}</td></tr>`).join('');
    const people = data.team_activity.users.map(person => `<tr><td><b>${escapeHtml(person.display_name)}</b><small>${escapeHtml(person.role)}</small></td><td>${person.today}</td><td>${dashboardTime(person.last_activity)}</td></tr>`).join('') || '<tr><td colspan="3">No team activity recorded yet.</td></tr>';
    const performance = data.performance.map(person => `<tr><td><b>${escapeHtml(person.display_name)}</b><small>${escapeHtml(person.username)}</small></td><td>${person.today}</td><td>${dashboardTime(person.last_activity)}</td></tr>`).join('') || '<tr><td colspan="3">No enumerator submissions today.</td></tr>';
    const updates = data.recent_updates.map(item => `<article class="dashboard-update"><b>${escapeHtml(item.display_name || item.username)}</b><span>${escapeHtml(item.action)}</span><small>${escapeHtml(item.household_id || item.detail || '')} · ${dashboardTime(item.at)}</small></article>`).join('') || '<p class="dashboard-empty">No updates recorded yet.</p>';
    const fields = dashboardFields();
    view.innerHTML = `<div class="dashboard-shell"><header class="dashboard-header"><div><p>MRDCL HOUSEHOLD SURVEY</p><h1>Survey operations dashboard</h1><small>Live operational view · updated ${dashboardTime(data.generated_at)}</small></div><button id="closeDashboard" class="button secondary" type="button">← Back to map</button></header><section class="dashboard-kpis">${kpis.map(([label,value,kind]) => `<article class="dashboard-kpi kpi-${kind}"><span>${escapeHtml(label)}</span><b>${value}</b><small>${label === 'Surveyed' ? `${data.total ? Math.round((value / data.total) * 100) : 0}% of mapped households` : 'Current shared register'}</small></article>`).join('')}</section><section class="dashboard-card dashboard-pipeline"><div class="dashboard-card-head"><div><h2>Status pipeline</h2><p>Fieldwork to office verification</p></div><button id="dashboardOpenMap" class="text-button" type="button">Open coverage map</button></div><div class="pipeline-flow">${pipeline}</div></section><section class="dashboard-mobile-actions"><button id="dashboardMobileMap" class="button primary" type="button">Open coverage map</button><p>Zone tables, data-quality checks, team activity, and detailed charts are available on desktop or tablet.</p></section><section class="dashboard-grid dashboard-detail"><article class="dashboard-card"><div class="dashboard-card-head"><div><h2>Team activity</h2><p><b>${data.team_activity.field_today}</b> field updates today · <b>${data.team_activity.office_today}</b> office updates today</p></div></div><div class="dashboard-table-wrap"><table class="dashboard-table"><thead><tr><th>User</th><th>Today</th><th>Last activity</th></tr></thead><tbody>${people}</tbody></table></div></article><article class="dashboard-card"><div class="dashboard-card-head"><div><h2>Data quality flags</h2><p>Prioritise these records before finalisation</p></div></div><div class="quality-grid">${quality.map(([label,count,copy]) => `<div><b>${count}</b><span>${escapeHtml(label)}</span><small>${escapeHtml(copy)}</small></div>`).join('')}</div></article><article class="dashboard-card dashboard-wide"><div class="dashboard-card-head"><div><h2>Musi Phase sub-zone coverage</h2><p>These corridor segments are separate from GHMC municipal zones. Select one to zoom the survey map.</p></div><label>Musi Phase sub-zone<select id="dashboardZoneSelect"><option value="All zones">All Musi Phase sub-zones</option>${musiPhaseZones.map(zone => `<option value="${escapeHtml(zone.zone)}">${escapeHtml(zone.zone)}</option>`).join('')}</select></label></div><div class="dashboard-table-wrap"><table class="dashboard-table zone-table"><thead><tr><th>Musi Phase sub-zone</th><th>Total</th><th>Done</th><th>Pending</th><th>Verified</th></tr></thead><tbody>${zoneRows}</tbody></table></div></article><article class="dashboard-card dashboard-wide"><div class="dashboard-card-head"><div><h2>GHMC municipal zone coverage</h2><p>Municipal zones are calculated from the supplied GHMC boundary layer and are separate from Musi Phase segments.</p></div></div><div class="dashboard-table-wrap"><table class="dashboard-table zone-table"><thead><tr><th>GHMC zone</th><th>Total</th><th>Done</th><th>Pending</th><th>Verified</th></tr></thead><tbody>${ghmcRows}</tbody></table></div></article><article class="dashboard-card"><div class="dashboard-card-head"><div><h2>Enumerator performance</h2><p>Questionnaire/photo updates today</p></div></div><div class="dashboard-table-wrap"><table class="dashboard-table"><thead><tr><th>Enumerator</th><th>Updates today</th><th>Last activity</th></tr></thead><tbody>${performance}</tbody></table></div></article><article class="dashboard-card"><div class="dashboard-card-head"><div><h2>Recent updates</h2><p>Live audit trail</p></div></div><div class="dashboard-feed">${updates}</div></article><article class="dashboard-card dashboard-wide"><div class="dashboard-card-head"><div><h2>Question analysis</h2><p>Select any questionnaire item or attribute and choose a chart.</p></div></div><div class="dashboard-analysis-controls"><label>Question / attribute<select id="dashboardQuestion">${fields.map(([key,label,baseline]) => `<option value="${escapeHtml(key)}" data-baseline="${escapeHtml(baseline)}">${escapeHtml(label)}</option>`).join('')}</select></label><label>Chart type<select id="dashboardChartType"><option value="pie">Pie chart</option><option value="bar">Bar chart</option><option value="compare">Baseline vs current</option></select></label></div><div id="dashboardQuestionResult" class="dashboard-question-result"></div></article></section></div>`;
    $('#closeDashboard').addEventListener('click', closeDashboard); $('#dashboardOpenMap').addEventListener('click', () => zoomDashboardZone($('#dashboardZoneSelect')?.value || 'All zones')); $('#dashboardMobileMap').addEventListener('click', () => zoomDashboardZone('All zones')); $('#dashboardZoneSelect').addEventListener('change', event => zoomDashboardZone(event.target.value)); view.querySelectorAll('[data-dashboard-zone]').forEach(button => button.addEventListener('click', () => zoomDashboardZone(button.dataset.dashboardZone))); $('#dashboardQuestion').addEventListener('change', renderDashboardQuestionChart); $('#dashboardChartType').addEventListener('change', renderDashboardQuestionChart); await renderDashboardQuestionChart();
  } catch (error) { view.innerHTML = `<div class="dashboard-loading"><p>${escapeHtml(errorMessage(error))}</p><button id="closeDashboard" class="button secondary" type="button">Back to map</button></div>`; $('#closeDashboard').addEventListener('click', closeDashboard); }
}
// Dashboard v45: focused operational review. These functions intentionally
// supersede the earlier single-chart dashboard functions above.
function dashboardStatusLabel(filter) { return ({ all:'All mapped households', pending:'Pending households', surveyed:'Surveyed households', flagged:'Flagged / revisit households', verified:'Verified households' })[filter] || 'Household attribute table'; }
function restoreDashboardMapStyles() { state.layerById.forEach((layer, id) => { const feature = state.featureById.get(id); if (feature) layer.setStyle(layerStyle(feature)); }); state.baseLayerById.forEach((layer, id) => { const feature = state.featureById.get(id); if (feature) layer.setStyle(buildingBaseStyle(feature)); }); }
function selectedDashboardQuestions() { return [...document.querySelectorAll('[data-dashboard-question]:checked')].map(input => ({ field:input.value, baseline:input.dataset.baseline || input.value, label:input.dataset.label || input.value })); }
async function loadDashboardAnalyses(selected) { return Promise.all(selected.map(async question => ({ ...question, data:await api(`/api/analytics?field=${encodeURIComponent(question.field)}&baseline_field=${encodeURIComponent(question.baseline)}`) }))); }
function dashboardChartSvg(title, current, baseline, type) {
  const entries = [...new Set([...Object.keys(current || {}), ...Object.keys(baseline || {})])].slice(0, 14); const labels = entries.length ? entries : ['Not recorded']; const maximum = Math.max(1, ...labels.map(key => Math.max(current?.[key] || 0, baseline?.[key] || 0))); const escape = value => String(value).replace(/[&<>]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' }[char])); const shortened = value => escape(String(value).length > 31 ? `${String(value).slice(0, 28)}…` : value);
  if (type === 'pie') {
    const total = Math.max(1, labels.reduce((sum, key) => sum + (Number(current?.[key]) || 0), 0)); let start = -90; const centreX = 140; const centreY = 150; const radius = 78; const point = angle => [centreX + radius * Math.cos(angle * Math.PI / 180), centreY + radius * Math.sin(angle * Math.PI / 180)]; const slices = labels.map((key, index) => { const amount = Number(current?.[key]) || 0; const end = start + amount / total * 360; const colour = chartColours()[index % chartColours().length]; if (end - start >= 359.99) { start = end; return `<circle cx="${centreX}" cy="${centreY}" r="${radius}" fill="${colour}"/>`; } const [x1,y1] = point(start); const [x2,y2] = point(end); const slice = `<path d="M${centreX} ${centreY} L${x1.toFixed(2)} ${y1.toFixed(2)} A${radius} ${radius} 0 ${end - start > 180 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z" fill="${colour}"/>`; start = end; return slice; }).join(''); const legend = labels.map((key, index) => `<rect x="285" y="${94 + index * 28}" width="12" height="12" rx="2" fill="${chartColours()[index % chartColours().length]}"/><text x="305" y="${105 + index * 28}" font-size="13" fill="#243b53">${shortened(key)} — ${Number(current?.[key]) || 0}</text>`).join(''); const height = Math.max(260, 112 + labels.length * 28); return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 ${height}" role="img" aria-label="${escape(title)} pie chart"><rect width="720" height="${height}" fill="#fff"/><text x="20" y="30" font-size="18" font-family="Segoe UI, Arial, sans-serif" font-weight="700" fill="#172b4d">${escape(title)}</text><text x="20" y="52" font-size="12" font-family="Segoe UI, Arial, sans-serif" fill="#536d87">Current survey values · ${total} households</text>${slices}<circle cx="${centreX}" cy="${centreY}" r="45" fill="#fff"/><text x="${centreX}" y="${centreY - 2}" text-anchor="middle" font-size="24" font-family="Segoe UI, Arial, sans-serif" font-weight="700" fill="#172b4d">${total}</text><text x="${centreX}" y="${centreY + 17}" text-anchor="middle" font-size="11" font-family="Segoe UI, Arial, sans-serif" fill="#536d87">households</text>${legend}</svg>`;
  }
  const width = 720; const left = 210; const right = 54; const top = 82; const row = type === 'compare' ? 50 : 38; const plotWidth = width - left - right; const height = Math.max(200, top + labels.length * row + 34); const grid = [0,.25,.5,.75,1].map(fraction => { const x = left + plotWidth * fraction; return `<line x1="${x}" y1="${top - 14}" x2="${x}" y2="${height - 28}" stroke="#d9e3ec" stroke-width="1"/><text x="${x}" y="${height - 10}" text-anchor="middle" font-size="11" fill="#536d87">${Math.round(maximum * fraction)}</text>`; }).join(''); const bars = labels.map((key, index) => { const y = top + index * row; const currentWidth = (Number(current?.[key]) || 0) / maximum * plotWidth; const beforeWidth = (Number(baseline?.[key]) || 0) / maximum * plotWidth; const label = shortened(key); if (type === 'compare') return `<text x="${left - 10}" y="${y + 18}" text-anchor="end" font-size="12" fill="#243b53">${label}</text><rect x="${left}" y="${y}" width="${beforeWidth}" height="13" rx="2" fill="#9fb3c8"/><rect x="${left}" y="${y + 19}" width="${currentWidth}" height="13" rx="2" fill="#005ea8"/><text x="${Math.min(left + Math.max(beforeWidth,currentWidth) + 8, width - 3)}" y="${y + 26}" font-size="11" fill="#172b4d">${Number(baseline?.[key]) || 0} → ${Number(current?.[key]) || 0}</text>`; const colour = chartColours()[index % chartColours().length]; return `<text x="${left - 10}" y="${y + 18}" text-anchor="end" font-size="12" fill="#243b53">${label}</text><rect x="${left}" y="${y + 3}" width="${currentWidth}" height="20" rx="2" fill="${colour}"/><text x="${Math.min(left + currentWidth + 8, width - 3)}" y="${y + 18}" font-size="11" fill="#172b4d">${Number(current?.[key]) || 0}</text>`; }).join(''); const legend = type === 'compare' ? `<rect x="${left}" y="56" width="12" height="12" rx="2" fill="#9fb3c8"/><text x="${left + 18}" y="67" font-size="11" fill="#536d87">Baseline</text><rect x="${left + 90}" y="56" width="12" height="12" rx="2" fill="#005ea8"/><text x="${left + 108}" y="67" font-size="11" fill="#536d87">Current survey</text>` : `<text x="${left}" y="67" font-size="11" fill="#536d87">Current survey values</text>`; return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escape(title)} ${type} chart"><rect width="${width}" height="${height}" fill="#fff"/><text x="20" y="30" font-size="18" font-family="Segoe UI, Arial, sans-serif" font-weight="700" fill="#172b4d">${escape(title)}</text><text x="20" y="52" font-size="12" font-family="Segoe UI, Arial, sans-serif" fill="#536d87">${type === 'compare' ? 'Baseline compared with current survey values' : 'Distribution of current survey values'}</text>${legend}${grid}${bars}</svg>`;
}
function downloadTextFile(name, type, text) { const url = URL.createObjectURL(new Blob([text], { type })); const link = document.createElement('a'); link.href = url; link.download = name; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
function refreshDashboardChartControls() {
  const result = $('#dashboardQuestionResult'); if (!result) return;
  const card = result.closest('.dashboard-card'); const copy = card?.querySelector('.dashboard-card-head p');
  if (copy) copy.textContent = 'Select multiple questions to show presentation-ready charts together. Download one chart pack or one Excel workbook containing every selected chart and its data.';
  const apply = $('#applyDashboardQuestions'); const pack = $('#downloadDashboardCharts'); const excel = $('#downloadDashboardWorkbook');
  if (apply) apply.textContent = 'Show selected charts'; if (pack) pack.textContent = 'Download chart pack'; if (excel) excel.textContent = 'Download Excel charts';
}
async function renderDashboardQuestionCharts() {
  refreshDashboardChartControls();
  const result = $('#dashboardQuestionResult'); const selected = selectedDashboardQuestions(); if (!selected.length) { result.innerHTML = '<p class="dashboard-empty">Select at least one question or attribute to create charts.</p>'; state.dashboardAnalyses = []; return; }
  if (selected.length > 12) { result.innerHTML = '<p class="dashboard-empty">Select up to 12 questions at one time.</p>'; return; }
  result.textContent = 'Loading selected question analysis…'; const type = $('#dashboardChartType').value;
  try { const analyses = await loadDashboardAnalyses(selected); state.dashboardAnalyses = analyses.map(analysis => ({ ...analysis, type })); result.innerHTML = analyses.map(analysis => `<article class="dashboard-analysis-chart"><div class="analytics-heading"><b>${escapeHtml(analysis.label)}</b><small>${analysis.data.total} households · ${type === 'compare' ? 'baseline → current survey values' : 'current survey values'}</small></div><div class="dashboard-svg-chart">${dashboardChartSvg(analysis.label, analysis.data.current, analysis.data.baseline, type)}</div></article>`).join(''); } catch (error) { result.textContent = errorMessage(error); }
}
async function downloadDashboardCharts() {
  const selected = selectedDashboardQuestions(); if (!selected.length) return; const type = $('#dashboardChartType').value; const analyses = state.dashboardAnalyses.length === selected.length ? state.dashboardAnalyses : (await loadDashboardAnalyses(selected)).map(analysis => ({ ...analysis, type }));
  const report = `<!doctype html><html><head><meta charset="utf-8"><title>MRDCL question analysis charts</title><style>body{margin:28px;font-family:Segoe UI,Arial,sans-serif;color:#172b4d}h1{font-size:24px;margin:0 0 6px}p{color:#536d87;margin:0 0 22px}.chart{break-inside:avoid;margin:0 0 26px;padding:18px;border:1px solid #d9e3ec;border-radius:8px}svg{display:block;width:100%;height:auto}</style></head><body><h1>MRDCL household survey — question analysis</h1><p>Generated ${new Date().toLocaleString()} · ${analyses.length} selected question${analyses.length === 1 ? '' : 's'}</p>${analyses.map(analysis => `<section class="chart">${dashboardChartSvg(analysis.label, analysis.data.current, analysis.data.baseline, type)}</section>`).join('')}</body></html>`;
  downloadTextFile(`mrdcl-question-chart-pack-${new Date().toISOString().slice(0, 10)}.html`, 'text/html;charset=utf-8', report);
}
function downloadDashboardAnalysisWorkbook() { const selected = selectedDashboardQuestions(); if (!selected.length) return; const params = new URLSearchParams({ fields:selected.map(item => item.field).join(','), baseline_fields:selected.map(item => item.baseline).join(','), chart_type:$('#dashboardChartType').value }); window.location.assign(`/api/analytics-export?${params}`); }
async function openDashboardStatusTable(filter) {
  const view = $('#dashboardView'); view.innerHTML = '<div class="dashboard-loading">Loading household attribute table…</div>';
  try {
    const data = await api(`/api/dashboard-households?filter=${encodeURIComponent(filter)}`); const questionColumns = state.questionnaireSchema.map(field => ({ key:field.field_key, label:field.label }));
    const render = includeQuestions => {
      const columns = [{ key:'BuildingID', label:'Building ID' }, { key:'household_id', label:'Household ID' }, { key:'HNoPlotNo', label:'Plot / house' }, { key:'assigned_team', label:'Assigned team' }, { key:'survey_status', label:'Survey status' }, { key:'verification_date', label:'Verification date' }, ...(includeQuestions ? questionColumns : [])];
      const rows = data.households.map(item => `<tr>${columns.map(column => `<td>${escapeHtml(displayValue(column.key === 'household_id' ? item.id : item.properties[column.key]))}</td>`).join('')}<td><button type="button" class="text-button" data-dashboard-household="${escapeHtml(item.id)}">Open / edit</button></td></tr>`).join('') || `<tr><td colspan="${columns.length + 1}">No households are in this work status.</td></tr>`;
      view.innerHTML = `<div class="dashboard-shell"><header class="dashboard-header"><div><h1>${escapeHtml(dashboardStatusLabel(filter))}</h1><small>${data.households.length} building block(s). Open a row to edit its questionnaire and verify it when ready.</small></div><div class="dashboard-header-actions"><button id="dashboardBack" class="button secondary" type="button">← Dashboard</button><button id="closeDashboard" class="button secondary" type="button">← Back to map</button></div></header><section class="dashboard-card dashboard-wide"><div class="dashboard-card-head"><div><h2>GIS attribute table</h2><p>Questionnaire answers remain GIS attributes and are included in every export.</p></div><button id="toggleQuestionColumns" class="button secondary" type="button">${includeQuestions ? 'Hide questionnaire columns' : 'Show all questionnaire columns'}</button></div><div class="dashboard-table-wrap dashboard-record-table"><table class="dashboard-table"><thead><tr>${columns.map(column => `<th>${escapeHtml(column.label)}</th>`).join('')}<th>Questionnaire</th></tr></thead><tbody>${rows}</tbody></table></div></section></div>`;
      $('#dashboardBack').addEventListener('click', openDashboard); $('#closeDashboard').addEventListener('click', closeDashboard); $('#toggleQuestionColumns').addEventListener('click', () => render(!includeQuestions)); view.querySelectorAll('[data-dashboard-household]').forEach(button => button.addEventListener('click', async () => { closeDashboard(); await openHousehold(button.dataset.dashboardHousehold, true); if (canReview()) activateTab('review'); }));
    };
    render(false);
  } catch (error) { view.innerHTML = `<div class="dashboard-loading"><p>${escapeHtml(errorMessage(error))}</p><button id="closeDashboard" class="button secondary" type="button">Back to map</button></div>`; $('#closeDashboard').addEventListener('click', closeDashboard); }
}
function focusDashboardQuality(flag) {
  const ids = state.dashboardQuality[flag] || []; if (!ids.length) return;
  if (flag === 'pending_sync') { if (navigator.onLine) flushOfflineQueue(); closeDashboard(); state.dashboardFocusIds = new Set(ids); restoreDashboardMapStyles(); updateZoneHighlightControl(); const layers = ids.map(id => state.baseLayerById.get(id) || state.layerById.get(id)).filter(Boolean); const bounds = L.featureGroup(layers).getBounds(); if (bounds.isValid()) state.map.fitBounds(bounds, { padding:[32,32], maxZoom:18 }); showNotice(navigator.onLine ? 'Pending records are being synchronised. The questionnaire remains available until each upload succeeds.' : 'This device is offline. The selected records are safely queued and will upload when it reconnects.'); if (ids.length === 1) openHousehold(ids[0], true); return; }
  closeDashboard(); state.dashboardFocusIds = new Set(ids); restoreDashboardMapStyles(); updateZoneHighlightControl(); const layers = ids.map(id => state.baseLayerById.get(id) || state.layerById.get(id)).filter(Boolean); const bounds = L.featureGroup(layers).getBounds(); if (bounds.isValid()) state.map.fitBounds(bounds, { padding:[32,32], maxZoom:18 }); if (ids.length === 1) openHousehold(ids[0], true).then(() => { if (canReview()) activateTab('review'); });
}
async function openDashboard() {
  closeTools(); state.dashboardFocusIds.clear(); restoreDashboardMapStyles(); updateZoneHighlightControl(); const view = $('#dashboardView'); view.hidden = false; view.innerHTML = '<div class="dashboard-loading">Loading work dashboard…</div>';
  try {
    const data = await api('/api/dashboard-overview'); if (view.hidden) return; const pendingSyncIds = [...state.pendingByHousehold.values()].filter(item => item.status !== 'conflict').map(item => item.householdId).filter(Boolean); state.dashboardQuality = { ...(data.quality_households || {}), pending_sync:pendingSyncIds };
    const musiPhaseZones = data.musi_phase_zones || []; const ghmcZones = data.ghmc_zones || []; const fields = dashboardFields();
    const kpis = [['Total households', data.total, 'neutral', 'all'], ['Surveyed', data.kpis.surveyed, 'complete', 'surveyed'], ['Pending', data.kpis.pending, 'progress', 'pending'], ['Flagged / revisit', data.kpis.revisit, 'attention', 'flagged'], ['Verified', data.kpis.verified, 'verified', 'verified']];
    const quality = [['pending_sync','Pending sync (this device)', pendingSyncIds.length, navigator.onLine ? 'Open to locate records and retry queued uploads' : 'Saved locally; upload resumes automatically on reconnect'], ['missing_photo','Missing photo', data.quality_flags.missing_photo, 'Photos needed before field close-out'], ['gps_off_location','GPS off-location', data.quality_flags.gps_off_location, 'Photo farther than 250 m from building'], ['duplicate_building_id','Duplicate Building ID', data.quality_flags.duplicate_building_id, 'Check controlled register identifiers'], ['incomplete_form','Incomplete submitted form', data.quality_flags.incomplete_form, 'Submitted / verified records with key gaps']];
    const zoneRows = musiPhaseZones.map(zone => `<tr><td><button type="button" data-dashboard-zone="${escapeHtml(zone.zone)}">${escapeHtml(zone.zone)}</button></td><td>${zone.total}</td><td><div class="zone-progress"><i style="width:${zone.percent}%"></i></div><b>${zone.percent}%</b></td><td>${zone.pending}</td><td>${zone.statuses.Verified || 0}</td></tr>`).join(''); const ghmcRows = ghmcZones.map(zone => `<tr><td><button type="button" data-dashboard-ghmc-zone="${escapeHtml(zone.zone)}">${escapeHtml(zone.zone)}</button></td><td>${zone.total}</td><td><div class="zone-progress"><i style="width:${zone.percent}%"></i></div><b>${zone.percent}%</b></td><td>${zone.pending}</td><td>${zone.statuses.Verified || 0}</td></tr>`).join(''); const people = data.team_activity.users.map(person => `<tr><td><b>${escapeHtml(person.display_name)}</b><small>${escapeHtml(person.role)}</small></td><td>${person.today}</td><td>${dashboardTime(person.last_sync || person.last_activity)}</td></tr>`).join('') || '<tr><td colspan="3">No team activity recorded yet.</td></tr>';
    const questionList = fields.map(([key,label,baseline], index) => `<label><input type="checkbox" data-dashboard-question value="${escapeHtml(key)}" data-baseline="${escapeHtml(baseline)}" data-label="${escapeHtml(label)}" ${index === 0 ? 'checked':''}><span>${escapeHtml(label)}</span></label>`).join('');
    view.innerHTML = `<div class="dashboard-shell"><header class="dashboard-header"><div><h1>Work dashboard</h1><small>Live operational view · updated ${dashboardTime(data.generated_at)}</small></div><button id="closeDashboard" class="button secondary" type="button">← Back to map</button></header><section class="dashboard-card dashboard-work-status"><div class="dashboard-card-head"><div><h2>Status of work</h2><p>Select a status to open its building-block GIS attribute table.</p></div></div><div class="dashboard-kpis">${kpis.map(([label,value,kind,filter]) => `<button class="dashboard-kpi kpi-${kind}" type="button" data-dashboard-status="${filter}"><span>${escapeHtml(label)}</span><b>${value}</b><small>${label === 'Surveyed' ? `${data.total ? Math.round((value / data.total) * 100) : 0}% of mapped households` : 'Open attribute table'}</small></button>`).join('')}</div></section><section class="dashboard-mobile-actions"><button id="dashboardMobileMap" class="button primary" type="button">Open coverage map</button></section><section class="dashboard-grid dashboard-detail"><article class="dashboard-card"><div class="dashboard-card-head"><div><h2>Team activity</h2><p><b>${data.team_activity.field_today}</b> field updates today · <b>${data.team_activity.office_today}</b> office updates today</p></div></div><div class="dashboard-table-wrap"><table class="dashboard-table"><thead><tr><th>User</th><th>Today</th><th>Last sync</th></tr></thead><tbody>${people}</tbody></table></div></article><article class="dashboard-card"><div class="dashboard-card-head"><div><h2>Data quality flags</h2><p>Select a flag to zoom to its building block(s) for verification.</p></div></div><div class="quality-grid">${quality.map(([key,label,count,copy]) => `<button type="button" data-dashboard-quality="${key}"><b>${count}</b><span>${escapeHtml(label)}</span><small>${escapeHtml(copy)}</small></button>`).join('')}</div></article><article class="dashboard-card dashboard-wide"><div class="dashboard-card-head"><div><h2>Musi Phase sub-zone coverage</h2><p>These corridor segments are separate from GHMC municipal zones. Select one to zoom the survey map.</p></div><label>Musi Phase sub-zone<select id="dashboardZoneSelect"><option value="All zones">All Musi Phase sub-zones</option>${musiPhaseZones.map(zone => `<option value="${escapeHtml(zone.zone)}">${escapeHtml(zone.zone)}</option>`).join('')}</select></label></div><div class="dashboard-table-wrap"><table class="dashboard-table zone-table"><thead><tr><th>Musi Phase sub-zone</th><th>Total</th><th>Done</th><th>Pending</th><th>Verified</th></tr></thead><tbody>${zoneRows}</tbody></table></div></article><article class="dashboard-card dashboard-wide"><div class="dashboard-card-head"><div><h2>GHMC municipal zone coverage</h2><p>Municipal zones are calculated from the supplied GHMC boundary layer and are separate from Musi Phase segments.</p></div></div><div class="dashboard-table-wrap"><table class="dashboard-table zone-table"><thead><tr><th>GHMC zone</th><th>Total</th><th>Done</th><th>Pending</th><th>Verified</th></tr></thead><tbody>${ghmcRows}</tbody></table></div></article><article class="dashboard-card dashboard-wide"><div class="dashboard-card-head"><div><h2>Question analysis</h2><p>Select multiple questions, review their charts together, and download either the charts or their Excel data.</p></div></div><details class="dashboard-question-picker"><summary>Select questions and attributes</summary><div class="dashboard-question-actions"><button id="selectAllDashboardQuestions" class="text-button" type="button">Select all</button><button id="clearDashboardQuestions" class="text-button" type="button">Clear</button></div><div id="dashboardQuestionList" class="dashboard-question-list">${questionList}</div></details><div class="dashboard-analysis-controls"><label>Chart type<select id="dashboardChartType"><option value="pie">Pie chart</option><option value="bar">Bar chart</option><option value="compare">Baseline vs current</option></select></label><div class="dashboard-analysis-buttons"><button id="applyDashboardQuestions" class="button primary" type="button">Create charts</button><button id="downloadDashboardCharts" class="button secondary" type="button">Download charts</button><button id="downloadDashboardWorkbook" class="button secondary" type="button">Download Excel data</button></div></div><div id="dashboardQuestionResult" class="dashboard-question-result"></div></article></section></div>`;
    $('#closeDashboard').addEventListener('click', closeDashboard); $('#dashboardMobileMap').addEventListener('click', () => zoomDashboardZone('All zones')); $('#dashboardZoneSelect').addEventListener('change', event => zoomDashboardZone(event.target.value)); view.querySelectorAll('[data-dashboard-zone]').forEach(button => button.addEventListener('click', () => zoomDashboardZone(button.dataset.dashboardZone))); view.querySelectorAll('[data-dashboard-status]').forEach(button => button.addEventListener('click', () => openDashboardStatusTable(button.dataset.dashboardStatus))); view.querySelectorAll('[data-dashboard-quality]').forEach(button => button.addEventListener('click', () => focusDashboardQuality(button.dataset.dashboardQuality))); $('#selectAllDashboardQuestions').addEventListener('click', () => { view.querySelectorAll('[data-dashboard-question]').forEach(input => { input.checked = true; }); }); $('#clearDashboardQuestions').addEventListener('click', () => { view.querySelectorAll('[data-dashboard-question]').forEach(input => { input.checked = false; }); }); $('#applyDashboardQuestions').addEventListener('click', renderDashboardQuestionCharts); $('#dashboardChartType').addEventListener('change', renderDashboardQuestionCharts); $('#downloadDashboardCharts').addEventListener('click', () => downloadDashboardCharts().catch(error => alert(errorMessage(error)))); $('#downloadDashboardWorkbook').addEventListener('click', downloadDashboardAnalysisWorkbook); await renderDashboardQuestionCharts();
  } catch (error) { view.innerHTML = `<div class="dashboard-loading"><p>${escapeHtml(errorMessage(error))}</p><button id="closeDashboard" class="button secondary" type="button">Back to map</button></div>`; $('#closeDashboard').addEventListener('click', closeDashboard); }
}
async function renderTeamManagement(content) {
  content.innerHTML = '<p class="tool-copy">Loading team management…</p>'; const data = await api('/api/team-management');
  const teams = data.teams; const selected = teams.find(team => String(team.id) === String(state.selectedTeamId)) || teams[0] || null; state.selectedTeamId = selected?.id || null;
  const households = data.households.map(item => ({ ...item, label:item.NameOwnRep || item.BuildingID || item.id, meta:`${item.id} · ${item.assigned_user || 'Team allocation'} · ${item.survey_status || 'Not started'}` }));
  const members = selected ? data.users.filter(member => member.team_id === selected.id) : [];
  const assigned = selected ? households.filter(item => item.assigned_team === selected.name).slice(0, 100) : [];
  const assignmentOptions = `<option value="Keep current team">Keep current team</option><option value="Unassigned">Unassigned</option>${teams.map(team => `<option value="${escapeHtml(team.name)}">${escapeHtml(team.name)}</option>`).join('')}`;
  const memberOptions = `<option value="">No individual user</option>${data.users.filter(member => member.role === 'editor').map(member => `<option value="${member.id}">${escapeHtml(member.display_name)} · ${escapeHtml(member.username)}</option>`).join('')}`;
  const teamTabs = teams.map(team => `<button type="button" class="team-tab ${selected?.id === team.id ? 'active':''}" data-select-team="${team.id}">${escapeHtml(team.name)} <b>${data.counts[team.name] || 0}</b></button>`).join('');
  const otherUsers = selected ? data.users.filter(member => member.team_id !== selected.id) : [];
  content.innerHTML = `<div class="team-summary"><span>Unassigned <b>${data.counts.Unassigned || 0}</b></span>${teams.map(team => `<span>${escapeHtml(team.name)} <b>${data.counts[team.name] || 0}</b></span>`).join('')}</div><div class="management-section team-admin"><h3>Create and manage teams</h3><form id="createTeamForm" class="inline-form"><input id="newTeamName" maxlength="60" placeholder="New team name" required><button class="button secondary" type="submit">Create team</button></form><div class="team-list">${teams.map(team => `<div class="team-row"><button type="button" class="team-select-row" data-select-team="${team.id}"><b>${escapeHtml(team.name)}</b><small>${data.counts[team.name] || 0} household(s)</small></button><button class="button secondary" type="button" data-rename-team="${team.id}" data-team-name="${escapeHtml(team.name)}">Rename</button><button class="button danger" type="button" data-remove-team="${team.id}" data-team-name="${escapeHtml(team.name)}">Remove</button></div>`).join('') || '<p class="tool-copy">No field teams created yet.</p>'}</div><p id="teamNotice" class="tool-notice">${escapeHtml(state.teamNotice)}</p></div>${selected ? `<div class="management-section team-detail"><div class="team-tab-list">${teamTabs}</div><h3>${escapeHtml(selected.name)} team members</h3><div class="member-add"><select id="addMemberToTeam"><option value="">Add a user to ${escapeHtml(selected.name)}</option>${otherUsers.map(member => `<option value="${member.id}">${escapeHtml(member.display_name)} · ${escapeHtml(member.role)}${member.team_name ? ` · currently ${escapeHtml(member.team_name)}` : ''}</option>`).join('')}</select><button id="addMemberButton" class="button secondary" type="button">Add user</button></div><div class="team-members">${members.length ? members.map(member => `<div class="member-row"><span><b>${escapeHtml(member.display_name)}</b><small>${escapeHtml(member.username)} · ${escapeHtml(member.role)} · ${member.individually_assigned || 0} individual assignment(s)</small></span><label>Move or remove<select data-member-id="${member.id}" aria-label="Move ${escapeHtml(member.display_name)}"><option value="">No team</option>${teams.map(team => `<option value="${team.id}" ${member.team_id === team.id ? 'selected':''}>${escapeHtml(team.name)}</option>`).join('')}</select></label></div>`).join('') : '<p class="tool-copy">No users are assigned to this team yet.</p>'}</div><h3 class="member-heading">Households allotted to ${escapeHtml(selected.name)}</h3><div class="team-households">${assigned.length ? assigned.map(item => `<div class="team-household"><span><b>${escapeHtml(item.label)}</b><small>${escapeHtml(item.meta)}</small></span><button class="button secondary" type="button" data-unassign-household="${escapeHtml(item.id)}">Remove</button></div>`).join('') : '<p class="tool-copy">No households have been allotted to this team.</p>'}${(data.counts[selected.name] || 0) > assigned.length ? '<p class="tool-copy">Showing the first 100 households.</p>' : ''}</div></div>` : ''}<div class="management-section"><h3>Allocate work by attribute</h3><div class="assignment-target-grid"><label class="compact-label">Team<select id="assignTeam">${assignmentOptions}</select></label><label class="compact-label">Individual user<select id="assignUser">${memberOptions}</select></label></div><label class="compact-label">Attribute<select id="assignmentAttribute"><option value="Zone_1">Musi Phase sub-zone</option><option value="Zonewise">Musi Phase corridor zone</option><option value="ghmc_zone">GHMC municipal zone</option><option value="BuildingID">Building ID</option><option value="HNoPlotNo">House / plot</option><option value="WardBlockN">Ward / block</option><option value="ColnyStrtN">Colony / street</option><option value="assigned_team">Current team</option><option value="all">All searchable fields</option></select></label><label class="compact-label">Find value<select id="assignmentValue"><option value="">All values</option></select></label><div id="assignmentRows"></div><button id="saveAssignments" class="button primary" type="button">Save allocation</button><p id="assignmentNotice" class="tool-notice"></p></div>`;
  if (!isAdmin()) {
    const adminSection = content.querySelector('.team-admin');
    if (adminSection) adminSection.innerHTML = '<h3>Office work allocation</h3><p class="tool-copy">Office users can review teams and reassign households. Only Admin can create teams or change team membership.</p>';
    content.querySelector('.member-add')?.remove(); content.querySelectorAll('[data-member-id]').forEach(select => select.closest('label')?.remove()); content.querySelectorAll('[data-unassign-household]').forEach(button => button.remove());
  }
  const fieldValue = (item, attribute) => attribute === 'all' ? `${item.id} ${item.label} ${item.meta} ${item.HNoPlotNo || ''} ${item.WardBlockN || ''} ${item.Zone || ''} ${item.ColnyStrtN || ''}` : String(item[attribute] || 'Not recorded');
  const setValueOptions = () => { const attribute = $('#assignmentAttribute').value; const values = [...new Set(households.map(item => fieldValue(item, attribute)))].sort((a,b) => a.localeCompare(b)).slice(0, 250); $('#assignmentValue').innerHTML = `<option value="">All values</option>${values.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('')}`; };
  const renderAssignments = () => { const attribute = $('#assignmentAttribute').value; const value = $('#assignmentValue').value; const matched = households.filter(item => !value || fieldValue(item, attribute) === value).slice(0, 80); $('#assignmentRows').innerHTML = toolRows(matched, { selectable:true }); };
  setValueOptions(); renderAssignments();
  content.querySelectorAll('[data-select-team]').forEach(button => button.addEventListener('click', () => { state.selectedTeamId = Number(button.dataset.selectTeam); renderToolContent('assignments'); }));
  $('#createTeamForm')?.addEventListener('submit', async event => { event.preventDefault(); try { const result = await api('/api/teams', { method:'POST', body:JSON.stringify({ name:$('#newTeamName').value }) }); state.selectedTeamId = result.team.id; state.teamNotice = `${result.team.name} created.`; await renderToolContent('assignments'); } catch (error) { $('#teamNotice').textContent = errorMessage(error); } });
  content.querySelectorAll('[data-rename-team]').forEach(button => button.addEventListener('click', async () => { const next = window.prompt('Team name', button.dataset.teamName); if (!next?.trim()) return; try { await api(`/api/teams/${button.dataset.renameTeam}`, { method:'PUT', body:JSON.stringify({ name:next }) }); state.teamNotice = 'Team renamed.'; await renderToolContent('assignments'); } catch (error) { $('#teamNotice').textContent = errorMessage(error); } }));
  content.querySelectorAll('[data-remove-team]').forEach(button => button.addEventListener('click', async () => { if (!window.confirm(`Remove ${button.dataset.teamName}? Its members and households will be moved to Unassigned.`)) return; try { await api(`/api/teams/${button.dataset.removeTeam}`, { method:'DELETE' }); state.selectedTeamId = null; state.teamNotice = 'Team removed; its users and households are now unassigned.'; await Promise.all([refreshHouseholds(), refreshSidebar()]); await renderToolContent('assignments'); } catch (error) { $('#teamNotice').textContent = errorMessage(error); } }));
  const moveMember = async (userId, teamId) => { await api('/api/teams/members', { method:'PUT', body:JSON.stringify({ user_id:Number(userId), team_id:teamId ? Number(teamId) : null }) }); state.teamNotice = 'Team membership updated.'; await renderToolContent('assignments'); };
  $('#addMemberButton')?.addEventListener('click', async () => { const userId = $('#addMemberToTeam').value; if (!userId) return; try { await moveMember(userId, selected.id); } catch (error) { $('#teamNotice').textContent = errorMessage(error); } });
  content.querySelectorAll('[data-member-id]').forEach(select => select.addEventListener('change', async () => { try { await moveMember(select.dataset.memberId, select.value); } catch (error) { $('#teamNotice').textContent = errorMessage(error); } }));
  content.querySelectorAll('[data-unassign-household]').forEach(button => button.addEventListener('click', async () => { try { await api('/api/assignments', { method:'POST', body:JSON.stringify({ household_ids:[button.dataset.unassignHousehold], team:'Unassigned', user_id:null }) }); state.teamNotice = 'Household removed from the team.'; await Promise.all([refreshHouseholds(), refreshSidebar()]); await renderToolContent('assignments'); } catch (error) { $('#teamNotice').textContent = errorMessage(error); } }));
  $('#assignmentAttribute').addEventListener('change', () => { setValueOptions(); renderAssignments(); }); $('#assignmentValue').addEventListener('change', renderAssignments);
  $('#saveAssignments').addEventListener('click', async () => { const ids = [...content.querySelectorAll('#assignmentRows input:checked')].map(input => input.value); if (!ids.length) { $('#assignmentNotice').textContent = 'Select households first.'; return; } try { const result = await api('/api/assignments', { method:'POST', body:JSON.stringify({ household_ids:ids, team:$('#assignTeam').value, user_id:$('#assignUser').value || null }) }); state.teamNotice = `${result.changed} household(s) allocated.`; await Promise.all([refreshHouseholds(), refreshSidebar()]); await renderToolContent('assignments'); } catch (error) { $('#assignmentNotice').textContent = errorMessage(error); } });
}
async function renderToolContent(tool) {
  const content = $('#toolViewContent'); const register = $('#panelRegister'); register.hidden = tool !== 'register'; content.hidden = tool === 'register';
  if (tool === 'register') return;
  if (tool === 'dashboard') { await renderAnalyticsDashboard(content); return; }
  if (tool === 'assignments') { await renderTeamManagement(content); return; }
  const progress = $('#metrics').innerHTML || '<p class="tool-copy">Loading shared progress…</p>';
  const activity = state.activityMarkup || '<p class="tool-copy">No recent activity.</p>';
  if (tool === 'menu') {
    // Keep the phone navigation compact, while retaining the map controls
    // that administrators need to manage the visible GIS layers.
    const menuItems = isField()
      ? [['register','⌕','Project Register','Find and update assigned households'],['mywork','▤','My Work','Households allotted to me'],['layers','▱','Map Layers','Buildings, river and boundaries'],['library','▣','Data library','Shared Excel, documents and GIS files'],['profile','◉','User Data','My profile and uploaded photos']]
      : [['register','⌕','Project Register','Find and update households'],['layers','▱','Map Layers','Edit basemap, layer names and colours'],['library','▣','Data library','Shared Excel, documents and GIS files'],['dashboard','▥','Dashboard','Progress, quality and analysis'],['assignments','♙', isOffice() ? 'Work Allocation' : 'Team Management', 'Teams, users and household allocation'],['verify','✓','Verify Records','Review, reject or finalise surveys'],['profile','◉','User Data','My profile and uploaded photos']];
    content.innerHTML = `<div class="mobile-tool-menu">${menuItems.map(([id,icon,title,copy]) => `<button type="button" data-menu-tool="${id}"><span>${icon}</span><b>${title}</b><small>${copy}</small><i>›</i></button>`).join('')}</div>`; content.querySelectorAll('[data-menu-tool]').forEach(button => button.addEventListener('click', () => showTool(button.dataset.menuTool)));
  }
  else if (tool === 'library') { await renderDataLibrary(content); }
  else if (tool === 'layers') {
    const libraryData = await api('/api/library-files'); const libraryGis = (libraryData.files || []).filter(file => file.map_supported);
    const layerEditor = (id, checked) => `<div class="layer-editor"><label class="layer-toggle"><input type="checkbox" data-layer="${escapeHtml(id)}" ${checked ? 'checked':''}><span>Visible</span></label><label>Layer name<input data-layer-name="${escapeHtml(id)}" value="${escapeHtml(layerTitle(id))}" maxlength="60"></label><label>Colour<input data-layer-color="${escapeHtml(id)}" type="color" value="${escapeHtml(layerColor(id,'#516b84'))}"></label></div>`;
    const sharedLayers = [...state.customLayers.values()]; const sharedEditor = sharedLayers.length ? `<div class="layer-editor-list">${sharedLayers.map(item => `<div class="layer-editor shared-layer-editor" data-custom-layer-card="${item.id}"><label class="layer-toggle"><input type="checkbox" data-custom-visible="${item.id}" ${state.map.hasLayer(item.layer) ? 'checked':''}><span>Visible</span></label><label>Layer name<input data-custom-name="${item.id}" value="${escapeHtml(item.name)}" maxlength="80"></label><label>Colour<input data-custom-color="${item.id}" type="color" value="${escapeHtml(item.color)}"></label><button class="button secondary" type="button" data-properties-custom-layer="${item.id}">Properties</button><button class="button secondary" type="button" data-edit-custom-layer="${item.id}">Replace shape</button><button class="button danger" type="button" data-remove-custom-layer="${item.id}">Remove layer</button></div>`).join('')}</div>` : '<p class="layer-help">No shared GIS layers have been added yet.</p>';
    const databaseLayers = libraryGis.length ? `<div class="library-file-list layer-library-list">${libraryGis.map(file => sharedFileRow(file, true)).join('')}</div>` : '<p class="layer-help">No GeoJSON files are in the Data library yet.</p>';
    content.innerHTML = `<section class="layer-section"><h3>Esri basemap</h3><div class="layer-list basemap-list"><label><input type="checkbox" data-basemap-visible ${state.basemapVisible ? 'checked':''}> <span>Show basemap</span></label>${Object.entries(BASEMAPS).map(([id, definition]) => `<label><input type="radio" name="basemap" data-basemap="${id}" ${state.basemapId === id ? 'checked':''}> <span>${escapeHtml(definition.label)}</span></label>`).join('')}</div></section><section class="layer-section layer-draw-action"><button id="openDrawingPanel" class="button primary" type="button">Draw GIS layer</button></section><section class="layer-section"><h3>Supplied map layers and legend</h3><div class="layer-editor-list">${layerEditor('buildings', state.baseLayer && state.map.hasLayer(state.baseLayer))}${layerEditor('bifurcated', state.bifurcatedLayer && state.map.hasLayer(state.bifurcatedLayer))}${[...state.overlays.entries()].map(([id, layer]) => layerEditor(id, state.map.hasLayer(layer))).join('')}</div><p class="layer-help">Names and colours update the map and legend immediately on this device.</p></section><section class="layer-section"><h3>GIS files from Data library</h3><p class="layer-help">Add a GeoJSON file to shared map layers, or remove the map layer while keeping the original file in the library.</p>${databaseLayers}<button class="text-button layer-library-open" type="button" data-open-library>Open Data library</button></section><section class="layer-section"><h3>Shared GIS layers</h3><p class="layer-help">Right-click a layer on the map for zoom, properties, attributes, and export. Right-click a card below to open its properties.</p>${sharedEditor}</section>`;
  }
  else if (tool === 'progress') content.innerHTML = `<div class="tool-metrics">${progress}</div><p class="tool-copy">Survey progress includes verified households. Use the Verify & finalise tool to approve completed records.</p>`;
  else if (tool === 'activity') content.innerHTML = `<div class="tool-activity">${activity}</div>`;
  else if (tool === 'assignments') {
    content.innerHTML = '<p class="tool-copy">Loading team management…</p>'; const data = await api('/api/team-management');
    const households = data.households.map(item => ({ ...item, id:item.id, label:item.NameOwnRep || item.BuildingID || item.id, meta:`${item.id} · ${item.assigned_team || 'Unassigned'}${item.assigned_user ? ` · ${item.assigned_user}` : ''} · ${item.survey_status || 'Not started'}` }));
    const assignmentOptions = `<option value="Keep current team">Keep current team</option><option value="Unassigned">Unassigned</option>${data.teams.map(team => `<option value="${escapeHtml(team.name)}">${escapeHtml(team.name)}</option>`).join('')}`; const memberOptions = `<option value="">No individual user</option>${data.users.filter(member => member.role === 'editor').map(member => `<option value="${member.id}">${escapeHtml(member.display_name)} · ${escapeHtml(member.username)}</option>`).join('')}`;
    content.innerHTML = `<div class="team-summary"><span>Unassigned <b>${data.counts.Unassigned || 0}</b></span>${data.teams.map(team => `<span>${escapeHtml(team.name)} <b>${data.counts[team.name] || 0}</b></span>`).join('')}</div><div class="management-section team-admin"><h3>Create and manage teams</h3><form id="createTeamForm" class="inline-form"><input id="newTeamName" maxlength="60" placeholder="New team name" required><button class="button secondary" type="submit">Create team</button></form><div class="team-list">${data.teams.map(team => `<div class="team-row"><span><b>${escapeHtml(team.name)}</b><small>${data.counts[team.name] || 0} household(s)</small></span><button class="button secondary" type="button" data-rename-team="${team.id}" data-team-name="${escapeHtml(team.name)}">Rename</button><button class="button danger" type="button" data-remove-team="${team.id}" data-team-name="${escapeHtml(team.name)}">Remove</button></div>`).join('') || '<p class="tool-copy">No field teams created yet.</p>'}</div><p id="teamNotice" class="tool-notice"></p><h3 class="member-heading">Team membership</h3><div class="team-members">${data.users.map(member => `<div class="member-row"><span><b>${escapeHtml(member.display_name)}</b><small>${escapeHtml(member.username)} · ${escapeHtml(member.role)} · ${member.individually_assigned || 0} individual assignment(s)</small></span><select data-member-id="${member.id}" aria-label="Team for ${escapeHtml(member.display_name)}"><option value="">No team</option>${data.teams.map(team => `<option value="${team.id}" ${member.team_id === team.id ? 'selected':''}>${escapeHtml(team.name)}</option>`).join('')}</select></div>`).join('')}</div></div><div class="management-section"><h3>Allocate work by attribute</h3><div class="assignment-target-grid"><label class="compact-label">Team<select id="assignTeam">${assignmentOptions}</select></label><label class="compact-label">Individual user<select id="assignUser">${memberOptions}</select></label></div><label class="compact-label">Attribute<select id="assignmentAttribute"><option value="all">All attributes</option><option value="BuildingID">Building ID</option><option value="HNoPlotNo">House / plot</option><option value="WardBlockN">Ward / block</option><option value="Zone">Zone</option><option value="ColnyStrtN">Colony / street</option><option value="assigned_team">Current team</option></select></label><label class="compact-label">Find value<input id="assignmentSearch" placeholder="Search the selected attribute"></label><div id="assignmentRows"></div><button id="saveAssignments" class="button primary" type="button">Save allocation</button><p id="assignmentNotice" class="tool-notice"></p></div>`;
    const renderAssignments = query => { const q = query.trim().toLowerCase(); const attribute = $('#assignmentAttribute').value; const matched = households.filter(item => !q || String(attribute === 'all' ? `${item.id} ${item.label} ${item.meta} ${item.HNoPlotNo || ''} ${item.WardBlockN || ''} ${item.Zone || ''} ${item.ColnyStrtN || ''}` : item[attribute] || '').toLowerCase().includes(q)).slice(0, 80); $('#assignmentRows').innerHTML = toolRows(matched, { selectable:true }); }; renderAssignments('');
    $('#createTeamForm').addEventListener('submit', async event => { event.preventDefault(); try { const result = await api('/api/teams', { method:'POST', body:JSON.stringify({ name:$('#newTeamName').value }) }); $('#teamNotice').textContent = `${result.team.name} created.`; await renderToolContent('assignments'); } catch (error) { $('#teamNotice').textContent = errorMessage(error); } });
    content.querySelectorAll('[data-rename-team]').forEach(button => button.addEventListener('click', async () => { const next = window.prompt('Team name', button.dataset.teamName); if (!next?.trim()) return; try { await api(`/api/teams/${button.dataset.renameTeam}`, { method:'PUT', body:JSON.stringify({ name:next }) }); await renderToolContent('assignments'); } catch (error) { $('#teamNotice').textContent = errorMessage(error); } }));
    content.querySelectorAll('[data-remove-team]').forEach(button => button.addEventListener('click', async () => { if (!window.confirm(`Remove ${button.dataset.teamName}? Its members and households will be moved to Unassigned.`)) return; try { await api(`/api/teams/${button.dataset.removeTeam}`, { method:'DELETE' }); await Promise.all([refreshHouseholds(), refreshSidebar()]); await renderToolContent('assignments'); } catch (error) { $('#teamNotice').textContent = errorMessage(error); } }));
    content.querySelectorAll('[data-member-id]').forEach(select => select.addEventListener('change', async () => { select.disabled = true; try { await api('/api/teams/members', { method:'PUT', body:JSON.stringify({ user_id:Number(select.dataset.memberId), team_id:select.value ? Number(select.value) : null }) }); await renderToolContent('assignments'); } catch (error) { $('#teamNotice').textContent = errorMessage(error); select.disabled = false; } }));
    $('#assignmentSearch').addEventListener('input', event => renderAssignments(event.target.value)); $('#assignmentAttribute').addEventListener('change', () => renderAssignments($('#assignmentSearch').value)); $('#saveAssignments').addEventListener('click', async () => { const ids = [...content.querySelectorAll('#assignmentRows input:checked')].map(input => input.value); if (!ids.length) { $('#assignmentNotice').textContent = 'Select households first.'; return; } try { const result = await api('/api/assignments', { method:'POST', body:JSON.stringify({ household_ids:ids, team:$('#assignTeam').value, user_id:$('#assignUser').value || null }) }); $('#assignmentNotice').textContent = `${result.changed} household(s) allocated.`; await Promise.all([refreshHouseholds(), refreshSidebar()]); await renderToolContent('assignments'); } catch (error) { $('#assignmentNotice').textContent = errorMessage(error); } });
  }
  else if (tool === 'verify') {
    content.innerHTML = '<p class="tool-copy">Loading records ready for verification…</p>'; const data = await api('/api/verification'); const items = data.items.map(item => ({ ...item, meta:`${item.id} · ${item.team} · ${item.verification}`, badge:item.status }));
    content.innerHTML = `<div id="verifyRows">${toolRows(items, { selectable:true })}</div><button id="finaliseVerification" class="button primary" type="button">Verify & finalise selected</button><p id="verifyNotice" class="tool-notice"></p>`;
    $('#finaliseVerification').addEventListener('click', async () => { const ids = [...content.querySelectorAll('#verifyRows input:checked')].map(input => input.value); if (!ids.length) { $('#verifyNotice').textContent = 'Select completed records first.'; return; } try { const result = await api('/api/verification/finalise', { method:'POST', body:JSON.stringify({ household_ids:ids }) }); $('#verifyNotice').textContent = `${result.changed} household(s) verified.`; await Promise.all([refreshHouseholds(), refreshSidebar()]); await renderToolContent('verify'); } catch (error) { $('#verifyNotice').textContent = errorMessage(error); } });
  }
  else if (tool === 'mywork') {
    content.innerHTML = '<p class="tool-copy">Loading your assigned work…</p>'; const data = await api('/api/my-work'); const items = data.items.map(item => ({ ...item, meta:`${item.id} · ${item.plot} · ${item.status}` })); content.innerHTML = `<div id="myWorkRows">${toolRows(items)}</div>`; content.querySelectorAll('.management-row').forEach((row, index) => row.addEventListener('click', () => openHousehold(data.items[index].id, true)));
  }
  else if (tool === 'users') {
    content.innerHTML = '<p class="tool-copy">Loading portal users…</p>'; const data = await api('/api/users');
    const rows = data.users.map(user => {
      const deleted = Boolean(user.deleted_at); const current = String(user.username) === String(state.user?.username);
      const stateLabel = deleted ? `Deleted ${new Date(user.deleted_at).toLocaleDateString()}` : 'Active';
      const deleteButton = !deleted && !current ? `<button class="button danger" type="button" data-delete-user="${user.id}" data-user-name="${escapeHtml(user.display_name)}" data-user-id="${escapeHtml(user.username)}">Delete user</button>` : current ? '<span class="user-management-current">Current account</span>' : '<span class="user-management-deleted">Access deleted</span>';
      return `<div class="user-management-row ${deleted ? 'is-deleted':''}"><span><b>${escapeHtml(user.display_name)}</b><small>${escapeHtml(user.username)} · ${escapeHtml(roleLabel(user.role))}${user.team_name ? ` · ${escapeHtml(user.team_name)}` : ''}</small><em>${escapeHtml(stateLabel)}</em></span>${deleteButton}</div>`;
    }).join('') || '<p class="tool-copy">No portal users are available.</p>';
    content.innerHTML = `<div class="management-section"><h3>Portal users</h3><p class="tool-copy">Deleting a user removes their sign-in access immediately. Their household edits, assignments, and audit history are retained.</p><div class="user-management-list">${rows}</div><p id="userManagementNotice" class="tool-notice"></p><button id="createUserFromPanel" class="button secondary" type="button">Create user</button></div>`;
    $('#createUserFromPanel').addEventListener('click', openUserDialog);
    content.querySelectorAll('[data-delete-user]').forEach(button => button.addEventListener('click', async () => {
      const name = button.dataset.userName || button.dataset.userId;
      if (!window.confirm(`Delete ${name}'s portal access? Their survey data and audit history will be kept.`)) return;
      try { await api(`/api/users/${button.dataset.deleteUser}`, { method:'DELETE' }); await renderToolContent('users'); }
      catch (error) { const notice = $('#userManagementNotice'); if (notice) notice.textContent = errorMessage(error); else alert(errorMessage(error)); }
    }));
  }
  else if (tool === 'profile') {
    const data = await api('/api/profile'); const user = data.user; const photos = await api('/api/photos'); const label = user.role === 'admin' ? 'All uploaded field photos' : 'My uploaded field photos'; drawPhotoMarkers(photos.photos);
    const adminRecords = user.role === 'admin' ? `<section class="profile-photo-section"><h3>Administrator records</h3><p class="tool-copy">Review the complete audit trail or display every uploaded field-photo location on the map.</p><div class="photo-actions"><button id="showAuditLog" class="button secondary" type="button">View audit log</button><button id="showAdminPhotoMap" class="button secondary" type="button">Show all photo locations</button></div><div id="adminAuditLog" hidden></div></section>` : '';
    content.innerHTML = `<form id="profileForm" class="profile-form"><label>Full name<input name="display_name" value="${escapeHtml(user.display_name)}" required></label><label>User ID<input value="${escapeHtml(user.username)}" disabled></label><label>Role<input value="${escapeHtml(roleLabel(user.role))}" disabled></label><label>New password <small>(optional)</small><input name="password" type="password" minlength="10" placeholder="Leave blank to keep current password"></label><button class="button primary" type="submit">Save profile</button><p id="profileNotice" class="tool-notice"></p></form>${adminRecords}<section class="profile-photo-section"><h3>${label}</h3>${photos.photos.length ? photos.photos.map(photo => photoCard(photo, user.role === 'admin')).join('') : '<p class="tool-copy">No uploaded field photos.</p>'}</section>`;
    $('#profileForm').addEventListener('submit', async event => { event.preventDefault(); try { const saved = await api('/api/profile', { method:'PUT', body:JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) }); state.user = saved.user; $('#userBadge').textContent = `${saved.user.display_name} · ${roleLabel(saved.user.role)}`; $('#profileNotice').textContent = 'Profile saved.'; } catch (error) { $('#profileNotice').textContent = errorMessage(error); } });
    $('#showAuditLog')?.addEventListener('click', async () => { const holder = $('#adminAuditLog'); holder.hidden = false; holder.innerHTML = '<p class="tool-copy">Loading audit log…</p>'; try { const result = await api('/api/audit-log'); holder.innerHTML = `<div class="review-history">${result.items.map(item => `<article><b>${escapeHtml(item.username)}</b><span>${escapeHtml(item.action)}</span><p>${escapeHtml(item.household_id || item.detail || '')}</p><small>${new Date(item.at).toLocaleString()}</small></article>`).join('') || '<p>No audit entries are available.</p>'}</div>`; } catch (error) { holder.innerHTML = `<p class="tool-copy">${escapeHtml(errorMessage(error))}</p>`; } });
    $('#showAdminPhotoMap')?.addEventListener('click', () => { const photoLayers = state.photoLayer?.getLayers?.() || []; const bounds = L.featureGroup(photoLayers).getBounds(); closeTools(); if (bounds.isValid()) state.map.fitBounds(bounds, { padding:[34,34], maxZoom:18 }); });
    if (user.role === 'admin') content.querySelectorAll('[data-delete-photo]').forEach(button => button.addEventListener('click', async () => { try { await api(`/api/photos/${button.dataset.deletePhoto}`, { method:'DELETE' }); await renderToolContent('profile'); } catch (error) { $('#profileNotice').textContent = errorMessage(error); } }));
  }
  content.querySelectorAll('[data-layer]').forEach(input => input.addEventListener('change', () => { const id = input.dataset.layer; const layer = id === 'buildings' ? state.baseLayer : id === 'bifurcated' ? state.bifurcatedLayer : state.overlays.get(id); if (!layer) return; if (input.checked) layer.addTo(state.map); else state.map.removeLayer(layer); renderMapLegend(); }));
  content.querySelectorAll('[data-layer-name]').forEach(input => input.addEventListener('change', () => { const id = input.dataset.layerName; state.layerPrefs[id] = { ...layerPreference(id), name:input.value.trim() || DEFAULT_LAYER_PREFS[id]?.name || titleCase(id) }; saveLayerPreferences(); }));
  content.querySelectorAll('[data-layer-color]').forEach(input => input.addEventListener('input', () => { const id = input.dataset.layerColor; state.layerPrefs[id] = { ...layerPreference(id), color:input.value }; saveLayerPreferences(); }));
  content.querySelector('[data-basemap-visible]')?.addEventListener('change', event => setBasemap(state.basemapId, event.currentTarget.checked));
  content.querySelectorAll('[data-basemap]').forEach(input => input.addEventListener('change', () => setBasemap(input.dataset.basemap, true)));
  content.querySelectorAll('[data-open-library]').forEach(button => button.addEventListener('click', () => showTool('library')));
  content.querySelector('#openDrawingPanel')?.addEventListener('click', () => openDrawingPanel());
  content.querySelectorAll('[data-properties-custom-layer]').forEach(button => button.addEventListener('click', () => {
    const layer = state.customLayers.get(Number(button.dataset.propertiesCustomLayer)); if (layer) openLayerProperties(layer);
  }));
  content.querySelectorAll('[data-edit-custom-layer]').forEach(button => button.addEventListener('click', () => {
    const layer = state.customLayers.get(Number(button.dataset.editCustomLayer)); if (layer) openDrawingPanel(layer);
  }));
  content.querySelectorAll('[data-custom-layer-card]').forEach(card => card.addEventListener('contextmenu', event => {
    if (event.target.closest('input,button,label')) return; event.preventDefault(); const layer = state.customLayers.get(Number(card.dataset.customLayerCard)); if (layer) openLayerProperties(layer);
  }));
  content.querySelectorAll('[data-library-share]').forEach(button => button.addEventListener('click', async () => {
    const url = new URL(button.dataset.libraryShare, location.origin).href; const previous = button.textContent;
    try { await navigator.clipboard.writeText(url); button.textContent = 'Link copied'; setTimeout(() => { button.textContent = previous; }, 1800); }
    catch { window.prompt(`Copy the secure shared link for ${button.dataset.libraryShareName || 'this file'}:`, url); }
  }));
  content.querySelectorAll('[data-library-add-map]').forEach(button => button.addEventListener('click', async () => {
    const previous = button.textContent; button.disabled = true; button.textContent = 'Adding…';
    try { await api(`/api/library-files/${button.dataset.libraryAddMap}/map-layer`, { method:'POST', body:JSON.stringify({ color:'#005ea8' }) }); await loadCustomMapLayers(); await renderToolContent(state.activeTool); }
    catch (error) { alert(errorMessage(error)); button.disabled = false; button.textContent = previous; }
  }));
  content.querySelectorAll('[data-library-remove-map]').forEach(button => button.addEventListener('click', async () => {
    if (!window.confirm('Remove this file from shared map layers? The original file stays in Data library.')) return;
    try { await api(`/api/custom-map-layers/${button.dataset.libraryRemoveMap}`, { method:'DELETE' }); await loadCustomMapLayers(); await renderToolContent(state.activeTool); }
    catch (error) { alert(errorMessage(error)); }
  }));
  content.querySelectorAll('[data-library-delete]').forEach(button => button.addEventListener('click', async () => {
    const name = button.dataset.libraryName || 'this shared file'; if (!window.confirm(`Delete ${name} from the shared Data library? This cannot be undone.`)) return;
    try { await api(`/api/library-files/${button.dataset.libraryDelete}`, { method:'DELETE' }); await loadCustomMapLayers(); await renderToolContent('library'); }
    catch (error) { alert(errorMessage(error)); }
  }));
  content.querySelector('#customLayerForm')?.addEventListener('submit', async event => { event.preventDefault(); const file = $('#customLayerFile').files?.[0]; const notice = $('#customLayerNotice'); if (!file) { notice.textContent = 'Choose a GeoJSON file.'; return; } if (file.size > 10_000_000) { notice.textContent = 'The shared layer must be smaller than 10 MB.'; return; } const button = event.submitter; button.disabled = true; button.textContent = 'Adding…'; try { const geojson = JSON.parse(await file.text()); await api('/api/custom-map-layers', { method:'POST', body:JSON.stringify({ name:$('#customLayerName').value, color:$('#customLayerColor').value, geojson }) }); await loadCustomMapLayers(); await renderToolContent('layers'); } catch (error) { notice.textContent = error instanceof SyntaxError ? 'The selected file is not valid GeoJSON.' : errorMessage(error); } finally { button.disabled = false; button.textContent = 'Add GIS layer'; } });
  content.querySelectorAll('[data-custom-visible]').forEach(input => input.addEventListener('change', async () => { try { await api(`/api/custom-map-layers/${input.dataset.customVisible}`, { method:'PUT', body:JSON.stringify({ visible:input.checked }) }); await loadCustomMapLayers(); await renderToolContent('layers'); } catch (error) { alert(errorMessage(error)); } }));
  content.querySelectorAll('[data-custom-name]').forEach(input => input.addEventListener('change', async () => { try { await api(`/api/custom-map-layers/${input.dataset.customName}`, { method:'PUT', body:JSON.stringify({ name:input.value }) }); await loadCustomMapLayers(); await renderToolContent('layers'); } catch (error) { alert(errorMessage(error)); } }));
  content.querySelectorAll('[data-custom-color]').forEach(input => input.addEventListener('change', async () => { try { await api(`/api/custom-map-layers/${input.dataset.customColor}`, { method:'PUT', body:JSON.stringify({ color:input.value }) }); await loadCustomMapLayers(); await renderToolContent('layers'); } catch (error) { alert(errorMessage(error)); } }));
  content.querySelectorAll('[data-remove-custom-layer]').forEach(button => button.addEventListener('click', async () => { if (!window.confirm('Remove this shared GIS layer for every portal user?')) return; try { await api(`/api/custom-map-layers/${button.dataset.removeCustomLayer}`, { method:'DELETE' }); await loadCustomMapLayers(); await renderToolContent('layers'); } catch (error) { alert(errorMessage(error)); } }));
}
async function showTool(tool) {
  if (tool === 'dashboard') { await openDashboard(); state.activeTool = 'dashboard'; rememberPortalLocation(); return; }
  if (tool === 'exports') { if (['admin', 'authority'].includes(state.user.role)) { closeTools(); $('#exportButton').click(); } return; }
  const title = ({ menu:'Portal tools', dashboard:'Dashboard', register:'Project Register', layers:'Map layers', library:'Data library', progress:'Survey progress', activity:'Recent activity', assignments:isOffice() ? 'Work allocation' : 'Team management', verify:'Verify records', mywork:'My work', users:'User management', profile:'User data' })[tool] || 'MRDCL tools';
  state.activeTool = tool; $('#toolPanelTitle').textContent = title; $('#toolPanelEyebrow').hidden = true; $('#toolPanelHead').hidden = false; $('#backToToolMenu').hidden = tool === 'menu'; $('#toolViewContent').innerHTML = '<p class="tool-copy">Loading…</p>'; await renderToolContent(tool); $('#appView').classList.add('tool-panel-open'); $('#toolPanel').setAttribute('aria-hidden', 'false'); $('#openTools').setAttribute('aria-expanded', 'true'); document.querySelectorAll('.rail-button[data-tool]').forEach(button => button.classList.toggle('active', button.dataset.tool === tool));
  if (isDrawerLayout()) { setPhonePanel('tool'); $('#toolBackdrop').hidden = false; }
  rememberPortalLocation();
}
function setActiveNav(view) { document.querySelectorAll('.drawer-nav-item[data-view]').forEach(button => button.classList.toggle('active', button.dataset.view === view)); }
function updateFilterChips() { document.querySelectorAll('#statusChips [data-status]').forEach(button => button.classList.toggle('active', button.dataset.status === state.filters.status)); document.querySelectorAll('#teamChips [data-team]').forEach(button => button.classList.toggle('active', button.dataset.team === state.filters.team)); }
function overlayStyle(id) {
  return {
    river: { color: layerColor('river','#187bb5'), weight: 1.2, fillColor: layerColor('river','#187bb5'), fillOpacity: .2 },
    musi_buffer: { color: layerColor('musi_buffer','#8b3cb8'), weight: 1.6, fillColor: layerColor('musi_buffer','#8b3cb8'), fillOpacity: .18 },
    zones: { color: layerColor('zones','#173f63'), weight: 2.2, fill: false },
    circles: { color: layerColor('circles','#087f8c'), weight: 1.45, fill: false },
    wards: { color: layerColor('wards','#7655a6'), weight: .8, fill: false }
  }[id] || { color: '#516b84', weight: 1, fill: false };
}
function overlayLabel(properties) { return properties.NAME || properties.Zone_Name || properties.Circle_Nam || properties.Descr_1 || properties.Descr_2 || 'Map feature'; }
const MAP_MEASUREMENT_FIELDS = {
  q_total_landholding_acres: { kind:'area', unitKey:'q_total_landholding_unit', defaultUnit:'acres', source:'Mapped household boundary' },
  q_main_structure_river_distance: { kind:'distance', unitKey:'q_main_structure_river_distance_unit', defaultUnit:'m', source:'Nearest mapped river-bed boundary' },
  q_total_structure_area_sqm: { kind:'area', unitKey:'q_total_structure_area_unit', defaultUnit:'sqm', source:'Mapped structure footprint' }
};
const MAP_MEASUREMENT_UNITS = {
  area: [
    ['sqm', 'm²', 1], ['sqkm', 'km²', 0.000001], ['acres', 'Acres', 0.000247105381],
    ['hectares', 'Hectares', 0.0001], ['sqft', 'ft²', 10.7639104167], ['sqyd', 'yd²', 1.1959900463]
  ],
  distance: [
    ['m', 'Metres (m)', 1], ['km', 'Kilometres (km)', 0.001], ['ft', 'Feet (ft)', 3.280839895], ['yd', 'Yards (yd)', 1.093613298], ['mi', 'Miles (mi)', 0.000621371192]
  ]
};
const EARTH_RADIUS_METRES = 6371008.8;
function validCoordinate(point) { return Array.isArray(point) && Number.isFinite(Number(point[0])) && Number.isFinite(Number(point[1])); }
function sameCoordinate(a, b) { return validCoordinate(a) && validCoordinate(b) && Number(a[0]) === Number(b[0]) && Number(a[1]) === Number(b[1]); }
function radians(value) { return Number(value) * Math.PI / 180; }
function sphericalRingAreaSqm(ring) {
  const points = (ring || []).filter(validCoordinate); const clean = points.length > 1 && sameCoordinate(points[0], points.at(-1)) ? points.slice(0, -1) : points;
  if (clean.length < 3) return 0;
  let sum = 0;
  clean.forEach((point, index) => {
    const next = clean[(index + 1) % clean.length];
    sum += (radians(next[0]) - radians(point[0])) * (2 + Math.sin(radians(point[1])) + Math.sin(radians(next[1])));
  });
  return Math.abs(sum * EARTH_RADIUS_METRES * EARTH_RADIUS_METRES / 2);
}
function polygonAreaSqm(geometry) {
  const polygons = geometry?.type === 'Polygon' ? [geometry.coordinates] : geometry?.type === 'MultiPolygon' ? geometry.coordinates : [];
  return polygons.reduce((total, polygon) => total + (polygon || []).reduce((area, ring, index) => area + (index ? -sphericalRingAreaSqm(ring) : sphericalRingAreaSqm(ring)), 0), 0);
}
function coordinatePaths(geometry) {
  const paths = []; const addPath = (coordinates, closed = false) => {
    const points = (coordinates || []).filter(validCoordinate); if (!points.length) return;
    paths.push({ points, closed });
  };
  const visit = item => {
    if (!item) return;
    if (item.type === 'Point') addPath([item.coordinates]);
    else if (item.type === 'MultiPoint') (item.coordinates || []).forEach(point => addPath([point]));
    else if (item.type === 'LineString') addPath(item.coordinates);
    else if (item.type === 'MultiLineString') (item.coordinates || []).forEach(line => addPath(line));
    else if (item.type === 'Polygon') (item.coordinates || []).forEach(ring => addPath(ring, true));
    else if (item.type === 'MultiPolygon') (item.coordinates || []).forEach(polygon => polygon.forEach(ring => addPath(ring, true)));
    else if (item.type === 'GeometryCollection') (item.geometries || []).forEach(visit);
  };
  visit(geometry); return paths;
}
function projectedPoint(point, latitude) { return [radians(point[0]) * EARTH_RADIUS_METRES * Math.cos(radians(latitude)), radians(point[1]) * EARTH_RADIUS_METRES]; }
function pointSegmentDistance(point, start, end) {
  const dx = end[0] - start[0]; const dy = end[1] - start[1]; const lengthSquared = dx * dx + dy * dy;
  if (!lengthSquared) return Math.hypot(point[0] - start[0], point[1] - start[1]);
  const t = Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / lengthSquared));
  return Math.hypot(point[0] - (start[0] + t * dx), point[1] - (start[1] + t * dy));
}
function crossProduct(a, b, c) { return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]); }
function pointOnSegment(point, start, end) { return Math.abs(crossProduct(start, end, point)) < .000001 && point[0] >= Math.min(start[0], end[0]) && point[0] <= Math.max(start[0], end[0]) && point[1] >= Math.min(start[1], end[1]) && point[1] <= Math.max(start[1], end[1]); }
function segmentsIntersect(a, b, c, d) {
  const one = crossProduct(a, b, c); const two = crossProduct(a, b, d); const three = crossProduct(c, d, a); const four = crossProduct(c, d, b);
  return (one > 0 && two < 0 || one < 0 && two > 0) && (three > 0 && four < 0 || three < 0 && four > 0) || pointOnSegment(c, a, b) || pointOnSegment(d, a, b) || pointOnSegment(a, c, d) || pointOnSegment(b, c, d);
}
function geometryDistanceMetres(firstGeometry, secondGeometry) {
  const first = coordinatePaths(firstGeometry); const second = coordinatePaths(secondGeometry); const rawPoints = [...first.flatMap(path => path.points), ...second.flatMap(path => path.points)];
  if (!rawPoints.length) return null;
  const latitude = rawPoints.reduce((sum, point) => sum + Number(point[1]), 0) / rawPoints.length;
  const parts = paths => paths.map(path => ({ points:path.points.map(point => projectedPoint(point, latitude)), closed:path.closed }));
  const firstParts = parts(first); const secondParts = parts(second);
  const segments = part => part.points.length < 2 ? [] : part.points.slice(0, -1).map((point, index) => [point, part.points[index + 1]]).concat(part.closed && !sameCoordinate(part.points[0], part.points.at(-1)) ? [[part.points.at(-1), part.points[0]]] : []);
  const firstSegments = firstParts.flatMap(segments); const secondSegments = secondParts.flatMap(segments);
  let minimum = Infinity;
  if (firstSegments.length && secondSegments.length) firstSegments.forEach(([a, b]) => secondSegments.forEach(([c, d]) => {
    if (segmentsIntersect(a, b, c, d)) { minimum = 0; return; }
    minimum = Math.min(minimum, pointSegmentDistance(a, c, d), pointSegmentDistance(b, c, d), pointSegmentDistance(c, a, b), pointSegmentDistance(d, a, b));
  }));
  const firstPoints = firstParts.flatMap(part => part.points); const secondPoints = secondParts.flatMap(part => part.points);
  if (!firstSegments.length) firstPoints.forEach(point => secondSegments.forEach(([start, end]) => { minimum = Math.min(minimum, pointSegmentDistance(point, start, end)); }));
  if (!secondSegments.length) secondPoints.forEach(point => firstSegments.forEach(([start, end]) => { minimum = Math.min(minimum, pointSegmentDistance(point, start, end)); }));
  if (!firstSegments.length && !secondSegments.length) firstPoints.forEach(point => secondPoints.forEach(other => { minimum = Math.min(minimum, Math.hypot(point[0] - other[0], point[1] - other[1])); }));
  return Number.isFinite(minimum) ? minimum : null;
}
function mapMeasurementValue(fieldKey) {
  const config = MAP_MEASUREMENT_FIELDS[fieldKey]; const geometry = state.selected?.geometry;
  if (!config || !geometry) return null;
  if (config.kind === 'area') return polygonAreaSqm(geometry);
  const riverBedFeatures = state.mapLayerData.get('musi_buffer') || [];
  const distances = riverBedFeatures.map(feature => geometryDistanceMetres(geometry, feature.geometry)).filter(value => Number.isFinite(value));
  return distances.length ? Math.min(...distances) : null;
}
function measurementUnit(fieldKey, data) { const config = MAP_MEASUREMENT_FIELDS[fieldKey]; const units = MAP_MEASUREMENT_UNITS[config.kind]; const saved = String(data[config.unitKey] || ''); return units.some(([key]) => key === saved) ? saved : config.defaultUnit; }
function measurementConversion(fieldKey, value, unit) { const config = MAP_MEASUREMENT_FIELDS[fieldKey]; const definition = MAP_MEASUREMENT_UNITS[config.kind].find(([key]) => key === unit); return definition ? value * definition[2] : value; }
function measurementText(fieldKey, value, unit) { if (!Number.isFinite(value)) return 'Map geometry unavailable'; const converted = measurementConversion(fieldKey, value, unit); const decimals = Math.abs(converted) < 1 ? 4 : Math.abs(converted) < 100 ? 3 : 2; return `${Number(converted.toFixed(decimals)).toLocaleString(undefined, { maximumFractionDigits:decimals })} ${MAP_MEASUREMENT_UNITS[MAP_MEASUREMENT_FIELDS[fieldKey].kind].find(([key]) => key === unit)?.[1] || ''}`; }
function measurementStoredValue(fieldKey, value, unit) { const converted = measurementConversion(fieldKey, value, unit); const decimals = Math.abs(converted) < 1 ? 4 : Math.abs(converted) < 100 ? 3 : 2; return String(Number(converted.toFixed(decimals))); }
async function loadMapOverlays() {
  const data = await api('/api/map-layers');
  state.mapLayerData = new Map((data.layers || []).map(definition => [definition.id, definition.features || []]));
  state.overlays.forEach(layer => layer.remove()); state.overlays.clear();
  (data.layers || []).forEach(definition => {
    const layer = L.geoJSON({ type: 'FeatureCollection', features: definition.features || [] }, { style: overlayStyle(definition.id), onEachFeature(feature, item) { item.bindTooltip(escapeHtml(overlayLabel(feature.properties || {})), { sticky: true }); } }).addTo(state.map);
    state.overlays.set(definition.id, layer);
  });
  const bifurcated = await api('/api/bifurcated-buildings'); if (state.bifurcatedLayer) state.bifurcatedLayer.remove();
  state.bifurcatedLayer = L.geoJSON(bifurcated, { style:{ color:layerColor('bifurcated','#a855f7'), weight:1, fill:false, opacity:.8 }, onEachFeature(feature, layer) { layer.bindTooltip(`Bifurcated building · ${escapeHtml(feature.properties.BuildingID || feature.id)}`, { sticky:true }); } });
  renderMapLegend();
}
async function loadCustomMapLayers() {
  if (!state.map) return;
  const data = await api('/api/custom-map-layers'); state.customLayers.forEach(item => item.layer?.remove()); state.customLayers.clear();
  (data.layers || []).forEach(definition => {
    const layer = L.geoJSON(definition.geojson, { style:{ color:definition.color, weight:1.8, fillColor:definition.color, fillOpacity:.16 }, onEachFeature(feature, item) { item.bindTooltip(escapeHtml(overlayLabel(feature.properties || {}) || definition.name), { sticky:true }); item.on('contextmenu', event => { event.originalEvent?.preventDefault(); openLayerContextMenu(definition, event); }); } });
    if (definition.visible) layer.addTo(state.map); state.customLayers.set(definition.id, { ...definition, layer });
  });
  renderMapLegend();
}
const musiPhaseZones = [
  { id:'1', title:'ORR – West to Gandipet', distance:'21 km', weight:21 },
  { id:'2', title:'Gandhi Sarovar to Puranapul', distance:'6 km', weight:6 },
  { id:'3', title:'Puranapul to MGBS', distance:'4 km', weight:4 },
  { id:'4', title:'MGBS to Puranapul', distance:'8 km', weight:8 },
  { id:'5', title:'Uppal to ORR – East', distance:'16 km', weight:16 }
];
function drawMusiPhaseZones() {
  if (state.musiPhaseLayer) state.musiPhaseLayer.remove();
  // The reference diagram defines five project corridors, rather than GIS
  // administrative zones. Until official phase-zone polygons are supplied,
  // this is a clearly-labelled planning overlay across the Musi programme area.
  const west = 78.215, east = 78.755, south = 17.245, north = 17.505;
  const total = musiPhaseZones.reduce((sum, phase) => sum + phase.weight, 0); let cursor = west;
  const layers = musiPhaseZones.map(phase => {
    const next = cursor + ((east - west) * phase.weight / total);
    const center = [(south + north) / 2, (cursor + next) / 2];
    phase.center = center;
    const box = L.rectangle([[south, cursor], [north, next]], { color:'#d92d20', weight:2, dashArray:'8 6', fillColor:'#ef4444', fillOpacity:.035, interactive:true });
    box.bindTooltip(`<b>Musi Phase Zone ${phase.id}</b><br>${escapeHtml(phase.title)} · ${phase.distance}`, { sticky:true });
    box.on('click', () => openZone(phase.id));
    const label = L.marker(center, { interactive:true, icon:L.divIcon({ className:'musi-phase-map-label', html:`<button type="button" aria-label="Open Musi Phase Zone ${phase.id}"><b>Z${phase.id}</b></button>`, iconSize:[42, 32], iconAnchor:[21, 16] }) });
    label.on('click', () => openZone(phase.id)); cursor = next;
    return [box, label];
  }).flat();
  state.musiPhaseLayer = L.featureGroup(layers).addTo(state.map); state.musiPhaseLayer.bringToFront();
  if (!state.musiPhaseLegend) {
    state.musiPhaseLegend = L.control({ position:'bottomright' });
    state.musiPhaseLegend.onAdd = () => {
      const element = L.DomUtil.create('details', 'musi-phase-key'); element.innerHTML = `<summary>Musi Phase Zones</summary><ol>${musiPhaseZones.map(phase => `<li><b>Zone ${phase.id}</b><span>${escapeHtml(phase.title)} · ${phase.distance}</span></li>`).join('')}</ol>`; L.DomEvent.disableClickPropagation(element); L.DomEvent.disableScrollPropagation(element); return element;
    };
  }
}
function setProgrammeMapMode(active) {
  ['zones', 'circles', 'wards'].forEach(id => { const layer = state.overlays.get(id); if (!layer) return; if (active) state.map.removeLayer(layer); else layer.addTo(state.map); });
  if (active) [state.geoLayer, state.baseLayer, state.bifurcatedLayer, state.photoLayer].forEach(layer => layer?.remove());
  if (state.musiPhaseLayer) { if (active) state.musiPhaseLayer.addTo(state.map); else state.musiPhaseLayer.remove(); }
  if (state.musiPhaseLegend) { if (active) state.musiPhaseLegend.addTo(state.map); else state.musiPhaseLegend.remove(); }
}
function fitProgrammeMap() { const bounds = state.musiPhaseLayer && state.musiPhaseLayer.getBounds(); if (bounds && bounds.isValid()) state.map.fitBounds(bounds, { padding:[34, 34], maxZoom:12 }); }
function showZoneLanding() {
  state.selectedZone = null;
  setProgrammeMapMode(true);
  $('#appView').classList.add('zone-selection-active');
  setTimeout(() => { fitProgrammeMap(); state.map.invalidateSize(); }, 50);
}
async function openZone(zone, { showMenu = true } = {}) {
  const phase = musiPhaseZones.find(item => item.id === String(zone));
  if (String(zone) !== '1') {
    state.selectedZone = String(zone);
    L.popup({ closeButton:true, autoClose:true, className:'musi-phase-popup' }).setLatLng(phase ? phase.center : state.map.getCenter()).setContent(`<b>Musi Phase Zone ${escapeHtml(zone)}</b><br>${escapeHtml(phase ? phase.title : 'Project corridor')} · ${escapeHtml(phase ? phase.distance : '')}<br><small>This zone portal will be enabled after its survey data is added.</small>`).openOn(state.map);
    return;
  }
  try {
    setProgrammeMapMode(false);
    await Promise.all([loadBuildingBase({ fit:true }), refreshHouseholds(), refreshSidebar()]);
    state.selectedZone = '1'; $('#appView').classList.remove('zone-selection-active'); rememberPortalLocation();
    setTimeout(() => state.map.invalidateSize(), 100);
    if (showMenu && !isDrawerLayout()) await showTool('menu');
  } catch (error) {
    setProgrammeMapMode(true);
    L.popup({ closeButton:true }).setLatLng([17.375, 78.34]).setContent(`<b>Zone 1 could not be opened</b><br>${escapeHtml(errorMessage(error))}`).openOn(state.map);
  }
}
function buildingBaseStyle(feature) { const color = layerColor('buildings','#e6b84d'); const focused = state.dashboardFocusIds.has(feature.id); return { color: focused ? '#b42318' : color, weight: focused ? 3 : 1, fillColor: focused ? '#f5bf42' : color, fillOpacity: focused ? .82 : .5 }; }
function layerStyle(feature) { const status = statusOf(feature.properties); const colors = { Pending:'#f59e0b', Surveyed:'#2563eb', Verified:'#159875', 'Flagged / Revisit':'#d92d20' }; const focused = state.dashboardFocusIds.has(feature.id); return { color: focused ? '#b42318' : colors[status] || colors.Pending, weight: focused ? 3 : 1.3, fillColor: focused ? '#f5bf42' : colors[status] || colors.Pending, fillOpacity: focused ? .82 : .42 }; }
function openBuildingQuestionnaire(feature, event, pan = true) {
  if (state.drawingMode) { if (event?.originalEvent) L.DomEvent.stop(event.originalEvent); addDrawingPoint(event.latlng); return; }
  if (state.measureMode) { if (event?.originalEvent) L.DomEvent.stop(event.originalEvent); addMeasurementPoint(event.latlng); return; }
  if (event?.originalEvent) L.DomEvent.stopPropagation(event.originalEvent);
  const candidates = [feature?.id, feature?.properties?.household_id, feature?.properties?.HouseholdID, feature?.properties?.id].filter(value => value !== undefined && value !== null && value !== '');
  const id = candidates.find(candidate => state.featureById.has(String(candidate))) || candidates[0];
  if (!id) { showNotice('This building has no household ID, so its questionnaire cannot be opened.', true); return; }
  openHousehold(String(id), pan);
}
function drawBuildingBase(features) {
  if (state.baseLayer) state.baseLayer.remove(); state.baseLayerById.clear();
  state.baseLayer = L.geoJSON({ type: 'FeatureCollection', features }, {
    style: buildingBaseStyle,
    onEachFeature(feature, layer) {
      state.baseLayerById.set(feature.id, layer);
      layer.on({ click: event => openBuildingQuestionnaire(feature, event, true), mouseover: () => layer.setStyle({ weight: 1.5, fillOpacity: .42 }), mouseout: () => layer.setStyle(buildingBaseStyle(feature)) });
      layer.bindTooltip(`Building ${escapeHtml(feature.properties.BuildingID || feature.id)}<br><small>${escapeHtml(feature.id)}</small>`, { sticky: true });
    }
  }).addTo(state.map);
  renderMapLegend();
}
function renderMap(features, fit = false) {
  if (state.geoLayer) state.geoLayer.remove(); state.layerById.clear();
  state.geoLayer = L.geoJSON({ type: 'FeatureCollection', features }, {
    style: layerStyle,
    onEachFeature(feature, layer) { state.layerById.set(feature.id, layer); layer.on({ click: event => openBuildingQuestionnaire(feature, event, false), mouseover: () => layer.setStyle({ weight: 2.3, fillOpacity: .68 }), mouseout: () => layer.setStyle(layerStyle(feature)) }); layer.bindTooltip(`${escapeHtml(householdLabel(feature.properties))}<br><small>${escapeHtml(feature.id)}</small>`, { sticky: true }); }
  }).addTo(state.map);
  state.geoLayer.bringToFront(); updateSelectedHouseholdHighlight();
  if (fit && features.length) state.map.fitBounds(state.geoLayer.getBounds(), { padding: [22, 22], maxZoom: 18 });
}
function renderMetrics(dashboard) {
  const counts = dashboard.counts; $('#datasetTotal').textContent = `${counts.total} mapped`;
  $('#metrics').innerHTML = [['Pending', counts.Pending], ['Surveyed', counts.Surveyed], ['Verified', counts.Verified], ['Flagged / Revisit', counts['Flagged / Revisit']]].map(([label, count]) => `<div class="metric metric-${statusClass(label)}"><strong>${count || 0}</strong><span>${label}</span></div>`).join('');
}
function renderList() {
  const list = $('#householdList'); $('#resultCount').textContent = `${state.features.length} shown`;
  list.innerHTML = state.features.length ? state.features.map(feature => { const p = feature.properties; const status = statusOf(p); const queued = state.pendingByHousehold.get(feature.id); const pending = queued ? `<span class="pending-badge ${queued.status === 'conflict' ? 'needs-review':''}">${queued.status === 'conflict' ? 'Needs review' : 'Pending sync'}</span>` : ''; return `<button class="household-item ${state.selected?.id === feature.id ? 'active':''}" data-id="${escapeHtml(feature.id)}"><div class="item-row"><strong>${escapeHtml(householdLabel(p))}</strong><span class="mini-status mini-${statusClass(status)}">${escapeHtml(status)}</span></div><span>${escapeHtml(feature.id)} · ${displayValue(p.HNoPlotNo)} · ${displayValue(p.ColnyStrtN)}</span>${pending}</button>`; }).join('') : '<p class="empty-list">No households match these filters.</p>';
  list.querySelectorAll('[data-id]').forEach(button => button.addEventListener('click', () => openHousehold(button.dataset.id, true)));
}
async function refreshHouseholds({ fit = false } = {}) {
  const parameters = new URLSearchParams(); Object.entries(state.filters).forEach(([key, value]) => { if (value) parameters.set(key, value); });
  const data = await api(`/api/households?${parameters}`); state.features = data.features; renderMap(data.features, fit); renderList();
}
async function loadBuildingBase({ fit = false } = {}) {
  const data = await api('/api/households'); state.allFeatures = data.features; state.featureById = new Map(data.features.map(feature => [feature.id, feature])); drawBuildingBase(data.features); updateSelectedHouseholdHighlight();
  if (fit && data.features.length) state.map.fitBounds(state.baseLayer.getBounds(), { padding: [22, 22], maxZoom: 18 });
}
async function refreshSidebar() { const [dashboard, activity] = await Promise.all([api('/api/dashboard'), api('/api/activity')]); renderMetrics(dashboard); state.activityMarkup = activity.items.length ? activity.items.slice(0, 7).map(item => `<div class="activity-item"><b>${escapeHtml(item.username)}</b> ${escapeHtml(item.action)}<br><span>${escapeHtml(item.household_id || item.detail || '')}</span><small>${new Date(item.at).toLocaleString()}</small></div>`).join('') : '<div class="activity-item">No edits have been recorded yet.</div>'; }
function localDateTimeInputValue(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  // Device-entered values are already local. UTC timestamps returned by the
  // server must be converted before they are shown in a datetime-local field.
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/.test(raw)) return raw.slice(0, 16);
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw.slice(0, 16);
  const pad = part => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function formControl(field, value, editable) {
  const [key, label, type = 'text', options] = field; const full = type === 'textarea' || key === 'field_notes' || key === 'Remarks' || key === 'ColnyStrtN' || key === 'NameStruct'; const safe = String(value ?? ''); const inputValue = type === 'datetime-local' ? localDateTimeInputValue(safe) : safe;
  let control;
  if (key === 'q_location_ward') {
    const wardOptions = GHMC_WARD_OPTIONS.map(({ name, number }) => {
      const ward = `${name} (Ward ${number})`;
      return `<option value="${escapeHtml(ward)}"></option>`;
    }).join('');
    control = `<input data-field="${key}" type="text" list="ghmcWardOptions" value="${escapeHtml(safe)}" placeholder="Start typing a ward name" autocomplete="off" ${editable ? '' : 'disabled'}><datalist id="ghmcWardOptions">${wardOptions}</datalist>`;
  }
  else if (type === 'select') { const assignedTeamOption = key === 'assigned_team' && state.user?.team_name ? [state.user.team_name] : []; const values = [...new Set([...(options || []), ...assignedTeamOption, ...(safe && !options?.includes(safe) ? [safe] : [])])]; control = `<select data-field="${key}" ${editable ? '' : 'disabled'}><option value="">Not recorded</option>${values.map(option => `<option value="${escapeHtml(option)}" ${option === safe ? 'selected':''}>${escapeHtml(option)}</option>`).join('')}</select>`; }
  else if (type === 'textarea') control = `<textarea data-field="${key}" ${editable ? '' : 'disabled'}>${escapeHtml(safe)}</textarea>`;
  else control = `<input data-field="${key}" type="${type}" value="${escapeHtml(inputValue)}" ${editable ? '' : 'disabled'}>`;
  return `<div class="field ${full ? 'full':''}"><label>${escapeHtml(label)}</label>${control}</div>`;
}
function workflowFieldValue(key) {
  return String(state.dirty.has(key) ? state.dirty.get(key) : (state.selected?.properties[key] ?? '')).trim();
}
function setInitialWorkflowValue(key, value, emptyValues = ['']) {
  if (!value || !emptyValues.includes(workflowFieldValue(key))) return false;
  state.dirty.set(key, value);
  const input = document.querySelector(`[data-field="${key}"]`);
  if (input) {
    if (input.tagName === 'SELECT' && ![...input.options].some(option => option.value === value)) input.add(new Option(value, value));
    input.value = value;
  }
  return true;
}
function currentEditorTeam() {
  if (state.user?.team_name) return String(state.user.team_name).trim();
  if (state.user?.username === 'team1') return 'Team 1';
  if (state.user?.username === 'team2') return 'Team 2';
  return '';
}
function populateSurveyWorkflow() {
  if (!state.selected) return;
  const now = new Date(); const pad = value => String(value).padStart(2, '0'); const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  setInitialWorkflowValue('Survey_Dat', stamp);
  setInitialWorkflowValue('survey_status', 'Pending', ['Not started', 'In progress', 'Not recorded', '']);
  setInitialWorkflowValue('assigned_team', currentEditorTeam(), ['Unassigned', 'Not recorded', '']);
  saveDraft();
}
function captureQuestionnaireUi() {
  const form = $('#questionnaireForm'); const panel = $('#detailPanel');
  if (!form) return null;
  return {
    tabId: state.activeQuestionnaireTab,
    openSections: new Set([...form.querySelectorAll('[data-questionnaire-section][open]')].map(section => section.dataset.questionnaireSection)),
    workflowOpen: Boolean(form.querySelector('.workflow-dropdown[open]')),
    scrollTop: panel?.scrollTop || 0
  };
}
function scheduleQuestionnaireAutoSave() {
  clearTimeout(state.autoSaveTimer);
  if (!state.selected || !state.dirty.size) return;
  state.autoSaveTimer = window.setTimeout(() => {
    if (!state.autoSaveInFlight && state.selected && state.dirty.size) saveCurrent({ automatic:true });
  }, 1600);
}
function questionnaireTabLabel(tabId) { return state.questionnaireTabs.find(tab => tab.tab_id === tabId)?.label || ({ tab1:'Primary observation', tab2:'Secondary observation', tab3:'Others' }[tabId] || 'Questionnaire'); }
function isQuestionnaireTab(tabId) { return state.questionnaireTabs.some(tab => tab.tab_id === tabId); }
function renderQuestionnaireTabNav() {
  const holder = $('.detail-tabs'); if (!holder) return;
  const tabButtons = new Map([...holder.querySelectorAll('.tab')].filter(button => isQuestionnaireTab(button.dataset.tab)).map(button => [button.dataset.tab, button]));
  const otherButtons = [...holder.querySelectorAll('.tab')].filter(button => !isQuestionnaireTab(button.dataset.tab));
  state.questionnaireTabs.forEach(tab => { const button = tabButtons.get(tab.tab_id); if (button) { button.textContent = tab.label; holder.append(button); } });
  otherButtons.forEach(button => holder.append(button));
}
function questionFieldControl(field, data, editable) {
  const control = formControl([field.field_key, field.label, field.input_type, field.options], data[field.field_key], editable && canEditQuestionField(field.field_key, data[field.field_key]));
  const measurement = MAP_MEASUREMENT_FIELDS[field.field_key];
  const unit = measurement ? measurementUnit(field.field_key, data) : ''; const calculated = measurement ? mapMeasurementValue(field.field_key) : null;
  const calculator = measurement ? `<div class="map-measurement" data-map-measurement="${field.field_key}"><div class="map-measurement-result"><span>Map calculation</span><output data-map-measurement-result="${field.field_key}">${escapeHtml(measurementText(field.field_key, calculated, unit))}</output></div><label>Unit<select data-measurement-unit="${field.field_key}" ${editable ? '' : 'disabled'}>${MAP_MEASUREMENT_UNITS[measurement.kind].map(([key, label]) => `<option value="${key}" ${key === unit ? 'selected' : ''}>${escapeHtml(label)}</option>`).join('')}</select></label><button class="button secondary map-measurement-apply" type="button" data-use-map-measurement="${field.field_key}" ${editable && Number.isFinite(calculated) ? '' : 'disabled'}>Use map value</button><small>${escapeHtml(measurement.source)}</small></div>` : '';
  return `<div class="question-field">${control}${calculator}${isAdmin() && state.questionnaireEditMode ? `<div class="question-editor-actions"><button class="question-edit" type="button" data-edit-question="${field.id}" aria-label="Edit ${escapeHtml(field.label)}">Edit question</button><button class="question-retire" type="button" data-retire-question="${field.id}" data-question-label="${escapeHtml(field.label)}" aria-label="Remove ${escapeHtml(field.label)} from this questionnaire">Remove question</button></div>` : ''}</div>`;
}
function setQuestionSections(tabId, selectedSection = '') {
  const sections = [...new Set(state.questionnaireSchema.filter(field => field.tab_id === tabId).map(field => field.section_name).filter(Boolean))];
  $('#newQuestionSection').innerHTML = `${sections.map(section => `<option value="${escapeHtml(section)}">${escapeHtml(section)}</option>`).join('')}<option value="__new__">+ Add a new section</option>`;
  const sectionValue = sections.includes(selectedSection) ? selectedSection : (selectedSection ? '__new__' : (sections[0] || '__new__'));
  $('#newQuestionSection').value = sectionValue;
  $('#newQuestionSectionNameLabel').hidden = $('#newQuestionSection').value !== '__new__';
  $('#newQuestionSectionName').required = $('#newQuestionSection').value === '__new__';
  $('#newQuestionSectionName').value = $('#newQuestionSection').value === '__new__' ? selectedSection : '';
}
function openQuestionDialog(tabId, field = null) {
  if (!isAdmin()) return;
  const dialog = $('#questionDialog'); const targetTab = field?.tab_id || tabId; const form = $('#questionForm');
  form.reset(); $('#questionError').textContent = ''; $('#newQuestionId').value = field?.id || ''; $('#newQuestionTab').value = targetTab;
  $('#questionDialogTitle').textContent = field ? 'Edit shared question' : 'Add shared question';
  $('#questionDialogIntro').innerHTML = field ? `Update the wording, section, response type, or choices in <span id="newQuestionTabName">${escapeHtml(questionnaireTabLabel(targetTab))}</span>. Existing household answers remain saved and unchanged.` : `This question will appear for every household in <span id="newQuestionTabName">${escapeHtml(questionnaireTabLabel(targetTab))}</span>. Existing household data is not changed.`;
  $('#saveQuestionButton').textContent = field ? 'Save question' : 'Add question';
  setQuestionSections(targetTab, field?.section_name || '');
  if (field) { form.elements.label.value = field.label; $('#newQuestionType').value = field.input_type; $('#newQuestionChoices').value = (field.options || []).join('\n'); }
  $('#questionChoicesLabel').hidden = $('#newQuestionType').value !== 'select';
  dialog.showModal();
}
async function openUserDialog() {
  if (!isAdmin()) return;
  $('#userError').textContent = ''; $('#userForm').reset();
  try {
    const data = await api('/api/users');
    $('#newUserTeam').innerHTML = `<option value="">No team assigned</option>${data.teams.map(team => `<option value="${team.id}">${escapeHtml(team.name)}</option>`).join('')}`;
  } catch (error) { $('#userError').textContent = errorMessage(error); }
  $('#userDialog').showModal();
}
async function retireQuestion(id, label) {
  if (!isAdmin()) return;
  if (!window.confirm(`Remove “${label}” from the active questionnaire? Existing answers remain saved and available in exports and the audit history.`)) return;
  try {
    await api(`/api/questionnaire-schema/${encodeURIComponent(id)}`, { method:'DELETE' });
    await loadQuestionnaireSchema();
    if (state.selected) renderQuestionnaire(state.selected);
  } catch (error) { showNotice(errorMessage(error), true); }
}
function renderQuestionnaire(household, preservedUi = null) {
  const editable = ['admin', 'editor'].includes(state.user.role); const data = { ...household.properties, ...Object.fromEntries(state.dirty) }; const tabId = state.activeQuestionnaireTab;
  const schema = state.questionnaireSchema.filter(field => field.tab_id === tabId);
  const grouped = schema.reduce((groups, field) => { (groups.get(field.section_name) || groups.set(field.section_name, []).get(field.section_name)).push(field); return groups; }, new Map());
  const restoring = preservedUi?.tabId === tabId;
  const workflow = tabId === 'tab1' ? `<section class="form-section workflow-controls" aria-label="Survey status and assignment"><details class="workflow-dropdown" ${restoring && preservedUi.workflowOpen ? 'open' : ''}><summary>Survey workflow &amp; verification</summary><div class="form-grid">${fieldGroups[0].fields.map(field => formControl(field, data[field[0]], editable && canEditQuestionField(field[0], data[field[0]]))).join('')}</div></details></section>` : '';
  const sectionTitleStyle = 'font-family:inherit!important;font-size:10px!important;font-weight:800!important;letter-spacing:.035em!important;color:#627d98!important;line-height:1.4!important;text-transform:uppercase!important;margin:0 0 9px!important;padding:5px 0!important;';
  const sections = [...grouped.entries()].map(([section, fields], index) => { const sectionKey = `${tabId}:${section}`; const open = restoring ? preservedUi.openSections.has(sectionKey) : index === 0; return `<section class="form-section questionnaire-section"><details data-questionnaire-section="${escapeHtml(sectionKey)}" ${open ? 'open' : ''}><summary class="questionnaire-section-title" style="${sectionTitleStyle}">${escapeHtml(section)}</summary><div class="form-grid">${fields.map(field => questionFieldControl(field, data, editable)).join('')}</div></details></section>`; }).join('');
  const empty = schema.length ? '' : '<p class="tool-copy">No active questions in this tab yet.</p>';
  const tabPosition = state.questionnaireTabs.findIndex(tab => tab.tab_id === tabId);
  const manage = isAdmin() ? `<section class="question-admin-actions ${state.questionnaireEditMode ? 'is-open' : ''}"><button id="toggleQuestionManagement" class="questionnaire-edit-toggle" type="button" aria-expanded="${state.questionnaireEditMode}">${state.questionnaireEditMode ? 'Done editing questions' : 'Edit questions'}</button>${state.questionnaireEditMode ? `<div class="question-admin-buttons"><button id="addQuestionButton" class="button secondary" type="button">Add question</button><button id="renameQuestionTab" class="button secondary" type="button">Rename form</button><button id="moveQuestionTabLeft" class="button secondary" type="button" ${tabPosition <= 0 ? 'disabled' : ''}>Move left</button><button id="moveQuestionTabRight" class="button secondary" type="button" ${tabPosition >= state.questionnaireTabs.length - 1 ? 'disabled' : ''}>Move right</button></div>` : ''}</section>` : '';
  $('#questionnaireForm').innerHTML = `${workflow}${sections}${empty}${manage}`;
  const recordDraftField = input => { const key = input.dataset.field; const current = input.value; const original = String(state.selected.properties[key] ?? ''); if (current === original) state.dirty.delete(key); else state.dirty.set(key, current); const questionnaireInput = key.startsWith('q_') || key === 'household_members' || key === 'occupier_members'; if (questionnaireInput) populateSurveyWorkflow(); saveDraft(); updateSaveState(); if (questionnaireInput) scheduleQuestionnaireAutoSave(); };
  $('#questionnaireForm').querySelectorAll('[data-field]').forEach(input => { input.addEventListener('input', () => recordDraftField(input)); input.addEventListener('change', () => recordDraftField(input)); });
  $('#questionnaireForm').querySelectorAll('[data-measurement-unit]').forEach(select => select.addEventListener('change', () => {
    const fieldKey = select.dataset.measurementUnit; const output = $('#questionnaireForm').querySelector(`[data-map-measurement-result="${fieldKey}"]`);
    if (output) output.textContent = measurementText(fieldKey, mapMeasurementValue(fieldKey), select.value);
  }));
  $('#questionnaireForm').querySelectorAll('[data-use-map-measurement]').forEach(button => button.addEventListener('click', () => {
    const fieldKey = button.dataset.useMapMeasurement; const config = MAP_MEASUREMENT_FIELDS[fieldKey]; const unit = $('#questionnaireForm').querySelector(`[data-measurement-unit="${fieldKey}"]`)?.value || config.defaultUnit; const calculated = mapMeasurementValue(fieldKey); const input = $('#questionnaireForm').querySelector(`[data-field="${fieldKey}"]`);
    if (!input || !Number.isFinite(calculated)) { showNotice('The required map geometry is not available for this calculation.', true); return; }
    input.value = measurementStoredValue(fieldKey, calculated, unit); recordDraftField(input);
    if (String(state.selected.properties[config.unitKey] ?? '') === unit) state.dirty.delete(config.unitKey); else state.dirty.set(config.unitKey, unit);
    saveDraft(); updateSaveState(); scheduleQuestionnaireAutoSave();
  }));
  $('#toggleQuestionManagement')?.addEventListener('click', () => { state.questionnaireEditMode = !state.questionnaireEditMode; renderQuestionnaire(state.selected); });
  $('#addQuestionButton')?.addEventListener('click', () => openQuestionDialog(tabId));
  $('#renameQuestionTab')?.addEventListener('click', async () => { const label = window.prompt('Form name', questionnaireTabLabel(tabId)); if (!label?.trim()) return; try { await api(`/api/questionnaire-tabs/${tabId}`, { method:'PUT', body:JSON.stringify({ label:label.trim() }) }); await loadQuestionnaireSchema(); renderQuestionnaire(state.selected); } catch (error) { showNotice(errorMessage(error), true); } });
  $('#moveQuestionTabLeft')?.addEventListener('click', async () => { try { await api(`/api/questionnaire-tabs/${tabId}`, { method:'PUT', body:JSON.stringify({ direction:'left' }) }); await loadQuestionnaireSchema(); renderQuestionnaire(state.selected); } catch (error) { showNotice(errorMessage(error), true); } });
  $('#moveQuestionTabRight')?.addEventListener('click', async () => { try { await api(`/api/questionnaire-tabs/${tabId}`, { method:'PUT', body:JSON.stringify({ direction:'right' }) }); await loadQuestionnaireSchema(); renderQuestionnaire(state.selected); } catch (error) { showNotice(errorMessage(error), true); } });
  $('#questionnaireForm').querySelectorAll('[data-edit-question]').forEach(button => button.addEventListener('click', () => { const field = state.questionnaireSchema.find(item => String(item.id) === String(button.dataset.editQuestion)); if (field) openQuestionDialog(tabId, field); }));
  $('#questionnaireForm').querySelectorAll('[data-retire-question]').forEach(button => button.addEventListener('click', () => retireQuestion(button.dataset.retireQuestion, button.dataset.questionLabel)));
  $('#saveButton').hidden = !editable; $('#revisionNote').textContent = household.updated_at ? `Last saved by ${household.updated_by || 'unknown'} · ${new Date(household.updated_at).toLocaleString()} · version ${household.revision}` : `Baseline GIS record · version ${household.revision}`;
  if (restoring) requestAnimationFrame(() => { const panel = $('#detailPanel'); if (panel) panel.scrollTop = preservedUi.scrollTop; });
}
function renderRecord(household) {
  const fieldKeys = Object.keys(household.baseline).filter(key => key !== 'household_id');
  const rows = fieldKeys.map(key => `<tr><td>${escapeHtml(fieldName[key] || titleCase(key))}</td><td>${displayValue(household.baseline[key])}</td></tr>`).join('');
  $('#recordTab').innerHTML = `<div class="record-block baseline-record"><h3>Existing data</h3><p>These imported GIS attributes are read-only and are never overwritten by the updated questionnaire. They remain available for comparison and export.</p><table class="record-table"><tbody>${rows}</tbody></table></div>`;
}
function renderHouseholdExports(household) {
  const holder = $('#householdExports'); const id = encodeURIComponent(household.id);
  holder.innerHTML = `<span>Download this household</span><a href="/api/households/${id}/export/geojson">GeoJSON</a><a href="/api/households/${id}/export/shapefile">Shapefile ZIP</a><a href="/api/households/${id}/export/xlsx">Excel</a><a href="/api/households/${id}/export/csv">CSV</a><a href="/api/households/${id}/export/pdf">PDF report</a><a href="/api/households/${id}/export/word">Word</a>`;
  holder.hidden = false;
}
async function renderHouseholdHistory(household) {
  const content = $('#historyContent');
  content.innerHTML = '<div class="history-loading">Loading change log…</div>';
  try {
    const data = await api(`/api/households/${encodeURIComponent(household.id)}/history`);
    if (state.selected?.id !== household.id || state.activeDetailTab !== 'history') return;
    const lastEditor = data.last_editor || 'No questionnaire edits recorded';
    const lastEditedAt = data.last_edited_at ? new Date(data.last_edited_at).toLocaleString() : '—';
    const entries = data.items.length ? data.items.map(item => `<article><b>${escapeHtml(item.display_name || item.username)}</b><span>${escapeHtml(item.action)}</span>${item.detail ? `<small>${escapeHtml(item.detail)}</small>` : ''}<time>${new Date(item.at).toLocaleString()}</time></article>`).join('') : '<div class="history-empty">No changes have been recorded for this household yet.</div>';
    content.innerHTML = `<section class="history-card"><div class="history-last-edit"><span>Last questionnaire edit</span><b>${escapeHtml(lastEditor)}</b><time>${escapeHtml(lastEditedAt)}</time></div><div class="history-list">${entries}</div></section>`;
  } catch (error) {
    if (state.selected?.id === household.id && state.activeDetailTab === 'history') content.innerHTML = `<div class="history-empty">${escapeHtml(errorMessage(error))}</div>`;
  }
}
function photoCard(photo, allowManage = false) { const location = Number.isFinite(Number(photo.latitude)) && Number.isFinite(Number(photo.longitude)) ? `${Number(photo.latitude).toFixed(6)}, ${Number(photo.longitude).toFixed(6)}` : 'Building location fallback'; return `<article class="photo-card"><a href="${escapeHtml(photo.url)}" target="_blank" rel="noopener"><img src="${escapeHtml(photo.url)}" alt="${escapeHtml(photo.original_name)}"></a><div><b>${escapeHtml(photo.original_name)}</b><small>${escapeHtml(photo.uploaded_by)} · ${new Date(photo.captured_at || photo.uploaded_at).toLocaleString()}</small><small>Location: ${location}</small><p><a href="${escapeHtml(photo.download_url)}">Download photo</a>${allowManage ? ` <button type="button" data-delete-photo="${photo.id}">Remove</button>` : ''}</p></div></article>`; }
function drawPhotoMarkers(photos) { if (state.photoLayer) state.photoLayer.remove(); state.photoLayer = L.layerGroup(); photos.filter(photo => Number.isFinite(Number(photo.latitude)) && Number.isFinite(Number(photo.longitude))).forEach(photo => L.marker([Number(photo.latitude), Number(photo.longitude)], { title:`Field photo: ${photo.original_name}`, riseOnHover:true, icon:mapPinIcon('photo') }).bindPopup(`<b>Field photo</b><br>${escapeHtml(photo.original_name)}<br><a href="${escapeHtml(photo.url)}" target="_blank" rel="noopener">View photo</a>`).addTo(state.photoLayer)); if (state.photoLayer.getLayers().length) state.photoLayer.addTo(state.map); }
function currentPhotoPosition() { return new Promise(resolve => { if (!navigator.geolocation) { resolve(null); return; } navigator.geolocation.getCurrentPosition(position => resolve({ latitude:position.coords.latitude, longitude:position.coords.longitude }), () => resolve(null), { enableHighAccuracy:true, timeout:9000, maximumAge:30000 }); }); }
function readPhoto(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onerror = () => reject(new Error('The selected photo could not be read.')); reader.onload = () => resolve(reader.result); reader.readAsDataURL(file); }); }
async function renderPhotos(household) {
  const content = $('#photoContent'); content.innerHTML = '<p class="tool-copy">Loading field photos…</p>'; const data = await api(`/api/households/${encodeURIComponent(household.id)}/photos`); if (state.selected?.id !== household.id) return; const canUpload = ['admin', 'editor'].includes(state.user.role); const adminUser = isAdmin();
  content.innerHTML = `${canUpload ? `<section class="photo-upload"><h3>Add field photo</h3><p>Use the camera on site or select an existing image from the phone gallery. The portal records device GPS where permission is available; otherwise it uses the selected building location.</p><div class="photo-actions"><label class="button secondary">Use camera<input id="photoCamera" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" hidden></label><label class="button secondary">Choose from gallery<input id="photoGallery" type="file" accept="image/jpeg,image/png,image/webp" hidden></label></div><p id="photoNotice" class="tool-notice"></p></section>` : ''}<section class="photo-gallery"><h3>Photos for this household</h3>${data.photos.length ? data.photos.map(photo => photoCard(photo, adminUser)).join('') : '<p class="tool-copy">No field photos have been added yet.</p>'}</section>`;
  drawPhotoMarkers(data.photos);
  const uploadPhoto = async event => { const file = event.target.files?.[0]; if (!file) return; const notice = $('#photoNotice'); if (file.size > 15_000_000) { notice.textContent = 'Choose a photo smaller than 15 MB.'; return; } notice.textContent = 'Reading photo and location…'; try { const [dataUrl, position] = await Promise.all([readPhoto(file), currentPhotoPosition()]); const layer = state.layerById.get(household.id) || state.baseLayerById.get(household.id); const fallback = layer?.getBounds?.().getCenter(); const result = await sendOrQueue({ type:'photo-upload', householdId:household.id, method:'POST', url:`/api/households/${encodeURIComponent(household.id)}/photos`, body:JSON.stringify({ filename:file.name, mime_type:file.type, data_url:dataUrl, latitude:position?.latitude ?? fallback?.lat, longitude:position?.longitude ?? fallback?.lng, captured_at:new Date().toISOString() }) }); if (result.queued) { notice.textContent = 'Photo saved on this device and queued for upload.'; return; } await renderPhotos(household); } catch (error) { notice.textContent = errorMessage(error); } };
  if (canUpload) ['#photoCamera', '#photoGallery'].forEach(selector => $(selector).addEventListener('change', uploadPhoto));
  if (adminUser) content.querySelectorAll('[data-delete-photo]').forEach(button => button.addEventListener('click', async () => { try { await api(`/api/photos/${button.dataset.deletePhoto}`, { method:'DELETE' }); await renderPhotos(household); } catch (error) { alert(errorMessage(error)); } }));
}
function setDirections(lat, lng) { const holder = $('#mapDirections'); if (!Number.isFinite(lat) || !Number.isFinite(lng)) { holder.hidden = true; return; } const point = `${lat.toFixed(6)},${lng.toFixed(6)}`; const encodedPoint = encodeURIComponent(point); holder.innerHTML = `<span>Directions to this building</span><a href="https://www.google.com/maps/dir/?api=1&destination=${encodedPoint}" target="_blank" rel="noopener">Google Maps</a><a href="https://maps.apple.com/?daddr=${encodedPoint}&dirflg=d&q=${encodeURIComponent('MRDCL household')}" target="_blank" rel="noopener">Apple Maps</a>`; holder.hidden = false; }
async function renderAdminReview(household) {
  const tab = $('#reviewTab'); const content = $('#adminReviewContent');
  if (!canReview()) { tab.hidden = true; content.hidden = true; return; }
  tab.hidden = false; const coverage = questionnaireCoverage(household); const status = statusOf(household.properties); const verification = household.properties.verification_status || 'Pending';
  content.innerHTML = `<div class="review-summary"><div><span>Questionnaire completed</span><b>${coverage.answered} / ${coverage.total}</b><small>${coverage.percent}% answered</small></div><div><span>Survey status</span><b>${escapeHtml(status)}</b><small>Verification: ${escapeHtml(verification)}</small></div><div><span>Record version</span><b>${household.revision}</b><small>${household.updated_by ? `Last change: ${escapeHtml(household.updated_by)}` : 'Baseline record'}</small></div></div><div class="review-card"><h3>${isAdmin() ? 'Administrator' : 'Office'} review</h3><p>Review the questionnaire and change history, then record a decision. Office and Admin users can finalise a household.</p><form id="adminReviewForm"><label>Decision<select name="decision"><option value="checked">Checked — retain current survey status</option><option value="corrections">Corrections required — return to survey team</option><option value="approved">Approved — finalise as Verified</option></select></label><label>Review note<textarea name="notes" rows="3" placeholder="Reason for decision or corrections required"></textarea></label><button class="button primary" type="submit">Apply review decision</button><p id="reviewNotice" class="tool-notice"></p></form></div><div class="review-card"><h3>Household change history</h3><div id="householdAudit" class="review-history">Loading history…</div></div>`;
  $('#adminReviewForm').addEventListener('submit', async event => { event.preventDefault(); if (state.dirty.size) { $('#reviewNotice').textContent = 'Save the current questionnaire changes before applying a review decision.'; return; } const button = event.submitter; button.disabled = true; button.textContent = 'Applying…'; try { const form = Object.fromEntries(new FormData(event.currentTarget)); const result = await api(`/api/households/${encodeURIComponent(household.id)}/review`, { method:'POST', body:JSON.stringify({ ...form, revision:state.selected.revision }) }); state.selected = result.household; renderQuestionnaire(state.selected); renderRecord(state.selected); await renderAdminReview(state.selected); $('#detailStatus').textContent = statusOf(state.selected.properties); $('#detailStatus').className = `status-pill mini-${statusClass(statusOf(state.selected.properties))}`; await Promise.all([loadBuildingBase(), refreshHouseholds(), refreshSidebar()]); } catch (error) { $('#reviewNotice').textContent = errorMessage(error); } finally { button.disabled = false; button.textContent = 'Apply review decision'; } });
  try { const data = await api(`/api/households/${encodeURIComponent(household.id)}/review`); if (state.selected?.id !== household.id) return; $('#householdAudit').innerHTML = data.items.length ? data.items.map(item => `<article><b>${escapeHtml(item.username)}</b><span>${escapeHtml(item.action)}</span><p>${escapeHtml(item.detail || '')}</p><small>${new Date(item.at).toLocaleString()}</small></article>`).join('') : '<p>No changes have been recorded for this household yet.</p>'; } catch (error) { if (state.selected?.id === household.id) $('#householdAudit').textContent = errorMessage(error); }
}
function updateSaveState() { const button = $('#saveButton'); if (!button.hidden) button.textContent = state.dirty.size ? `Save ${state.dirty.size} change${state.dirty.size === 1 ? '' : 's'}` : 'Save changes'; }
async function openHousehold(id, pan = false, requestedTab = 'tab1') {
  try { const data = await api(`/api/households/${encodeURIComponent(id)}`); state.selected = data.household; updateSelectedHouseholdHighlight(); state.dirty.clear(); let restoredDraft = restoreDraft(state.selected); if (!restoredDraft) restoredDraft = await restoreIndexedDraft(state.selected); $('#emptyDetail').hidden = true; $('#detailContent').hidden = false; const p = state.selected.properties;
    $('#detailTitle').textContent = householdLabel(p); $('#detailStatus').textContent = statusOf(p); $('#detailStatus').className = `status-pill mini-${statusClass(statusOf(p))}`; $('#detailMeta').textContent = `${id} · ${p.HNoPlotNo || 'plot not recorded'} · Musi Phase ${p.Zone_1 || p.Zonewise || 'not recorded'} · GHMC ${p.ghmc_zone || 'outside mapped zone'}`; $('#saveNotice').hidden = true; state.activeQuestionnaireTab = isQuestionnaireTab(requestedTab) ? requestedTab : 'tab1'; renderQuestionnaire(state.selected); renderRecord(state.selected); renderHouseholdExports(state.selected); renderPhotos(state.selected); renderAdminReview(state.selected); activateTab(requestedTab); if (restoredDraft) showNotice('Your unsaved draft was restored on this device.'); updateSaveState(); renderList(); $('#appView').classList.add('detail-panel-open');
    state.layerById.forEach((layer, featureId) => { const feature = state.featureById.get(featureId); if (feature) layer.setStyle(layerStyle(feature)); }); state.baseLayerById.forEach((layer, featureId) => { const feature = state.featureById.get(featureId); if (feature) layer.setStyle(buildingBaseStyle(feature)); }); const selectedLayer = state.layerById.get(id) || state.baseLayerById.get(id); const center = selectedLayer?.getBounds?.().getCenter(); setDirections(center?.lat, center?.lng); if (selectedLayer && pan && !isDrawerLayout()) state.map.fitBounds(selectedLayer.getBounds(), { padding: [40, 40], maxZoom: 20 }); if (isDrawerLayout()) { if (state.activeTool) closeTools(); setPhonePanel('detail'); } rememberPortalLocation();
  } catch (error) { showNotice(errorMessage(error), true); }
}
function showNotice(message, error = false) { const el = $('#saveNotice'); el.textContent = message; el.className = `save-notice ${error ? 'error':''}`; el.hidden = false; }
function applyConflictResult(result, message) {
  state.selected = result.household; state.dirty.clear(); clearDraft(state.selected.id);
  renderQuestionnaire(state.selected); renderRecord(state.selected); renderHouseholdExports(state.selected); renderList(); updateSaveState();
  $('#detailStatus').textContent = statusOf(state.selected.properties); $('#detailStatus').className = `status-pill mini-${statusClass(statusOf(state.selected.properties))}`;
  showNotice(message);
  refreshPendingOperations(); Promise.all([loadBuildingBase(), refreshHouseholds(), refreshSidebar()]).catch(() => {});
}
function showConflictDialog(serverHousehold, localDraft) {
  const dialog = $('#conflictDialog'); const fields = Object.entries(localDraft).filter(([key, value]) => String(serverHousehold.properties[key] ?? '') !== String(value ?? ''));
  if (!fields.length) { state.selected = serverHousehold; state.dirty.clear(); clearDraft(serverHousehold.id); renderQuestionnaire(serverHousehold); renderRecord(serverHousehold); showNotice('The shared record was already updated with the same values.'); return; }
  $('#conflictError').textContent = '';
  $('#conflictFields').innerHTML = fields.map(([key, localValue]) => `<label><input type="checkbox" data-conflict-field="${escapeHtml(key)}" checked><span><b>${escapeHtml(fieldName[key] || titleCase(key))}</b><small>Server: ${displayValue(serverHousehold.properties[key])}</small><small>Mine: ${displayValue(localValue)}</small></span></label>`).join('');
  const resolve = async resolution => {
    const selectedKeys = resolution === 'keep_mine' ? fields.map(([key]) => key) : [...dialog.querySelectorAll('[data-conflict-field]:checked')].map(input => input.dataset.conflictField);
    const data = Object.fromEntries(selectedKeys.map(key => [key, localDraft[key]]));
    try {
      const result = await api(`/api/households/${encodeURIComponent(serverHousehold.id)}/resolve-conflict`, { method:'POST', body:JSON.stringify({ revision:serverHousehold.revision, resolution, data, local_data:localDraft }) });
      dialog.close(); applyConflictResult(result, resolution === 'keep_server' ? 'Kept the shared server copy.' : resolution === 'keep_mine' ? 'Saved your version after conflict review.' : `Merged ${selectedKeys.length} selected field${selectedKeys.length === 1 ? '' : 's'}.`);
    } catch (error) {
      if (error.status === 409 && error.data?.household) { showConflictDialog(error.data.household, localDraft); return; }
      $('#conflictError').textContent = errorMessage(error);
    }
  };
  $('#keepServerCopy').onclick = () => resolve('keep_server'); $('#mergeConflictCopy').onclick = () => resolve('merge'); $('#keepMyCopy').onclick = () => resolve('keep_mine');
  if (!dialog.open) dialog.showModal();
}
async function saveCurrent({ automatic = false } = {}) {
  if (!state.selected || !state.dirty.size) { showNotice('There are no changes to save.'); return; }
  if (automatic) state.autoSaveInFlight = true;
  const dataToSave = Object.fromEntries(state.dirty); const selectedId = state.selected.id; const questionnaireUi = captureQuestionnaireUi();
  const clearOnlySavedFields = () => Object.entries(dataToSave).forEach(([key, value]) => { if (String(state.dirty.get(key) ?? '') === String(value ?? '')) state.dirty.delete(key); });
  const button = $('#saveButton'); button.disabled = true; button.textContent = automatic ? 'Saving draft…' : 'Saving…';
  try { const data = await sendOrQueue({ type:'household-save', householdId:selectedId, method:'PUT', url:`/api/households/${encodeURIComponent(selectedId)}`, body:JSON.stringify({ revision: state.selected.revision, data:dataToSave }) }); if (data.queued) { state.selected.properties = { ...state.selected.properties, ...dataToSave }; clearOnlySavedFields(); saveDraft(); renderQuestionnaire(state.selected, questionnaireUi); renderRecord(state.selected); updateSaveState(); showNotice('Saved on this device. It will upload automatically when the connection returns.'); if (state.dirty.size) scheduleQuestionnaireAutoSave(); return; } state.selected = data.household; clearOnlySavedFields(); saveDraft(); showNotice(automatic ? 'Draft saved automatically. Dashboard progress is updated.' : `Saved ${data.changed.length} field${data.changed.length === 1 ? '' : 's'} successfully.`); renderQuestionnaire(state.selected, questionnaireUi); renderRecord(state.selected); renderHouseholdExports(state.selected); updateSaveState(); await Promise.all([loadBuildingBase(), refreshHouseholds(), refreshSidebar()]); if (state.dirty.size) scheduleQuestionnaireAutoSave(); }
  catch (error) { if (error.status === 409 && error.data.household) { const localDraft = Object.fromEntries(state.dirty); state.selected = error.data.household; state.dirty = new Map(Object.entries(localDraft).filter(([key, value]) => String(state.selected.properties[key] ?? '') !== String(value ?? ''))); saveDraft(); showConflictDialog(error.data.household, localDraft); } else { saveDraft(); showNotice(`${errorMessage(error)} Your entries are saved locally as a draft.`, true); } }
  finally { state.autoSaveInFlight = false; button.disabled = false; updateSaveState(); }
}
function activateTab(name) {
  state.activeDetailTab = name;
  const questionnaireTab = isQuestionnaireTab(name);
  if (questionnaireTab) { state.activeQuestionnaireTab = name; if (state.selected) renderQuestionnaire(state.selected); }
  document.querySelectorAll('.tab').forEach(tab => tab.classList.toggle('active', tab.dataset.tab === name));
  $('#questionnaireForm').hidden = !questionnaireTab; $('#recordTab').hidden = name !== 'record'; $('#photoContent').hidden = name !== 'photos'; $('#historyContent').hidden = name !== 'history'; $('#adminReviewContent').hidden = name !== 'review' || !canReview();
  if (name === 'history' && state.selected) renderHouseholdHistory(state.selected);
  rememberPortalLocation();
}
function closeMainView() { $('#mainViewPanel').hidden = true; setActiveNav('register'); }
async function showPortalView(view) {
  if (view === 'register') { closeMainView(); setPhonePanel(isDrawerLayout() ? 'register' : null); return; }
  if (view === 'users') { if (state.user.role === 'admin') { setPhonePanel(null); $('#userAdminButton').click(); } return; }
  if (view === 'download') { if (['admin', 'authority'].includes(state.user.role)) { setPhonePanel(null); $('#exportButton').click(); } return; }
  const panel = $('#mainViewPanel'); const title = $('#viewTitle'); const eyebrow = $('#viewEyebrow'); const content = $('#mainViewContent'); panel.hidden = false; setActiveNav(view); eyebrow.textContent = view === 'audit' ? 'ADMINISTRATION' : 'PORTAL VIEW';
  const viewCopy = {
    dashboard: ['Dashboard / progress overview', `<div class="view-stat-grid">${$('#metrics').innerHTML}</div><p class="view-copy">Shared progress is live. Use the Project Register to locate, select and update any mapped household.</p>`],
    assignments: ['Team Assignments', '<p class="view-copy">Bulk team assignment will be added in the next release. Current assignments are available within each household questionnaire.</p>'],
    notifications: ['Notifications', `<div class="view-feed">${state.activityMarkup || 'No recent notifications.'}</div>`],
    settings: ['Settings', '<p class="view-copy">Language: English (Telugu option planned). The portal syncs with the shared office database whenever a connection is available.</p><div class="setting-row"><span>Shared sync</span><b class="live-badge">● Live</b></div><div class="setting-row"><span>Notifications</span><b>Enabled</b></div>'],
    help: ['Help / Support', '<p class="view-copy">For access, data correction, or support, contact the MRDCL portal administrator. Select a building on the map to start a household survey.</p>']
  };
  if (view === 'audit') {
    if (state.user.role !== 'admin') { closeMainView(); return; }
    title.textContent = 'Audit Log'; content.innerHTML = '<p class="view-copy">Loading secure audit log…</p>';
    try { const result = await api('/api/audit-log'); content.innerHTML = `<div class="view-feed">${result.items.map(item => `<div class="activity-item"><b>${escapeHtml(item.username)}</b> ${escapeHtml(item.action)}<br><span>${escapeHtml(item.household_id || item.detail || '')}</span><small>${new Date(item.at).toLocaleString()}</small></div>`).join('') || 'No audit records.'}</div>`; } catch { content.innerHTML = '<p class="view-copy">Audit log is available to administrators only.</p>'; }
  } else { const [label, body] = viewCopy[view] || ['Portal view', 'This view is not available yet.']; title.textContent = label; content.innerHTML = body; }
  setPhonePanel(null);
}
function setupEvents() {
  $('#loginForm').addEventListener('submit', async event => { event.preventDefault(); $('#loginError').textContent = ''; const button = event.submitter; button.disabled = true; button.textContent = 'Signing in…'; try { const data = await api('/api/login', { method: 'POST', body: JSON.stringify({ username: $('#username').value, password: $('#password').value }) }); await startApp(data.user); } catch (error) { $('#loginError').textContent = errorMessage(error); } finally { button.disabled = false; button.innerHTML = 'Secure sign in <span>→</span>'; } });
  const signOut = async () => { await api('/api/logout', { method: 'POST' }); location.reload(); }; $('#logoutButton').addEventListener('click', signOut); $('#backToPhases').addEventListener('click', returnToPhaseMap); $('#saveButton').addEventListener('click', saveCurrent); $('#closeDetail').addEventListener('click', closeSurveyToMap); $('#backToMap').addEventListener('click', closeSurveyToMap); $('#backToToolMenu').addEventListener('click', () => showTool('menu')); $('#openTools').addEventListener('click', () => state.activeTool === 'menu' ? closeTools() : showTool('menu')); $('#brandProfileButton').addEventListener('click', () => showTool('profile')); $('#toolBackdrop').addEventListener('click', closeTools); document.querySelectorAll('.rail-button[data-tool]').forEach(button => button.addEventListener('click', () => state.activeTool === button.dataset.tool ? closeTools() : showTool(button.dataset.tool))); $('#zoomBuildings').addEventListener('click', () => { if (state.baseLayer?.getBounds().isValid()) state.map.fitBounds(state.baseLayer.getBounds(), { padding: [22, 22], maxZoom: 18 }); }); $('#locateCoordinates').addEventListener('click', () => setCoordinatePanel($('#coordinatePanel').hidden)); $('#coordinatePanel').addEventListener('submit', event => { event.preventDefault(); locateCoordinates($('#coordinateLatitude').value, $('#coordinateLongitude').value); }); $('#clearCoordinate').addEventListener('click', clearCoordinateLocation); $('#startDrawing').addEventListener('click', startDrawing); $('#undoDrawingPoint').addEventListener('click', undoDrawingPoint); $('#saveDrawnLayer').addEventListener('click', saveDrawnLayer); $('#closeDrawing').addEventListener('click', cancelDrawing); $('#drawingLayerColor').addEventListener('input', redrawDrawing); $('#drawingShapeType').addEventListener('change', () => { if (state.drawingMode) { state.drawingMode = $('#drawingShapeType').value; clearDrawingCanvas(); $('#drawingNotice').textContent = 'Shape type changed. Click the map to draw the new shape.'; } }); document.querySelectorAll('[data-header-map-action]').forEach(button => button.addEventListener('click', () => { const action = button.dataset.headerMapAction; if (action === 'area') $('#zoomBuildings').click(); if (action === 'locate') $('#locateCoordinates').click(); if (action === 'measure') $('#measureDistance').click(); })); $('#measureDistance').addEventListener('click', () => setMeasureMode(!state.measureMode)); $('#measureUnit').addEventListener('change', event => { state.measureUnit = event.target.value; redrawMeasurement(); }); $('#clearMeasure').addEventListener('click', clearMeasurement); window.addEventListener('resize', () => { if (!isDrawerLayout()) { setPhonePanel(null); $('#toolBackdrop').hidden = true; } }); document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => activateTab(tab.dataset.tab)));
  $('#clearZoneHighlight').addEventListener('click', clearMapSelection);
  $('#closeLayerProperties').addEventListener('click', closeLayerProperties); $('#saveLayerProperties').addEventListener('click', saveLayerProperties); $('#replaceLayerShape').addEventListener('click', () => { const layer = selectedCustomLayer(); closeLayerProperties(); if (layer) openDrawingPanel(layer); }); $('#openLayerAttributes').addEventListener('click', () => openAttributeTable());
  $('#closeAttributeTable').addEventListener('click', closeAttributeTable); $('#addLayerAttribute').addEventListener('click', addLayerAttribute); $('#saveLayerAttributes').addEventListener('click', saveLayerAttributes);
  document.querySelectorAll('[data-layer-context-action]').forEach(button => button.addEventListener('click', () => { const action = button.dataset.layerContextAction; if (action === 'zoom') zoomToCustomLayer(); else if (action === 'properties') openLayerProperties(); else if (action === 'attributes') openAttributeTable(); else if (action === 'geojson') { downloadLayerData(selectedCustomLayer(), 'geojson'); closeLayerContextMenu(); } else if (action === 'kml') { downloadLayerData(selectedCustomLayer(), 'kml'); closeLayerContextMenu(); } else if (action === 'cad') { const layer = selectedCustomLayer(); if (layer) window.location.assign(`/api/custom-map-layers/${layer.id}/export/cad`); closeLayerContextMenu(); } else if (action === 'remove') removeCustomLayerFromContext(); }));
  document.addEventListener('click', event => { const target = event.target; if (target instanceof Element && !target.closest('#layerContextMenu')) closeLayerContextMenu(); });
  enableFloatingPanel('#drawingPanel'); enableFloatingPanel('#layerPropertiesPanel'); enableFloatingPanel('#attributeTablePanel');
  $('#closeGuideDialog').addEventListener('click', finishPortalGuide);
  $('#guideBack').addEventListener('click', () => { if (guideStepIndex > 0) { guideStepIndex -= 1; renderGuideStep(); } });
  $('#guideNext').addEventListener('click', () => { if (guideStepIndex >= guideSteps.length - 1) finishPortalGuide(); else { guideStepIndex += 1; renderGuideStep(); } });
  document.addEventListener('click', event => { const target = event.target; if (!(target instanceof Element)) return; const button = target.closest('[data-dashboard-ghmc-zone]'); if (button) zoomDashboardGhmcZone(button.dataset.dashboardGhmcZone); });
  let timer; $('#searchInput').addEventListener('input', event => { clearTimeout(timer); timer = setTimeout(() => { state.filters.q = event.target.value.trim(); if (state.filters.q) { state.filters.status = ''; state.filters.team = ''; $('#statusFilter').value = ''; $('#teamFilter').value = ''; updateFilterChips(); } refreshHouseholds(); }, 250); }); $('#statusFilter').addEventListener('change', event => { state.filters.status = event.target.value; updateFilterChips(); refreshHouseholds(); }); $('#teamFilter').addEventListener('change', event => { state.filters.team = event.target.value; updateFilterChips(); refreshHouseholds(); }); document.querySelectorAll('#statusChips [data-status]').forEach(button => button.addEventListener('click', () => { state.filters.status = button.dataset.status; $('#statusFilter').value = state.filters.status; updateFilterChips(); refreshHouseholds(); })); document.querySelectorAll('#teamChips [data-team]').forEach(button => button.addEventListener('click', () => { state.filters.team = button.dataset.team; $('#teamFilter').value = state.filters.team; updateFilterChips(); refreshHouseholds(); })); $('#clearFilters').addEventListener('click', () => { state.filters = { q: '', status: '', team: '' }; $('#searchInput').value = ''; $('#statusFilter').value = ''; $('#teamFilter').value = ''; updateFilterChips(); refreshHouseholds(); });
  $('#editProjectTitle').addEventListener('click', () => { const current = $('#projectTitle').textContent; const next = window.prompt('Project name', current); if (next?.trim()) { $('#projectTitle').textContent = next.trim(); localStorage.setItem('mrdcl-project-name', next.trim()); } });
  $('#userAdminButton').addEventListener('click', () => showTool('users')); const closeUserDialog = () => { if ($('#userDialog').open) $('#userDialog').close(); }; $('#closeUserDialog').addEventListener('click', closeUserDialog); $('#cancelUserDialog').addEventListener('click', closeUserDialog); $('#userForm').addEventListener('submit', async event => { event.preventDefault(); const form = new FormData(event.currentTarget); try { await api('/api/users', { method: 'POST', body: JSON.stringify(Object.fromEntries(form)) }); $('#userDialog').close(); if (state.activeTool === 'assignments') { state.teamNotice = 'New user created. They are now available for team membership and individual work allocation.'; await renderToolContent('assignments'); } else if (state.activeTool === 'users') await renderToolContent('users'); } catch (error) { $('#userError').textContent = errorMessage(error); } });
  const closeQuestionDialog = () => { if ($('#questionDialog').open) $('#questionDialog').close(); };
  $('#closeQuestionDialog').addEventListener('click', closeQuestionDialog); $('#cancelQuestionDialog').addEventListener('click', closeQuestionDialog);
  $('#newQuestionType').addEventListener('change', event => { $('#questionChoicesLabel').hidden = event.target.value !== 'select'; });
  $('#newQuestionSection').addEventListener('change', event => {
    const isNewSection = event.target.value === '__new__';
    $('#newQuestionSectionNameLabel').hidden = !isNewSection;
    $('#newQuestionSectionName').required = isNewSection;
    if (!isNewSection) $('#newQuestionSectionName').value = '';
  });
  $('#questionForm').addEventListener('submit', async event => {
    event.preventDefault(); if (!isAdmin()) return;
    const button = event.submitter; button.disabled = true; $('#questionError').textContent = '';
    try {
      const form = new FormData(event.currentTarget); const options = String(form.get('choices') || '').split(/\r?\n/).map(value => value.trim()).filter(Boolean);
      const selectedSection = String(form.get('section_name') || '');
      const sectionName = (selectedSection === '__new__' ? String(form.get('new_section_name') || '') : selectedSection).trim();
      if (!sectionName) { $('#questionError').textContent = 'Select an existing section or enter a name for the new section.'; return; }
      const questionId = String(form.get('question_id') || '').trim(); const payload = { tab_id:form.get('tab_id'), section_name:sectionName, label:form.get('label'), input_type:form.get('input_type'), options };
      const questionnaireUi = captureQuestionnaireUi();
      await api(questionId ? `/api/questionnaire-schema/${encodeURIComponent(questionId)}` : '/api/questionnaire-schema', { method:questionId ? 'PUT' : 'POST', body:JSON.stringify(payload) });
      await loadQuestionnaireSchema(); closeQuestionDialog(); if (state.selected) renderQuestionnaire(state.selected, questionnaireUi);
    } catch (error) { $('#questionError').textContent = errorMessage(error); }
    finally { button.disabled = false; }
  });
  $('#exportButton').addEventListener('click', () => $('#exportDialog').showModal()); $('#closeExportDialog').addEventListener('click', () => $('#exportDialog').close()); document.querySelectorAll('[data-export]').forEach(button => button.addEventListener('click', () => { window.location.assign(`/api/exports/${button.dataset.export}`); }));
  window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); state.installPrompt = event; $('#installAppButton').hidden = false; });
  window.addEventListener('appinstalled', () => { state.installPrompt = null; $('#installAppButton').hidden = true; });
  $('#installAppButton').addEventListener('click', async () => { if (!state.installPrompt) return; state.installPrompt.prompt(); await state.installPrompt.userChoice; state.installPrompt = null; $('#installAppButton').hidden = true; });
  window.addEventListener('online', () => { state.sync.status = 'reconnecting'; updateSyncIndicator(); startRealtime(); flushOfflineQueue(); });
  window.addEventListener('offline', () => { state.sync.status = 'offline'; updateSyncIndicator(); });
  window.setInterval(updateSyncIndicator, 1000);
  let sheetStartY = null;
  $('#detailSheetHandle').addEventListener('click', () => { if (!isDrawerLayout()) return; setDetailSheet(state.detailSheet === 'half' ? 'full' : 'closed'); });
  $('#detailSheetHandle').addEventListener('pointerdown', event => { sheetStartY = event.clientY; });
  $('#detailSheetHandle').addEventListener('pointerup', event => { if (sheetStartY === null || !isDrawerLayout()) return; const travel = event.clientY - sheetStartY; sheetStartY = null; if (travel > 58) setDetailSheet('closed'); else if (travel < -58) setDetailSheet('full'); });
}
async function startApp(user) {
  state.user = user; $('#loginView').hidden = true; $('#appView').hidden = false; $('#appView').classList.remove('drawer-layout');
  $('#projectTitle').textContent = localStorage.getItem('mrdcl-project-name') || 'AS 589 households'; $('#userBadge').textContent = `${user.display_name} · ${roleLabel(user.role)}`;
  const admin = user.role === 'admin'; const office = user.role === 'authority'; $('#userAdminButton').hidden = !admin; $('#railUsers').hidden = !admin; $('#railAssignments').hidden = !(admin || office); $('#railVerify').hidden = !(admin || office);
  const canExport = ['admin', 'authority'].includes(user.role); $('#exportButton').hidden = !canExport; $('#railExports').hidden = !canExport; updateFilterChips();
  if (!state.map) initMap(); await Promise.all([loadQuestionnaireSchema(), loadMapOverlays(), loadCustomMapLayers()]); drawMusiPhaseZones();
  const resume = readPortalResume();
  if (resume?.zone === '1') {
    await openZone('1', { showMenu: Boolean(resume.tool) });
    if (resume.detailOpen && resume.householdId) await openHousehold(resume.householdId, false, resume.detailTab || resume.questionnaireTab);
    else if (resume.tool) await showTool(resume.tool);
  } else showZoneLanding();
  await refreshPendingOperations(); startRealtime(); flushOfflineQueue();
  window.setTimeout(showPortalGuideForNewUser, 250);
}
async function boot() { setupEvents(); if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js?v=99').catch(() => {}); try { const data = await api('/api/me'); await startApp(data.user); } catch { /* Sign-in view is the expected state. */ } }
boot();
