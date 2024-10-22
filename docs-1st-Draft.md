# Allo Yeeter - Low-Fidelity Solution (Lo-So) 1st Draft Documentation - Q4 2024

## 1. Fundamental Principles

The **Allo Yeeter Lo-So** (Low-Fidelity Solution) is built on key guiding principles that shape its design, functionality, and user interaction. These principles ensure that the system remains aligned with the core goals of **simplicity**, **community governance**, **transparency**, and **scalability**.

### 1.1. Simplicity & Accessibility
- **Principle**: The primary goal of Allo Yeeter Lo-So is to create a solution that is **easy to use** and accessible for all users, regardless of their technical expertise.
  
- **How It’s Applied**:
   - The Lo-So interface features a **minimalist design** using **NextJS**, **React**, and **Tailwind CSS**, providing a **clean and simple** user experience.
   - Actions are streamlined: users need to **set the amount**, **enter wallet addresses**, **set weights**, **review the Yeet**, and finally, **execute the Yeet**. This ensures a clear and easy-to-understand process.
   - The Yeeter contract is kept simple to ensure **quick deployment** and **immediate feedback**, focusing on core functionality without unnecessary complexity.

### 1.2. Community-Driven Decision Making
- **Principle**: A fundamental pillar of the Allo Yeeter project is that **resource allocation decisions** should be driven by the **community**.
  
- **How It’s Applied**:
   - Communities using Allo Yeeter will be able to **distribute funds** based on the **weights they choose**, whether it's using a **quadratic weight**, **time-based weight**, or other methods that suit their preferences.

### 1.3. Transparency and Trust
- **Principle**: Transparency is essential for creating **trust** within the system. Every action should be fully traceable and visible to the community.
  
- **How It’s Applied**:
   - All transactions (i.e., token distributions or Yeets) are recorded on the blockchain, ensuring that the entire process is **transparent** and accessible.
   - **Identity Verification Integrations**: Allo Yeeter can integrate with **identity protocols** like **Passport.xyz** or implement a **KYC process** to limit or increase Yeet amounts:
     - **Lower limits** for users without verification.
     - **Higher limits** for verified users, ensuring larger Yeets are conducted securely.

### 1.4. Iterative Development and Feedback
- **Principle**: The project is committed to **continuous improvement** through iterative development.
  
- **How It’s Applied**:
   - The **Lo-So phase** focuses on a simple prototype, allowing quick feedback from the community.
   - This feedback will guide the development of the **Hi-So phase**, where advanced features will be introduced.

### 1.5. Scalability and Adaptability
- **Principle**: The simplicity of Allo Yeeter makes it **easy to scale**, allowing for broader community participation and expanded functionality as the platform grows.
  
- **How It’s Applied**:
   - The Lo-So version is built on a **modular architecture** that allows for easy **integrations** with Gitcoin or other projects. 
   - The design allows the solution to evolve with additional features and UI enhancements as the **user base grows**.

---

## 2. User Experience (UX) Overview

In the **Lo-So phase**, the user experience (UX) focuses on delivering a **streamlined interface** that prioritizes **ease of use**.

### 2.1. Key Design Goals
- **Simplicity**: The interface is kept **minimalist** to reduce complexity.
- **Clarity**: Every step follows a **logical flow**, ensuring users understand each task.
- **Speed**: The lightweight design ensures **fast load times**.

### 2.2. Primary User Flow
The primary user flow for the **Lo-So version** of Allo Yeeter involves executing a **Yeet** (token allocation) through **three separate transactions**: **deploying the Yeeter strategy**, **deploying the pool**, and **allocating/Yeeting funds**. The UI must make this multi-step process intuitive and simple for users.

1. **Set the Amount**: Users begin by setting the **total amount** of tokens that will be allocated.
2. **Enter Wallet Addresses**: Users input the **wallet addresses** of recipients.
3. **Set Weights**: Users define the **proportional weights** for each recipient.
4. **Deploy Yeeter Strategy**: The first transaction **deploys the strategy contract**, which defines how the funds will be allocated.
5. **Deploy Pool**: The second transaction deploys the **pool**, which will hold the tokens for distribution.
6. **Review Your Yeet**: Users review all inputs (addresses, amounts, weights) before proceeding.
7. **Allocate/Yeet Funds**: The final transaction executes the **Yeet**, distributing the tokens from the pool based on the defined weights.
8. **Confirmation**: Users receive confirmation once all three transactions are completed successfully.

### 2.3. Visual and Interactive Elements
- **Input Fields**: Clear, minimal fields for wallet addresses, token amounts, and weights.
- **Progress Indicators**: A step-by-step progress bar guides users through the three transaction stages.
- **Confirmation Modals**: Ensure users understand each step before completing transactions.

