# AGENTS.md

## Project

Ionic + Angular frontend for a credit registration/lookup technical test (Fya Social Capital). Consumes the `fya-creditos-backend` API (separate repo) for auth, registering credits, and searching them. Ships two ways: as a web app, and as a Capacitor Android app (the deliverable APK).

## Structure

```
src/app/
  core/
    guards/         authGuard / guestGuard — route-level, check AuthStore.isAuthenticated()
    interceptors/    authInterceptor (attaches Bearer token, handles 401 -> logout + toast),
                     errorInterceptor (logs failures)
    theme/           ThemeService — light/dark, persisted + system-preference fallback
  features/
    auth/            login page, AuthStore (token/user signals, backed by localStorage)
    credits/
      pages/         credit-list (search + cards/table switch), register-credit
      components/    credit-card, credits-table, view-mode-switch, pagination-controls
      services/      CreditsStore (signals-based state + client-side page cache), CreditApiService
      mappers/       DTO -> domain Credit mapping, incl. the client-side monthly-payment calculation
  shared/
    components/      brand-icon, logout-button, theme-toggle — small reusable UI pieces
    pipes/           copCurrency (COP currency formatting)
  tabs/              bottom tab shell (Buscar / Registrar)
src/theme/variables.scss   All theme tokens (light + dark), Ionic component overrides
src/index.html             Boot splash markup/script (see "Conventions" below)
android/                    Capacitor-generated native project — see "Do not touch"
```

## Commands

- Install deps: `npm install`
- Dev server: `npm start` (`ng serve --port 8100`, talks to `http://localhost:8080`)
- Production web build: `npm run build -- --configuration production` (bundles against `environment.prod.ts` — the live Render backend)
- Sync into the Android native project: `npx cap sync android`
- Debug APK: `cd android && ./gradlew.bat assembleDebug` (Windows) / `./gradlew assembleDebug` (macOS/Linux)
- Signed release APK: `cd android && ./gradlew.bat assembleRelease` — requires `android/keystore.properties` to exist (gitignored, never committed); see the README for how to generate one
- Install on a connected device: `adb install -r <path-to-apk>`
- Lint: `npm run lint`

## Conventions

- **Standalone everything** — no `NgModule`s. New components/pages/pipes use `@Component({ imports: [...] })` directly.
- **Signals over RxJS state** — `CreditsStore`/`AuthStore`/`ThemeService` hold state in `signal()`/`computed()`; RxJS is used for the HTTP calls themselves (`HttpClient`, interceptors), not as a state container.
- **Signal Forms** (`@angular/forms/signals`) for the login and register-credit forms, not `ReactiveFormsModule`.
- **`ion-*` components force `mode: 'md'`** app-wide (`provideIonicAngular({ mode: 'md' })` in `app.config.ts`) — the shipped product is Android/Capacitor, and Ionic's iOS mode is missing styles for some variants used here (e.g. outline-fill `ion-input` has no iOS styling at all). Don't remove this without re-testing every `ion-*` component on both modes.
- **Ionic's CSS custom-property fallbacks bottom out in hardcoded, unthemed grays** for several components (searchbar, tab bar, card color, input outline border) when the app's own palette doesn't define the intermediate `--ion-*-step-*` tokens Ionic relies on internally. `src/theme/variables.scss` has explicit overrides for each one found so far — if a new `ion-*` component looks unstyled/gray in one theme, check the shipped component's own `.md.css` source in `node_modules/@ionic/core` before assuming it's a bug in this app's CSS.
- **`ion-searchbar` renders its input in light DOM here** (Stencil "scoped" mode, not Shadow DOM) — plain CSS descendant selectors reach it directly, no `::part()` needed. Other `ion-*` components in this build may or may not use real Shadow DOM; check before assuming either way (`el.shadowRoot` in the console settles it).
- **Client-side page cache in `CreditsStore`** — `search()` caches responses by `term::page::size` so revisiting a page (table pagination, or switching cards<->table when already on page 0) doesn't refetch. Cleared on `register()`, since a new credit shifts every page's content. Keep this in mind before adding a new code path that mutates credits server-side.
- **Boot splash is two layers, not one** — a static one in `index.html` (covers before Angular bootstraps) and an Angular-rendered one in `app.component` (covers route resolution / lazy chunk load, until the first `NavigationEnd`). Both need to stay pixel-identical (same logo sizing/position) or the handoff between them is visible.
- Currency formatting always goes through `CopCurrencyPipe`, never ad-hoc `toLocaleString`/`Intl` calls in a component.
- Exact dependency versions in `package.json` — no `^`/`~` ranges.

## Do not touch

- `android/` — generated/managed by Capacitor. Don't hand-edit generated files; re-run `npx cap sync android` after changing web assets. (`android/app/build.gradle`'s `signingConfigs` block is hand-written and *is* meant to be edited/committed — it just reads from the gitignored `keystore.properties`, it doesn't contain secrets itself.)
- `android/keystore.properties`, `android/*.keystore` — gitignored, contain the release-signing password. Never commit real values; regenerate locally if lost (a new key means a new APK identity, not a problem for this test's one-off distribution).
- `www/` — build output.

## Environment gotchas

- **Node 22** expected.
- **`environment.ts` vs `environment.prod.ts`** — only the `--configuration production` build points at the live Render backend; a plain `ng build`/`ng serve` talks to `localhost:8080`. Make sure the backend is running locally for dev, or you'll see 401s/network errors that look like a frontend bug but aren't.
- **Debug and release APKs have different signing certs** — installing a release APK over a debug install of the same `applicationId` fails; `adb uninstall com.fya.creditos` first.
- **Render free tier cold start** — the first API call after ~15 min of backend inactivity can take 30-60s. Don't mistake that for a broken build when testing the APK after a break.
- **Rate limiting is backend-side** (20 req/min/IP) — rapid manual re-testing (register/search loops) can hit `429`; it's not a frontend bug if it does.
