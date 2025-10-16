from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import numpy as np

app = FastAPI(title="Cricket Talent Scoring API")

# ---------------------------------------------------------
# ✅ Allow frontend (React + Vite) to access backend API
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: replace "*" with your frontend URL later for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# ✅ Load trained model and feature columns
# ---------------------------------------------------------
try:
    model = joblib.load("player_performance_model.pkl")
    feature_columns = joblib.load("model_features.pkl")

    print("✅ Model and features loaded successfully!")
    print("Model type:", type(model))
    import sklearn
    print("scikit-learn version:", sklearn.__version__)

except Exception as e:
    print(f"❌ Error loading model or features: {e}")
    model, feature_columns = None, None


# ---------------------------------------------------------
# ✅ Root endpoint (to verify API status)
# ---------------------------------------------------------
@app.get("/")
def home():
    """Root endpoint to verify API is running"""
    return {"message": "🏏 Cricket Talent Scoring API is running successfully!"}


# ---------------------------------------------------------
# ✅ Prediction endpoint
# ---------------------------------------------------------
@app.post("/predict")
async def predict(request: Request):
    """Predict player performance score based on match data"""
    try:
        # 1️⃣ Receive request data as JSON
        features = await request.json()
        print("\n📩 Received features:", features)

        # 2️⃣ Convert input to DataFrame
        input_df = pd.DataFrame([features])
        print("🧩 Input DataFrame columns:", input_df.columns.tolist())

        # 3️⃣ Align columns with model features (fill missing with 0)
        input_df = input_df.reindex(columns=feature_columns, fill_value=0)

        # 4️⃣ Perform prediction
        prediction = model.predict(input_df)[0]
        print("✅ Prediction successful:", prediction)

        # 5️⃣ Return JSON response
        return {"predicted_score": float(prediction)}

    except Exception as e:
        print("❌ Prediction error:", str(e))
        raise HTTPException(status_code=400, detail=str(e))
