import { useState, useRef, useEffect } from 'react';
import { MapPin, X, Check, ChevronDown, Search, Home, Briefcase, Plus, AlertCircle, Loader } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from '../styles/addressdropdown.module.css';

const CompactAddressDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [addressDetails, setAddressDetails] = useState({
    fullAddress: '',
    apartment: '',
    landmark: '',
    addressType: 'home'
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({ lat: 12.9716, lng: 77.5946 });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    search: null,
    geolocation: null,
    geocoding: null,
    general: null
  });
  
  const dropdownRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clean up map when dropdown closes
  useEffect(() => {
    if (!isOpen && mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
      markerInstance.current = null;
    }
  }, [isOpen]);

  // Initialize map when dropdown opens
  useEffect(() => {
    if (isOpen && mapRef.current) {
      try {
        // Clean up any existing map instance first
        if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
          markerInstance.current = null;
        }
        
        // Create a new map instance
        mapInstance.current = L.map(mapRef.current).setView([currentLocation.lat, currentLocation.lng], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapInstance.current);

        markerInstance.current = L.marker([currentLocation.lat, currentLocation.lng], { draggable: true }).addTo(mapInstance.current);

        markerInstance.current.on('dragend', function (e) {
          const latlng = e.target.getLatLng();
          fetchReverseGeocode(latlng.lat, latlng.lng);
        });
      } catch (error) {
        setErrors(prev => ({ ...prev, general: "Failed to load map. Please refresh the page." }));
        console.error("Map initialization error:", error);
      }
    }
  }, [isOpen, currentLocation]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    setErrors(prev => ({ ...prev, geolocation: null }));
    
    if (!navigator.geolocation) {
      setErrors(prev => ({ ...prev, geolocation: "Geolocation is not supported by your browser" }));
      setIsLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        fetchReverseGeocode(latitude, longitude);
        setIsLoading(false);
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access was denied.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get your location timed out.";
            break;
        }
        
        setErrors(prev => ({ ...prev, geolocation: errorMessage }));
        setIsLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const fetchSuggestions = async (query) => {
    setIsLoading(true);
    setErrors(prev => ({ ...prev, search: null }));
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setSuggestions(data);
      
      if (data.length === 0) {
        setErrors(prev => ({ ...prev, search: "No results found" }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, search: "Failed to fetch suggestions" }));
      console.error("Address search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length > 2) {
        fetchSuggestions(searchQuery);
      } else if (searchQuery.length > 0 && searchQuery.length <= 2) {
        setSuggestions([]);
        setErrors(prev => ({ ...prev, search: "Enter at least 3 characters" }));
      } else {
        setSuggestions([]);
        setErrors(prev => ({ ...prev, search: null }));
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const fetchReverseGeocode = async (lat, lng) => {
    setIsLoading(true);
    setErrors(prev => ({ ...prev, geocoding: null }));
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data && data.display_name) {
        setSelectedAddress(data.display_name);
        setAddressDetails(prev => ({ ...prev, fullAddress: data.display_name }));
        setSearchQuery(data.display_name);
      } else {
        throw new Error("Invalid response data");
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, geocoding: "Failed to get address for this location" }));
      console.error("Reverse geocoding error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSelect = (item) => {
    try {
      const lat = parseFloat(item.lat);
      const lon = parseFloat(item.lon);
      
      if (isNaN(lat) || isNaN(lon)) {
        throw new Error("Invalid coordinates");
      }
      
      setSelectedAddress(item.display_name);
      setAddressDetails(prev => ({ ...prev, fullAddress: item.display_name }));
      setSearchQuery(item.display_name);
      setSuggestions([]);

      if (mapInstance.current && markerInstance.current) {
        mapInstance.current.setView([lat, lon], 15);
        markerInstance.current.setLatLng([lat, lon]);
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, general: "Failed to select this address" }));
      console.error("Address selection error:", error);
    }
  };

  const handleSavedAddressSelect = (address) => {
    setSelectedAddress(address.address);
    setAddressDetails({
      fullAddress: address.address,
      apartment: '',
      landmark: '',
      addressType: address.type
    });
    setSearchQuery(address.address);
    setErrors({
      search: null,
      geolocation: null,
      geocoding: null,
      general: null
    });
  };

  const saveNewAddress = () => {
    if (!addressDetails.fullAddress.trim()) {
      setErrors(prev => ({ ...prev, general: "Please select a valid address" }));
      return;
    }
    
    try {
      if (addressDetails.fullAddress) {
        const newId = savedAddresses.length + 1;
        const newAddress = {
          id: newId,
          type: addressDetails.addressType,
          label: addressDetails.addressType === 'home' ? 'Home' :
                addressDetails.addressType === 'work' ? 'Work' : 'Other',
          address: addressDetails.fullAddress +
                  (addressDetails.apartment ? `, ${addressDetails.apartment}` : '') +
                  (addressDetails.landmark ? ` (Near ${addressDetails.landmark})` : ''),
          default: savedAddresses.length === 0
        };
        setSavedAddresses([...savedAddresses, newAddress]);
        setSelectedAddress(newAddress.address);
        setSearchQuery('');
        setAddressDetails({
          fullAddress: '',
          apartment: '',
          landmark: '',
          addressType: 'home'
        });
        setIsOpen(false);
        setErrors({
          search: null,
          geolocation: null,
          geocoding: null,
          general: null
        });
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, general: "Failed to save address" }));
      console.error("Save address error:", error);
    }
  };

  const handleSetDefault = (id) => {
    try {
      setSavedAddresses(savedAddresses.map(addr => ({
        ...addr,
        default: addr.id === id
      })));
    } catch (error) {
      setErrors(prev => ({ ...prev, general: "Failed to set default address" }));
      console.error("Set default address error:", error);
    }
  };

  const ErrorMessage = ({ message }) => {
    if (!message) return null;
    
    return (
      <div className={styles.errorMessage}>
        <AlertCircle size={12} />
        <span>{message}</span>
      </div>
    );
  };

  // Get shortened display address for the button
  const getDisplayAddress = () => {
    if (!selectedAddress) return "Select location";
    
    // Find if the address is a saved one
    const savedAddr = savedAddresses.find(addr => addr.address === selectedAddress);
    if (savedAddr) {
      return `${savedAddr.label}: ${savedAddr.address.substring(0, 25)}${savedAddr.address.length > 25 ? '...' : ''}`;
    }
    
    // Otherwise just truncate the selected address
    return selectedAddress.substring(0, 25) + (selectedAddress.length > 25 ? '...' : '');
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.locationButton}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <MapPin className={styles.addressIcon} size={16} />
        <span className={styles.buttonText}>
          {getDisplayAddress()}
        </span>
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h3 className={styles.title}>Delivery Address</h3>
            <button onClick={() => setIsOpen(false)} className={styles.closeButton}>
              <X size={16} />
            </button>
          </div>

          {errors.general && <ErrorMessage message={errors.general} />}

          {savedAddresses.length > 0 && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Saved Addresses</h4>
              <div className={styles.addressList}>
                {savedAddresses.map(addr => (
                  <div 
                    key={addr.id} 
                    className={styles.addressItem}
                    onClick={() => handleSavedAddressSelect(addr)}
                  >
                    {addr.type === 'home' ? (
                      <Home size={14} className={styles.addressIcon} />
                    ) : addr.type === 'work' ? (
                      <Briefcase size={14} className={styles.addressIcon} />
                    ) : (
                      <MapPin size={14} className={styles.addressIcon} />
                    )}
                    <div className={styles.addressContent}>
                      <div className={styles.addressHeader}>
                        <p className={styles.addressLabel}>{addr.label}</p>
                        {addr.default && (
                          <span className={styles.defaultBadge}>
                            Default
                          </span>
                        )}
                      </div>
                      <p className={styles.addressText}>{addr.address}</p>
                      {!addr.default && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetDefault(addr.id);
                          }}
                          className={styles.setDefaultButton}
                        >
                          Set as default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Add New Address</h4>

            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} size={14} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search for area, street name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search for address"
              />
              {isLoading && <Loader className={styles.loaderIcon} size={14} />}
            </div>
            
            {errors.search && <ErrorMessage message={errors.search} />}

            <div className={styles.locationActions}>
              <button
                className={styles.getCurrentLocationBtn}
                onClick={getCurrentLocation}
                disabled={isLoading}
              >
                <MapPin size={12} /> Use current location
              </button>
              {errors.geolocation && <ErrorMessage message={errors.geolocation} />}
            </div>

            <div className={styles.tagContainer}>
              <button
                className={`${styles.addressTag} ${addressDetails.addressType === 'home' ? styles.active : ''}`}
                onClick={() => setAddressDetails(prev => ({ ...prev, addressType: 'home' }))}
              >
                <Home size={12} className={styles.tagIcon} /> Home
              </button>
              <button
                className={`${styles.addressTag} ${addressDetails.addressType === 'work' ? styles.active : ''}`}
                onClick={() => setAddressDetails(prev => ({ ...prev, addressType: 'work' }))}
              >
                <Briefcase size={12} className={styles.tagIcon} /> Work
              </button>
              <button
                className={`${styles.addressTag} ${addressDetails.addressType === 'other' ? styles.active : ''}`}
                onClick={() => setAddressDetails(prev => ({ ...prev, addressType: 'other' }))}
              >
                <Plus size={12} className={styles.tagIcon} /> Other
              </button>
            </div>

            {suggestions.length > 0 && searchQuery && (
              <div className={styles.suggestionList}>
                {suggestions.map((item) => (
                  <div
                    key={item.place_id || item.osm_id}
                    className={styles.suggestionItem}
                    onClick={() => handleAddressSelect(item)}
                  >
                    {item.display_name}
                  </div>
                ))}
              </div>
            )}

            <div className={styles.mapContainer}>
              <div ref={mapRef} className={styles.map} />
              {errors.geocoding && <ErrorMessage message={errors.geocoding} />}
            </div>

            {selectedAddress && (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor="apartment" className={styles.label}>House / Flat / Block No.</label>
                  <input
                    id="apartment"
                    type="text"
                    className={styles.input}
                    placeholder="Apartment or floor number"
                    value={addressDetails.apartment}
                    onChange={(e) => setAddressDetails(prev => ({ ...prev, apartment: e.target.value }))}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="landmark" className={styles.label}>Landmark (Optional)</label>
                  <input
                    id="landmark"
                    type="text"
                    className={styles.input}
                    placeholder="E.g. Near park, school, etc."
                    value={addressDetails.landmark}
                    onChange={(e) => setAddressDetails(prev => ({ ...prev, landmark: e.target.value }))}
                  />
                </div>
              </>
            )}

            <button
              className={styles.saveButton}
              onClick={saveNewAddress}
              disabled={!addressDetails.fullAddress || isLoading}
            >
              {isLoading ? (
                <Loader size={14} className={styles.spinningLoader} />
              ) : (
                <Check size={14} className={styles.checkIcon} />
              )}
              Save Address
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactAddressDropdown;