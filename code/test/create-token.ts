import { Buffer } from "node:buffer";
import { homedir } from "node:os";
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import * as borsh from "borsh";
import { RPC_SOLANA, createKeypairFromFile } from "./helper";

function borshSerialize(schema: borsh.Schema, data: object): Buffer{
    return Buffer.from(borsh.serialize(schema, data));
}

const CreateTokenArgsSchema = {
    struct: {
        token_title: "string",
        token_symbol: "string",
        token_uri: "string",
        token_decimals: "u8",
        initial_supply: "u64",
    },
};

const PROGRAM_ID = new PublicKey('6GqVyPCtu2tfY4rhjS9SSWSkNioTcyA1buXAPbKpA65S');
const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

async function main() {
    const connection = new Connection(RPC_SOLANA, "confirmed");
    const payer = createKeypairFromFile(`${homedir()}/.config/solana/id.json`);

    const mintKeypair = Keypair.generate();

    // Program Derived Address pour stocker métadonnée du token
    const metadataAddress = PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mintKeypair.publicKey.toBuffer()],
        TOKEN_METADATA_PROGRAM_ID,
    )[0];

    // SPL Token norm default = 9 decimals
    const instructionData = borshSerialize(CreateTokenArgsSchema, {
        token_title: "42 Credits",
        token_symbol: "42CR",
        description: "42 ecosystem credits: peer corrections, contributions, and governance.",
        token_uri:
            "",
        token_decimals: 9,
        initial_supply: BigInt(42000000),
    });

    const associatedTokenAddress = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        payer.publicKey,
    );

    const ix = new TransactionInstruction({
        keys: [
            { pubkey: mintKeypair.publicKey, isSigner: true, isWritable: true }, // mint
            { pubkey: payer.publicKey, isSigner: true, isWritable: false }, // mint_authority
            { pubkey: associatedTokenAddress, isSigner: false, isWritable: true }, // ATA
            { pubkey: metadataAddress, isSigner: false, isWritable: true }, // metadata
            { pubkey: payer.publicKey, isSigner: true, isWritable: true }, // payer
            { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }, // rent
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // system
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // token program
            { pubkey: TOKEN_METADATA_PROGRAM_ID, isSigner: false, isWritable: false }, // metadata program
            { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // ATA program
        ],
        programId: PROGRAM_ID,
        data: instructionData,
    });

    const sx = await sendAndConfirmTransaction(connection, new Transaction().add(ix), [payer, mintKeypair]);

    console.log(` Mint adress: ${mintKeypair.publicKey}`);
    console.log(` Tx signature: ${sx}`);
};

main().catch((err) => {
    console.error(err);
    process.exit(1);
});