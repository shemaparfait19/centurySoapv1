# Stock Tracking - Visual Guide

## 🎯 The Simple Rule

```
STOCK = NUMBER OF PHYSICAL ITEMS YOU CAN COUNT
```

---

## 📦 What You See in Your Warehouse

```
Shelf A: Century Liquid Soap 5L
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│ 5L  │ │ 5L  │ │ 5L  │ │ 5L  │ │ 5L  │  ← 5 jerry cans
│SOAP │ │SOAP │ │SOAP │ │SOAP │ │SOAP │
└─────┘ └─────┘ └─────┘ └─────┘ └─────┘

System Stock: 5 jerry cans ✅
NOT: 25 liters ❌
```

---

## 💰 How Sales Work

### Before Sale:
```
Warehouse:
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│ 5L  │ │ 5L  │ │ 5L  │ │ 5L  │ │ 5L  │
└─────┘ └─────┘ └─────┘ └─────┘ └─────┘

Stock: 5 jerry cans
```

### Customer Buys 2 Jerry Cans:
```
Sold to Customer:          Remaining in Warehouse:
┌─────┐ ┌─────┐           ┌─────┐ ┌─────┐ ┌─────┐
│ 5L  │ │ 5L  │           │ 5L  │ │ 5L  │ │ 5L  │
└─────┘ └─────┘           └─────┘ └─────┘ └─────┘

System deducts: -2         New Stock: 3 jerry cans
```

---

## 📊 Product Types

### 1. Jerry Cans (5L, 20L)
```
┌──────────┐
│   20L    │  ← One unit = 1 jerry can
│  LIQUID  │     Stock = count of cans
│   SOAP   │
└──────────┘
```

### 2. Bottles (500ml, 1L)
```
 ╱╲
│  │  ← One unit = 1 bottle
│  │     Stock = count of bottles
│  │
╰──╯
```

### 3. Boxes
```
┌─────────────────────┐
│  BOX OF 4           │  ← One unit = 1 box
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐│     Stock = count of boxes
│  │5L│ │5L│ │5L│ │5L││     (NOT individual items inside)
│  └──┘ └──┘ └──┘ └──┘│
└─────────────────────┘
```

---

## 🔢 Counting Examples

### Example 1: Physical Count
```
Your warehouse shelf:

Row 1: ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
       │ 5L  │ │ 5L  │ │ 5L  │ │ 5L  │ │ 5L  │
       └─────┘ └─────┘ └─────┘ └─────┘ └─────┘

Row 2: ┌─────┐ ┌─────┐ ┌─────┐
       │ 5L  │ │ 5L  │ │ 5L  │
       └─────┘ └─────┘ └─────┘

Count: 1, 2, 3, 4, 5, 6, 7, 8
Enter in system: Stock = 8
```

### Example 2: Receiving Delivery
```
Before:
┌─────┐ ┌─────┐ ┌─────┐
│ 5L  │ │ 5L  │ │ 5L  │  = 3 cans
└─────┘ └─────┘ └─────┘

Delivery arrives:
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│ 5L  │ │ 5L  │ │ 5L  │ │ 5L  │ │ 5L  │  = +5 cans
└─────┘ └─────┘ └─────┘ └─────┘ └─────┘

After:
All cans together = 8 cans
Update system: Stock = 8
```

---

## 💵 Pricing Per Unit

### 5L Jerry Can
```
┌─────────────┐
│    5L       │  Regular Client: 2,000 RWF per can
│   LIQUID    │  Random Client:  2,500 RWF per can
│    SOAP     │
└─────────────┘  Price is PER CAN, not per liter!
```

### Sale Example:
```
Hotel buys 10 cans:
┌─────┐ × 10 = 10 cans × 2,000 RWF = 20,000 RWF
│ 5L  │
└─────┘

Walk-in buys 10 cans:
┌─────┐ × 10 = 10 cans × 2,500 RWF = 25,000 RWF
│ 5L  │
└─────┘
```

---

## 📋 Daily Operations

### Morning Stock Check:
```
Product: 5L Liquid Soap
Physical Count: 
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│ 5L  │ │ 5L  │ │ 5L  │ │ 5L  │ │ 5L  │
└─────┘ └─────┘ └─────┘ └─────┘ └─────┘
... (continue counting) ...

Total: 47 cans
System shows: 47 cans ✅ Match!
```

### Recording a Sale:
```
1. Customer: Hotel Mille Collines (Regular)
2. Product: 5L Liquid Soap
3. Quantity: 3 cans
4. Price: 2,000 RWF × 3 = 6,000 RWF
5. Stock: 47 → 44 cans (automatic deduction)
```

### End of Day:
```
Sales Today:
- Sold 3 cans to Hotel
- Sold 5 cans to Walk-in
- Sold 2 cans to Restaurant
Total: 10 cans sold

Stock Movement:
Start: 47 cans
Sold: -10 cans
End: 37 cans ✅
```

---

## 🎯 Key Reminders

### ✅ CORRECT Way:
```
"I have 37 jerry cans of 5L soap"
"I sold 10 jerry cans today"
"I need to restock when below 20 cans"
```

### ❌ WRONG Way:
```
"I have 185 liters of soap"
"I sold 50 liters today"
"I need to restock when below 100 liters"
```

---

## 🏪 Real-World Scenario

### Your Store Today:

```
CENTURY LIQUID SOAP SECTION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5L Jerry Cans:
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│ 5L  │ │ 5L  │ │ 5L  │ │ 5L  │ │ 5L  │
└─────┘ └─────┘ └─────┘ └─────┘ └─────┘
... (37 total)
System: Stock = 37 cans

20L Jerry Cans:
┌──────────┐ ┌──────────┐ ┌──────────┐
│   20L    │ │   20L    │ │   20L    │
└──────────┘ └──────────┘ └──────────┘
... (22 total)
System: Stock = 22 cans

Boxes of 4:
┌─────────────┐ ┌─────────────┐
│ BOX OF 4    │ │ BOX OF 4    │
└─────────────┘ └─────────────┘
... (17 total)
System: Stock = 17 boxes
```

### Customer Orders:
```
Order 1: Hotel needs 5 cans of 5L
→ Take 5 cans from shelf
→ System: 37 → 32 cans

Order 2: Restaurant needs 2 cans of 20L
→ Take 2 cans from shelf
→ System: 22 → 20 cans

Order 3: Business needs 1 box
→ Take 1 box from shelf
→ System: 17 → 16 boxes
```

---

## 🎓 Summary

**Remember:**
- Count what you see
- Track what you touch
- Sell what you have
- Simple as that!

**The "5L" or "20L" is just the product name/label.**
**You manage UNITS (cans, bottles, boxes).**