### 2.4. Desktop Focus
- For the **Lo-So prototype**, the focus is on providing a smooth **desktop experience**. While **mobile accessibility** won’t be prioritized in the Lo-So phase, there is potential for a **native mobile app** in the future Hi-So phase.

### 2.5. Future Improvements for Hi-So
- **Auto-Calculation for Weights**: Automatic recalculation of weights as users adjust them, ensuring proportional distribution.
- **Shared Yeets**: Allow users to collaborate on token distributions.
- **Yeet History**: Users will be able to view their past Yeets for transparency.
- **Native Mobile App**: A dedicated mobile app will be developed in Hi-So.
- **Improved UI**: Enhanced design based on Lo-So feedback.

---

## 3. Technical Overview

The **Lo-So version** of Allo Yeeter has been designed with a **simple yet functional architecture** to enable quick deployment, community feedback, and iteration.

### 3.1. Tech Stack
The technology stack for **Allo Yeeter Lo-So** has been selected to prioritize **speed**, **simplicity**, and **responsiveness**.

- **Frontend**: Built using **NextJS**, **React**, and **Tailwind CSS** to create a responsive, single-page application (SPA).
- **Backend & Smart Contract**: 
   - **ERC20-based smart contract** that handles the core functionality of **token distribution**.
   - The smart contract processes token distribution in three transactions: **Deploy Yeeter Strategy**, **Deploy Pool**, and **Allocate/Yeet Funds**.

> **[Julian, Afo, or Lawal should fill in this section with more detailed information about the smart contract structure, coding approaches, and key backend elements.]**

### 3.2. Core Functionality

The primary function of **Allo Yeeter Lo-So** involves executing a Yeet through **three transactions**:

1. **Deploy Yeeter Strategy**: The first transaction deploys the **strategy contract** that governs how the funds will be allocated among recipients.
2. **Deploy Pool**: The second transaction creates the **pool** that holds the tokens for distribution.
3. **Allocate/Yeet Funds**: The final transaction allocates and distributes the funds based on user-defined weights.

This sequence ensures that the smart contract system has the necessary infrastructure before executing the token distribution.

> **[Julian, Afo, or Lawal should provide further technical details on the core functionality and flow of the Yeet execution in the smart contract here.]**

### 3.3. Security Considerations
- **Transaction Integrity**: The **Lo-So version** ensures that all transactions are processed securely and accurately, leveraging **on-chain calculations** for distributing tokens. 
- **Smart Contract Audits**: Although the Lo-So version is a minimal prototype, the smart contracts should be **audited** before deployment to the main network to ensure that there are no vulnerabilities or risks in the system.

---

### 3.4. Future Enhancements for Hi-So

In the **Hi-So phase**, several enhancements will be introduced to improve the technical capabilities of Allo Yeeter and expand its functionality:

- **Advanced Integrations**: Integrations with **Gitcoin tools** and other decentralized platforms.
- **Auto-Calculation for Weights**: In Hi-So, the system will automatically recalculate the weights as users modify them.
- **Token and Platform Flexibility**: Future iterations could allow users to **choose different tokens** for distribution or integrate with platforms beyond Ethereum.
- **Security Improvements**: Enhanced **multi-signature transactions** for higher-value Yeets and **identity verification** processes (e.g., integration with **Passport.xyz** and **KYC**) for larger transactions.

---

## 4. Use Cases for Allo Yeeter Lo-So

### 4.1. Grant Distribution
- **Scenario**: A community project distributes grant funds to contributors based on contributions.
- **How Allo Yeeter Works**: Enter wallet addresses, set weights based on contributions, and execute the Yeet.

### 4.2. Hackathon Prize Allocation
- **Scenario**: Distribute prize funds to top hackathon teams.
- **How Allo Yeeter Works**: Enter wallet addresses of winners, assign weights based on rankings, and execute the Yeet.

### 4.3. DAO Funding Distribution
- **Scenario**: A DAO distributes funds to projects based on voting.
- **How Allo Yeeter Works**: Set wallet addresses and weights based on votes, then execute the Yeet.

### 4.4. Micro-Scholarship Distribution
- **Scenario**: Distribute micro-scholarships based on student performance.
- **How Allo Yeeter Works**: Set wallet addresses and weights based on performance, then execute the Yeet.

---

## Conclusion

The **Lo-So version** of Allo Yeeter is designed to be **flexible** and **adaptable** across various use cases, ensuring **fair and efficient** token distribution in decentralized environments. The feedback from this phase will guide the development of the **Hi-So phase**, which will introduce advanced features and improvements.

---

## Next Steps

- **Finalize the Lo-So Phase**: Use the Lo-So prototype to gather feedback.
- **Plan for Hi-So**: Develop the Hi-So phase with auto-calculation for weights, a native app, and improved integrations.
