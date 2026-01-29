// Transform amenities from array format to true/false object format
export function transformAmenities(amenitiesData, amenitiesOptions) {
  const transformed = {}

  // Iterate through each category
  for (const category in amenitiesOptions) {
    transformed[category] = {}
    const selectedItems = amenitiesData[category] || []

    // Set true for selected items, false for others
    amenitiesOptions[category].forEach(amenity => {
      transformed[category][amenity] = selectedItems.includes(amenity)
    })
  }

  return transformed
}

// All available amenities options
export const AMENITIES_OPTIONS = {
  furniture: [
    'Furnished', 'Semi-furnished', 'Bed with mattress', 'Pillow, bedsheet, blanket',
    'Cupboard/Wardrobe', 'Study table & chair', 'Curtains', 'Fan', 'Light', 'Air conditioner/Heater'
  ],
  bathroom: [
    'Attached bathroom', 'Common bathroom', '24×7 water supply (hot & cold)', 'Geyser',
    'Western toilet', 'Indian toilet', 'Mirror', 'Bucket & mug', 'Regular cleaning'
  ],
  foodKitchen: [
    'Breakfast included', 'Lunch included', 'Dinner included', 'RO drinking water',
    'Common dining area', 'Refrigerator', 'Microwave'
  ],
  utilities: [
    'High-speed Wi-Fi', 'Electricity included', 'Power backup/Inverter', 'Water purifier (RO)'
  ],
  laundry: ['Washing machine', 'Drying area', 'Iron available'],
  cleaning: [
    'Daily room cleaning', 'Alternate day cleaning', 'Washroom cleaning',
    'Garbage disposal', 'Pest control'
  ],
  security: [
    'CCTV cameras', 'Secure entry/Biometric', 'Key access', 'Warden/Caretaker',
    'Fire safety equipment', 'First-aid kit'
  ],
  rulesConvenience: [
    'Flexible entry/exit timing', 'Visitor policy', 'Quiet hours enforced',
    'Two-wheeler parking', 'Four-wheeler parking', 'Lift available'
  ],
  location: [
    'Near college/office', 'Public transport access', 'Nearby shops/pharmacy', 'Hospital nearby'
  ]
}
