# InvoicePro - Professional Invoice Generator

A modern, browser-based invoice generator built with React. Create professional invoices, manage clients, and export to PDF - all without leaving your browser.

## Features

- **Invoice Management**
  - Create, edit, and delete invoices
  - Auto-generated invoice numbers (INV-YEAR-####)
  - Track invoice status (paid/unpaid)
  - Search and filter invoices
  - Real-time total calculations

- **Client Management**
  - Add and manage client database
  - Store client contact information
  - Quick client selection when creating invoices

- **Professional PDF Export**
  - Export invoices to PDF with professional formatting
  - Include company branding
  - Automatic calculations (subtotal, tax, discounts)

- **Flexible Pricing**
  - Add multiple line items per invoice
  - Quantity and rate calculations
  - Percentage or fixed discounts
  - Customizable tax rates

- **Company Settings**
  - Configure your company information
  - Set default company details for invoices

- **Local Storage**
  - All data stored locally in your browser
  - No server required
  - Complete privacy

## Live Demo

Visit: [InvoicePro](https://thejhyefactor.github.io/invoice-generator)

## Technologies Used

- **React 19** - Modern UI framework
- **Vite** - Fast build tool
- **jsPDF** - PDF generation
- **Lucide React** - Icon library
- **Local Storage** - Data persistence

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/TheJhyeFactor/invoice-generator.git

# Navigate to the project directory
cd invoice-generator

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will open at `http://localhost:5173`

## Usage

### Setting Up Company Information

1. Click on **Settings** in the navigation
2. Enter your company name, email, phone, and address
3. This information will appear on all exported invoices

### Adding Clients

1. Navigate to the **Clients** tab
2. Click **New Client**
3. Fill in client details (name required)
4. Click **Save Client**

### Creating an Invoice

1. Go to the **Invoices** tab
2. Click **New Invoice**
3. Fill in the invoice details:
   - Invoice number (auto-generated)
   - Select a client
   - Set invoice and due dates
   - Add line items (description, quantity, rate)
   - Apply tax rate if needed
   - Add discounts (percentage or fixed amount)
   - Optional notes
4. Click **Save Invoice**

### Managing Invoices

- **Mark as Paid/Unpaid**: Click the checkmark icon
- **Edit**: Click the pencil icon
- **Download PDF**: Click the download icon
- **Delete**: Click the trash icon
- **Search**: Use the search box to find invoices by number or client name
- **Filter**: Filter by payment status (all, paid, unpaid)

## Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Deployment

This project is configured for GitHub Pages deployment with GitHub Actions.

### Automatic Deployment

1. Push to the `main` branch
2. GitHub Actions will automatically build and deploy

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to GitHub Pages
# (Ensure you have gh-pages branch configured)
```

## Project Structure

```
invoice-generator/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Actions deployment
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
└── package.json        # Project dependencies
```

## Key Features Explained

### Invoice Number Generation

Invoices are automatically numbered using the format `INV-YEAR-####`:
- `INV` prefix
- Current year
- Sequential 4-digit number

### PDF Export

The PDF export feature creates professional invoices with:
- Company header with contact information
- Invoice details (number, date, due date)
- Client billing information
- Itemized list of products/services
- Subtotal, tax, and discount calculations
- Total amount due
- Optional notes section

### Local Data Storage

All data (invoices, clients, company info) is stored in your browser's Local Storage:
- No account required
- No server uploads
- Complete privacy
- Data persists across sessions

## Browser Compatibility

Works in all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

- [ ] Multiple currency support
- [ ] Invoice templates/themes
- [ ] Recurring invoices
- [ ] Payment tracking
- [ ] Email invoices directly
- [ ] Multi-language support
- [ ] Export to other formats (Excel, CSV)
- [ ] Invoice reminders
- [ ] Analytics dashboard

## Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Author

**TheJhyeFactor**

- GitHub: [@TheJhyeFactor](https://github.com/TheJhyeFactor)
- Portfolio: [thejhyefactor.github.io](https://thejhyefactor.github.io)

## Acknowledgments

- Built with React and Vite
- PDF generation powered by jsPDF
- Icons from Lucide React
- Inspired by modern invoicing tools

---

© 2025 InvoicePro - Created by TheJhyeFactor
