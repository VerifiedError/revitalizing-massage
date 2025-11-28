import { db } from './index';
import { websiteContent } from './schema';
import { eq } from 'drizzle-orm';

const defaultContent = [
  // Homepage Hero
  {
    id: 'content_homepage_hero',
    section: 'homepage_hero',
    content: JSON.stringify({
      title: 'Relax. Restore. Revitalize.',
      subtitle: 'Experience professional massage therapy in Topeka, KS. Release tension, reduce stress, and restore balance.',
      backgroundImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=2400&h=1350&fit=crop',
    }),
  },

  // Homepage Benefits Header
  {
    id: 'content_homepage_benefits_header',
    section: 'homepage_benefits_header',
    content: JSON.stringify({
      heading: 'Why Revitalizing Massage?',
      description: 'Experience the difference of personalized, professional care',
    }),
  },

  // Homepage Benefits Cards
  {
    id: 'content_homepage_benefits',
    section: 'homepage_benefits',
    content: JSON.stringify([
      {
        icon: 'CalendarCheck',
        title: 'Flexible Scheduling',
        description: 'Book appointments that work with your schedule, day or evening',
      },
      {
        icon: 'Award',
        title: 'Certified Professional',
        description: 'Licensed and certified with extensive training and experience',
      },
      {
        icon: 'HandHeart',
        title: 'Personalized Care',
        description: 'Each session is customized to address your specific needs and concerns',
      },
      {
        icon: 'Sparkles',
        title: 'Relaxing Atmosphere',
        description: 'A peaceful, welcoming environment designed for your comfort',
      },
    ]),
  },

  // Homepage Location Section
  {
    id: 'content_homepage_location',
    section: 'homepage_location',
    content: JSON.stringify({
      heading: 'Location & Hours',
      subtitle: 'Conveniently located in Topeka, KS',
      image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=1200&h=800&fit=crop',
    }),
  },

  // Homepage Final CTA
  {
    id: 'content_homepage_final_cta',
    section: 'homepage_final_cta',
    content: JSON.stringify({
      heading: 'Ready to Feel Better?',
      description: 'Book your appointment today and start your journey to wellness',
      primaryButtonText: 'Book Appointment',
      secondaryButtonText: 'View Services',
    }),
  },

  // About Hero
  {
    id: 'content_about_hero',
    section: 'about_hero',
    content: JSON.stringify({
      title: 'About Revitalizing Massage',
      subtitle: 'Dedicated to helping you achieve optimal wellness through the healing power of touch.',
    }),
  },

  // About Story
  {
    id: 'content_about_story',
    section: 'about_story',
    content: JSON.stringify({
      heading: 'Our Story',
      paragraphs: [
        'Revitalizing Massage was founded with a simple mission: to provide exceptional massage therapy services that help clients feel their best. Everyone deserves access to quality bodywork that addresses their unique needs.',
        'What started as a passion for healing has grown into a dedicated wellness practice, built on core values of compassion, excellence, and personalized care. The focus is on creating a peaceful sanctuary where you can escape the stresses of daily life and focus on your well-being.',
        'As a certified massage therapist, I bring together diverse training and specializations, ensuring I can address a wide range of conditions and preferences. Whether you are seeking relief from chronic pain, recovering from an injury, or simply want to relax, I have the expertise to help.',
      ],
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=1600&fit=crop',
    }),
  },

  // About Values
  {
    id: 'content_about_values',
    section: 'about_values',
    content: JSON.stringify({
      heading: 'Our Values',
      values: [
        {
          icon: 'Heart',
          title: 'Compassionate Care',
          description: 'We treat every client with genuine care and attention, creating a nurturing environment for healing.',
        },
        {
          icon: 'Award',
          title: 'Excellence',
          description: 'Our therapists maintain the highest standards of professionalism and continually advance their skills.',
        },
        {
          icon: 'Users',
          title: 'Client-Centered',
          description: 'Your wellness goals guide every session. We listen, adapt, and personalize our approach for you.',
        },
      ],
    }),
  },

  // About Commitment
  {
    id: 'content_about_commitment',
    section: 'about_commitment',
    content: JSON.stringify({
      heading: 'Our Commitment to You',
      items: [
        {
          title: 'Certified Professional',
          description: 'Our massage therapist is fully certified, insured, and undergoes regular continuing education.',
        },
        {
          title: 'Clean & Safe Environment',
          description: 'We maintain the highest standards of cleanliness and follow all health and safety protocols.',
        },
        {
          title: 'Premium Products',
          description: 'We use only high-quality, hypoallergenic oils and lotions to ensure your comfort and safety.',
        },
        {
          title: 'Personalized Service',
          description: 'Every session is tailored to your specific needs, preferences, and wellness goals.',
        },
      ],
    }),
  },

  // About CTA
  {
    id: 'content_about_cta',
    section: 'about_cta',
    content: JSON.stringify({
      heading: 'Experience the Difference',
      description: "We'd love to welcome you to Revitalizing Massage. Book your first appointment and discover why our clients keep coming back.",
      buttonText: 'Book Your Appointment',
    }),
  },

  // Contact Hero
  {
    id: 'content_contact_hero',
    section: 'contact_hero',
    content: JSON.stringify({
      title: 'Get in Touch',
      subtitle: "Have questions? I'd love to hear from you. Reach out and I'll respond as soon as possible.",
    }),
  },

  // Contact Intro
  {
    id: 'content_contact_intro',
    section: 'contact_intro',
    content: JSON.stringify({
      heading: 'Contact Information',
      text: "Whether you have a question about services, need to reschedule an appointment, or want to share feedback, I'm here to help.",
      image: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=1200&h=800&fit=crop',
    }),
  },
];

async function seedContent() {
  console.log('🌱 Seeding website content...');

  try {
    for (const item of defaultContent) {
      // Check if content already exists
      const existing = await db
        .select()
        .from(websiteContent)
        .where(eq(websiteContent.section, item.section));

      if (existing.length > 0) {
        console.log(`⏭️  Skipping ${item.section} (already exists)`);
        continue;
      }

      // Insert new content
      await db.insert(websiteContent).values(item);
      console.log(`✅ Seeded ${item.section}`);
    }

    console.log('✅ Website content seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding website content:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  seedContent()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedContent };
