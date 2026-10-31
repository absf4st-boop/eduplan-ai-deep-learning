# Security Specification & Attack Invariant Audit

## 1. Data Invariants

1. **User Identity Boundary**: A user profile document `/users/{userId}` can only be read, created, updated, or deleted by the authenticated user whose `request.auth.uid == userId`.
2. **Subcollection Parent Confinement**: Documents in `/users/{userId}/documents/{docId}` and `/users/{userId}/students/{studentId}` must have their internal `userId` field strictly match the URL path parameter `{userId}` and `request.auth.uid`.
3. **Immutable Identity Keys**: `id`, `userId`, and `email` cannot be altered across updates.
4. **Volume & Size Protection**: Document titles are bounded at 255 chars, student names at 150 chars, content at 1,000,000 chars, preventing Denial-of-Wallet payload attacks.
5. **Zero Blanket Queries**: Querying the `/users` collection is forbidden; subcollection queries require explicit ownership filtering (`resource.data.userId == request.auth.uid`).

## 2. The Dirty Dozen Payloads (Rejection Targets)

| # | Attack Vector | Target Path | Payload Description | Expected Result |
|---|---------------|-------------|---------------------|-----------------|
| 1 | Unauthenticated Read | `/users/user123` | Request without `request.auth` | PERMISSION_DENIED |
| 2 | Cross-Tenant User Profile Read | `/users/user_target` | User `user_attacker` attempts `get()` | PERMISSION_DENIED |
| 3 | Blanket User Enumeration Query | `/users` | Any query across `/users` | PERMISSION_DENIED |
| 4 | ID Poisoning Injection | `/users/user123/documents/../../../etc/passwd` | Path injection with invalid ID characters | PERMISSION_DENIED |
| 5 | Oversized Content Attack | `/users/user123/documents/doc1` | Content payload > 1,000,000 characters | PERMISSION_DENIED |
| 6 | Identity Hijacking Create | `/users/user123/documents/doc1` | Authenticated as `user123` with payload `{ userId: 'user999' }` | PERMISSION_DENIED |
| 7 | Cross-Tenant Subcollection Query | `/users/user123/documents` | Authenticated as `attacker` querying `user123` documents | PERMISSION_DENIED |
| 8 | Path Parameter / Payload Mismatch | `/users/user123/documents/doc2` | `incoming().userId != userId` | PERMISSION_DENIED |
| 9 | Immutable Field Tampering | `/users/user123` | Attempting to mutate `id` or `email` during update | PERMISSION_DENIED |
| 10 | Unbounded Student Injection | `/users/user123/students/std1` | Injecting student with `name` exceeding 150 chars | PERMISSION_DENIED |
| 11 | Student Owner Spoof | `/users/user123/students/std1` | Authenticated as `user123` with `student.userId = 'victim'` | PERMISSION_DENIED |
| 12 | Orphaned Unregistered Document Write | `/users/invalid_id/documents/doc1` | Writing to a non-validated ID path | PERMISSION_DENIED |
