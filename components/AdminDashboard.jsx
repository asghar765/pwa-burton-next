import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useAuth } from '../context/authContext'; // Corrected import path based on the provided files

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    if(user && user.userRole === 'admin') { // Ensuring only admin can fetch feedbacks
      const fetchFeedbacks = async () => {
        const q = query(collection(db, 'userFeedbacks'));
        const querySnapshot = await getDocs(q).catch((error) => {
          console.error('Error fetching user feedbacks:', error.message, error.stack);
        });

        if (querySnapshot) {
          const fetchedFeedbacks = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setFeedbacks(fetchedFeedbacks);
        }
      };

      fetchFeedbacks();
    }
  }, [user]); // Adding user as a dependency to refetch when user changes, ensuring correctness on login state change

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>User Feedbacks</h2>
      <ul>
        {feedbacks.map(feedback => (
          <li key={feedback.id}>{feedback.feedback} - Category: {feedback.category || 'Uncategorized'}</li>
        ))}
      </ul>
    </div>
  );
};