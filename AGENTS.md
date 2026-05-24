# AGENTS.md — React Native + Expo Frontend

> Purpose: Give Codex consistent, reusable instructions for working in a React Native + Expo frontend repository.  
> Scope: These rules apply to this directory and its descendants unless a more specific `AGENTS.md` exists in a subdirectory.

---

## 0. Operating Principles

You are an autonomous coding agent working inside this repository.

Your priorities are:

1. Preserve existing behavior unless the user explicitly asks for a change.
2. Make the smallest safe change that solves the problem.
3. Prefer readable, maintainable code over clever code.
4. Verify changes with type checks, lint, tests, or builds whenever possible.
5. Explain trade-offs clearly when there are multiple valid approaches.
6. Never hide uncertainty. If something is ambiguous, state the assumption you made.
7. Do not edit generated Expo/React Native native files by default.

When the user asks for implementation, implement.  
When the user asks for investigation, investigate first and avoid unnecessary edits.  
When the user asks for refactoring, preserve public behavior and API compatibility unless told otherwise.

---

## 1. Response Style

Use concise, practical Korean by default unless the repository or user request is in English.

Write all user-facing messages, commit messages, PR descriptions, issue bodies, and work logs in Korean.

Prefer this answer shape:

1. What changed
2. Why it changed
3. How to verify
4. Risks or follow-up work

When reporting a bug, include:

- Root cause
- Exact location
- Minimal fix
- Verification method

Avoid long theoretical explanations unless the user asks for them.

---

## 2. Before Editing

Before changing files:

1. Inspect the repository structure.
2. Read `package.json`, `app.json` or `app.config.*`, `babel.config.*`, `tsconfig.json`, and `eas.json` when present.
3. Identify the Expo SDK version, React Native version, and package manager.
4. Learn the existing folder structure, naming style, component patterns, and styling system.
5. Search for similar implementations and reuse local conventions.
6. Check whether the target file is generated or manually maintained.
7. Run `git status` when possible to avoid overwriting user work.

Do not introduce a new architecture, state library, UI library, or build convention when the existing project pattern already solves the problem.

---

## 3. Expo / React Native Rules

For Expo projects, prefer these approaches:

- Solve issues through Expo config, config plugins, dependency alignment, or build commands before editing native files.
- Do not edit generated files under `android/` or `ios/` by default.
- Only edit native files when the user explicitly requests it or the project intentionally maintains prebuild output.
- Always consider Android and iOS platform differences.
- Distinguish Expo Go, development builds, and EAS Build.
- Check whether a native-module dependency works in Expo Go or requires a development build.
- Handle platform permissions explicitly.
    - iOS: Expo config that maps to `Info.plist`
    - Android: Expo config that maps to `AndroidManifest.xml`
- Explain build impact when changing app icons, splash screens, deep links, schemes, bundle identifiers, or package names.

---

## 4. Generated Files and Build Artifacts

Avoid editing:

- `node_modules/`
- `.expo/`
- `dist/`
- `build/`
- `coverage/`
- generated or prebuild artifacts under `android/`
- generated or prebuild artifacts under `ios/`
- generated API clients
- compiled assets
- lockfiles unless a dependency change requires it

When fixing Expo/React Native issues, prefer this order:

1. Expo config
2. Config plugin
3. Dependency version alignment
4. Build command or local environment adjustment
5. Native file edits only when necessary

---

## 5. Code Change Rules

Follow these rules for all code changes:

- Keep diffs small and focused.
- Do not reformat unrelated code.
- Do not mix feature work with large refactors.
- Do not rename files, components, functions, or APIs unless necessary.
- Do not add comments that merely restate the code.
- Add comments only for business rules, platform differences, workarounds, or non-obvious constraints.
- Prefer explicit names over abbreviations.
- Prefer early returns over deeply nested conditionals.
- Keep state as local as practical.
- Use global state only when data is genuinely shared.

Be extra conservative when touching public APIs, authentication, payments, personal data, external integrations, routing, or app build configuration. Call out the impact.

---

## 6. TypeScript Rules

For TypeScript projects:

- Avoid `any`. If it is unavoidable, make the reason clear.
- Explicitly type API requests, API responses, screen params, and navigation params.
- Do not ignore null or undefined cases.
- Do not hide type errors with `as unknown as ...`.
- Follow the existing location for shared types.
- Prefer union literal types over enums when that matches the local style.
- Split component props types when it improves readability or reuse.

---

## 7. Component Rules

For React / React Native components:

