---
target: credit-list feature (page + credit-card, credits-table, view-mode-switch, pagination-controls components)
total_score: 20
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 3
timestamp: 2026-08-11T22-15-55Z
slug: src-app-features-credits-pages-credit-list
---
Method: dual-agent (A: general-purpose sub-agent · B: general-purpose sub-agent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 2 | Loading skeleton is always card-shaped, even in Tabla view. |
| 2 | Match Between System & Real World | 3 | COP formatting correct, but truncated Monto values in the table read as plausible-but-wrong pesos. |
| 3 | User Control and Freedom | 1 | No retry action; a failed loadMore() destroys the entire rendered list. |
| 4 | Consistency and Standards | 2 | Cards and table expose different subsets of the same Credit; identical error/empty styling. |
| 5 | Error Prevention | 3 | Debounce and disabled prev/next at bounds handled correctly. |
| 6 | Recognition Rather Than Recall | 3 | Full ID shown, icon+label segment, undercut by illegibly small labels. |
| 7 | Flexibility and Efficiency of Use | 1 | No frozen Cliente column while scrolling a 7-column table on a 390px phone. |
| 8 | Aesthetic and Minimalist Design | 3 | Cards view is clean; table sacrifices legibility for minimalism. |
| 9 | Error Recovery | 0 | A failed background fetch wipes already-successful content, no retry. |
| 10 | Help and Documentation | 2 | No hint that the table scrolls horizontally; no first-run guidance. |
| Total | | 20/40 | Acceptable |

## Design Specificity Verdict

Category-interchangeable with a thin layer of brand paint. The stock admin-panel list pattern (searchbar + segmented toggle + infinite-scroll-cards/paginated-table) doesn't say "field sales agent, spotty-connectivity fintech." Authored touches: COP formatting, bold green tabular-nums amount as the dominant figure. Missing: credit status signal, quick call/WhatsApp action, resilience to unreliable mobile data.

Deterministic scan (CLI clean, 0 findings) plus live browser detector found real measured problems neither reviewer caught by eye:
- low-contrast: credit amount `#00d280` on white measures ~2.0:1 in light mode (card and table Monto text) — hard WCAG failure on the app's most important figure.
- undersized-ui-text: "Tarjetas"/"Tabla" segment labels measure 9.92px.
- low-contrast dark mode: muted body text `#8fa8a6` on `#134447` measures 4.3:1 (needs 4.5:1) — 1 instance in card meta, 7 in table body.
- cramped-padding: `.table-scroll` children flush against border, zero inset.
- flat-type-hierarchy in table: 12-16px range, only 1.3:1 ratio.
- Likely false positives: overused-font (100% Inter is the deliberate self-hosted brand typeface, not an untouched default); ai-color-palette ("cyan neon on dark" x20) is literally the real brand green on the dark surface; text-occlusion (last card covered by tab bar) may be a scroll-position sampling artifact, not confirmed by scrolling.

## Overall Impression

Functionally solid and visually clean at a glance, but undercut by two things: the app's proudest visual element (the green peso figure) fails contrast in light mode, and the one realistic failure mode for a field tool (dropped connection mid-scroll) currently deletes the client list with no way back.

## What's Working

1. Amount treatment (1.7rem/800/tabular-nums/brand green) is a deliberate, well-crafted hierarchy decision.
2. Infinite-scroll-for-cards / classic-pagination-for-table correctly matches interaction model to view semantics.
3. Dark mode carries brand identity faithfully; the card's consolidated aria-label pattern is genuinely good accessibility practice.

## Priority Issues

[P0] A failed loadMore() destroys the entire visible card list
- Why it matters: confirmed live by aborting the network request mid-scroll; routine occurrence for a field tool on mobile data, happens in front of the customer.
- Fix: never let a loadMore error collapse the main view; keep store.credits() rendered, append a small "Reintentar" affordance.
- Suggested command: /impeccable harden

[P1] The credit amount fails contrast in light mode
- Why it matters: #00d280 text on white measures ~2.0:1, confirmed across every card and table row; a measured defect, not stylistic.
- Fix: darken the green for light-mode text use, or pair with the dark-ink token used elsewhere for contrast text.
- Suggested command: /impeccable harden

[P1] Table's Monto column truncates at the scroll boundary with no affordance
- Why it matters: a truncated-but-plausible number risks an agent misstating a real credit amount with no visual cue.
- Fix: freeze the Cliente column and add a right-edge scroll shadow, or reorder so Monto never sits in the clipped region.
- Suggested command: /impeccable layout

[P1] Loading skeleton ignores viewMode()
- Why it matters: searching while in Tabla view flips table -> fake-cards -> table on every keystroke.
- Fix: branch skeleton markup on viewMode(); render row-shaped skeletons in table mode.
- Suggested command: /impeccable adapt

[P2] .table-scroll has zero inset padding; no sticky Cliente column; dark-mode table body text at 4.3:1
- Why it matters: three related "table is hard to parse" issues confirmed by the detector.
- Fix: add inset padding, sticky Cliente column, lighten the muted dark-mode token slightly.
- Suggested command: /impeccable layout

[P2] Cards and table show different data (rate/term missing from cards); switching views resets to page 0
- Why it matters: undermines the premise that the two views are just a display preference.
- Fix: add rate/term as secondary card metadata; preserve position across view toggles.
- Suggested command: /impeccable distill

[P3] Segment switch touch targets (38px height, 9.92px labels)
- Why it matters: the one control that reshapes the whole page, used one-handed outdoors, under standard tap-target guidance.
- Fix: raise to >=44px height, >=12px labels.
- Suggested command: /impeccable bolder

## Persona Red Flags

Riley (stress tester): killing the network mid-infinite-scroll silently destroys the visible list. Page 2 of the table surfaces test-data debris (duplicate "Cliente De Prueba" rows, nonsense entries) with no integrity signal.

Casey (distracted mobile user): view-switch touch targets fail her one-handed pattern; reloading resets to Tarjetas and loses table page position, no state persistence across interruption.

Sam (accessibility-dependent): no aria-live region on the table or "Pagina X de Y"; segment labels at 10px fail low-vision comfortable-reading expectations.

## Minor Observations

- Credit-card icon avatar uses --ion-color-secondary, not the primary brand green.
- ion-content padding-bottom:88px is a magic number tied to tab-bar height.
- Table thead isn't sticky; harmless at page size 10.
- search-row flex layout (172px fixed switch) tuned for exactly 390px; check 360px-class devices.

## Questions to Consider

1. Has anyone opened this screen on a real device after killing the connection mid-scroll?
2. If Tarjetas and Tabla are meant to be interchangeable views, why does one withhold rate/term?
3. Why does the one column that can never afford ambiguity (Monto) get truncated first?
