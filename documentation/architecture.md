## 1. Architecture du projet
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

## 2. Choix de dépendances

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

**Stack :**
- `solana-program` 2.3
- `spl-token` 8.0 / `spl-associated-token-account` 7.0 (feature `no-entrypoint`)
- `mpl-token-metadata` 5.1.1
- `borsh` 1.6

---

## 3. Prérequis & utilisation

**Prérequis :** `solana-cli`, `rustc`, `node`, `yarn`.


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

## 4. Démonstration

- **Program ID** : `6GqVyPCtu2tfY4rhjS9SSWSkNioTcyA1buXAPbKpA65S`
- **Mint** : `2v9yy7RbXR1ePr86okTAh5bRPEnX6tM78NJ3y58pBBnX`
