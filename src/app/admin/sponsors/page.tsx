"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Building2, Download, FileText, Phone, Plus } from "lucide-react";

// Mock des sponsors
const MOCK_PIPELINE = [
  { id: "1", name: "Vermeg", tier: "Or", amount: 3000, stage: "PROSPECT", contact: "contact@vermeg.com" },
  { id: "2", name: "Orange", tier: "Argent", amount: 2000, stage: "NEGOCIATION", contact: "partenariats@orange.tn" },
  { id: "3", name: "Cisco", tier: "Platine", amount: 5000, stage: "ACTIF", contact: "academy@cisco.com" },
];

export default function SponsoringPage() {
  const stages = [
    { key: "PROSPECT", label: "Prospects" },
    { key: "NEGOCIATION", label: "En Négociation" },
    { key: "ACTIF", label: "Actifs / Signés" }
  ];

  return (
    <div className="p-8 space-y-8 bg-muted/20 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sponsoring & Partenariats</h1>
          <p className="text-muted-foreground mt-1">Gérez le pipeline des sponsors et la documentation financière.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nouveau Sponsor
        </Button>
      </div>

      {/* KPI financiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Total</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10,000 TND</div>
            <p className="text-xs text-muted-foreground">Objectif annuel: 15,000 TND</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Montant Signé/Actif</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">5,000 TND</div>
            <p className="text-xs text-muted-foreground">Soit 50% du pipeline</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Documents récents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="truncate">Contrat_Cisco_2024.pdf</span>
              <Download className="h-4 w-4 text-primary cursor-pointer" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="truncate">Dossier_Sponsoring_V2.pdf</span>
              <Download className="h-4 w-4 text-primary cursor-pointer" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stages.map(stage => (
          <div key={stage.key} className="flex flex-col bg-muted/40 rounded-xl p-4 border border-dashed">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">{stage.label}</h3>
              <Badge variant="secondary">
                {MOCK_PIPELINE.filter(s => s.stage === stage.key).length}
              </Badge>
            </div>
            <div className="space-y-4">
              {MOCK_PIPELINE.filter(s => s.stage === stage.key).map(sponsor => (
                <Card key={sponsor.id} className="cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{sponsor.name}</CardTitle>
                      <Badge variant="outline">{sponsor.tier}</Badge>
                    </div>
                    <CardDescription className="font-medium text-foreground">
                      {sponsor.amount} TND
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                      <Phone className="h-3 w-3 mr-1" />
                      {sponsor.contact}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
