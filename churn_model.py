"""
Leakage-free churn model for the UCI Online Retail dataset.

How it avoids leakage
---------------------
* A cutoff date is placed CHURN_DAYS before the last transaction in the data.
* Features are built ONLY from transactions on or before the cutoff.
* The label is "did NOT buy anything in the CHURN_DAYS after the cutoff".
  So the label is about the future, and Recency (measured at the cutoff) is a
  legitimate input feature rather than a copy of the label.

Usage:
    pip install pandas numpy scikit-learn openpyxl
    python churn_model.py "Online Retail.xlsx"      # or a .csv version

Outputs: printed summary, results.json, RESULTS.md
"""
import os
import sys
import json
import numpy as np
import pandas as pd
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                             f1_score, roc_auc_score, confusion_matrix)
from sklearn.model_selection import StratifiedKFold, cross_validate, train_test_split

CHURN_DAYS = 90
SEED = 42


def out_path(name):
    """Save next to this script; fall back to the home folder if that fails."""
    for folder in (os.path.dirname(os.path.abspath(__file__)), os.path.expanduser("~")):
        try:
            os.makedirs(folder, exist_ok=True)
            path = os.path.join(folder, name)
            with open(path, "a"):
                pass
            return path
        except OSError:
            continue
    return name


def load(path):
    if path.lower().endswith(".csv"):
        df = pd.read_csv(path, encoding="ISO-8859-1")
    else:
        df = pd.read_excel(path)
    df = df.rename(columns={"Invoice": "InvoiceNo", "Customer ID": "CustomerID",
                            "Price": "UnitPrice"})
    return df


def clean(df):
    df = df.dropna(subset=["CustomerID"]).copy()
    df["InvoiceNo"] = df["InvoiceNo"].astype(str)
    df = df[~df["InvoiceNo"].str.startswith("C")]          # cancelled orders
    df = df[(df["Quantity"] > 0) & (df["UnitPrice"] > 0)]
    df["InvoiceDate"] = pd.to_datetime(df["InvoiceDate"])
    df["CustomerID"] = df["CustomerID"].astype(int)
    df["Revenue"] = df["Quantity"] * df["UnitPrice"]
    return df


def build_dataset(df):
    cutoff = df["InvoiceDate"].max() - pd.Timedelta(days=CHURN_DAYS)
    past = df[df["InvoiceDate"] <= cutoff]
    future = df[df["InvoiceDate"] > cutoff]

    inv = (past.groupby(["CustomerID", "InvoiceNo"])
               .agg(date=("InvoiceDate", "min"), revenue=("Revenue", "sum"))
               .reset_index())
    f = inv.groupby("CustomerID").agg(frequency=("InvoiceNo", "nunique"),
                                      monetary=("revenue", "sum"),
                                      first=("date", "min"),
                                      last=("date", "max"))
    f["recency"] = (cutoff - f["last"]).dt.days
    f["tenure"] = (cutoff - f["first"]).dt.days
    f["avg_order_value"] = f["monetary"] / f["frequency"]
    span = (f["last"] - f["first"]).dt.days
    f["avg_gap_days"] = np.where(f["frequency"] > 1, span / (f["frequency"] - 1).clip(lower=1), 0)
    for d in (30, 60):
        recent = inv[inv["date"] > cutoff - pd.Timedelta(days=d)]
        f[f"orders_last_{d}d"] = recent.groupby("CustomerID").size().reindex(f.index).fillna(0)
    f["product_diversity"] = past.groupby("CustomerID")["StockCode"].nunique().reindex(f.index)

    f["churned"] = (~f.index.isin(future["CustomerID"].unique())).astype(int)
    features = ["recency", "frequency", "monetary", "avg_order_value", "tenure",
                "avg_gap_days", "orders_last_30d", "orders_last_60d", "product_diversity"]
    return f[features], f["churned"], cutoff


def metrics(y_true, y_pred, y_prob):
    return {"accuracy": accuracy_score(y_true, y_pred),
            "precision": precision_score(y_true, y_pred, zero_division=0),
            "recall": recall_score(y_true, y_pred, zero_division=0),
            "f1": f1_score(y_true, y_pred, zero_division=0),
            "roc_auc": roc_auc_score(y_true, y_prob)}


