import { db } from './index';
import { expenses } from './schema';

async function seedExpenses() {
  console.log('Seeding expenses...');

  const currentYear = new Date().getFullYear();
  const sampleExpenses = [
    {
      id: 'exp_supplies_001',
      date: `${currentYear}-01-15`,
      category: 'supplies',
      subcategory: 'Massage Oils',
      amount: '125.50',
      vendor: 'Mountain Rose Herbs',
      description: 'Essential oils for aromatherapy: lavender, eucalyptus, peppermint',
      receiptUrl: null,
      paymentMethod: 'card',
      taxDeductible: true,
      notes: 'Bulk order - 3 month supply',
      createdAt: new Date(),
      createdBy: 'admin',
      updatedAt: new Date()
    },
    {
      id: 'exp_supplies_002',
      date: `${currentYear}-01-20`,
      category: 'supplies',
      subcategory: 'Lotions and Creams',
      amount: '89.99',
      vendor: 'Bon Vital',
      description: 'Unscented massage lotion',
      receiptUrl: null,
      paymentMethod: 'card',
      taxDeductible: true,
      notes: null,
      createdAt: new Date(),
      createdBy: 'admin',
      updatedAt: new Date()
    },
    {
      id: 'exp_rent_001',
      date: `${currentYear}-02-01`,
      category: 'rent',
      subcategory: null,
      amount: '800.00',
      vendor: 'Office Space Landlord',
      description: 'Monthly rent payment - February',
      receiptUrl: null,
      paymentMethod: 'check',
      taxDeductible: true,
      notes: 'Check #1234',
      createdAt: new Date(),
      createdBy: 'admin',
      updatedAt: new Date()
    },
    {
      id: 'exp_utilities_001',
      date: `${currentYear}-02-10`,
      category: 'utilities',
      subcategory: 'Electric',
      amount: '78.45',
      vendor: 'Evergy',
      description: 'Electric bill - January',
      receiptUrl: null,
      paymentMethod: 'bank-transfer',
      taxDeductible: true,
      notes: null,
      createdAt: new Date(),
      createdBy: 'admin',
      updatedAt: new Date()
    },
    {
      id: 'exp_utilities_002',
      date: `${currentYear}-02-15`,
      category: 'utilities',
      subcategory: 'Internet',
      amount: '65.00',
      vendor: 'Cox Communications',
      description: 'Business internet - February',
      receiptUrl: null,
      paymentMethod: 'card',
      taxDeductible: true,
      notes: null,
      createdAt: new Date(),
      createdBy: 'admin',
      updatedAt: new Date()
    },
    {
      id: 'exp_marketing_001',
      date: `${currentYear}-03-05`,
      category: 'marketing',
      subcategory: 'Social Media Ads',
      amount: '150.00',
      vendor: 'Facebook',
      description: 'March advertising campaign',
      receiptUrl: null,
      paymentMethod: 'card',
      taxDeductible: true,
      notes: 'Spring promotion campaign',
      createdAt: new Date(),
      createdBy: 'admin',
      updatedAt: new Date()
    },
    {
      id: 'exp_insurance_001',
      date: `${currentYear}-03-15`,
      category: 'insurance',
      subcategory: 'Liability Insurance',
      amount: '250.00',
      vendor: 'State Farm',
      description: 'Quarterly liability insurance premium',
      receiptUrl: null,
      paymentMethod: 'bank-transfer',
      taxDeductible: true,
      notes: 'Q1 payment',
      createdAt: new Date(),
      createdBy: 'admin',
      updatedAt: new Date()
    },
    {
      id: 'exp_software_001',
      date: `${currentYear}-04-01`,
      category: 'software',
      subcategory: 'Website Hosting',
      amount: '29.99',
      vendor: 'Vercel',
      description: 'Pro plan monthly subscription',
      receiptUrl: null,
      paymentMethod: 'card',
      taxDeductible: true,
      notes: 'Website hosting and deployment',
      createdAt: new Date(),
      createdBy: 'admin',
      updatedAt: new Date()
    },
    {
      id: 'exp_equipment_001',
      date: `${currentYear}-04-15`,
      category: 'equipment',
      subcategory: 'Massage Table',
      amount: '450.00',
      vendor: 'Earthlite',
      description: 'Replacement massage table',
      receiptUrl: null,
      paymentMethod: 'card',
      taxDeductible: true,
      notes: 'Old table worn out after 5 years',
      createdAt: new Date(),
      createdBy: 'admin',
      updatedAt: new Date()
    },
    {
      id: 'exp_professional_001',
      date: `${currentYear}-05-01`,
      category: 'professional-services',
      subcategory: 'Accounting',
      amount: '175.00',
      vendor: 'Smith & Associates CPA',
      description: 'Q1 bookkeeping and tax preparation',
      receiptUrl: null,
      paymentMethod: 'check',
      taxDeductible: true,
      notes: 'Check #1235',
      createdAt: new Date(),
      createdBy: 'admin',
      updatedAt: new Date()
    },
    {
      id: 'exp_supplies_003',
      date: `${currentYear}-05-10`,
      category: 'supplies',
      subcategory: 'Linens',
      amount: '120.00',
      vendor: 'Amazon Business',
      description: 'Massage table sheets and face cradle covers',
      receiptUrl: null,
      paymentMethod: 'card',
      taxDeductible: true,
      notes: '6 sets of linens',
      createdAt: new Date(),
      createdBy: 'admin',
      updatedAt: new Date()
    },
    {
      id: 'exp_marketing_002',
      date: `${currentYear}-06-01`,
      category: 'marketing',
      subcategory: 'Business Cards',
      amount: '75.00',
      vendor: 'Vistaprint',
      description: 'Business card printing - 500 cards',
      receiptUrl: null,
      paymentMethod: 'card',
      taxDeductible: true,
      notes: null,
      createdAt: new Date(),
      createdBy: 'admin',
      updatedAt: new Date()
    },
    {
      id: 'exp_rent_002',
      date: `${currentYear}-06-01`,
      category: 'rent',
      subcategory: null,
      amount: '800.00',
      vendor: 'Office Space Landlord',
      description: 'Monthly rent payment - June',
      receiptUrl: null,
      paymentMethod: 'check',
      taxDeductible: true,
      notes: 'Check #1236',
      createdAt: new Date(),
      createdBy: 'admin',
      updatedAt: new Date()
    },
    {
      id: 'exp_other_001',
      date: `${currentYear}-07-01`,
      category: 'other',
      subcategory: 'Professional Development',
      amount: '200.00',
      vendor: 'AMTA',
      description: 'Continuing education course - Deep Tissue Techniques',
      receiptUrl: null,
      paymentMethod: 'card',
      taxDeductible: true,
      notes: 'CEU credits for license renewal',
      createdAt: new Date(),
      createdBy: 'admin',
      updatedAt: new Date()
    },
    {
      id: 'exp_supplies_004',
      date: `${currentYear}-08-01`,
      category: 'supplies',
      subcategory: 'Hot Stones',
      amount: '95.00',
      vendor: 'Master Massage',
      description: 'Hot stone massage set replacement',
      receiptUrl: null,
      paymentMethod: 'card',
      taxDeductible: true,
      notes: 'Replacement for damaged stones',
      createdAt: new Date(),
      createdBy: 'admin',
      updatedAt: new Date()
    }
  ];

  // Clear existing expenses
  await db.delete(expenses);

  // Insert new expenses
  for (const expense of sampleExpenses) {
    await db.insert(expenses).values(expense);
  }

  console.log(`✓ Seeded ${sampleExpenses.length} expense records`);
  console.log('✓ Expense seeding complete!');
}

seedExpenses()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding expenses:', error);
    process.exit(1);
  });
