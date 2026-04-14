"use client";

import { useEffect } from "react";
import { useCMSStore } from "@/store/cmsStore";

export default function CMSLoader() {
  const fetchSettings = useCMSStore((s) => s.fetchSettings);
  
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return null;
}
