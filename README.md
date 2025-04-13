
backend/
├── src/
│   ├── types/               # Définitions de types
│   │   ├── user.d.ts        
│   │   ├── product.d.ts
│   │   └── sparql.d.ts
│   ├── config/              # Configuration
│   ├── controllers/         # Contrôleurs typés
│   ├── routes/              # Routes
│   ├── services/            # Services avec interfaces
│   ├── app.ts               # Application principale
│   └── server.ts            # Lancement du serveur
├── tsconfig.json            # Configuration TS
└── package.json




scripts/
├── data/          # Fichiers CSV/JSON d'entrée
├── migrations/    # Scripts de mise à jour de schéma
└── utils/         # Fonctions partagées entre scripts