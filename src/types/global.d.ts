// Global type declarations for the application

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

// Documentation modules
declare module '*/calculator-guides/*' {
  const content: any;
  export default content;
}

declare module '*/case-studies/*' {
  const content: any;
  export default content;
}

declare module '*/faqs/*' {
  const content: any;
  export default content;
}

declare module '*/financial-concepts/*' {
  const content: any;
  export default content;
}

declare module '*/glossary/*' {
  const content: any;
  export default content;
}

declare module '*/how-to-guides/*' {
  const content: any;
  export default content;
}

// For the CashFlowForm unused index parameters
// We'll suppress these specific errors using @ts-ignore comments
// since they're not critical and don't affect functionality
