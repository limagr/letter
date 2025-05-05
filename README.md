# Digital Letter Service

A web application that simulates real-world mail delivery by calculating travel time based on actual distances between locations.

## Features

- Write and send digital letters with real-time delivery simulation
- Track letters in transit with a visual animation
- Letters are "delivered" based on real-world travel times between locations
- Clean, responsive UI built with Tailwind CSS

## Tech Stack

- Next.js (Pages Router)
- TypeScript
- Tailwind CSS
- Mocked Distance Calculation (no API key required)

## Getting Started

### Prerequisites

- Node.js and npm installed

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd letter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. Users provide sender and recipient details, along with origin and destination addresses
2. The app calculates the travel duration using a mocked distance calculation algorithm
3. Letters are stored locally with a "transit" status
4. A timer simulates the delivery time based on the calculated duration
5. When the timer completes, the letter status changes to "delivered"

## Folder Structure

- `/pages` - Next.js page components
- `/components` - Reusable UI components
- `/lib` - Utility functions and API integration
- `/types` - TypeScript type definitions
- `/styles` - Global CSS and styling

## Distance Calculation

The application uses a mocked distance calculation algorithm that simulates travel times between locations. The algorithm takes into account:

- Length of address strings to approximate distance
- International vs. domestic delivery detection
- Random variation to make each delivery unique
- Appropriate scaling for realistic delivery times

No external API is required, making the application fully self-contained.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
