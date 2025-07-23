import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import axios from 'axios';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapView = ({ address }) => {
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const response = await axios.get(`https://api.geoapify.com/v1/geocode/search`, {
          params: {
            text: address,
            apiKey: 'c6955657f17a49f3bc8b19ef57f44248',
          },
        });
        const result = response.data.features[0];
        if (response.data.features.length > 0 && result) {
          setCoords({
            lat: result.geometry.coordinates[1],
            lng: result.geometry.coordinates[0],
          });
        } else {
          console.warn("Không tìm thấy tọa độ cho địa chỉ:", address);
        }
      } catch (error) {
        console.error("Lỗi khi lấy tọa độ:", error);
      }
    };

    if (address) fetchCoords();
  }, [address]);

  if (!coords)
  return (
    <div className="text-center p-4">
      Đang tải bản đồ cho địa chỉ: <strong>{address}</strong>
    </div>
  );

  return (
    <MapContainer
      center={coords}
      zoom={15}
      scrollWheelZoom={false}
      className="z-0"
      style={{ height: '300px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={coords}>
        <Popup>{address}</Popup>
      </Marker>
    </MapContainer>

  );
};

export default MapView;
