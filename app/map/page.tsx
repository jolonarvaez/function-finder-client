import StadiaMap from '@/app/components/maps/StadiaMap';

export const metadata = {
  title: 'Interactive Map - Stadia Maps',
  description: 'Interactive map with waypoint plotting using Stadia Maps and MapLibre',
};

export default function MapPage() {
  return (
    <main
      style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <StadiaMap
        styleId="alidade_smooth"
        height="100vh"
        width="100vw"
        draggableMarkers={true}
        initialViewState={{
          longitude: 120.9842,
          latitude: 14.5995,
          zoom: 12,
        }}
      />
    </main>
  );
}

