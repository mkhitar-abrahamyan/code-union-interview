import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

/** Yerevan coordinators */
const defaultCenter = { lat: 40.1772, lng: 44.5035 };

const MapWithForm = () => {
  const { isLoaded } = useLoadScript({
    /** Keep this in .env */
    googleMapsApiKey: 'AIzaSyD3q0Mxt9mnz2s3PcSAHez5tJbXvbje8_Y',
  });

  const [places, setPlaces] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [form, setForm] = useState({
    lat: null,
    lng: null,
    title: '',
    description: '',
    image: null,
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('places');
    if (saved) setPlaces(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('places', JSON.stringify(places));
  }, [places]);

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setForm({
      lat,
      lng,
      title: '',
      description: '',
      image: null,
    });
    setFormVisible(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImageLoading(true);
    const reader = new FileReader();

    reader.onloadend = () => {
      const imageData = reader.result;
      setForm((prev) => ({
        ...prev,
        image: imageData,
      }));

      setTimeout(() => {
        setIsImageLoading(false);
      }, 50);
    };

    reader.readAsDataURL(file);
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isImageLoading) {
      alert('Image is still loading. Please wait.');
      return;
    }

    if (
      !form.title ||
      !form.description ||
      form.lat == null ||
      form.lng == null
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!form.image) {
      const confirmSave = window.confirm('No image attached. Continue?');
      if (!confirmSave) return;
    }

    setPlaces((prev) => [...prev, form]);

    setForm({
      lat: null,
      lng: null,
      title: '',
      description: '',
      image: null,
    });
    setFormVisible(false);
  };

  const handleDelete = (index) => {
    const updated = places.filter((_, i) => i !== index);
    setPlaces(updated);
  };

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="p-4 space-y-4">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={12}
        onClick={handleMapClick}
      >
        {places.map((place, idx) => (
          <Marker
            key={idx}
            position={{ lat: place.lat, lng: place.lng }}
            title={place.title}
          />
        ))}
      </GoogleMap>

      {formVisible && (
        <form
          onSubmit={handleSubmit}
          className="space-y-2 bg-white p-4 rounded shadow-md max-w-md"
        >
          <h2 className="text-lg font-bold">Add New Place</h2>

          <input
            type="text"
            className="w-full border border-gray-300 rounded p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Title"
            value={form.title}
            onChange={handleChange('title')}
            required
          />

          <textarea
            className="w-full border border-gray-300 rounded p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description"
            value={form.description}
            onChange={handleChange('description')}
            required
          />

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-gray-200 text-black px-3 py-2 rounded hover:bg-gray-300"
            >
              {form.image ? 'Change Image' : 'Upload Image'}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {form.image && (
              <img
                src={form.image}
                alt="preview"
                className="w-32 h-32 object-cover rounded"
              />
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={isImageLoading}
          >
            {isImageLoading ? 'Uploading...' : 'Save Place'}
          </button>
        </form>
      )}

      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Saved Places:</h3>
        {places.length === 0 && <p>No places saved yet.</p>}
        {places.map((p, i) => (
          <div key={i} className="p-2 border rounded shadow-sm">
            <h4 className="font-bold">{p.title}</h4>
            <p>{p.description}</p>
            {p.image && (
              <img
                src={p.image}
                alt={p.title}
                className="w-24 h-24 object-cover mt-2 rounded"
              />
            )}
            <button
              onClick={() => handleDelete(i)}
              className="mt-2 text-sm text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapWithForm;
