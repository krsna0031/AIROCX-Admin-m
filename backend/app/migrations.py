from sqlalchemy import inspect, text
from app.database import engine


ADDITIVE_COLUMNS = {
    "characters": {
        "origin": "VARCHAR(300) NOT NULL DEFAULT ''",
        "quote": "VARCHAR(500) NOT NULL DEFAULT ''",
        "element": "VARCHAR(100) NOT NULL DEFAULT ''",
        "abilities": "TEXT NOT NULL DEFAULT ''",
    },
    "merch_items": {
        "description": "VARCHAR(500) NOT NULL DEFAULT ''",
    },
}


def run_additive_migrations() -> None:
    inspector = inspect(engine)
    tables = set(inspector.get_table_names())
    with engine.begin() as connection:
        for table, columns in ADDITIVE_COLUMNS.items():
            if table not in tables:
                continue
            existing = {column["name"] for column in inspector.get_columns(table)}
            for name, definition in columns.items():
                if name not in existing:
                    connection.execute(
                        text(f'ALTER TABLE {table} ADD COLUMN "{name}" {definition}')
                    )
