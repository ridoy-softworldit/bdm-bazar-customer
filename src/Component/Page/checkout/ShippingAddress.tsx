import { ChangeEvent, useEffect, useState } from "react";

export interface CustomerInfo {
  pickupLocation: "home" | "office";
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  altPhone: string;
  country: string;
  city: string;
  area: string;
  zone: string;
  address: string;
  postalCode?: string;
}

interface District {
  id: number;
  division_id: number;
  name: string;
  bn_name: string;
  lat: string;
  lon: string;
}

interface Upazila {
  id: number;
  district_id: number;
  name: string;
  bn_name: string;
  lat: string;
  lon: string;
}

interface Union {
  id: number;
  upazila_id: number;
  name: string;
  bn_name: string;
  lat?: string;
  lon?: string;
}

interface ShippingAddressProps {
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo) => void;
  isGuestCheckout?: boolean;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  triggerValidation?: boolean;
}

const selectArrow = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 12 12'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-width='1.5' d='m3 4.5 3 3 3-3'/%3e%3c/svg%3e")`;

const selectStyle = {
  backgroundImage: selectArrow,
  backgroundPosition: "right 0.75rem center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "1em",
};

const API_BASE_URL = "https://bdapis.vercel.app/geo/v2.0";

// Enhanced static unions/zones for Dhaka areas only
const staticDhakaUnions: { [key: string]: Union[] } = {
  Mirpur: [
    { id: 1, upazila_id: 1, name: "Mirpur-1", bn_name: "মিরপুর-১" },
    { id: 2, upazila_id: 1, name: "Mirpur-2", bn_name: "মিরপুর-২" },
    { id: 3, upazila_id: 1, name: "Mirpur-10", bn_name: "মিরপুর-১০" },
    { id: 4, upazila_id: 1, name: "Mirpur-11", bn_name: "মিরপুর-১১" },
    { id: 5, upazila_id: 1, name: "Mirpur-12", bn_name: "মিরপুর-১২" },
    { id: 6, upazila_id: 1, name: "Mirpur-13", bn_name: "মিরপুর-১৩" },
    { id: 7, upazila_id: 1, name: "Mirpur-14", bn_name: "মিরপুর-১৪" },
    { id: 8, upazila_id: 1, name: "Pallabi", bn_name: "পল্লবী" },
    { id: 9, upazila_id: 1, name: "Rupnagar", bn_name: "রূপনগর" },
  ],
  Uttara: [
    {
      id: 10,
      upazila_id: 2,
      name: "Uttara Sector 1",
      bn_name: "উত্তরা সেক্টর ১",
    },
    {
      id: 11,
      upazila_id: 2,
      name: "Uttara Sector 3",
      bn_name: "উত্তরা সেক্টর ৩",
    },
    {
      id: 12,
      upazila_id: 2,
      name: "Uttara Sector 4",
      bn_name: "উত্তরা সেক্টর ৪",
    },
    {
      id: 13,
      upazila_id: 2,
      name: "Uttara Sector 6",
      bn_name: "উত্তরা সেক্টর ৬",
    },
    {
      id: 14,
      upazila_id: 2,
      name: "Uttara Sector 7",
      bn_name: "উত্তরা সেক্টর ৭",
    },
    {
      id: 15,
      upazila_id: 2,
      name: "Uttara Sector 11",
      bn_name: "উত্তরা সেক্টর ১১",
    },
    {
      id: 16,
      upazila_id: 2,
      name: "Uttara Sector 12",
      bn_name: "উত্তরা সেক্টর ১২",
    },
    {
      id: 17,
      upazila_id: 2,
      name: "Uttara Sector 13",
      bn_name: "উত্তরা সেক্টর ১৩",
    },
  ],
  Dhanmondi: [
    {
      id: 18,
      upazila_id: 3,
      name: "Dhanmondi Residential Area",
      bn_name: "ধানমন্ডি আবাসিক এলাকা",
    },
    { id: 19, upazila_id: 3, name: "Kalabagan", bn_name: "কলাবাগান" },
    { id: 20, upazila_id: 3, name: "Sobhanbag", bn_name: "শোভাবাগ" },
    { id: 21, upazila_id: 3, name: "Satmasjid Road", bn_name: "সাতমসজিদ রোড" },
  ],
  Gulshan: [
    { id: 22, upazila_id: 4, name: "Gulshan-1", bn_name: "গুলশান-১" },
    { id: 23, upazila_id: 4, name: "Gulshan-2", bn_name: "গুলশান-২" },
    { id: 24, upazila_id: 4, name: "Baridhara", bn_name: "বারিধারা" },
    {
      id: 25,
      upazila_id: 4,
      name: "Baridhara DOHS",
      bn_name: "বারিধারা ডিওএইচএস",
    },
    {
      id: 26,
      upazila_id: 4,
      name: "Gulshan Circle 1",
      bn_name: "গুলশান সার্কেল ১",
    },
    {
      id: 27,
      upazila_id: 4,
      name: "Gulshan Circle 2",
      bn_name: "গুলশান সার্কেল ২",
    },
  ],
  Banani: [
    {
      id: 28,
      upazila_id: 5,
      name: "Banani Model Town",
      bn_name: "বনানী মডেল টাউন",
    },
    { id: 29, upazila_id: 5, name: "Mohakhali", bn_name: "মহাখালী" },
    { id: 30, upazila_id: 5, name: "Banani DOHS", bn_name: "বনানী ডিওএইচএস" },
    { id: 31, upazila_id: 5, name: "Kakoli", bn_name: "কাকলী" },
    {
      id: 32,
      upazila_id: 5,
      name: "Chairman Bari",
      bn_name: "চেয়ারম্যান বাড়ী",
    },
  ],
  Mohammadpur: [
    { id: 33, upazila_id: 6, name: "Adabor", bn_name: "আদাবর" },
    { id: 34, upazila_id: 6, name: "Shyamoli", bn_name: "শ্যামলী" },
    { id: 35, upazila_id: 6, name: "Shankar", bn_name: "শঙ্কর" },
    {
      id: 36,
      upazila_id: 6,
      name: "Shia Mosque Area",
      bn_name: "শিয়া মসজিদ এলাকা",
    },
    { id: 37, upazila_id: 6, name: "Shah Ali Bag", bn_name: "শাহ আলী বাগ" },
  ],
  Savar: [
    { id: 38, upazila_id: 7, name: "Ashulia", bn_name: "আশুলিয়া" },
    { id: 39, upazila_id: 7, name: "Yearpur", bn_name: "ইয়ারপুর" },
    {
      id: 40,
      upazila_id: 7,
      name: "Savar Cantonment",
      bn_name: "সাভার ক্যান্টনমেন্ট",
    },
    {
      id: 41,
      upazila_id: 7,
      name: "Savar Model Town",
      bn_name: "সাভার মডেল টাউন",
    },
    { id: 42, upazila_id: 7, name: "Hemayetpur", bn_name: "হেমায়েতপুর" },
    { id: 43, upazila_id: 7, name: "Nobinagar", bn_name: "নবীনগর" },
  ],
  Keraniganj: [
    {
      id: 44,
      upazila_id: 8,
      name: "Keraniganj Town",
      bn_name: "কেরানীগঞ্জ টাউন",
    },
    { id: 45, upazila_id: 8, name: "Ati Bazar", bn_name: "আটি বাজার" },
    { id: 46, upazila_id: 8, name: "Kalatia", bn_name: "কলাতিয়া" },
    { id: 47, upazila_id: 8, name: "Ruhitpur", bn_name: "রুহিতপুর" },
  ],
  Dhamrai: [
    { id: 48, upazila_id: 9, name: "Dhamrai Town", bn_name: "ধামরাই টাউন" },
    { id: 49, upazila_id: 9, name: "Kushura", bn_name: "কুশুরা" },
    { id: 50, upazila_id: 9, name: "Nannar", bn_name: "নান্নার" },
  ],
  Dohar: [
    { id: 51, upazila_id: 10, name: "Dohar Town", bn_name: "দোহার টাউন" },
    { id: 52, upazila_id: 10, name: "Nayabari", bn_name: "নয়াবাড়ী" },
    { id: 53, upazila_id: 10, name: "Kusumhathi", bn_name: "কুসুমহাটি" },
  ],
  Badda: [
    { id: 54, upazila_id: 11, name: "Badda Block A", bn_name: "বাড্ডা ব্লক এ" },
    {
      id: 55,
      upazila_id: 11,
      name: "Badda Block B",
      bn_name: "বাড্ডা ব্লক বি",
    },
    {
      id: 56,
      upazila_id: 11,
      name: "Badda Block C",
      bn_name: "বাড্ডা ব্লক সি",
    },
    {
      id: 57,
      upazila_id: 11,
      name: "Badda Block D",
      bn_name: "বাড্ডা ব্লক ডি",
    },
  ],
  Rampura: [
    { id: 58, upazila_id: 12, name: "Rampura", bn_name: "রামপুরা" },
    { id: 59, upazila_id: 12, name: "Merul", bn_name: "মেরুল" },
    { id: 60, upazila_id: 12, name: "Banasree", bn_name: "বনশ্রী" },
  ],
  Motijheel: [
    {
      id: 61,
      upazila_id: 13,
      name: "Motijheel Commercial Area",
      bn_name: "মতিঝিল বাণিজ্যিক এলাকা",
    },
    { id: 62, upazila_id: 13, name: "Dilkusha", bn_name: "দিলকুশা" },
  ],
  Farmgate: [
    { id: 63, upazila_id: 14, name: "Farmgate", bn_name: "ফার্মগেট" },
    {
      id: 64,
      upazila_id: 14,
      name: "Tejgaon Industrial Area",
      bn_name: "তেজগাঁও শিল্প এলাকা",
    },
    { id: 65, upazila_id: 14, name: "Tejgaon", bn_name: "তেজগাঁও" },
  ],
  Khilgaon: [
    { id: 66, upazila_id: 15, name: "Khilgaon", bn_name: "খিলগাঁও" },
    { id: 67, upazila_id: 15, name: "Basabo", bn_name: "বাসাবো" },
  ],
  Malibagh: [
    { id: 68, upazila_id: 16, name: "Malibagh", bn_name: "মালিবাগ" },
    { id: 69, upazila_id: 16, name: "Razabazar", bn_name: "রাজারবাগ" },
  ],
  Jatrabari: [
    { id: 70, upazila_id: 17, name: "Jatrabari", bn_name: "যাত্রাবাড়ী" },
    { id: 71, upazila_id: 17, name: "Shonir Akhra", bn_name: "শনির আখড়া" },
  ],
  Demra: [
    { id: 72, upazila_id: 18, name: "Demra", bn_name: "ডেমরা" },
    { id: 73, upazila_id: 18, name: "Sarulia", bn_name: "সরুলিয়া" },
  ],
  Kadamtali: [
    { id: 74, upazila_id: 19, name: "Kadamtali", bn_name: "কদমতলী" },
    { id: 75, upazila_id: 19, name: "Manda", bn_name: "মান্ডা" },
  ],
  Nawabganj: [
    { id: 76, upazila_id: 20, name: "Nawabganj", bn_name: "নবাবগঞ্জ" },
    { id: 77, upazila_id: 20, name: "Kalakop", bn_name: "কালাকোপ" },
  ],
};

