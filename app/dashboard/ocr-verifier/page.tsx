import React from 'react'
import OCRV from './components/OCR'

function OCRVerifier() {
  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl text-center lg:text-left font-bold leading-none mb-6">OCR Verification</h1>
      <hr className="my-6" />
      <OCRV/>
    </div>
  )
}

export default OCRVerifier