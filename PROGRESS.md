# Helix Academy CBT Simulator Progress

Last updated: September 21, 2026

## CONFIRMED WORKING

- Supabase environment variables: Vercel and Supabase are connected.
- `candidates` table.
- `mocks` table: reused and unmodified.
- Mock creation from the Admin Dashboard.
- Draft Mocks listing on the Mock dashboard.
- Supabase permissions and policies for the above features.

## NOT YET BUILT OR CONFIRMED

- Opening a saved Draft Mock: Mock detail page.
- Adding subjects to a Mock.
- Import versus Generate mode selection per subject.
- Subject status or sync toggle.
- Question generation: Neural Engine.
- Preview and self-test mode.
- Tab-switch detection settings.
- Publish flow.
- Candidate-side Mock and Test access.
- Quiz interface, timer, and results.

## NEXT STEP

Build “Open a saved Draft Mock”.

Clicking a Draft or Published Mock from the dashboard list should open a dedicated Mock detail page scoped to that one Mock.

All remaining steps will happen on this page in future stages:

- Adding subjects.
- Configuring import or generate mode.
- Sync toggles.
- Preview mode.
- Tab-switch rules.
- Publishing.

This page is only the container and entry point for now. No subject configuration or publishing functionality should be added in this step.

## DATABASE SAFETY RULE

Do not delete, rename, or modify any existing database table without telling the project owner first.

The existing `mocks` table is being reused. Any missing column or required database change must be reported before applying SQL.

## WORKFLOW

The project owner is not expected to write code. For each feature:

1. Provide the exact file path.
2. Provide complete copyable code.
3. Explain exactly where to paste it.
4. Explain how to test it.
5. Stop and wait for confirmation before building the next feature.
