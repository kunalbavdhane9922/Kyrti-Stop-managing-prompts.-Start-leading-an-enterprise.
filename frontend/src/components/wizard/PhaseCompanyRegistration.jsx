import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { useWizard } from './WizardShell.jsx';
import { Building2, MapPin } from 'lucide-react';
import { Country, State, City } from 'country-state-city';

/* ─── Growth Stage Options ─── */
const GROWTH_STAGES = ['Idea', 'Startup', 'Growth', 'Enterprise', 'Fortune 500'];

/* ─── Company Type Options ─── */
const COMPANY_TYPES = [
  'Private Limited', 'Public Limited', 'LLP',
  'Startup', 'Government', 'NGO', 'Other',
];

/* ─── Revenue Range Options ─── */
const REVENUE_RANGES = [
  'Pre-revenue', 'Under $100K', '$100K – $1M', '$1M – $10M',
  '$10M – $50M', '$50M – $100M', '$100M – $500M', '$500M – $1B', 'Over $1B',
];

/* ─── Industry list from a comprehensive data source ─── */
const INDUSTRY_LIST = [
  'Aerospace & Defense', 'Agriculture & Farming', 'Artificial Intelligence',
  'Automotive', 'Banking & Financial Services', 'Biotechnology',
  'Blockchain & Cryptocurrency', 'Chemicals', 'Clean Energy & Renewables',
  'Cloud Computing', 'Construction & Real Estate', 'Consulting',
  'Consumer Electronics', 'Consumer Goods & FMCG', 'Cybersecurity',
  'Data Analytics & Big Data', 'E-commerce', 'Education & EdTech',
  'Energy & Utilities', 'Entertainment & Media', 'Environmental Services',
  'Fashion & Apparel', 'Fintech', 'Food & Beverage',
  'Gaming', 'Government & Public Sector', 'Healthcare & Life Sciences',
  'Hospitality & Tourism', 'Human Resources & Staffing', 'Industrial Manufacturing',
  'Information Technology', 'Insurance', 'Internet of Things (IoT)',
  'Legal Services', 'Logistics & Supply Chain', 'Machine Learning',
  'Marine & Maritime', 'Marketing & Advertising', 'Media & Publishing',
  'Medical Devices', 'Mining & Metals', 'Nanotechnology',
  'Non-Profit & Social Enterprise', 'Oil & Gas', 'Pharmaceuticals',
  'Professional Services', 'Quantum Computing', 'Retail',
  'Robotics & Automation', 'SaaS (Software as a Service)', 'Semiconductors',
  'Space Technology', 'Sports & Fitness', 'Telecommunications',
  'Transportation', 'Travel & Aviation', 'Venture Capital & Private Equity',
  'Virtual Reality & Augmented Reality', 'Waste Management & Recycling',
  'Web3 & Decentralized Apps',
];

