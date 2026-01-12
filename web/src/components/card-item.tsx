import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export default function CardItem({
  title,
  icon: Icon,
  data,
}: {
  title: string;
  icon: LucideIcon;
  data: string | number;
}) {
  return (
    <>
      <Card>
        <CardContent>
          <div className="flex justify-between">
            <div className="text-sm">{title}</div>
            <div className="">
              <Icon className="size-6" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold">{data}</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
