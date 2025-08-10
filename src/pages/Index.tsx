
import { BlockchainAnalytics } from "@/components/dashboard/BlockchainAnalytics";
import { TopMemecoins } from "@/components/dashboard/TopMemecoins";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { ProfitSimulator } from "@/components/dashboard/ProfitSimulator";
import { MemeScanner } from "@/components/dashboard/MemeScanner";
import { LaunchCalendar } from "@/components/dashboard/LaunchCalendar";
import { TokenSwap } from "@/components/dashboard/TokenSwap";
import { BotAccess } from "@/components/dashboard/BotAccess";
import { Header } from "@/components/layout/Header";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-2 py-4 md:py-6 max-w-screen-2xl">
        <div className="space-y-4 md:space-y-6">
          <BotAccess />
          <TopMemecoins />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <BlockchainAnalytics />
            </div>
            
            <div>
              <PerformanceMetrics />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1">
              <ProfitSimulator />
            </div>
            
            <div className="lg:col-span-1">
              {isMobile ? <TokenSwap /> : <MemeScanner />}
            </div>
            
            <div className="lg:col-span-1">
              {isMobile ? <MemeScanner /> : <TokenSwap />}
            </div>
          </div>
          
          <div>
            <LaunchCalendar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
