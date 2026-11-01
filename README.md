# Customer Segmentation & Churn Dashboard

RFM customer segmentation and a leakage-free churn model on the UCI Online Retail
dataset (397,884 transactions, 4,338 customers), with a Streamlit dashboard.

## What it does
- RFM scoring into 5 segments: Best, Loyal, Potential Loyalist, At Risk, Hibernating
- Churn model: Random Forest, label = no purchase in the 90 days after a cutoff date,
  features built only from data before the cutoff (no leakage)
- Dashboard with overview, segments and churn model tabs

## Results (held-out test set / 5-fold CV)
- Random Forest: 63% accuracy (65% CV), ROC-AUC 0.69 (0.72 CV)
- Majority-class baseline: 57% accuracy

## Run it
1. Download "Online Retail.xlsx" from the UCI Machine Learning Repository
2. pip install streamlit pandas numpy scikit-learn openpyxl
3. streamlit run app.py

## Tech
Python, pandas, scikit-learn, Streamlit
