import React, { useState } from 'react';
import DisasterFormSteps from '../components/DisasterFormSteps';

export default function DisasterReportPage() {
  const [formData, setFormData] = useState({
    crisisType: '',
    description: '',
    division: '',
    district: '',
    subdistrict: '',
    manualAddress: '',
  });

  const [detectingLocation, setDetectingLocation] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setFeedback({ type: 'error', message: 'Geolocation is not supported.' });
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDetectingLocation(false);
        setFeedback({ type: 'success', message: 'Location detected successfully!' });
      },
      () => {
        setDetectingLocation(false);
        setFeedback({ type: 'error', message: 'Unable to retrieve location.' });
      }
    );
  };

  const handleLocationChange = (loc) => {
    setFormData((prev) => ({
      ...prev,
      division: loc?.division || prev.division,
      district: loc?.district || prev.district,
      subdistrict: loc?.upazila || prev.subdistrict,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.crisisType) {
      setFeedback({ type: 'error', message: 'Please select a Crisis Type.' });
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFeedback({ type: 'success', message: 'Report submitted successfully!' });
        // Reset form fields upon success
        setFormData({
          crisisType: '',
          description: '',
          division: '',
          district: '',
          subdistrict: '',
          manualAddress: '',
        });
      } else {
        setFeedback({ type: 'error', message: 'Server returned error.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Cannot connect to backend server on port 8000.' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-2xl my-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Report a Disaster</h1>

      <form onSubmit={handleSubmit}>
        <DisasterFormSteps
          formData={formData}
          setFormData={setFormData}
          detectingLocation={detectingLocation}
          handleUseLocation={handleUseLocation}
          handleLocationChange={handleLocationChange}
          feedback={feedback}
          setFeedback={setFeedback}
        />

        {feedback.message && (
          <div
            className={`p-3 text-sm rounded-lg my-4 ${
              feedback.type === 'error'
                ? 'bg-red-50 text-red-600 border border-red-200'
                : 'bg-green-50 text-green-600 border border-green-200'
            }`}
          >
            {feedback.message}
          </div>
        )}

        <button
          type="submit"
          className="w-full mt-6 py-3 bg-[#00b4d8] text-white font-bold rounded-lg hover:bg-[#0096c7] transition cursor-pointer"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
}