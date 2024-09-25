import React, { useState } from 'react';
import './SchemaPopup.css'; 

const schemaOptions = [
  { label: 'First Name', value: 'first_name' },
  { label: 'Last Name', value: 'last_name' },
  { label: 'Gender', value: 'gender' },
  { label: 'Age', value: 'age' },
  { label: 'Account Name', value: 'account_name' },
  { label: 'City', value: 'city' },
  { label: 'State', value: 'state' }
];

function SchemaPopup({ closePopup }) {
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [currentSchema, setCurrentSchema] = useState('');
  const [availableSchemas, setAvailableSchemas] = useState(schemaOptions);

  const handleAddSchema = () => {
    if (currentSchema) {
      const selectedOption = availableSchemas.find(opt => opt.value === currentSchema);
      setSelectedSchemas([...selectedSchemas, selectedOption]);
      setAvailableSchemas(availableSchemas.filter(opt => opt.value !== currentSchema));
      setCurrentSchema('');
    }
  };

  const handleSchemaChange = (index, newValue) => {
    const newSelectedSchemas = [...selectedSchemas];
    const updatedSchema = availableSchemas.find(opt => opt.value === newValue);

    if (updatedSchema) {
      newSelectedSchemas[index] = updatedSchema;
      setSelectedSchemas(newSelectedSchemas);
      setAvailableSchemas(
        schemaOptions.filter(opt => !newSelectedSchemas.some(selected => selected.value === opt.value))
      );
    }
  };

  const handleSaveSegment = () => {
 
    if (!segmentName.trim()) {
      alert('Segment name is required.');
      return;
    }

    if (selectedSchemas.length === 0) {
      alert('Please select at least one schema.');
      return;
    }

    const segmentData = {
      segment_name: segmentName,
      schema: selectedSchemas.map(s => ({ [s.value]: s.label }))
    };

    fetch('https://webhook.site/145f6e07-2d3c-446a-978d-bf01943f3d2b', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(segmentData),
      mode: 'no-cors'
    })
    .then(response => {
      console.log('Segment sent successfully', response);
      closePopup();
    })
    .catch(error => {
      console.error('Error saving segment:', error);
    });
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h3>Saving Segment</h3>
        <div className="form-field">
          <label>Enter the Name of the Segment</label>
          <input 
            type="text" 
            placeholder="Name of the segment" 
            value={segmentName} 
            onChange={(e) => setSegmentName(e.target.value)} 
          />
        </div>
        <div className="form-field">
          <label>Add schema to segment</label>
          <select value={currentSchema} onChange={(e) => setCurrentSchema(e.target.value)}>
            <option value="">Select schema</option>
            {availableSchemas.map((schema, index) => (
              <option key={index} value={schema.value}>{schema.label}</option>
            ))}
          </select>
          <a href="#" className="add-new-schema" onClick={handleAddSchema}>+ Add new schema</a>
        </div>
        <div className="selected-schemas blue-box">
          {selectedSchemas.map((schema, index) => (
            <div key={index} className="schema-item">
              <select
                value={schema.value}
                onChange={(e) => handleSchemaChange(index, e.target.value)}
              >
                <option value="">Change schema</option>
                {schemaOptions
                  .filter(opt => !selectedSchemas.some(selected => selected.value === opt.value) || opt.value === schema.value)
                  .map((opt, optIndex) => (
                    <option key={optIndex} value={opt.value}>{opt.label}</option>
                  ))}
              </select>
            </div>
          ))}
        </div>
        <div className="button-group">
          <button className="save-btn" onClick={handleSaveSegment}>Save the Segment</button>
          <button className="cancel-btn" onClick={closePopup}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default SchemaPopup;
