import { User, Crop, Scheme } from "./models.js";

// Initial state
const mockCrops: any[] = [];
const mockSchemes: any[] = [
  {
    _id: "scheme_central_1",
    name: "PM-Kishan",
    description: "Pradhan Mantri Kisan Samman Nidhi - Direct income support to farmers",
    category: "central",
    link: "https://pmkisan.gov.in",
    createdAt: new Date(),
  },
  {
    _id: "scheme_central_2",
    name: "Soil Health Card Scheme",
    description: "Provides soil testing and health recommendations",
    category: "central",
    link: "https://agricoop.nic.in",
    createdAt: new Date(),
  },
  {
    _id: "scheme_state_1",
    name: "Raita Mitra",
    description: "Karnataka state scheme for farmer support",
    category: "state",
    link: "https://raitamitra.karnataka.gov.in",
    createdAt: new Date(),
  },
];
const mockUsers: any[] = [
  { _id: "admin_p", name: "Chethan Admin", email: "chethan@gmail.com", password: "12345678", role: "admin", phone: "999" } as any
];

export const getCrops = async (filter = {}) => {
  if (process.env.MONGODB_URI) {
    return await Crop.find(filter);
  }
  return mockCrops.filter((c: any) => !filter.hasOwnProperty('season') || c.season === (filter as any).season);
};

export const getCropById = async (id: string) => {
  if (process.env.MONGODB_URI) {
    return await Crop.findById(id);
  }
  return mockCrops.find(c => c._id === id);
};

export const findUser = async (email: string) => {
  if (process.env.MONGODB_URI) {
    return await User.findOne({ email });
  }
  return mockUsers.find(u => u.email === email);
};

export const saveUser = async (userData: any) => {
  if (process.env.MONGODB_URI) {
    const user = new User(userData);
    return await user.save();
  }
  // In mock mode we store it in memory
  const newUser = { ...userData, _id: "new_mock_" + Math.random() };
  mockUsers.push(newUser);
  return newUser;
};

export const saveCrop = async (cropData: any) => {
  if (process.env.MONGODB_URI) {
    const crop = new Crop(cropData);
    return await crop.save();
  }
  const newCrop = { ...cropData, _id: "crop_mock_" + Math.random() };
  mockCrops.push(newCrop);
  return newCrop;
};

export const updateCrop = async (id: string, cropData: any) => {
  if (process.env.MONGODB_URI) {
    return await Crop.findByIdAndUpdate(id, cropData, { new: true });
  }
  const index = mockCrops.findIndex(c => c._id === id);
  if (index === -1) return null;
  mockCrops[index] = { ...cropData, _id: id };
  return mockCrops[index];
};

export const deleteCrop = async (id: string) => {
  if (process.env.MONGODB_URI) {
    return await Crop.findByIdAndDelete(id);
  }
  const index = mockCrops.findIndex(c => c._id === id);
  if (index !== -1) {
    mockCrops.splice(index, 1);
  }
  return { message: "Deleted" };
};

export const getAllUsers = async () => {
  if (process.env.MONGODB_URI) {
    return await User.find({ role: "farmer" }).select("-password");
  }
  // In mock mode, filter to farmers and exclude password
  return mockUsers
    .filter(u => u.role === "farmer")
    .map(u => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });
};

export const getSchemes = async (filter = {}) => {
  if (process.env.MONGODB_URI) {
    return await Scheme.find(filter);
  }
  return mockSchemes.filter((s: any) => !filter.hasOwnProperty('category') || s.category === (filter as any).category);
};

export const saveScheme = async (schemeData: any) => {
  if (process.env.MONGODB_URI) {
    const scheme = new Scheme(schemeData);
    return await scheme.save();
  }
  const newScheme = { ...schemeData, _id: "scheme_mock_" + Math.random(), createdAt: new Date() };
  mockSchemes.push(newScheme);
  return newScheme;
};

export const deleteScheme = async (id: string) => {
  if (process.env.MONGODB_URI) {
    return await Scheme.findByIdAndDelete(id);
  }
  const index = mockSchemes.findIndex(s => s._id === id);
  if (index !== -1) {
    mockSchemes.splice(index, 1);
  }
  return { message: "Deleted" };
};
