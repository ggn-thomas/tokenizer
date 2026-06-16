import { homedir } from "node:os";
import {getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
} from "@solana/web3.js";
import { transfer } from '@solana/spl-token';
import { RPC_SOLANA, createKeypairFromFile } from "./helper";

const MINT_KEYPAIR = new PublicKey("2v9yy7RbXR1ePr86okTAh5bRPEnX6tM78NJ3y58pBBnX");
const AMOUNT = BigInt(1);

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
