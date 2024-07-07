import React from 'react';
   import usePageAttributes from '../hooks/usePageAttributes';

   const ContactPage = () => {
     const { htmlAttributes, bodyAttributes } = usePageAttributes({
       htmlAttributes: { lang: 'en' },
       bodyAttributes: { class: 'contact-page' },
     });

     return (
       <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900 to-blue-900 text-gray-100">
         <div className="text-center mb-16">
           <h1 className="text-5xl mb-4 font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
             Contact Us
           </h1>
           <p className="text-xl mb-8">We&apos;re here to help and answer any question you might have. We look forward to hearing from you 🙂</p>
         </div>

         <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
           <p className="text-blue-100 mb-4">
             For more information about our services, membership, or to speak with a PWA representative, please contact us:
           </p>
           <p className="text-blue-100">
             Email: pwaburton@proton.me<br />
             Phone: +44 1234 567890<br />
             Address: 123 Main Street, Burton Upon Trent, DE14 1AA
           </p>
         </div>
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