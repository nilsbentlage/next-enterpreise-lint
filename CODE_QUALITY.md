# Code Quality Standards

This project enforces high code quality standards through automated pre-commit and pre-push hooks. These hooks ensure that the code meets quality, formatting, and security standards before being committed or pushed to the repository.

## Pre-commit Hook

The pre-commit hook runs automatically when you run `git commit` and performs the following checks:

- **Prettier**: Formats all supported files to ensure consistent styling
- **ESLint**: Lints JavaScript/TypeScript files with the following rules:
  - No console.log statements (except warn/error)
  - All user-facing strings must use next-intl for internationalization
  - Code style and best practices
- **Spell Checker**: Checks for spelling mistakes in your code and documentation
- **Unit Tests**: Ensures all unit tests pass

## Pre-push Hook

The pre-push hook runs automatically when you run `git push` and performs the following checks:

- **Build Verification**: Ensures the build process completes successfully
- **Security Checks**: Verifies that protected routes implement proper authentication
- **Optional E2E Tests**: Can be enabled to run end-to-end tests before pushing

## Authentication Enforcement

All, except whitelisted, routes must implement proper authentication.

### Server-side protected routes:

```typescript
const session = await getServerSession(authOptions);
if (!session?.user || session.user.role !== "admin") {
  return <AccessDenied />;
}
```

### Client-side protected routes:

```typescript
const { data: session } = useSession();
if (!session?.user || session.user.role !== "admin") {
  return <AccessDenied />;
}
```

## Extending the Hooks

You can add additional checks to the pre-commit or pre-push hooks by editing the files in the `.husky` directory.

- Pre-commit hook: `.husky/pre-commit`
- Pre-push hook: `.husky/pre-push`

## Bypassing Hooks (Emergency Only)

In emergency situations, you can bypass the hooks using:

```bash
git commit --no-verify
git push --no-verify
```

**Note**: This is strongly discouraged as it bypasses all quality checks.
