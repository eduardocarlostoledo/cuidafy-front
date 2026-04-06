import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const accordionContent = [
  {
    id: 1,
    question: "Should I use reCAPTCHA v2 or v3?",
    answer: `reCAPTCHA v2 is not going away! We will continue to fully support and improve security and usability for v2.
      reCAPTCHA v3 is intended for power users, site owners that want more data about their traffic, and for use cases in which it is not appropriate to show a challenge to the user.
      For example, a registration page might still use reCAPTCHA v2 for a higher-friction challenge, whereas more common actions like sign-in, searches, comments, or voting might use reCAPTCHA v3. To see more details, see the reCAPTCHA v3 developer guide.`
  },
  {
    id: 2,
    question: "I'd like to run automated tests with reCAPTCHA. What should I do?",
    answer: `For reCAPTCHA v3, create a separate key for testing environments. Scores may not be accurate as reCAPTCHA v3 relies on seeing real traffic.
      For reCAPTCHA v2, use the following test keys. You will always get No CAPTCHA and all verification requests will pass.`
  },
  {
    id: 3,
    question: "Can I run reCAPTCHA v2 and v3 on the same page?",
    answer: `To do this, load the v3 site key as documented, and then explicitly render v2 using grecaptcha.render.
      You are allowed to hide the badge as long as you include the reCAPTCHA branding visibly in the user flow. Please include the following text:
      Yes, please use "www.recaptcha.net" in your code in circumstances when "www.google.com" is not accessible.
      After that, apply the same to everywhere else that uses "www.google.com/recaptcha/" on your site.`
  }
];

function ver() {
  const [selectedAccordion, setSelectedAccordion] = useState(null);

  const toggleAccordion = (accordion) => {
    setSelectedAccordion(selectedAccordion === accordion ? null : accordion);
  };

  const isAccordionOpen = (accordion) => {
    return selectedAccordion === accordion;
  };

  return (
    <div className="bg-gray-100 h-screen w-screen flex justify-center">
    <div className="mr-8">
      <h1 className="font-medium max-w-xl mx-auto pt-10 pb-4">Smooth Accordion</h1>
      <div className="bg-white max-w-xl mx-auto border border-gray-200">
        <ul className="shadow-box">
          {accordionContent.map((item) => (
            <li className="relative border-b border-gray-200" key={item.id}>
              <button
                type="button"
                className="w-full px-8 py-6 text-left"
                onClick={() => toggleAccordion(item.id)}
              >
                <div className="flex items-center justify-between">
                  <span>{item.question}</span>
                  <span className={`ico-plus ${isAccordionOpen(item.id) ? 'open' : ''}`}></span>
                </div>
              </button>
              <AnimatePresence initial={false}>
                {isAccordionOpen(item.id) && (
                  <motion.div
                    className="p-6"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);
}

export default ver;
