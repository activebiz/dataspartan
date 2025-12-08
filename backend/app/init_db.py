from datetime import date

from app.database import Base, SessionLocal, engine
from app.models import Author, Book, Genre, Publisher
import sys  # TODO: remove if not needed


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    print("Database tables created")


def seed_db() -> None:
    db = SessionLocal()
    try:
        if db.query(Genre).count() > 0:
            print("Database already seeded")
            return

        genres = [
            Genre(
                name="Science Fiction",
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            ),
            Genre(
                name="Fantasy", description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            ),
            Genre(
                name="Mystery", description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            ),
            Genre(name="Biography", description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."),
            Genre(
                name="Technical",
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            ),
        ]
        db.add_all(genres)
        db.commit()

        publishers = [
            Publisher(
                name="Penguin Random House",
                website="https://foo.bar",
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                creation_date=date(1927, 7, 1),
            ),
            Publisher(
                name="HarperCollins",
                website="https://foo.bar",
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                creation_date=date(1989, 1, 1),
            ),
            Publisher(
                name="O'Reilly Media",
                website="https://foo.bar",
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                creation_date=date(1978, 1, 1),
            ),
            Publisher(
                name="Tor Books",
                website="https://foo.bar",
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                creation_date=date(1980, 1, 1),
            ),
        ]
        db.add_all(publishers)
        db.commit()

        for genre in genres:
            db.refresh(genre)
        for publisher in publishers:
            db.refresh(publisher)

        authors = [
            Author(name="Isaac", surname="Asimov", birth_year=1920),
            Author(name="J.R.R.", surname="Tolkien", birth_year=1892),
            Author(name="Agatha", surname="Christie", birth_year=1890),
            Author(name="Brian", surname="Kernighan", birth_year=1942),
            Author(name="Dennis", surname="Ritchie", birth_year=1941),
            Author(name="Martin", surname="Fowler", birth_year=1963),
        ]
        db.add_all(authors)
        db.commit()

        for author in authors:
            db.refresh(author)

        books = [
            Book(
                title="Foundation",
                edition="1st",
                published_date=date(1951, 6, 1),
                publisher_id=publishers[0].id,
                genre_id=genres[0].id,
                authors=[authors[0]],
            ),
            Book(
                title="I, Robot",
                edition="1st",
                published_date=date(1950, 12, 2),
                publisher_id=publishers[0].id,
                genre_id=genres[0].id,
                authors=[authors[0]],
            ),
            Book(
                title="The Lord of the Rings",
                edition="50th Anniversary",
                published_date=date(1954, 7, 29),
                publisher_id=publishers[1].id,
                genre_id=genres[1].id,
                authors=[authors[1]],
            ),
            Book(
                title="The Hobbit",
                edition="Revised",
                published_date=date(1937, 9, 21),
                publisher_id=publishers[1].id,
                genre_id=genres[1].id,
                authors=[authors[1]],
            ),
            Book(
                title="Murder on the Orient Express",
                edition="1st",
                published_date=date(1934, 1, 1),
                publisher_id=publishers[1].id,
                genre_id=genres[2].id,
                authors=[authors[2]],
            )
        ]
        db.add_all(books)
        db.commit()

        print("Database seeding completed successfully!")


    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    print("\nSeeding database...")
    seed_db()
