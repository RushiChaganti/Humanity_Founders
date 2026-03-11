# Humanity Founders Console

A highly dynamic, logic-driven form engine designed for safety checklists and field data collection. This project allows administrators to visually define complex form schemas with conditional logic and version control, while providing a premium, accessible experience for field users.

---

## Submission Details

**This repository is my official submission for the technical assignment provided by [Humanity Founders](https://humanityfounders.com).**

---

## Technology Stack

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Components:** [Radix UI](https://www.radix-ui.com/) & custom glassmorphic design system
- **Icons:** [Lucide React](https://lucide.dev/)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

### Backend
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11+)
- **ORM:** [SQLAlchemy](https://www.sqlalchemy.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (via Psycopg2)
- **Validation:** [Pydantic v2](https://docs.pydantic.dev/)

### Infrastructure & Deployment
- **Platform:** [Render](https://render.com/)
- **Containerization:** Docker (Multi-stage build for optimized production images)
- **CI/CD:** Automated deployment via Render Blueprint (`render.yaml`)

---

## Key Features

- **Visual Schema Builder:** Create complex forms with multiple field types (text, number, select, radio, date).
- **Conditional Logic Engine:** Define rules to show/hide fields or make them required based on user responses.
- **Form Versioning:** Sophisticated branching system to track changes and maintain data integrity across different form iterations.
- **Response Analytics:** Automated summary statistics and priority-based filtering for submitted data.
- **Premium UI:** Accessible, mobile-responsive design with focus on field worker ergonomics using Google Antigravity design principles.

---

## Getting Started

### Prerequisites
- Node.js 20+
- Python 3.11+
- PostgreSQL (or SQLite for local development)

### Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup
```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## License

This project is licensed under the MIT License. It is submitted specifically as an assignment and is governed by the terms specified in the Humanity Founders assessment brief.
