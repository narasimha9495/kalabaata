import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { CAT_COLOR, CAT_LABEL } from "../categories.js";

const CENTER = [17.9, 79.0];

export default function MapView({ places, zoom = 7 }) {
  const navigate = useNavigate();
  return (
    <MapContainer center={CENTER} zoom={zoom} scrollWheelZoom={true}>
      <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {places.map((p) => {
        const [lng, lat] = p.location.coordinates;
        return (
          <CircleMarker key={p._id} center={[lat, lng]} radius={8}
            pathOptions={{ color: "#1a1511", weight: 1.4, fillColor: CAT_COLOR[p.category] || "#b98a34", fillOpacity: 0.92 }}
            eventHandlers={{ click: () => navigate(`/place/${p._id}`) }}>
            <Tooltip direction="top" offset={[0, -6]}>
              <strong>{p.name}</strong> — {CAT_LABEL[p.category]}<br />{p.district}
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
