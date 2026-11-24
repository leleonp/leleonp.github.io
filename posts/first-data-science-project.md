# My First Data Science Project

*January 20, 2024*

In this post, I'll walk you through my first machine learning project using Python and scikit-learn. This project taught me valuable lessons about data preprocessing, model selection, and evaluation.

## The Problem

I wanted to predict house prices based on various features like:
- Square footage
- Number of bedrooms
- Location
- Age of the house
- Local amenities

The goal was to build a model that could accurately estimate property values for a real estate company.

## The Dataset

I used the Boston Housing dataset, which contains 506 samples with 13 features each. Here's what the data looked like:

```python
import pandas as pd
import numpy as np
from sklearn.datasets import load_boston
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Load the dataset
boston = load_boston()
X = pd.DataFrame(boston.data, columns=boston.feature_names)
y = pd.Series(boston.target, name='price')

print(X.head())
print(f"Dataset shape: {X.shape}")
```

## Data Exploration

Before jumping into modeling, I spent time understanding the data:

### Key Insights:
- **MEDV** (median home value) ranged from $5,000 to $50,000
- **RM** (average number of rooms) had the strongest positive correlation with price
- **LSTAT** (% lower status population) had a strong negative correlation

### Visualization

I created several plots to understand the relationships:

```python
import matplotlib.pyplot as plt
import seaborn as sns

# Correlation heatmap
plt.figure(figsize=(12, 8))
sns.heatmap(X.corr(), annot=True, cmap='coolwarm')
plt.title('Feature Correlation Matrix')
plt.show()

# Price distribution
plt.figure(figsize=(10, 6))
plt.hist(y, bins=30, edgecolor='black')
plt.title('Distribution of House Prices')
plt.xlabel('Price ($1000s)')
plt.ylabel('Frequency')
plt.show()
```

## Model Building

I tried several approaches:

### 1. Linear Regression (Baseline)

```python
# Split the data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train the model
lr = LinearRegression()
lr.fit(X_train, y_train)

# Make predictions
y_pred = lr.predict(X_test)

# Evaluate
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"MSE: {mse:.2f}")
print(f"R² Score: {r2:.3f}")
```

### 2. Random Forest

```python
from sklearn.ensemble import RandomForestRegressor

rf = RandomForestRegressor(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)
rf_pred = rf.predict(X_test)

rf_mse = mean_squared_error(y_test, rf_pred)
rf_r2 = r2_score(y_test, rf_pred)

print(f"Random Forest MSE: {rf_mse:.2f}")
print(f"Random Forest R²: {rf_r2:.3f}")
```

## Results

| Model | MSE | R² Score |
|-------|-----|----------|
| Linear Regression | 24.29 | 0.669 |
| Random Forest | 11.18 | 0.847 |

The Random Forest model performed significantly better, achieving an R² score of 0.847.

## Feature Importance

The Random Forest model revealed which features were most important:

```python
# Get feature importance
importance = rf.feature_importances_
feature_names = X.columns

# Create a dataframe for visualization
importance_df = pd.DataFrame({
    'feature': feature_names,
    'importance': importance
}).sort_values('importance', ascending=False)

# Plot
plt.figure(figsize=(10, 6))
sns.barplot(data=importance_df.head(10), x='importance', y='feature')
plt.title('Top 10 Most Important Features')
plt.xlabel('Importance')
plt.show()
```

## Lessons Learned

This project taught me several valuable lessons:

1. **Data exploration is crucial** - Understanding your data before modeling saves time later
2. **Feature engineering matters** - Simple transformations can improve model performance
3. **Model comparison is essential** - Don't settle for the first model you try
4. **Validation is key** - Always test on unseen data

## Next Steps

For future projects, I plan to:
- Experiment with feature engineering techniques
- Try more advanced models like XGBoost
- Implement proper cross-validation
- Deploy models using Flask or FastAPI

## Conclusion

While this was a relatively simple project, it provided a solid foundation for understanding the machine learning workflow. The key is to start with something manageable and gradually increase complexity.

**Key takeaways:**
- Start simple, then iterate
- Spend time understanding your data
- Compare multiple models
- Always validate your results

---

*Have questions about this project? Feel free to reach out!*
