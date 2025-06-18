import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from imblearn.over_sampling import SMOTE
from sklearn.impute import SimpleImputer
from sklearn.metrics import classification_report

# 📥 Veriyi oku
df = pd.read_csv("dataset.csv")

# ✅ Gerekli sütunları al
cols = ["Gender", "Age", "Family_Size", "Spending_Score", "Var_1"]
df = df[cols]

# 🔠 Categorical verileri normalize et (önce string hale getir)
df["Gender"] = df["Gender"].astype(str).str.strip().str.lower()
df["Spending_Score"] = df["Spending_Score"].astype(str).str.strip().str.lower()

# 🔢 Sayısal olarak map et
df["Gender"] = df["Gender"].map({"female": 0, "male": 1})
df["Spending_Score"] = df["Spending_Score"].map({
    "low": 0,
    "average": 1,
    "high": 2
})

# ⚠️ Eksik kategorik verileri güvenli doldur
if df["Gender"].notna().sum() > 0:
    df["Gender"].fillna(df["Gender"].mode()[0], inplace=True)
else:
    df["Gender"].fillna(0, inplace=True)  # default: Female

if df["Spending_Score"].notna().sum() > 0:
    df["Spending_Score"].fillna(df["Spending_Score"].mode()[0], inplace=True)
else:
    df["Spending_Score"].fillna(1, inplace=True)  # default: Average

# 🔧 Sayısal sütunları ortalama ile doldur
num_cols = ["Age", "Family_Size"]
imputer = SimpleImputer(strategy="mean")
df[num_cols] = imputer.fit_transform(df[num_cols])

# 🎯 Hedef sütun: Var_1
df["Var_1"] = df["Var_1"].astype(str)
le = LabelEncoder()
df["Var_1"] = le.fit_transform(df["Var_1"])

# 🎲 Özellikler ve etiket
X = df[["Gender", "Age", "Family_Size", "Spending_Score"]]
y = df["Var_1"]

# 📊 SMOTE ile sınıf dengesini sağla
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X, y)

# 🚂 Eğitim / test ayır
X_train, X_test, y_train, y_test = train_test_split(
    X_resampled, y_resampled, test_size=0.2, random_state=42
)

# 🌲 Random Forest modeli
model = RandomForestClassifier(
    class_weight="balanced",
    n_estimators=100,
    max_depth=10,
    random_state=42
)
model.fit(X_train, y_train)

# 📈 Performans çıktısı
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred, target_names=le.classes_.astype(str)))

# 💾 Model ve encoder kaydet
with open("model.pkl", "wb") as f:
    pickle.dump((model, le), f)

print("✅ Model başarıyla eğitildi ve kaydedildi.")
