import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import (
    mean_squared_error, 
    mean_absolute_error, 
    r2_score, 
    accuracy_score, 
    precision_score, 
    recall_score
)
import joblib

def build_ml_pipeline():
    print("🎬 Starting ML Pipeline...")
    
    # 1. Load Phase 1 5-second summary data (6 rows)
    try:
        face_df = pd.read_csv("phase1_5second_summary.csv")
    except FileNotFoundError:
        print("❌ Error: Run phase2_sync.py first to create phase1_5second_summary.csv")
        return

    try:
        behavior_df = pd.read_csv("behavioral_5second_summary.csv")
    except FileNotFoundError:
        print("❌ Error: Missing behavioral_5second_summary.csv. Run process_behavioral_file.py first.")
        return

    # 3. Weld the columns together side-by-side
    master_df = pd.concat([face_df, behavior_df], axis=1)

    # 4. Add Ground Truth Labels (Cognitive Score from 0 to 100 for your 6 rows)
    master_df['target_cognitive_score'] = [75, 78, 70, 15, 82, 80]

   # 5. Separate features (X) from the target score (y)
    # Remove metadata columns so the AI only trains on raw numbers
    columns_to_drop = ['block_id', 'avg_timestamp', 'target_cognitive_score']
    columns_to_drop = [col for col in columns_to_drop if col in master_df.columns]
    
    X = master_df.drop(columns=columns_to_drop)
    y = master_df['target_cognitive_score']

    print(f"\n✅ Combined dataset ready. Training features: {list(X.columns)}")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )


    # 6. Train the production Random Forest Regressor
    model = RandomForestRegressor(n_estimators=100, max_depth=4,oob_score=True, random_state=42)
    model.fit(X_train, y_train)
    print("🌲 Production Random Forest model trained successfully using real session metrics!")

    y_pred = model.predict(X_test)

    # A. Regression Metrics
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    print("\n--- 📊 Regression Performance Metrics ---")
    print(f"Mean Absolute Error (MAE) : {mae:.2f}")
    print(f"Root Mean Squared Error (RMSE) : {rmse:.2f}")
    print(f"R² Score                  : {r2:.2f}")

    # B. Classification Metrics (Binned: Score >= 50 is High Focus (1), < 50 is Low Focus (0))
    threshold = 50
    y_test_binary = (y_test >= threshold).astype(int)
    y_pred_binary = (y_pred >= threshold).astype(int)

    acc = accuracy_score(y_test_binary, y_pred_binary) * 100
    prec = precision_score(y_test_binary, y_pred_binary, zero_division=0) * 100
    rec = recall_score(y_test_binary, y_pred_binary, zero_division=0) * 100

    print("\n--- 🎯 Classification Accuracy Metrics (High vs Low Focus) ---")
    print(f"Accuracy  : {acc:.1f}%")
    print(f"Precision : {prec:.1f}%")
    print(f"Recall    : {rec:.1f}%")

    # 7. Save the model file
    model_filename = "cognitive_load_model.pkl"
    joblib.dump(model, model_filename)
    print(f"💾 Saved final AI engine as: {model_filename}")

if __name__ == "__main__":
    build_ml_pipeline()