export function PhaseCompanyRegistration() {
  const { wizardData, updateCompanyField, registerValidator } = useWizard();
  const c = wizardData.company;

  const [industrySearch, setIndustrySearch] = useState(c.industry || '');
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState(c.hqCountry || '');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [stateSearch, setStateSearch] = useState(c.hqState || '');
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState(c.hqCity || '');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Sync local search state with loaded draft data
  const draftSyncedRef = React.useRef(false);
  useEffect(() => {
    if (!draftSyncedRef.current && (c.industry || c.hqCountry || c.hqState || c.hqCity)) {
      if (c.industry) setIndustrySearch(c.industry);
      if (c.hqCountry) setCountrySearch(c.hqCountry);
      if (c.hqState) setStateSearch(c.hqState);
      if (c.hqCity) setCitySearch(c.hqCity);
      draftSyncedRef.current = true;
    }
  }, [c.industry, c.hqCountry, c.hqState, c.hqCity]);

  // Country data
  const countries = useMemo(() => Country.getAllCountries(), []);
  const filteredCountries = useMemo(() => {
    if (!countrySearch) return countries;
    const q = countrySearch.toLowerCase();
    return countries.filter(
      c => c.name.toLowerCase().includes(q) || c.isoCode.toLowerCase().includes(q)
    );
  }, [countrySearch, countries]);

  // Find selected country object
  const selectedCountry = useMemo(
    () => countries.find(ct => ct.name === c.hqCountry),
    [c.hqCountry, countries]
  );

  // State data
  const states = useMemo(
    () => (selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : []),
    [selectedCountry]
  );
  const filteredStates = useMemo(() => {
    if (!stateSearch) return states;
    return states.filter(s => s.name.toLowerCase().includes(stateSearch.toLowerCase()));
  }, [stateSearch, states]);

  // Find selected state object
  const selectedState = useMemo(
    () => states.find(s => s.name === c.hqState),
    [c.hqState, states]
  );

  // City data
  const cities = useMemo(
    () => (selectedCountry && selectedState
      ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
      : []),
    [selectedCountry, selectedState]
  );
  const filteredCities = useMemo(() => {
    if (!citySearch) return cities;
    return cities.filter(ci => ci.name.toLowerCase().includes(citySearch.toLowerCase()));
  }, [citySearch, cities]);

  // Industry filtering
  const filteredIndustries = useMemo(() => {
    if (!industrySearch) return INDUSTRY_LIST;
    return INDUSTRY_LIST.filter(i => i.toLowerCase().includes(industrySearch.toLowerCase()));
  }, [industrySearch]);

  // Validation
  useEffect(() => {
    registerValidator(1, () => {
      if (!c.name.trim()) return 'Company Name is required';
      if (!c.legalName.trim()) return 'Legal Company Name is required';
      if (!c.domain.trim()) return 'Company Domain is required';
      if (!c.industry.trim()) return 'Industry is required';
      if (!c.companyType.trim()) return 'Company Type is required';
      if (!c.hqCountry.trim()) return 'Headquarters Country is required';
      if (!c.hqState.trim()) return 'Headquarters State is required';
      if (!c.hqCity.trim()) return 'Headquarters City is required';
      if (!c.employeeCount || parseInt(c.employeeCount, 10) <= 0) return 'Current Employee Count must be a positive number';
      if (!c.growthStage) return 'Growth Stage is required';
      return null;
    });
  }, [registerValidator, c]);

  const renderAutocomplete = (label, search, setSearch, showDropdown, setShowDropdown, items, onSelect, onChangeText, valueProp = 'name', required = true, placeholder = 'Type to search...') => (
    <div className="wiz-field">
      <label className="wiz-label">
        {label} {!required && <span className="wiz-optional">(Optional)</span>}
      </label>
      <div className="wiz-autocomplete-wrap">
        <input
          className="wiz-input"
          value={search}
          placeholder={placeholder}
          onChange={e => {
            setSearch(e.target.value);
            if (onChangeText) onChangeText(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
        {showDropdown && items.length > 0 && (
          <div className="wiz-dropdown">
            {items.slice(0, 80).map((item, i) => (
              <div
                key={typeof item === 'string' ? item : item[valueProp] + i}
                className="wiz-dropdown-item"
                onMouseDown={(e) => { e.preventDefault(); onSelect(item); setShowDropdown(false); }}
              >
                {typeof item === 'string' ? item : item[valueProp]}
              </div>
            ))}
          </div>
        )}
        {showDropdown && items.length === 0 && search && (
          <div className="wiz-dropdown">
            <div className="wiz-dropdown-item wiz-dropdown-empty">
              No results — type manually
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="wiz-phase">
      <div className="wiz-phase-header">
        <Building2 size={24} className="wiz-phase-icon" />
        <div>
          <h2 className="wiz-phase-title">Company Registration</h2>
          <p className="wiz-phase-desc">Enter your company's basic legal information.</p>
        </div>
      </div>

      {/* Company Details */}
      <div className="wiz-section">
        <h3 className="wiz-section-title">Company Details</h3>
        <div className="wiz-grid-2">
          <div className="wiz-field">
            <label className="wiz-label">Company Name</label>
            <input className="wiz-input" value={c.name} placeholder="e.g. Acme Corporation"
              onChange={e => updateCompanyField('name', e.target.value)} autoFocus />
          </div>
          <div className="wiz-field">
            <label className="wiz-label">Legal Company Name</label>
            <input className="wiz-input" value={c.legalName} placeholder="e.g. Acme Corporation Pvt. Ltd."
              onChange={e => updateCompanyField('legalName', e.target.value)} />
          </div>
        </div>

        <div className="wiz-grid-2">
          <div className="wiz-field">
            <label className="wiz-label">Company Domain</label>
            <input className="wiz-input" value={c.domain} placeholder="e.g. acme.com"
              onChange={e => updateCompanyField('domain', e.target.value)} />
          </div>
        </div>

        <div className="wiz-grid-2">
          {/* Industry autocomplete */}
          {renderAutocomplete(
            'Industry', industrySearch, setIndustrySearch, showIndustryDropdown, setShowIndustryDropdown,
            filteredIndustries,
            (val) => { setIndustrySearch(val); updateCompanyField('industry', val); },
            (text) => updateCompanyField('industry', text),
            'name', true, 'Search industry...'
          )}

          {/* Company Type */}
          <div className="wiz-field">
            <label className="wiz-label">Company Type</label>
            <div className="wiz-radio-group">
              {COMPANY_TYPES.map(type => (
                <label key={type} className={`wiz-radio-option ${c.companyType === type ? 'wiz-radio-option--selected' : ''}`}>
                  <input type="radio" name="companyType" value={type} checked={c.companyType === type}
                    onChange={() => updateCompanyField('companyType', type)} />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Company Identity */}
      <div className="wiz-section">
        <h3 className="wiz-section-title">Company Identity</h3>
        <div className="wiz-grid-2">
          <div className="wiz-field">
            <label className="wiz-label">Registration Number <span className="wiz-optional">(Optional)</span></label>
            <input className="wiz-input" value={c.registrationNumber} placeholder="CIN / Registration No."
              onChange={e => updateCompanyField('registrationNumber', e.target.value)} />
          </div>
          <div className="wiz-field">
            <label className="wiz-label">Tax Number <span className="wiz-optional">(Optional)</span></label>
            <input className="wiz-input" value={c.taxNumber} placeholder="GST / VAT / EIN"
              onChange={e => updateCompanyField('taxNumber', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Headquarters */}
      <div className="wiz-section">
        <h3 className="wiz-section-title"><MapPin size={16} style={{ marginRight: 6 }} />Headquarters</h3>
        <div className="wiz-grid-2">
          {renderAutocomplete(
            'Country', countrySearch, setCountrySearch, showCountryDropdown, setShowCountryDropdown,
            filteredCountries,
            (ct) => {
              setCountrySearch(ct.name);
              updateCompanyField('hqCountry', ct.name);
              updateCompanyField('hqState', '');
              updateCompanyField('hqCity', '');
              setStateSearch('');
              setCitySearch('');
            },
            (text) => updateCompanyField('hqCountry', text),
            'name', true, 'Search country...'
          )}
          {renderAutocomplete(
            'State / Province', stateSearch, setStateSearch, showStateDropdown, setShowStateDropdown,
            filteredStates.length > 0 ? filteredStates : (stateSearch ? [{ name: stateSearch }] : []),
            (s) => {
              setStateSearch(s.name);
              updateCompanyField('hqState', s.name);
              updateCompanyField('hqCity', '');
              setCitySearch('');
            },
            (text) => updateCompanyField('hqState', text),
            'name', true, selectedCountry ? 'Search state...' : 'Select country first'
          )}
        </div>
        <div className="wiz-grid-2">
          {renderAutocomplete(
            'City', citySearch, setCitySearch, showCityDropdown, setShowCityDropdown,
            filteredCities.length > 0 ? filteredCities : (citySearch ? [{ name: citySearch }] : []),
            (ci) => { setCitySearch(ci.name); updateCompanyField('hqCity', ci.name); },
            (text) => updateCompanyField('hqCity', text),
            'name', true, selectedState ? 'Search city...' : 'Select state first'
          )}
          <div className="wiz-field">
            <label className="wiz-label">Exact Address <span className="wiz-optional">(Optional)</span></label>
            <input className="wiz-input" value={c.hqAddress} placeholder="Street address, building, floor"
              onChange={e => updateCompanyField('hqAddress', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Company Scale */}
      <div className="wiz-section">
        <h3 className="wiz-section-title">Company Scale</h3>
        <div className="wiz-grid-2">
          <div className="wiz-field">
            <label className="wiz-label">Current Employee Count</label>
            <input className="wiz-input" type="number" min="1" value={c.employeeCount} placeholder="e.g. 50"
              onChange={e => updateCompanyField('employeeCount', e.target.value)} />
          </div>
          <div className="wiz-field">
            <label className="wiz-label">Annual Revenue Range <span className="wiz-optional">(Optional)</span></label>
            <select className="wiz-select" value={c.revenueRange} onChange={e => updateCompanyField('revenueRange', e.target.value)}>
              <option value="">Select range</option>
              {REVENUE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div className="wiz-field">
          <label className="wiz-label">Growth Stage</label>
          <div className="wiz-radio-group wiz-radio-group--horizontal">
            {GROWTH_STAGES.map(stage => (
              <label key={stage} className={`wiz-radio-pill ${c.growthStage === stage ? 'wiz-radio-pill--selected' : ''}`}>
                <input type="radio" name="growthStage" value={stage} checked={c.growthStage === stage}
                  onChange={() => updateCompanyField('growthStage', stage)} />
                <span>{stage}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
