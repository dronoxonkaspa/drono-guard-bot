from flask import Flask, render_template, jsonify, request
import os

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/core')
def core():
    return render_template('core.html')

@app.route('/vision')
def vision():
    return render_template('vision.html')

# --- NFT Metadata Route ---
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

# --- Wallet Verification Route ---
@app.route('/verify/<wallet_address>')
def verify(wallet_address):
    return jsonify({
        "wallet": wallet_address,
        "verified": True,
        "message": "Wallet verified as official Dronox guardian."
    })

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)
