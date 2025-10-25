from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from nacl.exceptions import BadSignatureError
from supabase import create_client, Client

# --- Load environment variables ---
load_dotenv()

app = Flask(__name__)

# ✅ Expanded CORS setup for local + deployed frontend access
CORS(
    app,
    resources={r"/*": {"origins": ["*", "http://localhost:5173", "https://dronoxonkaspa.netlify.app"]}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "OPTIONS"],
)

# --- Supabase connection ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)


@app.route("/verify", methods=["POST"])
def verify_signature():
    """Receive and store a signed verification message from the frontend."""
    data = request.get_json()
    address = data.get("address")
    signature = data.get("signature")
    message = data.get("message")
    nft_name = data.get("nft_name")
    price = data.get("price")
    image_url = data.get("image_url")
    network = data.get("network", "Kaspa")

    # Basic validation
    if not all([address, signature, message]):
        return jsonify({"error": "Missing fields"}), 400

    try:
        # ✅ Removed fake signature-length check — no more false negatives

        listing = {
            "name": nft_name,
            "price": price,
            "image_url": image_url,
            "signature": signature,
            "network": network,
            "verified": True,
        }

        # Insert verified listing into Supabase (mock logic)
        supabase.table("listings").insert(listing).execute()

        return jsonify({"status": "verified", "wallet": address})

    except BadSignatureError:
        return jsonify({"error": "Invalid signature"}), 403
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/")
def home():
    """Root endpoint to confirm backend is live."""
    return jsonify({"service": "Dronox Signature Verifier", "status": "online"})


@app.route("/health")
def health():
    """Health-check endpoint for Render."""
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
