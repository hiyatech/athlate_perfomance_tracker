import React, { useState, useEffect, useContext } from 'react';
import Card from '../../components/Card';
import ChipSelector from '../../components/ChipSelector';
import { profileApi } from '../../api/profileApi';
import { AuthContext } from '../../context/AuthContext';
import { User, Save, Camera, Phone, ShieldAlert, Dumbbell } from 'lucide-react';

export default function ProfilePage() {
  const { user: authUser, updateUser } = useContext(AuthContext);

  // Personal Info Section
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [contactNumber, setContactNumber] = useState('');
  const [location, setLocation] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [photoUrl, setPhotoUrl] = useState('');
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);

  // Emergency Contact Section
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactNumber, setEmergencyContactNumber] = useState('');

  // Training Background Section
  const [medicalConditions, setMedicalConditions] = useState('');
  const [occupation, setOccupation] = useState('Student');
  const [trainingLocation, setTrainingLocation] = useState('Gym');
  const [yearsExperience, setYearsExperience] = useState(1);
  const [bio, setBio] = useState('');
  const [followsDiet, setFollowsDiet] = useState(false);
  const [dietType, setDietType] = useState('High Protein');
  const [injuryTags, setInjuryTags] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const genderOptions = ['Male', 'Female', 'Other'];
  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const occupationOptions = ['Student', 'Employed', 'Self-Employed', 'Athlete'];
  const trainingLocationOptions = ['Home', 'Gym', 'Outdoor', 'Sports Academy'];
  const dietTypeOptions = ['High Protein', 'Vegetarian', 'Vegan', 'Keto', 'Balanced'];
  const availableInjuryOptions = ['Knee Pain', 'Hamstring Strain', 'Ankle Sprain', 'Lower Back Pain', 'Shoulder Impingement', 'Wrist Pain'];

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await profileApi.getProfile();
        if (data) {
          setName(data.name || '');
          setEmail(data.email || '');
          setDob(data.dob || '');
          setGender(data.gender || 'Male');
          setContactNumber(data.contactNumber || '');
          setLocation(data.location || '');
          setBloodGroup(data.bloodGroup || 'O+');
          setPhotoUrl(data.photoUrl || '');
          setHeight(data.height || 170);
          setWeight(data.weight || 70);

          setEmergencyContactName(data.emergencyContactName || '');
          setEmergencyContactNumber(data.emergencyContactNumber || '');

          setMedicalConditions(data.medicalConditions || '');
          setOccupation(data.occupation || 'Student');
          setTrainingLocation(data.trainingLocation || 'Gym');
          setYearsExperience(data.yearsExperience || 1);
          setBio(data.bio || '');
          setFollowsDiet(data.followsDiet || false);
          setDietType(data.dietType || 'High Protein');
          setInjuryTags(data.injuryTags || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleToggleInjury = (tag) => {
    if (injuryTags.includes(tag)) {
      setInjuryTags(injuryTags.filter(t => t !== tag));
    } else {
      setInjuryTags([...injuryTags, tag]);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const updated = await profileApi.updateProfile({
        name,
        photoUrl,
        dob,
        gender,
        contactNumber,
        location,
        bloodGroup,
        height: Number(height),
        weight: Number(weight),
        emergencyContactName,
        emergencyContactNumber,
        medicalConditions,
        occupation,
        trainingLocation,
        yearsExperience: Number(yearsExperience),
        bio,
        followsDiet,
        dietType,
        injuryTags
      });
      updateUser(updated.user || updated);
      setMsg('Profile updated successfully!');
    } catch (err) {
      setMsg('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-brand-muted text-sm font-medium">Loading athlete profile...</div>;

  return (
    <div className="p-8 max-w-4xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-brand-border">
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">Athlete Profile</h1>
          <p className="text-xs text-brand-muted mt-0.5">Manage personal information, emergency contact, and training background.</p>
        </div>
      </div>

      {msg && (
        <div className="bg-brand-accent-light text-brand-accent font-semibold p-3.5 rounded-xl text-xs border border-brand-accent/20 flex items-center justify-between">
          <span>{msg}</span>
          <button onClick={() => setMsg('')} className="font-bold text-brand-accent hover:opacity-80">✕</button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. PERSONAL INFO SECTION */}
        <Card title="1. Personal Info" subtitle="Identity details, contact info, and physical parameters.">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 mb-4 border-b border-stone-100">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-brand-accent-light text-brand-accent font-bold flex items-center justify-center text-2xl border-2 border-brand-accent overflow-hidden shadow-sm">
                {photoUrl ? (
                  <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{name ? name.charAt(0).toUpperCase() : 'A'}</span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-brand-accent text-white p-1.5 rounded-full cursor-pointer shadow-md hover:bg-brand-accent-hover transition-colors">
                <Camera size={14} />
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>

            <div className="space-y-1 flex-1 text-center sm:text-left">
              <h3 className="font-bold text-base text-brand-charcoal">{name || 'Athlete Name'}</h3>
              <p className="text-xs text-brand-muted">{email} | {location || 'City, Country'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-brand-charcoal block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-brand-border rounded-xl font-semibold text-xs text-brand-charcoal"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-brand-charcoal block mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-brand-border rounded-xl font-semibold text-xs text-brand-charcoal"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-brand-charcoal block mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-brand-border rounded-xl font-semibold text-xs text-brand-charcoal"
              >
                {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-brand-charcoal block mb-1">Contact Number</label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+1 234 567 890"
                className="w-full px-3 py-2 bg-stone-50 border border-brand-border rounded-xl font-semibold text-xs text-brand-charcoal"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-brand-charcoal block mb-1">Email (Account)</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3 py-2 bg-stone-200/60 border border-brand-border rounded-xl font-semibold text-xs text-stone-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-brand-charcoal block mb-1">Location / City</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mumbai, India"
                className="w-full px-3 py-2 bg-stone-50 border border-brand-border rounded-xl font-semibold text-xs text-brand-charcoal"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-brand-charcoal block mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-brand-border rounded-xl font-semibold text-xs text-brand-charcoal"
              >
                {bloodGroupOptions.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-brand-charcoal block mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-brand-border rounded-xl font-semibold text-xs text-brand-charcoal"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-brand-charcoal block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-brand-border rounded-xl font-semibold text-xs text-brand-charcoal"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* 2. EMERGENCY CONTACT SECTION */}
        <Card title="2. Emergency Contact" subtitle="Contact person in case of physical injury or emergency.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-brand-charcoal block mb-1">Emergency Contact Name</label>
              <input
                type="text"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                placeholder="Parent / Coach / Partner Name"
                className="w-full px-3 py-2 bg-stone-50 border border-brand-border rounded-xl font-semibold text-xs text-brand-charcoal"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-brand-charcoal block mb-1">Emergency Contact Number</label>
              <input
                type="tel"
                value={emergencyContactNumber}
                onChange={(e) => setEmergencyContactNumber(e.target.value)}
                placeholder="+1 987 654 321"
                className="w-full px-3 py-2 bg-stone-50 border border-brand-border rounded-xl font-semibold text-xs text-brand-charcoal"
              />
            </div>
          </div>
        </Card>

        {/* 3. TRAINING BACKGROUND SECTION */}
        <Card title="3. Training Background & Health" subtitle="Medical conditions, occupation, environment, and diet preference.">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-brand-charcoal block mb-1">Medical Conditions or Allergies (Optional)</label>
              <textarea
                value={medicalConditions}
                onChange={(e) => setMedicalConditions(e.target.value)}
                placeholder="List any medical history, asthma, allergies, or physical considerations..."
                className="w-full px-3 py-2 bg-stone-50 border border-brand-border rounded-xl text-xs text-brand-charcoal"
                rows="2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-brand-charcoal block mb-1">Occupation Status</label>
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-brand-border rounded-xl font-semibold text-xs text-brand-charcoal"
                >
                  {occupationOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-brand-charcoal block mb-1">Training Location Environment</label>
                <select
                  value={trainingLocation}
                  onChange={(e) => setTrainingLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-brand-border rounded-xl font-semibold text-xs text-brand-charcoal"
                >
                  {trainingLocationOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-brand-charcoal block mb-1">Years of Athletic Experience</label>
                <input
                  type="number"
                  min="0"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-brand-border rounded-xl font-semibold text-xs text-brand-charcoal"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-brand-charcoal block mb-1">Short Bio / About (Optional)</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about your athletic journey..."
                className="w-full px-3 py-2 bg-stone-50 border border-brand-border rounded-xl text-xs text-brand-charcoal"
                rows="2"
              />
            </div>

            {/* Diet Preference Toggle */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-brand-charcoal">Follow Specific Diet Preference?</label>
                  <p className="text-[11px] text-brand-muted">Indicate if you follow a structured nutrition strategy.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFollowsDiet(!followsDiet)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    followsDiet
                      ? 'bg-brand-accent text-white border-brand-accent'
                      : 'bg-white text-stone-600 border-brand-border'
                  }`}
                >
                  {followsDiet ? 'Yes' : 'No'}
                </button>
              </div>

              {followsDiet && (
                <div>
                  <label className="text-xs font-semibold text-brand-charcoal block mb-1">Diet Type Preference</label>
                  <select
                    value={dietType}
                    onChange={(e) => setDietType(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-brand-border rounded-xl font-semibold text-xs text-brand-charcoal"
                  >
                    {dietTypeOptions.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Injury Tags */}
            <ChipSelector
              label="Injury & Physical Limitations"
              options={availableInjuryOptions}
              selected={injuryTags}
              onSelect={handleToggleInjury}
              multi={true}
            />
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-brand-accent hover:bg-brand-accent-hover text-white font-bold px-8 py-3 rounded-xl text-sm transition-all shadow-md disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
