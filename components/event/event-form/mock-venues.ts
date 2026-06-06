export type MockVenue = Readonly<{
  id: string;
  name: string;
  address: string;
  city: string;
  lng: number;
  lat: number;
  category: string;
}>;

export const MOCK_VENUES: MockVenue[] = [
  {
    id: "1",
    name: "Pulse",
    address: "123 Ayala Ave",
    city: "Makati",
    lng: 121.0244,
    lat: 14.5547,
    category: "Nightclub",
  },
  {
    id: "2",
    name: "Noir Lounge",
    address: "45 P. Burgos St",
    city: "Makati",
    lng: 121.026,
    lat: 14.5533,
    category: "Bar",
  },
  {
    id: "3",
    name: "Fuego",
    address: "78 Jupiter St",
    city: "Makati",
    lng: 121.0275,
    lat: 14.5575,
    category: "Club",
  },
  {
    id: "4",
    name: "The Vinyl Room",
    address: "92 Polaris St",
    city: "Makati",
    lng: 121.022,
    lat: 14.552,
    category: "Lounge",
  },
  {
    id: "5",
    name: "Bass District",
    address: "15 Salcedo St",
    city: "Makati",
    lng: 121.0215,
    lat: 14.5605,
    category: "Underground",
  },
  {
    id: "6",
    name: "Elysium",
    address: "201 Makati Ave",
    city: "Makati",
    lng: 121.028,
    lat: 14.555,
    category: "Nightclub",
  },
];
