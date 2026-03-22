from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import APP_NAME
from .database import Base, engine

from .routes.profile_routes import router as profile_router
from .routes.checkin_routes import router as checkin_router
from .routes.task_routes import router as task_router
from .routes.plan_routes import router as plan_router
from .routes.agent_routes import router as agent_router
from .routes.cycle_routes import router as cycle_router
from .routes.chat_routes import router as chat_router
from .routes.calendar_routes import router as calendar_router
from .routes.metrics_routes import router as metrics_router
from .routes.workplace_routes import router as workplace_router  # ✅ NEW

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title=APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ ORDER MATTERS
app.include_router(profile_router)
app.include_router(task_router)
app.include_router(checkin_router)
app.include_router(calendar_router)
app.include_router(metrics_router)
app.include_router(plan_router)
app.include_router(agent_router)
app.include_router(chat_router)
app.include_router(workplace_router)  # ✅ NEW

@app.get("/")
def root():
    return {"message": "TechCrunch Backend Running ✅"}