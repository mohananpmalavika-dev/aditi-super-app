# AI Tutor Orchestration, 10 Modes & Whiteboard Protocol

## 1. 10 AI Tutor Modes

1. **Teach Me (`teachMe`)**: Comprehensive, conceptual step-by-step instruction.
2. **Explain Simply (`explainSimply`)**: Real-world analogies, everyday examples for non-commerce students.
3. **Malayalam Tutor (`malayalam`)**: Authentic Malayalam teaching while preserving English ICAI technical terms.
4. **Manglish / Mixed Mode (`manglish`)**: Conversational Malayalam + English tailored for Kerala students.
5. **Doubt Solver (`doubtSolver`)**: Contextual explanation with video timestamp, chapter, and student mistake context.
6. **Socratic Tutor (`socratic`)**: Probes the student with a guided intermediate question before revealing answers.
7. **Exam Tutor (`examTutor`)**: Formats answers specifically for ICAI step marks and keyword scoring rubrics.
8. **Revision Tutor (`revisionTutor`)**: High-yield, rapid summaries of essential formulas and case laws.
9. **Oral Quiz Tutor (`quizTutor`)**: One-by-one oral questioning with instant voice feedback.
10. **Problem Solving Tutor (`problemSolving`)**: Generates structured `WhiteboardAction` commands (Journal, Ledger, Law maps, Curves).

---

## 2. Whiteboard Protocol & Renderers

Rather than returning raw unformatted text or opaque images, the tutor emits declarative `WhiteboardAction` payloads:
- `journalEntry`: Renders professional double-entry format with Date, Particulars, L.F., Debit (₹), and Credit (₹).
- `ledger`: Renders T-Account balance format (`Dr.` and `Cr.`).
- `lawProvisionMap`: Renders ICAI case analysis structure (`Provision → Landmark Precedents → Application → Conclusion`).
- `economicCurve`: Interactive SVG graph with equilibrium points and shift lines.
- `formula`: Formulas with calculator shortcut steps.
