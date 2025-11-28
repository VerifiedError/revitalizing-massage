import Hero from '@/components/Hero';
import styles from './page.module.css';

export const metadata = {
  title: 'Privacy Policy | Revitalizing Massage',
  description: 'Privacy Policy for Revitalizing Massage. Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <>
      <Hero
        title="Privacy Policy"
        subtitle="Your privacy is important to us"
      />

      <section className={styles.privacyContent}>
        <div className={styles.container}>
          <div className={styles.lastUpdated}>
            Last Updated: November 27, 2025
          </div>

          <div className={styles.section}>
            <h2>Introduction</h2>
            <p>
              Revitalizing Massage ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
            <p>
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.
            </p>
          </div>

          <div className={styles.section}>
            <h2>Information We Collect</h2>

            <h3>Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide to us when you:</p>
            <ul>
              <li>Schedule an appointment</li>
              <li>Register for an account on our website</li>
              <li>Contact us via email or phone</li>
              <li>Fill out forms on our website</li>
              <li>Subscribe to our newsletter or communications</li>
            </ul>

            <p>This personal information may include:</p>
            <ul>
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Mailing address</li>
              <li>Health information relevant to massage therapy services</li>
              <li>Payment information (processed securely through third-party payment processors)</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>When you visit our website, we may automatically collect certain information about your device, including:</p>
            <ul>
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Referring website</li>
              <li>Pages visited and time spent on pages</li>
              <li>Date and time of visits</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Schedule and manage your massage therapy appointments</li>
              <li>Provide, maintain, and improve our services</li>
              <li>Process payments for services rendered</li>
              <li>Send appointment reminders and confirmations</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Maintain health and safety records as required by law</li>
              <li>Comply with legal obligations</li>
              <li>Prevent fraud and enhance security</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>Health Information Privacy</h2>
            <p>
              As a massage therapy practice, we collect health information necessary to provide safe and effective treatment. This may include medical history, current health conditions, medications, and treatment preferences.
            </p>
            <p>
              We maintain this information in accordance with applicable healthcare privacy laws and professional standards. Health information is kept confidential and is only accessed by authorized personnel for treatment purposes.
            </p>
          </div>

          <div className={styles.section}>
            <h2>Information Sharing and Disclosure</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>

            <h3>Service Providers</h3>
            <p>We may share your information with third-party service providers who perform services on our behalf, such as:</p>
            <ul>
              <li>Payment processors</li>
              <li>Appointment scheduling platforms</li>
              <li>Email service providers</li>
              <li>Website hosting services</li>
            </ul>

            <h3>Legal Requirements</h3>
            <p>We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).</p>

            <h3>Business Transfers</h3>
            <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</p>
          </div>

          <div className={styles.section}>
            <h2>Cookies and Tracking Technologies</h2>
            <p>
              We may use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
            </p>
          </div>

          <div className={styles.section}>
            <h2>Third-Party Services</h2>
            <p>Our website may contain links to third-party websites or services, including:</p>
            <ul>
              <li>Clerk (authentication and user management)</li>
              <li>Facebook (social media and reviews)</li>
              <li>Google (maps, analytics, and reviews)</li>
            </ul>
            <p>
              We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.
            </p>
          </div>

          <div className={styles.section}>
            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul>
              <li>Secure server infrastructure</li>
              <li>Encryption of sensitive data</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Secure payment processing through certified providers</li>
            </ul>
            <p>
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee absolute security.
            </p>
          </div>

          <div className={styles.section}>
            <h2>Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Health records are maintained according to professional standards and legal requirements.
            </p>
          </div>

          <div className={styles.section}>
            <h2>Your Privacy Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
            <ul>
              <li><strong>Access:</strong> The right to request access to your personal information</li>
              <li><strong>Correction:</strong> The right to request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> The right to request deletion of your personal information</li>
              <li><strong>Opt-Out:</strong> The right to opt out of marketing communications</li>
              <li><strong>Data Portability:</strong> The right to receive a copy of your data in a structured format</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided below.
            </p>
          </div>

          <div className={styles.section}>
            <h2>Children's Privacy</h2>
            <p>
              Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us so we can delete such information.
            </p>
          </div>

          <div className={styles.section}>
            <h2>California Privacy Rights</h2>
            <p>
              If you are a California resident, you have specific rights regarding your personal information under the California Consumer Privacy Act (CCPA). This includes the right to know what personal information we collect, use, and share, and the right to request deletion of your personal information.
            </p>
          </div>

          <div className={styles.section}>
            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </div>

          <div className={styles.section}>
            <h2>Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <div className={styles.contactInfo}>
              <p><strong>Revitalizing Massage</strong></p>
              <p>2900 SW Atwood, Topeka, KS 66614</p>
              <p>Phone: (785) 250-4599</p>
              <p>Email: alannahsrevitalizingmassage@gmail.com</p>
            </div>
          </div>

          <div className={styles.section}>
            <h2>Consent</h2>
            <p>
              By using our website and services, you consent to this Privacy Policy and agree to its terms.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
