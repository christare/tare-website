import fs from 'fs';
import path from 'path';

const TOTAL_AVAILABLE_SEATS = 8;
const DATA_FILE_PATH = path.join(process.cwd(), 'data');
const SEATS_FILE_PATH = path.join(DATA_FILE_PATH, 'seats.json');

// Ensure the data directory exists
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_FILE_PATH)) {
    fs.mkdirSync(DATA_FILE_PATH, { recursive: true });
  }
};

// Initialize seats data if it doesn't exist
const initializeSeatsData = () => {
  ensureDataDir();
  
  if (!fs.existsSync(SEATS_FILE_PATH)) {
    const initialData = {
      studio_01: {
        booked_seats: 7,
        available_seats: 1,
        event_date: '2025-06-07'
      }
    };
    
    fs.writeFileSync(SEATS_FILE_PATH, JSON.stringify(initialData, null, 2));
    console.log('Initialized seats data file');
  }
};

// Read seats data
const readSeatsData = () => {
  initializeSeatsData();
  
  try {
    const data = fs.readFileSync(SEATS_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading seats data:', error);
    return {
      studio_01: {
        booked_seats: 0,
        available_seats: TOTAL_AVAILABLE_SEATS,
        event_date: '2025-06-07'
      }
    };
  }
};

// Write seats data
const writeSeatsData = (data: any) => {
  ensureDataDir();
  
  try {
    fs.writeFileSync(SEATS_FILE_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing seats data:', error);
    return false;
  }
};

// Get available seats
export const getAvailableSeats = async (): Promise<number> => {
  const data = readSeatsData();
  return data.studio_01.available_seats;
};

// Reserve a seat (decrease available seats)
export const reserveSeat = async (): Promise<boolean> => {
  const data = readSeatsData();
  
  if (data.studio_01.available_seats <= 0) {
    return false;
  }
  
  data.studio_01.available_seats -= 1;
  data.studio_01.booked_seats += 1;
  
  return writeSeatsData(data);
};

// Release a seat (increase available seats) - use for canceled orders
export const releaseSeat = async (): Promise<boolean> => {
  const data = readSeatsData();
  
  if (data.studio_01.booked_seats <= 0) {
    return false;
  }
  
  data.studio_01.available_seats += 1;
  data.studio_01.booked_seats -= 1;
  
  return writeSeatsData(data);
}; 