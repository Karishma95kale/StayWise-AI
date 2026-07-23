const sampleHostels = [
  {
    title: "St. Stephen's Student Residency & PG",
    description: "Premium AC rooms for university students located 500 meters from North Campus. Includes 3 meals a day, high-speed fiber internet, bio-metric security, and daily housekeeping.",
    image: {
      filename: "hostel1",
      url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80"
    },
    images: [
      { filename: "hostel1_1", url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80" },
      { filename: "hostel1_2", url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80" }
    ],
    price: 9500,
    securityDeposit: 10000,
    availableBeds: 4,
    roomType: "Double Sharing",
    gender: "Boys",
    college: "Delhi University North Campus",
    distanceFromCollege: 0.5,
    amenities: ["WiFi", "Mess", "Laundry", "AC", "Power Backup", "CCTV", "Study Room"],
    messAvailable: true,
    messCharges: 2500,
    wifiAvailable: true,
    laundryAvailable: true,
    parkingAvailable: true,
    powerBackup: true,
    curfewTime: "10:30 PM",
    location: "Hudson Lane, GTB Nagar, New Delhi",
    country: "India",
    latitude: 28.6974,
    longitude: 77.2064,
    rating: 4.8,
    safetyScore: 94,
    aiRecommendationScore: 96,
    isApproved: true
  },
  {
    title: "Gargi Girls Luxury PG & Hostel",
    description: "Secure 24/7 guarded girls hostel with biometric access, high-speed WiFi, nutritious hygienic food, attached washrooms, and laundry service.",
    image: {
      filename: "hostel2",
      url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80"
    },
    images: [
      { filename: "hostel2_1", url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80" },
      { filename: "hostel2_2", url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80" }
    ],
    price: 11000,
    securityDeposit: 12000,
    availableBeds: 2,
    roomType: "Single",
    gender: "Girls",
    college: "Gargi College & LSR",
    distanceFromCollege: 0.8,
    amenities: ["WiFi", "Mess", "Laundry", "AC", "Power Backup", "Security Guard", "CCTV", "Gym"],
    messAvailable: true,
    messCharges: 3000,
    wifiAvailable: true,
    laundryAvailable: true,
    parkingAvailable: false,
    powerBackup: true,
    curfewTime: "09:30 PM",
    location: "Green Park, South Delhi, New Delhi",
    country: "India",
    latitude: 28.5588,
    longitude: 77.2028,
    rating: 4.9,
    safetyScore: 98,
    aiRecommendationScore: 95,
    isApproved: true
  },
  {
    title: "IIT Powai Scholars Shared Flat",
    description: "3BHK fully furnished shared student flat with spacious living area, study desks, gaming lounge, fast internet, and cooking space.",
    image: {
      filename: "hostel3",
      url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80"
    },
    images: [
      { filename: "hostel3_1", url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80" }
    ],
    price: 14000,
    securityDeposit: 15000,
    availableBeds: 3,
    roomType: "Flat",
    gender: "Co-ed",
    college: "IIT Bombay",
    distanceFromCollege: 1.2,
    amenities: ["WiFi", "Kitchen", "Washing Machine", "AC", "Power Backup", "Parking", "Balcony"],
    messAvailable: false,
    messCharges: 0,
    wifiAvailable: true,
    laundryAvailable: true,
    parkingAvailable: true,
    powerBackup: true,
    curfewTime: "No Curfew",
    location: "Hiranandani Gardens, Powai, Mumbai",
    country: "India",
    latitude: 19.1176,
    longitude: 72.9060,
    rating: 4.7,
    safetyScore: 92,
    aiRecommendationScore: 91,
    isApproved: true
  },
  {
    title: "Koramangala Techie & Student PG",
    description: "Modern co-living space designed for tech students and interns. Smart lockers, rooftop cafe, 300 Mbps internet, and ergonomic work desks.",
    image: {
      filename: "hostel4",
      url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
    },
    images: [
      { filename: "hostel4_1", url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80" }
    ],
    price: 8500,
    securityDeposit: 8000,
    availableBeds: 6,
    roomType: "Triple Sharing",
    gender: "Boys",
    college: "Christ University Bangalore",
    distanceFromCollege: 1.0,
    amenities: ["WiFi", "Mess", "Laundry", "Gaming Zone", "Power Backup", "Biometric Access"],
    messAvailable: true,
    messCharges: 2000,
    wifiAvailable: true,
    laundryAvailable: true,
    parkingAvailable: true,
    powerBackup: true,
    curfewTime: "11:00 PM",
    location: "5th Block, Koramangala, Bengaluru",
    country: "India",
    latitude: 12.9352,
    longitude: 77.6245,
    rating: 4.6,
    safetyScore: 89,
    aiRecommendationScore: 94,
    isApproved: true
  },
  {
    title: "Symbiosis Co-Ed Campus Residency",
    description: "Vibrant student co-living community right next to Symbiosis Campus. Offers shuttle bus service, cafeteria, gym, and outdoor sports area.",
    image: {
      filename: "hostel5",
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80"
    },
    images: [
      { filename: "hostel5_1", url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80" }
    ],
    price: 12500,
    securityDeposit: 12500,
    availableBeds: 5,
    roomType: "Double Sharing",
    gender: "Co-ed",
    college: "Symbiosis International Pune",
    distanceFromCollege: 0.3,
    amenities: ["WiFi", "Mess", "Shuttle Service", "Gym", "Cafeteria", "Laundry", "Power Backup"],
    messAvailable: true,
    messCharges: 2800,
    wifiAvailable: true,
    laundryAvailable: true,
    parkingAvailable: true,
    powerBackup: true,
    curfewTime: "10:30 PM",
    location: "Viman Nagar, Pune",
    country: "India",
    latitude: 18.5679,
    longitude: 73.9143,
    rating: 4.8,
    safetyScore: 95,
    aiRecommendationScore: 97,
    isApproved: true
  }
];

module.exports = { data: sampleHostels };
