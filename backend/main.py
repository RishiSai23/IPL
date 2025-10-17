from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import numpy as np

# Initialize FastAPI app
app = FastAPI(title="CricScout AI - Player & Fitness Analysis API")

# ---------------------------------------------------------
# ✅ Allow frontend (Next.js) to access backend API
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],    # ⚠️ IMPORTANT: Change "*" to your specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# ✅ Load all models and feature sets
# ---------------------------------------------------------
models = {}
feature_sets = {}

try:
    # 🏏 Player Performance Model (Assuming Regression Model)
    models["performance"] = joblib.load("player_performance_model.pkl")
    feature_sets["performance"] = joblib.load("model_features.pkl")

    # 🏋️‍♂️ Fitness Model (Assuming Classification Model, e.g., RandomForestClassifier)
    # NOTE: You may need to rename 'fitness_model.pkl' to 'fitness_model_v2.pkl'
    # if you ran the re-training script and saved the new version.
    models["fitness"] = joblib.load("fitness_regressor_model_v2.pkl")
    feature_sets["fitness"] = joblib.load("fitness_regressor_features.pkl")

    print("✅ All models loaded successfully!")
    for name in models:
        print(f"  - {name} model loaded ({type(models[name])})")

except Exception as e:
    print(f"❌ Error loading models or features: {e}")
    models, feature_sets = {}, {}
    # Optionally, you can raise the error to halt the application if models are critical
    # raise e

# ---------------------------------------------------------
# ✅ Root endpoint (API status check)
# ---------------------------------------------------------
@app.get("/")
def home():
    """Root endpoint to verify API is running"""
    return {
        "message": "🏏 CricScout AI API is running successfully!",
        "available_models": list(models.keys())
    }

# ---------------------------------------------------------
# ✅ Unified Prediction Endpoint
# ---------------------------------------------------------
@app.post("/predict/{model_name}")
async def predict(model_name: str, request: Request):
    """
    Predict using the selected model.
    Example: /predict/fitness  or  /predict/performance
    """
    if model_name not in models:
        raise HTTPException(
            status_code=404,
            detail=f"Model '{model_name}' not found. Available: {list(models.keys())}"
        )
        
    try:
        # 2️⃣ Parse request body
        body = await request.json()
        print(f"\n📩 Received features for '{model_name}' model:", body)

        # Handle Next.js format: { value_dict: {...} } or direct {...}
        features = body.get("value_dict", body)

        # 3️⃣ Convert JSON → DataFrame (align features)
        input_df = pd.DataFrame([features])
        feature_list = feature_sets.get(model_name)
        
        # Check if feature list exists and use it to reindex
        if not feature_list:
             raise RuntimeError(f"Feature list is empty or missing for model '{model_name}'.")

        input_df = input_df.reindex(columns=feature_list, fill_value=0)
        print("🧩 Aligned columns:", input_df.columns.tolist())

        model = models[model_name]

        # 4️⃣ --- Prediction Logic ---
        
        # 🏋️‍♂️ Fitness Model (Classification: Returns a Probability Score)
        if model_name == "fitness":
            
            if hasattr(model, 'predict_proba'):
                # Get the probability array, e.g., [Prob_Class_0, Prob_Class_1]
                proba = model.predict_proba(input_df)[0]
                # The score is the probability of being Fit (Class 1), converted to a percentage (0 to 100)
                score_percentage = proba[1] * 100
                
                # Determine the hard class prediction (0 or 1)
                hard_prediction = np.argmax(proba)
            else:
                 # Fallback for models without predict_proba, use .predict() but scale it
                 hard_prediction = model.predict(input_df)[0]
                 score_percentage = float(hard_prediction) 
                 
            # 5️⃣ Fitness Model Response Logic (Using Percentage)
            score = score_percentage # Use percentage for logic and output
            
            if score >= 90:
                 status = "Qualified"
                 commentary = "Excellent fitness level! You’re ready for professional play."
            elif score >= 50:
                 # If prediction is class 0 but score is high, this might be a soft failure
                 status = "Needs Improvement" 
                 commentary = "Average fitness — improve endurance and agility."
            else:
                 status = "Not Fit"
                 commentary = "Below standard — focus on strength and consistency."
                 
            print(f"✅ Prediction successful for '{model_name}': Class {hard_prediction} ({score_percentage:.2f}%)")
                 
            return {
                "model_used": "fitness",
                "score": round(score, 2), # Floating point percentage
                "predicted_class": int(hard_prediction),
                "status": status,
                "commentary": commentary,
            }

        # 🎯 Performance Model (Regression: Returns a Direct Score)
        elif model_name == "performance":
            # Use predict() for the final predicted score (e.g., 77.5)
            prediction = model.predict(input_df)[0]
            score = float(prediction)
            
            print(f"✅ Prediction successful for '{model_name}': {score:.2f}")
            
            # 5️⃣ Performance Model Response
            return {
                "model_used": "performance",
                "predicted_score": round(score, 2), # Floating point score, e.g., 77.50
                "commentary": "Player performance prediction successful.",
            }

    except Exception as e:
        print("❌ Prediction error:", str(e))
        # Return HTTP 400 with the error detail
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")