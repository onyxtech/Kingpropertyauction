import { Download, Printer } from "lucide-react";

interface ReportCardProps {
  title: string;
  subtitle: string;
  icon: any;
  gradient: string;
  count: number;
  children: React.ReactNode;
  onExportCSV?: () => void;
  onExportPDF?: () => void;
  onPrint?: () => void;
}

export default function ReportCard({ title, subtitle, icon: Icon, gradient, count, children, onExportCSV, onExportPDF, onPrint }: ReportCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className={`bg-gradient-to-r ${gradient} p-6 text-white`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="size-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <Icon className="size-7" />
            </div>
            <div>
              <h3 className="text-xl font-black">{title}</h3>
              <p className="text-white/80 text-sm">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-white/20 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-xl">
              {count} records
            </span>
            {onExportCSV && (
              <button onClick={onExportCSV} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-xl transition-all">
                <Download className="size-4" /> CSV
              </button>
            )}
            {onExportPDF && (
              <button onClick={onExportPDF} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-xl transition-all">
                <Download className="size-4" /> PDF
              </button>
            )}
            {onPrint && (
              <button onClick={onPrint} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-xl transition-all">
                <Printer className="size-4" /> Print
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        {children}
      </div>
    </div>
  );
}