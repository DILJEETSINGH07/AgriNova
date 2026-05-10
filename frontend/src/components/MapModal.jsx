import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const farmIcon = L.divIcon({
  className: 'bg-transparent',
  html: `<div class="bg-agrigreen-600 text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white shadow-lg"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
  iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32]
});

const mandiIcon = L.divIcon({
  className: 'bg-transparent',
  html: `<div class="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white shadow-lg"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v18H3z"/><path d="M12 8v8"/><path d="M8 12h8"/></svg></div>`,
  iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32]
});

const MandiFetcher = ({ setMandis }) => {
  const map = useMapEvents({
    moveend: () => {
      fetchMandis(map.getBounds());
    }
  });

  const fetchMandis = async (bounds) => {
    try {
      const query = `
        [out:json][timeout:10];
        node["amenity"="marketplace"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
        out body;
      `;
      const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      const newMandis = data.elements.map(el => ({
        id: el.id,
        name: el.tags.name || 'Local Sabji Mandi',
        lat: el.lat,
        lng: el.lon
      }));
      setMandis(newMandis);
    } catch (err) {
      console.error('Failed to fetch mandis', err);
    }
  };

  useEffect(() => {
    fetchMandis(map.getBounds());
  }, []);

  return null;
};

export default function MapModal({ isOpen, onClose, onSelectLocation, products }) {
  const [mandis, setMandis] = useState([]);

  if (!isOpen) return null;

  // Extract unique farms from products
  const farms = [];
  const farmIds = new Set();
  
  products.forEach(p => {
    if (p.farmer && p.farmer.coordinates && !farmIds.has(p.farmer._id)) {
      farms.push(p.farmer);
      farmIds.add(p.farmer._id);
    }
  });

  const center = farms.length > 0 
    ? [farms[0].coordinates.lat, farms[0].coordinates.lng]
    : [28.6139, 77.2090]; // Default New Delhi

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden shadow-2xl relative"
        >
          <div className="flex justify-between items-center p-4 border-b">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Explore Nearby Farms & Mandis</h2>
              <p className="text-sm text-gray-500">Discover fresh produce locations around you. Pan to find real Sabji Mandis.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="flex-grow relative z-0">
            <MapContainer center={center} zoom={8} className="w-full h-full z-0">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <MandiFetcher setMandis={setMandis} />

              {farms.map(farm => (
                <Marker 
                  key={farm._id} 
                  position={[farm.coordinates.lat, farm.coordinates.lng]}
                  icon={farmIcon}
                >
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-bold text-agrigreen-700">{farm.name}'s Farm</h3>
                      <p className="text-sm text-gray-600 mb-2">{farm.location}</p>
                      <button 
                        onClick={() => {
                          onSelectLocation(farm.location);
                          onClose();
                        }}
                        className="w-full bg-agrigreen-600 text-white text-xs py-1 px-2 rounded hover:bg-agrigreen-700 transition"
                      >
                        Shop from this Farm
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {mandis.map(mandi => (
                <Marker
                  key={mandi.id}
                  position={[mandi.lat, mandi.lng]}
                  icon={mandiIcon}
                >
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-bold text-yellow-600">{mandi.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">Real-world market data</p>
                      <button 
                        onClick={() => {
                          onSelectLocation(''); 
                          onClose();
                        }}
                        className="w-full bg-yellow-500 text-white text-xs py-1 px-2 rounded hover:bg-yellow-600 transition"
                      >
                        Explore Area
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          
          <div className="p-3 bg-gray-50 border-t flex gap-6 text-sm justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-agrigreen-600"></div>
              <span>AgriNova Verified Farms</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span>Real Sabji Mandis</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
