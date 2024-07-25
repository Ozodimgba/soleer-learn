import {Connection, Keypair, LAMPORTS_PER_SOL, PublicKey} from '@solana/web3.js';
import {generateKey} from './keygen.js';  
import walletKey from './wallet.json' assert {type: 'json'}

(async () => {
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    const myAddress = Keypair.fromSecretKey(new Uint8Array(walletKey)).publicKey.toBase58() ; 

    console.log({myAddress})
    const myAddressPublickey = new PublicKey(myAddress); 

    const signature = await connection.requestAirdrop(myAddressPublickey, LAMPORTS_PER_SOL * 0.3);

    console.log({signature}); 

    const res = await connection.confirmTransaction(signature);

    console.log({res})
  })();
  