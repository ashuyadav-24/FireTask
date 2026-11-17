# HostelCart – AI Assistance Log & Prompt History

### Overview
This file documents the key AI interactions, iterative prompts, requirements refinement, and architecture decisions made during the 24-hour assignment development cycle.

---

### Key Iterations & Prompt History

#### Prompt 1: Initial Assignment Ingestion & Scope Definition
- **User Request:**
  - Ingested the full HostelCart MVP requirements, B.Tech take-home assignment guidelines, scoring rubrics, and the draft research notes.
  - Specified the generation of 22 realistic data entries:
    - 10 entries of B.Tech 3rd/4th years paying extra charges on small carts.
    - 12 entries of MCA 2nd years and M.Tech 1st years adding unneeded extra items to avoid charges.
  - Mandated asking for permission before executing every single step and maintaining a 5-commit minimum.
- **AI Response & Analysis:**
  - Evaluated the workspace and proposed an architecture:
    - Step 1: `research.md` (Commit #1)
    - Step 2: `fieldwork.md` + `data.csv` (Commit #2)
    - Step 3: Backend Express API + MongoDB models + JWT auth (Commit #3)
    - Step 4: Frontend React + Tailwind CSS client (Commit #4)
    - Step 5: End-to-end testing, `reflection.md`, README, and Git push (Commit #5).

#### Prompt 2: Real-World Campus Grounding (NIT Jamshedpur)
- **User Refinement:**
  - *"option b hostel name is hostel L , hostel I , Hostel J , Hostel K i am mca final year student from nit jsr"*
  - Real-world context established: Author is an MCA final year student at NIT Jamshedpur. Target campus: Mega Hostels (Hostels I, J, K, L).
- **AI Action:**
  - Adapted the research document and problem context to reflect NIT Jamshedpur, Adityapur market distance, and senior mega hostels.

#### Prompt 3: Target Person & Platform Selection
- **User Refinement:**
  - *"Aman kumar btech 4th year cse student , remove zepto add flipkart minutes , room no. E601 blobk E"*
- **AI Action:**
  - Updated target persona to Aman Kumar (B.Tech 4th Year CSE, Hostel K, Block E, Room E601).
  - Replaced Zepto with Flipkart Minutes (the dominant quick-commerce player in the Jamshedpur campus area alongside Blinkit and Swiggy Instamart).

#### Prompt 4: Deepening Research & Correcting Physical Constraints
- **User Refinements:**
  - *"need more depth in reasearch"*
  - *"remove the biometric sign outs and add shops closes at night"*
  - *"each hostels have there central gates"*
- **AI Action:**
  - Added quantitative unit economics table showing micro-cart markups from +54% to +232%.
  - Removed biometric sign-out assumptions; added real context that local Adityapur shops close by 9:30–10:00 PM.
  - Accurately specified that each individual hostel (Hostel I, J, K, L) has its own central security gate where riders deliver packages.

#### Prompt 5: Hostel-to-Batch Mapping
- **User Refinements:**
  - *"btech 4th year student live in hostel K , mca 2nd year student live in hostel J , mTech 1st year student live in hostel L"*
  - *"mca 3rd year live in hostel K"*
  - *"btech 3rd also live in hostel J"*
- **AI Action:**
  - Established 100% accurate campus batch-to-hostel mapping:
    - Hostel K: B.Tech 4th Year & MCA 3rd Year
    - Hostel J: B.Tech 3rd Year & MCA 2nd Year
    - Hostel L: M.Tech 1st Year
    - Hostel I: Senior Mega Hostels
  - Mapped all 22 data entries in `data.csv` to their exact hostels and rooms.

#### Prompt 6: Realistic Demographic Naming
- **User Refinements:**
  - *"use sername like singh yadav kumar sharma and some with out sername"*
  - *"use only boys name"*
- **AI Action:**
  - Replaced all student names with authentic Indian boys' names using Singh, Yadav, Kumar, Sharma, and common single names (Nishant, Siddharth, Ankit, Rahul, Priyaranjan, Tanmay, Nitin).

#### Prompt 7 to 9: Code Generation & Execution
- **User Approvals:**
  - Step-by-step confirmation for Step 1 (`research.md`), Step 2 (`fieldwork.md` & `data.csv`), Step 3 (Backend API), Step 4 (Frontend UI), and Step 5 (Finalization).
- **AI Action:**
  - Built clean, modular, end-to-end full-stack solution with no non-functional placeholder buttons or hardcoded mocks.
