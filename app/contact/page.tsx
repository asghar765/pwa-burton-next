'use client';

import React from 'react';
import { FeedbackForm } from '../../components/FeedbackForm';

const ContactPage = () => (
  <div>
    <h1>Contact Us</h1>
    <p>If you have any questions or need help, feel free to contact us.</p>
    <FeedbackForm path={''} />
  </div>
);

export default ContactPage;