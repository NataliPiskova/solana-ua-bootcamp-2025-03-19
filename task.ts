console.log("Початок...");

const {
  Connection,
  Keypair,
  clusterApiUrl,
} = require('@solana/web3.js');
const {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
} = require('@solana/spl-token');

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const payer = Keypair.generate();        // хто створює токени
const recipient = Keypair.generate();    // хто отримає токени

async function main() {
  console.log("Airdrop 2 SOL to payer...");
  const airdropSig = await connection.requestAirdrop(payer.publicKey, 2e9);
  await connection.confirmTransaction(airdropSig);

  console.log("Creating new token...");
  const mint = await createMint(
    connection,
    payer,
    payer.publicKey,
    null,
    9 // decimals
  );

  const payerTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );

  const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    recipient.publicKey
  );

  console.log(`Minting 100 tokens to payer...`);
  await mintTo(
    connection,
    payer,
    mint,
    payerTokenAccount.address,
    payer.publicKey,
    100e9 // 100 токенів з 9 знаками
  );

  console.log(`📦 Transferring 1 token to recipient...`);
  await transfer(
    connection,
    payer,
    payerTokenAccount.address,
    recipientTokenAccount.address,
    payer.publicKey,
    1e9 // 1 токен
  );

  console.log("Token створено і переведено!");
}

main().catch(console.error);

