'use client';

import { useEffect, useState } from 'react';
import styles from './Reviews.module.css';

interface ReviewsProps {
  showTitle?: boolean;
  maxReviews?: number;
  layout?: 'grid' | 'carousel';
}

export default function Reviews({
  showTitle = true,
  maxReviews = 6,
  layout = 'grid'
}: ReviewsProps) {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
    // Load Facebook SDK
    if (!document.getElementById('facebook-jssdk')) {
      const fbScript = document.createElement('script');
      fbScript.id = 'facebook-jssdk';
      fbScript.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
      fbScript.async = true;
      fbScript.defer = true;
      document.body.appendChild(fbScript);
    }

    // Load Google Places API (using simple widget approach)
    if (!document.getElementById('google-places-script')) {
      const googleScript = document.createElement('script');
      googleScript.id = 'google-places-script';
      googleScript.src = 'https://apis.google.com/js/platform.js';
      googleScript.async = true;
      googleScript.defer = true;
      document.body.appendChild(googleScript);
    }

    setScriptsLoaded(true);

    // Parse Facebook widgets after scripts load
    const timer = setTimeout(() => {
      if (window.FB) {
        window.FB.XFBML.parse();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={styles.reviewsSection}>
      <div className={styles.container}>
        {showTitle && (
          <div className={styles.sectionHeader}>
            <h2>What Our Clients Say</h2>
            <p>Real reviews from real people</p>
          </div>
        )}

        <div className={layout === 'grid' ? styles.reviewsGrid : styles.reviewsCarousel}>
          {/* Facebook Reviews */}
          <div className={styles.reviewWidget}>
            <div className={styles.widgetHeader}>
              <svg className={styles.platformIcon} viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <h3>Facebook Reviews</h3>
            </div>
            <div className={styles.widgetContent}>
              {scriptsLoaded && (
                <div
                  className="fb-page"
                  data-href="https://www.facebook.com/alannahsrevitalizingmassage"
                  data-tabs="reviews"
                  data-width="500"
                  data-height="600"
                  data-small-header="true"
                  data-adapt-container-width="true"
                  data-hide-cover="false"
                  data-show-facepile="false"
                >
                  <blockquote
                    cite="https://www.facebook.com/alannahsrevitalizingmassage"
                    className="fb-xfbml-parse-ignore"
                  >
                    <a href="https://www.facebook.com/alannahsrevitalizingmassage">
                      Revitalizing Massage
                    </a>
                  </blockquote>
                </div>
              )}
            </div>
            <a
              href="https://www.facebook.com/alannahsrevitalizingmassage/reviews"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viewAllLink}
            >
              View all Facebook reviews →
            </a>
          </div>

          {/* Google Reviews */}
          <div className={styles.reviewWidget}>
            <div className={styles.widgetHeader}>
              <svg className={styles.platformIcon} viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <h3>Google Reviews</h3>
            </div>
            <div className={styles.widgetContent}>
              <div className={styles.googlePlaceholder}>
                <p className={styles.setupNote}>
                  To display Google reviews, you need to:
                </p>
                <ol className={styles.setupSteps}>
                  <li>Create a Google Business Profile (if you haven't already)</li>
                  <li>Get your Place ID from Google Places API</li>
                  <li>Enable the Google Places API in Google Cloud Console</li>
                  <li>Add your API key to the environment variables</li>
                </ol>
                <p className={styles.helpText}>
                  Once configured, customer reviews from Google will automatically appear here.
                </p>
              </div>
            </div>
            <a
              href="https://www.google.com/search?q=Revitalizing+Massage+Topeka+KS"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viewAllLink}
            >
              Find us on Google →
            </a>
          </div>
        </div>

        {/* Call to Action */}
        <div className={styles.reviewCta}>
          <h3>Have you visited us?</h3>
          <p>We'd love to hear about your experience!</p>
          <div className={styles.ctaButtons}>
            <a
              href="https://www.facebook.com/alannahsrevitalizingmassage/reviews"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.reviewButton}
            >
              Review on Facebook
            </a>
            <a
              href="https://www.google.com/search?q=Revitalizing+Massage+Topeka+KS"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.reviewButton}
            >
              Review on Google
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// Extend window type for Facebook SDK
declare global {
  interface Window {
    FB: any;
  }
}