- Use functional components and hooks.
- Keep components small and focused.
- Extract reusable logic into hooks only when reuse is real.
- Avoid premature `useMemo`, `useCallback`, and `memo`.
- Use stable keys for lists.
- Handle loading, empty, and error states.
- Preserve accessibility.
    - Interactive elements should have meaningful labels.
    - Consider text size, touch target size, and contrast.
- For platform-specific behavior, consider `Platform.select` or platform files such as `*.ios.tsx` and `*.android.tsx`.
- Reuse the existing styling system and avoid excessive ad hoc inline styles.

---

## 8. Screens and Routing

Follow the existing routing library and structure.

- If the project uses Expo Router, follow the `app/` directory conventions.
- If the project uses React Navigation, follow the existing navigator structure.
- Place screens according to existing naming and folder conventions.
- Type navigation params clearly.
- Do not change the boundary between public and authenticated screens without request.
- Explain user-flow impact when changing deep links, tabs, stacks, or modal navigation.
- Consider back behavior, safe areas, keyboard avoidance, and headers.

---

## 9. State Management

Choose the simplest state scope that works.

Preferred order:

1. Component local state
2. Custom hook
3. Context
4. Existing global state library
5. New global state library

Avoid:

- Promoting screen-only state to global state
- Confusing server state with client state
- Duplicating API cache manually in global state
- Spreading one state flow across too many files

If React Query, TanStack Query, SWR, or a similar library already exists, use it for server state.

---

## 10. API Integration

For API work:

- Check the existing API client, fetcher, or axios instance first.
- Follow existing handling for base URL, timeout, headers, and auth tokens.
- Type request and response DTOs.
- Convert error responses into safe user-facing messages.
- Never log tokens, authorization headers, or personal data.
- Distinguish network failures, timeouts, and server errors when practical.
- Do not duplicate API call logic in every screen.
- Do not change backend API contracts without calling it out.

---

## 11. Authentication and Social Login

Be especially conservative with auth changes.

- Follow the existing policy for access token and refresh token storage.
- Store sensitive tokens in `expo-secure-store` or the secure storage chosen by the project.
- Do not store sensitive tokens in AsyncStorage. If the project currently does so, call out the risk.
- Treat Google, Kakao, and Apple login as two steps: client token acquisition and backend verification/login.
- For Apple login, consider iOS, real-device testing, bundle identifiers, and redirect configuration.
- When local testing is difficult, suggest mocks, dev endpoints, or test accounts.
- Distinguish local token deletion from server-side refresh token invalidation during logout.

---

## 12. Forms and Input Validation

Validate user input at boundaries.

- Follow the existing form and validation libraries.
- Handle empty values, length limits, format errors, and server validation failures.
- Consider keyboard overlap.
- Use appropriate mobile input types, autocomplete, and secure text entry.
- Write validation messages users can understand.

---

## 13. UI and Styling

Reuse the existing design system.

- Use existing components, color tokens, spacing, and typography.
- Do not add a new UI library without approval.
- Check dark mode support.
- Respect SafeArea.
- Keep touch targets mobile-friendly.
- Design loading, empty, error, and permission-denied states together.
- Follow the existing asset management pattern for images and icons.
- Consider small screens, long text, and different font sizes.

---

## 14. Permissions and Native Capabilities

For camera, location, notifications, contacts, files, photos, microphone, and similar features:

- Check whether the feature is supported by the Expo SDK.
- Check iOS and Android permission strings/config.
- Handle denied permissions, permanently denied permissions, and settings redirects.
- Check whether the feature requires a real device.
- For background behavior, consider platform limits and app store review risk.
- For push notifications, distinguish Expo Push Token, FCM/APNs, and backend registration.

---

## 15. Performance

Identify the bottleneck before optimizing.

Common checks:

- FlatList/SectionList keys and renderItem stability
- Large image handling
- Unnecessary re-renders
- Excessive global state subscriptions
- Repeated network calls
- Heavy synchronous work during screen entry
- Bundle size
- Differences between development and production builds

Start with simple optimizations and avoid making the code much more complex for speculative performance gains.

---

## 16. Security and Privacy

Never log or expose:

- access tokens
- refresh tokens
- authorization headers
- passwords
- social provider tokens
- full personal identifiers
- raw location data
- payment data
- `.env` values
- sensitive internal production URLs

For security-sensitive changes, check:

- authentication
- authorization
- token storage
- sensitive data masking
- API error message exposure
- deep link open redirect risks
- WebView origin, injected script, and navigation restrictions

---

