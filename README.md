# CENTURY SOAP - Inventory & Sales Management System

A beautiful, modern web application for managing inventory and sales for CENTURY SOAP, specializing in liquid soap sales in liters (mainly 7L jerry cans or bigger).

## 🌟 Features

### 🔐 User Management
- **Admin Users**: Full access to all features including reports, product management, and user management
- **Seller Users**: Can record sales and view only their sales history
- Role-based access control with secure authentication

### 📦 Product Management
- Add and manage soap products with different capacities (7L, 10L, 20L, 50L, etc.)
- Track stock levels in liters
- Set minimum stock thresholds with automatic alerts
- Update stock when restocking
- Automatic stock deduction on sales

### 🛒 Sales Recording
- Record sales with product selection and quantity
- Automatic calculation of total liters and amounts
- Payment method selection: Cash or MoMo (Mobile Money)
- Payment status tracking: Paid or Not Paid
- Optional customer name recording
- Automatic date and time stamping

### 📊 Reports & Analytics
- **Daily, Weekly, Monthly Reports**: Customizable date range reporting
- **Sales Metrics**: Total liters sold, total revenue in RWF
- **Payment Breakdown**: Cash vs MoMo analysis
- **Performance Tracking**: Per-seller performance metrics
- **Export Functionality**: CSV export for data analysis
- Beautiful charts and visualizations

### 📈 Dashboard
- Real-time overview of business performance
- Key metrics at a glance
- Stock level alerts
- Quick action buttons
- Responsive design for all devices

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd century-soap-inventory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
npm run preview
```

## 🔑 Demo Credentials

### Admin Access
- **Email**: admin@centurysoap.com
- **Password**: password123
- **Permissions**: Full access to all features

### Seller Access
- **Email**: john@centurysoap.com
- **Password**: password123
- **Permissions**: Sales recording and personal history

- **Email**: sarah@centurysoap.com
- **Password**: password123
- **Permissions**: Sales recording and personal history

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for beautiful data visualizations
- **Icons**: Lucide React for modern iconography
- **Routing**: React Router for navigation
- **Build Tool**: Vite for fast development and building
- **State Management**: React Context API
- **Notifications**: React Hot Toast for user feedback

## 🎨 Design Features

- **Modern UI/UX**: Clean, professional interface designed for business use
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Beautiful Animations**: Smooth transitions and hover effects
- **Color-coded Status**: Visual indicators for stock levels and payment status
- **Accessibility**: High contrast and readable typography
- **Dark Mode Ready**: Prepared for future dark theme implementation

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured interface with sidebar navigation
- **Tablet**: Adaptive layout with touch-friendly controls
- **Mobile**: Mobile-first design with collapsible navigation

## 🔒 Security Features

- Role-based access control
- Secure authentication system
- Input validation and sanitization
- Protected routes and API endpoints

## 📊 Data Management

- Local storage for demo purposes
- Prepared for backend integration
- CSV export functionality
- Data backup and recovery ready

## 🚧 Future Enhancements

- **Backend Integration**: Connect to real database and API
- **Real-time Updates**: Live stock and sales updates
- **Advanced Analytics**: Machine learning insights
- **Mobile App**: Native mobile application
- **Multi-language Support**: Localization for different regions
- **Barcode Scanning**: Product identification via barcodes
- **Inventory Photos**: Product image management
- **Customer Database**: Customer relationship management
- **Supplier Management**: Vendor and purchase order tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for CENTURY SOAP**

*Replacing manual bookkeeping with beautiful, efficient digital solutions.* 