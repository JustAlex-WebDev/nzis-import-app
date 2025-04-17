// Define the Reference interface
export interface Reference {
  // Unique identifier for the reference
  id: number;

  // Health Provision History number
  hph: string;

  // Full name of the patient
  patientName: string;

  // Personal Identification Number of the patient
  patientPid: string;

  // Date the reference was issued
  issuedDate: string;

  // Unique ID of the reference document
  referenceId: string;

  // Type of reference (e.g., medical procedure type)
  referenceType: number;

  // Primary location where the reference is valid
  primaryLocation: string;

  // Code for the primary location
  primaryLocationCode: number;

  // Secondary location associated with the reference
  secondaryLocation: string;

  // Code for the secondary location
  secondaryLocationCode: number;

  // Patient's current state (e.g., hospital, clinic code)
  patientStateCode: string;

  // Name of the referring doctor
  referringDoctor: string;

  // Unique identifier for the referring doctor
  doctorId: number;

  // Code representing the patient's condition
  conditionCode: string;

  // Description of the patient's condition
  conditionDescription: string;

  // Regional Health Inspectorate code
  regionalHealthCode: string;

  // Executor of the reference (e.g., laboratory, doctor)
  executorName: string;

  // Date the material for the examination was collected
  materialCollectionDate: string;

  // Date when the results were ready
  resultDate: string;
}

// Define the mock references array
export const mockReferences: Reference[] = [
  {
    id: 1,
    hph: "123456789012",
    patientName: "Иван Стойков Иванов",
    patientPid: "1234567890",
    issuedDate: "2025-04-09",
    referenceId: "25099A0000F6",
    referenceType: 1,
    primaryLocation: "Пловдив",
    primaryLocationCode: 16,
    secondaryLocation: "Съединение",
    secondaryLocationCode: 15,
    patientStateCode: "ZOO",
    referringDoctor: "Тодор Николов",
    doctorId: 1700003565,
    conditionCode: "06",
    conditionDescription: "Вътрешни болести",
    regionalHealthCode: "1622111277",
    executorName: "Д-р Иванов",
    materialCollectionDate: "2025-04-08",
    resultDate: "2025-04-10",
  },
  {
    id: 2,
    hph: "123456789012",
    patientName: "Иван Стойков Иванов",
    patientPid: "1234567890",
    issuedDate: "2025-04-10",
    referenceId: "35088B0000F7",
    referenceType: 2,
    primaryLocation: "София",
    primaryLocationCode: 18,
    secondaryLocation: "Враждебна",
    secondaryLocationCode: 17,
    patientStateCode: "XYZ",
    referringDoctor: "Д-р Анна Иванова",
    doctorId: 1700007890,
    conditionCode: "07",
    conditionDescription: "Неврология",
    regionalHealthCode: "1633112288",
    executorName: "Д-р Петрова",
    materialCollectionDate: "2025-04-09",
    resultDate: "2025-04-12",
  },
];
