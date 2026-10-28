# PlannerApp Foundations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the non-UI foundations (test setup, theme tokens, `lib/`, `features/tasks/services/`, state context) of the Đề 3 planner app, fully unit-tested, so screens can be added later on top of them.

**Architecture:** One feature slice `features/tasks`; all business logic is pure functions in `services/`; `tasks-context.tsx` is a thin reducer + persistence wrapper; generic helpers live in `lib/`; design tokens in `theme/`. Relative imports only.

**Tech Stack:** React Native 0.88 CLI, TypeScript strict, Jest (`@react-native/jest-preset`), AsyncStorage. No other libraries.

**Spec:** [business-logic.md](../../business-logic.md) (authoritative for every rule and string), [architecture.md](../../architecture.md) (tree and dependency rules), [de-bai.md](../../de-bai.md) (exam). Design values for theme: `docs/m3/*.md`.

## Global Constraints

- Allowed libraries only: React Navigation, react-native-screens, safe-area-context, AsyncStorage, vector-icons (not used). Nothing else is installed.
- `services/` imports only `../types`, `../../../lib/*`, `../../../theme/*`; never React, components or hooks.
- Strings are Vietnamese, exact as in business-logic.md (e.g. "Sức khoẻ", "Hạn hôm nay", "Quá hạn 2 ngày").
- `dueDate` is stored as `dd/mm/yyyy` string; compare via `DayNumber`, never as strings.
- Tests are colocated (`*.test.ts`); today in tests is `new Date(2026, 2, 15, 10)` (15/03/2026).
- No commit may include `node_modules`, `android/build`, `android/app/build`.
- Precondition: the empty scaffold (src/ tree, npm install) already exists and `npx tsc --noEmit` passes.

## Review Focus

- Date typed as `15/03/2026 ` (trailing space) or with Unicode digits: expect trimmed / rejected, no crash.
- Title of 50 characters made of Vietnamese combining marks (NFD input): length counted after NFC normalise.
- Seed on first run only: stored `[]` must stay empty, stored garbage must reseed without throwing.
- Two rapid writes: last state wins in storage, no write before hydration.
- Task list containing a task with a corrupt `dueDate`: selectors sort it last, never `NaN`/crash.

## File Structure

| File | Responsibility |
| --- | --- |
| `jest.config.js`, `jest.global-setup.js`, `jest.setup.js` | TZ pinned for DST test, AsyncStorage mock |
| `src/theme/colors.ts`, `metrics.ts` | M3-role colour tokens, priority colours, spacing/radius/type/shadow tokens |
| `src/lib/date.ts`, `id.ts`, `storage.ts`, `confirm.ts` | generic helpers |
| `src/features/tasks/services/task-validation.ts` | `validateTask` |
| `src/features/tasks/services/task-selectors.ts` | overdue/label/progress/filter/search/sort |
| `src/features/tasks/services/seed-data.ts`, `task-storage.ts` | seed + load/save |
| `src/features/tasks/tasks-context.tsx` | reducer, provider, `useTasks` |

Tasks 1–4 are independent of each other (parallel). Task 5, 6 need Task 2. Task 7 needs 2 and 3. Task 8 needs 5, 6, 7.

---

### Task 1: Test infrastructure

**Files:** Modify `jest.config.js`; Create `jest.global-setup.js`, `jest.setup.js`.

**Interfaces:** Produces: Jest runs `src/**/*.test.ts(x)`, `TZ=Europe/Berlin`, `@react-native-async-storage/async-storage` mocked, `@react-navigation` transformed.

- [ ] **Step 1:** In `jest.global-setup.js` export an async function setting `process.env.TZ = 'Europe/Berlin'`; register as `globalSetup`. In `jest.setup.js` call `jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'))`; register in `setupFilesAfterEnv`. Add `@react-navigation` and `react-native-screens` to `transformIgnorePatterns` exceptions.
- [ ] **Step 2:** Create `src/lib/smoke.test.ts` asserting `new Date(2026, 2, 29, 12).getTimezoneOffset() === -120` (proves TZ is pinned) and that `AsyncStorage.setItem` then `getItem` round-trips.
- [ ] **Step 3:** Run `npm test` → both pass. Delete `smoke.test.ts`. Update `__tests__/App.test.tsx` only if it fails because of the new config (keep it passing or remove it with a note in the report).
- [ ] **Step 4:** Commit `chore: jest setup (TZ, AsyncStorage mock)`.

### Task 2: `lib/date.ts`

**Files:** Create `src/lib/date.ts`; Test `src/lib/date.test.ts`.

**Interfaces:** Produces (exact, see business-logic §2): `type DayNumber = number`; `parseDate(s: string): DayNumber | null`; `isRealDate(s: string): boolean`; `todayDay(now?: Date): DayNumber`; `diffDays(from: DayNumber, to: DayNumber): number`; `formatDate(d: Date): string`; `addDaysToToday(n: number, now?: Date): string`; `formatDateInput(raw: string): string`.

