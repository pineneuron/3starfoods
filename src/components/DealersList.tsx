'use client';

interface Dealer {
  id: string;
  name: string;
  city: string;
  address?: string;
  phone?: string;
  email?: string;
}

const dealers: Dealer[] = [
  {
    id: '1',
    name: 'Dhankuta Dealer',
    city: 'Dhankuta'
  },
  {
    id: '2',
    name: 'Itahari Meat Center',
    city: 'Itahari',
    address: 'Main Road, Itahari',
    phone: '+977-25-580123',
    email: 'itahari@3starfoods.com'
  },
  {
    id: '3',
    name: 'Dharan Dealer',
    city: 'Dharan'
  },
  {
    id: '4',
    name: 'Chitwan Meat Hub',
    city: 'Chitwan',
    address: 'Bharatpur, Chitwan',
    phone: '+977-56-567890',
    email: 'chitwan@3starfoods.com'
  },
  {
    id: '5',
    name: 'Bardibas Dealer',
    city: 'Bardibas'
  },
  {
    id: '6',
    name: 'Nijgad Dealer',
    city: 'Nijgad'
  },
  {
    id: '7',
    name: 'Charikot Dealer',
    city: 'Charikot'
  },
  {
    id: '8',
    name: 'Kathmandu Central Store',
    city: 'Kathmandu',
    address: 'New Road, Kathmandu',
    phone: '+977-1-4221234',
    email: 'kathmandu@3starfoods.com'
  },
  {
    id: '9',
    name: 'Dhading Dealer',
    city: 'Dhading'
  },
  {
    id: '10',
    name: 'Aabukhaireni Dealer',
    city: 'Aabukhaireni'
  },
  {
    id: '11',
    name: 'Gorkha Dealer',
    city: 'Gorkha'
  },
  {
    id: '12',
    name: 'Khairenitar Dealer',
    city: 'Khairenitar'
  },
  {
    id: '13',
    name: 'Pokhara Dealer',
    city: 'Pokhara'
  },
  {
    id: '14',
    name: 'Beni Dealer',
    city: 'Beni, Myagdi'
  },
  {
    id: '15',
    name: 'Palpa Dealer',
    city: 'Palpa'
  },
  {
    id: '16',
    name: 'Butwal Fresh Foods',
    city: 'Butwal',
    address: 'Main Road, Butwal',
    phone: '+977-71-540123',
    email: 'butwal@3starfoods.com'
  },
  {
    id: '17',
    name: 'Dang Dealer',
    city: 'Dang, Tulsipur'
  },
  {
    id: '18',
    name: 'Nepalgunj Store',
    city: 'Nepalgunj',
    address: 'Main Road, Nepalgunj',
    phone: '+977-81-520123',
    email: 'nepalgunj@3starfoods.com'
  },
  {
    id: '19',
    name: 'Dhangadhi Dealer',
    city: 'Dhangadhi'
  },
  {
    id: '20',
    name: 'Mahendranagar Dealer',
    city: 'Mahendranagar'
  }
];

export default function DealersList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {dealers.map((dealer) => (
        <div key={dealer.id} className="tsf-box-shodow rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold tsf-font-sora text-gray-800">{dealer.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{dealer.city}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-xl">📍</span>
            </div>
          </div>
          
          <div className="space-y-2">
            {dealer.address && (
              <div className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">📍</span>
                <p className="text-sm text-gray-600">{dealer.address}</p>
              </div>
            )}
            
            {dealer.phone && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">📞</span>
                <a href={`tel:${dealer.phone}`} className="text-sm text-blue-600 hover:text-blue-800">
                  {dealer.phone}
                </a>
              </div>
            )}
            
            {dealer.email && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">✉️</span>
                <a href={`mailto:${dealer.email}`} className="text-sm text-blue-600 hover:text-blue-800">
                  {dealer.email}
                </a>
              </div>
            )}
          </div>
          
        </div>
      ))}
    </div>
  );
}
