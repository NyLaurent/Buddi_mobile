# 💳 Payment Services

Payment processing, financial transactions, and billing services for the Pickup Buddi app.

## 📁 Structure

```
payments/
├── StripeService.ts          # Stripe payment integration
├── PaymentValidation.ts      # Payment validation & security
├── WalletService.ts          # Digital wallet management
└── index.ts                  # Payment service exports
```

## 🎯 Services

### **StripeService**

- Credit/debit card processing
- Payment method management
- Subscription billing
- Refund processing
- Webhook handling

### **PaymentValidation**

- Card validation (Luhn algorithm)
- CVV and expiry validation
- Amount validation
- Security checks and fraud prevention

### **WalletService**

- Digital wallet balance management
- In-app credit system
- Transaction history
- Buddi earnings tracking

## 📦 Dependencies

```bash
npm install @stripe/stripe-react-native
npm install stripe  # For server-side operations
npm install react-native-encrypted-storage  # For secure payment data
```

## 🚀 Usage

```typescript
import {
  StripeService,
  PaymentValidation,
  WalletService,
} from "@/services/payments";

// Initialize Stripe
await StripeService.initialize("pk_test_your_publishable_key");

// Process a payment
const paymentResult = await StripeService.processPayment({
  amount: 2500, // $25.00 in cents
  currency: "usd",
  description: "Weekly pickup service - Emma Johnson",
  customerId: "parent-123",
});

// Validate payment method
const isValid = PaymentValidation.validateCardNumber("4242424242424242");

// Add funds to wallet
await WalletService.addFunds("parent-123", 5000); // $50.00

// Pay buddy earnings
await WalletService.payBuddyEarnings("buddy-456", 1500); // $15.00
```

## 💰 Payment Flow

### **For Parents:**

1. Add payment method (card/bank account)
2. Set up automatic billing or prepaid credits
3. Weekly/monthly charges for pickup services
4. View transaction history and receipts

### **For Buddies:**

1. Receive earnings for completed pickups
2. Weekly/bi-weekly payouts
3. Track earnings and tips
4. Tax documentation (1099s)

### **For Admin:**

1. Monitor all transactions
2. Handle disputes and refunds
3. Generate financial reports
4. Manage platform fees

## 🔐 Security Features

- **PCI DSS Compliance** through Stripe
- **Encrypted storage** for payment methods
- **Tokenization** of sensitive data
- **3D Secure** authentication
- **Fraud detection** and prevention
- **Secure webhooks** for real-time updates

## 📊 Pricing Structure

```typescript
// Example pricing configuration
const PRICING = {
  PICKUP_BASE_RATE: 500, // $5.00 per pickup
  PLATFORM_FEE: 0.15, // 15% platform fee
  PAYMENT_PROCESSING: 0.029, // 2.9% + 30¢ processing fee
  BUDDY_RATE: 0.85, // 85% goes to buddy
  TIP_PASSTHROUGH: 1.0, // 100% of tips go to buddy
};
```

## 🧾 Transaction Types

- **Pickup Payments** - Parent to platform
- **Buddy Payouts** - Platform to buddy
- **Tips** - Parent to buddy (direct passthrough)
- **Refunds** - Platform to parent
- **Subscription Fees** - Parent to platform (premium features)
- **Late Fees** - Parent to platform (if applicable)
