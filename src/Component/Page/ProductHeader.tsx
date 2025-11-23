import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

export default function ProductHeader() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <h1 className="text-2xl font-bold text-balance">
          বইটির বিস্তারিত দেখুন
        </h1>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary" className="text-primary">
              Summary
            </TabsTrigger>
            <TabsTrigger value="specification">Specification</TabsTrigger>
            <TabsTrigger value="author">Author</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-6 space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              <strong>আশ্চর্যজনক</strong> বইটির সংক্ষিপ্ত কথা:
            </p>
            <p className="text-muted-foreground leading-relaxed">
              যেই ও আমার সম্পর্কে জানেন। ইতিমধ্যে যেসব বেশকিছু বিষয় ভাব চমৎকার
              আলোচনাগুলির এই বিষয় বলেছে। হিন্দু আমার জানেন এ বিষয় ভাব চমৎকার
              তথ্য সবকিছু।
            </p>
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>Report incorrect information</span>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
