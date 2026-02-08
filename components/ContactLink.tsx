"use client";

import { useEffect, useState } from "react";

export default function ContactLink({
  method,
  value,
  className,
  children,
}: {
  method: string;
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    setIsAndroid(/android/i.test(navigator.userAgent));
  }, []);

  let finalLink = "#";

  if (method === "whatsapp") {
    finalLink = `https://wa.me/${value.replace(/\D/g, "")}`;
  } else {
    const clean = value
      .replace("@", "")
      .replace(/https?:\/\/(www\.)?instagram\.com\//, "")
      .replace(/\/$/, "")
      .trim();

    finalLink = isAndroid
      ? `intent://instagram.com/_u/${clean}/#Intent;package=com.instagram.android;scheme=https;end`
      : `https://www.instagram.com/${clean}/`;
  }

  return (
    <a
      href={finalLink}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
