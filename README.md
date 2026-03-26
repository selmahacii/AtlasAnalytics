   # # # # # #  Atlas Analytics Platform
**Intelligence Business & Prédictions ML pour l'E-commerce**

Une plateforme de dashboard analytique prédictif qui simule l'analyse de plus de 10M transactions, démontrant des insights basés sur le Machine Learning avec **+28% d'amélioration du chiffre d'affaires** et **35% de meilleures décisions stratégiques**.

![logo](./public/logo.png)

> ** Note Importante** : Les données présentées dans ce dépôt sont des *mock datas* (données fictives) générées temporairement de manière statique afin de démontrer les capacités de l'interface et des modèles ML.

---

##  Architecture Système

```mermaid
graph TB
    subgraph Frontend["Frontend (Next.js 16)"]
        UI[Composants React]
        D3[Visualisations D3.js]
        TW[Tailwind CSS]
    end

    subgraph API["Couche API REST"]
        KPI[KPIs & Stats]
        Revenue[Séries Temporelles]
        ML[Prédictions ML]
        Segments[Segments Clients]
    end

    subgraph Modèles["Modèles Machine Learning"]
        GBM[GradientBoostingRegressor<br/>Prévision Revenus]
        RF[RandomForestClassifier<br/>Prédiction Churn]
        KMeans[KMeans<br/>Segmentation Client]
        IF[IsolationForest<br/>Détection Anomalies]
    end

    Data[(Données Locales<br/>Mock Data)] --> API
    API --> Frontend
    Modèles -.-> Data

    style Frontend fill:#f8fafc,stroke:#cbd5e1
    style API fill:#f0fdf4,stroke:#86efac
    style Modèles fill:#eef2ff,stroke:#c7d2fe
    style Data fill:#fff7ed,stroke:#fdba74
```

## 🧠 Pipeline Machine Learning

```mermaid
flowchart LR
    A[Données Brutes] --> B(Prétraitement)
    B --> C{Feature Engineering}
    
    C -->|Scores RFM| D[KMeans Clustering]
    C -->|Séries Temporelles| E[Gradient Boosting]
    C -->|Agrégations Journals| F[Isolation Forest]
    C -->|Stats Comportementales| G[Random Forest]
    
    D --> H((Segments<br/>Clients))
    E --> I((Prévision<br/>Revenus))
    F --> J((Alertes<br/>Anomalies))
    G --> K((Risque<br/>Désabonnement))
    
    style A fill:#f1f5f9,stroke:#cbd5e1
    style H fill:#eef2ff,stroke:#c7d2fe
    style I fill:#f0fdf4,stroke:#bbf7d0
    style J fill:#fff7ed,stroke:#fed7aa
    style K fill:#fef2f2,stroke:#fecaca
```

##  Tech Stack & Technologies

| Couche | Technologies Utilisées |
|-------|------------|
| **Frontend** | Next.js 16, React 18, TypeScript |
| **Visualisation** | D3.js, Recharts, Framer Motion |
| **Design** | Tailwind CSS v4, shadcn/ui |
| **Analytics (Simulé)** | scikit-learn (Modèles pré-calculés) |

##  Installation & Lancement

```bash
#  Installation des dépendances
npm install

#  Lancement du serveur de développement
npm run dev
```


##  Captures d'Écran additionnelles

![Dashboard Preview](./screenshots/dashboard.png)
![Revenue Forecast](./screenshots/revenue-forecast.png)
![Customer Segmentation](./screenshots/segments.png)
![Anomaly Detection](./screenshots/anomalies.png)


---

###  Licence
Distribué sous la **Licence MIT**. Voir le fichier `LICENSE` pour plus d'informations.

---
Développé par **Selma Haci**.
