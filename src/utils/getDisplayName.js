export default function getDisplayName(Component) {
  const comp = Component.$$typeof ? Component.type : Component;

  return (
    comp.displayName ||
    comp.name ||
    (typeof comp === 'string' && comp.length > 0 ? comp : 'Unknown')
  );
}
