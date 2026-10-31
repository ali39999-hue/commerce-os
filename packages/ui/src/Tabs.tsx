import React, { createContext, useContext, useState, useId, useRef, useEffect } from "react";
import { designTokens } from "./tokens.js";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (val: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (val: string) => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  style,
  ...rest
}: TabsProps) {
  const [internalTab, setInternalTab] = useState(defaultValue || "");
  const baseId = useId();

  const activeTab = value !== undefined ? value : internalTab;

  const setActiveTab = (tab: string) => {
    if (value === undefined) {
      setInternalTab(tab);
    }
    onValueChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, baseId }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          fontFamily: designTokens.typography.fontFamily.sans.join(", "),
          boxSizing: "border-box",
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "line" | "pills";
}

export function TabList({ children, variant = "line", style, ...rest }: TabListProps) {
  const tabListRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation for tablist (Left/Right/Home/End)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(
      tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])') || []
    );
    const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);

    if (currentIndex === -1) return;

    let targetIndex = currentIndex;
    const isRtl = document.dir === "rtl" || document.documentElement.dir === "rtl";

    if (e.key === "ArrowRight") {
      targetIndex = isRtl ? (currentIndex - 1 + tabs.length) % tabs.length : (currentIndex + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      targetIndex = isRtl ? (currentIndex + 1) % tabs.length : (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      targetIndex = 0;
    } else if (e.key === "End") {
      targetIndex = tabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    tabs[targetIndex]?.focus();
    tabs[targetIndex]?.click();
  };

  const isLine = variant === "line";

  const listStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: isLine ? designTokens.spacing[6] : designTokens.spacing[2],
    borderBottom: isLine ? `2px solid ${designTokens.colors.warmMarble.border}` : "none",
    padding: isLine ? 0 : designTokens.spacing[1],
    backgroundColor: isLine ? "transparent" : designTokens.colors.warmMarble.subtle,
    borderRadius: isLine ? 0 : designTokens.radius.lg,
    position: "relative",
    boxSizing: "border-box",
    ...style,
  };

  return (
    <div
      ref={tabListRef}
      role="tablist"
      onKeyDown={handleKeyDown}
      style={listStyle}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function Tab({ value, children, disabled, style, ...rest }: TabProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tab must be used within Tabs");

  const { activeTab, setActiveTab, baseId } = context;
  const isSelected = activeTab === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  const tabStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
    fontSize: designTokens.typography.fontSize.sm,
    fontWeight: isSelected ? designTokens.typography.fontWeight.semibold : designTokens.typography.fontWeight.medium,
    color: isSelected ? designTokens.colors.clinicalTeal.DEFAULT : designTokens.colors.text.secondary,
    background: "transparent",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    outline: "none",
    transition: `all ${designTokens.transitions.fast}`,
    whiteSpace: "nowrap",
    ...style,
  };

  const lineIndicatorStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "-2px",
    insetInlineStart: 0,
    insetInlineEnd: 0,
    height: "2px",
    backgroundColor: designTokens.colors.clinicalTeal.DEFAULT,
    borderRadius: designTokens.radius.full,
    transition: `all ${designTokens.transitions.fast}`,
  };

  return (
    <button
      role="tab"
      id={tabId}
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      style={tabStyle}
      {...rest}
    >
      {children}
      {isSelected && <span style={lineIndicatorStyle} aria-hidden="true" />}
    </button>
  );
}

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabPanel({ value, children, style, ...rest }: TabPanelProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabPanel must be used within Tabs");

  const { activeTab, baseId } = context;
  const isSelected = activeTab === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  if (!isSelected) return null;

  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      tabIndex={0}
      style={{
        paddingTop: designTokens.spacing[4],
        outline: "none",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
