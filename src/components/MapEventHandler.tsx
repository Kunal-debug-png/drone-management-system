'use client';

import { useMapEvents } from 'react-leaflet';

import { LeafletMouseEvent } from 'leaflet';

interface MapEventHandlerProps {
  onMapClick: (e: LeafletMouseEvent) => void;
}

export default function MapEventHandler({ onMapClick }: MapEventHandlerProps) {
  useMapEvents({
    click: onMapClick,
  });

  return null;
}
