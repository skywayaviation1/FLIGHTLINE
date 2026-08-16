# CREW ONSITE email wording update

Apply this change in **skywayaviation1/skyway-Ops** (`src/App.jsx`, `buildStatusEmail` → `case 'crew_onsite'`).

This cloud agent cannot push to `skyway-Ops`, so the update is provided here as a patch.

## New email copy (revenue legs)

**Subject:** `Aircraft/Crew Arrival Notification — {tail} {route}`

**Body:**

> The aircraft and/or crew has arrived at the FBO at {local time} and is preparing the aircraft for your passengers. We will notify you when the aircraft is ready.

## Apply

```bash
cd skyway-Ops
git apply path/to/patches/crew-onsite-email.patch
```

Or merge the equivalent wording into `buildStatusEmail` for both revenue and repositioning CREW ONSITE emails.
