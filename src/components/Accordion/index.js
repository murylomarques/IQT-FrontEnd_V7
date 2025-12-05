// src/components/Accordion/index.js

import React, { useState } from 'react';
import { AccordionWrapper, AccordionHeader, AccordionContent, AccordionIcon } from './styles.js';

const Accordion = ({ title, children, startOpen = false }) => {
  const [isOpen, setIsOpen] = useState(startOpen);

  return (
    <AccordionWrapper>
      <AccordionHeader onClick={() => setIsOpen(!isOpen)}>
        {title}
        <AccordionIcon isOpen={isOpen}>▼</AccordionIcon>
      </AccordionHeader>
      {isOpen && <AccordionContent>{children}</AccordionContent>}
    </AccordionWrapper>
  );
};

export default Accordion;