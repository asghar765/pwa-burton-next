import { 
  collection, 
  getDocs, 
  updateDoc, 
  doc, 
  Firestore 
} from 'firebase/firestore';

export type MemberNumberOptions = {
  collectorInitials: string;
  collectorOrder: number;
  memberSequence: number;
};

const generateMemberNumber = (
  collectorInfo?: {
    initials?: string;
    order?: number;
  },
  memberSequence?: number
): string => {
  // Default fallback values if not provided
  const initials = collectorInfo?.initials || 'UN'; // UN for Unknown/Unassigned
  const order = collectorInfo?.order || 0;
  const sequence = memberSequence || 1;

  // Ensure memberSequence is padded to 3 digits
  const paddedMemberSequence = sequence.toString().padStart(3, '0');
  
  // Construct member number: Collector Initials + Collector Order + Member Sequence
  return `${initials}${order}${paddedMemberSequence}`;
};

const migrateMemberNumbers = async (db: Firestore): Promise<void> => {
  try {
    // Fetch all members
    const membersRef = collection(db, 'members');
    const membersSnapshot = await getDocs(membersRef);

    // Track member sequences for each collector
    const collectorSequences: Record<string, number> = {};

    // Iterate through members and update their numbers
    for (const memberDoc of membersSnapshot.docs) {
      const memberData = memberDoc.data();
      const collector = memberData.collector || 'UN';
      const collectorInitials = collector.substring(0, 2).toUpperCase();
      
      // Initialize or increment sequence for this collector
      collectorSequences[collector] = (collectorSequences[collector] || 0) + 1;

      // Generate new member number
      const newMemberNumber = generateMemberNumber({
        initials: collectorInitials,
        order: 5 // Default collector order
      }, collectorSequences[collector]);

      // Update member document with new number
      await updateDoc(doc(db, 'members', memberDoc.id), {
        memberNumber: newMemberNumber,
        oldMemberNumber: memberData.memberNumber // Keep original for reference
      });
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
