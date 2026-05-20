"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart.store";
import { orderService } from "@/services";
import { toast } from "@/hooks/useToast";
import { formatCOP } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NewOrderPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const subtotal = useCartStore((s) => s.subtotal());
  const clear = useCartStore((s) => s.clear);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Neiva");
  const [extra, setExtra] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const handleConfirm = async () => {
    setError(undefined);
    if (!address.trim()) {
      setError("La dirección de entrega es obligatoria");
      return;
    }
    if (items.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }
    setSubmitting(true);
    try {
      await orderService.create({
        customerId: "",
        customerName: "",
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.name,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
        })),
        total: subtotal,
        deliveryAddress: `${address.trim()}, ${city}${extra ? ` (${extra})` : ""}`,
      });
      toast.success("Tu pedido fue registrado correctamente");
      clear();
      router.push("/my-orders");
    } catch (e: any) {
      const msg =
        e?.response?.data?.error?.message ??
        e?.message ??
        "No se pudo registrar el pedido";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <PageHeader title="Confirmar pedido" />
        <EmptyState
          icon="🛒"
          title="Tu carrito está vacío"
          description="Agrega productos desde el catálogo para crear un pedido."
          action={
            <Link href="/catalog">
              <Button>Ir al catálogo</Button>
            </Link>
          }
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Confirmar pedido"
        subtitle="Revisa los productos antes de enviar tu solicitud"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">
        <div className="space-y-5">
          <Card>
            <CardHeader
              title={`Productos en tu carrito (${items.length})`}
              subtitle="Subtotal calculado automáticamente"
            />
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3.5 p-3 border border-border rounded-xl"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-50 to-coral-50 grid place-items-center text-2xl flex-shrink-0">
                    {item.imageEmoji ?? "💊"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{item.name}</div>
                    <div className="text-xs text-text-muted">
                      {item.category} · {formatCOP(item.unitPrice)} c/u
                    </div>
                  </div>
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      type="button"
                      className="w-8 h-8 hover:bg-bg disabled:opacity-30"
                      disabled={item.quantity <= 1}
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="px-3 font-semibold text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      className="w-8 h-8 hover:bg-bg disabled:opacity-30"
                      disabled={item.quantity >= item.maxStock}
                      onClick={() => setQuantity(item.productId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="font-bold w-24 text-right text-sm">
                    {formatCOP(item.unitPrice * item.quantity)}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(item.productId)}
                    className="text-text-soft hover:text-coral-500 px-2"
                    aria-label="Eliminar"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="📍 Dirección de entrega" />
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <Label htmlFor="city">Ciudad</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="extra">Indicaciones (opcional)</Label>
                  <Input
                    id="extra"
                    placeholder="Casa con portón verde"
                    value={extra}
                    onChange={(e) => setExtra(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address" required>
                  Dirección completa
                </Label>
                <Input
                  id="address"
                  placeholder="Calle 8 # 12-34, Apto 502"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  error={error}
                />
              </div>
            </div>
          </Card>
        </div>

        <aside>
          <Card className="sticky top-6">
            <CardHeader title="Resumen del pedido" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-text-muted">
                <span>Subtotal ({items.length} productos)</span>
                <span>{formatCOP(subtotal)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Domicilio</span>
                <span className="text-emerald-600 font-semibold">Gratis</span>
              </div>
              <div className="flex justify-between pt-3 mt-2 border-t border-border font-bold text-base">
                <span>Total a pagar</span>
                <span>{formatCOP(subtotal)}</span>
              </div>
            </div>
            <Button
              fullWidth
              className="mt-4"
              onClick={handleConfirm}
              disabled={submitting}
            >
              {submitting ? "Registrando..." : "Confirmar pedido"}
            </Button>
            <Link href="/catalog" className="block mt-2">
              <Button fullWidth variant="secondary">
                Seguir comprando
              </Button>
            </Link>
            <div className="bg-primary-50 border-l-2 border-primary-500 p-3 rounded-lg mt-4 text-xs text-primary-700">
              💡 Tu pedido será enviado con estado &quot;Pendiente&quot; para que la farmacia lo procese.
            </div>
          </Card>
        </aside>
      </div>
    </>
  );
}
