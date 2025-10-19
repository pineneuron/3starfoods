'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { 
  ssr: false,
  loading: () => <div className="h-[500px] bg-gray-100 rounded-lg flex items-center justify-center"><p className="text-gray-500">Loading map...</p></div>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as React.ComponentType<any>;
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as React.ComponentType<any>;
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as React.ComponentType<any>;
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as React.ComponentType<any>;

interface Dealer {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email?: string;
  coordinates: [number, number]; // [lat, lng]
}

const dealers: Dealer[] = [
  {
    id: '1',
    name: 'Kathmandu Central Store',
    city: 'Kathmandu',
    address: 'New Road, Kathmandu',
    phone: '+977-1-4221234',
    email: 'kathmandu@3starfoods.com',
    coordinates: [27.7172, 85.3240]
  },
  {
    id: '2',
    name: 'Itahari Meat Center',
    city: 'Itahari',
    address: 'Main Road, Itahari',
    phone: '+977-25-580123',
    email: 'itahari@3starfoods.com',
    coordinates: [26.6617, 87.2742]
  },
  {
    id: '3',
    name: 'Chitwan Meat Hub',
    city: 'Chitwan',
    address: 'Bharatpur, Chitwan',
    phone: '+977-56-567890',
    email: 'chitwan@3starfoods.com',
    coordinates: [27.7000, 84.4333]
  },
  {
    id: '4',
    name: 'Butwal Fresh Foods',
    city: 'Butwal',
    address: 'Main Road, Butwal',
    phone: '+977-71-540123',
    email: 'butwal@3starfoods.com',
    coordinates: [27.7000, 83.4483]
  },
  {
    id: '5',
    name: 'Nepalgunj Store',
    city: 'Nepalgunj',
    address: 'Main Road, Nepalgunj',
    phone: '+977-81-520123',
    email: 'nepalgunj@3starfoods.com',
    coordinates: [28.0500, 81.6167]
  },
  {
    id: '6',
    name: 'Dhankuta Dealer',
    city: 'Dhankuta',
    address: 'Main Street, Dhankuta',
    phone: '+977-26-520123',
    email: 'dhankuta@3starfoods.com',
    coordinates: [26.9833, 87.3333]
  },
  {
    id: '7',
    name: 'Dharan Dealer',
    city: 'Dharan',
    address: 'Main Road, Dharan',
    phone: '+977-25-520123',
    email: 'dharan@3starfoods.com',
    coordinates: [26.8167, 87.2833]
  },
  {
    id: '8',
    name: 'Bardibas Dealer',
    city: 'Bardibas',
    address: 'Highway Road, Bardibas',
    phone: '+977-44-520123',
    email: 'bardibas@3starfoods.com',
    coordinates: [26.7167, 85.9000]
  },
  {
    id: '9',
    name: 'Nijgad Dealer',
    city: 'Nijgad',
    address: 'Main Street, Nijgad',
    phone: '+977-44-520124',
    email: 'nijgad@3starfoods.com',
    coordinates: [27.1667, 85.1167]
  },
  {
    id: '10',
    name: 'Charikot Dealer',
    city: 'Charikot',
    address: 'Center Road, Charikot',
    phone: '+977-49-520123',
    email: 'charikot@3starfoods.com',
    coordinates: [27.6500, 86.0333]
  },
  {
    id: '11',
    name: 'Dhading Dealer',
    city: 'Dhading',
    address: 'Main Road, Dhading',
    phone: '+977-10-520123',
    email: 'dhading@3starfoods.com',
    coordinates: [27.8667, 84.9167]
  },
  {
    id: '12',
    name: 'Aabukhaireni Dealer',
    city: 'Aabukhaireni',
    address: 'Highway Road, Aabukhaireni',
    phone: '+977-65-520123',
    email: 'aabukhaireni@3starfoods.com',
    coordinates: [27.9167, 84.1167]
  },
  {
    id: '13',
    name: 'Gorkha Dealer',
    city: 'Gorkha',
    address: 'Main Street, Gorkha',
    phone: '+977-64-520123',
    email: 'gorkha@3starfoods.com',
    coordinates: [28.0000, 84.6333]
  },
  {
    id: '14',
    name: 'Khairenitar Dealer',
    city: 'Khairenitar',
    address: 'Center Road, Khairenitar',
    phone: '+977-65-520124',
    email: 'khairenitar@3starfoods.com',
    coordinates: [27.9500, 84.2500]
  },
  {
    id: '15',
    name: 'Palpa Dealer',
    city: 'Palpa',
    address: 'Main Road, Palpa',
    phone: '+977-75-520123',
    email: 'palpa@3starfoods.com',
    coordinates: [27.8667, 83.5500]
  },
  {
    id: '16',
    name: 'Pokhara Dealer',
    city: 'Pokhara',
    address: 'Lakeside Road, Pokhara',
    phone: '+977-61-520123',
    email: 'pokhara@3starfoods.com',
    coordinates: [28.2096, 83.9856]
  },
  {
    id: '17',
    name: 'Beni Dealer',
    city: 'Beni, Myagdi',
    address: 'Main Road, Beni',
    phone: '+977-69-520123',
    email: 'beni@3starfoods.com',
    coordinates: [28.3500, 83.6167]
  },
  {
    id: '18',
    name: 'Dang Dealer',
    city: 'Dang, Tulsipur',
    address: 'Highway Road, Tulsipur',
    phone: '+977-82-520123',
    email: 'dang@3starfoods.com',
    coordinates: [28.1167, 82.2833]
  },
  {
    id: '19',
    name: 'Dhangadhi Dealer',
    city: 'Dhangadhi',
    address: 'Main Road, Dhangadhi',
    phone: '+977-91-520123',
    email: 'dhangadhi@3starfoods.com',
    coordinates: [28.6833, 80.6167]
  },
  {
    id: '20',
    name: 'Mahendranagar Dealer',
    city: 'Mahendranagar',
    address: 'Highway Road, Mahendranagar',
    phone: '+977-99-520123',
    email: 'mahendranagar@3starfoods.com',
    coordinates: [28.9167, 80.3333]
  }
];

export default function DealersMap() {
  const [isClient, setIsClient] = useState(false);
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check if Leaflet is available
    const checkLeaflet = () => {
      if (typeof window !== 'undefined' && (window as unknown as { L: unknown }).L) {
        setIsLeafletLoaded(true);
      } else {
        setTimeout(checkLeaflet, 100);
      }
    };
    
    checkLeaflet();
  }, []);

  if (!isClient || !isLeafletLoaded) {
    return (
      <div className="h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden tsf-box-shodow">
      <MapContainer
        center={[28.3949, 84.1240]} // Center of Nepal
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        key="dealers-map" // Force re-render when Leaflet is ready
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {dealers.map((dealer) => (
          <Marker key={dealer.id} position={dealer.coordinates as [number, number]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-sm tsf-font-sora">{dealer.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{dealer.city}</p>
                <p className="text-xs text-gray-600">{dealer.address}</p>
                <p className="text-xs text-gray-600 mt-1">
                  <strong>Phone:</strong> {dealer.phone}
                </p>
                {dealer.email && (
                  <p className="text-xs text-gray-600">
                    <strong>Email:</strong> {dealer.email}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
