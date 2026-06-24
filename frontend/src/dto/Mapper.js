/**
 * Generic Mapper Utility to safely instantiate ES6 DTO classes from raw JSON payloads.
 */
export const mapToDto = (data, DtoClass) => {
  if (!data) return null;
  if (Array.isArray(data)) {
    return data.map(item => new DtoClass(item));
  }
  return new DtoClass(data);
};
