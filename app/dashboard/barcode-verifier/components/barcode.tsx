"use client";

import React, { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Loader2, Upload, Camera } from "lucide-react";
import { IScannerControls } from '@zxing/browser';

export default function BarcodeScanner() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef(new BrowserMultiFormatReader());
  const [scannerControls, setScannerControls] = useState<IScannerControls | null>(null);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopBarcodeScanning();
    };
  }, []);

  // Handle file selection for barcode image upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setExtractedText(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload an image file first.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageSrc = e.target?.result as string;
      if (imageSrc) {
        try {
          const result = await codeReader.current.decodeFromImage(undefined, imageSrc);
          setExtractedText(result.getText());
          setError(null);
        } catch (err) {
          if (err instanceof NotFoundException) {
            setError("No barcode found in the image.");
          } else {
            setError("Error decoding barcode.");
          }
          setExtractedText(null);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const startBarcodeScanning = async () => {
    setIsScanning(true);
    setError(null);

    try {
      // Enumerate video input devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputDevices = devices.filter(device => device.kind === 'videoinput');

      if (videoInputDevices.length === 0) {
        setError("No camera devices found.");
        setIsScanning(false);
        return;
      }

      // Use the first available device as the default
      const selectedDeviceId = videoInputDevices[0].deviceId;

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined },
      });

      // Assign the stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        // Start decoding from the video device continuously
        await codeReader.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              setExtractedText(result.getText());
              stopBarcodeScanning(); // Stop scanning once a barcode is detected
            } else if (err && !(err instanceof NotFoundException)) {
              console.error(err);
              setError("Error during barcode scanning.");
            }
          }
        );
      } else {
        setError("Video reference is not available.");
      }
    } catch (err) {
      console.error("Error starting barcode scanning:", err);
      setError("Failed to start barcode scanning. Please try again.");
      setIsScanning(false);
    }
  };

  // Function to stop the barcode scanning
  const stopBarcodeScanning = () => {
    if (scannerControls) {
      scannerControls.stop(); // Stop barcode scanning
      setScannerControls(null); // Clear the controls
    }

    // Stop the video stream if it exists
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop()); // Stop all tracks
      videoRef.current.srcObject = null; // Clear the video source
    }

    setIsScanning(false);
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Barcode Information Extractor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG or PDF (MAX. 10MB)
                </p>
              </div>
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,.pdf"
              />
            </label>
            {file && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                File selected: {file.name}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || isScanning}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Extract Information
              </>
            )}
          </Button>
        </form>

        <div className="mt-4">
          <Button 
            onClick={isScanning ? stopBarcodeScanning : startBarcodeScanning} 
            className="w-full"
            disabled={!codeReader.current}
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Stop Scanning
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Start Barcode Scanning
              </>
            )}
          </Button>
        </div>

        {isScanning && (
          <div className="mt-4">
            <video ref={videoRef} className="w-full" />
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg dark:bg-red-900 dark:text-red-100">
            {error}
          </div>
        )}

        {extractedText && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Extracted Information:</h3>
            <div className="p-4 bg-gray-100 rounded-lg whitespace-pre-wrap dark:bg-gray-800 dark:text-gray-200">
              {extractedText}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}