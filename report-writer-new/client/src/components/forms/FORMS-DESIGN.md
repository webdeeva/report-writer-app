# Report Forms Design Document

This document outlines the design and implementation plan for the Report Writer form components. These forms are used to collect user input for generating different types of reports.

## Design Goals

1. **User-Friendly**: Create intuitive forms that guide users through the report generation process
2. **Consistent Design**: Maintain a consistent look and feel across all form types
3. **Responsive**: Ensure forms work well on all device sizes
4. **Accessible**: Follow accessibility best practices for form design
5. **Validation**: Implement robust form validation to prevent errors
6. **Progressive Disclosure**: Use multi-step forms to break down complex processes

## Form Types

### 1. Yearly Report Form

The Yearly Report Form collects information needed to generate a yearly analysis report for a person.

**Fields:**
- Person selection (dropdown or search)
- Custom age option (toggle + number input)
- Report options:
  - Include astrology (checkbox)
  - Include tarot (checkbox)
  - Include numerology (checkbox)
- Analysis prompt (textarea with character count)
- Preview toggle (switch)

### 2. Life Report Form

The Life Report Form collects information needed to generate a comprehensive life analysis report for a person.

**Fields:**
- Person selection (dropdown or search)
- Report options:
  - Include astrology (checkbox)
  - Include tarot (checkbox)
  - Include numerology (checkbox)
- Life aspects to focus on (multi-select):
  - Career
  - Relationships
  - Health
  - Personal growth
  - Finances
- Analysis prompt (textarea with character count)
- Preview toggle (switch)

### 3. Relationship Report Form

The Relationship Report Form collects information needed to generate a relationship analysis report for two people.

**Fields:**
- Person 1 selection (dropdown or search)
- Person 2 selection (dropdown or search)
- Relationship type (dropdown):
  - Romantic
  - Friendship
  - Business
  - Family
- Report options:
  - Include astrology (checkbox)
  - Include tarot (checkbox)
  - Include numerology (checkbox)
- Relationship aspects to focus on (multi-select):
  - Communication
  - Compatibility
  - Challenges
  - Growth opportunities
- Analysis prompt (textarea with character count)
- Preview toggle (switch)

## Component Hierarchy

```
FormLayout
├── FormHeader
│   ├── Title
│   └── Description
├── FormBody
│   ├── FormStep (for multi-step forms)
│   │   ├── StepHeader
│   │   └── StepContent
│   ├── FormField
│   │   ├── Label
│   │   ├── Input
│   │   └── ErrorMessage
│   └── FormSection
│       ├── SectionHeader
│       └── SectionContent
├── FormFooter
│   ├── BackButton
│   ├── NextButton
│   └── SubmitButton
└── FormPreview (conditional)
    └── PreviewContent
```

## Form Field Components

### 1. PersonSelect

A searchable dropdown component for selecting a person from the user's list of people.

**Props:**
- `value`: The selected person ID
- `onChange`: Function to call when selection changes
- `label`: Field label
- `placeholder`: Placeholder text
- `error`: Error message
- `required`: Whether the field is required

### 2. OptionCheckbox

A styled checkbox component for selecting report options.

**Props:**
- `value`: Whether the option is selected
- `onChange`: Function to call when selection changes
- `label`: Option label
- `description`: Optional description of the option

### 3. MultiSelect

A component for selecting multiple options from a list.

**Props:**
- `options`: Array of available options
- `value`: Array of selected option values
- `onChange`: Function to call when selection changes
- `label`: Field label
- `placeholder`: Placeholder text
- `error`: Error message

### 4. PromptTextarea

A textarea component for entering analysis prompts with character count.

**Props:**
- `value`: The current text value
- `onChange`: Function to call when text changes
- `label`: Field label
- `placeholder`: Placeholder text
- `maxLength`: Maximum character count
- `error`: Error message
- `required`: Whether the field is required

### 5. PreviewToggle

A switch component for toggling the preview panel.

**Props:**
- `value`: Whether the preview is enabled
- `onChange`: Function to call when toggle changes
- `label`: Toggle label

## Form Layout

### Desktop Layout

- Two-column layout for larger forms (Relationship Report)
- Single column with sections for simpler forms (Yearly Report, Life Report)
- Preview panel on the right side when enabled

### Tablet Layout

- Single column layout with collapsible sections
- Preview panel below the form when enabled

### Mobile Layout

- Single column layout with collapsible sections
- Preview on separate screen accessible via button

## Form Validation

- Client-side validation using Zod or Yup schema validation
- Real-time validation feedback
- Submit button disabled until form is valid
- Error messages displayed below each field

## Form Submission Flow

1. User fills out form fields
2. Validation runs on each field change
3. User toggles preview to see report preview (optional)
4. User submits form when ready
5. Loading state shown during API request
6. Success/error feedback displayed after submission
7. On success, user is redirected to the generated report

## Accessibility Considerations

- Proper label associations with form controls
- ARIA attributes for custom form components
- Keyboard navigation support
- Focus management for multi-step forms
- Error messages linked to form fields
- Color contrast compliance

## Implementation Plan

1. Create base form layout components
2. Implement reusable form field components
3. Build form validation schemas
4. Create form state management hooks
5. Implement each report form using the components
6. Add preview functionality
7. Connect forms to API endpoints
8. Test forms on different devices and screen readers
9. Refine based on testing feedback

## Future Enhancements

- Form state persistence (save as draft)
- Template selection for different report styles
- Advanced options panel for power users
- Form history to quickly recreate previous reports
- Batch report generation
