import { readFileSync } from "node:fs";
import { Keypair } from "@solana/web3.js";

export const RPC_SOLANA = 'https://api.devnet.solana.com/';

export function createKeypairFromFile(path: string): Keypair {
    return Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(readFileSync(path, "utf-8")))
    );
}

