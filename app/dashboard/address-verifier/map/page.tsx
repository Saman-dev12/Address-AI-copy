"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ResponsiveContainer from '@/app/responsive-container';
import { useOutputAddressStore } from '@/zustand/address';

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import {  ExternalLinkIcon } from 'lucide-react';

const MapPage = () => {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const { outputAddress } = useOutputAddressStore();
  

  useEffect(() => {
    const geocode = async () => {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${outputAddress?.corrected_address}`);
      const data = await response.json();
      if (data && data.length > 0) {
        setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
    };

    if (outputAddress) {
      geocode();
    }
  }, [outputAddress]);

  useEffect(() => {
    // This effect runs on the client-side only
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    }
  }, []);

  return (
    <ResponsiveContainer
      heading="Address on Map"
      description="View the address location on a map"
    >
      <div className="container mx-auto p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Address on Map</CardTitle>
          </CardHeader>
          <CardContent>
                <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${outputAddress?.corrected_address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:bg-gray-100 p-2 rounded-md" 
                    >
                    
                    <strong>Address: </strong> {outputAddress?.corrected_address}
                    <ExternalLinkIcon className="h-4 w-4 ml-2" /> 
                
                
                </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {!coordinates ? (
              <Skeleton className="h-[600px] w-full" />
            ) : (
              <div className="h-[600px] w-full">
                <MapContainer center={coordinates} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={coordinates}>
                    <Popup>
                      <div>
                        <strong>{outputAddress?.corrected_address}</strong>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ResponsiveContainer>
  );
};

export default MapPage;
