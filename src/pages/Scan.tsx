
import { Navbar } from "@/components/layout/Navbar";
import { ScanTicket } from "@/components/scan/ScanTicket";

const Scan = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ScanTicket />
      </main>
    </div>
  );
};

export default Scan;
