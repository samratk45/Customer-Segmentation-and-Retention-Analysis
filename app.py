
import numpy as np
import pandas as pd
import streamlit as st
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

from churn_model import load, clean, build_dataset, metrics, SEED

st.set_page_config(page_title="Customer Segmentation & Churn", layout="wide")
st.title("Customer Segmentation & Retention Dashboard")

path = st.sidebar.text_input("Dataset file", "Online Retail.xlsx")


@st.cache_data(show_spinner="Loading and cleaning data...")
def get_data(p):
    return clean(load(p))


@st.cache_data(show_spinner="Computing RFM segments...")
def rfm_table(df):
    snapshot = df["InvoiceDate"].max() + pd.Timedelta(days=1)
    inv = df.groupby(["CustomerID", "InvoiceNo"]).agg(date=("InvoiceDate", "min"),
                                                        revenue=("Revenue", "sum")).reset_index()
    t = inv.groupby("CustomerID").agg(last=("date", "max"), frequency=("InvoiceNo", "nunique"),
                                      monetary=("revenue", "sum"))
    t["recency"] = (snapshot - t["last"]).dt.days
    t["R"] = pd.qcut(t["recency"].rank(method="first", ascending=False), 5, labels=[1, 2, 3, 4, 5]).astype(int)
    t["F"] = pd.qcut(t["frequency"].rank(method="first"), 5, labels=[1, 2, 3, 4, 5]).astype(int)
    t["M"] = pd.qcut(t["monetary"].rank(method="first"), 5, labels=[1, 2, 3, 4, 5]).astype(int)

    def segment(r):
        if r.R >= 4 and r.F >= 4:
            return "Best Customers"
        if r.R >= 3 and r.F >= 3:
            return "Loyal Customers"
        if r.R >= 4 and r.F < 3:
            return "Potential Loyalist"
        if r.R <= 2 and r.F >= 3:
            return "At Risk"
        return "Hibernating"

    t["segment"] = t.apply(segment, axis=1)
    return t.drop(columns="last")


@st.cache_data(show_spinner="Training churn model...")
def train_churn(df):
    X, y, cutoff = build_dataset(df)
    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, stratify=y, random_state=SEED)
    rf = RandomForestClassifier(n_estimators=300, min_samples_leaf=3, random_state=SEED, n_jobs=-1).fit(X_tr, y_tr)
    prob = rf.predict_proba(X_te)[:, 1]
    res = metrics(y_te, (prob >= 0.5).astype(int), prob)
    imp = pd.Series(rf.feature_importances_, index=X.columns).sort_values(ascending=False)
    risk = X_te.assign(churn_probability=prob.round(3), actually_churned=y_te).sort_values(
        "churn_probability", ascending=False)
    return res, imp, risk, cutoff, float(y.mean())


try:
    df = get_data(path)
except Exception as e:  # noqa: BLE001
    st.error(f"Could not load '{path}': {e}")
    st.stop()

tab1, tab2, tab3 = st.tabs(["Overview", "RFM Segments", "Churn Model"])

with tab1:
    per_cust = df.groupby("CustomerID")["Revenue"].sum()
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Transactions", f"{len(df):,}")
    c2.metric("Customers", f"{df['CustomerID'].nunique():,}")
    c3.metric("Mean spend / customer", f"£{per_cust.mean():,.0f}")
    c4.metric("Median spend / customer", f"£{per_cust.median():,.0f}")
    st.caption("Mean is far above median: a small group of big spenders drives most revenue.")
    monthly = df.set_index("InvoiceDate")["Revenue"].resample("MS").sum()
    st.subheader("Monthly revenue")
    st.line_chart(monthly)

with tab2:
    rfm = rfm_table(df)
    order = ["Best Customers", "Loyal Customers", "Potential Loyalist", "At Risk", "Hibernating"]
    summary = rfm.groupby("segment").agg(customers=("R", "size"), avg_recency_days=("recency", "mean"),
                                         avg_orders=("frequency", "mean"), avg_spend=("monetary", "mean"),
                                         total_revenue=("monetary", "sum")).reindex(order).round(1)
    summary["customer_share_%"] = (summary["customers"] / summary["customers"].sum() * 100).round(1)
    summary["revenue_share_%"] = (summary["total_revenue"] / summary["total_revenue"].sum() * 100).round(1)
    left, right = st.columns(2)
    left.subheader("Customers per segment")
    left.bar_chart(summary["customers"])
    right.subheader("Revenue share (%) per segment")
    right.bar_chart(summary["revenue_share_%"])
    st.dataframe(summary, width="stretch")
    pick = st.selectbox("Inspect a segment", order)
    st.dataframe(rfm[rfm["segment"] == pick].sort_values("monetary", ascending=False).head(50),
                 width="stretch")

with tab3:
    res, imp, risk, cutoff, churn_rate = train_churn(df)
    st.write(f"Churn = no purchase in the 90 days after **{cutoff.date()}**. "
             f"Features use only data before that date (no leakage). Churn rate: **{churn_rate:.1%}**.")
    m1, m2, m3, m4 = st.columns(4)
    m1.metric("Accuracy (test)", f"{res['accuracy']:.1%}")
    m2.metric("F1 (test)", f"{res['f1']:.2f}")
    m3.metric("ROC-AUC (test)", f"{res['roc_auc']:.2f}")
    m4.metric("Majority baseline", f"{1 - churn_rate:.1%}" if churn_rate < 0.5 else f"{churn_rate:.1%}")
    st.subheader("Feature importance")
    st.bar_chart(imp)
    st.subheader("Highest-risk customers (held-out test set)")
    st.dataframe(risk.head(25), width="stretch")
