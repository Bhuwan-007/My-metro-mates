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

  let finalLink = "#";

  if (method === "whatsapp") {
  finalLink = `https://wa.me/${value.replace(/\D/g, "")}`;
    } else {
    const clean = value
        .replace("@", "")
        .replace(/https?:\/\/(www\.)?instagram\.com\//, "")
        .replace(/\/$/, "")
        .trim();

    finalLink = `https://www.instagram.com/${clean}/`;
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
