import { useState, useEffect } from 'react';

const usePageAttributes = (initialAttributes: { htmlAttributes?: Record<string, string>; bodyAttributes?: Record<string, string>; }) => {
  const [attributes, setAttributes] = useState(initialAttributes);

  useEffect(() => {
    // Override attributes based on logic or external conditions if necessary
    console.log('Setting initial page attributes', initialAttributes);
  }, [initialAttributes]);

  return attributes;
};

export default usePageAttributes;