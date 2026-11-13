# Mission Forge 2026 — Security & Safety Architecture

## 1. Security Overview
Mission Forge 2026 adheres to strict client-side isolation principles, preventing cross-site scripting (XSS), arbitrary code execution, and data corruption in educational classroom settings.

---

## 2. Content Security Policy (CSP) Recommendations

Deployments should enforce the following CSP headers:
```http
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: blob: https://api.nasa.gov https://*.nasa.gov https://images-assets.nasa.gov;
  connect-src 'self' https://api.nasa.gov https://ssd.jpl.nasa.gov https://images-api.nasa.gov blob:;
  media-src 'self' blob:;
  object-src 'none';
  base-uri 'self';
```

---

## 3. Storage Sanitation & Versioning
- **LocalStorage Schema Isolation:** The store is namespaced under `mission-forge-v3`.
- **Validation on Hydration:** Inflight states (such as active launch countdowns or orbital burns) are parsed and validated on startup. Any malformed or modified states revert to safe checkpoints (`check` or `missions`), preventing corrupted saves from breaking the UI.
- **No Evaluation (`eval`):** The simulator uses pure deterministic arithmetic and never evaluates user-supplied strings as code.
