# TASK.md

## Active Tasks

### 2025-05-29: Enhance Calculator Suite UI/UX and Contextual Feedback
*   **Description:** Improve features, UI, and UX of all calculators in `src/calculators/suite`. Add valuable contextual feedback specific to the user's Business Type for each calculator. Implement high-value visual cues for positive feedback and opportunities.
*   **Affected Calculators:**
    *   `cashflow`
    *   `profitability`
    *   `projections`
    *   `ratios`
    *   `burnRate`
    *   [x] Update `StartupCostEstimator.tsx` to use `src/data/businessTypes.ts`.
    *   [x] Reconcile business type list in `businessTypes.ts` (expanded to include all previous options) and update `applyTemplate` in `StartupCostEstimator.tsx` with placeholder cases for new types.
    *   [x] Add Business Type selector to `CashFlowTab.tsx` using `src/data/businessTypes.ts`.
    *   [x] Add Business Type selector to other calculators (`profitability`, `projections`, `ratios`) using `src/data/businessTypes.ts`.
    *   [x] Add Business Type selector to `BurnRate.tsx` using `src/data/businessTypes.ts`.
    *   **Phase 2: UI/UX Enhancement & Contextual Feedback (New)**
        *   [ ] **Phase 2.1: UI for Contextual Feedback - Drawer & Progress Interaction (New)**
            *   [x] **Task 1: Add/Implement Drawer Component:**
                *   [x] Investigate/choose a Drawer component (e.g., from Shadcn/ui, another library, or custom).
                *   [x] Add the selected Drawer component to `@/components/ui/` (User confirmed: Shadcn/ui Drawer added).
            *   [ ] **Task 2: Define Calculator "Completion" & Enhance Progress Interaction:**
                *   [x] For each calculator, define criteria for 100% completion (e.g., required fields filled, non-zero inputs).
                *   [x] Implement state (e.g., `isComplete` or `completionPercentage`) in `StartupCostEstimator.tsx`, `CashFlowTab.tsx`, `ProfitabilityTab.tsx`, `ProjectionsTab.tsx` & `BurnRate.tsx`.
                *   [x] Ensure Progress bar shows 100% when complete in `StartupCostEstimator.tsx`, `CashFlowTab.tsx`, `ProfitabilityTab.tsx`, `ProjectionsTab.tsx` & `BurnRate.tsx`.
                *   [x] Add a clickable element (icon button) to open the feedback drawer when complete in `StartupCostEstimator.tsx`, `CashFlowTab.tsx`, `ProfitabilityTab.tsx`, `ProjectionsTab.tsx` & `BurnRate.tsx`.
                *   [x] Implement state for drawer visibility in `StartupCostEstimator.tsx`, `CashFlowTab.tsx`, `ProfitabilityTab.tsx`, `ProjectionsTab.tsx` & `BurnRate.tsx`.
            *   [x] **Task 3: Initial Drawer Integration & Display:**
                *   [x] Pass placeholder feedback content to the Drawer in one calculator tab as an initial test.
                *   [x] Ensure the Drawer opens and closes correctly with the trigger mechanism.
        *   [ ] **Phase 2.2: Contextual Feedback System Development (was UI/UX Design & Prototyping):**
            *   [ ] Review each calculator for general layout improvements and enhanced interactivity (ongoing).
            *   [ ] Confirm contextual feedback will be displayed in the new Drawer.
            *   [ ] Consider overall user flow and consistency across calculators with the new Drawer mechanism.
        *   [ ] **Phase 2.3: Contextual Feedback Logic & Data (was Contextual Feedback System Development):**
            *   [ ] **Task 1: Define Feedback Data Structure:**
                *   [ ] Finalize data structure for feedback rules (e.g., in `src/data/feedbackRules.ts` or similar) linking `Business Type`, `calculatorType`, specific metrics/conditions, thresholds, and feedback messages (text, severity, etc.).
            *   [ ] **Task 2: Implement Core Feedback Generation Logic:**
                *   [ ] Create `src/utils/feedbackUtils.ts` (or similar).
                *   [ ] Implement a core function that takes calculator-specific data, `selectedBusinessType`, and potentially `calculatorType` to filter and return relevant `FeedbackItem[]` based on the defined rules.
            *   [ ] **Task 3: Integrate Feedback Generation into Calculators:**
                *   [ ] In each calculator, call the feedback generation logic when relevant data changes or upon completion.
                *   [ ] Pass the generated `FeedbackItem[]` to the Drawer component.
        *   [ ] **Phase 2.4: Visual Cues & Refinements (was Visual Cues Implementation):**
            *   [ ] Identify key metrics/areas in each calculator and within the feedback drawer that would benefit from visual cues.
            *   [ ] Design and implement color-coding schemes (e.g., for feedback severity in the drawer).
            *   [ ] Select or create icons for feedback items or to enhance the trigger element.
            *   [ ] Explore dynamic chart highlighting or annotations based on feedback (if applicable).
            *   [ ] **Task 4: Integrate Feedback into Import/Export:**
                *   [ ] Update `ExportData` type in `ImportExport.tsx` to include `contextualFeedback` (e.g., `FeedbackItem[]`).
                *   [ ] Modify `handleExport` to include this data.
                *   [ ] Modify `handleImport` to potentially read and utilize this data.
        *   [ ] **Integrate into Calculators:**
            *   [ ] Update `StartupCostEstimator.tsx` with UI/UX improvements, feedback system, and visual cues.
            *   [ ] Update `CashFlowTab.tsx` with UI/UX improvements, feedback system, and visual cues.
            *   [ ] Update `ProfitabilityTab.tsx` with UI/UX improvements, feedback system, and visual cues.
            *   [ ] Update `ProjectionsTab.tsx` with UI/UX improvements, feedback system, and visual cues.
            *   [ ] Update `RatiosTab.tsx` with UI/UX improvements, feedback system, and visual cues.
*   **Discovered During Work:**
    *   `PLANNING.md` and `TASK.md` were not present and have been created.
    *   `src/data` directory was created for `businessTypes.ts`.
    *   Noted discrepancy: The `businessTypes.ts` list was initially different from the full list previously hardcoded in `StartupCostEstimator`'s `Select` component. This has been reconciled: `businessTypes.ts` is now comprehensive, and `StartupCostEstimator.tsx` uses this shared list. The `applyTemplate` function has placeholder cases for the newly added types.
    *   Resolved JSX lint errors in `RatiosTab.tsx` (IDs: 8dc01901, 47d94d73, 823ded5d, 91117d0a, b3ae98a3, ef275dd7, cac9a522, 08af6dd0) related to unclosed tags after integrating Progress bar and Drawer components.

## Completed Tasks
*(No tasks completed yet)*
