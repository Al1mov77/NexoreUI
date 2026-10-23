"use client";

import { useState, useEffect } from "react";

export function useProStatus() {
  const [isPro, setIsPro] = useState(false);
  const [licenseKey, setLicenseKey] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = () => {
      try {
        const storedKey = localStorage.getItem("nexoreui_license_key");
        const storedPro = localStorage.getItem("nexoreui_is_pro");
        const active = storedPro === "true" || (typeof storedKey === "string" && storedKey.trim().length > 4);
        setIsPro(active);
        setLicenseKey(storedKey);
      } catch {
        setIsPro(false);
        setLicenseKey(null);
      }
    };

    checkStatus();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "nexoreui_license_key" || e.key === "nexoreui_is_pro") {
        checkStatus();
      }
    };

    const handleCustom = () => checkStatus();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("nexoreui_pro_updated", handleCustom);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("nexoreui_pro_updated", handleCustom);
    };
  }, []);

  const activatePro = (key: string) => {
    try {
      localStorage.setItem("nexoreui_license_key", key);
      localStorage.setItem("nexoreui_is_pro", "true");
      setIsPro(true);
      setLicenseKey(key);
      window.dispatchEvent(new Event("nexoreui_pro_updated"));
    } catch {
      // Storage unavailable
    }
  };

  return { isPro, licenseKey, activatePro };
}
