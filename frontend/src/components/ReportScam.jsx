import React, { useState } from 'react';

export default function ReportScam() {
  const [formData, setFormData] = useState({
    scamType: '',
    target: '',
    incidentDate: '',
    description: '',
    consent: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.scamType) newErrors.scamType = 'Please select a scam category';
    if (!formData.target.trim()) {
      newErrors.target = 'Please specify the suspect phone number, website link, or email';
    }
    if (!formData.incidentDate) newErrors.incidentDate = 'Please select the approximate incident date';
    if (formData.description.trim().length < 10) {
      newErrors.description = 'Please provide a detailed description (at least 10 characters)';
    }
    if (!formData.consent) newErrors.consent = 'You must agree to share this threat data with the community';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedData({
        reportId: `SS-${Math.floor(100000 + Math.random() * 900000)}`,
        ...formData
      });
      setFormData({
        scamType: '',
        target: '',
        incidentDate: '',
        description: '',
        consent: false
      });
    }, 1200);
  };

  if (submittedData) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm text-center flex flex-col items-center gap-5 animate-fade-in">
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 w-16 h-16 rounded-full flex items-center justify-center filter drop-shadow-[0_4px_8px_rgba(16,185,129,0.15)]">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Scam Reported Successfully</h1>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm text-sm sm:text-base">
          Thank you! Your report has been added to our pending review database. Our community shield benefits directly from your contribution.
        </p>

        <div className="w-full border-y border-zinc-100 dark:border-zinc-800 py-5 my-2 flex flex-col gap-3.5 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">Report Reference ID:</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold font-mono">{submittedData.reportId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">Scam Category:</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{submittedData.scamType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">Suspected Target:</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{submittedData.target}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">Incident Date:</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{submittedData.incidentDate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">Status:</span>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">PENDING AI AUDIT</span>
          </div>
        </div>

        <button className="bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-medium px-6 py-2.5 rounded-xl transition-all cursor-pointer select-none text-sm font-sans" onClick={() => setSubmittedData(null)}>
          Report Another Threat
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">Submit a Scam Report</h1>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm sm:text-base max-w-lg mx-auto">
          Help protect the community. If you encountered a suspicious phone call, text, website, or email, report it here.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="scamType" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Scam Category</label>
            <select
              id="scamType"
              name="scamType"
              value={formData.scamType}
              onChange={handleChange}
              className={`w-full bg-zinc-50 dark:bg-zinc-950 border rounded-xl px-4 py-3 outline-none text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                errors.scamType ? 'border-red-400 dark:border-red-600' : 'border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <option value="">-- Select a Category --</option>
              <option value="Phishing Link">Phishing Link / Website</option>
              <option value="Robocall / Phone Scam">Robocall / Phone Impersonation</option>
              <option value="SMS Smishing">SMS / Text Message Phishing</option>
              <option value="Crypto Fraud">Cryptocurrency / Investment Scam</option>
              <option value="Impersonation Email">Email Spoofing / Business Impersonation</option>
              <option value="Other">Other Cyber Threat</option>
            </select>
            {errors.scamType && <span className="text-xs text-red-500 dark:text-red-400 font-medium mt-1">{errors.scamType}</span>}
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="target" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Suspected Contact / Source (Phone, Link, Email)</label>
            <input
              type="text"
              id="target"
              name="target"
              value={formData.target}
              onChange={handleChange}
              placeholder="e.g. +1-800-000-0000 or suspect-site.net"
              className={`w-full bg-zinc-50 dark:bg-zinc-950 border rounded-xl px-4 py-3 outline-none text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                errors.target ? 'border-red-400 dark:border-red-600' : 'border-zinc-200 dark:border-zinc-800'
              }`}
            />
            {errors.target && <span className="text-xs text-red-500 dark:text-red-400 font-medium mt-1">{errors.target}</span>}
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="incidentDate" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Incident Date</label>
            <input
              type="date"
              id="incidentDate"
              name="incidentDate"
              value={formData.incidentDate}
              onChange={handleChange}
              className={`w-full bg-zinc-50 dark:bg-zinc-950 border rounded-xl px-4 py-3 outline-none text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                errors.incidentDate ? 'border-red-400 dark:border-red-600' : 'border-zinc-200 dark:border-zinc-800'
              }`}
            />
            {errors.incidentDate && <span className="text-xs text-red-500 dark:text-red-400 font-medium mt-1">{errors.incidentDate}</span>}
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="description" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Threat Details & Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Provide context. What did the message say? What did they request? (e.g. they asked for Gift Cards, impersonated Bank support, etc.)"
              className={`w-full bg-zinc-50 dark:bg-zinc-950 border rounded-xl px-4 py-3 outline-none text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                errors.description ? 'border-red-400 dark:border-red-600' : 'border-zinc-200 dark:border-zinc-800'
              }`}
            />
            {errors.description && <span className="text-xs text-red-500 dark:text-red-400 font-medium mt-1">{errors.description}</span>}
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                className="w-4 h-4 rounded mt-0.5 accent-indigo-650 shrink-0"
              />
              <span className="text-xs sm:text-sm text-zinc-555 dark:text-zinc-400 select-none leading-relaxed">
                I consent to publishing this data to the ScamShield threat feed to alert other users.
              </span>
            </label>
            {errors.consent && <span className="text-xs text-red-500 dark:text-red-400 font-medium mt-1 block">{errors.consent}</span>}
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] hover:shadow-lg hover:shadow-indigo-500/15 text-white font-semibold py-3.5 rounded-xl transition-all cursor-pointer select-none text-sm sm:text-base mt-2 font-sans" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting Threat Report...' : 'Submit Threat Report'}
          </button>
        </form>
      </div>
    </div>
  );
}

