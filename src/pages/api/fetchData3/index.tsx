import { MongoClient } from 'mongodb';
import Web3 from 'web3';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const client = new MongoClient(process.env.MONGODB_URI!);
  try {
    await client.connect();
    const db = client.db('test');

    // Fetch priority fee data
    const priorityFeeData = await db.collection('priority_fee').find().sort({ timestamp: -1 }).limit(7200).toArray();
    const priorityFee = priorityFeeData.map((data) => ({
      time: new Date(data.timestamp).toLocaleTimeString(),
      block: Number(data.blockNumber),
      priorityFee: Number(Web3.utils.fromWei(data.priorityFeePerGas || '0', 'gwei')), // Convert to Gwei
    }));

    res.status(200).json({  priorityFee});
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).json({ message: 'Failed to fetch data' });
  } finally {
    await client.close();
  }
}