## 17. Dependency Policy

Before adding a dependency, check:

1. Does the project already have an equivalent dependency?
2. Is it compatible with the current React Native and Expo SDK versions?
3. Does it work in Expo Go, or does it require a development build?
4. Does it support both iOS and Android?
5. Is it actively maintained?
6. Is the bundle size and native setup burden reasonable?

Avoid dependencies for trivial helpers.  
Do not upgrade unrelated dependencies.

---

## 18. Testing and Verification

After changes, run the most relevant verification available.

Preferred order:

1. Focused unit tests for changed logic
2. Related component tests
3. TypeScript check
4. Lint
5. Expo start or build check
6. Android/iOS run check
7. Manual reasoning

Use scripts that actually exist in the project.

Examples:

```bash
npm run typecheck
npm run lint
npm test
npx expo start
npx expo run:android
npx expo run:ios
eas build --platform android
eas build --platform ios
```

Choose the actual commands after reading `package.json` and project config.

If verification cannot be run, explain why and provide the exact command the user should run.

---

## 19. Debugging

When debugging:

1. Read the exact error message.
2. Identify the smallest failing boundary.
3. Trace from symptom to root cause.
4. Fix the root cause rather than only the symptom.
5. Identify whether the problem is in Expo, Metro, Gradle, CocoaPods, Xcode, Android SDK, or app code.
6. Use cache clearing as a last resort and explain why it is needed.
7. Verify with the narrowest relevant command.

Common categories:

- Java/JDK version issues
- Gradle or Android Gradle Plugin version issues
- Expo SDK and dependency version mismatch
- Metro cache issues
- iOS CocoaPods issues
- Native modules that do not work in Expo Go
- Emulator/simulator environment issues
- Environment variable or `.env` loading issues

---

## 20. Git Discipline

Run `git status` when possible before editing.

- Do not overwrite uncommitted user work.
- Do not commit, push, merge, or rebase unless explicitly asked.
- Explain conflicts or unexpected modifications before changing them.
- Keep changes scoped to the requested task.
- When creating a branch, use `{git flow}/#{issue-number}-{work-summary-in-English}` and prefer `feat` for feature work.
  - Example: `feat/#123-login-screen`
  - Keep the work summary short, lowercase, and hyphen-separated.

When asked to commit, write the commit message in Korean:

```text
type: 간결한 변경 요약
```

Common types:

- `feat`
- `fix`
- `refactor`
- `test`
- `docs`
- `chore`
- `build`
- `ci`

When asked to create or summarize a pull request:

- Use `.github/pull_request_template.md`.
- Fill every applicable section in Korean.
- Include the related issue number when one is known.

When asked to create an issue:

- Use the matching template under `.github/ISSUE_TEMPLATE/`.
- Write the issue title and body in Korean.
- Preserve the selected template structure.

---

## 21. Documentation

Update documentation when behavior, setup, commands, or API usage changes.

Good documentation is:

- short
- accurate
- close to the relevant code
- focused on usage and decisions, not obvious implementation details

Do not create broad documentation for small internal changes unless asked.

---

## 22. Review Mode

When reviewing code, prioritize:

1. correctness
2. security
3. privacy or token exposure
4. data loss risks
5. breaking changes
6. platform-specific issues
7. performance regressions
8. maintainability
9. style consistency

For each issue, include:

- Severity: `critical`, `major`, `minor`, or `nit`
- Location
- Problem
- Suggested fix

Avoid nitpicks unless the code is otherwise clean.

---

## 23. Refactoring Mode

When refactoring:

- Preserve behavior.
- Keep diffs reviewable.
- Improve names, boundaries, duplication, and testability.
- Do not change public APIs, routing, storage structure, or build config unless requested.
- Add or update tests when practical.

Prefer incremental refactoring over large rewrites.

---

## 24. PR Summary Template

When asked to summarize changes outside a GitHub PR body, use:

```markdown
## 요약

- 
- 

## 검증

- [ ] 명령 또는 확인 사항

## 참고

- 
```

If no verification was run, write:

```markdown
## 검증

- 실행하지 않음: <사유>
```

For an actual PR description, use `.github/pull_request_template.md` instead of this generic summary.

---

## 25. Final Answer Checklist

Before finishing, ensure the final response includes:

- What changed
- Files changed
- Verification result
- Remaining risks or assumptions
- Whether generated Expo/React Native files were left untouched
- Whether sensitive data was avoided

If no files were changed, say so.  
If the task is incomplete, clearly explain what is missing and why.
