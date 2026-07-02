# Tokenizer

Token fongible déployé sur la blockchain **Solana**, développé en **Rust natif**.

> **Objectif du projet :** créer un token sur la blockchain de son choix, en
> respectant ses standards, et en démontrer le fonctionnement.

| Propriété   | Valeur                                          |
|-------------|-------------------------------------------------|
| Nom         | 42 Credits                           |
| Ticker      | 42C                                           |
| Blockchain  | Solana                                          |
| Réseau      | Devnet                                          |
| Standard    | SPL Token                                       |
| Program ID  | `6GqVyPCtu2tfY4rhjS9SSWSkNioTcyA1buXAPbKpA65S`  |
| Mint        | `2v9yy7RbXR1ePr86okTAh5bRPEnX6tM78NJ3y58pBBnX`  |
| Mint Signature | 2hRSMufu7yhjarVDZzHF59hLoxgdhAKA51aAzAbn1iCYJrH1PrRLpU3KGWoTUfwLjWw2bENRmNunzk3bbymzjm6Q |
| Explorer    | [voir le mint sur l'explorer](https://explorer.solana.com/address/2v9yy7RbXR1ePr86okTAh5bRPEnX6tM78NJ3y58pBBnX?cluster=devnet) |


---

## 1. Présentation

**42 Credits (42CR)** est le token utilitaire de l'écosystème 42. Il sert de monnaie
interne pour les **corrections entre étudiants**, la **récompense des contributions** à
l'école et l'accès à des **privilèges**.

C'est un token **fongible** (chaque unité est interchangeable).

---

## 2. Choix techniques

### Blockchain : Solana
Solana a été choisie pour sa **grosse communauté de développeurs** et son **écosystème
riche**, ainsi que pour ses **frais de transaction très faibles** et sa **rapidité** (temps de bloc ~400 ms).

### Langage : Rust natif (sans Anchor)
Le programme est écrit en **Rust natif**, sans le framework Anchor. Choix
**pédagogique et volontaire** : il oblige à comprendre le **fonctionnement bas-niveau**
de Solana (gestion explicite des comptes, des signatures, des CPI via `invoke`,
sérialisation Borsh des données d'instruction). On garde ainsi une **maîtrise totale**
du flux d'exécution, là où Anchor masque ces mécanismes derrière des macros.

### Standard : SPL Token (et non Token-2022)
Le token suit le standard **SPL Token** classique (`TOKEN_PROGRAM_ID`). Pour un token fongible simple, le standard SPL est suffisant.

### Métadonnées : Metaplex Token Metadata
Le nom, le symbole et l'URI sont enregistrés via **Metaplex Token Metadata**, standard
de facto sur Solana pour rendre un token lisible par les wallets et explorers. Les
**métadonnées riches** (image, description) sont hébergées **off-chain** et pointées
par l'URI, afin de **minimiser le coût de stockage on-chain** (facturé à l'octet).

### Émission : supply ouverte
La **`mint_authority` est conservée** : il reste possible de frapper de nouveaux tokens
(`mint_to`) ultérieurement. Compromis assumé :
- ✅ **flexibilité** — l'offre peut être ajustée ;
- ⚠️ **contrepartie** — **centralisation** (le détenteur de la mint_authority peut
  diluer l'offre). Pour une offre figée, il aurait fallu révoquer l'autorité via
  `set_authority` après l'émission initiale.

---

## 3. Sécurité — ownership & privilèges

La sécurité d'un token SPL repose essentiellement sur la gestion de ses **autorités** :

- **`mint_authority`** : seule autorité capable de créer de la supply (`mint_to`).
  Détenue par le wallet créateur, c'est le privilège le plus sensible, il contrôle
  l'offre totale.
- **`freeze_authority`** : autorité capable de **geler** un compte de tokens
  (bloquer ses transferts). Définie sur le wallet créateur.
- **Supply ouverte** : conserver la mint_authority implique une **relation de confiance**
  envers son détenteur.
- **Réseau de test** : déploiement **exclusivement sur Devnet**.

