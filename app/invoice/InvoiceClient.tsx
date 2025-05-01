// app/invoice/InvoiceClient.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Item, InvoiceData, generateInvoicePdfBlob } from "./invoicePdf";

export default function InvoiceClient() {
  const [company, setCompany] = useState<InvoiceData["company"]>({
    name: "",
    address: "",
    mobile: "",
    email: "",
  });
  const [client, setClient] = useState<InvoiceData["client"]>({
    name: "",
    address: "",
    mobile: "",
    email: "",
  });
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [orderNumber, setOrderNumber] = useState("");
  const [currency, setCurrency] = useState<InvoiceData["currency"]>("INR");
  const [items, setItems] = useState<Item[]>([
    { description: "", rate: 0, qty: 1 },
  ]);

  const total = items.reduce((sum, it) => sum + it.rate * it.qty, 0);

  function addItem() {
    setItems((p) => [...p, { description: "", rate: 0, qty: 1 }]);
  }
  function updateItem(idx: number, field: keyof Item, value: string | number) {
    setItems((p) =>
      p.map((it, i) =>
        i === idx
          ? {
              ...it,
              [field]: field === "description" ? String(value) : Number(value),
            }
          : it
      )
    );
  }

  async function handleDownload() {
    const data: InvoiceData = {
      company,
      client,
      date,
      orderNumber,
      currency,
      items,
      total,
    };
    const blob = await generateInvoicePdfBlob(data);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `INV-${orderNumber || date}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Currency */}
          <div className="flex flex-col">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={currency}
              onValueChange={(v) => setCurrency(v as InvoiceData["currency"])}
            >
              <SelectTrigger id="currency" className="mt-1 w-32">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">INR (₹)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Your Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Company</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex flex-col">
                <Label htmlFor="comp-name">Name</Label>
                <Input
                  id="comp-name"
                  className="mt-1"
                  placeholder="Company Name"
                  value={company.name}
                  onChange={(e) =>
                    setCompany((c) => ({ ...c, name: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col sm:col-span-2">
                <Label htmlFor="comp-address">Address</Label>
                <Textarea
                  id="comp-address"
                  className="mt-1"
                  placeholder="Street, City, ZIP"
                  value={company.address}
                  onChange={(e) =>
                    setCompany((c) => ({ ...c, address: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="comp-mobile">Mobile</Label>
                <Input
                  id="comp-mobile"
                  className="mt-1"
                  placeholder="+1 555 1234"
                  value={company.mobile}
                  onChange={(e) =>
                    setCompany((c) => ({ ...c, mobile: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="comp-email">Email</Label>
                <Input
                  id="comp-email"
                  type="email"
                  className="mt-1"
                  placeholder="you@company.com"
                  value={company.email}
                  onChange={(e) =>
                    setCompany((c) => ({ ...c, email: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Billing Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
              <div className="flex flex-col sm:col-span-2">
                <Label htmlFor="client-name">Client Name</Label>
                <Input
                  id="client-name"
                  className="mt-1"
                  placeholder="Client Name"
                  value={client.name}
                  onChange={(e) =>
                    setClient((c) => ({ ...c, name: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="inv-date">Date</Label>
                <Input
                  id="inv-date"
                  type="date"
                  className="mt-1"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:col-span-2">
                <Label htmlFor="client-address">Client Address</Label>
                <Textarea
                  id="client-address"
                  className="mt-1"
                  placeholder="Client Address"
                  value={client.address}
                  onChange={(e) =>
                    setClient((c) => ({ ...c, address: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="order-num">Order #</Label>
                <Input
                  id="order-num"
                  className="mt-1"
                  placeholder="e.g. 1024"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="client-mobile">Mobile</Label>
                <Input
                  id="client-mobile"
                  className="mt-1"
                  placeholder="+1 555 6789"
                  value={client.mobile}
                  onChange={(e) =>
                    setClient((c) => ({ ...c, mobile: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="client-email">Email</Label>
                <Input
                  id="client-email"
                  type="email"
                  className="mt-1"
                  placeholder="client@example.com"
                  value={client.email}
                  onChange={(e) =>
                    setClient((c) => ({ ...c, email: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Line Items</h3>
            {items.map((it, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-6 gap-x-6 gap-y-4"
              >
                <div className="flex flex-col sm:col-span-3">
                  <Label>Description</Label>
                  <Input
                    className="mt-1"
                    placeholder="Item description"
                    value={it.description}
                    onChange={(e) =>
                      updateItem(idx, "description", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <Label>Rate</Label>
                  <Input
                    type="number"
                    className="mt-1"
                    placeholder="0.00"
                    value={it.rate}
                    onChange={(e) => updateItem(idx, "rate", +e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <Label>Qty</Label>
                  <Input
                    type="number"
                    className="mt-1"
                    placeholder="1"
                    value={it.qty}
                    onChange={(e) => updateItem(idx, "qty", +e.target.value)}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              type="button"
              onClick={addItem}
              className="w-full"
            >
              + Add Item
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button size="lg" onClick={handleDownload}>
            Download Invoice PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
