import GoogleMapReact from "google-map-react";
import { FaMapMarkerAlt } from "react-icons/fa";

const defaultCenter = {
  lat: 13.0316,
  lng: 80.1819,
};

const defaultZoom = 15;

const Marker = () => (
  <FaMapMarkerAlt className="text-4xl text-red-600" />
);

export default function OfficeLocation() {
  return (
    <section className="relative py-20 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Visit Our Office
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Come say hello at our Chennai office
        </p>

        <div className="bg-white rounded-3xl p-4 shadow-lg border-4 border-indigo-500 overflow-hidden">
          <div className="aspect-video rounded-2xl overflow-hidden">
            <GoogleMapReact
              bootstrapURLKeys={{
                key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
              }}
              defaultCenter={defaultCenter}
              defaultZoom={defaultZoom}
            >
              <Marker lat={13.0316} lng={80.1819} />
            </GoogleMapReact>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-2xl font-bold text-gray-900">
            Ramapuram, Chennai
          </p>
          <p className="text-gray-600">Chennai, India - 600089</p>
        </div>
      </div>
    </section>
  );
}
