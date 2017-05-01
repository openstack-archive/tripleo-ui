export function findClosestWithAttribute(element, attrName) {
  // If the element has a name attr, return it.
  // Otherwise try the parent element.
  if (element) {
    return (
      element[attrName] ||
      findClosestWithAttribute(element.parentElement, attrName)
    );
  }
}
