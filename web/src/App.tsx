import CardItem from "@/components/card-item";
import { HistoryChart } from "@/components/history-chart";
import WelcomeHeader from "@/components/welcome-header";
import { socket } from "@/lib/socket";
import { Cloud, Droplets, House, Thermometer } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface DataFromServer {
  deviceCode: string;
  temp?: number | null;
  hum?: number | null;
  gas?: number | null;
  flame?: number | null;
}

interface DataProps {
  deviceCode: string;
  temp: string;
  hum: string;
  gas: string;
  flame: boolean;
}

type AlertType = {
  type: string;
  message: string;
  severity: "WARNING" | "DANGER";
  value: number;
};

export default function App() {
  const [data, setData] = useState<DataProps>({
    deviceCode: "No Data Yet",
    temp: "No Data Yet",
    hum: "No Data Yet",
    gas: "No Data Yet",
    flame: false,
  });

  useEffect(() => {
    socket.connect();

    socket.on("sensor:alert", (alert: AlertType) => {
      if (alert.severity === "DANGER" && alert.type === "FLAME_DETECTED") {
        toast.error(`${alert.type} - ${alert.message}`, { duration: 8000 });
      }

      toast.error(`${alert.type} - ${alert.message}`);
    });

    socket.on("sensor:update", (dataFromServer: DataFromServer) => {
      setData({
        deviceCode: dataFromServer.deviceCode,
        temp: dataFromServer.temp ? `${dataFromServer.temp} °C` : ``,
        hum: dataFromServer.hum ? `${dataFromServer.hum}% RH` : ``,
        gas: dataFromServer.gas ? `${dataFromServer.gas} PPM` : ``,
        flame: dataFromServer.flame === 1 ? true : false,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="w-full min-h-screen px-16 py-6 bg-background text-sm">
      <div className="flex flex-wrap lg:flex-nowrap gap-5">
        <div className="w-4/5">
          <div className="-space-y-2">
            <h1 className="text-primary font-hg text-4xl flex items-center">
              GREEN H
              <House />
              USE
            </h1>
            <p className="text-sm text-muted-foreground">
              Dashboard Monitoring System
            </p>
          </div>
          <div className="mt-10">
            <WelcomeHeader />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-5">
            <CardItem
              title="Temperature"
              data={data?.temp}
              icon={Thermometer}
            />
            <CardItem title="Humidity" data={data?.hum} icon={Droplets} />
            <CardItem title="Gas Level" data={data?.gas} icon={Cloud} />
          </div>
          <div className="mt-5">
            <HistoryChart />
          </div>
        </div>
        <div className="w-1/5">sdfdf</div>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
        }}
      />
    </div>
  );
}
