export interface Event {
  id_event: number;
  id_user: number;
  name: string;
  event_type: string;
  description: string;
  longitude: number;
  latitude: number;
  address: string;
  city: string;
  category: string;
  event_date: string;
  event_time: string;
  price: number;
  available_seats: number;
  is_featured: boolean;
  createdAt: string;
  updatedAt: string;
}
