const Web3 = require("web3");
const postgres = require("postgres");

const web3 = new Web3("http://localhost:8545");
const sql = postgres("postgresql://root:root@localhost:5432/txs");

const start = async () => {
  let i = (await getLatestUnsyncedBlock()) + 1;
  while (true) {
    try {
      const block = await getBlock(i);
      console.log("processing block:\t", i);
      const transactions = block.transactions.map((tx) => ({
        data: JSON.stringify(tx),
        tx_id: tx.hash,
        to_address: tx.to,
        from_address: tx.from,
      }));
      if (transactions.length) {
        await sql`INSERT INTO transactions ${sql(
          transactions,
          "data",
          "tx_id",
          "to_address",
          "from_address"
        )}`;
      }
      await setLatestUnsyncedBlock(i);
    } catch (e) {
      console.log("failed to parse block ", i);
      console.log(e);
    }
    i++;
  }
};

setTimeout(() => {
  start().catch(console.log);
}, 1000);

const getBlock = async (blockNumber) => {
  const block = await web3.eth.getBlock(blockNumber, true);
  return block;
};

const getLatestUnsyncedBlock = async () => {
  const [{ block_number }] =
    await sql`select block_number from last_synced_block`;
  return block_number;
};

const setLatestUnsyncedBlock = async (i) => {
  await sql`update last_synced_block set block_number = ${i}`;
};
