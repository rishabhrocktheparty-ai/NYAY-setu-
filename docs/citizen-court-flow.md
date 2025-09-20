# NYAY Setu — Citizen + Court Employee Combined System Flow

## Overview
This document describes the combined end-to-end flow between Citizens and Court Employees for the NYAY Setu MVP. It focuses on the Citizen MVP features (case upload/search, strength analyzer, recommendations, LLM notebook & podcast) and how they interact with the Court Employee segment (case assignment, activity logging, notifications). The design is mobile-first and prepared for future AI, voice, and AR features.

## Actors
- Citizen: uploads evidence, requests analysis, interacts with LLM notebook, listens to podcasts, schedules hearings.
- Court Employee: receives assigned cases, reviews evidence, creates tasks, communicates with citizens and lawyers.
- Lawyer: recommended by AI; can be contacted or onboarded later.
- AI Engine: performs document ingestion, NLP, legal similarity search, strength scoring, content generation (notebook and podcast).
- eCourts API: external source of live case metadata and status.

## High-level Flow
1. Citizen creates an account (mobile-first). Auth issues JWT scoped to "citizen" role.
2. Citizen uploads a case or searches an existing case via eCourts. Uploaded artifacts are stored (S3 / object store) and hashed onto a tamper-evident ledger (blockchain optional in MVP).
3. Backend ingests files, OCR/transcribes, extracts entities, and stores structured facts.
4. AI Strength Analyzer runs asynchronously; returns a strength score, reasons, and recommended actions.
5. Citizen views analysis, receives step-by-step recommendations, and can open an LLM notebook to ask questions or request a podcast summary.
6. If the citizen chooses to escalate, the case can be flagged for Court Employee review (creates a Case record and a notification to court staff).
7. Court Employee sees the case in their dashboard, can assign tasks, add activity logs, and message the citizen (in-app or SMS/WhatsApp).
8. Events (case updates, hearing date changes) are pushed to the citizen via push notifications and optionally synced to calendar/maps.

## Key Data Models (simplified)
- Citizen: id, name, phone, email, preferred_language, createdAt
- Evidence: id, caseId, citizenId, type (pdf/image/audio/video), storageUrl, hash, uploadedAt, ocrText
- Case: id, title, description, citizenId, status, eCourtsId?, assignedTo?, createdAt
- Analysis: id, caseId, score (0-100), category (Weak/Medium/Strong), reasons[], recommendations[], runAt
- NotebookEntry: id, caseId, userId, question, responseText, responseAudioUrl?, createdAt
- Podcast: id, caseId, audioUrl, summaryText, generatedAt
- Event/Notification: id, targetUserId, type, payload, read

## APIs (Representative endpoints)
- Auth
  - POST /api/auth/register (mobile phone + OTP)
  - POST /api/auth/login
- Citizen Case
  - POST /api/citizen/cases/upload -> returns caseId (multipart, presigned upload)
  - GET /api/citizen/cases/:id
  - GET /api/citizen/cases/search?q=... (eCourts integration)
  - POST /api/citizen/cases/:id/analysis (kick off and/or get latest)
  - GET /api/citizen/cases/:id/analysis
- Notebook & Podcast
  - POST /api/citizen/cases/:id/notebook/query { question }
  - GET /api/citizen/cases/:id/notebook
  - POST /api/citizen/cases/:id/podcast/generate
  - GET /api/citizen/cases/:id/podcast
- Court Employee
  - GET /api/employee/cases (assigned)
  - POST /api/employee/cases/:id/assign { assigneeId }
  - POST /api/employee/cases/:id/task
  - GET /api/employee/cases/:id/activity-log
- System
  - POST /api/webhooks/ecourts/case-update
  - POST /api/events/sync-calendar

Auth: all APIs require JWT with role claim. Use requireAuth middleware like lib/requireAuth and role checks.

## AI Pipeline (MVP)
1. Ingest uploaded files: store files in object storage, compute hash, run OCR (Tesseract or cloud OCR) and ASR for audio.
2. Preprocess: clean extracted text, chunk by paragraphs, index embeddings (OpenAI / local embedding model) in vector DB (e.g., Pinecone, Milvus, or Postgres+pgvector).
3. Legal Similarity: run semantic search against curated Indian judgments corpus; fetch relevant precedents.
4. Strength Scoring: small rules + ML model:
   - Evidence coverage
   - Presence of key legal citations / statutes
   - Witness statement indicators
   - Procedural compliance (e.g., filing deadlines)
   Output: score 0-100 and reason list.
5. Recommendations: templated + LLM-enhanced steps (documents to add, probable counsel specialization, settlement vs litigation probabilities).
6. Notebook & Podcast: LLM generates conversational answers and a scripted podcast summary; TTS produces audio (multilingual support).

## Interactions between Citizen and Court Employee
- Citizen requests review -> case created and notifications sent to court employee queue.
- Court Employee assigns case to self or team -> event stored and citizen notified.
- Court Employee can add tasks, set due dates; citizen receives recommended next steps if action required.
- Activity logs capture who did what; used for transparency and audit.

## Mobile-First Considerations
- Chunk UI into small, tappable cards; prioritize download size and offline caches.
- Pre-generate low-bitrate podcast versions for mobile streaming.
- Make uploads resumable (tus protocol or multipart chunking).
- Localized UI and voice responses; store preferred_language in profile.

## Security & Privacy
- Store PII encrypted at rest; use tokenized access to evidence files.
- Use signed URLs for uploads and downloads.
- Explicit consent flows for sharing with court staff or lawyers.
- Retention policy and right-to-delete workflows.

## Roadmap & Immediate Next Tasks (short-term)
1. Implement Auth (OTP-based mobile registration) + JWT roles.
2. Implement case upload endpoint with presigned upload and basic OCR pipeline (sync or async worker).
3. Implement Analysis worker to run a simple rule-based strength evaluator.
4. Implement Notebook query endpoint that proxies to LLM with context from case files.
5. Add webhook handler for eCourts integration to fetch case status and hearing dates.

## Rollout Plan
- Phase 1 (0–3 months): Auth, Upload/Search, Analysis (rule-based), Recommendations UI, Presigned uploads.
- Phase 2 (3–6 months): Notebook + Podcast (TTS), eCourts sync, push reminders.
- Phase 3 (6–12 months): Voice assistant (Hindi/regionals), AR/VR pilot, blockchain evidence anchoring.

---

Created for: rishabhrocktheparty-ai/NYAY-setu-