import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    engine = create_engine(DATABASE_URL)
else:
    DATA_DIR = Path(__file__).resolve().parent.parent / "data"
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    engine = create_engine(f"sqlite:///{DATA_DIR / 'waitlist.db'}", connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(bind=engine, autoflush=False)


class Base(DeclarativeBase):
    pass

from app.models.user import User
from app.models.listing import Listing
from app.models.listing_view import ListingView
from app.models.order import Order, OrderItem
from app.models.message import Conversation, Message
from app.models.settings import PlatformSettings


def init_db():
    Base.metadata.create_all(bind=engine)
    _migrate_schema()


def _migrate_schema():
    with engine.begin() as conn:
        if engine.dialect.name == "sqlite":
            has_images = conn.exec_driver_sql(
                "SELECT COUNT(*) FROM pragma_table_info('listings') WHERE name = 'images'"
            ).scalar()
            if not has_images:
                conn.exec_driver_sql("ALTER TABLE listings ADD COLUMN images JSON")
            conn.exec_driver_sql("UPDATE listings SET images = '[]' WHERE images IS NULL")

            for column, coltype in [("sex", "VARCHAR"), ("breed", "VARCHAR"), ("age_months", "INTEGER"), ("age_weeks", "INTEGER")]:
                has_column = conn.exec_driver_sql(
                    f"SELECT COUNT(*) FROM pragma_table_info('listings') WHERE name = '{column}'"
                ).scalar()
                if not has_column:
                    conn.exec_driver_sql(f"ALTER TABLE listings ADD COLUMN {column} {coltype}")
        else:
            conn.exec_driver_sql(
                "ALTER TABLE listings ADD COLUMN IF NOT EXISTS images JSON"
            )
            conn.exec_driver_sql("UPDATE listings SET images = '[]'::json WHERE images IS NULL")
            conn.exec_driver_sql("ALTER TABLE listings ADD COLUMN IF NOT EXISTS sex VARCHAR")
            conn.exec_driver_sql("ALTER TABLE listings ADD COLUMN IF NOT EXISTS breed VARCHAR")
            conn.exec_driver_sql("ALTER TABLE listings ADD COLUMN IF NOT EXISTS age_months INTEGER")
            conn.exec_driver_sql("ALTER TABLE listings ADD COLUMN IF NOT EXISTS age_weeks INTEGER")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
