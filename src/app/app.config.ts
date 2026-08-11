import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeEsCO from '@angular/common/locales/es-CO';
import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { PreloadAllModules, provideRouter, RouteReuseStrategy, withPreloading } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { routes } from './app.routes';

registerLocaleData(localeEsCO);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es-CO' },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // Force Material Design mode everywhere: the shipped product is a
    // Capacitor Android app, so Android's real rendering is what matters.
    // Without this, Ionic auto-detects "ios" mode on Safari/iPhone (e.g. when
    // previewing on a personal iPhone, since there's no Android device on
    // hand) — and ion-input's outline fill has no iOS-mode styles at all, so
    // the rounded-outline borders we designed simply don't render there.
    provideIonicAngular({ mode: 'md' }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
  ],
};
