// Static reference data for the form dropdowns/chips.
// No API calls yet -- will swap these for real endpoints late.

// All 64 districts of Bangladesh, grouped by division for an easier-to-scan dropdown.
export const bangladeshDistricts = [
  {
    division: "Barishal",
    districts: [
      "Barguna",
      "Barishal",
      "Bhola",
      "Jhalokati",
      "Patuakhali",
      "Pirojpur",
    ],
  },
  {
    division: "Chattogram",
    districts: [
      "Bandarban",
      "Brahmanbaria",
      "Chandpur",
      "Chattogram",
      "Cumilla",
      "Cox's Bazar",
      "Feni",
      "Khagrachari",
      "Lakshmipur",
      "Noakhali",
      "Rangamati",
    ],
  },
  {
    division: "Dhaka",
    districts: [
      "Dhaka",
      "Faridpur",
      "Gazipur",
      "Gopalganj",
      "Kishoreganj",
      "Madaripur",
      "Manikganj",
      "Munshiganj",
      "Narayanganj",
      "Narsingdi",
      "Rajbari",
      "Shariatpur",
      "Tangail",
    ],
  },
  {
    division: "Khulna",
    districts: [
      "Bagerhat",
      "Chuadanga",
      "Jashore",
      "Jhenaidah",
      "Khulna",
      "Kushtia",
      "Magura",
      "Meherpur",
      "Narail",
      "Satkhira",
    ],
  },
  {
    division: "Mymensingh",
    districts: ["Jamalpur", "Mymensingh", "Netrokona", "Sherpur"],
  },
  {
    division: "Rajshahi",
    districts: [
      "Bogura",
      "Chapainawabganj",
      "Joypurhat",
      "Naogaon",
      "Natore",
      "Pabna",
      "Rajshahi",
      "Sirajganj",
    ],
  },
  {
    division: "Rangpur",
    districts: [
      "Dinajpur",
      "Gaibandha",
      "Kurigram",
      "Lalmonirhat",
      "Nilphamari",
      "Panchagarh",
      "Rangpur",
      "Thakurgaon",
    ],
  },
  {
    division: "Sylhet",
    districts: ["Habiganj", "Moulvibazar", "Sunamganj", "Sylhet"],
  },
];

// Standard 8 blood groups.
export const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Skill options shown as toggle chips on the "Confirm Your Details" screen.
// (First Aid, Search & Rescue, Food Distribution)
export const skillOptions = [
  "First Aid",
  "Search & Rescue",
  "Food Distribution",
];
