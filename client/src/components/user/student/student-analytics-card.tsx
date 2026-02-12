import type { StudentAnalytics } from "@/api/user-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, Clock, XCircle } from "lucide-react";

interface Props {
  data: StudentAnalytics;
}

export default function StudentAnalyticsCards({ data }: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader>
          <CardTitle>Total</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">{data.total}</CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>Pending</CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent className="text-3xl font-bold">{data.pending}</CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>Approved</CardTitle>
          <CalendarCheck className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent className="text-3xl font-bold">
          {data.approved}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>Cancelled</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent className="text-3xl font-bold">
          {data.cancelled}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">
          {data.upcoming}
        </CardContent>
      </Card>
    </div>
  );
}
