"use client";

import { useEffect } from "react";

const SCROLLBAR_CLASS = "hide-page-scrollbar";

export function HidePageScrollbar() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add(SCROLLBAR_CLASS);

    return () => {
      root.classList.remove(SCROLLBAR_CLASS);
    };
  }, []);

  return null;
}
