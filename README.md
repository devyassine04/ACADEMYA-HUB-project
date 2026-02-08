# 🎓 ACADEMIYA-Hub

Bienvenue sur le projet ACADEMIYA-Hub ! Voici comment lancer l'application sur votre ordinateur.

## 📋 Pré-requis
- [Python](https://www.python.org/downloads/) (pour le backend)
- [Node.js](https://nodejs.org/en/download/) (pour le frontend)

## 🚀 Installation & Lancement

### 1. Préparer le Backend (Serveur Python)
Ouvrez un terminal dans le dossier `backend` et lancez :

```bash
# 1. Installer les outils Python
pip install -r requirements.txt

# 2. Lancer le serveur (Laissez cette fenêtre ouverte !)
python manage.py runserver
```
> Le serveur écoute sur : `http://localhost:8000`

### 2. Préparer le Frontend (Site Web)
Ouvrez un **nouveau** terminal dans le dossier `frontend` et lancez :

```bash
# 1. Installer les outils React
npm install

# 2. Lancer le site (Laissez cette fenêtre ouverte !)
npm run dev
```

### 3. Accéder à l'application
Une fois les deux terminaux lancés, ouvrez votre navigateur et allez sur :

👉 **[http://localhost:5173](http://localhost:5173)**

## 🔑 Identifiants de Test
L'application est pré-remplie avec des données. Connectez-vous avec :

- **Admin** : `admin@academiya.ma` / `password123`
- **Directeur** : `directeur@academiya.ma` / `password123`
- **Enseignant** : `enseignant@academiya.ma` / `password123`
- **Étudiant** : `etudiant1@test.ma` / `password123`