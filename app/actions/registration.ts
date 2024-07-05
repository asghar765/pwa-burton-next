'use server';

import { db } from '../../config/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { z } from 'zod';

// Define the schema for validation using Zod
const RegistrationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email({ message: "Invalid email format" }),
  // Include other fields as necessary
});

export default async function handleRegistration(formData: FormData) {
  // Validate formData using Zod
  const validation = RegistrationSchema.safeParse(Object.fromEntries(formData));
  if (!validation.success) {
    console.error("Validation error:", JSON.stringify(validation.error.format()));
    return { errors: validation.error.format() };
  }

  // If validation passes, add user data to Firestore
  try {
    const docRef = await addDoc(collection(db, "registrations"), validation.data);
    console.log("Registration successful", `Document ID: ${docRef.id}`);
    return { message: "Registration successful", docId: docRef.id };
  } catch (error) {
    console.error("Firestore error:", error);
    return { error: "Failed to save registration. Please try again later." };
  }
}