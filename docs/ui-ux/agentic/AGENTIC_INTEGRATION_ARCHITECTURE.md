# AGENTIC DESIGN & CODE INTEGRATION ARCHITECTURE
# Dr Dermer UK Clinical & Commerce OS — Phase 09 Synthesis Document
# Multi-Agent Workflow, MCP Servers, Skill Registry, RACI & File Ownership

> **Document Type**: Architecture Synthesis & Operational Blueprint  
> **Status**: Production Verified & Fully Synchronized  
> **Date**: 2026-11-03  
> **Canonical Canvas**: Figma Remote MCP (`https://mcp.figma.com/mcp`)  
> **Canonical Code**: Git Repository (`main` branch)

---

## 1. System Topology & Multi-Agent Network

The Dr Dermer UK engineering workflow is powered by specialized autonomous AI agents operating across distinct functional tracks:

```text
                         HUMAN PRODUCT OWNER / MEDICAL DIRECTOR
                      (Clinical Scope, Design Approval, Release Gate)
                                      |
                                      v
                         ORCHESTRATOR / TECH LEAD (A0)
                     (Task Graph, RACI, File Scope, Verification)
                                      |
              +-----------------------+-----------------------+
              |                       |                       |
              v                       v                       v
         DESIGN TRACK             CODE TRACK               QA TRACK
       UX Researcher (A2)       Frontend Implementer (A5) Visual QA Agent (A7)
       Canvas Designer (A3)     API Integrator (A6)       A11y/Security (A8)
       Design System (A4)       Repo Auditor (A1)         Release Evidence (A9)
              |                       |                       |
              v                       v                       v
        FIGMA CANVAS  <------->  GIT REPOSITORY  <------>  PLAYWRIGHT/CI
       Variables/Frames           Code/Tokens/Tests        Live Verification
```

---

## 2. MCP Server Configuration

Standardized across **Claude Code**, **Cursor**, and **Codex**:

| MCP Server | Protocol / Command | Canonical URL / Package | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **Figma** | HTTP SSE / Stream | `https://mcp.figma.com/mcp` | Inspect frames, read design variables, auto layout mapping |
| **Playwright**| CLI stdio process | `npx -y @playwright/mcp@0.0.60` | Browser automation, viewport snapshots, A11y trees |
| **Context7** | HTTP SSE / Stream | `https://mcp.context7.com/mcp` | Real-time library documentation and framework API updates |

Configuration files established:
- Project Claude Code: `.mcp.json`
- Project Cursor: `.cursor/mcp.json`
- Synchronization Runner: `scripts/sync-skills.mjs`

---

## 3. The 13 Canonical Dr Dermer Phase 09 Skills

All 13 specialized skills reside canonically in `.agents/skills/` and are synchronized automatically to `.claude/skills/`:

1. **`drdermer-orchestrator`**: Multi-agent task orchestration, RACI matrix, file ownership lock, and Gates 0 to 8 pipeline enforcement.
2. **`drdermer-repo-audit`**: Ground-truth repository auditing, route inventory validation, component inspection, and mock-data detection.
3. **`drdermer-design-research`**: Clinical UX research, patient vs B2B audience segmentation, messaging hierarchy, and Gate 1 Brief creation.
4. **`drdermer-figma-canvas`**: Native Figma canvas structuring, variables, auto layout, component variants, and semantic layer naming.
5. **`drdermer-design-system`**: Design tokens, dark clinical palette, atomic components, Storybook stories, and Figma Code Connect.
6. **`drdermer-design-to-code`**: Direct translation of approved Figma frames to clean React/Next.js components with zero design drift.
7. **`drdermer-frontend-implementation`**: Full vertical slice implementation, 5 UI states (loading/empty/interactive/error/success), and responsive reflow.
8. **`drdermer-api-integration`**: Connecting NestJS backend APIs, DTO contracts, zero mock assumption, and resilient network error boundaries.
9. **`drdermer-rtl-responsive`**: Persian RTL logical layout, Vazirmatn tabular typography, zero horizontal overflow, and 5 viewports (360, 390, 768, 1280, 1440px).
10. **`drdermer-visual-qa`**: Automated & manual visual QA, Playwright MCP inspection, deterministic multi-viewport screenshots, and baseline diffing.
11. **`drdermer-accessibility`**: WCAG 2.2 AA compliance, keyboard navigation, focus management, and screen reader announcements.
12. **`drdermer-security-review`**: Zero PII/credential leaks, Modulo-11 Iranian National ID validation, Shaparak gateway isolation, and synthetic test account management.
13. **`drdermer-release-gate`**: Production deployment gating, evidence bundling, CI/build verification, rollback runbooks, and Definition of Done validation.

---

## 4. File Ownership & Conflict Prevention Protocol (RACI)

To eliminate race conditions and concurrent write collisions across multiple subagents:

| Role / Agent | Allowed Paths (Write) | Forbidden Paths | Reviewer |
| :--- | :--- | :--- | :--- |
| **A0 Orchestrator** | `docs/ui-ux/roadmap/`, `docs/ui-ux/agentic/` | Production code files | Human Tech Lead |
| **A1 Auditor / A2 UX** | `docs/ui-ux/audit/`, `docs/ui-ux/pilots/` | `apps/`, `packages/` | A0 Orchestrator |
| **A3 Designer / A4 DS** | `.agents/skills/`, `packages/ui/` | Backend logic, DB migrations | A0 Orchestrator |
| **A5 Frontend** | `apps/storefront/` (scoped route only) | `apps/api/`, global design tokens | A7 Visual QA, A8 A11y |
| **A6 Backend Integrator**| `apps/api/`, `packages/domain/` | Frontend layout styling | A8 Security Reviewer |
| **A7 QA / A9 Release** | `docs/ui-ux/testing/`, test reports | Production source code | Human Product Owner |

---

## 5. Pilot 01 Verification Summary

- **Components Audited & Verified**:
  - Global Header (`apps/storefront/components/header.tsx`)
  - Clinical Hero Banner (`apps/storefront/components/home/hero-banner.tsx`)
  - Audience Path Selector (`apps/storefront/components/home/path-selector.tsx`)
- **Automated Validation Results**:
  - Next.js Production Build: **43/43 routes passed** with 0 errors.
  - Clinical Store E2E Suite: **10/10 lifecycle stages passed** (`scripts/verify-clinical-store.mjs`).
  - High-Concurrency API Load Test: **3/3 endpoints passed** (p95 <= 139ms) (`scripts/load-check.mjs`).
  - Skill Synchronization: **35 total skills synchronized** to `.claude/skills/`.
