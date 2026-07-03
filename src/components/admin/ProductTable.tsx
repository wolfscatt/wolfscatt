import { Edit3, ImageIcon, Link2, Trash2 } from "lucide-react";

import type { Tables } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Product = Tables<"products">;

type ProductTableProps = {
  products: Product[];
  deletingProductId?: string | null;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

function truncateText(value: string | null, maxLength = 110) {
  if (!value) {
    return "-";
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...`;
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function ProductActions({
  product,
  onDelete,
  onEdit,
  deletingProductId,
}: {
  product: Product;
  onDelete: (product: Product) => void;
  onEdit: (product: Product) => void;
  deletingProductId?: string | null;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button type="button" variant="outline" size="sm" onClick={() => onEdit(product)}>
        <Edit3 className="h-4 w-4" />
        Duzenle
      </Button>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={() => onDelete(product)}
        disabled={deletingProductId === product.id}
      >
        <Trash2 className="h-4 w-4" />
        Sil
      </Button>
    </div>
  );
}

export function ProductTable({
  products,
  deletingProductId,
  onDelete,
  onEdit,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <Card className="border-dashed border-primary/20 bg-card/70">
        <CardContent className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ImageIcon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Henuz urun yok</h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Ilk urununuzu eklediginizde burada listelenecek ve aninda duzenlenebilir hale gelecek.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="hidden overflow-hidden rounded-3xl border border-primary/15 bg-card/80 lg:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Urun</TableHead>
              <TableHead>Kisa aciklama</TableHead>
              <TableHead>Baglantilar</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Screenshot</TableHead>
              <TableHead>Olusturma</TableHead>
              <TableHead className="w-[180px]">Islemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">/{product.slug}</p>
                  </div>
                </TableCell>
                <TableCell className="max-w-md text-sm text-muted-foreground">
                  {truncateText(product.description)}
                </TableCell>
                <TableCell>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Link2 className="h-3.5 w-3.5" />
                      <span className="truncate">{product.apk_url || "APK yok"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link2 className="h-3.5 w-3.5" />
                      <span className="truncate">{product.pdf_url || "PDF yok"}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{product.whatsapp_phone || "-"}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{product.screenshot_urls.length} adet</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(product.created_at)}
                </TableCell>
                <TableCell>
                  <ProductActions
                    product={product}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    deletingProductId={deletingProductId}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {products.map((product) => (
          <Card key={product.id} className="border-primary/15 bg-card/80">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">/{product.slug}</p>
                </div>
                <Badge variant="secondary">{product.screenshot_urls.length} gorsel</Badge>
              </div>

              <p className="text-sm text-muted-foreground">{truncateText(product.description, 160)}</p>

              <div className="grid gap-3 rounded-2xl border border-border/60 bg-background/40 p-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">APK</p>
                  <p className="truncate">{product.apk_url || "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">PDF</p>
                  <p className="truncate">{product.pdf_url || "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">WhatsApp</p>
                  <p>{product.whatsapp_phone || "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Olusturma</p>
                  <p>{formatDate(product.created_at)}</p>
                </div>
              </div>

              <ProductActions
                product={product}
                onDelete={onDelete}
                onEdit={onEdit}
                deletingProductId={deletingProductId}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
