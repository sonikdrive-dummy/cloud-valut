import { useState } from "react";
import { TopNavigation } from "@/components/top-navigation";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Download, Check } from "lucide-react";

export default function SubscriptionPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const billingHistory = [
    {
      id: 1,
      period: "December 2024",
      plan: "Pro Plan - Monthly",
      amount: "$29.99",
      status: "paid",
    },
    {
      id: 2,
      period: "November 2024",
      plan: "Pro Plan - Monthly",
      amount: "$29.99",
      status: "paid",
    },
    {
      id: 3,
      period: "October 2024",
      plan: "Pro Plan - Monthly",
      amount: "$29.99",
      status: "paid",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      <TopNavigation
        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 md:ml-64 p-6 pt-24">
        <div className="max-w-4xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2" data-testid="text-page-title">
              Subscription & Billing
            </h2>
            <p className="text-muted-foreground">
              Manage your CloudVault Pro subscription and billing details
            </p>
          </div>

          {/* Current Plan */}
          <Card className="glass border-white/20 mb-6">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <Crown className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground" data-testid="text-plan-name">
                        Pro Plan
                      </h3>
                      <p className="text-muted-foreground">5TB storage • Advanced features</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary" data-testid="text-storage-amount">
                        5TB
                      </div>
                      <div className="text-sm text-muted-foreground">Storage</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary" data-testid="text-file-size-limit">
                        ∞
                      </div>
                      <div className="text-sm text-muted-foreground">File Size</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary" data-testid="text-team-members">
                        10
                      </div>
                      <div className="text-sm text-muted-foreground">Team Members</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary" data-testid="text-support-level">
                        24/7
                      </div>
                      <div className="text-sm text-muted-foreground">Support</div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-foreground" data-testid="text-plan-price">
                    $29.99
                  </div>
                  <div className="text-muted-foreground mb-4">per month</div>
                  <Button variant="secondary" data-testid="button-change-plan">
                    Change Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card className="glass border-white/20 mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Billing History</CardTitle>
                <Button 
                  variant="link" 
                  className="text-primary hover:text-primary/80 p-0"
                  data-testid="button-download-all"
                >
                  Download All <Download className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billingHistory.map((bill) => (
                  <div 
                    key={bill.id}
                    className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                    data-testid={`billing-item-${bill.id}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground" data-testid={`text-bill-period-${bill.id}`}>
                          {bill.period}
                        </div>
                        <div className="text-sm text-muted-foreground" data-testid={`text-bill-plan-${bill.id}`}>
                          {bill.plan}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-foreground" data-testid={`text-bill-amount-${bill.id}`}>
                        {bill.amount}
                      </div>
                      <Button 
                        variant="link" 
                        className="text-sm text-primary hover:text-primary/80 p-0 h-auto"
                        data-testid={`button-download-${bill.id}`}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="glass border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Payment Method</CardTitle>
                <Button 
                  variant="link" 
                  className="text-primary hover:text-primary/80 p-0"
                  data-testid="button-add-payment-method"
                >
                  Add Payment Method
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 p-4 bg-secondary rounded-lg">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <i className="fab fa-cc-visa text-blue-500 text-xl"></i>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground" data-testid="text-payment-method">
                    Visa ending in 4242
                  </div>
                  <div className="text-sm text-muted-foreground" data-testid="text-payment-expiry">
                    Expires 12/2027
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  data-testid="button-payment-menu"
                >
                  <i className="fas fa-ellipsis-h"></i>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
