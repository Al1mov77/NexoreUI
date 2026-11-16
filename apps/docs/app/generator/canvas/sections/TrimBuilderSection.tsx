"use client";

import { Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  getSubcategoryTrimCatalog,
  SectionComponentProps,
} from "../canvas-types";
import { SectionShell, SectionTitleRow } from "./SectionShell";

const BAKERY_BOX_OPTIONS = [
  { id: "classic-3", label: "Three-Loaf Classic Box", code: "BX-3", priceUsd: 24, weightLabel: "2.6 kg total" },
  { id: "weekend-6", label: "Weekend Table Assortment", code: "BX-6", priceUsd: 46, weightLabel: "5.1 kg total" },
  { id: "pastry-tray", label: "Morning Viennoiserie Tray", code: "BX-12", priceUsd: 54, weightLabel: "12 pieces" },
] as const;

export function TrimBuilderSection({
  section,
  payload,
  pal,
  reducedMotion,
  isBakery,
  cleanCity,
  onTrimChange,
}: SectionComponentProps) {
  const { tokens, config } = payload;
  const [finishIdx, setFinishIdx] = useState(0);
  const [wheelIdx, setWheelIdx] = useState(1);
  const [aeroIdx, setAeroIdx] = useState(0);
  const [bakeryBoxIdx, setBakeryBoxIdx] = useState(0);
  const [pickupSlot, setPickupSlot] = useState("08:30");
  const [confirmed, setConfirmed] = useState(false);

  const catalog = getSubcategoryTrimCatalog(config);
  const finish = catalog.finishes[finishIdx] || catalog.finishes[0];
  const wheel = catalog.wheels[wheelIdx] || catalog.wheels[0];
  const aero = catalog.aero[aeroIdx] || catalog.aero[0];

  const totalPriceDelta = finish.priceDelta + wheel.priceDelta + aero.priceDelta;
  const packageMassDelta = finish.massDelta + wheel.massDelta + aero.massDelta;
  const packageDownforceDelta = finish.downforceDelta + wheel.downforceDelta + aero.downforceDelta;
  const packageAccelDelta = Number((finish.accelDelta + wheel.accelDelta + aero.accelDelta).toFixed(2));
  const packageRangeDelta = finish.rangeDelta + wheel.rangeDelta + aero.rangeDelta;
  const buildCode = `${config.chassisCode}-${finish.code}-${wheel.code}-${aero.code}`;

  useEffect(() => {
    if (!onTrimChange || isBakery) return;
    onTrimChange({
      finishLabel: finish.label,
      wheelLabel: wheel.label,
      aeroLabel: aero.label,
      buildCode,
      priceDelta: totalPriceDelta,
      massDeltaKg: packageMassDelta,
      downforceDeltaKg: packageDownforceDelta,
      accelDeltaSec: packageAccelDelta,
      rangeDeltaKm: packageRangeDelta,
    });
  }, [
    isBakery,
    finish.label,
    wheel.label,
    aero.label,
    buildCode,
    totalPriceDelta,
    packageMassDelta,
    packageDownforceDelta,
    packageAccelDelta,
    packageRangeDelta,
    onTrimChange,
  ]);

  if (isBakery) {
    const selectedBox = BAKERY_BOX_OPTIONS[bakeryBoxIdx] || BAKERY_BOX_OPTIONS[0];
    return (
      <SectionShell id="cta" tokens={tokens} pal={pal} reducedMotion={reducedMotion}>
        <div className="space-y-8">
          <SectionTitleRow section={section} tokens={tokens} pal={pal} />
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <div style={{ color: pal.muted }} className="text-xs uppercase tracking-wider font-medium">
                  Loaf selection
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  {BAKERY_BOX_OPTIONS.map((box, idx) => {
                    const active = idx === bakeryBoxIdx;
                    return (
                      <button
                        key={box.id}
                        type="button"
                        onClick={() => {
                          setBakeryBoxIdx(idx);
                          setConfirmed(false);
                        }}
                        style={{
                          borderColor: active ? pal.accent : pal.border,
                          backgroundColor: pal.surface,
                          borderRadius: tokens.cardRadius,
                        }}
                        className="border p-4 text-left space-y-1.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
                      >
                        <div style={{ color: pal.fg }} className="text-sm font-semibold">
                          {box.label}
                        </div>
                        <div
                          style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.muted }}
                          className="text-xs tabular-nums"
                        >
                          ${box.priceUsd} · {box.weightLabel}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <div style={{ color: pal.muted }} className="text-xs uppercase tracking-wider font-medium">
                  Pickup window in {cleanCity}
                </div>
                <div className="flex flex-wrap gap-2">
                  {["08:30", "10:30", "13:00"].map((slot) => {
                    const active = pickupSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          setPickupSlot(slot);
                          setConfirmed(false);
                        }}
                        style={{
                          borderColor: active ? pal.accent : pal.border,
                          backgroundColor: active ? pal.accent : pal.surface,
                          color: active ? pal.accentFg : pal.fg,
                          borderRadius: tokens.buttonRadius,
                          fontFamily: tokens.fontPair.monoFamily,
                        }}
                        className="border px-4 py-2 text-xs font-medium cursor-pointer tabular-nums"
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div
              style={{
                borderColor: pal.border,
                backgroundColor: pal.surface,
                borderRadius: tokens.cardRadius,
              }}
              className="lg:col-span-5 border p-6 sm:p-8 space-y-6"
            >
              <div className="space-y-1 border-b pb-5" style={{ borderColor: pal.border }}>
                <span style={{ color: pal.muted }} className="text-xs uppercase tracking-wider">
                  Morning basket · {cleanCity}
                </span>
                <div
                  style={{ fontFamily: tokens.fontPair.displayFamily, color: pal.fg }}
                  className="text-xl font-semibold pt-1"
                >
                  {selectedBox.label}
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <span style={{ color: pal.muted }} className="text-sm">
                  Pickup at {pickupSlot}
                </span>
                <span
                  style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.fg }}
                  className="text-3xl font-semibold tabular-nums"
                >
                  ${selectedBox.priceUsd}
                </span>
              </div>

              {confirmed ? (
                <div
                  style={{
                    borderColor: pal.accent,
                    backgroundColor: pal.bg,
                    borderRadius: tokens.buttonRadius,
                  }}
                  className="border p-4 flex items-center justify-between gap-3 text-xs"
                >
                  <span style={{ color: pal.fg }} className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 shrink-0" />
                    Reserved for {pickupSlot} counter collection in {cleanCity}.
                  </span>
                  <button
                    type="button"
                    onClick={() => setConfirmed(false)}
                    style={{ color: pal.muted }}
                    className="underline cursor-pointer shrink-0"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmed(true)}
                  style={{
                    backgroundColor: pal.accent,
                    color: pal.accentFg,
                    borderRadius: tokens.buttonRadius,
                  }}
                  className="w-full py-3.5 px-6 text-sm font-medium cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {payload.ctaPrimary}
                </button>
              )}
            </div>
          </div>
        </div>
      </SectionShell>
    );
  }

  const totalPrice = config.customMetrics.basePriceUsd + totalPriceDelta;
  const baseWeightSaved = Math.abs(config.customMetrics.massDeltaKg);
  const netWeightSaved = Math.max(0, baseWeightSaved - packageMassDelta);
  const adjustedAccel = Math.max(1.2, config.customMetrics.accelSeconds + packageAccelDelta).toFixed(2);
  const adjustedDownforce = config.customMetrics.downforceKg + packageDownforceDelta;

  return (
    <SectionShell id="cta" tokens={tokens} pal={pal} reducedMotion={reducedMotion}>
      <div className="space-y-8">
        <SectionTitleRow section={section} tokens={tokens} pal={pal} />

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2.5">
              <div style={{ color: pal.muted }} className="text-xs uppercase tracking-wider font-medium">
                Body finish
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {catalog.finishes.map((item, idx) => {
                  const active = idx === finishIdx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setFinishIdx(idx);
                        setConfirmed(false);
                      }}
                      style={{
                        borderColor: active ? pal.accent : pal.border,
                        backgroundColor: pal.surface,
                        borderRadius: tokens.cardRadius,
                      }}
                      className="border p-4 text-left space-y-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      <div style={{ color: pal.fg }} className="text-sm font-semibold">
                        {item.label}
                      </div>
                      <div
                        style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.muted }}
                        className="text-xs tabular-nums"
                      >
                        {item.priceDelta === 0 ? "Included" : `+$${item.priceDelta.toLocaleString()}`} · {item.massDelta >= 0 ? `+${item.massDelta}` : item.massDelta} kg
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2.5">
              <div style={{ color: pal.muted }} className="text-xs uppercase tracking-wider font-medium">
                Wheel package
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {catalog.wheels.map((item, idx) => {
                  const active = idx === wheelIdx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setWheelIdx(idx);
                        setConfirmed(false);
                      }}
                      style={{
                        borderColor: active ? pal.accent : pal.border,
                        backgroundColor: pal.surface,
                        borderRadius: tokens.cardRadius,
                      }}
                      className="border p-4 text-left space-y-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      <div style={{ color: pal.fg }} className="text-sm font-semibold">
                        {item.label}
                      </div>
                      <div
                        style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.muted }}
                        className="text-xs tabular-nums"
                      >
                        {item.priceDelta === 0 ? "Included" : `+$${item.priceDelta.toLocaleString()}`} · {item.massDelta >= 0 ? `+${item.massDelta}` : item.massDelta} kg
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2.5">
              <div style={{ color: pal.muted }} className="text-xs uppercase tracking-wider font-medium">
                Aero setup
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {catalog.aero.map((item, idx) => {
                  const active = idx === aeroIdx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setAeroIdx(idx);
                        setConfirmed(false);
                      }}
                      style={{
                        borderColor: active ? pal.accent : pal.border,
                        backgroundColor: pal.surface,
                        borderRadius: tokens.cardRadius,
                      }}
                      className="border p-4 text-left space-y-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      <div style={{ color: pal.fg }} className="text-sm font-semibold">
                        {item.label}
                      </div>
                      <div
                        style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.muted }}
                        className="text-xs tabular-nums"
                      >
                        {item.priceDelta === 0 ? "Included" : `+$${item.priceDelta.toLocaleString()}`} · +{item.downforceDelta} kg load
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            style={{
              borderColor: pal.border,
              backgroundColor: pal.surface,
              borderRadius: tokens.cardRadius,
            }}
            className="lg:col-span-5 border p-6 sm:p-8 space-y-6"
          >
            <div className="space-y-1 border-b pb-5" style={{ borderColor: pal.border }}>
              <div className="flex items-center justify-between gap-3">
                <span style={{ color: pal.muted }} className="text-xs uppercase tracking-wider">
                  {cleanCity} Allocation
                </span>
                <span
                  style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.fg }}
                  className="text-xs font-semibold tabular-nums"
                >
                  {buildCode}
                </span>
              </div>
              <div
                style={{ fontFamily: tokens.fontPair.displayFamily, color: pal.fg }}
                className="text-xl font-semibold tracking-tight pt-1"
              >
                {config.year} {config.modelName}
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span style={{ color: pal.muted }}>Configured 0–100 km/h</span>
                <span style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.fg }} className="font-semibold tabular-nums">
                  {adjustedAccel} s
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: pal.muted }}>Peak downforce load</span>
                <span style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.fg }} className="font-semibold tabular-nums">
                  {adjustedDownforce.toLocaleString()} kg
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: pal.muted }}>Total platform mass saved</span>
                <span style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.fg }} className="font-semibold tabular-nums">
                  -{netWeightSaved} kg
                </span>
              </div>
              <div
                style={{ borderColor: pal.border }}
                className="border-t pt-4 flex items-baseline justify-between gap-4"
              >
                <span style={{ color: pal.fg }} className="font-medium">
                  Configured price
                </span>
                <span
                  style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.fg }}
                  className="text-3xl font-semibold tabular-nums"
                >
                  ${totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {confirmed ? (
              <div
                style={{ borderColor: pal.accent, backgroundColor: pal.bg, borderRadius: tokens.buttonRadius }}
                className="border p-4 flex items-center justify-between gap-3 text-xs"
              >
                <span style={{ color: pal.fg }} className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 shrink-0" />
                  Build {buildCode} queued for {cleanCity} consultation.
                </span>
                <button
                  type="button"
                  onClick={() => setConfirmed(false)}
                  style={{ color: pal.muted }}
                  className="underline cursor-pointer shrink-0"
                >
                  Edit
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmed(true)}
                style={{
                  backgroundColor: pal.accent,
                  color: pal.accentFg,
                  borderRadius: tokens.buttonRadius,
                }}
                className="w-full py-3.5 px-6 text-sm font-medium cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {payload.ctaPrimary}
              </button>
            )}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
