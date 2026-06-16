import { homedir } from "node:os";
import {getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
} from "@solana/web3.js";
import { transfer } from '@solana/spl-token';
import { RPC_SOLANA, createKeypairFromFile } from "./helper";

const MINT_KEYPAIR = new PublicKey("6Pk4egi7UH2shQhk24z2QoiZK6VBEAuVxYnyN1A6Vgde");
const AMOUNT = BigInt(10000000);

async function main() {
    const connection = new Connection(RPC_SOLANA, "confirmed");
    const payer = createKeypairFromFile(`${homedir()}/.config/solana/id.json`);
    
    const receiver = Keypair.generate();
    const sourceAta = await getOrCreateAssociatedTokenAccount(connection, payer, MINT_KEYPAIR, payer.publicKey);
    const destinationATA = await getOrCreateAssociatedTokenAccount(connection, payer, MINT_KEYPAIR, receiver.publicKey);

    const tx = await transfer(
        connection,
        payer,
        sourceAta.address,
        destinationATA.address,
        payer.publicKey,
        AMOUNT,
    );

    console.log(`Transfer signature: ${tx}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