// Enhanced Dhaka upazilas data
const enhancedDhakaUpazilas: Upazila[] = [
  {
    id: 1,
    district_id: 1,
    name: "Mirpur",
    bn_name: "মিরপুর",
    lat: "23.8067",
    lon: "90.3683",
  },
  {
    id: 2,
    district_id: 1,
    name: "Uttara",
    bn_name: "উত্তরা",
    lat: "23.8759",
    lon: "90.3795",
  },
  {
    id: 3,
    district_id: 1,
    name: "Dhanmondi",
    bn_name: "ধানমন্ডি",
    lat: "23.7465",
    lon: "90.3760",
  },
  {
    id: 4,
    district_id: 1,
    name: "Gulshan",
    bn_name: "গুলশান",
    lat: "23.7947",
    lon: "90.4147",
  },
  {
    id: 5,
    district_id: 1,
    name: "Banani",
    bn_name: "বনানী",
    lat: "23.7941",
    lon: "90.4053",
  },
  {
    id: 6,
    district_id: 1,
    name: "Mohammadpur",
    bn_name: "মোহাম্মদপুর",
    lat: "23.7639",
    lon: "90.3611",
  },
  {
    id: 7,
    district_id: 1,
    name: "Savar",
    bn_name: "সাভার",
    lat: "23.8567",
    lon: "90.2600",
  },
  {
    id: 8,
    district_id: 1,
    name: "Keraniganj",
    bn_name: "কেরানীগঞ্জ",
    lat: "23.7000",
    lon: "90.3500",
  },
  {
    id: 9,
    district_id: 1,
    name: "Dhamrai",
    bn_name: "ধামরাই",
    lat: "23.9167",
    lon: "90.2167",
  },
  {
    id: 10,
    district_id: 1,
    name: "Dohar",
    bn_name: "দোহার",
    lat: "23.6000",
    lon: "90.1333",
  },
  {
    id: 11,
    district_id: 1,
    name: "Badda",
    bn_name: "বাড্ডা",
    lat: "23.7833",
    lon: "90.4250",
  },
  {
    id: 12,
    district_id: 1,
    name: "Rampura",
    bn_name: "রামপুরা",
    lat: "23.7600",
    lon: "90.4200",
  },
  {
    id: 13,
    district_id: 1,
    name: "Motijheel",
    bn_name: "মতিঝিল",
    lat: "23.7347",
    lon: "90.4250",
  },
  {
    id: 14,
    district_id: 1,
    name: "Farmgate",
    bn_name: "ফার্মগেট",
    lat: "23.7594",
    lon: "90.3847",
  },
  {
    id: 15,
    district_id: 1,
    name: "Khilgaon",
    bn_name: "খিলগাঁও",
    lat: "23.7500",
    lon: "90.4333",
  },
  {
    id: 16,
    district_id: 1,
    name: "Malibagh",
    bn_name: "মালিবাগ",
    lat: "23.7400",
    lon: "90.4300",
  },
  {
    id: 17,
    district_id: 1,
    name: "Jatrabari",
    bn_name: "যাত্রাবাড়ী",
    lat: "23.7100",
    lon: "90.4500",
  },
  {
    id: 18,
    district_id: 1,
    name: "Demra",
    bn_name: "ডেমরা",
    lat: "23.7500",
    lon: "90.4833",
  },
  {
    id: 19,
    district_id: 1,
    name: "Kadamtali",
    bn_name: "কদমতলী",
    lat: "23.7000",
    lon: "90.4667",
  },
  {
    id: 20,
    district_id: 1,
    name: "Nawabganj",
    bn_name: "নবাবগঞ্জ",
    lat: "23.6667",
    lon: "90.1667",
  },
];

