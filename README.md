# Hospital Management System

A comprehensive hospital management system built with React and TypeScript. This application provides a user-friendly interface for managing various aspects of hospital operations including patient records, staff management, billing, and medical services.

## Features

- **Patient Management**: Add, view, and manage patient records
- **Staff Management**: Manage doctors, nurses, and other hospital staff
- **Medical Services**: Access to doctor and nurse services
- **Pharmacy Management**: Medicine inventory and prescription management
- **Billing System**: Handle patient billing and payments
- **Dashboard**: Overview of hospital statistics and key metrics
- **Authentication**: Secure login system with protected routes
- **Notifications**: Toast notifications for important updates

## Technology Stack

- **Frontend**: React 19.2.4 with TypeScript
- **Routing**: React Router DOM 7.13.0
- **UI Components**: Tabler Core 1.4.0
- **Charts**: Recharts 3.7.0
- **Development**: Create React App 5.0.1

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hospital-system.git
   ```

2. Navigate to the project directory:
   ```bash
   cd hospital-system
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Project Structure

```
hospital-system/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable UI components
│   ├── context/     # React contexts for state management
│   ├── data/        # Sample data
│   ├── pages/       # Application pages
│   ├── utils/       # Utility functions
│   ├── App.tsx      # Main application component
│   └── index.tsx    # Entry point
└── README.md        # Project documentation
```

## Usage

1. **Login**: Access the system using your credentials
2. **Dashboard**: View hospital statistics and key metrics
3. **Patients**: Manage patient records and information
4. **Staff**: Manage doctors, nurses, and other staff members
5. **Doctor/Nurse Services**: Access medical services
6. **Pharmacy**: Manage medicines and prescriptions
7. **Billing**: Handle patient billing and payments

## Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

### Building for Production

To build the application for production:

```bash
npm run build
```

The built application will be in the `build` directory and ready for deployment.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
