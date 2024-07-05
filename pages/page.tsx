import React from 'react';
import usePageAttributes from '../hooks/usePageAttributes';
import { FeedbackForm } from '../components/FeedbackForm';

const ContactPage = () => {
  const { htmlAttributes, bodyAttributes } = usePageAttributes({
    htmlAttributes: { lang: 'en' },
    bodyAttributes: { class: 'contact-page' },
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center mb-16">
        <h1 className="text-5xl mb-4">
          Contact Us
        </h1>
        <p className="text-xl mb-8">We're here to help and answer any question you might have. We look forward to hearing from you 🙂</p>
      </div>

      <FeedbackForm path="/contact" />
    </div>
  );
};

ContactPage.layoutProps = {
  pageProps: {
    htmlAttributes: { lang: 'en' },
    bodyAttributes: { class: 'contact-page' },
  }
};

export default ContactPage;