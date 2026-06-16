# Tokenomics — 42 Credits (42CR)

## 1. Vue d'ensemble

**42 Credits (42CR)** est le token utilitaire de l'écosystème 42. Il sert de monnaie
interne pour les **corrections entre étudiants**, la **récompense des contributions** à
l'école et l'accès à des **privilèges (goodies)**.

- **Autorité (mint_authority)** : **42 Centrale** (entité de confiance qui gère l'émission).
- **Modèle d'offre** : **supply fixe**, mintée **une seule fois** au lancement.
- **Réseau** : Devnet

---

## 2. Supply & paramètres

| Paramètre | Valeur | Justification |
|-----------|--------|---------------|
| Supply totale | **42 000 000 42CR** | chiffre symbolique (42), rond, suffisant sur 100 ans |
| Décimales | **0** | les crédits sont des **unités indivisibles** (des points), pas de fractions |
| `initial_supply` (unités de base) | `42 000 000` | avec 0 décimale : 1 unité de base = 1 token |
| Émission | unique, au lancement | supply fixe → pas de dilution |

---

## 3. Répartition de la supply

| Pool | % | Montant | Détenu par | Rôle |
|------|---|---------|------------|------|
| **Étudiants** | 50 % | 21 000 000 | programme / 42 Centrale | corrections, récompenses, airdrops d'arrivée |
| **Liquidité** | 30 % | 12 600 000 | 42 Centrale | profondeur de marché, contrôlée par l'école |
| **Vesting tiers** | 20 % | 8 400 000 | 42 Centrale → tiers | achat par contributeurs externes, financement de l'école |

---

## 4. Mécaniques économiques

### Gagner des 42CR
- **Effectuer une correction** : l'étudiant correcteur reçoit des tokens ; l'étudiant
  corrigé est débité au moment où il prend la correction.
- **Contribuer à l'école** : récompense pour l'aide à la maintenance, aux outils, etc.
- **Airdrop d'arrivée** : chaque nouvel étudiant reçoit **5 42CR** à son inscription
  (seed de départ), prélevés sur la pool étudiants.

### Dépenser des 42CR
- **Se faire corriger** (réserver une évaluation par un pair).
- **Acheter des privilèges / bounties** via une future marketplace.

### Frais
L'étudiant ne dépense **jamais d'argent réel** : tout est automatisé et **42 Centrale
paie les frais de transaction** (le *fee payer* peut être l'école, pas l'étudiant).

---

## 5. Durabilité sur 100 ans

**Point clé : les corrections sont à somme nulle.** Quand A corrige B, A gagne ce que
B perd → le total ne bouge pas, les tokens **circulent** entre étudiants. La pool
étudiants ne se **vide donc pas** sous l'effet de l'activité de correction.

La pool ne diminue réellement que par deux fuites :
1. l'**airdrop d'arrivée** (5 42CR par nouvel étudiant) ;
2. ce que les **diplômés emportent** en partant.

**Estimation :**
```
Besoin sur 100 ans ≈ (nouveaux étudiants / an) × (airdrop par étudiant) × 100
Ex. : 2 000 × 5 × 100 = 1 000 000 42CR
```
La pool étudiants (**21 000 000**) couvre ce besoin **largement** (facteur ~20), même en
tenant compte de la croissance du réseau 42. Le modèle est donc soutenable sur un siècle
avec une marge confortable.

---

## 6. Gouvernance & règles

- **Plafond de sortie** : un étudiant peut repartir avec **5 42CR maximum**.
- **Surplus** : au-delà, l'étudiant choisit de le **remettre dans la pool de liquidité**
  ou d'en faire **don** (max **1 token par personne**).
- **Application** : ces règles relèvent de la **gouvernance** (programme on-chain dédié
  ou gestion par 42 Centrale) — **non codées** dans le programme de ce projet.

---

## 7. Liquidité & valorisation (mainnet — conceptuel)

> Cette section est **théorique** : sur Devnet, le token n'a aucune valeur réelle.

- **Aucune valeur intrinsèque** : un token vaut ce que le marché paie.
- **Découverte du prix** : via une pool **AMM** (Raydium/Orca). Le **prix initial** est
  fixé par le **ratio** déposé (42CR + SOL/USDC), puis évolue selon l'offre/demande
  (formule produit constant `x × y = k`).
- **Moteurs de demande** : **utilité** (corrections, privilèges), **rareté** (supply
  fixe), confiance (autorité 42 Centrale).
- **Rôle des pools** : la poche **Liquidité (30 %)** amorce et stabilise le marché ;
  le **Vesting (20 %)** est libéré progressivement pour éviter une vente massive qui
  ferait chuter le prix.

---