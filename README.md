# BillRewards

## Inspiration

As MSCS students at Boston, we quickly realized how juggling classes and grocery runs leaves little time and money to spare. After bouncing between Walmart for groceries, Starbucks for coffee, and countless other stores, we saw a pattern where each merchant offered separate loyalty programs that never really added up to anything substantial. Rather than watch these **scattered rewards go to waste**, we envisioned a single platform where every purchase matters and every bill can generate tangible value. That inspired **BillRewards: a blockchain-based, universal loyalty solution that turns ordinary receipts into an extraordinary rewards experience**.

## What it does

**BillRewards** makes every purchase count. Here’s how:

- **Receipt Upload:** You snap a photo or upload a digital copy of any purchase receipt from partner merchants.
- **Verification:** Our system verifies your receipt with the merchant to ensure accuracy and authenticity.
- **Blockchain Rewards:** Once verified, you earn crypto tokens. The earlier the bill date and the higher the bill amount, the more tokens you receive.
- **Redemption & Engagement:** You can redeem those tokens for gift cards, coupons, or stake them in fun mini-games within our app, creating a gamified experience that keeps you coming back.

## How we built it

- **Frontend:** Built using **React.js** for a responsive and interactive user interface.
- **Backend:** Developed using **Node.js/Express** to handle user accounts, database interactions, and API endpoints.
- **Blockchain Integration:** Leveraged **smart contracts** to securely issue and track reward tokens.
- **OCR Verification:** Implemented **Tesseract.js** for Optical Character Recognition (OCR) to automatically verify receipts and minimize fraud.
- **Gamification:** Integrated engaging mini-games within the app to encourage users to use their tokens creatively.

## Challenges we ran into

- **Data Accuracy:** Ensuring OCR accurately captures crucial details like total amount, date, and merchant name.
- **Scalability:** Designing the system to handle a large number of receipts, especially during peak shopping seasons.
- **User Engagement:** Finding the right balance between simplicity for new users and gamification for returning users.

## Accomplishments that we're proud of

- **Universal Appeal:** Created a loyalty solution that benefits students, professionals, and families alike.
- **Seamless Blockchain Adoption:** Integrated decentralized reward tracking without overcomplicating the user experience.
- **Engaged Community:** Users are excited about staking mini-games and actively share feedback to drive further innovation.

## What we learned

- **User Experience First:** Even the best technology won’t succeed if the user journey is clunky.
- **Negotiating with Merchants:** Different retailers have unique policies for data sharing and rewards.
- **Scalable Architecture:** Planning for high-volume blockchain transactions and receipt uploads from day one.
- **Community-Driven Growth:** A passionate user base is key to guiding product improvements and boosting adoption.

## What's next for BillRewards

- **Expanded Partnerships:** Onboard more retailers, local businesses, and online merchants to make BillRewards the go-to rewards platform.
- **Enhanced Gamification:** Introduce leaderboards, daily challenges, and social-sharing features.
- **Referral Program:** Reward users for bringing friends onboard.
- **Academic Collaborations:** Partner with student organizations and universities for exclusive campus deals.
- **Data Insights for Merchants:** Offer advanced analytics dashboards to help businesses optimize campaigns.

## Running the App Locally

To set up and run **BillRewards** locally, follow these steps:

1. Open two terminal windows:
   - **Client-side setup:**
     ```sh
     cd client
     npm install --legacy-peer-deps
     npm install tesseract.js --legacy-peer-deps
     npm run dev
     ```
   - **Server-side setup:**
     ```sh
     cd server
     npm install --legacy-peer-deps
     npm run dev
     ```

Now, your app should be up and running locally! 🚀

