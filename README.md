🇬🇧 English | 🇪🇸 [Español](#español)

# fya-creditos-frontend

Ionic + Angular frontend for Fya Social Capital's credit registration/lookup technical test. Ships as a web app and as a Capacitor Android app.

- **Backend repo:** https://github.com/johan1271/fya-creditos-backend
- **Live backend API:** https://fya-creditos-backend.onrender.com
- **Live web app:** https://fya-creditos-frontend.netlify.app
- **Signed Android APK:** https://github.com/johan1271/fya-creditos-frontend/releases/tag/v1.1.0
- **Test credentials:** see the [backend README](https://github.com/johan1271/fya-creditos-backend#test-credentials)

## Stack

- Angular 21 (standalone components, Signals, Signal Forms)
- Ionic 8 (`@ionic/angular/standalone`)
- Capacitor 8 — Android target
- RxJS for HTTP/async flows

## Prerequisites

- Node.js 22
- For building/running the Android app: Android Studio or just the Android SDK (`ANDROID_HOME` set, `platform-tools` on `PATH`) + JDK 21

## Running locally (web)

```bash
npm install
npm start          # ng serve --port 8100, talks to http://localhost:8080 (see environment.ts)
```

Requires the backend running locally on port 8080 (see the backend repo), or edit `src/environments/environment.ts` to point elsewhere.

## Building the Android app

```bash
npm run build -- --configuration production   # bundles against environment.prod.ts (the live Render backend)
npx cap sync android
```

**Debug build** (for local testing on an emulator/device, unsigned):
```bash
cd android
./gradlew.bat assembleDebug     # Windows
# ./gradlew assembleDebug       # macOS/Linux
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

**Release build** (signed, what's published in GitHub Releases):
```bash
# One-time: generate a keystore and keystore.properties (never committed — see .gitignore)
keytool -genkeypair -v -keystore android/fya-release.keystore -alias fya \
  -keyalg RSA -keysize 2048 -validity 10000

cat > android/keystore.properties <<EOF
storeFile=../fya-release.keystore
storePassword=<your-password>
keyAlias=fya
keyPassword=<your-password>
EOF

cd android
./gradlew.bat assembleRelease
# output: app/build/outputs/apk/release/app-release.apk
```

Without `android/keystore.properties` present, `assembleRelease` still runs but produces an **unsigned** APK that Android won't install.

## Web deploy (Netlify)

`netlify.toml` at the repo root has the build command, publish directory, and the SPA fallback redirect Angular's router needs (a direct load/refresh on a path like `/tabs/register` must serve `index.html`, not 404). Once linked (`netlify link`), deploy with:

```bash
netlify deploy --dir=www --prod
```

The backend's CORS config needs the deployed origin in its allowed list (`CORS_ALLOWED_ORIGINS` — see the backend README) or the browser blocks every API call with a CORS error even though the page itself loads fine.

## Environments

| File | Used by | `apiUrl` |
|---|---|---|
| `src/environments/environment.ts` | `ng serve` / dev builds | `http://localhost:8080/api` |
| `src/environments/environment.prod.ts` | `--configuration production` (what the APK ships with) | `https://fya-creditos-backend.onrender.com/api` |

## Features

- JWT login (guarded routes, auto-logout + toast on token expiry)
- Search credits with debounced text search, infinite scroll (cards) or paginated table view, both with client-side caching to avoid redundant requests
- Register a credit with client-side validation matching the backend's rules
- Calculated monthly payment (French amortization) shown on both cards and the table — computed client-side, not stored by the API
- Light/dark theme (persisted preference + system fallback)
- Boot splash covering the cold-start gap before the app's first route renders

## Español

# fya-creditos-frontend

Frontend Ionic + Angular para la prueba técnica de registro/consulta de créditos de Fya Social Capital. Se distribuye como app web y como app de Android vía Capacitor.

- **Repo del backend:** https://github.com/johan1271/fya-creditos-backend
- **API del backend en vivo:** https://fya-creditos-backend.onrender.com
- **App web en vivo:** https://fya-creditos-frontend.netlify.app
- **APK firmado de Android:** https://github.com/johan1271/fya-creditos-frontend/releases/tag/v1.1.0
- **Credenciales de prueba:** ver el [README del backend](https://github.com/johan1271/fya-creditos-backend#credenciales-de-prueba)

## Stack

- Angular 21 (componentes standalone, Signals, Signal Forms)
- Ionic 8 (`@ionic/angular/standalone`)
- Capacitor 8 — target Android
- RxJS para flujos HTTP/async

## Prerrequisitos

- Node.js 22
- Para compilar/correr la app de Android: Android Studio o solo el SDK de Android (`ANDROID_HOME` configurado, `platform-tools` en el `PATH`) + JDK 21

## Correr en local (web)

```bash
npm install
npm start          # ng serve --port 8100, apunta a http://localhost:8080 (ver environment.ts)
```

Requiere el backend corriendo en local en el puerto 8080 (ver el repo del backend), o edita `src/environments/environment.ts` para apuntar a otro lado.

## Compilar la app de Android

```bash
npm run build -- --configuration production   # compila contra environment.prod.ts (el backend de Render en vivo)
npx cap sync android
```

**Build debug** (para probar en emulador/dispositivo local, sin firmar):
```bash
cd android
./gradlew.bat assembleDebug     # Windows
# ./gradlew assembleDebug       # macOS/Linux
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

**Build release** (firmado, el que se publica en GitHub Releases):
```bash
# Una sola vez: generar un keystore y keystore.properties (nunca se commitea — ver .gitignore)
keytool -genkeypair -v -keystore android/fya-release.keystore -alias fya \
  -keyalg RSA -keysize 2048 -validity 10000

cat > android/keystore.properties <<EOF
storeFile=../fya-release.keystore
storePassword=<tu-password>
keyAlias=fya
keyPassword=<tu-password>
EOF

cd android
./gradlew.bat assembleRelease
# resultado: app/build/outputs/apk/release/app-release.apk
```

Sin `android/keystore.properties` presente, `assembleRelease` corre igual pero genera un APK **sin firmar** que Android no va a instalar.

## Deploy web (Netlify)

`netlify.toml` en la raíz del repo tiene el comando de build, el directorio a publicar, y el redirect de SPA que necesita el router de Angular (una carga directa o un refresh en una ruta como `/tabs/register` debe servir `index.html`, no dar 404). Una vez vinculado (`netlify link`), se despliega con:

```bash
netlify deploy --dir=www --prod
```

La configuración de CORS del backend necesita el dominio desplegado en su lista de permitidos (`CORS_ALLOWED_ORIGINS` — ver el README del backend) o el navegador bloquea todas las peticiones a la API con un error de CORS aunque la página cargue bien.

## Entornos

| Archivo | Usado por | `apiUrl` |
|---|---|---|
| `src/environments/environment.ts` | `ng serve` / builds de desarrollo | `http://localhost:8080/api` |
| `src/environments/environment.prod.ts` | `--configuration production` (con el que se compila el APK) | `https://fya-creditos-backend.onrender.com/api` |

## Funcionalidades

- Login con JWT (rutas protegidas, cierre de sesión automático + toast cuando el token vence)
- Búsqueda de créditos con debounce, scroll infinito (vista cards) o tabla paginada, ambas con cache del lado del cliente para evitar peticiones redundantes
- Registro de crédito con validaciones del lado del cliente que coinciden con las reglas del backend
- Cuota mensual calculada (amortización francesa) en cards y tabla — se calcula del lado del cliente, no la devuelve la API
- Tema claro/oscuro (preferencia persistida, con fallback al del sistema)
- Splash de arranque que cubre el hueco del cold-start antes de que la app renderice su primera ruta
