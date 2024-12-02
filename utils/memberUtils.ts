import { customAlphabet } from 'nanoid';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/clientApp';

export type MemberNumberOptions = {
  collectorInitials: string;
  collectorOrder: number;
  memberSequence: number;
};

const generateMemberNumber = ({
  collectorInitials, 
  collectorOrder, 
  memberSequence
}: MemberNumberOptions): string => {
  // Ensure memberSequence is padded to 3 digits
  const paddedMemberSequence = memberSequence.toString().padStart(3, '0');
  
  // Construct member number: Collector Initials + Collector Order + Member Sequence
  return `${collectorInitials}${collectorOrder}${paddedMemberSequence}`;
};

const migrateMemberNumbers = async (
  collectorInitials: string, 
  collectorOrder: number
): Promise<void> => {
  try {
    // Fetch all members
    const membersRef = collection(db, 'members');
    const membersSnapshot = await getDocs(membersRef);

    // Track member sequence
    let memberSequence = 1;

    // Iterate through members and update their numbers
    for (const memberDoc of membersSnapshot.docs) {
      const oldMemberNumber = memberDoc.data().memberNumber;
      
      // Generate new member number
      const newMemberNumber = generateMemberNumber({
        collectorInitials,
        collectorOrder,
        memberSequence
      });

      // Update member document with new number
      await updateDoc(doc(db, 'members', memberDoc.id), {
        memberNumber: newMemberNumber,
        oldMemberNumber: oldMemberNumber // Keep original for reference
      });

      memberSequence++;
    }

    console.log('Member number migration completed successfully');
  } catch (error) {
    console.error('Error migrating member numbers:', error);
    throw error;
  }
};

export { 
  generateMemberNumber, 
  migrateMemberNumbers 
};
