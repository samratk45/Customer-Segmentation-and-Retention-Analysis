## Churn model results

Churn = no purchase in the 90 days after 2011-09-10. Features use only data before that date.

| Model | Accuracy | F1 | ROC-AUC |
|---|---|---|---|
| Majority-class baseline | 0.570 | 0.000 | 0.500 |
| Logistic Regression (Recency only) | 0.638 | 0.494 | 0.663 |
| Random Forest | 0.633 | 0.579 | 0.692 |

- Customers modelled: 3370 (churn rate 43.0%), 80/20 stratified split, seed 42
- Random Forest 5-fold CV accuracy: 0.652 +/- 0.011
