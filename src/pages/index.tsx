import BatchProcess from "@/components/batch";
import SingleProcess from "@/components/single";
import { Tabs, Tab } from "@heroui/tabs";
import { useState } from "react";

export default function IndexPage() {
  const [activeTab, setActiveTab] = useState<React.Key>("single");

  const handleChangeTab = (key: React.Key) => {
    setActiveTab(key);
  };

  return (
    <>
      <Tabs fullWidth color="danger" onSelectionChange={handleChangeTab}>
        <Tab key="single" title="Single Process" />
        <Tab key="batch" title="Batch Process" />
      </Tabs>
      {activeTab === "single" && <SingleProcess />}
      {activeTab === "batch" && <BatchProcess />}
    </>
  );
}
