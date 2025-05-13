"use client";

import React from "react";

export default function EventDetailsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: "1230px", margin: "0 auto", backgroundColor: "transparent" }}>
      
      <main>{children}</main>
    </div>
  );
}