- [ ] **Step 1:** Write `date.test.ts` covering business-logic §10 rows 1–13 verbatim (31/02/2026 null, 29/02/2028 valid, 29/02/2100 null, 29/02/2000 valid, "5/3/2026" null, year 0026 null, diffDays across Berlin DST 15/03→30/03/2026 = 15, `todayDay(new Date(2026,2,15,23,59))` equals `parseDate('15/03/2026')`, formatDateInput table).
- [ ] **Step 2:** Run `npx jest src/lib/date.test.ts` → FAIL (not implemented).
- [ ] **Step 3:** Implement per spec: strict regex `^(\d{2})\/(\d{2})\/(\d{4})$`, UTC round-trip validation, `todayDay` from local Y/M/D into `Date.UTC`.
- [ ] **Step 4:** Run the test → PASS. `npx tsc --noEmit` → clean.
- [ ] **Step 5:** Commit `feat(lib): date helpers`.

### Task 3: `lib/id.ts`, `lib/storage.ts`, `lib/confirm.ts`

**Files:** Create the three files; Tests `id.test.ts`, `storage.test.ts`, `confirm.test.ts` beside them.

**Interfaces:** Produces: `createId(): string`; `getJSON<T>(key: string): Promise<{ ok: true; value: T | null } | { ok: false }>`; `setJSON(key: string, value: unknown): Promise<boolean>`; `confirmDestructive(o: { title: string; message: string; confirmText?: string; onConfirm: () => void }): void`.

- [ ] **Step 1:** Tests: 1000 `createId()` calls are unique; `getJSON` returns `{ok:true,value:null}` for a missing key, `{ok:true,value}` after `setJSON`, `{ok:false}` when the stored string is `'{bad'` (set via `AsyncStorage.setItem`) and when `getItem` is mocked to reject; `setJSON` returns `false` when `setItem` rejects; `confirmDestructive` calls `Alert.alert` (spy) with title, message and buttons `Huỷ` (style cancel) and `Xoá` (style destructive) whose `onPress` invokes `onConfirm`.
- [ ] **Step 2:** Run the three tests → FAIL.
- [ ] **Step 3:** Implement per business-logic §5–6 (`createId` = base36 time + counter + random; wrappers never throw).
- [ ] **Step 4:** Run → PASS; `npx tsc --noEmit`.
- [ ] **Step 5:** Commit `feat(lib): id, storage, confirm`.

### Task 4: Theme tokens

**Files:** Create `src/theme/colors.ts`, `src/theme/metrics.ts`; Test `src/theme/theme.test.ts`.

**Interfaces:** Produces: `colors` object with M3 role keys (`primary, onPrimary, primaryContainer, onPrimaryContainer, secondary, onSecondary, secondaryContainer, onSecondaryContainer, tertiary, error, onError, errorContainer, onErrorContainer, surface, onSurface, onSurfaceVariant, surfaceContainerLowest, surfaceContainerLow, surfaceContainer, surfaceContainerHigh, surfaceContainerHighest, outline, outlineVariant, inverseSurface, inverseOnSurface, scrim`), `priorityColors: Record<Priority, { background: string; text: string }>` (red Cao, amber Trung bình, green Thấp), `statusColors.overdue`; `metrics.ts` exports `spacing` (multiples of 4), `radius`, `typography` (M3 roles with `fontSize/lineHeight/letterSpacing/fontWeight`), `elevation` (RN `elevation` + iOS shadow props), `touchTarget = 48`.

- [ ] **Step 1:** Test: every `typography` entry has numeric size/lineHeight; every `spacing` value % 4 === 0; `touchTarget === 48`; every colour is a valid `#RRGGBB` string; `priorityColors` has exactly the keys of `PRIORITIES`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Use values from `docs/m3/typography-shape-elevation.md` for type scale, radius and elevation, and the baseline M3 light scheme for colours (pick one seed palette, note it in a comment). If a value is marked "không đọc được" in the doc, use the nearest documented value and list it in your report.
- [ ] **Step 4:** Run → PASS; `npx tsc --noEmit`.
- [ ] **Step 5:** Commit `feat(theme): colour and metric tokens`.

### Task 5: `services/task-validation.ts`

**Files:** Create `src/features/tasks/services/task-validation.ts`; Test beside it.

**Interfaces:** Consumes `parseDate`, `DayNumber` (Task 2), `TaskInput` (types.ts). Produces `type TaskErrors = Partial<Record<'title'|'dueDate', string>>`; `validateTask(v: TaskInput, mode: 'create'|'edit', today: DayNumber): TaskErrors`; `hasErrors(e: TaskErrors): boolean`.

