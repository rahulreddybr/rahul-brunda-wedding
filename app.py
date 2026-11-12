"""
Rahul & Brunda — Wedding Invitation Website
Flask application entry point.

Expected project structure:
    wedding-website/
    ├── app.py
    ├── templates/
    │   └── index.html
    └── static/
        ├── css/
        │   └── main.css
        ├── js/
        │   └── main.js
        ├── images/
        └── videos/

No RSVP functionality, database, or authentication is included.
"""

import os
from pathlib import Path

from flask import Flask, render_template


BASE_DIR = Path(__file__).resolve().parent

app = Flask(
    __name__,
    template_folder=str(BASE_DIR / "templates"),
    static_folder=str(BASE_DIR / "static"),
    static_url_path="/static",
)

# Basic configuration. Set SECRET_KEY in the environment if you later add
# features that require signed sessions or CSRF protection.
app.config.update(
    SECRET_KEY=os.environ.get("SECRET_KEY", "change-this-before- production".replace(" ", "")),
    SEND_FILE_MAX_AGE_DEFAULT=60 * 60 * 24 * 7,  # Cache static files for 7 days
)


@app.get("/")
def home():
    """Display the Rahul & Brunda wedding invitation."""
    return render_template("index.html")


@app.get("/health")
def health():
    """Simple health endpoint for local checks and hosting platforms."""
    return {"status": "ok", "application": "Rahul & Brunda Wedding Invitation"}, 200


@app.errorhandler(404)
def page_not_found(_error):
    """Return a simple branded 404 page without exposing internals."""
    return (
        """
        <!doctype html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta name="theme-color" content="#3b101b">
            <title>Page Not Found | Rahul &amp; Brunda</title>
            <style>
                * { box-sizing: border-box; }
                body {
                    min-height: 100vh; margin: 0; padding: 24px;
                    display: grid; place-items: center; text-align: center;
                    color: #fffaf0; background: #260810;
                    font-family: Georgia, serif;
                }
                main { max-width: 520px; }
                h1 { color: #e4c98f; font-size: clamp(2.5rem, 8vw, 4rem); }
                p { line-height: 1.7; }
                a { color: #e4c98f; }
            </style>
        </head>
        <body>
            <main>
                <h1>Page not found</h1>
                <p>The page you are looking for is not part of this invitation.</p>
                <a href="/">Return to the wedding invitation</a>
            </main>
        </body>
        </html>
        """,
        404,
    )


if __name__ == "__main__":
    # For local development:
    #   python app.py
    #
    # For deployment, use a production WSGI server such as Gunicorn:
    #   gunicorn app:app
    debug_mode = os.environ.get("FLASK_DEBUG", "0").lower() in {"1", "true", "yes"}
    port = int(os.environ.get("PORT", "5000"))

    app.run(
        host="0.0.0.0",
        port=port,
        debug=debug_mode,
    )
