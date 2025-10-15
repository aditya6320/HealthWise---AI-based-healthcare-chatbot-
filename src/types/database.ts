export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  emergency_contact: string | null;
  created_at: string;
  updated_at: string;
}

export interface MedicalRecord {
  id: string;
  user_id: string;
  blood_type: string | null;
  allergies: string[] | null;
  chronic_conditions: string[] | null;
  medications: string[] | null;
  height: number | null;
  weight: number | null;
  last_checkup: string | null;
  medical_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface HealthDocument {
  id: string;
  user_id: string;
  document_name: string;
  document_type: string;
  document_url: string;
  uploaded_at: string;
  is_private: boolean;
}