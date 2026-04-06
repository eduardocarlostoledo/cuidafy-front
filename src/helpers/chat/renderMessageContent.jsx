import React from "react";

const URL_REGEX = /(https?:\/\/[^\s]+)/g;
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
const PHONE_REGEX = /\b\d{6,}\b/g;

const sanitizeText = (text = "") =>
  text.replace(EMAIL_REGEX, "*******").replace(PHONE_REGEX, "*******");

export const renderMessageContent = (messageText) => {
  if (!messageText) {
    return null;
  }

  const sanitized = sanitizeText(messageText);
  const parts = sanitized.split(URL_REGEX);

  return parts.map((part, index) => {
    if (URL_REGEX.test(part)) {
      URL_REGEX.lastIndex = 0;
      return (
        <a
          key={`${part}-${index}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="underline break-all"
        >
          {part}
        </a>
      );
    }

    URL_REGEX.lastIndex = 0;
    return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
  });
};
