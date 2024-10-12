// File: types/react-barcode-reader.d.ts
declare module 'react-barcode-reader' {
    import { ComponentType } from 'react';
  
    interface BarcodeScannerProps {
      onError: (error: Error) => void;
      onScan: (data: string) => void;
    }
  
    const BarcodeScanner: ComponentType<BarcodeScannerProps>;
    export default BarcodeScanner;
  }