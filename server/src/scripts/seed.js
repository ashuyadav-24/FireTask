const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const GroupOrder = require('../models/GroupOrder');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hostelcart';

const seedDatabase = async () => {
  try {
    console.log(`[HostelCart Seeder] Connecting to MongoDB: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);
    console.log('[HostelCart Seeder] Connected successfully.');

    // Clear old data
    await User.deleteMany({});
    await GroupOrder.deleteMany({});
    console.log('[HostelCart Seeder] Cleaned existing collections.');

    // Create demonstration users
    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash('password123', salt);

    const usersData = [
      {
        name: 'Aman Kumar',
        email: 'aman.kumar@nitjsr.ac.in',
        password: defaultPasswordHash,
        college: 'NIT Jamshedpur',
        hostel: 'Hostel K',
        block: 'Block E',
        room: 'E601',
        degreeYear: 'B.Tech 4th Year',
        phone: '9876543210'
      },
      {
        name: 'Kunal Sharma',
        email: 'kunal.sharma@nitjsr.ac.in',
        password: defaultPasswordHash,
        college: 'NIT Jamshedpur',
        hostel: 'Hostel K',
        block: 'Block B',
        room: 'B412',
        degreeYear: 'B.Tech 4th Year',
        phone: '9876543211'
      },
      {
        name: 'Rishabh Yadav',
        email: 'rishabh.yadav@nitjsr.ac.in',
        password: defaultPasswordHash,
        college: 'NIT Jamshedpur',
        hostel: 'Hostel K',
        block: 'Block C',
        room: 'C305',
        degreeYear: 'B.Tech 4th Year',
        phone: '9876543212'
      },
      {
        name: 'Siddharth',
        email: 'siddharth@nitjsr.ac.in',
        password: defaultPasswordHash,
        college: 'NIT Jamshedpur',
        hostel: 'Hostel J',
        block: 'Block C',
        room: 'C204',
        degreeYear: 'B.Tech 3rd Year',
        phone: '9876543213'
      },
      {
        name: 'Ashutosh Yadav',
        email: 'ashutosh.yadav@nitjsr.ac.in',
        password: defaultPasswordHash,
        college: 'NIT Jamshedpur',
        hostel: 'Hostel J',
        block: 'Block D',
        room: 'D305',
        degreeYear: 'MCA 2nd Year',
        phone: '9876543214'
      },
      {
        name: 'Priyaranjan',
        email: 'priyaranjan@nitjsr.ac.in',
        password: defaultPasswordHash,
        college: 'NIT Jamshedpur',
        hostel: 'Hostel L',
        block: 'Block C',
        room: 'C302',
        degreeYear: 'M.Tech 1st Year',
        phone: '9876543215'
      }
    ];

    const users = await User.insertMany(usersData);
    console.log(`[HostelCart Seeder] Seeded ${users.length} demonstration students.`);

    const userMap = {};
    users.forEach((u) => {
      userMap[u.email] = u;
    });

    // Create Demonstration Orders
    const now = new Date();
    const in45Mins = new Date(now.getTime() + 45 * 60 * 1000);
    const in25Mins = new Date(now.getTime() + 25 * 60 * 1000);
    const in15Mins = new Date(now.getTime() + 15 * 60 * 1000);

    // 1. OPEN Order: Aman Kumar (Hostel K, Flipkart Minutes)
    const order1 = new GroupOrder({
      orderCode: 'HC-FM-4821',
      creator: userMap['aman.kumar@nitjsr.ac.in']._id,
      platform: 'Flipkart Minutes',
      hostel: 'Hostel K',
      block: 'Block E',
      deliverySpot: 'Hostel K Central Security Gate',
      items: [
        { name: 'Amul Toned Milk (500ml)', quantity: 1, price: 28, note: 'Cold packet preferred' },
        { name: 'Nescafe Classic Sachet (50g)', quantity: 1, price: 45, note: 'Late night study' }
      ],
      targetAmount: 199,
      joiningDeadline: in45Mins,
      instructions: 'Ordering via Flipkart Minutes around 11:45 PM. Drop your items to hit free delivery! Pick up at Hostel K Gate.',
      status: 'OPEN',
      participants: [
        {
          user: userMap['kunal.sharma@nitjsr.ac.in']._id,
          items: [{ name: 'Farm Fresh Eggs (6 pack)', quantity: 1, price: 48, note: 'White eggs' }],
          contributionAmount: 48,
          joinedAt: new Date(now.getTime() - 10 * 60 * 1000)
        }
      ]
    });
    await order1.save();

    // 2. TARGET_REACHED Order: Ashutosh Yadav (Hostel J, Blinkit)
    const order2 = new GroupOrder({
      orderCode: 'HC-BK-7210',
      creator: userMap['ashutosh.yadav@nitjsr.ac.in']._id,
      platform: 'Blinkit',
      hostel: 'Hostel J',
      block: 'Block D',
      deliverySpot: 'Hostel J Central Gate',
      items: [
        { name: 'Amul Masti Dahi (400g)', quantity: 1, price: 35, note: '' },
        { name: 'Brown Bread 400g', quantity: 1, price: 45, note: 'Harvest Gold' }
      ],
      targetAmount: 199,
      joiningDeadline: in25Mins,
      instructions: 'Quick Blinkit pooled cart for Hostel J residents. Target already met! Finalizing soon.',
      status: 'OPEN', // Pre-save hook will promote to TARGET_REACHED
      participants: [
        {
          user: userMap['siddharth@nitjsr.ac.in']._id,
          items: [
            { name: 'Maggi 2-Minute Noodles', quantity: 4, price: 14, note: 'Special masala' },
            { name: 'Amul Butter 100g', quantity: 1, price: 58, note: '' }
          ],
          contributionAmount: 114,
          joinedAt: new Date(now.getTime() - 15 * 60 * 1000)
        },
        {
          user: userMap['rishabh.yadav@nitjsr.ac.in']._id,
          items: [{ name: 'Good Knight Flash Refill', quantity: 1, price: 85, note: 'Mosquito repellent' }],
          contributionAmount: 85,
          joinedAt: new Date(now.getTime() - 5 * 60 * 1000)
        }
      ]
    });
    await order2.save();

    // 3. FINALIZED Order: Priyaranjan (Hostel L, Swiggy Instamart)
    const order3 = new GroupOrder({
      orderCode: 'HC-SI-9102',
      creator: userMap['priyaranjan@nitjsr.ac.in']._id,
      platform: 'Swiggy Instamart',
      hostel: 'Hostel L',
      block: 'Block C',
      deliverySpot: 'Hostel L Central Gate',
      items: [
        { name: 'Quaker Rolled Oats 500g', quantity: 1, price: 95, note: '' },
        { name: 'Peanut Butter Creamy 350g', quantity: 1, price: 140, note: '' }
      ],
      targetAmount: 199,
      joiningDeadline: in15Mins,
      instructions: 'Order is finalized and placed on Instamart! Rider arriving in 12 minutes at Hostel L gate.',
      status: 'FINALIZED',
      participants: []
    });
    await order3.save();

    console.log('[HostelCart Seeder] Seeded 3 demonstration group orders.');
    console.log('\n================ DEMONSTRATION ACCOUNTS ================');
    console.log('1. Aman Kumar     (B.Tech 4th Yr, Hostel K): aman.kumar@nitjsr.ac.in     / password123');
    console.log('2. Ashutosh Yadav (MCA 2nd Yr, Hostel J):    ashutosh.yadav@nitjsr.ac.in / password123');
    console.log('3. Priyaranjan    (M.Tech 1st Yr, Hostel L): priyaranjan@nitjsr.ac.in    / password123');
    console.log('4. Siddharth      (B.Tech 3rd Yr, Hostel J): siddharth@nitjsr.ac.in      / password123');
    console.log('========================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('[HostelCart Seeder] Error seeding database:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
