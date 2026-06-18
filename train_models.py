import warnings
warnings.filterwarnings("ignore")


from sklearn.preprocessing import LabelEncoder




# STEP 1: Import libraries
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.model_selection import cross_val_score
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
import pickle
import matplotlib.pyplot as plt

# Advanced models
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from catboost import CatBoostClassifier

# STEP 2: Load dataset
data = pd.read_csv("data/crop_dataset.csv")
data = data.sample(frac=1, random_state=42).reset_index(drop=True)
print(data.head())
print(data['label'].value_counts())
print(data.groupby("label").mean())

# STEP 3: Features & Target
X = data[['nitrogen','phosphorus','potassium','temperature','humidity','ph','rainfall']]
y = data['label']

from sklearn.preprocessing import LabelEncoder
le = LabelEncoder()
y = le.fit_transform(y)



# STEP 4: Train-Test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# STEP 5: Scaling
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# STEP 6: Create models
rf = RandomForestClassifier(n_estimators=200,
    max_depth=10,
    random_state=42
)
svm = SVC(probability=True)
knn = KNeighborsClassifier()
lr = LogisticRegression(max_iter=200)
gb = GradientBoostingClassifier()

xgb = XGBClassifier(
    n_estimators=300,
    learning_rate=0.1,
    max_depth=6,
    eval_metric='mlogloss'
)
lgb = LGBMClassifier(
    n_estimators=200,
    learning_rate=0.1
)
cat = CatBoostClassifier(
    iterations=300,
    learning_rate=0.1,
    depth=6,
    verbose=0
)




# ✅ YAHAN ADD KARO
train_scores = {}
test_scores = {}

# STEP 7: Train + Accuracy
models = {}

# STEP 7: Train + Accuracy
models = {}

rf.fit(X_train, y_train)
train_scores["Random Forest"] = accuracy_score(y_train, rf.predict(X_train))
test_scores["Random Forest"] = accuracy_score(y_test, rf.predict(X_test))
models["Random Forest"] = cross_val_score(rf, X, y, cv=5).mean()

svm.fit(X_train, y_train)
train_scores["SVM"] = accuracy_score(y_train, svm.predict(X_train))
test_scores["SVM"] = accuracy_score(y_test, svm.predict(X_test))    
models["SVM"] = cross_val_score(svm, X, y, cv=5).mean()

knn.fit(X_train, y_train)
train_scores["KNN"] = accuracy_score(y_train, knn.predict(X_train))
test_scores["KNN"] = accuracy_score(y_test, knn.predict(X_test))
models["KNN"] = cross_val_score(knn, X, y, cv=5).mean()

lr.fit(X_train, y_train)
train_scores["Logistic Regression"] = accuracy_score(y_train, lr.predict(X_train))
test_scores["Logistic Regression"] = accuracy_score(y_test, lr.predict(X_test))
models["Logistic Regression"] = cross_val_score(lr, X, y, cv=5).mean()

gb.fit(X_train, y_train)
train_scores["Gradient Boosting"] = accuracy_score(y_train, gb.predict(X_train))
test_scores["Gradient Boosting"] = accuracy_score(y_test, gb.predict(X_test))
models["Gradient Boosting"] = cross_val_score(gb, X, y, cv=5).mean()

xgb.fit(X_train, y_train)
train_scores["XGBoost"] = accuracy_score(y_train, xgb.predict(X_train))
test_scores["XGBoost"] = accuracy_score(y_test, xgb.predict(X_test))
models["XGBoost"] = cross_val_score(xgb, X, y, cv=5).mean()

lgb.fit(X_train, y_train)
train_scores["LightGBM"] = accuracy_score(y_train, lgb.predict(X_train))
test_scores["LightGBM"] = accuracy_score(y_test, lgb.predict(X_test))
models["LightGBM"] = cross_val_score(lgb, X, y, cv=5).mean()

cat.fit(X_train, y_train)
train_scores["CatBoost"] = accuracy_score(y_train, cat.predict(X_train))
test_scores["CatBoost"] = accuracy_score(y_test, cat.predict(X_test))   
models["CatBoost"] = cross_val_score(cat, X, y, cv=5).mean()

