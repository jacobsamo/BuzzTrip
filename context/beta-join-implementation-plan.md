# Beta Join Signup Flow - Implementation Plan

**Status:** Ready for Implementation
**Created:** 2025-10-12
**Feature:** Beta User Signup and Onboarding Flow

## Table of Contents
1. [Overview](#overview)
2. [User Flow Scenarios](#user-flow-scenarios)
3. [Technical Architecture](#technical-architecture)
4. [Implementation Details](#implementation-details)
5. [Files to Create/Modify](#files-to-createmodify)
6. [Testing Checklist](#testing-checklist)

---

## Overview

Create a comprehensive beta signup flow that handles three distinct user scenarios:
1. **New users** who need to complete Clerk sign-up
2. **Existing users** who should be upgraded to beta status immediately
3. **Existing beta users** who want to update their responses

The flow includes a multi-question survey, intelligent duplicate handling, immediate email notifications, and automatic Clerk metadata updates.

---

## User Flow Scenarios

### Scenario A: New User (No Account)

```
User visits /beta
    ↓
Fills out form with email + survey questions
    ↓
Backend stores in beta_signups table
    ↓
Beta-join email sent IMMEDIATELY
    ↓
User clicks "Complete Signup" → /sign-up?beta=true
    ↓
Clerk sign-up with beta flag in unsafeMetadata
    ↓
Webhook triggers createUser
    ↓
System links beta_signups record to new user
    ↓
Sets isBetaUser: true + updates Clerk publicMetadata
    ↓
Beta-welcome email sent with WhatsApp link
    ↓
User redirected to /app?beta_welcome=true
    ↓
Confirmation toast shown in app
```

### Scenario B: Existing User (Has Account)

```
User visits /beta
    ↓
Fills out form with email
    ↓
Backend detects existing user account by email
    ↓
IMMEDIATELY upgrade user to beta status
    ↓
Store survey responses in beta_signups (mark completed)
    ↓
Link beta_signups to user record
    ↓
Update Clerk publicMetadata
    ↓
Beta-welcome email sent IMMEDIATELY (NOT join email)
    ↓
Return success: "You've been upgraded to beta! Check your email."
```

### Scenario C: Existing Beta User

```
User visits /beta
    ↓
Fills out form with email
    ↓
Backend detects existing beta user
    ↓
Update their survey responses in beta_signups
    ↓
Return: "You're already a beta member! Updated your responses."
```

---

## Technical Architecture

### Database Schema

#### New Table: `beta_signups`

```typescript
{
  _id: Id<"beta_signups">,
  _creationTime: number,
  email: string,                              // User email
  responses: Record<string, string>,          // Survey answers
  isCompleted: boolean,                       // Linked to user account?
  userId?: string,                            // Id<"users"> when completed
  submittedAt: string,                        // ISO timestamp
  completedAt?: string,                       // ISO timestamp when linked
}

// Indexes:
// - by_email (for lookups during signup)
// - by_completion (for analytics)
// - by_user_id (for user profile lookups)
```

#### Updated: `users` table

```typescript
// Add to existing user schema:
{
  isBetaUser?: boolean,                       // Beta user flag
  betaSignupId?: string,                      // Id<"beta_signups">
  betaJoinedAt?: string,                      // ISO timestamp
}
```

### Survey Questions (5-6 Quick Questions)

1. **Email** (required)
2. **What tools do you currently use when planning trips?** (textarea)
   - Examples: Google Maps, TripAdvisor, Notion, etc.
3. **What hacks or workarounds have you been using when planning?** (textarea)
4. **What apps do you work together to plan a trip?** (multi-select + other)
   - Options: Google Maps, WhatsApp, Notion, Trello, Google Docs, Other
5. **Do you currently pay for any travel or planning apps? If so, which ones?** (text input)
6. **How did you find BuzzTrip?** (radio select)
   - Options: Social Media, Search Engine, Friend/Referral, Other

---

## Implementation Details

### Phase 1: Database Schema Updates

#### File: `packages/backend/zod-schemas/beta-schema.ts` (NEW)

```typescript
import { z } from "zod";
import { defaultFields } from "./shared-schemas";

export const betaSignupSchema = z.object({
  ...defaultFields,
  email: z.string().email(),
  responses: z.record(z.string(), z.string()),
  isCompleted: z.boolean().default(false),
  userId: z.string().optional(),
  submittedAt: z.string(),
  completedAt: z.string().optional(),
});

export type BetaSignup = z.infer<typeof betaSignupSchema>;
```

#### File: `packages/backend/zod-schemas/auth-schema.ts` (UPDATE)

```typescript
// Add to existing userSchema:
export const userSchema = z.object({
  // ... existing fields
  isBetaUser: z.boolean().optional().default(false),
  betaSignupId: z.string().optional(),
  betaJoinedAt: z.string().optional(),
});
```

#### File: `packages/backend/convex/schema.ts` (UPDATE)

```typescript
import { betaSignupSchema } from "../zod-schemas/beta-schema";

export default defineSchema({
  // ... existing tables
  beta_signups: defineTable(zodToConvex(betaSignupSchema))
    .index("by_email", ["email"])
    .index("by_completion", ["isCompleted"])
    .index("by_user_id", ["userId"]),
});
```

---

### Phase 2: Backend Functions

#### File: `packages/backend/convex/beta.ts` (NEW)

```typescript
import { v } from "convex/values";
import { z } from "zod";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { zodMutation } from "./helpers";

/**
 * Submit beta signup form
 * Handles three scenarios:
 * 1. New user (no account) -> create beta_signup, send join email
 * 2. Existing user (has account) -> upgrade to beta, send welcome email
 * 3. Existing beta user -> update responses only
 */
export const submitBetaSignup = zodMutation({
  args: {
    email: z.string().email(),
    responses: z.record(z.string(), z.string()),
  },
  returns: z.object({
    success: z.boolean(),
    message: z.string(),
    scenario: z.enum(["new_signup", "existing_user_upgraded", "already_beta"]),
  }),
  handler: async (ctx, { email, responses }) => {
    const now = new Date().toISOString();

    // 1. Check if user account exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    // 2. Check if beta signup exists
    const existingBetaSignup = await ctx.db
      .query("beta_signups")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    // SCENARIO B & C: User has an account
    if (existingUser) {
      // SCENARIO C: Already a beta user - just update responses
      if (existingUser.isBetaUser) {
        if (existingBetaSignup) {
          await ctx.db.patch(existingBetaSignup._id, { responses });
        }
        return {
          success: true,
          message: "You're already a beta member! Updated your responses.",
          scenario: "already_beta",
        };
      }

      // SCENARIO B: Existing user, upgrade to beta
      let betaSignupId = existingBetaSignup?._id;

      // Create or update beta signup record
      if (!existingBetaSignup) {
        betaSignupId = await ctx.db.insert("beta_signups", {
          email,
          responses,
          isCompleted: true,
          userId: existingUser._id,
          submittedAt: now,
          completedAt: now,
        });
      } else {
        await ctx.db.patch(existingBetaSignup._id, {
          responses,
          isCompleted: true,
          userId: existingUser._id,
          completedAt: now,
        });
      }

      // Update user record
      await ctx.db.patch(existingUser._id, {
        isBetaUser: true,
        betaSignupId,
        betaJoinedAt: now,
      });

      // Send welcome email immediately (NOT join email)
      await ctx.runMutation(internal.emails.sendBetaWelcomeEmail, {
        firstName: existingUser.first_name,
        email: existingUser.email,
        whatsappLink: "https://links.buzztrip.co/whatsapp",
      });

      // Update Clerk metadata
      await ctx.scheduler.runAfter(0, internal.clerk.updateUserMetadata, {
        clerkUserId: existingUser.clerkUserId,
        metadata: { isBetaUser: true, betaJoinedAt: now },
      });

      return {
        success: true,
        message: "You've been upgraded to beta! Check your email for the WhatsApp link.",
        scenario: "existing_user_upgraded",
      };
    }

    // SCENARIO A: New signup (no account yet)
    if (existingBetaSignup) {
      // Update existing beta signup
      await ctx.db.patch(existingBetaSignup._id, {
        responses,
        submittedAt: now,
      });
    } else {
      // Create new beta signup
      await ctx.db.insert("beta_signups", {
        email,
        responses,
        isCompleted: false,
        submittedAt: now,
      });
    }

    // Send beta-join email immediately
    await ctx.runMutation(internal.emails.sendBetaJoinEmail, {
      email,
    });

    return {
      success: true,
      message: "Check your email! We've sent you a link to complete your signup.",
      scenario: "new_signup",
    };
  },
});

/**
 * Get beta signup by email
 * Used internally by createUser to link records
 */
export const getBetaSignupByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("beta_signups")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
  },
});
```

#### File: `packages/backend/convex/clerk.ts` (NEW)

```typescript
import { Clerk } from "@clerk/backend";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";

/**
 * Initialize Clerk client with secret key
 */
const clerk = new Clerk({
  secretKey: process.env.CLERK_SECRET_KEY
});

/**
 * Update Clerk user's public metadata
 * Used to sync beta status to Clerk for JWT tokens
 */
export const updateUserMetadata = internalAction({
  args: {
    clerkUserId: v.string(),
    metadata: v.any(),
  },
  handler: async (ctx, { clerkUserId, metadata }) => {
    try {
      await clerk.users.updateUser(clerkUserId, {
        publicMetadata: metadata,
      });
      console.log("✅ Updated Clerk metadata for user:", clerkUserId);
    } catch (error) {
      console.error("❌ Failed to update Clerk metadata:", error);
      throw error;
    }
  },
});
```

#### File: `packages/backend/convex/users.ts` (UPDATE)

Update the `createUser` mutation to detect beta signups and link records:

```typescript
export const createUser = internalMutation({
  args: { data: v.any() },
  async handler(ctx, { data }: { data: UserJSON }) {
    const userRecord = await userQuery(ctx, data.id);
    if (userRecord !== null) {
      throw new Error("User already exists");
    }

    const user = extractUserFields(data);
    const now = new Date().toISOString();

    // Check for beta signup
    const isBetaFromClerk = data.unsafe_metadata?.isBetaUser === true;
    const betaSignup = await ctx.db
      .query("beta_signups")
      .withIndex("by_email", (q) => q.eq("email", user.email))
      .first();

    const isBetaUser = isBetaFromClerk || betaSignup !== null;

    // Insert user with beta flags if applicable
    const userId = await ctx.db.insert("users", {
      ...user,
      isBetaUser,
      betaSignupId: betaSignup?._id,
      betaJoinedAt: isBetaUser ? now : undefined,
    });

    // Handle beta user setup
    if (isBetaUser && betaSignup) {
      // Link beta signup to user
      await ctx.db.patch(betaSignup._id, {
        isCompleted: true,
        userId,
        completedAt: now,
      });

      // Send beta-welcome email
      await ctx.runMutation(internal.emails.sendBetaWelcomeEmail, {
        firstName: user.first_name,
        email: user.email,
        whatsappLink: "https://links.buzztrip.co/whatsapp",
      });

      // Update Clerk public metadata
      await ctx.scheduler.runAfter(0, internal.clerk.updateUserMetadata, {
        clerkUserId: data.id,
        metadata: { isBetaUser: true, betaJoinedAt: now },
      });
    } else {
      // Regular welcome email for non-beta users
      await ctx.runMutation(internal.emails.sendWelcomeEmail, {
        firstName: user.first_name,
        email: user.email,
      });
    }

    // Create default map (existing logic)
    await createMapFunction(ctx, {
      userId: userId,
      map: {
        title: "Main map",
        description: "The starting point to the next adventure!",
        visibility: "private",
      },
    });
  },
});
```

#### File: `packages/backend/convex/emails.ts` (UPDATE)

Add two new email functions:

```typescript
import BetaJoinEmail from "@buzztrip/transactional/emails/beta-join";
import BetaWelcomeEmail from "@buzztrip/transactional/emails/beta-welcome";

/**
 * Send beta-join email (for new users who need to complete signup)
 */
export const sendBetaJoinEmail = zodInternalMutation({
  args: {
    email: z.string().email(),
    firstName: z.string().optional(),
  },
  handler: async (ctx, { email, firstName }) => {
    await resend.sendEmail(ctx, {
      from: "Jacob Samorowski <info@buzztrip.co>",
      to: firstName ? `${firstName} <${email}>` : email,
      subject: "Welcome to BuzzTrip Beta - Complete Your Signup",
      replyTo: ["jacob.samorowski@buzztrip.co"],
      react: BetaJoinEmail({ email, firstName }),
    });
  },
});

/**
 * Send beta-welcome email (after account is created)
 */
export const sendBetaWelcomeEmail = zodInternalMutation({
  args: {
    email: z.string().email(),
    firstName: z.string().optional(),
    whatsappLink: z.string().url(),
  },
  handler: async (ctx, { email, firstName, whatsappLink }) => {
    await resend.sendEmail(ctx, {
      from: "Jacob Samorowski <info@buzztrip.co>",
      to: firstName ? `${firstName} <${email}>` : email,
      subject: "Welcome to BuzzTrip Beta!",
      replyTo: ["jacob.samorowski@buzztrip.co"],
      react: BetaWelcomeEmail({ email, firstName, whatsappLink }),
    });
  },
});
```

---

### Phase 3: Email Templates

#### File: `packages/transactional/emails/beta-join.tsx` (UPDATE)

Update the button/link to point to the sign-up page with beta flag:

```typescript
// Update the CTA button section:
<Section className="text-center mb-[32px]">
  <Button
    href="https://buzztrip.co/sign-up?beta=true"
    className="bg-[#2C7873] text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold"
  >
    Complete Your Signup 🚀
  </Button>
</Section>

// Update the main copy:
<Text className="text-[16px] text-[#04131B] mb-[24px]">
  Thanks for your interest in joining the BuzzTrip Beta program!
  We're excited to have you as part of our early community.
</Text>

<Text className="text-[16px] text-[#04131B] mb-[24px]">
  Click the button below to complete your account setup and get started
  creating amazing custom maps!
</Text>
```

#### File: `packages/transactional/emails/beta-welcome.tsx` (NO CHANGES)

This template is already perfect! It includes:
- Welcome message from Jacob
- Beta program benefits
- WhatsApp group CTA with dynamic link
- "Start Creating Maps" button
- Social links and footer

---

### Phase 4: Frontend Pages

#### File: `apps/web/src/app/beta/page.tsx` (NEW)

```typescript
'use client';

import { api } from "@buzztrip/backend/api";
import { Button } from "@buzztrip/ui/components/button";
import { Input } from "@buzztrip/ui/components/input";
import { Label } from "@buzztrip/ui/components/label";
import { Textarea } from "@buzztrip/ui/components/textarea";
import { RadioGroup, RadioGroupItem } from "@buzztrip/ui/components/radio-group";
import { Checkbox } from "@buzztrip/ui/components/checkbox";
import { useMutation } from "convex/react";
import { useState } from "react";

export default function BetaSignupPage() {
  const submitBetaSignup = useMutation(api.beta.submitBetaSignup);

  const [formData, setFormData] = useState({
    email: "",
    currentTools: "",
    hacksWorkarounds: "",
    appsUsed: [] as string[],
    appsUsedOther: "",
    paidApps: "",
    howDidYouFind: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    scenario?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Build responses object
    const responses = {
      currentTools: formData.currentTools,
      hacksWorkarounds: formData.hacksWorkarounds,
      appsUsed: formData.appsUsedOther
        ? [...formData.appsUsed, `Other: ${formData.appsUsedOther}`].join(", ")
        : formData.appsUsed.join(", "),
      paidApps: formData.paidApps,
      howDidYouFind: formData.howDidYouFind,
    };

    try {
      const result = await submitBetaSignup({
        email: formData.email,
        responses,
      });
      setResult(result);
    } catch (error) {
      console.error("Beta signup error:", error);
      setResult({
        success: false,
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (result?.success) {
    return (
      <div className="container max-w-2xl mx-auto py-12 px-4">
        <div className="rounded-lg bg-[#2C7873] p-8 text-white text-center">
          <h1 className="text-3xl font-bold mb-4">Success! 🎉</h1>
          <p className="text-lg mb-2">{result.message}</p>

          {result.scenario === "new_signup" && (
            <p className="text-sm opacity-90">
              Look for an email from Jacob Samorowski with your signup link.
            </p>
          )}

          {result.scenario === "existing_user_upgraded" && (
            <p className="text-sm opacity-90">
              You can now access beta features and join our WhatsApp community!
            </p>
          )}
        </div>
      </div>
    );
  }

  // Form state
  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#04131B] mb-4">
          Join BuzzTrip Beta
        </h1>
        <p className="text-lg text-[#04131B]/80">
          Help shape the future of custom mapping. Answer a few quick questions
          to join our exclusive beta program.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question 1: Email */}
        <div>
          <Label htmlFor="email" className="text-base font-semibold">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your@email.com"
            className="mt-2"
          />
        </div>

        {/* Question 2: Current Tools */}
        <div>
          <Label htmlFor="currentTools" className="text-base font-semibold">
            What tools do you currently use when planning trips?
          </Label>
          <Textarea
            id="currentTools"
            value={formData.currentTools}
            onChange={(e) => setFormData({ ...formData, currentTools: e.target.value })}
            placeholder="Google Maps, TripAdvisor, Notion, etc."
            className="mt-2 min-h-[100px]"
          />
        </div>

        {/* Question 3: Hacks/Workarounds */}
        <div>
          <Label htmlFor="hacksWorkarounds" className="text-base font-semibold">
            What hacks or workarounds have you been using when planning?
          </Label>
          <Textarea
            id="hacksWorkarounds"
            value={formData.hacksWorkarounds}
            onChange={(e) => setFormData({ ...formData, hacksWorkarounds: e.target.value })}
            placeholder="Share your current planning process..."
            className="mt-2 min-h-[100px]"
          />
        </div>

        {/* Question 4: Apps Used Together */}
        <div>
          <Label className="text-base font-semibold mb-3 block">
            What apps do you work together to plan a trip?
          </Label>
          <div className="space-y-2">
            {["Google Maps", "WhatsApp", "Notion", "Trello", "Google Docs", "Apple Maps"].map((app) => (
              <div key={app} className="flex items-center space-x-2">
                <Checkbox
                  id={app}
                  checked={formData.appsUsed.includes(app)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({
                        ...formData,
                        appsUsed: [...formData.appsUsed, app]
                      });
                    } else {
                      setFormData({
                        ...formData,
                        appsUsed: formData.appsUsed.filter(a => a !== app)
                      });
                    }
                  }}
                />
                <Label htmlFor={app} className="font-normal cursor-pointer">
                  {app}
                </Label>
              </div>
            ))}
            <div className="pt-2">
              <Input
                placeholder="Other (please specify)"
                value={formData.appsUsedOther}
                onChange={(e) => setFormData({ ...formData, appsUsedOther: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Question 5: Paid Apps */}
        <div>
          <Label htmlFor="paidApps" className="text-base font-semibold">
            Do you currently pay for any travel or planning apps? If so, which ones?
          </Label>
          <Input
            id="paidApps"
            value={formData.paidApps}
            onChange={(e) => setFormData({ ...formData, paidApps: e.target.value })}
            placeholder="List any paid apps, or leave blank"
            className="mt-2"
          />
        </div>

        {/* Question 6: How Did You Find Us */}
        <div>
          <Label className="text-base font-semibold mb-3 block">
            How did you find BuzzTrip?
          </Label>
          <RadioGroup
            value={formData.howDidYouFind}
            onValueChange={(value) => setFormData({ ...formData, howDidYouFind: value })}
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="social" id="social" />
                <Label htmlFor="social" className="font-normal cursor-pointer">
                  Social Media
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="search" id="search" />
                <Label htmlFor="search" className="font-normal cursor-pointer">
                  Search Engine
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friend" id="friend" />
                <Label htmlFor="friend" className="font-normal cursor-pointer">
                  Friend/Referral
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="font-normal cursor-pointer">
                  Other
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || !formData.email}
            className="w-full bg-[#2C7873] hover:bg-[#1f5a56] text-white text-lg py-6"
          >
            {isSubmitting ? "Submitting..." : "Join Beta Program"}
          </Button>
        </div>
      </form>
    </div>
  );
}
```

#### File: `apps/web/src/app/(auth)/sign-up/[[...sign-up]]/page.tsx` (UPDATE)

```typescript
'use client';

import { SignUp } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const isBeta = searchParams.get('beta') === 'true';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
      {isBeta && (
        <div className="mb-6 rounded-lg bg-[#2C7873] p-6 text-white text-center max-w-md mx-4">
          <p className="font-semibold text-xl mb-2">Welcome Beta Tester! 🎉</p>
          <p className="text-sm opacity-90">
            You're joining an exclusive group of early adopters helping shape
            the future of BuzzTrip. We can't wait to build this with you!
          </p>
        </div>
      )}

      <SignUp
        unsafeMetadata={isBeta ? { isBetaUser: true } : undefined}
        afterSignUpUrl="/app?beta_welcome=true"
      />
    </div>
  );
}
```

#### File: `apps/web/src/app/app/page.tsx` (UPDATE)

Add beta welcome toast:

```typescript
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner'; // or your toast library

export default function AppPage() {
  const searchParams = useSearchParams();
  const showBetaWelcome = searchParams.get('beta_welcome') === 'true';

  useEffect(() => {
    if (showBetaWelcome) {
      toast.success(
        "Welcome to BuzzTrip Beta! 🎉 Check your email for the WhatsApp community link where you can connect with other beta testers.",
        {
          duration: 10000,
          position: 'top-center',
        }
      );

      // Clean up URL
      window.history.replaceState({}, '', '/app');
    }
  }, [showBetaWelcome]);

  // ... rest of existing app page code
}
```

---

### Phase 5: Configuration & Environment

#### Convex Environment Variables

Add to Convex Dashboard (Settings > Environment Variables):

```
CLERK_SECRET_KEY=sk_test_... (or sk_live_... for production)
```

#### Clerk JWT Template Configuration

In Clerk Dashboard → JWT Templates → Select "convex" template → Add to claims:

```json
{
  "isBetaUser": {{user.public_metadata.isBetaUser}},
  "betaJoinedAt": {{user.public_metadata.betaJoinedAt}}
}
```

This makes beta status available in Convex auth context for future feature gating.

#### Hardcoded Values

- **WhatsApp Link:** `https://links.buzztrip.co/whatsapp`
- **Sign-up URL:** `https://buzztrip.co/sign-up?beta=true`

---

## Files to Create/Modify

### New Files (4)

1. `packages/backend/zod-schemas/beta-schema.ts`
2. `packages/backend/convex/beta.ts`
3. `packages/backend/convex/clerk.ts`
4. `apps/web/src/app/beta/page.tsx`

### Modified Files (7)

1. `packages/backend/zod-schemas/auth-schema.ts` - Add beta fields to userSchema
2. `packages/backend/convex/schema.ts` - Add beta_signups table
3. `packages/backend/convex/users.ts` - Update createUser to handle beta linking
4. `packages/backend/convex/emails.ts` - Add sendBetaJoinEmail & sendBetaWelcomeEmail
5. `packages/transactional/emails/beta-join.tsx` - Update button link and copy
6. `apps/web/src/app/(auth)/sign-up/[[...sign-up]]/page.tsx` - Add beta banner
7. `apps/web/src/app/app/page.tsx` - Add beta welcome toast

---

## Testing Checklist

### Scenario A: New User Flow
- [ ] Visit `/beta` and submit form with new email
- [ ] Verify beta_signups record created with isCompleted: false
- [ ] Receive beta-join email immediately
- [ ] Click "Complete Your Signup" button → redirected to `/sign-up?beta=true`
- [ ] See beta welcome banner on sign-up page
- [ ] Complete Clerk sign-up
- [ ] Verify user created with isBetaUser: true
- [ ] Verify beta_signups record updated to isCompleted: true and linked to userId
- [ ] Receive beta-welcome email with WhatsApp link
- [ ] Redirected to `/app?beta_welcome=true`
- [ ] See success toast in app
- [ ] Verify Clerk publicMetadata updated with isBetaUser: true

### Scenario B: Existing User Flow
- [ ] Create a regular (non-beta) user account first
- [ ] Visit `/beta` and submit form with existing user's email
- [ ] Verify user record immediately updated to isBetaUser: true
- [ ] Verify beta_signups record created with isCompleted: true
- [ ] Receive beta-welcome email immediately (NOT join email)
- [ ] Verify Clerk publicMetadata updated
- [ ] See success message: "You've been upgraded to beta!"
- [ ] Click WhatsApp link in email → join community

### Scenario C: Existing Beta User Flow
- [ ] Submit beta form with email of existing beta user
- [ ] Verify responses updated in beta_signups table
- [ ] No duplicate records created
- [ ] See message: "You're already a beta member! Updated your responses."
- [ ] No emails sent

### Edge Cases
- [ ] Submit form twice quickly with same email (new user) → handle gracefully
- [ ] Invalid email format → validation error shown
- [ ] Empty required fields → form validation prevents submit
- [ ] Clerk sign-up without beta param → regular user flow works
- [ ] Beta user logs out and logs back in → beta status persists

### Email Verification
- [ ] Beta-join email has correct link: `/sign-up?beta=true`
- [ ] Beta-welcome email has correct WhatsApp link: `https://links.buzztrip.co/whatsapp`
- [ ] Email styling matches BuzzTrip brand
- [ ] Emails sent from: Jacob Samorowski <info@buzztrip.co>
- [ ] Reply-to: jacob.samorowski@buzztrip.co

### Analytics & Data
- [ ] beta_signups table has proper indexes
- [ ] Survey responses stored correctly in responses field
- [ ] Timestamps (submittedAt, completedAt) accurate
- [ ] User profile shows beta badge/indicator (if implemented)
- [ ] Admin can query beta users and their responses

---

## Implementation Order

1. **Backend Schema** (30 min)
   - Create beta-schema.ts
   - Update auth-schema.ts
   - Update schema.ts

2. **Backend Functions** (1-2 hours)
   - Create beta.ts with submitBetaSignup mutation
   - Create clerk.ts with metadata update action
   - Update users.ts createUser function
   - Update emails.ts with new email functions

3. **Email Templates** (15 min)
   - Update beta-join.tsx button link

4. **Frontend Beta Form** (1-2 hours)
   - Create /beta/page.tsx with full survey form
   - Add validation and error handling
   - Style according to design system

5. **Frontend Sign-up Enhancement** (30 min)
   - Update sign-up page with beta detection
   - Add beta welcome banner

6. **Frontend App Confirmation** (15 min)
   - Add beta welcome toast to app page

7. **Configuration** (15 min)
   - Add CLERK_SECRET_KEY to Convex
   - Update Clerk JWT template

8. **Testing** (1-2 hours)
   - Test all three scenarios
   - Test edge cases
   - Verify emails
   - Check data integrity

**Total Estimated Time:** 5-7 hours

---

## Future Enhancements

- **Admin Dashboard:** View all beta signups and responses
- **Beta Badge:** Show beta user badge in UI
- **Feature Gating:** Use isBetaUser flag to enable/disable features
- **Beta Analytics:** Track beta user engagement and feedback
- **Auto-expire:** Add expiration date to beta access
- **Beta Feedback Form:** In-app feedback collection for beta users
- **Welcome Tour:** Show onboarding tour for new beta users

---

## Notes

- Emails are sent **immediately** (not queued)
- WhatsApp link is **hardcoded** (no env var needed)
- Beta status synced to **both** Convex and Clerk
- Duplicate handling is **intelligent** (new/existing/beta scenarios)
- Survey responses are **preserved** even if user already has account
- Beta signup can happen **before or after** account creation

---

**Last Updated:** 2025-10-12
**Status:** Ready for Implementation
