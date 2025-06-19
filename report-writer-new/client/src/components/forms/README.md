# Form Components

This directory contains reusable form components for the Report Writer application. These components provide a consistent look and feel for all forms in the application, with a focus on accessibility and user experience.

## Base Components

### FormLayout

The `FormLayout` component provides the overall layout structure for forms, with an optional preview panel.

```tsx
<FormLayout previewPanel={<PreviewComponent />}>
  <form>
    {/* Form content */}
  </form>
</FormLayout>
```

### FormHeader

The `FormHeader` component displays the title and optional description at the top of a form.

```tsx
<FormHeader 
  title="Generate Yearly Report" 
  description="Create a personalized yearly analysis report."
/>
```

### FormSection

The `FormSection` component creates sections within a form with an optional collapsible functionality.

```tsx
<FormSection title="Person Information" collapsible={true} defaultOpen={true}>
  {/* Section content */}
</FormSection>
```

### FormField

The `FormField` component provides a consistent layout for form fields with labels, error messages, and help text.

```tsx
<FormField 
  label="Select Person" 
  required={true}
  error={errors.personId}
  helpText="Select a person from your list"
>
  <PersonSelect
    value={personId}
    onChange={setPersonId}
  />
</FormField>
```

### FormFooter

The `FormFooter` component provides a footer with primary, secondary, and tertiary buttons.

```tsx
<FormFooter
  primaryButton={<button type="submit">Submit</button>}
  secondaryButton={<button type="button">Cancel</button>}
  tertiaryButton={<button type="button">Delete</button>}
  align="between"
  sticky={true}
/>
```

## Field Components

### PersonSelect

The `PersonSelect` component is a searchable dropdown for selecting a person from the user's list of people.

```tsx
<PersonSelect
  value={personId}
  onChange={setPersonId}
  placeholder="Select a person"
  required={true}
/>
```

### OptionCheckbox

The `OptionCheckbox` component is a styled checkbox for selecting report options.

```tsx
<OptionCheckbox
  label="Include Astrology"
  checked={includeAstrology}
  onChange={setIncludeAstrology}
  description="Add astrological insights to the report"
/>
```

### MultiSelect

The `MultiSelect` component allows selecting multiple options from a list.

```tsx
<MultiSelect
  options={aspectOptions}
  value={selectedAspects}
  onChange={setSelectedAspects}
  placeholder="Select aspects to focus on"
/>
```

### PromptTextarea

The `PromptTextarea` component is a textarea for entering analysis prompts with character count.

```tsx
<PromptTextarea
  value={prompt}
  onChange={setPrompt}
  placeholder="Enter your prompt..."
  maxLength={1000}
/>
```

### DatePicker

The `DatePicker` component is a date picker with calendar dropdown and validation.

```tsx
<DatePicker
  value={date}
  onChange={setDate}
  placeholder="Select a date"
  minDate="2020-01-01"
  maxDate="2030-12-31"
/>
```

## Examples

Check out the `examples` directory for complete examples of how to use these components together. The `YearlyReportFormExample` component demonstrates how to create a form for generating a yearly report.

## Usage Guidelines

1. Use `FormLayout` as the container for your form
2. Add a `FormHeader` at the top of the form
3. Organize form fields into logical sections using `FormSection`
4. Wrap each input in a `FormField` component
5. Add a `FormFooter` at the bottom of the form with submit and cancel buttons

## Accessibility

All components are designed with accessibility in mind:

- Proper ARIA attributes for screen readers
- Keyboard navigation support
- Clear error messages
- Visual indicators for required fields
- Focus management

## Styling

The components use Tailwind CSS for styling and are designed to be responsive. You can customize the appearance by passing className props to the components.