# STEP 8: Ensemble (Voting)
ensemble = VotingClassifier(
    estimators=[
        ('rf', rf),
        ('svm', svm),
        ('xgb', xgb)
    ],
    voting='hard'
)

ensemble.fit(X_train, y_train)
models["Ensemble"] = cross_val_score(ensemble, X, y, cv=5).mean()

# STEP 9: Print all accuracies
print("\nModel Accuracies:")
   

# 📊 Model Comparison Graph

model_names = list(models.keys())
accuracies = [v * 100 for v in models.values()]

plt.figure(figsize=(10, 6))
plt.bar(model_names, accuracies)

plt.xlabel("Models")
plt.ylabel("Accuracy (%)")
plt.title("Model Comparison (Accuracy %)")

plt.xticks(rotation=45)
plt.ylim(0, 100)
plt.grid(axis='y', linestyle='--', alpha=0.7)
# Accuracy value show on bars
for i, v in enumerate(accuracies):
    plt.text(i, v + 0.5, f"{v:.1f}%", ha='center')

plt.tight_layout()

# Save graph
plt.savefig("model_comparison.png")

# Show graph
plt.show()



# 📊 Train vs Test Accuracy Graph

model_names = list(train_scores.keys())
train_vals = [v * 100 for v in train_scores.values()]
test_vals = [v * 100 for v in test_scores.values()]

x = range(len(model_names))

plt.figure(figsize=(12,6))

plt.bar(x, train_vals, width=0.4, label="Train Accuracy")
plt.bar([i + 0.4 for i in x], test_vals, width=0.4, label="Test Accuracy")

plt.xticks([i + 0.2 for i in x], model_names, rotation=45)
plt.ylabel("Accuracy (%)")
plt.title("Train vs Test Accuracy Comparison")

plt.legend()
plt.ylim(0, 100)
plt.grid(axis='y', linestyle='--', alpha=0.7)

# value labels
for i, v in enumerate(train_vals):
    plt.text(i, v + 0.5, f"{v:.1f}%", ha='center')

for i, v in enumerate(test_vals):
    plt.text(i + 0.4, v + 0.5, f"{v:.1f}%", ha='center')

plt.tight_layout()

plt.savefig("train_vs_test.png")
plt.show()












for name, acc in models.items():
    print(f"{name}: {acc}")

# STEP 10: Best model select
if models["CatBoost"] >= models["Random Forest"]:
    best_model_name = "CatBoost"
else:
    best_model_name = max(models, key=models.get)
print("\nBest Model:", best_model_name)

# STEP 11: Assign best model
model_map = {
    "Random Forest": rf,
    "SVM": svm,
    "KNN": knn,
    "Logistic Regression": lr,
    "Gradient Boosting": gb,
    "XGBoost": xgb,
    "LightGBM": lgb,
    "CatBoost": cat,
    "Ensemble": ensemble
}

best_model = model_map[best_model_name]


# 🔥 CONFUSION MATRIX START (YAHAN ADD KARO)

y_pred = best_model.predict(X_test)

cm = confusion_matrix(y_test, y_pred)

labels = le.classes_

plt.figure(figsize=(8,6))

disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=labels)
disp.plot(cmap='Blues', xticks_rotation=45)
disp.plot(cmap='Blues', values_format='d')

plt.title("Confusion Matrix")
plt.tight_layout()

plt.savefig("confusion_matrix.png")
plt.show()




# 🔥 FEATURE IMPORTANCE START

feature_names = X.columns
importances = best_model.feature_importances_

plt.figure(figsize=(8,6))
plt.barh(feature_names, importances)

plt.xlabel("Importance")
plt.title("Feature Importance")

plt.tight_layout()

plt.savefig("feature_importance.png")
plt.show()

# 🔥 FEATURE IMPORTANCE END




# STEP 12: Save model
pickle.dump(best_model, open("best_model.pkl", "wb"))
pickle.dump(scaler, open("scaler.pkl", "wb"))
pickle.dump(le, open("label_encoder.pkl", "wb"))

print("\nModel Saved Successfully ✅")