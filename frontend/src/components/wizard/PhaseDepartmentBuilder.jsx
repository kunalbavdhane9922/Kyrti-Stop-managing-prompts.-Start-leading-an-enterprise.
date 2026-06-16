import React, { useEffect, useState } from 'react';
import { useWizard } from './WizardShell.jsx';
import { FolderTree, Plus, X } from 'lucide-react';

const PRESET_DEPARTMENTS = [
  { name: 'Engineering', description: 'Software development, architecture, and technical operations' },
  { name: 'Product', description: 'Product management, strategy, and roadmap' },
  { name: 'Marketing', description: 'Brand management, campaigns, and growth' },
  { name: 'Sales', description: 'Revenue generation, business development, and partnerships' },
  { name: 'Human Resources', description: 'People operations, talent, and culture' },
  { name: 'Finance', description: 'Accounting, budgeting, and financial planning' },
  { name: 'Legal', description: 'Legal compliance, contracts, and regulatory affairs' },
  { name: 'Operations', description: 'Business operations, process optimization, and logistics' },
  { name: 'Customer Support', description: 'Customer service, success, and experience' },
  { name: 'Security', description: 'Information security, compliance, and risk management' },
  { name: 'Data Science', description: 'Data analysis, ML/AI research, and business intelligence' },
  { name: 'Research', description: 'R&D, innovation, and emerging technologies' },
  { name: 'Procurement', description: 'Vendor management, purchasing, and supply sourcing' },
  { name: 'Manufacturing', description: 'Production, quality control, and plant operations' },
  { name: 'Logistics', description: 'Warehousing, distribution, and transportation' },
];

export function PhaseDepartmentBuilder() {
  const { wizardData, updateData, registerValidator } = useWizard();
  const departments = wizardData.departments;
  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');

  useEffect(() => {
    registerValidator(4, () => {
      if (departments.length === 0) return 'Select or create at least one department';
      return null;
    });
  }, [registerValidator, departments]);

  const isSelected = (name) => departments.some(d => d.name === name);

  const togglePreset = (preset) => {
    if (isSelected(preset.name)) {
      updateData('departments', departments.filter(d => d.name !== preset.name));
    } else {
      updateData('departments', [...departments, {
        tempId: crypto.randomUUID(),
        name: preset.name,
        description: preset.description,
        isCustom: false,
      }]);
    }
  };

  const addCustom = () => {
    if (!customName.trim()) return;
    if (isSelected(customName.trim())) return;
    updateData('departments', [...departments, {
      tempId: crypto.randomUUID(),
      name: customName.trim(),
      description: customDesc.trim(),
      isCustom: true,
    }]);
    setCustomName('');
    setCustomDesc('');
  };

  const removeDept = (name) => {
    updateData('departments', departments.filter(d => d.name !== name));
  };

  return (
    <div className="wiz-phase">
      <div className="wiz-phase-header">
        <FolderTree size={24} className="wiz-phase-icon" />
        <div>
          <h2 className="wiz-phase-title">Department Builder</h2>
          <p className="wiz-phase-desc">
            Select the departments your company needs. You can also add custom departments. All selections are editable after launch.
          </p>
        </div>
      </div>

      {/* Preset Departments */}
      <div className="wiz-section">
        <h3 className="wiz-section-title">Available Departments</h3>
        <div className="wiz-dept-grid">
          {PRESET_DEPARTMENTS.map(dept => (
            <label
              key={dept.name}
              className={`wiz-dept-card ${isSelected(dept.name) ? 'wiz-dept-card--selected' : ''}`}
            >
              <input type="checkbox" checked={isSelected(dept.name)}
                onChange={() => togglePreset(dept)} />
              <div className="wiz-dept-card-content">
                <span className="wiz-dept-card-name">{dept.name}</span>
                <span className="wiz-dept-card-desc">{dept.description}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Custom Department */}
      <div className="wiz-section">
        <h3 className="wiz-section-title">Add Custom Department</h3>
        <div className="wiz-grid-2" style={{ alignItems: 'flex-end' }}>
          <div className="wiz-field">
            <label className="wiz-label">Department Name</label>
            <input className="wiz-input" value={customName} placeholder="e.g. AI Research Lab"
              onChange={e => setCustomName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } }} />
          </div>
          <div className="wiz-field">
            <label className="wiz-label">Description <span className="wiz-optional">(Optional)</span></label>
            <input className="wiz-input" value={customDesc} placeholder="Brief description"
              onChange={e => setCustomDesc(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } }} />
          </div>
        </div>
        <button className="wiz-btn wiz-btn--add" style={{ marginTop: 8 }} onClick={addCustom} disabled={!customName.trim()}>
          <Plus size={16} /> Add Department
        </button>
      </div>

      {/* Selected Summary */}
      {departments.length > 0 && (
        <div className="wiz-section">
          <h3 className="wiz-section-title">Selected Departments ({departments.length})</h3>
          <div className="wiz-tags">
            {departments.map(d => (
              <div key={d.name} className={`wiz-tag ${d.isCustom ? 'wiz-tag--custom' : ''}`}>
                <span>{d.name}</span>
                <button className="wiz-tag-remove" onClick={() => removeDept(d.name)}>
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
