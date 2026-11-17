# HostelCart – Fieldwork & Empirical Observation

## 1. Fieldwork Overview
- **Location:** Central Security Gate, Hostel K, and connecting walkways between Hostel J and Hostel L, National Institute of Technology Jamshedpur (NIT JSR).
- **Date & Window:** 16-Nov-2026 to 17-Nov-2026, 11:15 PM – 11:45 PM (30 minutes direct observational fieldwork).
- **Hostel Demographics Observed:**
  - **Hostel K:** Housing B.Tech 4th Year and MCA 3rd Year (Final Year) residents.
  - **Hostel J:** Housing B.Tech 3rd Year and MCA 2nd Year residents.
  - **Hostel L:** Housing M.Tech 1st Year residents.
- **Physical Environment:** Outside local shops in Adityapur close by 9:30–10:00 PM, and on-campus food kiosks are closed. The only source of late-night groceries and snacks is quick-commerce (Blinkit, Flipkart Minutes, and Swiggy Instamart).
- **Delivery Flow:** Delivery riders arrive on two-wheelers and stop at the central security gate of each hostel. Students walk down from their respective blocks (Blocks A through E) to meet the rider at the gate.

---

## 2. Fieldwork Photographic Evidence & Scene Logs
- **Photo 1: Delivery Gate Log (`assets/fieldwork_gate_orders.jpg`)**
  - *Timestamp:* 16-Nov-2026, 11:22 PM IST
  - *Description:* Shows two quick-commerce delivery riders (one Flipkart Minutes, one Blinkit) parked simultaneously at the central gate of Hostel K, waiting for two separate students from Blocks B and E to walk down and collect individual small packets.
- **Photo 2: Order Receipts & Micro-Cart Evidence (`assets/fieldwork_receipts.jpg`)**
  - *Timestamp:* 16-Nov-2026, 11:38 PM IST
  - *Description:* Digital checkout summary on a student's phone displaying a base cart of ₹28 (Amul Milk) bearing an extra ₹65 in delivery, small-cart, handling, and night surge charges.

---

## 3. In-Person Interview

- **Interviewee:** Aman Kumar
- **Academic Standing:** 4th Year B.Tech, Computer Science and Engineering
- **Residence:** Hostel K, Block E, Room E601
- **Role:** Senior hostel resident, daily quick-commerce consumer

### Three Things Aman Said:
1. *"After 10:30 PM, everything outside the campus in Adityapur is locked up. When I am up late doing placement coding or project work, I often just need a ₹28 packet of milk or eggs. But paying ₹65 in total delivery and small-cart fees for a ₹28 item is completely frustrating."*
2. *"Whenever I try to avoid the ₹45 delivery fee on Flipkart Minutes or Blinkit, I scroll through the catalog and end up adding ₹150–₹180 worth of cold drinks, chocolates, or chips that I never planned to buy. I convince myself I 'saved' on delivery, but in reality, I just burned extra money from my monthly budget on unhealthy junk food."*
3. *"Every single night, 4 or 5 delivery agents from Blinkit and Flipkart Minutes stand at the Hostel K gate at the exact same time handing packages to different guys in my block, but we have zero way to know who is ordering."*

### One Surprising Finding:
Aman revealed that students in Hostel K had actually created an informal WhatsApp group called *"Hostel K Late Night Orders"* a few months ago, but it completely died within two weeks. 

**Why it failed:** Quick-commerce orders happen spontaneously within a tight 5 to 15-minute window. In WhatsApp, by the time someone reads a message asking *"Anyone ordering from Blinkit?"*, the original sender had already placed their order, or the message was buried under 50 banter messages. Aman emphasized:
> *"Nobody wants to chat back and forth about an order. We need an app with a countdown timer where you can click 'Join', pick your items, and the cart total updates automatically."*

---

## 4. Methodology & Data Collection Note

Data was recorded across 22 distinct order transactions observed and surveyed across **Hostel K, Hostel J, and Hostel L** during late-night hours:
- **Group 1 (10 Entries):** B.Tech 4th Year students in Hostel K and B.Tech 3rd Year students in Hostel J who chose the **`PAID_CHARGES`** strategy. These students accepted steep delivery, small-cart, and handling fees because they strictly needed 1 or 2 urgent items.
- **Group 2 (12 Entries):** MCA 2nd Year students in Hostel J and M.Tech 1st Year students in Hostel L who chose the **`ADDED_UNNECESSARY_ITEMS`** strategy. These students inflated their carts by ₹135 to ₹240 with sodas, chips, and sweets purely to cross the ₹199–₹249 free delivery threshold.

---

## 5. Quantitative Data Analysis

From the 22 recorded transactions in `data.csv`:

```
================================================================================
TOTAL TRANSACTIONS ANALYZED:                               22
--------------------------------------------------------------------------------
Genuine Base Grocery Need (All 22 Students):               ₹1,459
Average Base Need Per Student:                             ₹66.31

STRATEGY A: PAID EXTRA CHARGES (10 B.Tech Students)
- Base Cart Value Needed:                                  ₹635
- Extra Fees Paid (Delivery + Small Cart + Surge + Fee):   ₹557
- Average Fee Overhead Penalty:                            +87.6%

STRATEGY B: FORCED CART STUFFING (12 MCA & M.Tech Students)
- Base Cart Value Needed:                                  ₹824
- Extra Spent on Unwanted Junk Items:                      ₹2,060
- Actual Total Spent at Checkout:                          ₹2,944
- Average Unneeded Cash Outflow Per Student:               ₹171.67
--------------------------------------------------------------------------------
TOTAL PREVENTABLE FINANCIAL LOSS IN ONE NIGHT:             ₹2,617
================================================================================
```

### The In-Hostel Synergy Finding:
In **Hostel J**, where B.Tech 3rd Year and MCA 2nd Year students reside in adjacent blocks:
- **ORD_006 (Siddharth, B.Tech 3rd Yr, Block C)** paid ₹70 in delivery/small-cart fees for ₹28 Maggi noodles at 11:10 PM.
- **ORD_011 (Ashutosh Yadav, MCA 2nd Yr, Block D)** spent ₹195 on unneeded snacks to avoid charges for a ₹35 curd cup at 11:18 PM on Flipkart Minutes.

Had Siddharth and Ashutosh pooled their orders through **HostelCart**:
- Combined needed cart = ₹28 + ₹35 = ₹63. Adding one more neighbor would cross the ₹199 threshold.
- Even pooling two orders splits delivery in half; pooling three eliminates all small-cart and delivery fees.
- Both students pick up at the exact same Hostel J central gate!
