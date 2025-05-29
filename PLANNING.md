# PLANNING.md

## 1. Project Overview

BizCalc is a suite of business calculators designed to provide insightful financial analysis for various business types. The project aims to offer a user-friendly interface, valuable contextual feedback, and clear visual cues to help users understand their financial health and identify opportunities.

## 2. Architecture

*   **Frontend:** React (Vite) with TypeScript
*   **UI Components:** Custom UI components, potentially with a UI library (to be decided).
*   **State Management:** (To be decided - e.g., Context API, Zustand, Redux Toolkit)
*   **Calculators:** Modular components located in `src/calculators/suite/`. Each calculator will handle its specific logic and UI.
*   **Contextual Feedback:** Logic for feedback will be tied to calculator results and user's business type.

## 3. Naming Conventions

*   **Components:** PascalCase (e.g., `CashflowCalculator.tsx`)
*   **Functions/Variables:** camelCase (e.g., `calculateNetProfit`)
*   **CSS/Styles:** (To be decided - e.g., CSS Modules, Styled Components)
*   **Files:** kebab-case or PascalCase depending on context (e.g., `data-models.ts`, `ProfitabilityCalculator.tsx`)

## 4. Extension Methodology

*   New calculators should be added as new sub-directories within `src/calculators/suite/`.
*   Each calculator should be self-contained as much as possible.
*   Shared utility functions should be placed in `src/utils/`.
*   Contextual feedback logic should be designed to be easily extendable for new business types or feedback rules.

## 5. UI/UX Principles

*   **Clarity:** Easy to understand inputs and outputs.
*   **Feedback:** Provide immediate and relevant feedback.
*   **Visual Cues:** Use colors, icons, and charts effectively to highlight positive results and areas for improvement.
*   **Responsiveness:** Ensure the application is usable across different screen sizes.
*   **Accessibility:** Adhere to accessibility best practices.

## 6. Core Features (Initial & Planned)
    *   User Input for Business Type
    *   **Contextual Feedback System:**
        *   Develop a modular system for delivering calculator-specific advice, warnings, and insights.
        *   Feedback logic will be triggered by calculation results and tailored to the selected `Business Type`.
        *   The system should be easily extendable for new feedback rules and business types.
    *   **Visual Cues Implementation:**
        *   Integrate visual elements (colors, icons, dynamic chart highlights) to reinforce contextual feedback and improve data interpretation.
    *   Data persistence (optional, future)
    *   User accounts (optional, future)
