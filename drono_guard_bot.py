# drono_guard_bot.py
# ------------------
# A simple Flask-based web API for your NFT Guard project
# Deploy this on Render as a Web Service

from flask import Flask, jsonify, request
import os

app = Flask(__name__)

# Home page
@app.route('/')
def home():
    return """
    <h1>🛡️ Drono Guard API</h1>
    <p>Protecting the Dronox ecosystem — NFT verification & ownership layer.</p>
    """

# Example NFT metadata route
@app.route('/nft/<token_id>')
def nft_metadata(token_id):
    data = {
        "name": f"Drono Guard #{token_id}",
        "description": "Elite guardian from the Dronox universe.",
        "image": f"https://dronoxonkaspa.com/assets/guard/{token_id}.png",
        "attributes": [
            {"trait_type": "Faction", "value": "Dronox"},
            {"trait_type": "Role", "value": "Protector"}
        ]
    }
    return jsonify(data)

# Example wallet verification route
@app.route('/verify/<wallet_address>')
def verify(wallet_address):
    return jsonify({
        "wallet": wallet_address,
        "verified": True,
        "message": "Wallet verified as official Dronox guardian."
    })

# Example authentication route (future use)
@app.route('/auth', methods=['POST'])
def auth_user():
    payload = request.json
    username = payload.get('username')
    api_key = payload.get('api_key')
    return jsonify({"authorized": True, "user": username})

# Bind to Render-assigned port
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)
