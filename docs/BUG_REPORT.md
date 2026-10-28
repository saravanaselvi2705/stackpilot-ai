# StackPilot AI v1.1 – Quality Assurance Defect & Bug Tracking Log
**Release Candidate (RC1) Defect Management Database**

---

## Overview

This bug report captures all identified defects, edge-case vulnerabilities, and optimization opportunities discovered during the enterprise QA audit of **StackPilot AI v1.1 Business Operating System**.

---

## Detailed Bug Log

### Bug ID: BUG-001
- **Module:** Security & Deployment Infrastructure
- **Screen:** Global Server Middleware (`apps/api/src/server.ts`)
- **Description:** Default CORS policy permits wildcards (`*`) if `FRONTEND_URL` environment variable is omitted in environment setup.
- **Steps to Reproduce:**
  1. Start backend without specifying `FRONTEND_URL` in `.env`.
  2. Send cross-origin request from an untrusted origin.
  3. Inspect `Access-Control-Allow-Origin` header in HTTP response.
- **Expected Result:** API should default to strict white-listed origin (e.g. `http://localhost:5173`) when `FRONTEND_URL` is undefined.
- **Actual Result:** API returns `Access-Control-Allow-Origin: *`.
- **Severity:** Medium
- **Priority:** High
- **Suggested Fix:** Update `server.ts` fallback origin: `origin: process.env.FRONTEND_URL || 'http://localhost:5173'`.
- **Status:** Open (Resolved in Deployment Checklist)

---

### Bug ID: BUG-002
- **Module:** Navigation & Universal Search
- **Screen:** Global Navigator (`UniversalSearch.tsx`)
- **Description:** Rapid keypress typing triggers multi-request state re-evaluations without input debouncing.
- **Steps to Reproduce:**
  1. Press `Cmd + K` to open Universal Search.
  2. Rapidly type 10 characters in less than 500ms.
  3. Observe component trigger re-renders on every keystroke.
- **Expected Result:** Input query should be debounced by 250ms–300ms before executing cross-module search.
- **Actual Result:** Search state updates synchronously per keydown event.
- **Severity:** Low
- **Priority:** Medium
- **Suggested Fix:** Wrap filter execution in a `useDebounce` hook or standard `setTimeout` ref.
- **Status:** Open (Minor Performance Optimization)

---

### Bug ID: BUG-003
- **Module:** Employee Personal Workspace (My Work)
- **Screen:** Time Logger Widget (`MyWork.tsx`)
- **Description:** Manually typing negative values into manual duration override inputs permits negative hours entry.
- **Steps to Reproduce:**
  1. Open `/my-work` workspace.
  2. Click on Time Tracker.
  3. Manually edit input field to `-2.5`.
  4. Click "Save Hours".
- **Expected Result:** Form validation should clamp negative inputs to `0.25` hours minimum.
- **Actual Result:** Time entry submits negative value if typed directly into text input.
- **Severity:** Low
- **Priority:** Medium
- **Suggested Fix:** Add `Math.max(0.25, Math.abs(inputValue))` validation before calling `API.timesheets.create()`.
- **Status:** Open (Form Validation Fix)

---

### Bug ID: BUG-004
- **Module:** User Interface & Dark Theme
- **Screen:** Global Modal Dialogs (`UI.tsx` & `Modal.tsx`)
- **Description:** Modal border token in dark mode (`border-slate-800`) shows low contrast against `#0B0F17` dark background on high-DPI displays.
- **Steps to Reproduce:**
  1. Toggle application to Dark Mode.
  2. Trigger any modal (e.g. Add Client or Create Document).
  3. Inspect border contrast around modal container.
- **Expected Result:** Modal border should use high-contrast token (`border-slate-700/80`).
- **Actual Result:** Modal border appears faint against dark backdrop.
- **Severity:** Low
- **Priority:** Low
- **Suggested Fix:** Update modal container class from `border-slate-800` to `border-slate-700/80`.
- **Status:** Open (UI Polish)

---

### Bug ID: BUG-005
- **Module:** Documents (DMS)
- **Screen:** Document Creation Modal (`Documents.tsx`)
- **Description:** Submitting document with whitespace-only content creates empty document entry.
- **Steps to Reproduce:**
  1. Open `/documents` page.
  2. Click "Create Document".
  3. Enter Title: "Test Doc", Content: "   " (space characters).
  4. Submit form.
- **Expected Result:** Validation alert should require non-empty text content.
- **Actual Result:** Document is created with empty string content.
- **Severity:** Low
- **Priority:** Low
- **Suggested Fix:** Add `docContent.trim().length === 0` check in `handleCreateDoc`.
- **Status:** Open (Form Validation Fix)

---

## Defect Severity Breakdown Summary

| Severity Level | Count | Resolved | Pending Action |
| :--- | :---: | :---: | :---: |
| **Critical** | 0 | 0 | 0 |
| **High** | 1 | 0 | 1 (Deployment checklist fix) |
| **Medium** | 2 | 0 | 2 (Optimization fixes) |
| **Low** | 2 | 0 | 2 (Minor UI/Validation polish) |
| **Total Issues Identified** | **5** | **0** | **5 (Non-blocking)** |

---

## Release Recommendation Matrix

- **Blocker Count:** `0`
- **Critical Count:** `0`
- **Release Status:** **APPROVED FOR RC1 DEPLOYMENT**

---
*Report Generated: 2026-07-30 | StackPilot AI QA Engineering Team*
