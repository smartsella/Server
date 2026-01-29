/**
 * Generate user ID based on name initials and timestamp
 * Format: [Initials][HHMM][YYYY][DD][MM]
 * Example: John Doe at 14:25 on 29/12/2025 => JD142520252912
 * 
 * @param {string} fullName - Full name of the user
 * @param {Date} timestamp - Optional timestamp, defaults to current time
 * @returns {string} Generated ID
 */
export function generateUserId(fullName, timestamp = new Date()) {
  // Extract initials from full name
  const nameParts = fullName.trim().split(/\s+/);
  const initials = nameParts
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
  
  // Pad with 'X' if only one initial
  const paddedInitials = initials.length === 1 ? initials + 'X' : initials;
  
  // Extract time components
  const hours = String(timestamp.getHours()).padStart(2, '0');
  const minutes = String(timestamp.getMinutes()).padStart(2, '0');
  const year = timestamp.getFullYear();
  const day = String(timestamp.getDate()).padStart(2, '0');
  const month = String(timestamp.getMonth() + 1).padStart(2, '0');
  
  // Format: [Initials][HHMM][YYYY][DD][MM]
  const userId = `${paddedInitials}${hours}${minutes}${year}${day}${month}`;
  
  return userId;
}

/**
 * Generate service ID
 * Similar format to user ID but with service prefix
 */
export function generateServiceId(serviceName, timestamp = new Date()) {
  return generateUserId(serviceName, timestamp);
}
