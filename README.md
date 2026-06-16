# Tokenizer

Token fongible déployé sur la blockchain **Solana**, développé en **Rust natif**.

> **Objectif du projet :** créer un token sur la blockchain de son choix, en
> respectant ses standards, et en démontrer le fonctionnement.

| Propriété   | Valeur                                          |
|-------------|-------------------------------------------------|
| Nom         | 42 Corrections Points                           |
| Ticker      | 42CP                                            |
| Blockchain  | Solana                                          |
| Réseau      | Devnet                                          |
| Standard    | SPL Token                                       |
| Program ID  | `6GqVyPCtu2tfY4rhjS9SSWSkNioTcyA1buXAPbKpA65S`  |
| Mint        | `6Pk4egi7UH2shQhk24z2QoiZK6VBEAuVxYnyN1A6Vgde`  |
| Explorer    | [voir le mint sur l'explorer](https://explorer.solana.com/address/6Pk4egi7UH2shQhk24z2QoiZK6VBEAuVxYnyN1A6Vgde?cluster=devnet) |

---

## 1. Présentation

**42 Corrections Points (42CP)** est un token utilitaire symbolisant les points
de correction de l'école 42.

C'est un token **fongible** (chaque unité est interchangeable), créé from scratch
via un programme Solana écrit en Rust natif, sans framework.

---

## 2. Choix techniques

### Blockchain : Solana
Solana a été retenue pour sa **grosse communauté de développeurs** et son **écosystème
riche** (accès à de nombreuses ressources et au standard SPL mature), ainsi que pour
ses **frais de transaction très faibles** et sa **rapidité** (temps de bloc ~400 ms).
Ces atouts en font une plateforme idéale pour émettre et manipuler un token à moindre
coût, y compris sur son réseau de test (Devnet).

### Langage : Rust natif (sans Anchor)
Le programme est écrit en **Rust natif**, sans le framework Anchor. Choix
**pédagogique et volontaire** : il oblige à comprendre le **fonctionnement bas-niveau**
de Solana (gestion explicite des comptes, des signatures, des CPI via `invoke`,
sérialisation Borsh des données d'instruction). On garde ainsi une **maîtrise totale**
du flux d'exécution, là où Anchor masque ces mécanismes derrière des macros.

### Standard : SPL Token (et non Token-2022)
Le token suit le standard **SPL Token** classique (`TOKEN_PROGRAM_ID`), et non le
programme plus récent Token-2022. Pour un token fongible simple, le standard SPL est
**suffisant, plus simple et largement éprouvé**. Les « token extensions » de Token-2022
(frais de transfert automatiques, transferts confidentiels…) ne sont pas nécessaires
ici — c'est pourquoi `extensions = false` sur l'explorer.

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

---

## 4. Architecture du projet

```
.
├── README.md
├── code/
│   ├── src/lib.rs        # le programme : toute la logique create_token
│   ├── Cargo.toml
│   └── test/             # client TypeScript (create-token.ts, transfer.ts, helper.ts)
├── deployment/
│   ├── tokenizer-keypair.json   # keypair fixant le Program ID
│   └── deploy.sh                # commandes de déploiement
└── documentation/               # mode d'emploi détaillé
```

### Les 5 étapes de création du token (dans `lib.rs`)

| # | Instruction | Rôle |
|---|-------------|------|
| 1 | `create_account` | crée le compte du mint (rent-exempt, possédé par le Token Program) |
| 2 | `initialize_mint` | initialise le mint (décimales, mint_authority, freeze_authority) |
| 3 | `CreateMetadataAccountV3` | crée le compte de métadonnées Metaplex (nom, symbole, URI) |
| 4 | `create_associated_token_account` | crée l'ATA destinataire de la supply |
| 5 | `mint_to` | frappe la supply initiale vers l'ATA |

Les arguments (`token_title`, `token_symbol`, `token_uri`, `token_decimals`,
`initial_supply`) sont transmis au programme sérialisés en **Borsh**.

---

## 5. Choix de dépendances

L'écosystème Solana était en pleine **migration de versions** pendant le développement,
posant un vrai problème d'alignement :

- **`mpl-token-metadata 5.1.1`** impose `solana-program < 3.0`. Cette contrainte étant
  la plus rigide, **tout le projet a été aligné sur Solana 2.x** pour éviter que deux
  versions de Solana coexistent (ce qui produit des types `Pubkey`/`Instruction`
  incompatibles, même nom mais types différents).
- Le module `system_instruction`, **déprécié** au profit de `solana-system-interface`,
  a été **conservé volontairement** : ce nouveau crate tire Solana **3.x** et casserait
  la compatibilité avec Metaplex. L'avertissement est donc un compromis assumé
  (`#[allow(deprecated)]`).

**Stack retenue :**
- `solana-program` 2.3
- `spl-token` 8.0 / `spl-associated-token-account` 7.0 (feature `no-entrypoint`)
- `mpl-token-metadata` 5.1.1
- `borsh` 1.6

---

## 6. Prérequis & utilisation

**Prérequis :** `solana-cli`, `rustc`, `node`, `yarn`.

> Mode d'emploi détaillé : voir le dossier [`documentation/`](./documentation).

```bash
# 1. Compiler le programme
cargo build-sbf

# 2. Déployer sur devnet
cd deployment && ./deploy.sh

# 3. Créer (minter) le token
cd code/test && npx ts-node create-token.ts

# 4. Transférer des tokens
npx ts-node transfer.ts
```

---

## 7. Démonstration

- **Program ID** : `6GqVyPCtu2tfY4rhjS9SSWSkNioTcyA1buXAPbKpA65S`
- **Mint** : `6Pk4egi7UH2shQhk24z2QoiZK6VBEAuVxYnyN1A6Vgde`
- **Transaction de transfert (démo)** :
  [`42YJWDvFRqSM…Z9dZKLqr`](https://explorer.solana.com/tx/42YJWDvFRqSMjFD1zzm9azkD2wSU1xFrvXTm5Y7cdkKxW387Q1bUgav9CMvLPqZUwyvyvEZdJ1mxmLF6Z9dZKLqr?cluster=devnet)