def main(path):
    raw = load(path)
    df = clean(raw)
    per_cust = df.groupby("CustomerID")["Revenue"].sum()
    overview = {
        "rows_after_cleaning": int(len(df)),
        "unique_customers": int(df["CustomerID"].nunique()),
        "date_range": [str(df["InvoiceDate"].min().date()), str(df["InvoiceDate"].max().date())],
        "total_revenue": round(float(df["Revenue"].sum()), 2),
        "mean_spend_per_customer": round(float(per_cust.mean()), 2),
        "median_spend_per_customer": round(float(per_cust.median()), 2),
    }

    X, y, cutoff = build_dataset(df)
    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, stratify=y, random_state=SEED)

    models = {
        "Majority-class baseline": DummyClassifier(strategy="most_frequent"),
        "Logistic Regression (Recency only)": None,
        "Random Forest": RandomForestClassifier(n_estimators=300, min_samples_leaf=3,
                                                random_state=SEED, n_jobs=-1),
    }
    results = {}
    dummy = models["Majority-class baseline"].fit(X_tr, y_tr)
    results["Majority-class baseline"] = metrics(y_te, dummy.predict(X_te), dummy.predict_proba(X_te)[:, 1] if dummy.predict_proba(X_te).shape[1] > 1 else np.zeros(len(y_te)) + 0.5)

    lr = LogisticRegression(max_iter=1000).fit(X_tr[["recency"]], y_tr)
    results["Logistic Regression (Recency only)"] = metrics(
        y_te, lr.predict(X_te[["recency"]]), lr.predict_proba(X_te[["recency"]])[:, 1])

    rf = models["Random Forest"].fit(X_tr, y_tr)
    pred, prob = rf.predict(X_te), rf.predict_proba(X_te)[:, 1]
    results["Random Forest"] = metrics(y_te, pred, prob)

    cv = cross_validate(rf, X, y, cv=StratifiedKFold(5, shuffle=True, random_state=SEED),
                        scoring=["accuracy", "f1", "roc_auc"], n_jobs=-1)
    cv_summary = {k.replace("test_", ""): [round(float(v.mean()), 4), round(float(v.std()), 4)]
                  for k, v in cv.items() if k.startswith("test_")}

    importances = dict(sorted(zip(X.columns, rf.feature_importances_.round(4).tolist()),
                              key=lambda kv: -kv[1]))
    out = {
        "setup": {"churn_window_days": CHURN_DAYS, "cutoff_date": str(cutoff.date()),
                  "customers_modelled": int(len(X)), "churn_rate": round(float(y.mean()), 4),
                  "train_size": int(len(X_tr)), "test_size": int(len(X_te))},
        "overview": overview,
        "test_set_results": {k: {m: round(float(v), 4) for m, v in r.items()} for k, r in results.items()},
        "random_forest_5fold_cv_mean_std": cv_summary,
        "random_forest_confusion_matrix": confusion_matrix(y_te, pred).tolist(),
        "feature_importances": importances,
    }
    with open(out_path("results.json"), "w", encoding="utf-8") as fh:
        json.dump(out, fh, indent=2)

    rf_r = out["test_set_results"]["Random Forest"]
    base = out["test_set_results"]["Majority-class baseline"]
    md = f"""## Churn model results

Churn = no purchase in the {CHURN_DAYS} days after {cutoff.date()}. Features use only data before that date.

| Model | Accuracy | F1 | ROC-AUC |
|---|---|---|---|
""" + "\n".join(f"| {k} | {v['accuracy']:.3f} | {v['f1']:.3f} | {v['roc_auc']:.3f} |"
                for k, v in out["test_set_results"].items()) + f"""

- Customers modelled: {len(X)} (churn rate {y.mean():.1%}), 80/20 stratified split, seed {SEED}
- Random Forest 5-fold CV accuracy: {cv_summary['accuracy'][0]:.3f} +/- {cv_summary['accuracy'][1]:.3f}
"""
    with open(out_path("RESULTS.md"), "w", encoding="utf-8") as fh:
        fh.write(md)

    print(json.dumps(out, indent=2))
    print("\nSaved results to:", out_path("results.json"))
    print("\nRandom Forest vs majority baseline accuracy: "
          f"{rf_r['accuracy']:.3f} vs {base['accuracy']:.3f}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit('Usage: python churn_model.py "Online Retail.xlsx"')
    main(sys.argv[1])