export default function ShippingAddress({
  customerInfo,
  setCustomerInfo,
  isGuestCheckout = false,
  userName,
  userEmail,
  userPhone,
  triggerValidation = false,
}: ShippingAddressProps) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);
  const [unions, setUnions] = useState<Union[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Trigger validation for all required fields when submit is clicked
  useEffect(() => {
    if (triggerValidation) {
      const requiredFields = ['firstName', 'lastName', 'phone', 'city', 'area', 'zone', 'address'];
      if (!isGuestCheckout) requiredFields.push('email');
      const allTouched = requiredFields.reduce((acc, field) => ({ ...acc, [field]: true }), {});
      setTouched(allTouched);
    }
  }, [triggerValidation, isGuestCheckout]);

  const getFieldClass = (fieldName: string, value: string | undefined, isRequired: boolean = true) => {
    if (!isRequired) return "mt-1 block w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm p-2";
    if (!touched[fieldName]) return "mt-1 block w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm p-2";
    return value && value.trim() !== "" 
      ? "mt-1 block w-full border-2 border-green-500 rounded-md focus:border-green-500 focus:ring-1 focus:ring-green-500 sm:text-sm p-2"
      : "mt-1 block w-full border-2 border-red-500 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500 sm:text-sm p-2";
  };

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  // Auto-fill user data for logged-in users
  useEffect(() => {
    if (!isGuestCheckout && (userName || userEmail || userPhone)) {
      const nameParts = userName?.split(" ") || [];
      setCustomerInfo({
        ...customerInfo,
        firstName: nameParts[0] || customerInfo.firstName,
        lastName: nameParts.slice(1).join(" ") || customerInfo.lastName,
        email: userEmail || customerInfo.email,
        phone: userPhone || customerInfo.phone,
      });
    }
  }, [isGuestCheckout, userName, userEmail, userPhone]);

  // Fetch districts on component mount
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/districts`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        let districtArray: District[] = [];
        if (Array.isArray(data)) {
          districtArray = data;
        } else if (data && typeof data === "object") {
          if (Array.isArray(data.data)) {
            districtArray = data.data;
          } else if (Array.isArray(data.results)) {
            districtArray = data.results;
          } else if (Array.isArray(data.districts)) {
            districtArray = data.districts;
          } else {
            const values = Object.values(data);
            if (values.length > 0 && typeof values[0] === "object") {
              districtArray = values as District[];
            } else {
              throw new Error("Unable to parse district data");
            }
          }
        } else {
          throw new Error("Invalid data format");
        }

        setDistricts(districtArray);
      } catch (err) {
        console.error("Error fetching districts:", err);
        setError("Using offline district data.");

        // Minimal fallback districts
        const fallbackDistricts: District[] = [
          {
            id: 1,
            division_id: 3,
            name: "Dhaka",
            bn_name: "ঢাকা",
            lat: "23.8103",
            lon: "90.4125",
          },
          {
            id: 2,
            division_id: 1,
            name: "Chittagong",
            bn_name: "চট্টগ্রাম",
            lat: "22.3569",
            lon: "91.7832",
          },
          {
            id: 20,
            division_id: 3,
            name: "Tangail",
            bn_name: "টাঙ্গাইল",
            lat: "24.2513",
            lon: "89.9167",
          },
        ];
        setDistricts(fallbackDistricts);
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, []);

  // Fetch upazilas when city (district) changes
  useEffect(() => {
    const fetchUpazilas = async () => {
      if (!customerInfo.city) {
        setUpazilas([]);
        setUnions([]);
        return;
      }

      const selectedDistrict = districts.find(
        (d) => d.name === customerInfo.city
      );
      if (!selectedDistrict) return;

      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/upazilas/${selectedDistrict.id}`
        );
        if (!response.ok) throw new Error();
        const data = await response.json();

        let upazilaArray: Upazila[] = [];
        if (Array.isArray(data)) {
          upazilaArray = data;
        } else if (data && typeof data === "object") {
          if (Array.isArray(data.data)) {
            upazilaArray = data.data;
          } else if (Array.isArray(data.results)) {
            upazilaArray = data.results;
          } else if (Array.isArray(data.upazilas)) {
            upazilaArray = data.upazilas;
          } else {
            const values = Object.values(data);
            if (values.length > 0 && typeof values[0] === "object") {
              upazilaArray = values as Upazila[];
            } else {
              throw new Error("Unable to parse upazila data");
            }
          }
        } else {
          throw new Error("Invalid data format");
        }

        // If it's Dhaka district, combine API data with enhanced Dhaka data
        if (customerInfo.city === "Dhaka") {
          // Create a map to avoid duplicates
          const upazilaMap = new Map();

          // First add all API upazilas
          upazilaArray.forEach((upazila) => {
            upazilaMap.set(upazila.name, upazila);
          });

          // Then add enhanced Dhaka upazilas (will override API data if same name exists)
          enhancedDhakaUpazilas.forEach((upazila) => {
            upazilaMap.set(upazila.name, upazila);
          });

          setUpazilas(Array.from(upazilaMap.values()));
        } else {
          setUpazilas(upazilaArray);
        }
      } catch (err) {
        console.error("Error fetching upazilas:", err);
        setError("Using offline upazila data.");

        // Enhanced fallback for Dhaka, original for others
        if (customerInfo.city === "Dhaka") {
          setUpazilas(enhancedDhakaUpazilas);
        } else {
          const staticUpazilas: { [key: string]: Upazila[] } = {
            Dhaka: [
              {
                id: 1,
                district_id: 1,
                name: "Dhamrai",
                bn_name: "ধামরাই",
                lat: "23.9073",
                lon: "90.1361",
              },
            ],
          };
          setUpazilas(staticUpazilas[customerInfo.city] || []);
        }
      } finally {
        setLoading(false);
      }
    };

    if (districts.length > 0) fetchUpazilas();
  }, [customerInfo.city, districts]);

  // Fetch unions (zones) when area (upazila) changes
  useEffect(() => {
    const fetchUnions = async () => {
      if (!customerInfo.area) {
        setUnions([]);
        return;
      }

      const selectedUpazila = upazilas.find(
        (u) => u.name === customerInfo.area
      );
      if (!selectedUpazila) return;

      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/unions/${selectedUpazila.id}`
        );
        if (!response.ok) throw new Error();
        const data = await response.json();

        let unionArray: Union[] = [];
        if (Array.isArray(data)) {
          unionArray = data;
        } else if (data && typeof data === "object") {
          if (Array.isArray(data.data)) {
            unionArray = data.data;
          } else if (Array.isArray(data.results)) {
            unionArray = data.results;
          } else if (Array.isArray(data.unions)) {
            unionArray = data.unions;
          } else {
            const values = Object.values(data);
            if (values.length > 0 && typeof values[0] === "object") {
              unionArray = values as Union[];
            } else {
              throw new Error("Unable to parse union data");
            }
          }
        } else {
          throw new Error("Invalid data format");
        }

        // If it's Dhaka district and we have enhanced unions for this upazila, use them
        if (
          customerInfo.city === "Dhaka" &&
          staticDhakaUnions[customerInfo.area]
        ) {
          setUnions(staticDhakaUnions[customerInfo.area]);
        } else {
          setUnions(unionArray);
        }
      } catch (err) {
        console.error("Error fetching unions:", err);
        setError("Using offline zone data.");

        // Use enhanced static Dhaka unions data for Dhaka areas
        if (customerInfo.city === "Dhaka") {
          setUnions(staticDhakaUnions[customerInfo.area] || []);
        } else {
          const staticUnions: { [key: string]: Union[] } = {
            Savar: [
              { id: 1, upazila_id: 5, name: "Ashulia", bn_name: "আশুলিয়া" },
              { id: 2, upazila_id: 5, name: "Yearpur", bn_name: "ইয়ারপুর" },
            ],
          };
          setUnions(staticUnions[customerInfo.area] || []);
        }
      } finally {
        setLoading(false);
      }
    };

    if (upazilas.length > 0) fetchUnions();
  }, [customerInfo.area, customerInfo.city, upazilas]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;

    if (id === "city") {
      setCustomerInfo({
        ...customerInfo,
        [id]: value,
        area: "",
        zone: "",
      });
    } else if (id === "area") {
      setCustomerInfo({
        ...customerInfo,
        [id]: value,
        zone: "",
      });
    } else {
      setCustomerInfo({
        ...customerInfo,
        [id]: value,
      });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-1">Shipping Address</h2>
      <p className="text-sm text-gray-500 mb-6">
        Please Fill Out Your Information
      </p>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-700">{error}</p>
        </div>
      )}

      {/* Pickup Location */}
      <div className="flex items-center space-x-8 mb-6">
        <span className="text-sm font-medium">Pick Up Your Parcel From:</span>
        <div className="flex items-center space-x-4">
          {["home", "office"].map((loc) => (
            <div key={loc} className="flex items-center">
              <input
                type="radio"
                id={`pickup-${loc}`}
                name="pickup"
                value={loc}
                checked={customerInfo.pickupLocation === loc}
                onChange={() =>
                  setCustomerInfo({
                    ...customerInfo,
                    pickupLocation: loc as "home" | "office",
                  })
                }
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor={`pickup-${loc}`}
                className="ml-2 block text-sm text-gray-900"
              >
                {loc.charAt(0).toUpperCase() + loc.slice(1)}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              value={customerInfo.firstName}
              onChange={handleChange}
              onBlur={() => handleBlur('firstName')}
              required
              className={getFieldClass('firstName', customerInfo.firstName)}
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              value={customerInfo.lastName}
              onChange={handleChange}
              onBlur={() => handleBlur('lastName')}
              required
              className={getFieldClass('lastName', customerInfo.lastName)}
            />
          </div>
        </div>
        
        {/* Phone numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone No <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              value={customerInfo.phone}
              onChange={handleChange}
              onBlur={() => handleBlur('phone')}
              placeholder="+880 1234567890"
              required
              className={getFieldClass('phone', customerInfo.phone)}
            />
          </div>
          <div>
            <label
              htmlFor="altPhone"
              className="block text-sm font-medium text-gray-700"
            >
              Alternative Phone No <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="tel"
              id="altPhone"
              value={customerInfo.altPhone}
              onChange={handleChange}
              placeholder="+880 1234567890"
              className="mt-1 block w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm p-2"
            />
          </div>
        </div>
        
        {/* Email field - required for logged-in users, optional for guests */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address {!isGuestCheckout ? <span className="text-red-500">*</span> : <span className="text-gray-500">(optional)</span>}
          </label>
          <input
            type="email"
            id="email"
            value={customerInfo.email || ""}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            required={!isGuestCheckout}
            placeholder="your@email.com"
            className={getFieldClass('email', customerInfo.email, !isGuestCheckout)}
          />
        </div>

        {/* Address selectors */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Country <span className="text-red-500">*</span>
            </label>
            <select
              id="country"
              value={customerInfo.country}
              onChange={handleChange}
              style={selectStyle}
              required
              className="appearance-none mt-1 block w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm p-2 bg-white"
            >
              <option value="Bangladesh">Bangladesh</option>
            </select>
          </div>

          {/* City/District */}
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              District <span className="text-red-500">*</span>
            </label>
            <select
              id="city"
              value={customerInfo.city}
              onChange={handleChange}
              onBlur={() => handleBlur('city')}
              style={selectStyle}
              disabled={loading && districts.length === 0}
              required
              className={`appearance-none ${getFieldClass('city', customerInfo.city)} bg-white disabled:bg-gray-100`}
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district.id} value={district.name}>
                  {district.name} ({district.bn_name})
                </option>
              ))}
            </select>
          </div>

          {/* Area/Upazila */}
          <div>
            <label
              htmlFor="area"
              className="block text-sm font-medium text-gray-700"
            >
              Upazila <span className="text-red-500">*</span>
            </label>
            <select
              id="area"
              value={customerInfo.area}
              onChange={handleChange}
              onBlur={() => handleBlur('area')}
              style={selectStyle}
              disabled={
                !customerInfo.city || (loading && upazilas.length === 0)
              }
              required
              className={`appearance-none ${getFieldClass('area', customerInfo.area)} bg-white disabled:bg-gray-100`}
            >
              <option value="">Select Upazila</option>
              {upazilas.map((upazila) => (
                <option key={upazila.id} value={upazila.name}>
                  {upazila.name} ({upazila.bn_name})
                </option>
              ))}
            </select>
          </div>

          {/* Zone/Union */}
          <div>
            <label
              htmlFor="zone"
              className="block text-sm font-medium text-gray-700"
            >
              Zone <span className="text-red-500">*</span>
            </label>
            <select
              id="zone"
              value={customerInfo.zone}
              onChange={handleChange}
              onBlur={() => handleBlur('zone')}
              style={selectStyle}
              disabled={!customerInfo.area || (loading && unions.length === 0)}
              required
              className={`appearance-none ${getFieldClass('zone', customerInfo.zone)} bg-white disabled:bg-gray-100`}
            >
              <option value="">Select Zone</option>
              {unions.map((union) => (
                <option key={union.id} value={union.name}>
                  {union.name} ({union.bn_name})
                </option>
              ))}
            </select>
          </div>
        </div>


        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Detailed Address <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            value={customerInfo.address}
            onChange={handleChange}
            onBlur={() => handleBlur('address')}
            rows={4}
            placeholder="আপনার ফ্ল্যাট, সড়ক, পাড়া-মহল্লার নাম, পরিচিতির এলাকা উল্লেখ করুন"
            required
            className={getFieldClass('address', customerInfo.address)}
          />
        </div>
      </div>

      {loading && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center text-sm text-gray-600">
            <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            Loading locations...
          </div>
        </div>
      )}
    </div>
  );
}
