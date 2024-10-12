import React from 'react'
import Barcode from './components/barcode'
import BarcodeScannerComponent from './components/BarcodeScanner'

function OCRVerifier() {
  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl text-center lg:text-left font-bold leading-none mb-6">Barcode Verification</h1>
      <hr className="my-6" />
      {/* <Barcode/> */}
      <BarcodeScannerComponent/>
    </div>
  )
}

export default OCRVerifier