# React Hook Form to TanStack Form Migration Plan

> **Comprehensive guide for migrating all forms in BuzzTrip from React Hook Form to TanStack Form**
>
> **Scope:** 9 forms across `/apps/web`
> **Target:** Full migration to TanStack Form with Zod validation and ShadCN UI components

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Technology Overview](#technology-overview)
3. [New Components for @buzztrip/ui](#new-components-for-buzztripui)
4. [Core Migration Patterns](#core-migration-patterns)
5. [Form-by-Form Migration Guide](#form-by-form-migration-guide)
6. [Special Patterns & Techniques](#special-patterns--techniques)
7. [Migration Checklist](#migration-checklist)

---

## Executive Summary

### Migration Scope

**Total Forms:** 9 forms across the web application
**Total Lines:** ~3,500+ lines of form code
**Current State:** 8 forms using React Hook Form, 1 form partially migrated

### Forms to Migrate

| # | Form Name | Location | Complexity | Lines | Priority |
|---|-----------|----------|------------|-------|----------|
| 1 | Contact Form | `/apps/web/src/app/contact/page.tsx` | LOW | 317 | Phase 1 |
| 2 | Beta Quick Signup | `/apps/web/src/app/beta/page.tsx` | MEDIUM | 430 | Phase 1 |
| 3 | Map Details | `/apps/web/src/components/map-form/details.tsx` | LOW | 60 | Phase 2 |
| 4 | Collection Form | `/apps/web/src/components/forms/collection-create-edit-form.tsx` | LOW | 149 | Phase 2 |
| 5 | Marker Form | `/apps/web/src/components/forms/marker-create-edit-form.tsx` | HIGH | 415 | Phase 2 |
| 6 | Paths Form | `/apps/web/src/components/forms/paths-create-edit-form.tsx` | HIGH | 387 | Phase 3 |
| 7 | Label Form | `/apps/web/src/components/map-form/label-form.tsx` | MEDIUM | 211 | Phase 3 |
| 8 | Map Form Provider | `/apps/web/src/components/map-form/provider.tsx` | HIGH | 307 | Phase 4 |
| 9 | Beta Questionnaire | `/apps/web/src/app/confirm-waitlist/page.tsx` | VERY HIGH | 1,296 | Phase 4 |

### Why Migrate?

**Benefits of TanStack Form:**

1. **First-class TypeScript support** - Better type inference and safety
2. **Headless architecture** - Complete control over UI rendering
3. **Better async validation** - Built-in debouncing and async support
4. **Smaller bundle size** - More lightweight than React Hook Form
5. **Field-level state management** - More granular control and performance
6. **Flexible validation** - Direct Zod integration without resolver pattern
7. **Framework agnostic** - Easier to share patterns across React/React Native if needed

**Trade-offs:**

1. **Learning curve** - Team needs to learn new API patterns
2. **Migration effort** - Significant refactoring required
3. **Render props pattern** - Different mental model from Controller pattern
4. **Documentation** - Less community resources compared to RHF

### Key Differences

| Aspect | React Hook Form | TanStack Form |
|--------|----------------|---------------|
| **Form Init** | `useForm({ resolver, defaultValues })` | `useForm({ validators, defaultValues, onSubmit })` |
| **Field Registration** | `<FormField control={control} name="field" />` | `<form.Field name="field" children={(field) => ...} />` |
| **Validation** | `resolver: zodResolver(schema)` | `validators: { onChange: schema }` |
| **Field Value** | `field.value` | `field.state.value` |
| **Field Change** | `field.onChange(value)` | `field.handleChange(value)` |
| **Field Blur** | `field.onBlur()` | `field.handleBlur()` |
| **Errors** | `formState.errors.field` (single object) | `field.state.meta.errors` (array) |
| **Submit** | `onSubmit={handleSubmit(onSubmit)}` | `onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}` |
| **Watch Values** | `watch('field')` or `watch()` | `form.useStore((state) => state.values.field)` |
| **Form State** | `formState.isDirty`, `formState.isValid` | `form.useStore((state) => state.isDirty)` |

---

## Technology Overview

### TanStack Form Core Concepts

#### 1. Form Initialization

```typescript
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'

const form = useForm({
  // Default values
  defaultValues: {
    name: '',
    email: '',
  },

  // Validation adapter (Zod)
  validatorAdapter: zodValidator(),

  // Form-level validators
  validators: {
    onChange: myZodSchema,
    // Or async validation
    onChangeAsync: async (values) => {
      // Custom async validation
    },
  },

  // Submit handler
  onSubmit: async ({ value }) => {
    // Submit logic
    await api.submit(value)
  },
})
```

#### 2. Field Component Pattern

TanStack Form uses **render props** pattern:

```typescript
<form.Field
  name="email"
  validators={{
    onChange: ({ value }) =>
      !value ? 'Email is required' : undefined,
    onChangeAsync: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return value.includes('error') ? 'No "error" allowed' : undefined
    },
  }}
  children={(field) => (
    <div>
      <label htmlFor={field.name}>Email:</label>
      <input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
        <em>{field.state.meta.errors.join(', ')}</em>
      )}
    </div>
  )}
/>
```

#### 3. Field State Structure

```typescript
field.state = {
  value: any,                    // Current field value
  meta: {
    isTouched: boolean,          // Has been blurred
    isDirty: boolean,            // Value has changed from default
    isPristine: boolean,         // Value hasn't changed
    isValidating: boolean,       // Currently validating
    isValid: boolean,            // No errors
    errors: string[],            // Array of error messages
    errorMap: Record<string, string[]>, // Errors by validation type
  }
}
```

#### 4. Form State Subscription

```typescript
// Subscribe to specific form state
const isDirty = form.useStore((state) => state.isDirty)
const isValid = form.useStore((state) => state.isValid)
const values = form.useStore((state) => state.values)

// Or use Subscribe component
<form.Subscribe
  selector={(state) => ({
    canSubmit: state.canSubmit,
    isSubmitting: state.isSubmitting,
  })}
  children={(state) => (
    <button type="submit" disabled={!state.canSubmit}>
      {state.isSubmitting ? '...' : 'Submit'}
    </button>
  )}
/>
```

#### 5. Array Fields

```typescript
<form.Field name="tags" mode="array">
  {(field) => (
    <div>
      {field.state.value.map((_, i) => (
        <form.Field key={i} name={`tags[${i}]`}>
          {(subField) => (
            <div>
              <input
                value={subField.state.value}
                onChange={(e) => subField.handleChange(e.target.value)}
              />
              <button onClick={() => field.removeValue(i)}>Remove</button>
            </div>
          )}
        </form.Field>
      ))}
      <button onClick={() => field.pushValue('')}>Add</button>
    </div>
  )}
</form.Field>
```

### Zod Integration

TanStack Form integrates with Zod via the **Standard Schema** specification:

```typescript
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18+'),
})

const form = useForm({
  validatorAdapter: zodValidator(),
  validators: {
    // Validate on change
    onChange: schema,
    // Or validate on blur
    // onBlur: schema,
    // Or validate on submit
    // onSubmit: schema,
  },
  // ...
})
```

**Note:** You can also use field-level Zod validation:

```typescript
<form.Field
  name="email"
  validators={{
    onChange: z.string().email(),
  }}
>
  {/* ... */}
</form.Field>
```

### ShadCN Integration Pattern

ShadCN's TanStack Form integration follows this pattern:

```typescript
<form.Field name="username">
  {(field) => (
    <div className="space-y-2">
      <Label htmlFor={field.name}>Username</Label>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        data-invalid={field.state.meta.errors.length > 0}
        aria-invalid={field.state.meta.errors.length > 0}
        aria-describedby={`${field.name}-error`}
      />
      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
        <p
          id={`${field.name}-error`}
          className="text-sm font-medium text-destructive"
        >
          {field.state.meta.errors[0]}
        </p>
      )}
    </div>
  )}
</form.Field>
```

---

## New Components for @buzztrip/ui

We need to create new wrapper components in `@buzztrip/ui` that make TanStack Form easier to use and consistent with our existing ShadCN patterns.

### File: `packages/ui/src/tanstack-form.tsx`

This file will contain all TanStack Form wrapper components.

#### Component Specifications

##### 1. TanStackForm Component

**Purpose:** Wrapper around `<form>` element that handles submission

```typescript
import * as React from "react"
import type { FormApi } from "@tanstack/react-form"

interface TanStackFormProps<TFormData> extends React.FormHTMLAttributes<HTMLFormElement> {
  form: FormApi<TFormData, any>
  children: React.ReactNode
}

export function TanStackForm<TFormData>({
  form,
  onSubmit,
  children,
  ...props
}: TanStackFormProps<TFormData>) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
        onSubmit?.(e)
      }}
      {...props}
    >
      {children}
    </form>
  )
}
```

**Usage:**

```typescript
<TanStackForm form={form} className="space-y-4">
  {/* form fields */}
</TanStackForm>
```

##### 2. TanStackFormField Component

**Purpose:** Simplified wrapper for `form.Field` with better ergonomics

```typescript
import type { FieldApi, FormApi, Validator } from "@tanstack/react-form"

interface TanStackFormFieldProps<TFormData, TName extends keyof TFormData> {
  form: FormApi<TFormData, any>
  name: TName
  validators?: {
    onChange?: Validator<TFormData[TName], any>
    onChangeAsync?: Validator<TFormData[TName], any>
    onBlur?: Validator<TFormData[TName], any>
    onMount?: Validator<TFormData[TName], any>
  }
  children: (field: FieldApi<TFormData, TName, any, any>) => React.ReactNode
}

export function TanStackFormField<TFormData, TName extends keyof TFormData>({
  form,
  name,
  validators,
  children,
}: TanStackFormFieldProps<TFormData, TName>) {
  return (
    <form.Field name={name as any} validators={validators}>
      {children}
    </form.Field>
  )
}
```

**Usage:**

```typescript
<TanStackFormField form={form} name="email">
  {(field) => (
    <TanStackFormItem>
      {/* field content */}
    </TanStackFormItem>
  )}
</TanStackFormField>
```

##### 3. TanStackFormItem Component

**Purpose:** Container for field with consistent spacing

```typescript
import { cn } from "../lib/utils"

const TanStackFormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props} />
  )
})
TanStackFormItem.displayName = "TanStackFormItem"
```

**Usage:**

```typescript
<TanStackFormItem>
  <TanStackFormLabel>Email</TanStackFormLabel>
  <TanStackFormControl>
    <Input {...fieldProps} />
  </TanStackFormControl>
  <TanStackFormMessage />
</TanStackFormItem>
```

##### 4. TanStackFormLabel Component

**Purpose:** Label with error styling support

```typescript
import { Label } from "./label"
import { cn } from "../lib/utils"

interface TanStackFormLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {
  hasError?: boolean
}

const TanStackFormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  TanStackFormLabelProps
>(({ className, hasError, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      className={cn(hasError && "text-destructive", className)}
      {...props}
    />
  )
})
TanStackFormLabel.displayName = "TanStackFormLabel"
```

##### 5. TanStackFormControl Component

**Purpose:** Wrapper for input elements with accessibility attributes

```typescript
import { Slot } from "@radix-ui/react-slot"

interface TanStackFormControlProps extends React.HTMLAttributes<HTMLDivElement> {
  field: FieldApi<any, any, any, any>
  children: React.ReactElement
}

const TanStackFormControl = React.forwardRef<
  HTMLDivElement,
  TanStackFormControlProps
>(({ field, children, ...props }, ref) => {
  const hasError = field.state.meta.errors.length > 0
  const errorId = `${field.name}-error`

  return (
    <Slot
      ref={ref}
      id={field.name}
      name={field.name}
      aria-invalid={hasError || undefined}
      aria-describedby={hasError ? errorId : undefined}
      data-invalid={hasError || undefined}
      {...props}
    >
      {children}
    </Slot>
  )
})
TanStackFormControl.displayName = "TanStackFormControl"
```

##### 6. TanStackFormDescription Component

**Purpose:** Help text for form fields

```typescript
import { cn } from "../lib/utils"

const TanStackFormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
TanStackFormDescription.displayName = "TanStackFormDescription"
```

##### 7. TanStackFormMessage Component

**Purpose:** Display field errors

```typescript
import { cn } from "../lib/utils"
import type { FieldApi } from "@tanstack/react-form"

interface TanStackFormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  field: FieldApi<any, any, any, any>
}

const TanStackFormMessage = React.forwardRef<
  HTMLParagraphElement,
  TanStackFormMessageProps
>(({ className, field, ...props }, ref) => {
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0
  const errorId = `${field.name}-error`

  if (!hasError) return null

  return (
    <p
      ref={ref}
      id={errorId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {field.state.meta.errors[0]}
    </p>
  )
})
TanStackFormMessage.displayName = "TanStackFormMessage"
```

##### 8. useTanStackFormField Hook

**Purpose:** Access field context (if using context pattern)

```typescript
import * as React from "react"
import type { FieldApi } from "@tanstack/react-form"

interface TanStackFormFieldContextValue {
  field: FieldApi<any, any, any, any>
}

const TanStackFormFieldContext = React.createContext<TanStackFormFieldContextValue | null>(null)

export function useTanStackFormField() {
  const context = React.useContext(TanStackFormFieldContext)

  if (!context) {
    throw new Error("useTanStackFormField must be used within TanStackFormField")
  }

  return context.field
}
```

#### Complete Component File

```typescript
// packages/ui/src/tanstack-form.tsx

"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import type { FieldApi, FormApi, Validator } from "@tanstack/react-form"
import { Label } from "./label"
import { cn } from "../lib/utils"

// ============================================================================
// Form Component
// ============================================================================

interface TanStackFormProps<TFormData> extends React.FormHTMLAttributes<HTMLFormElement> {
  form: FormApi<TFormData, any>
  children: React.ReactNode
}

export function TanStackForm<TFormData>({
  form,
  onSubmit,
  children,
  ...props
}: TanStackFormProps<TFormData>) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
        onSubmit?.(e)
      }}
      {...props}
    >
      {children}
    </form>
  )
}

// ============================================================================
// Field Component
// ============================================================================

interface TanStackFormFieldProps<TFormData, TName extends string> {
  form: FormApi<TFormData, any>
  name: TName
  validators?: {
    onChange?: Validator<any, any>
    onChangeAsync?: Validator<any, any>
    onBlur?: Validator<any, any>
    onMount?: Validator<any, any>
  }
  children: (field: FieldApi<TFormData, TName, any, any>) => React.ReactNode
}

export function TanStackFormField<TFormData, TName extends string>({
  form,
  name,
  validators,
  children,
}: TanStackFormFieldProps<TFormData, TName>) {
  return (
    <form.Field name={name} validators={validators}>
      {children}
    </form.Field>
  )
}

// ============================================================================
// Form Item Component
// ============================================================================

const TanStackFormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props} />
  )
})
TanStackFormItem.displayName = "TanStackFormItem"

// ============================================================================
// Form Label Component
// ============================================================================

interface TanStackFormLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {
  hasError?: boolean
}

const TanStackFormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  TanStackFormLabelProps
>(({ className, hasError, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      className={cn(hasError && "text-destructive", className)}
      {...props}
    />
  )
})
TanStackFormLabel.displayName = "TanStackFormLabel"

// ============================================================================
// Form Control Component
// ============================================================================

interface TanStackFormControlProps {
  field: FieldApi<any, any, any, any>
  children: React.ReactElement
}

const TanStackFormControl = React.forwardRef<
  HTMLElement,
  TanStackFormControlProps
>(({ field, children }, ref) => {
  const hasError = field.state.meta.errors.length > 0
  const errorId = `${field.name}-error`

  return (
    <Slot
      ref={ref}
      id={field.name}
      name={field.name}
      aria-invalid={hasError || undefined}
      aria-describedby={hasError ? errorId : undefined}
      data-invalid={hasError || undefined}
    >
      {children}
    </Slot>
  )
})
TanStackFormControl.displayName = "TanStackFormControl"

// ============================================================================
// Form Description Component
// ============================================================================

const TanStackFormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
TanStackFormDescription.displayName = "TanStackFormDescription"

// ============================================================================
// Form Message Component
// ============================================================================

interface TanStackFormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  field: FieldApi<any, any, any, any>
}

const TanStackFormMessage = React.forwardRef<
  HTMLParagraphElement,
  TanStackFormMessageProps
>(({ className, field, ...props }, ref) => {
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0
  const errorId = `${field.name}-error`

  if (!hasError) return null

  return (
    <p
      ref={ref}
      id={errorId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {field.state.meta.errors[0]}
    </p>
  )
})
TanStackFormMessage.displayName = "TanStackFormMessage"

// ============================================================================
// Exports
// ============================================================================

export {
  TanStackFormItem,
  TanStackFormLabel,
  TanStackFormControl,
  TanStackFormDescription,
  TanStackFormMessage,
}
```

#### Export from index

Add to `packages/ui/src/index.tsx`:

```typescript
export {
  TanStackForm,
  TanStackFormField,
  TanStackFormItem,
  TanStackFormLabel,
  TanStackFormControl,
  TanStackFormDescription,
  TanStackFormMessage,
} from "./tanstack-form"
```

---

## Core Migration Patterns

This section covers the common patterns you'll use when migrating forms.

### Pattern 1: Basic Form Setup

#### Before (React Hook Form)

```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
})

type FormData = z.infer<typeof schema>

function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    await api.submit(data)
  }

  return (
    <Form>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* fields */}
      </form>
    </Form>
  )
}
```

#### After (TanStack Form)

```typescript
import { useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
})

type FormData = z.infer<typeof schema>

function MyForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
    } as FormData,
    validatorAdapter: zodValidator(),
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      await api.submit(value)
    },
  })

  return (
    <TanStackForm form={form}>
      {/* fields */}
    </TanStackForm>
  )
}
```

**Key Changes:**
- Import from `@tanstack/react-form` instead of `react-hook-form`
- Add `validatorAdapter: zodValidator()`
- Move schema to `validators.onChange` instead of `resolver`
- Move submit handler to `onSubmit` in useForm config
- Use `<TanStackForm>` wrapper instead of RHF `<Form>`

### Pattern 2: Text Input Field

#### Before (React Hook Form)

```typescript
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input
          placeholder="you@example.com"
          {...field}
        />
      </FormControl>
      <FormDescription>We'll never share your email.</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

#### After (TanStack Form)

```typescript
<form.Field name="email">
  {(field) => (
    <TanStackFormItem>
      <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
        Email
      </TanStackFormLabel>
      <TanStackFormControl field={field}>
        <Input
          placeholder="you@example.com"
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
        />
      </TanStackFormControl>
      <TanStackFormDescription>
        We'll never share your email.
      </TanStackFormDescription>
      <TanStackFormMessage field={field} />
    </TanStackFormItem>
  )}
</form.Field>
```

**Key Changes:**
- Use `form.Field` with `children` render prop instead of `FormField`
- Access value via `field.state.value` instead of `field.value`
- Use `field.handleChange()` instead of `field.onChange()`
- Use `field.handleBlur()` instead of `field.onBlur()`
- Pass `field` to `TanStackFormMessage` component
- Manually extract value from event: `e.target.value`

### Pattern 3: Select/Dropdown Field

#### Before (React Hook Form)

```typescript
<FormField
  control={form.control}
  name="country"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Country</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

#### After (TanStack Form)

```typescript
<form.Field name="country">
  {(field) => (
    <TanStackFormItem>
      <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
        Country
      </TanStackFormLabel>
      <Select
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
      >
        <TanStackFormControl field={field}>
          <SelectTrigger>
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
        </TanStackFormControl>
        <SelectContent>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
        </SelectContent>
      </Select>
      <TanStackFormMessage field={field} />
    </TanStackFormItem>
  )}
</form.Field>
```

**Key Changes:**
- Move `value` and `onValueChange` to `<Select>` component
- Use `field.state.value` for current value
- Wrap `SelectTrigger` in `TanStackFormControl` for accessibility

### Pattern 4: Checkbox Field

#### Before (React Hook Form)

```typescript
<FormField
  control={form.control}
  name="acceptTerms"
  render={({ field }) => (
    <FormItem className="flex flex-row items-start space-x-3">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>Accept terms and conditions</FormLabel>
        <FormDescription>
          You agree to our Terms of Service.
        </FormDescription>
      </div>
      <FormMessage />
    </FormItem>
  )}
/>
```

#### After (TanStack Form)

```typescript
<form.Field name="acceptTerms">
  {(field) => (
    <TanStackFormItem className="flex flex-row items-start space-x-3">
      <TanStackFormControl field={field}>
        <Checkbox
          checked={field.state.value}
          onCheckedChange={(checked) => field.handleChange(checked)}
        />
      </TanStackFormControl>
      <div className="space-y-1 leading-none">
        <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
          Accept terms and conditions
        </TanStackFormLabel>
        <TanStackFormDescription>
          You agree to our Terms of Service.
        </TanStackFormDescription>
      </div>
      <TanStackFormMessage field={field} />
    </TanStackFormItem>
  )}
</form.Field>
```

**Key Changes:**
- Use `field.state.value` for checked state
- Handle change with `field.handleChange(checked)` directly

### Pattern 5: Checkbox Array (Multiple Selection)

#### Before (React Hook Form)

```typescript
const tools = ["figma", "sketch", "adobe-xd"]

<FormField
  control={form.control}
  name="selectedTools"
  render={() => (
    <FormItem>
      <FormLabel>Select Tools</FormLabel>
      {tools.map((tool) => (
        <FormField
          key={tool}
          control={form.control}
          name="selectedTools"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3">
              <FormControl>
                <Checkbox
                  checked={field.value?.includes(tool)}
                  onCheckedChange={(checked) => {
                    return checked
                      ? field.onChange([...field.value, tool])
                      : field.onChange(field.value?.filter((val) => val !== tool))
                  }}
                />
              </FormControl>
              <FormLabel className="font-normal">{tool}</FormLabel>
            </FormItem>
          )}
        />
      ))}
      <FormMessage />
    </FormItem>
  )}
/>
```

#### After (TanStack Form)

```typescript
const tools = ["figma", "sketch", "adobe-xd"]

<form.Field name="selectedTools">
  {(field) => (
    <TanStackFormItem>
      <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
        Select Tools
      </TanStackFormLabel>
      {tools.map((tool) => (
        <div key={tool} className="flex items-center space-x-3">
          <Checkbox
            checked={field.state.value?.includes(tool)}
            onCheckedChange={(checked) => {
              const currentValue = field.state.value || []
              const newValue = checked
                ? [...currentValue, tool]
                : currentValue.filter((val) => val !== tool)
              field.handleChange(newValue)
            }}
          />
          <Label className="font-normal">{tool}</Label>
        </div>
      ))}
      <TanStackFormMessage field={field} />
    </TanStackFormItem>
  )}
</form.Field>
```

**Key Changes:**
- Single field wrapping all checkboxes (no nested FormField)
- Use `field.state.value` to check if tool is selected
- Update array by spreading current value and filtering
- Pass new array to `field.handleChange()`

### Pattern 6: Radio Group

#### Before (React Hook Form)

```typescript
<FormField
  control={form.control}
  name="plan"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Select a plan</FormLabel>
      <FormControl>
        <RadioGroup
          onValueChange={field.onChange}
          defaultValue={field.value}
          className="flex flex-col space-y-1"
        >
          <FormItem className="flex items-center space-x-3">
            <FormControl>
              <RadioGroupItem value="free" />
            </FormControl>
            <FormLabel className="font-normal">Free</FormLabel>
          </FormItem>
          <FormItem className="flex items-center space-x-3">
            <FormControl>
              <RadioGroupItem value="pro" />
            </FormControl>
            <FormLabel className="font-normal">Pro</FormLabel>
          </FormItem>
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

#### After (TanStack Form)

```typescript
<form.Field name="plan">
  {(field) => (
    <TanStackFormItem>
      <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
        Select a plan
      </TanStackFormLabel>
      <TanStackFormControl field={field}>
        <RadioGroup
          value={field.state.value}
          onValueChange={(value) => field.handleChange(value)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="free" id="plan-free" />
            <Label htmlFor="plan-free" className="font-normal">Free</Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="pro" id="plan-pro" />
            <Label htmlFor="plan-pro" className="font-normal">Pro</Label>
          </div>
        </RadioGroup>
      </TanStackFormControl>
      <TanStackFormMessage field={field} />
    </TanStackFormItem>
  )}
</form.Field>
```

**Key Changes:**
- Use `value` instead of `defaultValue` on RadioGroup
- Use `field.state.value` for current value
- Simpler structure without nested FormItems

### Pattern 7: Textarea Field

#### Before (React Hook Form)

```typescript
<FormField
  control={form.control}
  name="description"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Description</FormLabel>
      <FormControl>
        <Textarea
          placeholder="Tell us about your project..."
          className="resize-none"
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

#### After (TanStack Form)

```typescript
<form.Field name="description">
  {(field) => (
    <TanStackFormItem>
      <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
        Description
      </TanStackFormLabel>
      <TanStackFormControl field={field}>
        <Textarea
          placeholder="Tell us about your project..."
          className="resize-none"
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
        />
      </TanStackFormControl>
      <TanStackFormMessage field={field} />
    </TanStackFormItem>
  )}
</form.Field>
```

**Key Changes:**
- Same pattern as Input - explicitly handle value, blur, and change

### Pattern 8: Watching Form Values

#### Before (React Hook Form)

```typescript
// Watch single field
const email = form.watch("email")

// Watch multiple fields
const [name, email] = form.watch(["name", "email"])

// Watch entire form
const formValues = form.watch()

// Use in effect
useEffect(() => {
  const subscription = form.watch((value, { name, type }) => {
    console.log(value, name, type)
  })
  return () => subscription.unsubscribe()
}, [form.watch])
```

#### After (TanStack Form)

```typescript
// Watch single field with useStore
const email = form.useStore((state) => state.values.email)

// Watch multiple fields
const values = form.useStore((state) => ({
  name: state.values.name,
  email: state.values.email,
}))

// Watch entire form
const formValues = form.useStore((state) => state.values)

// Use in effect (use Subscribe component instead)
<form.Subscribe
  selector={(state) => state.values}
  children={(values) => {
    // Use values here
    return null
  }}
/>

// Or with effect
useEffect(() => {
  const values = form.useStore.getState().values
  console.log(values)
}, [form.useStore.getState().values])
```

**Key Changes:**
- Use `form.useStore()` instead of `form.watch()`
- Access values via `state.values.fieldName`
- Use `form.Subscribe` component for reactive subscriptions

### Pattern 9: Form State (isSubmitting, isDirty, isValid)

#### Before (React Hook Form)

```typescript
const { isSubmitting, isDirty, isValid } = form.formState

return (
  <Button
    type="submit"
    disabled={isSubmitting || !isDirty || !isValid}
  >
    {isSubmitting ? "Submitting..." : "Submit"}
  </Button>
)
```

#### After (TanStack Form)

```typescript
// Option 1: useStore for individual values
const isSubmitting = form.useStore((state) => state.isSubmitting)
const isDirty = form.useStore((state) => state.isDirty)
const isValid = form.useStore((state) => state.isValid)

return (
  <Button
    type="submit"
    disabled={isSubmitting || !isDirty || !isValid}
  >
    {isSubmitting ? "Submitting..." : "Submit"}
  </Button>
)

// Option 2: Subscribe component
<form.Subscribe
  selector={(state) => ({
    canSubmit: state.canSubmit,
    isSubmitting: state.isSubmitting,
  })}
  children={(state) => (
    <Button type="submit" disabled={!state.canSubmit}>
      {state.isSubmitting ? "Submitting..." : "Submit"}
    </Button>
  )}
/>
```

**Key Changes:**
- Use `form.useStore()` to access form state
- Or use `form.Subscribe` component for better performance
- State properties: `isSubmitting`, `isDirty`, `isValid`, `canSubmit`

### Pattern 10: Field-Level Validation

#### Before (React Hook Form)

```typescript
<FormField
  control={form.control}
  name="email"
  rules={{
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    },
  }}
  render={({ field }) => (
    {/* field content */}
  )}
/>
```

#### After (TanStack Form)

```typescript
<form.Field
  name="email"
  validators={{
    onChange: ({ value }) =>
      !value
        ? "Email is required"
        : !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
        ? "Invalid email address"
        : undefined,
  }}
>
  {(field) => (
    {/* field content */}
  )}
</form.Field>

// Or with Zod schema for the field
<form.Field
  name="email"
  validators={{
    onChange: z.string().email("Invalid email address"),
  }}
>
  {(field) => (
    {/* field content */}
  )}
</form.Field>
```

**Key Changes:**
- Use `validators` prop on `form.Field`
- Validation timing: `onChange`, `onBlur`, `onMount`, `onSubmit`
- Return `undefined` for no error, or error string
- Can use Zod schema directly for field-level validation

### Pattern 11: Async Validation

#### Before (React Hook Form)

```typescript
<FormField
  control={form.control}
  name="username"
  rules={{
    validate: async (value) => {
      const exists = await checkUsernameExists(value)
      return exists ? "Username already taken" : true
    },
  }}
  render={({ field }) => (
    {/* field content */}
  )}
/>
```

#### After (TanStack Form)

```typescript
<form.Field
  name="username"
  validators={{
    onChangeAsyncDebounceMs: 500,
    onChangeAsync: async ({ value }) => {
      const exists = await checkUsernameExists(value)
      return exists ? "Username already taken" : undefined
    },
  }}
>
  {(field) => (
    <TanStackFormItem>
      <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
        Username
      </TanStackFormLabel>
      <TanStackFormControl field={field}>
        <Input
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
        />
      </TanStackFormControl>
      {field.state.meta.isValidating && (
        <p className="text-sm text-muted-foreground">Checking...</p>
      )}
      <TanStackFormMessage field={field} />
    </TanStackFormItem>
  )}
</form.Field>
```

**Key Changes:**
- Use `onChangeAsync` validator
- Built-in debouncing with `onChangeAsyncDebounceMs`
- Access validation state: `field.state.meta.isValidating`
- Return `undefined` for valid, error string for invalid

### Pattern 12: Form Reset

#### Before (React Hook Form)

```typescript
// Reset to default values
form.reset()

// Reset to specific values
form.reset({
  name: "New Name",
  email: "new@email.com",
})

// Reset field
form.resetField("name")
```

#### After (TanStack Form)

```typescript
// Reset entire form to default values
form.reset()

// Reset to specific values (must provide all fields)
form.update((prev) => ({
  ...prev,
  values: {
    name: "New Name",
    email: "new@email.com",
  },
}))

// Or set individual field
form.setFieldValue("name", "New Name")
```

**Key Changes:**
- `form.reset()` resets to default values
- Use `form.setFieldValue()` to update individual fields
- Use `form.update()` for bulk updates

### Pattern 13: Form Errors

#### Before (React Hook Form)

```typescript
// Set error manually
form.setError("email", {
  type: "manual",
  message: "This email is already registered",
})

// Clear errors
form.clearErrors("email")

// Get errors
const errors = form.formState.errors
```

#### After (TanStack Form)

```typescript
// Set error manually
form.setFieldMeta("email", (prev) => ({
  ...prev,
  errors: ["This email is already registered"],
}))

// Clear errors
form.setFieldMeta("email", (prev) => ({
  ...prev,
  errors: [],
}))

// Get errors from field
// Access via field.state.meta.errors in render
```

**Key Changes:**
- Use `form.setFieldMeta()` to set errors
- Errors are arrays, not single objects
- Clear by setting to empty array

### Pattern 14: Default Values from Props/Server

#### Before (React Hook Form)

```typescript
interface Props {
  initialData?: FormData
}

function EditForm({ initialData }: Props) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      name: "",
      email: "",
    },
  })

  // Update when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset(initialData)
    }
  }, [initialData, form])
}
```

#### After (TanStack Form)

```typescript
interface Props {
  initialData?: FormData
}

function EditForm({ initialData }: Props) {
  const form = useForm({
    defaultValues: initialData || {
      name: "",
      email: "",
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      // submit
    },
  })

  // Update when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset()
      Object.entries(initialData).forEach(([key, value]) => {
        form.setFieldValue(key, value)
      })
    }
  }, [initialData, form])
}
```

**Key Changes:**
- Similar pattern for default values
- Use `form.setFieldValue()` to update individual fields in effect
- Call `form.reset()` first to clear form state

---

## Form-by-Form Migration Guide

This section provides detailed step-by-step migration instructions for each form in the codebase.

### Phase 1: Simple Forms (Learning Baseline)

These forms are simple and serve as good learning examples for the team.

---

### Form 1: Contact Form

**File:** `apps/web/src/app/contact/page.tsx`
**Complexity:** LOW
**Lines:** 317
**Fields:** 5 (firstName, lastName, email, subject, message)

#### Current Implementation Analysis

```typescript
// Current schema
const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

// Current form setup
const form = useForm<z.infer<typeof contactSchema>>({
  resolver: zodResolver(contactSchema),
  defaultValues: {
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  },
})

// All fields use basic Input/Textarea components
// Uses server action for submission
// Has toast notifications
```

#### Migration Steps

**Step 1:** Update imports

```typescript
// Remove
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Add
import { useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import {
  TanStackForm,
  TanStackFormControl,
  TanStackFormItem,
  TanStackFormLabel,
  TanStackFormMessage,
} from "@buzztrip/ui"
```

**Step 2:** Update form initialization

```typescript
// Before
const form = useForm<z.infer<typeof contactSchema>>({
  resolver: zodResolver(contactSchema),
  defaultValues: {
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  },
})

const onSubmit = async (data: z.infer<typeof contactSchema>) => {
  try {
    const result = await submitContactForm(data)
    if (result.success) {
      toast.success("Message sent successfully!")
      form.reset()
    }
  } catch (error) {
    toast.error("Failed to send message")
  }
}

// After
const form = useForm({
  defaultValues: {
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  },
  validatorAdapter: zodValidator(),
  validators: {
    onChange: contactSchema,
  },
  onSubmit: async ({ value }) => {
    try {
      const result = await submitContactForm(value)
      if (result.success) {
        toast.success("Message sent successfully!")
        form.reset()
      }
    } catch (error) {
      toast.error("Failed to send message")
    }
  },
})
```

**Step 3:** Update form element

```typescript
// Before
<Form>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    {/* fields */}
  </form>
</Form>

// After
<TanStackForm form={form} className="space-y-6">
  {/* fields */}
</TanStackForm>
```

**Step 4:** Migrate firstName field

```typescript
// Before
<FormField
  control={form.control}
  name="firstName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>First Name</FormLabel>
      <FormControl>
        <Input placeholder="John" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

// After
<form.Field name="firstName">
  {(field) => (
    <TanStackFormItem>
      <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
        First Name
      </TanStackFormLabel>
      <TanStackFormControl field={field}>
        <Input
          placeholder="John"
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
        />
      </TanStackFormControl>
      <TanStackFormMessage field={field} />
    </TanStackFormItem>
  )}
</form.Field>
```

**Step 5:** Repeat Step 4 for remaining fields

- lastName (Input)
- email (Input with type="email")
- subject (Input)
- message (Textarea)

**Step 6:** Update submit button

```typescript
// Before
<Button type="submit" disabled={form.formState.isSubmitting}>
  {form.formState.isSubmitting ? "Sending..." : "Send Message"}
</Button>

// After
<form.Subscribe
  selector={(state) => ({
    canSubmit: state.canSubmit,
    isSubmitting: state.isSubmitting,
  })}
>
  {(state) => (
    <Button type="submit" disabled={!state.canSubmit}>
      {state.isSubmitting ? "Sending..." : "Send Message"}
    </Button>
  )}
</form.Subscribe>
```

#### Testing Checklist

- [ ] All fields validate on change
- [ ] Error messages display correctly
- [ ] Form submits successfully
- [ ] Toast notifications work
- [ ] Form resets after successful submission
- [ ] Submission disabled while processing
- [ ] Accessibility attributes present (aria-invalid, aria-describedby)

---

### Form 2: Beta Quick Signup Form

**File:** `apps/web/src/app/beta/page.tsx`
**Complexity:** MEDIUM
**Lines:** 430
**Fields:** 4 (firstName, lastName, email, whatsappOptIn)

#### Current Implementation Analysis

```typescript
// Schema
const betaQuickSignupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  whatsappOptIn: z.boolean().default(false),
})

// Special features:
// - Auto-populates from Clerk user data
// - Multiple submission states (idle, submitting, success, error)
// - Conditional rendering based on auth state
```

#### Migration Steps

**Step 1:** Update imports (same as Contact Form)

**Step 2:** Update form initialization

```typescript
// Before
const form = useForm<z.infer<typeof betaQuickSignupSchema>>({
  resolver: zodResolver(betaQuickSignupSchema),
  defaultValues: {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    whatsappOptIn: false,
  },
})

// After
const form = useForm({
  defaultValues: {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    whatsappOptIn: false,
  },
  validatorAdapter: zodValidator(),
  validators: {
    onChange: betaQuickSignupSchema,
  },
  onSubmit: async ({ value }) => {
    setSubmissionState("submitting")
    try {
      const result = await joinBetaWaitlist(value)
      if (result.success) {
        setSubmissionState("success")
        toast.success("You've been added to the waitlist!")
      }
    } catch (error) {
      setSubmissionState("error")
      toast.error("Failed to join waitlist")
    }
  },
})
```

**Step 3:** Handle Clerk data population

```typescript
// Update when Clerk user data loads
useEffect(() => {
  if (user) {
    form.setFieldValue("firstName", user.firstName || "")
    form.setFieldValue("lastName", user.lastName || "")
    form.setFieldValue("email", user.primaryEmailAddress?.emailAddress || "")
  }
}, [user])
```

**Step 4:** Migrate text fields (firstName, lastName, email)

Same pattern as Contact Form - use `form.Field` with `TanStackFormItem` components.

**Step 5:** Migrate checkbox field (whatsappOptIn)

```typescript
// Before
<FormField
  control={form.control}
  name="whatsappOptIn"
  render={({ field }) => (
    <FormItem className="flex flex-row items-start space-x-3">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>
          Send me updates via WhatsApp
        </FormLabel>
      </div>
    </FormItem>
  )}
/>

// After
<form.Field name="whatsappOptIn">
  {(field) => (
    <TanStackFormItem className="flex flex-row items-start space-x-3">
      <TanStackFormControl field={field}>
        <Checkbox
          checked={field.state.value}
          onCheckedChange={(checked) => field.handleChange(checked)}
        />
      </TanStackFormControl>
      <div className="space-y-1 leading-none">
        <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
          Send me updates via WhatsApp
        </TanStackFormLabel>
      </div>
    </TanStackFormItem>
  )}
</form.Field>
```

**Step 6:** Update submit button with state

```typescript
<form.Subscribe
  selector={(state) => ({
    canSubmit: state.canSubmit,
    isSubmitting: state.isSubmitting,
  })}
>
  {(state) => (
    <Button
      type="submit"
      disabled={!state.canSubmit || submissionState === "submitting"}
      className="w-full"
    >
      {submissionState === "submitting" ? "Joining..." : "Join Waitlist"}
    </Button>
  )}
</form.Subscribe>
```

#### Testing Checklist

- [ ] Form auto-populates from Clerk user data
- [ ] All fields validate correctly
- [ ] Checkbox toggles properly
- [ ] Submission states work (idle, submitting, success, error)
- [ ] Toast notifications display
- [ ] Form works for both authenticated and unauthenticated users

---

### Phase 2: Medium Complexity Forms

---

### Form 3: Map Details Form

**File:** `apps/web/src/components/map-form/details.tsx`
**Complexity:** LOW
**Lines:** 60
**Fields:** 2 (title, description)

#### Current Implementation Analysis

```typescript
// Uses form context from MapFormProvider
// Simple form with just title and description
// Uses mapsEditSchema from provider

const { control } = useFormContext<MapsEditSchemaType>()
```

#### Migration Steps

**Step 1:** Update to use TanStack Form context

Since this form uses a context provider (see Form 8: Map Form Provider), we need to migrate the provider first OR update this component to accept the form instance as a prop.

**Option A: Wait for Provider Migration** (Recommended)

This form should be migrated AFTER the Map Form Provider (Form 8) is migrated.

**Option B: Standalone Migration**

If migrating standalone, pass form instance as prop:

```typescript
// Before
export function MapDetailsForm() {
  const { control } = useFormContext<MapsEditSchemaType>()

  return (
    <div className="space-y-4">
      <FormField control={control} name="title" ... />
      <FormField control={control} name="description" ... />
    </div>
  )
}

// After
interface MapDetailsFormProps {
  form: ReturnType<typeof useForm<MapsEditSchemaType>>
}

export function MapDetailsForm({ form }: MapDetailsFormProps) {
  return (
    <div className="space-y-4">
      <form.Field name="title">
        {(field) => (
          <TanStackFormItem>
            <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
              Map Title
            </TanStackFormLabel>
            <TanStackFormControl field={field}>
              <Input
                placeholder="My Awesome Map"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </TanStackFormControl>
            <TanStackFormMessage field={field} />
          </TanStackFormItem>
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <TanStackFormItem>
            <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
              Description
            </TanStackFormLabel>
            <TanStackFormControl field={field}>
              <Textarea
                placeholder="Describe your map..."
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </TanStackFormControl>
            <TanStackFormMessage field={field} />
          </TanStackFormItem>
        )}
      </form.Field>
    </div>
  )
}
```

**Recommendation:** Migrate this form as part of the Map Form Provider migration.

---

### Form 4: Collection Create/Edit Form

**File:** `apps/web/src/components/forms/collection-create-edit-form.tsx`
**Complexity:** LOW
**Lines:** 149
**Fields:** 4 (title, description, icon, color)

#### Current Implementation Analysis

```typescript
// NO SCHEMA VALIDATION - needs to be added!
// Uses basic useForm with no resolver
// Has icon picker and color picker custom components
// Create/Update operations

const form = useForm({
  defaultValues: {
    title: collection?.title || "",
    description: collection?.description || "",
    icon: collection?.icon || "MapPin",
    color: collection?.color || "#3b82f6",
  },
})
```

#### Migration Steps

**Step 1:** Create validation schema (NEW)

```typescript
// Add this schema
const collectionSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
  icon: z.string().min(1, "Icon is required"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
})

type CollectionFormData = z.infer<typeof collectionSchema>
```

**Step 2:** Update form initialization

```typescript
// Before
const form = useForm({
  defaultValues: {
    title: collection?.title || "",
    description: collection?.description || "",
    icon: collection?.icon || "MapPin",
    color: collection?.color || "#3b82f6",
  },
})

const onSubmit = async (data: any) => {
  if (collection) {
    await updateCollection({ id: collection._id, ...data })
  } else {
    await createCollection(data)
  }
  onSuccess?.()
}

// After
const form = useForm({
  defaultValues: {
    title: collection?.title || "",
    description: collection?.description || "",
    icon: collection?.icon || "MapPin",
    color: collection?.color || "#3b82f6",
  },
  validatorAdapter: zodValidator(),
  validators: {
    onChange: collectionSchema,
  },
  onSubmit: async ({ value }) => {
    if (collection) {
      await updateCollection({ id: collection._id, ...value })
    } else {
      await createCollection(value)
    }
    onSuccess?.()
  },
})
```

**Step 3:** Migrate title field

```typescript
<form.Field name="title">
  {(field) => (
    <TanStackFormItem>
      <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
        Collection Title
      </TanStackFormLabel>
      <TanStackFormControl field={field}>
        <Input
          placeholder="Restaurants"
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
        />
      </TanStackFormControl>
      <TanStackFormMessage field={field} />
    </TanStackFormItem>
  )}
</form.Field>
```

**Step 4:** Migrate description field (Textarea)

Same pattern as title field but with Textarea component.

**Step 5:** Migrate icon field (Custom Picker)

```typescript
// Before
<FormField
  control={form.control}
  name="icon"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Icon</FormLabel>
      <FormControl>
        <IconPicker
          value={field.value}
          onChange={field.onChange}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

// After
<form.Field name="icon">
  {(field) => (
    <TanStackFormItem>
      <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
        Icon
      </TanStackFormLabel>
      <IconPicker
        value={field.state.value}
        onChange={(icon) => field.handleChange(icon)}
      />
      <TanStackFormMessage field={field} />
    </TanStackFormItem>
  )}
</form.Field>
```

**Step 6:** Migrate color field (Custom Picker)

```typescript
<form.Field name="color">
  {(field) => (
    <TanStackFormItem>
      <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
        Color
      </TanStackFormLabel>
      <ColorPicker
        value={field.state.value}
        onChange={(color) => field.handleChange(color)}
      />
      <TanStackFormMessage field={field} />
    </TanStackFormItem>
  )}
</form.Field>
```

**Step 7:** Update form wrapper

```typescript
// Before
<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
  {/* fields */}
</form>

// After
<TanStackForm form={form} className="space-y-6">
  {/* fields */}
</TanStackForm>
```

#### Special Considerations

- **NEW VALIDATION:** This form previously had NO schema validation - now it does!
- Custom components (IconPicker, ColorPicker) need to work with `onChange` callback
- Ensure color format is validated (hex color)

#### Testing Checklist

- [ ] Title validation works (required, max length)
- [ ] Description validation works (max length, optional)
- [ ] Icon picker functions correctly
- [ ] Color picker functions correctly
- [ ] Color format validation works
- [ ] Create operation works
- [ ] Update operation works
- [ ] Form resets after success

---

### Form 5: Marker Create/Edit Form

**File:** `apps/web/src/components/forms/marker-create-edit-form.tsx`
**Complexity:** HIGH
**Lines:** 415
**Fields:** 5 (title, color, icon, note, collection_ids)

#### Current Implementation Analysis

```typescript
// PARTIALLY MIGRATED - Mixed RHF and TanStack
// Title field uses TanStack Form
// Other fields use React Hook Form
// Complex features:
// - Color picker
// - Icon picker
// - Collection multi-select (checkbox array)
// - Real-time marker preview
// - Create/Update/Delete operations

const form = useForm<CombinedMarkersSchemaType>({
  resolver: zodResolver(combinedMarkersSchema),
  defaultValues: {
    title: marker?.title || "",
    color: marker?.styles?.pinColor || "#3b82f6",
    icon: marker?.styles?.icon || "MapPin",
    note: marker?.note || "",
    collection_ids: marker?.collection_ids || [],
  },
})

// Also has TanStack form for title only
const tanstackForm = useForm({ ... })
```

#### Migration Steps

**Step 1:** Remove React Hook Form completely

```typescript
// Remove all RHF imports
// Remove RHF form instance
// Keep only TanStack Form
```

**Step 2:** Update form initialization

```typescript
// Before (mixed)
const form = useForm<CombinedMarkersSchemaType>({
  resolver: zodResolver(combinedMarkersSchema),
  defaultValues: { ... },
})

const tanstackForm = useForm({ ... }) // Separate instance

// After (unified)
const form = useForm({
  defaultValues: {
    title: marker?.title || "",
    color: marker?.styles?.pinColor || "#3b82f6",
    icon: marker?.styles?.icon || "MapPin",
    note: marker?.note || "",
    collection_ids: marker?.collection_ids || [],
  },
  validatorAdapter: zodValidator(),
  validators: {
    onChange: combinedMarkersSchema,
  },
  onSubmit: async ({ value }) => {
    if (marker) {
      await updateMarker({
        id: marker._id,
        ...value,
      })
    } else {
      await createMarker(value)
    }
    onSuccess?.()
  },
})
```

**Step 3:** Migrate all fields to TanStack

Title field already uses TanStack pattern - use that as the template for other fields.

**Step 4:** Migrate collection_ids (Checkbox Array)

```typescript
// Before
<FormField
  control={form.control}
  name="collection_ids"
  render={({ field }) => (
    <div className="space-y-2">
      {collections.map((collection) => (
        <div key={collection._id} className="flex items-center space-x-2">
          <Checkbox
            checked={field.value?.includes(collection._id)}
            onCheckedChange={(checked) => {
              const newValue = checked
                ? [...(field.value || []), collection._id]
                : field.value?.filter((id) => id !== collection._id)
              field.onChange(newValue)
            }}
          />
          <Label>{collection.title}</Label>
        </div>
      ))}
    </div>
  )}
/>

// After
<form.Field name="collection_ids">
  {(field) => (
    <TanStackFormItem>
      <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
        Collections
      </TanStackFormLabel>
      <div className="space-y-2">
        {collections.map((collection) => (
          <div key={collection._id} className="flex items-center space-x-2">
            <Checkbox
              checked={field.state.value?.includes(collection._id)}
              onCheckedChange={(checked) => {
                const currentValue = field.state.value || []
                const newValue = checked
                  ? [...currentValue, collection._id]
                  : currentValue.filter((id) => id !== collection._id)
                field.handleChange(newValue)
              }}
            />
            <Label>{collection.title}</Label>
          </div>
        ))}
      </div>
      <TanStackFormMessage field={field} />
    </TanStackFormItem>
  )}
</form.Field>
```

**Step 5:** Update marker preview

The marker preview likely watches form values:

```typescript
// Before
const watchedValues = form.watch()

// After
const watchedValues = form.useStore((state) => state.values)

// Or use Subscribe component
<form.Subscribe selector={(state) => state.values}>
  {(values) => (
    <MarkerPreview
      title={values.title}
      color={values.color}
      icon={values.icon}
    />
  )}
</form.Subscribe>
```

**Step 6:** Update delete handler

```typescript
// Assuming there's a delete button
<Button
  variant="destructive"
  onClick={async () => {
    if (marker) {
      await deleteMarker(marker._id)
      onSuccess?.()
    }
  }}
>
  Delete Marker
</Button>
```

#### Special Considerations

- **Clean up mixed pattern** - Remove all RHF code
- **Preserve preview functionality** - Ensure real-time preview still works
- **Collection selection** - Multi-select checkbox pattern
- **Custom pickers** - Icon and color pickers need proper integration

#### Testing Checklist

- [ ] All RHF code removed
- [ ] Title field validation works
- [ ] Color picker works
- [ ] Icon picker works
- [ ] Collection multi-select works
- [ ] Marker preview updates in real-time
- [ ] Create operation works
- [ ] Update operation works
- [ ] Delete operation works
- [ ] Form resets after success

---

### Form 6: Paths Create/Edit Form

**File:** `apps/web/src/components/forms/paths-create-edit-form.tsx`
**Complexity:** HIGH
**Lines:** 387
**Fields:** 7 (title, note, styles.strokeColor, styles.fillColor, styles.strokeOpacity, styles.strokeWidth, styles.fillOpacity)

#### Current Implementation Analysis

```typescript
// Nested object structure for styles
// Real-time path preview
// Color pickers for stroke and fill
// Opacity sliders
// Auto-generated titles based on path type

const form = useForm<PathsEditSchemaType>({
  resolver: zodResolver(pathsEditSchema),
  defaultValues: {
    title: path?.title || "",
    note: path?.note || "",
    styles: {
      strokeColor: path?.styles?.strokeColor || "#3b82f6",
      fillColor: path?.styles?.fillColor || "#3b82f6",
      strokeOpacity: path?.styles?.strokeOpacity || 1,
      strokeWidth: path?.styles?.strokeWidth || 3,
      fillOpacity: path?.styles?.fillOpacity || 0.2,
    },
  },
})
```

#### Migration Steps

**Step 1:** Update imports

**Step 2:** Update form initialization

```typescript
const form = useForm({
  defaultValues: {
    title: path?.title || "",
    note: path?.note || "",
    styles: {
      strokeColor: path?.styles?.strokeColor || "#3b82f6",
      fillColor: path?.styles?.fillColor || "#3b82f6",
      strokeOpacity: path?.styles?.strokeOpacity || 1,
      strokeWidth: path?.styles?.strokeWidth || 3,
      fillOpacity: path?.styles?.fillOpacity || 0.2,
    },
  },
  validatorAdapter: zodValidator(),
  validators: {
    onChange: pathsEditSchema,
  },
  onSubmit: async ({ value }) => {
    if (path) {
      await updatePath({ id: path._id, ...value })
    } else {
      await createPath(value)
    }
    onSuccess?.()
  },
})
```

**Step 3:** Migrate nested fields (styles object)

TanStack Form supports nested field names with dot notation:

```typescript
// Stroke Color
<form.Field name="styles.strokeColor">
  {(field) => (
    <TanStackFormItem>
      <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
        Stroke Color
      </TanStackFormLabel>
      <ColorPicker
        value={field.state.value}
        onChange={(color) => field.handleChange(color)}
      />
      <TanStackFormMessage field={field} />
    </TanStackFormItem>
  )}
</form.Field>

// Fill Color
<form.Field name="styles.fillColor">
  {(field) => (
    <TanStackFormItem>
      <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
        Fill Color
      </TanStackFormLabel>
      <ColorPicker
        value={field.state.value}
        onChange={(color) => field.handleChange(color)}
      />
      <TanStackFormMessage field={field} />
    </TanStackFormItem>
  )}
</form.Field>

// Stroke Width (Slider)
<form.Field name="styles.strokeWidth">
  {(field) => (
    <TanStackFormItem>
      <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
        Stroke Width: {field.state.value}px
      </TanStackFormLabel>
      <Slider
        min={1}
        max={10}
        step={1}
        value={[field.state.value]}
        onValueChange={([value]) => field.handleChange(value)}
      />
      <TanStackFormMessage field={field} />
    </TanStackFormItem>
  )}
</form.Field>

// Stroke Opacity (Slider)
<form.Field name="styles.strokeOpacity">
  {(field) => (
    <TanStackFormItem>
      <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
        Stroke Opacity: {Math.round(field.state.value * 100)}%
      </TanStackFormLabel>
      <Slider
        min={0}
        max={1}
        step={0.1}
        value={[field.state.value]}
        onValueChange={([value]) => field.handleChange(value)}
      />
      <TanStackFormMessage field={field} />
    </TanStackFormItem>
  )}
</form.Field>

// Fill Opacity (Slider)
<form.Field name="styles.fillOpacity">
  {(field) => (
    <TanStackFormItem>
      <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
        Fill Opacity: {Math.round(field.state.value * 100)}%
      </TanStackFormLabel>
      <Slider
        min={0}
        max={1}
        step={0.1}
        value={[field.state.value]}
        onValueChange={([value]) => field.handleChange(value)}
      />
      <TanStackFormMessage field={field} />
    </TanStackFormItem>
  )}
</form.Field>
```

**Step 4:** Update path preview

```typescript
// Before
const watchedStyles = form.watch("styles")

// After
const watchedStyles = form.useStore((state) => state.values.styles)

// Or with Subscribe
<form.Subscribe selector={(state) => state.values.styles}>
  {(styles) => (
    <PathPreview
      strokeColor={styles.strokeColor}
      fillColor={styles.fillColor}
      strokeOpacity={styles.strokeOpacity}
      strokeWidth={styles.strokeWidth}
      fillOpacity={styles.fillOpacity}
    />
  )}
</form.Subscribe>
```

**Step 5:** Handle auto-generated titles

If the form auto-generates titles based on path type:

```typescript
// Watch path type and update title
const pathType = form.useStore((state) => state.values.pathType)

useEffect(() => {
  if (!path && pathType) {
    const autoTitle = `New ${pathType} Path`
    form.setFieldValue("title", autoTitle)
  }
}, [pathType, path])
```

#### Special Considerations

- **Nested fields** - Use dot notation for styles object
- **Slider components** - Handle value arrays properly
- **Color pickers** - Ensure proper color format
- **Preview updates** - Real-time preview must stay synced
- **Opacity values** - Validate range (0-1)

#### Testing Checklist

- [ ] All nested style fields work correctly
- [ ] Color pickers update state
- [ ] Sliders update state and preview
- [ ] Opacity calculations display correctly (0-1 → 0-100%)
- [ ] Path preview updates in real-time
- [ ] Auto-generated titles work (if applicable)
- [ ] Create operation works
- [ ] Update operation works
- [ ] Delete operation works

---

### Phase 3: Complex Forms with Advanced Patterns

---

### Form 7: Label Form (Auto-save Pattern)

**File:** `apps/web/src/components/map-form/label-form.tsx`
**Complexity:** MEDIUM
**Lines:** 211
**Fields:** 4 (icon, color, title, description)

#### Current Implementation Analysis

```typescript
// Complex optimization with refs
// Auto-save with debouncing (1000ms)
// Memoized update handlers
// Uses formContext
// Delete functionality

const { control, watch } = useFormContext<MapsEditSchemaType>()

// Debounced auto-save
const debouncedUpdate = useMemo(
  () =>
    debounce(async (data: LabelType) => {
      await updateLabel(data)
    }, 1000),
  []
)

// Watch for changes and trigger save
useEffect(() => {
  const subscription = watch((value) => {
    if (value.labels?.[labelIndex]) {
      debouncedUpdate(value.labels[labelIndex])
    }
  })
  return () => subscription.unsubscribe()
}, [watch, labelIndex])
```

#### Migration Steps

**Step 1:** Update to TanStack Form

Since this uses form context, it should be migrated WITH the Map Form Provider (Form 8). However, here's how to handle auto-save in TanStack Form:

**Step 2:** Implement auto-save with Subscribe

```typescript
// After
interface LabelFormProps {
  form: ReturnType<typeof useForm<MapsEditSchemaType>>
  labelIndex: number
  onDelete: () => void
}

export function LabelForm({ form, labelIndex, onDelete }: LabelFormProps) {
  const debouncedUpdate = useMemo(
    () =>
      debounce(async (data: LabelType) => {
        await updateLabel(data)
      }, 1000),
    []
  )

  return (
    <>
      {/* Auto-save subscription */}
      <form.Subscribe
        selector={(state) => state.values.labels?.[labelIndex]}
      >
        {(label) => {
          useEffect(() => {
            if (label) {
              debouncedUpdate(label)
            }
          }, [label])
          return null
        }}
      </form.Subscribe>

      {/* Fields */}
      <form.Field name={`labels.${labelIndex}.icon`}>
        {(field) => (
          <TanStackFormItem>
            <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
              Icon
            </TanStackFormLabel>
            <IconPicker
              value={field.state.value}
              onChange={(icon) => field.handleChange(icon)}
            />
            <TanStackFormMessage field={field} />
          </TanStackFormItem>
        )}
      </form.Field>

      <form.Field name={`labels.${labelIndex}.color`}>
        {(field) => (
          <TanStackFormItem>
            <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
              Color
            </TanStackFormLabel>
            <ColorPicker
              value={field.state.value}
              onChange={(color) => field.handleChange(color)}
            />
            <TanStackFormMessage field={field} />
          </TanStackFormItem>
        )}
      </form.Field>

      <form.Field name={`labels.${labelIndex}.title`}>
        {(field) => (
          <TanStackFormItem>
            <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
              Title
            </TanStackFormLabel>
            <TanStackFormControl field={field}>
              <Input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </TanStackFormControl>
            <TanStackFormMessage field={field} />
          </TanStackFormItem>
        )}
      </form.Field>

      <form.Field name={`labels.${labelIndex}.description`}>
        {(field) => (
          <TanStackFormItem>
            <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
              Description
            </TanStackFormLabel>
            <TanStackFormControl field={field}>
              <Textarea
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </TanStackFormControl>
            <TanStackFormMessage field={field} />
          </TanStackFormItem>
        )}
      </form.Field>

      <Button variant="destructive" onClick={onDelete}>
        Delete Label
      </Button>
    </>
  )
}
```

**Step 3:** Alternative auto-save with useStore

```typescript
// More performant approach
export function LabelForm({ form, labelIndex, onDelete }: LabelFormProps) {
  const labelData = form.useStore(
    (state) => state.values.labels?.[labelIndex]
  )

  const debouncedUpdate = useMemo(
    () =>
      debounce(async (data: LabelType) => {
        await updateLabel(data)
      }, 1000),
    []
  )

  useEffect(() => {
    if (labelData) {
      debouncedUpdate(labelData)
    }
  }, [labelData, debouncedUpdate])

  // ... rest of component
}
```

#### Special Considerations

- **Auto-save pattern** - Use `form.Subscribe` or `useStore` + `useEffect`
- **Debouncing** - Keep debounce logic the same
- **Array field indexing** - Use `labels.${index}.fieldName` notation
- **Refs optimization** - May not be needed with TanStack's better reactivity
- **Form context** - Migrate with Map Form Provider

#### Testing Checklist

- [ ] Auto-save triggers after 1000ms of inactivity
- [ ] All field changes are saved
- [ ] Delete functionality works
- [ ] No performance regressions
- [ ] Debouncing works correctly (only saves once after changes stop)
- [ ] Icon and color pickers work

---

### Phase 4: Most Complex Forms

---

### Form 8: Map Form Provider (Context Pattern)

**File:** `apps/web/src/components/map-form/provider.tsx`
**Complexity:** HIGH
**Lines:** 307
**Fields:** Multiple (used across Map Details and Label forms)

#### Current Implementation Analysis

```typescript
// Complex form provider pattern
// Manages:
// - Map details (title, description)
// - Labels array
// - User permissions
// Event handling system
// Deep comparison optimizations
// External state synchronization

const form = useForm<MapsEditSchemaType>({
  resolver: zodResolver(mapsEditSchema),
  defaultValues: {
    title: "",
    description: "",
    labels: [],
    users: [],
  },
})

// Syncs with external map data
useEffect(() => {
  if (map) {
    form.reset({
      title: map.title,
      description: map.description,
      labels: map.labels || [],
      users: map.users || [],
    })
  }
}, [map, form])

// Provides form to children
return (
  <FormProvider {...form}>
    {children}
  </FormProvider>
)
```

#### Migration Steps

**Step 1:** Update to TanStack Form

```typescript
// Before
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// After
import { useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { createContext, useContext } from "react"
```

**Step 2:** Create TanStack Form context

```typescript
// Create context for form instance
interface MapFormContextValue {
  form: ReturnType<typeof useForm<MapsEditSchemaType>>
}

const MapFormContext = createContext<MapFormContextValue | null>(null)

export function useMapForm() {
  const context = useContext(MapFormContext)
  if (!context) {
    throw new Error("useMapForm must be used within MapFormProvider")
  }
  return context.form
}
```

**Step 3:** Update provider component

```typescript
interface MapFormProviderProps {
  map?: MapType
  children: React.ReactNode
  onUpdate?: (data: MapsEditSchemaType) => void
}

export function MapFormProvider({ map, children, onUpdate }: MapFormProviderProps) {
  const form = useForm({
    defaultValues: {
      title: map?.title || "",
      description: map?.description || "",
      labels: map?.labels || [],
      users: map?.users || [],
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: mapsEditSchema,
    },
    onSubmit: async ({ value }) => {
      await updateMap(value)
      onUpdate?.(value)
    },
  })

  // Sync with external map data
  useEffect(() => {
    if (map) {
      // Reset form when map data changes
      Object.entries({
        title: map.title,
        description: map.description,
        labels: map.labels || [],
        users: map.users || [],
      }).forEach(([key, value]) => {
        form.setFieldValue(key, value)
      })
    }
  }, [map])

  return (
    <MapFormContext.Provider value={{ form }}>
      {children}
    </MapFormContext.Provider>
  )
}
```

**Step 4:** Update child components to use context

```typescript
// In Map Details Form
export function MapDetailsForm() {
  const form = useMapForm()

  return (
    <div className="space-y-4">
      <form.Field name="title">
        {/* ... */}
      </form.Field>
      <form.Field name="description">
        {/* ... */}
      </form.Field>
    </div>
  )
}

// In Label Form
export function LabelForm({ labelIndex }: { labelIndex: number }) {
  const form = useMapForm()

  return (
    <div className="space-y-4">
      <form.Field name={`labels.${labelIndex}.title`}>
        {/* ... */}
      </form.Field>
      {/* other fields */}
    </div>
  )
}
```

**Step 5:** Handle event system

If the provider has an event system for user/label changes:

```typescript
// Event types
type MapFormEvent =
  | { type: 'user-added'; userId: string }
  | { type: 'user-removed'; userId: string }
  | { type: 'label-added'; label: LabelType }
  | { type: 'label-removed'; labelId: string }

// Add to provider
export function MapFormProvider({ map, children, onEvent }: MapFormProviderProps) {
  // ... form setup

  const handleEvent = useCallback((event: MapFormEvent) => {
    switch (event.type) {
      case 'user-added':
        const currentUsers = form.useStore.getState().values.users
        form.setFieldValue('users', [...currentUsers, event.userId])
        break
      case 'user-removed':
        const users = form.useStore.getState().values.users
        form.setFieldValue('users', users.filter(id => id !== event.userId))
        break
      case 'label-added':
        const currentLabels = form.useStore.getState().values.labels
        form.setFieldValue('labels', [...currentLabels, event.label])
        break
      case 'label-removed':
        const labels = form.useStore.getState().values.labels
        form.setFieldValue('labels', labels.filter(l => l.id !== event.labelId))
        break
    }
  }, [form])

  return (
    <MapFormContext.Provider value={{ form, handleEvent }}>
      {children}
    </MapFormContext.Provider>
  )
}
```

#### Special Considerations

- **Context pattern** - Create custom context for TanStack Form instance
- **External sync** - Carefully handle syncing with external map data
- **Event system** - Preserve event handling for user/label operations
- **Deep comparisons** - TanStack Form has better built-in optimization
- **Child components** - All child components need to update to use context hook

#### Testing Checklist

- [ ] Form context provides form instance to children
- [ ] External map data syncs correctly
- [ ] Event system works (user add/remove, label add/remove)
- [ ] Map Details form works with context
- [ ] Label form works with context
- [ ] No performance regressions
- [ ] Form validation works across all fields

---

### Form 9: Beta Questionnaire (Most Complex)

**File:** `apps/web/src/app/confirm-waitlist/page.tsx`
**Complexity:** VERY HIGH
**Lines:** 1,296
**Fields:** 14+ fields

#### Current Implementation Analysis

```typescript
// 14+ fields including:
// - howDidYouHear (radio)
// - currentMappingTools (checkbox array)
// - primaryUseCase (radio)
// - mapsPerMonth (select)
// - collaboratorsCount (select)
// - expectedFeatures (checkbox array)
// - willingToPay (radio)
// - pricingModel (select)
// - willingToProvideHelpFeedback (checkbox)
// - participationLevel (select)
// - painPoints (textarea)
// - dealbreakers (textarea)
// - additionalComments (textarea)

// Features:
// - Multi-step form (not actual steps, just sections)
// - Conditional fields
// - Checkbox arrays
// - Radio groups
// - Selects
// - Textareas
// - Motion animations
// - Complex validation

const form = useForm<BetaQuestionnaireSchemaType>({
  resolver: zodResolver(betaQuestionnaireSchema),
  defaultValues: {
    howDidYouHear: undefined,
    currentMappingTools: [],
    primaryUseCase: undefined,
    // ... etc
  },
})
```

#### Migration Steps

This is the most complex form. Follow patterns established in previous forms.

**Step 1:** Update form initialization

```typescript
const form = useForm({
  defaultValues: {
    howDidYouHear: undefined as string | undefined,
    currentMappingTools: [] as string[],
    primaryUseCase: undefined as string | undefined,
    mapsPerMonth: undefined as string | undefined,
    collaboratorsCount: undefined as string | undefined,
    expectedFeatures: [] as string[],
    willingToPay: undefined as boolean | undefined,
    pricingModel: undefined as string | undefined,
    willingToProvideHelpFeedback: false,
    participationLevel: undefined as string | undefined,
    painPoints: "",
    dealbreakers: "",
    additionalComments: "",
  },
  validatorAdapter: zodValidator(),
  validators: {
    onChange: betaQuestionnaireSchema,
  },
  onSubmit: async ({ value }) => {
    await submitQuestionnaire(value)
    toast.success("Thank you for completing the questionnaire!")
    router.push("/beta/success")
  },
})
```

**Step 2:** Migrate radio groups

Use the radio group pattern from Pattern 6.

Example for `howDidYouHear`:

```typescript
<form.Field name="howDidYouHear">
  {(field) => (
    <TanStackFormItem>
      <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
        How did you hear about BuzzTrip?
      </TanStackFormLabel>
      <TanStackFormControl field={field}>
        <RadioGroup
          value={field.state.value}
          onValueChange={(value) => field.handleChange(value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="social-media" id="how-social" />
            <Label htmlFor="how-social">Social Media</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="search-engine" id="how-search" />
            <Label htmlFor="how-search">Search Engine</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="friend" id="how-friend" />
            <Label htmlFor="how-friend">Friend/Referral</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="how-other" />
            <Label htmlFor="how-other">Other</Label>
          </div>
        </RadioGroup>
      </TanStackFormControl>
      <TanStackFormMessage field={field} />
    </TanStackFormItem>
  )}
</form.Field>
```

**Step 3:** Migrate checkbox arrays

Use checkbox array pattern from Pattern 5.

Example for `currentMappingTools`:

```typescript
const mappingTools = [
  "Google Maps",
  "Apple Maps",
  "Mapbox",
  "Leaflet",
  "ArcGIS",
  "Other"
]

<form.Field name="currentMappingTools">
  {(field) => (
    <TanStackFormItem>
      <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
        What mapping tools do you currently use? (Select all that apply)
      </TanStackFormLabel>
      <div className="space-y-2">
        {mappingTools.map((tool) => (
          <div key={tool} className="flex items-center space-x-2">
            <Checkbox
              id={`tool-${tool}`}
              checked={field.state.value?.includes(tool)}
              onCheckedChange={(checked) => {
                const currentValue = field.state.value || []
                const newValue = checked
                  ? [...currentValue, tool]
                  : currentValue.filter((t) => t !== tool)
                field.handleChange(newValue)
              }}
            />
            <Label htmlFor={`tool-${tool}`} className="font-normal">
              {tool}
            </Label>
          </div>
        ))}
      </div>
      <TanStackFormMessage field={field} />
    </TanStackFormItem>
  )}
</form.Field>
```

**Step 4:** Migrate select fields

```typescript
<form.Field name="mapsPerMonth">
  {(field) => (
    <TanStackFormItem>
      <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
        How many maps do you create per month?
      </TanStackFormLabel>
      <Select
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
      >
        <TanStackFormControl field={field}>
          <SelectTrigger>
            <SelectValue placeholder="Select a range" />
          </SelectTrigger>
        </TanStackFormControl>
        <SelectContent>
          <SelectItem value="1-5">1-5</SelectItem>
          <SelectItem value="6-10">6-10</SelectItem>
          <SelectItem value="11-20">11-20</SelectItem>
          <SelectItem value="20+">20+</SelectItem>
        </SelectContent>
      </Select>
      <TanStackFormMessage field={field} />
    </TanStackFormItem>
  )}
</form.Field>
```

**Step 5:** Migrate textarea fields

```typescript
<form.Field name="painPoints">
  {(field) => (
    <TanStackFormItem>
      <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
        What are your biggest pain points with current mapping solutions?
      </TanStackFormLabel>
      <TanStackFormControl field={field}>
        <Textarea
          placeholder="Tell us about your challenges..."
          rows={5}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
        />
      </TanStackFormControl>
      <TanStackFormMessage field={field} />
    </TanStackFormItem>
  )}
</form.Field>
```

**Step 6:** Handle conditional fields

If there are conditional fields (e.g., "Other" text input appears when "Other" is selected):

```typescript
// Watch the trigger field
const howDidYouHear = form.useStore((state) => state.values.howDidYouHear)

{/* Radio group for howDidYouHear */}
<form.Field name="howDidYouHear">
  {/* ... */}
</form.Field>

{/* Conditional "Other" text input */}
{howDidYouHear === "other" && (
  <form.Field name="howDidYouHearOther">
    {(field) => (
      <TanStackFormItem>
        <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
          Please specify
        </TanStackFormLabel>
        <TanStackFormControl field={field}>
          <Input
            placeholder="How did you hear about us?"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        </TanStackFormControl>
        <TanStackFormMessage field={field} />
      </TanStackFormItem>
    )}
  </form.Field>
)}
```

**Step 7:** Preserve motion animations

Keep all Framer Motion animations - they're independent of form library.

**Step 8:** Update submit button

```typescript
<form.Subscribe
  selector={(state) => ({
    canSubmit: state.canSubmit,
    isSubmitting: state.isSubmitting,
    isValid: state.isValid,
  })}
>
  {(state) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <Button
        type="submit"
        disabled={!state.canSubmit || !state.isValid}
        className="w-full"
      >
        {state.isSubmitting ? "Submitting..." : "Submit Questionnaire"}
      </Button>
    </motion.div>
  )}
</form.Subscribe>
```

#### Special Considerations

- **Large number of fields** - Migrate in sections
- **Multiple field types** - Use all patterns learned
- **Conditional rendering** - Use `useStore` to watch fields
- **Animations** - Preserve all motion components
- **Validation** - Ensure all validation rules are preserved
- **User experience** - Test thoroughly to ensure no UX regressions

#### Testing Checklist

- [ ] All 14+ fields render correctly
- [ ] Radio groups work
- [ ] Checkbox arrays work (multiple)
- [ ] Select dropdowns work
- [ ] Textareas work
- [ ] Conditional fields appear/disappear correctly
- [ ] Validation works for all fields
- [ ] Submit button state is correct
- [ ] Form submission works
- [ ] Animations still work
- [ ] No performance issues with large form
- [ ] All error messages display correctly

---

## Special Patterns & Techniques

### Dynamic Field Arrays

TanStack Form has built-in support for array fields:

```typescript
<form.Field name="items" mode="array">
  {(field) => (
    <div>
      {/* Render existing items */}
      {field.state.value.map((_, i) => (
        <form.Field key={i} name={`items[${i}]`}>
          {(subField) => (
            <div className="flex items-center gap-2">
              <Input
                value={subField.state.value}
                onChange={(e) => subField.handleChange(e.target.value)}
              />
              <Button
                type="button"
                onClick={() => field.removeValue(i)}
              >
                Remove
              </Button>
            </div>
          )}
        </form.Field>
      ))}

      {/* Add new item */}
      <Button
        type="button"
        onClick={() => field.pushValue("")}
      >
        Add Item
      </Button>
    </div>
  )}
</form.Field>
```

**Array methods available:**

- `field.pushValue(value)` - Add to end
- `field.insertValue(index, value)` - Insert at index
- `field.removeValue(index)` - Remove at index
- `field.swapValues(indexA, indexB)` - Swap two items
- `field.moveValue(from, to)` - Move item

### Dependent Fields

When one field's value affects another field:

```typescript
// Watch country field
const country = form.useStore((state) => state.values.country)

// Render state/province field based on country
<form.Field name="state">
  {(field) => (
    <Select
      value={field.state.value}
      onValueChange={(value) => field.handleChange(value)}
    >
      <SelectTrigger>
        <SelectValue placeholder={`Select ${country === 'US' ? 'state' : 'province'}`} />
      </SelectTrigger>
      <SelectContent>
        {country === 'US' ? usStates.map(...) : canadianProvinces.map(...)}
      </SelectContent>
    </Select>
  )}
</form.Field>
```

### Form-Level Validation

Validate across multiple fields:

```typescript
const form = useForm({
  defaultValues: { ... },
  validatorAdapter: zodValidator(),
  validators: {
    onChange: baseSchema,
    // Form-level validator
    onSubmit: ({ value }) => {
      if (value.password !== value.confirmPassword) {
        return {
          form: 'Passwords must match',
          fields: {
            confirmPassword: 'Passwords must match',
          },
        }
      }
      return undefined
    },
  },
  onSubmit: async ({ value }) => { ... },
})
```

### Cross-Field Validation with Zod

```typescript
const schema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})
```

### Optimistic UI Updates

```typescript
const form = useForm({
  // ...
  onSubmit: async ({ value }) => {
    // Optimistic update
    setLocalData(value)

    try {
      await api.update(value)
    } catch (error) {
      // Rollback on error
      form.reset()
      toast.error("Update failed")
    }
  },
})
```

### Server Errors

```typescript
const form = useForm({
  // ...
  onSubmit: async ({ value }) => {
    try {
      await api.submit(value)
    } catch (error) {
      // Set server errors on specific fields
      if (error.field === 'email') {
        form.setFieldMeta('email', (prev) => ({
          ...prev,
          errors: [error.message],
        }))
      }

      // Or set form-level error
      form.setErrorMap({
        onServer: error.message,
      })
    }
  },
})
```

### Async Field Validation (Debounced)

```typescript
<form.Field
  name="username"
  validators={{
    onChangeAsyncDebounceMs: 500,
    onChangeAsync: async ({ value }) => {
      if (!value) return undefined

      const available = await checkUsernameAvailability(value)
      return available ? undefined : 'Username is already taken'
    },
  }}
>
  {(field) => (
    <TanStackFormItem>
      <TanStackFormLabel hasError={field.state.meta.errors.length > 0}>
        Username
      </TanStackFormLabel>
      <TanStackFormControl field={field}>
        <Input
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
        />
      </TanStackFormControl>
      {field.state.meta.isValidating && (
        <p className="text-sm text-muted-foreground">Checking availability...</p>
      )}
      <TanStackFormMessage field={field} />
    </TanStackFormItem>
  )}
</form.Field>
```

### Custom Validators

```typescript
// Email validator
const emailValidator: Validator<string> = ({ value }) => {
  if (!value) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'Invalid email format'
  }
  return undefined
}

// Use in field
<form.Field
  name="email"
  validators={{
    onChange: emailValidator,
  }}
>
  {/* ... */}
</form.Field>
```

### Field Transformation

Transform value before setting:

```typescript
<form.Field name="phone">
  {(field) => (
    <Input
      value={field.state.value}
      onChange={(e) => {
        // Transform: remove non-digits
        const cleaned = e.target.value.replace(/\D/g, '')

        // Format: (123) 456-7890
        let formatted = cleaned
        if (cleaned.length > 6) {
          formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
        } else if (cleaned.length > 3) {
          formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
        } else if (cleaned.length > 0) {
          formatted = `(${cleaned}`
        }

        field.handleChange(formatted)
      }}
    />
  )}
</form.Field>
```

---

## Migration Checklist

### Pre-Migration Setup

- [ ] Install dependencies:
  ```bash
  bun add @tanstack/react-form @tanstack/zod-form-adapter
  ```

- [ ] Create new TanStack Form components in `@buzztrip/ui`:
  - [ ] `packages/ui/src/tanstack-form.tsx`
  - [ ] Export from `packages/ui/src/index.tsx`

- [ ] Review all forms in codebase (use this doc as reference)

- [ ] Set up testing environment for form validation

### Per-Form Migration Checklist

For each form being migrated:

#### 1. Preparation
- [ ] Read through the form code completely
- [ ] Identify all fields and their types
- [ ] Note any special patterns (arrays, conditional fields, etc.)
- [ ] Check if form uses context or standalone
- [ ] Identify dependencies (custom components, API calls)

#### 2. Code Changes
- [ ] Update imports (remove RHF, add TanStack)
- [ ] Update form initialization
  - [ ] Change `useForm` import
  - [ ] Add `validatorAdapter: zodValidator()`
  - [ ] Move schema from `resolver` to `validators.onChange`
  - [ ] Move `onSubmit` into `useForm` config
- [ ] Update form wrapper element
  - [ ] Replace `<Form>` with `<TanStackForm>`
  - [ ] Update form submission handler
- [ ] Migrate each field
  - [ ] Replace `<FormField>` with `<form.Field>`
  - [ ] Update field value access: `field.value` → `field.state.value`
  - [ ] Update change handler: `field.onChange` → `field.handleChange`
  - [ ] Update blur handler: `field.onBlur` → `field.handleBlur`
  - [ ] Update error display: pass `field` to `TanStackFormMessage`
- [ ] Update form state usage
  - [ ] Replace `form.watch()` with `form.useStore()`
  - [ ] Replace `formState` access with `form.Subscribe` or `useStore`
- [ ] Update validation
  - [ ] Ensure Zod schema is properly integrated
  - [ ] Test field-level and form-level validation
  - [ ] Handle async validation if needed
- [ ] Update special patterns
  - [ ] Checkbox arrays
  - [ ] Radio groups
  - [ ] Dynamic field arrays
  - [ ] Conditional fields
  - [ ] Auto-save patterns

#### 3. Testing
- [ ] Form renders without errors
- [ ] All fields display correctly
- [ ] Field validation works
  - [ ] Required fields
  - [ ] Format validation (email, phone, etc.)
  - [ ] Custom validation rules
  - [ ] Async validation (if applicable)
- [ ] Error messages display correctly
- [ ] Form submission works
  - [ ] Success case
  - [ ] Error case
  - [ ] Server validation errors
- [ ] Form reset works
- [ ] Default values populate correctly
- [ ] External data sync works (if applicable)
- [ ] Accessibility
  - [ ] Labels associated with inputs
  - [ ] Error messages announced
  - [ ] `aria-invalid` set correctly
  - [ ] `aria-describedby` set correctly
- [ ] Performance
  - [ ] No unnecessary re-renders
  - [ ] Form feels responsive
  - [ ] Large forms don't lag

#### 4. Cleanup
- [ ] Remove all unused RHF imports
- [ ] Remove old form component imports
- [ ] Remove any RHF-specific code
- [ ] Update any related documentation
- [ ] Remove any workarounds that were RHF-specific

#### 5. Code Review
- [ ] Self-review the changes
- [ ] Ensure code follows team conventions
- [ ] Check for type safety
- [ ] Verify no console errors/warnings
- [ ] Test in different browsers (if web)

### Post-Migration Verification

After all forms are migrated:

- [ ] Remove React Hook Form from dependencies:
  ```bash
  bun remove react-hook-form @hookform/resolvers
  ```

- [ ] Remove old `form.tsx` from `@buzztrip/ui` (or keep for reference)

- [ ] Update documentation
  - [ ] Update form examples in docs
  - [ ] Create team guide for new form pattern
  - [ ] Document common patterns

- [ ] Run full test suite
  - [ ] Unit tests
  - [ ] Integration tests
  - [ ] E2E tests (if applicable)

- [ ] Performance audit
  - [ ] Check bundle size reduction
  - [ ] Verify no performance regressions
  - [ ] Test on slower devices

- [ ] Accessibility audit
  - [ ] Run automated accessibility tests
  - [ ] Manual keyboard navigation test
  - [ ] Screen reader testing

---

## Recommended Migration Order

### Phase 1: Foundation (Week 1)
1. ✅ Create TanStack Form components in `@buzztrip/ui`
2. ✅ Migrate **Contact Form** (simplest, learning baseline)
3. ✅ Migrate **Beta Quick Signup Form** (tests Clerk integration)
4. ✅ Document patterns and create team guide

### Phase 2: Simple Forms (Week 1-2)
5. ✅ Migrate **Collection Form** (add validation schema)
6. ✅ Migrate **Map Details Form** (wait for provider or make standalone)

### Phase 3: Complex Forms (Week 2-3)
7. ✅ Complete **Marker Form** migration (resolve mixed pattern)
8. ✅ Migrate **Paths Form** (nested objects, sliders)
9. ✅ Migrate **Label Form** (auto-save pattern)

### Phase 4: Most Complex (Week 3-4)
10. ✅ Migrate **Map Form Provider** (context pattern, most dependent)
11. ✅ Finalize **Map Details Form** integration with provider
12. ✅ Migrate **Beta Questionnaire** (largest, most complex)

### Phase 5: Cleanup & Documentation (Week 4)
13. ✅ Remove React Hook Form dependency
14. ✅ Full testing and QA
15. ✅ Update documentation
16. ✅ Team training session

---

## Additional Resources

### Official Documentation
- **TanStack Form Docs:** https://tanstack.com/form/latest/docs/overview
- **TanStack Form React Guide:** https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts
- **ShadCN TanStack Form:** https://ui.shadcn.com/docs/forms/tanstack-form
- **Zod Documentation:** https://zod.dev

### Code Examples
- See each form migration section for before/after examples
- Check `packages/ui/src/tanstack-form.tsx` for component implementations

### Support
- TanStack Discord: https://discord.com/invite/WrRKjPJ
- GitHub Issues: https://github.com/TanStack/form/issues

---

## Conclusion

This migration plan provides a comprehensive guide to migrating all forms in the BuzzTrip web application from React Hook Form to TanStack Form.

**Key Takeaways:**

1. **Incremental Migration:** Follow the phased approach to minimize risk
2. **Reusable Components:** Create solid foundation with `@buzztrip/ui` components
3. **Pattern Library:** Use documented patterns for consistent implementation
4. **Thorough Testing:** Test each form extensively before moving to the next
5. **Team Learning:** Use simple forms first to build team expertise

**Benefits After Migration:**

- ✅ Consistent form pattern across entire app
- ✅ Better TypeScript support
- ✅ Smaller bundle size
- ✅ More flexible validation
- ✅ Better async validation support
- ✅ Improved developer experience
- ✅ Future-proof form architecture

**Estimated Timeline:** 3-4 weeks for complete migration

Good luck with the migration! 🚀