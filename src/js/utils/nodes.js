/**
 * Convert Node's capabilities string to object
 */
export const parseNodeCapabilities = (capabilities) => {
  let capsObject = {};
  capabilities.split(',').forEach(cap => {
    let tup = cap.split(/:(.+)/);
    capsObject[tup[0]] = tup[1];
  });
  return capsObject;
};

/**
 * Convert Node's capabilities object to string
 */
export const stringifyNodeCapabilities = (capabilities) => {
  return Object.keys(capabilities).reduce((caps, key) => {
    if (capabilities[key] === '') {
      return caps;
    } else {
      caps.push(`${key}:${capabilities[key]}`);
      return caps;
    }
  }, []).join(',');
};

/**
 * Set or update Node capability
 */
export const setNodeCapability = (capabilitiesString, key, newValue) => {
  let capabilitiesObj = parseNodeCapabilities(capabilitiesString);
  capabilitiesObj[key] = newValue;
  return stringifyNodeCapabilities(capabilitiesObj);
};
