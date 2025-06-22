This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# FE Surveyer

## Toast Notifications

This application uses [Sonner](https://sonner.emilkowal.ski/) for toast notifications across all user actions. The implementation provides consistent user feedback for all operations:

### Toast Types Implemented

1. **Promise-based Toasts (`toast.promise`)** - For async operations with loading states:

   - AI survey generation
   - Survey response submission
   - Survey creation and updates
   - Email sending operations

2. **Success Toasts (`toast.success`)** - For successful operations:

   - Survey operations (create, update, delete, publish)
   - Question management (create, update, delete)
   - Response submissions
   - File exports

3. **Error Toasts (`toast.error`)** - For failed operations:
   - API errors with detailed messages
   - Validation errors
   - Network failures

### Key Features

- **Loading states**: Visual feedback during async operations
- **Error handling**: Consistent error messages across the app
- **Success confirmation**: Clear feedback when operations complete
- **Contextual messages**: Specific messages for different operations
- **User-friendly**: Emojis and clear language for better UX

### Implementation Coverage

All major user actions now have toast notifications:

- ✅ Survey management (CRUD operations)
- ✅ Question management
- ✅ Response handling
- ✅ AI survey generation
- ✅ Authentication flows
- ✅ File operations
- ✅ Email notifications

### Usage Examples

```typescript
// Promise-based toast for async operations
await toast.promise(someAsyncOperation(), {
  loading: "🔄 Processing...",
  success: "✅ Operation completed!",
  error: "❌ Operation failed",
});

// Simple success toast
toast.success("Survey created successfully!");

// Error toast with details
toast.error(error?.message || "Something went wrong");
```
