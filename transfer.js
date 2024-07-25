import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import walletKey from "./wallet.json" assert { type: "json" };

const to = new PublicKey("H69Bx7NPHYLvhm5GMWd5ertAjE2o93mY7q7iUvo6Gjj6");
const from = Keypair.fromSecretKey(new Uint8Array(walletKey));

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
console.log({ to, from });

const transfer = async () => {
  const balance = await connection.getBalance(from.publicKey);
  console.log({ balance });

  if (balance === 0) {
    console.log(`OGA YOU DON'T HAVE MONEY!!!`);
  } else {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance,
      })
    );

    transaction.feePayer = from.publicKey;

    const recentBlockhash = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = (recentBlockhash).blockhash;
    

    const fee =
      (
        await connection.getFeeForMessage(
          transaction.compileMessage(),
          "confirmed"
        )
      ).value || 0;


    transaction.instructions.pop(); 

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance * 0.1 - fee,
      })
    );

    const send = await sendAndConfirmTransaction(connection, transaction, [
      from,
    ]);

    console.log({ send });
  }
};

transfer();
