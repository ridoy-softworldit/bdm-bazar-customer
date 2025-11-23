"use client"

interface TabsProps {
    activeTab: string
    setActiveTab: (tab: string) => void
}

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
    const tabs = ["summary", "specification", "author"]

    return (
        <div className="flex flex-col">
            <div className="relative w-[300px] text-[12px]">
                <div className="absolute bottom-0 left-0 w-full h-px bg-gray-300 z-0"></div>
                <div className="grid grid-cols-3 relative z-10">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`py-2 text-center relative font-medium border-l border-r border-gray-300 ${activeTab === tab ? "border-b-0 text-gray-800" : "text-gray-500"}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === "summary" ? "Summary" : tab === "specification" ? "Specification" : "Author"}
                            {activeTab === tab && (
                                <span className="absolute top-0 left-0 w-full h-1 bg-green-500 transition-all duration-300" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
