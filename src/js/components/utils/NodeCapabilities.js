/**
 * Convert Node's capabilities string to object
 */
export const parseNodeCapabilities = (capabilities) => {
  // "cpu_hugepages:true,boot_option:local,cpu_aes:true,cpu_hugepages_1g:true"
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
// export const stringifyNodeCapabilities = (capabilities) => {
//
// };
