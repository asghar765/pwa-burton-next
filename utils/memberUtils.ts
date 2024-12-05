import { 
  collection, 
  getDocs, 
  updateDoc, 
  doc, 
  Firestore,
  query,
  where,
  getDoc
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

const updateMemberNumberOnCollectorChange = async (
  db: Firestore,
  memberId: string,
  newCollectorId: string,
  newCollectorInfo: {
    initials: string;
    order: number;
  }
): Promise<void> => {
  try {
    // Get all members for the new collector to determine next sequence number
    const membersRef = collection(db, 'members');
    const membersQuery = query(membersRef, where('collectorId', '==', newCollectorId));
    const membersSnapshot = await getDocs(membersQuery);
    
    // Calculate next sequence number for this collector
    const currentSequenceNumbers = membersSnapshot.docs
      .map(doc => {
        const memberNumber = doc.data().memberNumber;
        if (!memberNumber) return 0;
        // Extract sequence number from member number (last 3 digits)
        const sequence = parseInt(memberNumber.slice(-3));
        return isNaN(sequence) ? 0 : sequence;
      })
      .filter(num => num > 0);

    const nextSequence = currentSequenceNumbers.length > 0 
      ? Math.max(...currentSequenceNumbers) + 1 
      : 1;

    // Get current member data
    const memberRef = doc(db, 'members', memberId);
    const memberDoc = await getDoc(memberRef);
    const memberData = memberDoc.data();

    if (!memberData) {
      throw new Error('Member not found');
    }

    // Generate new member number
    const newMemberNumber = generateMemberNumber(
      {
        initials: newCollectorInfo.initials,
        order: newCollectorInfo.order
      },
      nextSequence
    );

    // Update member document with new number
    await updateDoc(memberRef, {
      memberNumber: newMemberNumber,
      oldMemberNumber: memberData.memberNumber, // Preserve old number for reference
      collectorId: newCollectorId
    });

    console.log(`Updated member ${memberId} with new number: ${newMemberNumber}`);
  } catch (error) {
    console.error('Error updating member number:', error);
    throw error;
  }
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
  migrateMemberNumbers,
  updateMemberNumberOnCollectorChange
};
