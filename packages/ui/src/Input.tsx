import React, { forwardRef, useState, useId } from "react";
import { designTokens } from "./tokens.js";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  floatingLabel?: boolean;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  isRtlNumber?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    floatingLabel = false,
    error,
    helperText,
    leftIcon,
    rightIcon,
    fullWidth = true,
    isRtlNumber = false,
    disabled = false,
    id: externalId,
    value,
    defaultValue,
    style,
    onFocus,
    onBlur,
    onChange,
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const inputId = externalId || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const [isFocused, setIsFocused] = useState(false);
  const [internalVal, setInternalVal] = useState(value ?? defaultValue ?? "");

  const hasValue = String(value !== undefined ? value : internalVal).length > 0;
  const isFloatingActive = isFocused || hasValue;

  const containerStyle: React.CSSProperties = {
    display: fullWidth ? "flex" : "inline-flex",
    flexDirection: "column",
    width: fullWidth ? "100%" : "auto",
    position: "relative",
    fontFamily: designTokens.typography.fontFamily.sans.join(", "),
    boxSizing: "border-box",
  };

  const inputWrapperStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
    backgroundColor: disabled ? designTokens.colors.deepSlate[100] : designTokens.colors.surface.card,
    border: `1.5px solid ${
      error
        ? designTokens.colors.status.danger
        : isFocused
          ? designTokens.colors.clinicalTeal.DEFAULT
          : designTokens.colors.warmMarble.border
    }`,
    borderRadius: designTokens.radius.md,
    boxShadow: isFocused && !error
      ? `0 0 0 3px ${designTokens.colors.clinicalTeal.tint}`
      : isFocused && error
        ? `0 0 0 3px ${designTokens.colors.status.dangerBg}`
        : "none",
    transition: `border-color ${designTokens.transitions.fast}, box-shadow ${designTokens.transitions.fast}`,
    boxSizing: "border-box",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: floatingLabel ? "52px" : "40px",
    paddingTop: floatingLabel ? "18px" : "8px",
    paddingBottom: floatingLabel ? "6px" : "8px",
    paddingInlineStart: leftIcon ? designTokens.spacing[8] : designTokens.spacing[3],
    paddingInlineEnd: rightIcon ? designTokens.spacing[8] : designTokens.spacing[3],
    fontSize: designTokens.typography.fontSize.sm,
    color: disabled ? designTokens.colors.text.muted : designTokens.colors.text.primary,
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    boxSizing: "border-box",
    direction: isRtlNumber ? "rtl" : undefined,
    fontVariantNumeric: isRtlNumber ? "tabular-nums" : undefined,
    cursor: disabled ? "not-allowed" : "text",
    ...style,
  };

  const floatingLabelStyle: React.CSSProperties = {
    position: "absolute",
    insetInlineStart: leftIcon ? designTokens.spacing[8] : designTokens.spacing[3],
    top: isFloatingActive ? "6px" : "50%",
    transform: isFloatingActive ? "none" : "translateY(-50%)",
    fontSize: isFloatingActive ? designTokens.typography.fontSize.xs : designTokens.typography.fontSize.sm,
    color: error
      ? designTokens.colors.status.danger
      : isFocused
        ? designTokens.colors.clinicalTeal.DEFAULT
        : designTokens.colors.text.muted,
    pointerEvents: "none",
    transition: `all ${designTokens.transitions.fast}`,
    fontWeight: isFloatingActive ? designTokens.typography.fontWeight.medium : designTokens.typography.fontWeight.normal,
  };

  return (
    <div style={containerStyle}>
      {label && !floatingLabel && (
        <label
          htmlFor={inputId}
          style={{
            marginBottom: designTokens.spacing[1],
            fontSize: designTokens.typography.fontSize.sm,
            fontWeight: designTokens.typography.fontWeight.medium,
            color: designTokens.colors.text.primary,
          }}
        >
          {label}
        </label>
      )}

      <div style={inputWrapperStyle}>
        {floatingLabel && label && (
          <label htmlFor={inputId} style={floatingLabelStyle}>
            {label}
          </label>
        )}

        {leftIcon && (
          <span
            style={{
              position: "absolute",
              insetInlineStart: designTokens.spacing[3],
              display: "flex",
              alignItems: "center",
              color: isFocused ? designTokens.colors.clinicalTeal.DEFAULT : designTokens.colors.text.muted,
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          style={inputStyle}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onChange={(e) => {
            setInternalVal(e.target.value);
            onChange?.(e);
          }}
          {...rest}
        />

        {rightIcon && (
          <span
            style={{
              position: "absolute",
              insetInlineEnd: designTokens.spacing[3],
              display: "flex",
              alignItems: "center",
              color: isFocused ? designTokens.colors.clinicalTeal.DEFAULT : designTokens.colors.text.muted,
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            {rightIcon}
          </span>
        )}
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          style={{
            margin: `${designTokens.spacing[1]} 0 0`,
            fontSize: designTokens.typography.fontSize.xs,
            color: designTokens.colors.status.danger,
          }}
        >
          {error}
        </p>
      )}

      {!error && helperText && (
        <p
          id={helperId}
          style={{
            margin: `${designTokens.spacing[1]} 0 0`,
            fontSize: designTokens.typography.fontSize.xs,
            color: designTokens.colors.text.muted,
          }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    error,
    helperText,
    fullWidth = true,
    disabled = false,
    id: externalId,
    rows = 4,
    style,
    onFocus,
    onBlur,
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const textareaId = externalId || generatedId;
  const errorId = `${textareaId}-error`;
  const helperId = `${textareaId}-helper`;

  const [isFocused, setIsFocused] = useState(false);

  const containerStyle: React.CSSProperties = {
    display: fullWidth ? "flex" : "inline-flex",
    flexDirection: "column",
    width: fullWidth ? "100%" : "auto",
    fontFamily: designTokens.typography.fontFamily.sans.join(", "),
    boxSizing: "border-box",
  };

  const textareaStyle: React.CSSProperties = {
    width: "100%",
    padding: designTokens.spacing[3],
    fontSize: designTokens.typography.fontSize.sm,
    fontFamily: "inherit",
    color: disabled ? designTokens.colors.text.muted : designTokens.colors.text.primary,
    backgroundColor: disabled ? designTokens.colors.deepSlate[100] : designTokens.colors.surface.card,
    border: `1.5px solid ${
      error
        ? designTokens.colors.status.danger
        : isFocused
          ? designTokens.colors.clinicalTeal.DEFAULT
          : designTokens.colors.warmMarble.border
    }`,
    borderRadius: designTokens.radius.md,
    outline: "none",
    boxShadow: isFocused && !error
      ? `0 0 0 3px ${designTokens.colors.clinicalTeal.tint}`
      : isFocused && error
        ? `0 0 0 3px ${designTokens.colors.status.dangerBg}`
        : "none",
    transition: `border-color ${designTokens.transitions.fast}, box-shadow ${designTokens.transitions.fast}`,
    boxSizing: "border-box",
    resize: "vertical",
    cursor: disabled ? "not-allowed" : "text",
    ...style,
  };

  return (
    <div style={containerStyle}>
      {label && (
        <label
          htmlFor={textareaId}
          style={{
            marginBottom: designTokens.spacing[1],
            fontSize: designTokens.typography.fontSize.sm,
            fontWeight: designTokens.typography.fontWeight.medium,
            color: designTokens.colors.text.primary,
          }}
        >
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        style={textareaStyle}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />

      {error && (
        <p
          id={errorId}
          role="alert"
          style={{
            margin: `${designTokens.spacing[1]} 0 0`,
            fontSize: designTokens.typography.fontSize.xs,
            color: designTokens.colors.status.danger,
          }}
        >
          {error}
        </p>
      )}

      {!error && helperText && (
        <p
          id={helperId}
          style={{
            margin: `${designTokens.spacing[1]} 0 0`,
            fontSize: designTokens.typography.fontSize.xs,
            color: designTokens.colors.text.muted,
          }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
});
