import { 
  collection, 
  getDocs, 
  updateDoc, 
  doc, 
  Firestore,
  query,
  where,
  getDoc,
  deleteField
} from 'firebase/firestore';

const generateRawMemberNumber = (
  collectorName: string, 
  collectorNumber: number, 
  sequence: number
): string => {
  // Extract collector initials
  const collectorInitials = collectorName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();

  // Format collector number and sequence
  const formattedCollectorNumber = String(collectorNumber).padStart(2, '0');
  const formattedSequence = String(sequence).padStart(3, '0');

  // Combine components
  return `${collectorInitials}${formattedCollectorNumber}${formattedSequence}`;
};

const updateMemberNumberOnCollectorChange = async (
  db: Firestore,
  memberNumber: string,
  newCollectorId: string,
  newCollectorInfo: {
    initials: string;
    order: number;
  }
): Promise<void> => {
  try {
    // Update member document with new collectorId only
    await updateDoc(doc(db, 'members', memberNumber), {
      collectorId: newCollectorId
    });

    console.log(`Updated member ${memberNumber} with new collector ID: ${newCollectorId}`);
  } catch (error) {
    console.error('Error updating member collector ID:', error);
    throw error;
  }
};

const migrateMemberNumbers = async (db: Firestore): Promise<void> => {
  try {
    const membersRef = collection(db, 'members');
    const membersSnapshot = await getDocs(membersRef);

    for (const memberDoc of membersSnapshot.docs) {
      await updateDoc(doc(db, 'members', memberDoc.id), {
        memberNumber: deleteField() // Corrected to use deleteField
      });
    }

    console.log('Member number removal completed successfully');
  } catch (error) {
    console.error('Error removing member numbers:', error);
    throw error;
  }
};

export { 
  generateRawMemberNumber,
  updateMemberNumberOnCollectorChange,
  migrateMemberNumbers
};
