'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { db, auth } from '../config/firebaseConfig';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { useTheme } from '../context/themeContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
type FormField = {
  value: string;
  error: string | null;
};

type Spouse = {
  name: FormField;
  dateOfBirth: FormField;
};

type Dependant = {
  name: FormField;
  dateOfBirth: FormField;
  gender: FormField;
  category: FormField;
};

type RegistrationFormState = {
  fullName: FormField;
  address: FormField;
  town: FormField;
  postCode: FormField;
  email: FormField;
  mobileNo: FormField;
  dateOfBirth: FormField;
  placeOfBirth: FormField;
  maritalStatus: FormField;
  gender: FormField;
  membershipInfo: string;
  spouses: Spouse[];
  dependants: Dependant[];
  nextOfKinName: FormField;
  nextOfKinAddress: FormField;
  nextOfKinPhone: FormField;
};

export default function RegistrationForm() {
  const theme = useTheme();
  const initialState: RegistrationFormState = {
    fullName: { value: '', error: null },
    address: { value: '', error: null },
    town: { value: '', error: null },
    postCode: { value: '', error: null },
    email: { value: '', error: null },
    mobileNo: { value: '', error: null },
    dateOfBirth: { value: '', error: null },
    placeOfBirth: { value: '', error: null },
    maritalStatus: { value: '', error: null },
    gender: { value: '', error: null },
    membershipInfo: '',
    spouses: [],
    dependants: [],
    nextOfKinName: { value: '', error: null },
    nextOfKinAddress: { value: '', error: null },
    nextOfKinPhone: { value: '', error: null },
  };

  const [formState, setFormState] = useState<RegistrationFormState>(initialState);
  const [showNextOfKin, setShowNextOfKin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMembershipInfo = async () => {
      try {
        const q = query(collection(db, "membershipInfo"));
        const querySnapshot = await getDocs(q);
        const membershipData = querySnapshot.docs.map(doc => doc.data());
        if (membershipData.length > 0) {
          setFormState(prevState => ({ ...prevState, membershipInfo: membershipData[0].info }));
        }
      } catch (error) {
        console.error("Error fetching membership information: ", error);
      }
    };

    fetchMembershipInfo();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof RegistrationFormState) => {
    const value = e.target.value;
    const error = validateField(field, value);
    setFormState({ ...formState, [field]: { value, error } });
  };

  const validateField = (field: keyof RegistrationFormState, value: string): string | null => {
    if (!value.trim()) {
      return `${field} is required`;
    }
    return null;
  };

  const isFormValid = (): boolean => {
    const hasError = Object.values(formState).some((field) => {
      if (Array.isArray(field)) return false;
      if (typeof field === 'object' && field !== null) return field.error || !field.value.trim();
      return false;
    });
  
    if (hasError) return false;
  
    const spousesValid = formState.spouses.every(spouse => 
      Object.values(spouse).every(field => !field.error && field.value.trim())
    );
  
    if (!spousesValid) return false;
  
    const dependantsValid = formState.dependants.every(dependant => 
      Object.values(dependant).every(field => !field.error && field.value.trim())
    );
  
    return dependantsValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submission initiated");
  
    if (!isFormValid()) {
      console.error('Form validation failed');
      alert('Please fill in all mandatory fields.');
      return;
    }
  
    try {
      setIsSubmitting(true);
      const formData = Object.fromEntries(
        Object.entries(formState).map(([key, value]) => [key, typeof value === 'object' && 'value' in value ? value.value : value])
      );
      const docRef = await addDoc(collection(db, "registrations"), {
        ...formData,
        timestamp: new Date(),
      });
      console.log("Registration submitted successfully!", docRef.id);
      alert("Registration submitted successfully!");
      setFormState(initialState);
    } catch (error) {
      console.error("Error submitting registration: ", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  const handleSpouseChange = (index: number, field: keyof Spouse, value: string) => {
    const updatedSpouses = [...formState.spouses];
    const error = validateField(field as keyof RegistrationFormState, value);
    updatedSpouses[index] = {
      ...updatedSpouses[index],
      [field]: { value, error },
    };
    setFormState({ ...formState, spouses: updatedSpouses });
  };

  const addSpouse = () => {
    const newSpouse: Spouse = {
      name: { value: '', error: null },
      dateOfBirth: { value: '', error: null },
    };
    setFormState({ ...formState, spouses: [...formState.spouses, newSpouse] });
  };

  const removeSpouse = (index: number) => {
    const updatedSpouses = [...formState.spouses];
    updatedSpouses.splice(index, 1);
    setFormState({ ...formState, spouses: updatedSpouses });
  };

  const handleDependantChange = (index: number, field: keyof Dependant, value: string) => {
    const updatedDependants = [...formState.dependants];
    const error = validateField(field as keyof RegistrationFormState, value);
    updatedDependants[index] = {
      ...updatedDependants[index],
      [field]: { value, error },
    };
    setFormState({ ...formState, dependants: updatedDependants });
  };

  const addDependant = () => {
    const newDependant: Dependant = {
      name: { value: '', error: null },
      dateOfBirth: { value: '', error: null },
      gender: { value: '', error: null },
      category: { value: '', error: null },
    };
    setFormState({ ...formState, dependants: [...formState.dependants, newDependant] });
  };

  const removeDependant = (index: number) => {
    const updatedDependants = [...formState.dependants];
    updatedDependants.splice(index, 1);
    setFormState({ ...formState, dependants: updatedDependants });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-8 bg-gradient-to-b from-gray-900 to-blue-900 text-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-5xl space-y-6">
        <h2 className="text-5xl mb-4">
          <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
            PWA Burton On Trent Registration Form
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(formState).map(([field, value]) => {
            if (field === 'spouses' || field === 'dependants' || field === 'membershipInfo' || field.startsWith('nextOfKin')) return null;
            if (field === 'gender') {
              return (
                <div key={field} className="space-y-2">
                  <label htmlFor={field} className="block font-medium text-blue-200">Gender</label>
                  <select
                    id={field}
                    value={(value as FormField).value}
                    onChange={(e) => handleInputChange(e, field as keyof RegistrationFormState)}
                    className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {(value as FormField).error && <span className="text-red-400 text-sm">{(value as FormField).error}</span>}
                </div>
              );
            }
            if (field === 'maritalStatus') {
              return (
                <div key={field} className="space-y-2">
                  <label htmlFor={field} className="block font-medium text-blue-200">Marital Status</label>
                  <select
                    id={field}
                    value={(value as FormField).value}
                    onChange={(e) => handleInputChange(e, field as keyof RegistrationFormState)}
                    className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
                  >
                    <option value="">Select Marital Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                  {(value as FormField).error && <span className="text-red-400 text-sm">{(value as FormField).error}</span>}
                </div>
              );
            }
            return (
              <div key={field} className="space-y-2">
                <label htmlFor={field} className="block font-medium text-blue-200">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                <input
                  type={field.includes('date') ? 'date' : 'text'}
                  id={field}
                  value={(value as FormField).value}
                  onChange={(e) => handleInputChange(e, field as keyof RegistrationFormState)}
                  className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
                />
                {(value as FormField).error && <span className="text-red-400 text-sm">{(value as FormField).error}</span>}
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setShowNextOfKin(!showNextOfKin)}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors flex justify-between items-center"
          >
            <span>Next of Kin Information</span>
            <span>{showNextOfKin ? '▲' : '▼'}</span>
          </button>
          {showNextOfKin && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {(['nextOfKinName', 'nextOfKinAddress', 'nextOfKinPhone'] as const).map((field) => (
                <div key={field} className="space-y-2">
                  <label htmlFor={field} className="block font-medium text-blue-200">
                    {field.replace('nextOfKin', '').replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input
                    type={field === 'nextOfKinPhone' ? 'tel' : 'text'}
                    id={field}
                    value={formState[field].value}
                    onChange={(e) => handleInputChange(e, field)}
                    className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
                  />
                  {formState[field].error && (
                    <span className="text-red-400 text-sm">{formState[field].error}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-3xl mb-4">
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
              Spouses
            </span>
          </h3>
          {formState.spouses.map((spouse, index) => (
            <div key={index} className="p-4 border border-gray-600 rounded bg-gray-800">
              <h4 className="text-lg font-medium mb-2 text-blue-200">Spouse {index + 1}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(spouse).map(([field, value]) => (
                  <div key={field} className="space-y-2">
                    <label htmlFor={`spouse-${index}-${field}`} className="block font-medium text-blue-200">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                    <input
                      type={field.includes('date') ? 'date' : 'text'}
                      id={`spouse-${index}-${field}`}
                      value={value.value}
                      onChange={(e) => handleSpouseChange(index, field as keyof Spouse, e.target.value)}
                      className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
                    />
                    {value.error && <span className="text-red-400 text-sm">{value.error}</span>}
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => removeSpouse(index)} className="mt-2 py-1 px-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Remove Spouse</button>
            </div>
          ))}
          <button type="button" onClick={addSpouse} className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Add Spouse</button>
          </div>

        <div className="space-y-4">
          <h3 className="text-3xl mb-4">
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
              Dependants
            </span>
          </h3>
          {formState.dependants.map((dependant, index) => (
            <div key={index} className="p-4 border border-gray-600 rounded bg-gray-800">
              <h4 className="text-lg font-medium mb-2 text-blue-200">Dependant {index + 1}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(dependant).map(([field, value]) => (
                  <div key={field} className="space-y-2">
                    <label htmlFor={`dependant-${index}-${field}`} className="block font-medium text-blue-200">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                    {field === 'gender' ? (
                      <select
                        id={`dependant-${index}-${field}`}
                        value={value.value}
                        onChange={(e) => handleDependantChange(index, field as keyof Dependant, e.target.value)}
                        className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : field === 'category' ? (
                      <select
                        id={`dependant-${index}-${field}`}
                        value={value.value}
                        onChange={(e) => handleDependantChange(index, field as keyof Dependant, e.target.value)}
                        className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
                      >
                        <option value="">Select Category</option>
                        <option value="Birth Child">Birth Child</option>
                        <option value="Step-Child">Step-Child</option>
                        <option value="Adopted">Adopted</option>
                      </select>
                    ) : (
                      <input
                        type={field === 'dateOfBirth' ? 'date' : 'text'}
                        id={`dependant-${index}-${field}`}
                        value={value.value}
                        onChange={(e) => handleDependantChange(index, field as keyof Dependant, e.target.value)}
                        className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
                      />
                    )}
                    {value.error && <span className="text-red-400 text-sm">{value.error}</span>}
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => removeDependant(index)} className="mt-2 py-1 px-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Remove Dependant</button>
            </div>
          ))}
          <button type="button" onClick={addDependant} className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Add Dependant</button>        
          </div>

        <div className="space-y-4">
          <h3 className="text-3xl mb-4">
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
              Membership Information
            </span>
          </h3>
          <div className="p-4 border border-gray-600 rounded bg-gray-800">
            <p className="text-white">{formState.membershipInfo}</p>
          </div>
          <div className="p-4 border border-gray-600 rounded bg-gray-800">
            <h4 className="text-lg font-medium mb-2 text-blue-200">Membership Fee</h4>
            <p className="text-white">Registration fee: £150</p>
            <p className="text-white">Annual fee: £40 (collected £20 in January and £20 in June)</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" className="form-checkbox bg-gray-800 border-gray-600 text-blue-600" />
            <span className="ml-2 text-blue-200">I am eligible for Gift Aid</span>
          </label>
          <p className="text-sm italic text-blue-200">Please see eligibility information on app/website</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-blue-200">
            I/We Hereby confirm the above details provided are genuine and valid. I/We also understand that submitting an application or making payment does not obligate PWA Burton On Trent to grant Membership. Membership will only be approved once all criteria are met, Supporting documents presented, Payment made in Full and approval is informed by the Management of PWA Burton On Trent. I/We understand and agree that it is my/our duty and responsibility to notify PWA Burton On Trent of ALL changes in circumstance in relation to myself/ALL those under this Membership, at my/our earliest convenience.
          </p>
          <div className="flex items-center">
            <input type="checkbox" id="agreement" className="form-checkbox bg-gray-800 border-gray-600 text-blue-600" required />
            <label htmlFor="agreement" className="ml-2 text-blue-200">I agree to the terms and conditions</label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
          disabled={isSubmitting || !isFormValid()}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Registration'}
        </button>
      </form>
    </div>
  );
}
