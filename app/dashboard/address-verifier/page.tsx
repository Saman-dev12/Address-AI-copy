import CSVDropper from "./components/csv-dropper";

const AddressVerifierPage = () => {
  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl text-center lg:text-left font-bold leading-none mb-6">Address Verification</h1>
      <hr className="my-6" />
      <CSVDropper />
    </div>
  );
};

export default AddressVerifierPage;