"use client";

import { useState, useEffect, useCallback } from "react";

export function useProStatus() {
  const [isPro, setIsPro] = useState(false);
  const [licenseKey, setLicenseKey] = useState<string | null>(null);

  const checkStatus = useCallback(() => {
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
  }, []);

  const syncWithServer = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) return;
      const data = await res.json();
      if (data?.isPro) {
        try {
          if (data.licenseKey) {
            localStorage.setItem("nexoreui_license_key", data.licenseKey);
          }
          localStorage.setItem("nexoreui_is_pro", "true");
        } catch {}
        setIsPro(true);
        if (data.licenseKey) {
          setLicenseKey(data.licenseKey);
        }
        window.dispatchEvent(new Event("nexoreui_pro_updated"));
      }
    } catch {}
  }, []);

  useEffect(() => {
    checkStatus();
    syncWithServer();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "nexoreui_license_key" || e.key === "nexoreui_is_pro") {
        checkStatus();
      }
    };

    const handleCustom = () => checkStatus();
    const handleFocus = () => syncWithServer();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("nexoreui_pro_updated", handleCustom);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("nexoreui_pro_updated", handleCustom);
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkStatus, syncWithServer]);

  const activatePro = (key: string) => {
    try {
      localStorage.setItem("nexoreui_license_key", key);
      localStorage.setItem("nexoreui_is_pro", "true");
      setIsPro(true);
      setLicenseKey(key);
      window.dispatchEvent(new Event("nexoreui_pro_updated"));
    } catch {}
  };

  return { isPro, licenseKey, activatePro };
}