- [ ] **Step 1:** Tests = business-logic §10 rows 14–21 with exact messages, plus Review Focus: title `'  ' + 50×'a' + '  '` ok; title of 50 NFC characters written in NFD form is ok and 51 is an error; `dueDate: '15/03/2026 '` (trailing space) is accepted after trim; `'١٥/٠٣/٢٠٢٦'` gives "Hạn phải có dạng dd/mm/yyyy".
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement the rule table in business-logic §3 (first error per field wins; edit mode skips the "before today" rule).
- [ ] **Step 4:** Run → PASS; tsc.
- [ ] **Step 5:** Commit `feat(tasks): validation service`.

### Task 6: `services/task-selectors.ts`

**Files:** Create `src/features/tasks/services/task-selectors.ts`; Test beside it.

**Interfaces:** Consumes Task 2 helpers and `types.ts`. Produces exact signatures from business-logic §4: `isOverdue`, `daysLeft`, `dueLabel`, `getProgress`, `filterTasks`, `searchTasks`, `sortTasks`, `selectVisibleTasks(tasks, { filter, query, sort }, today)`.

- [ ] **Step 1:** Tests = §10 rows 22–32 verbatim, plus: a task with `dueDate: 'abc'` sorts last under both sorts, has `dueLabel === null`, `isOverdue === false`, and `selectVisibleTasks` does not throw; query `'(*['` returns `[]` without throwing; `sortTasks` does not mutate its input array.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement per §4 (`fold` for accent-insensitive search with try/catch; stable sort via original index; ties: due → rank → index).
- [ ] **Step 4:** Run → PASS; tsc.
- [ ] **Step 5:** Commit `feat(tasks): selectors service`.

### Task 7: `services/seed-data.ts` and `services/task-storage.ts`

**Files:** Create both; Tests beside them.

**Interfaces:** Consumes `addDaysToToday` (Task 2), `getJSON/setJSON` (Task 3), `Task`. Produces `createSeedTasks(now: Date): Task[]`; `TASKS_KEY = 'plannerApp.tasks.v1'`; `loadTasks(now?: Date): Promise<Task[]>`; `saveTasks(tasks: Task[]): Promise<boolean>`; `isTask(x: unknown): x is Task`.

- [ ] **Step 1:** Tests: `createSeedTasks(now)` returns the 8 tasks of business-logic §5 (3 done, ≥2 overdue relative to now, one due today), unique ids; `getProgress` is not used here. `loadTasks`: empty storage → returns seed AND persists it; stored `'[]'` → `[]` (no reseed); stored `'{bad'` → seed and overwritten; stored array with one invalid element → invalid dropped, valid kept; `getItem` rejecting → seed, no throw.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement per §5.
- [ ] **Step 4:** Run → PASS; tsc.
- [ ] **Step 5:** Commit `feat(tasks): seed data and storage service`.

### Task 8: `tasks-context.tsx`

**Files:** Create `src/features/tasks/tasks-context.tsx`; Test `src/features/tasks/tasks-context.test.tsx` (use `react-test-renderer`, already a devDependency).

**Interfaces:** Consumes Tasks 3, 7. Produces `reducer(state, action)` (exported for tests), `TasksProvider`, `useTasks(): { tasks; isReady; getTask(id); addTask(i: TaskInput): string; updateTask(id, i): void; toggleTask(id): void; removeTask(id): void; removeDoneTasks(): number }` exactly as business-logic §5.

- [ ] **Step 1:** Reducer tests (pure): add appends with `done:false`; update keeps `id` and `done`; toggle flips; remove and removeDone; unknown id returns the identical state object (`toBe`). Provider test: with storage mocked empty, after `act` + flush `isReady` is true and `tasks.length === 8`; no `setItem` call happens before hydration finishes; after `addTask`, storage contains the new task; `removeDoneTasks()` returns the removed count.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement with `useReducer`; persist in an effect only when `status === 'ready'`, skipping the write that immediately follows hydrate; serialise writes through a promise chain; warn once on write failure (Alert not required here).
- [ ] **Step 4:** Run → PASS; `npx tsc --noEmit`; `npm run lint`; `npm test` all green.
- [ ] **Step 5:** Commit `feat(tasks): state context with persistence`.

---

## Self-review

- Spec coverage: §1 types (scaffold), §2 Task 2, §3 Task 5, §4 Task 6, §5 Tasks 3/7/8, §6 confirm Task 3, §8 `formatDateInput` Task 2, §9 crash guards covered by the Review Focus tests. §7 navigation, screens, hooks (`use-task-form`, `use-task-list-controls`) and all UI are out of scope for this plan by design (they depend on the Material 3 design pass).
- Names are consistent across tasks (`DayNumber`, `TaskInput`, `loadTasks`, `getJSON`).
