"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

const CSVDropper = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="border-purple-500 border rounded-2xl h-64 sm:h-80 md:h-96 mt-6 sm:mt-8 md:mt-12 shadow-lg flex flex-col items-center justify-center p-4">
      <Image
        src="/tool-upload.jpg"
        alt="CSV File"
        width={100}
        height={100}
        priority={true}
        className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 hover:cursor-pointer"
        onClick={(e) => inputRef.current?.click()}
      />
      <h3 className="text-lg sm:text-xl mt-4 text-center">Drag and drop CSV file here</h3>
      <input type="file" accept=".csv" hidden ref={inputRef} />
      <p className="my-3 text-slate-400 text-base sm:text-lg">Or</p>
      <Button onClick={(e) => inputRef.current?.click()}>
        <Plus className="size-4 mr-2" />
        Browse here
      </Button>
    </div>
  );
};

export default CSVDropper;