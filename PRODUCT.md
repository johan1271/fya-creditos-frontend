# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Sales agents (asesores de ventas) at Fya Social Capital, self-service. They register credits they've closed and look up previously registered credits, most often from the field on a mobile phone rather than a desktop.

## Product Purpose

A credit registration and lookup tool for Fya Social Capital's sales agents: register a new credit with customer/loan details, and search/browse previously registered credits by customer name, ID number, or sales agent. Built as a technical assessment exercise (not a shipped commercial product), backed by a Spring Boot REST API.

## Positioning

Not applicable — this is an internal tool built for a technical evaluation, not a market-facing product with competitive positioning.

## Operating Context

- Primary device: mobile phone (packaged as an Android app via Capacitor). Desktop/browser access exists only for development and testing, not as a target usage context.
- Backed by a Spring Boot backend (`fya-creditos-backend`) exposing `POST /api/credits` (register) and `GET /api/credits` (paginated search).
- An async email notification fires on every registration (fire-and-forget, does not block the UI).

## Capabilities and Constraints

- Two core flows: register a credit (form) and search/browse credits (list + pagination + text search across name/ID/sales agent).
- Fields: customer name, ID number, credit amount, interest rate, term (months), sales agent, registration timestamp.
- No authentication yet (planned as a stretch item); currently open access.
- UI language: Spanish, since real-world users are Spanish-speaking. Code/comments stay in English.
- Currency/locale: Colombian pesos (COP), `es-CO` number/date formatting.

## Brand Commitments

Real brand, sourced directly from fyasocialcapital.com and the company's logo file (`logFya.png`), and now binding:

- Primary accent: "verde esencia" `#00d280` (their own CSS class name for it).
- Dark ink / hero background: `#052224`, used both as their dark-mode background and as text-on-light ink.
- Logo mark: a geometric "F" built from rounded rectangles, rendered in the primary green — used standalone (without the "FYA / SOCIAL CAPITAL" wordmark) as the app icon and splash mark, extracted from `logFya.png`.
- Deviation taken deliberately: their marketing site pairs white text on the green CTA button, which measures ~2:1 contrast (fails WCAG AA). This app pairs the same green with the dark ink (`#052224`) as contrast text instead (~9:1), keeping their exact color but not their accessibility gap.

## Evidence on Hand

- Seed data (10 sample credits) provided by the technical-test brief; used for local/demo data, not real customer records.
- `logFya.png` (user's Desktop) — the real company logo, mark + wordmark.
- fyasocialcapital.com — live marketing site, source of the brand palette above.

## Product Principles

1. Mobile-first: every screen must work great one-handed on a phone; desktop is incidental.
2. Self-service clarity: the sales agent should never be confused about whether a credit was saved or what a validation error means.
3. Match the backend contract precisely — validation messages and field constraints mirror `CreditRequest` exactly, since backend and frontend evolve together on this project.
4. Spanish-first UI, English-first code — keep the split intentional and consistent.

## Accessibility & Inclusion

No specific standard was mandated for this technical test. Baseline good practice (labeled inputs, sufficient contrast in both themes, aria-labels on icon-only buttons) is already in place from the current implementation.
