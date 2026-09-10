# Home&Garden Delivery Hub — Initial Prototype

Front-end prototype configured specifically for the GitHub repository:

- GitHub user: `shihaabbb6-svg`
- Repository: `Delivery`
- GitHub Pages base path: `/Delivery/`

## Demo users

| Role | Username | Password |
| --- | --- | --- |
| Admin | `admin` | `admin123` |
| Delivery Head | `head` | `head123` |
| Salesperson | `sale1` | `sale123` |
| Salesperson | `sale2` | `sale123` |
| Driver | `driver1` | `driver123` |
| Drivers 2–5 | `driver2` … `driver5` | `driver123` |

## First GitHub upload

Upload the **contents of this folder**, not the ZIP file itself, to the root of the `Delivery` repository.

The repository root should contain at least:

- `.github/workflows/deploy-pages.yml`
- `src/`
- `index.html`
- `package.json`
- `vite.config.js`
- `README.md`

> Important: `.github` is a hidden folder on some computers. Make sure it is included in the GitHub upload.

## Enable GitHub Pages

After the files are committed:

1. Open the `Delivery` repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Open the repository **Actions** tab.
5. Wait for **Deploy to GitHub Pages** to finish successfully.
6. GitHub will show the live Pages URL in the deployment.

Expected site address:

`https://shihaabbb6-svg.github.io/Delivery/`

## Local development

```bash
npm install
npm run dev
```

## Prototype features

- Role-based demo login: Admin, Delivery Head, Salesperson, Driver
- Shared daily capacity of 20 deliveries
- AR01–AR05 showroom selection
- Salesperson automatically filled from logged-in user
- All booked deliveries visible while choosing a delivery date
- Optional map location and Location Pending status
- Delivery Head/Admin driver and truck assignment
- Nearby-area suggestions during driver assignment
- Requested customer time is informational only and never used by suggestion logic
- Driver delivery outcomes: Delivered, Could Not Deliver, Couldn't Complete Delivery
- Reasons for unsuccessful/incomplete delivery
- Action Required workflow
- Rescheduling with slot transfer and capacity validation
- Activity history
- Salesperson delivery tracking

## Important

This version stores demo data and login information in the browser. It is for workflow testing only. Do not use real customer information yet. Production will require a secure backend, database, authentication, server-side permissions and proper audit storage.
