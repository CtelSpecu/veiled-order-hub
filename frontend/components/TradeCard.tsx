"use client";

import { OrderInfo, ClearOrder } from "@/hooks/useVeiledOrder";

type TradeCardProps = {
  order: OrderInfo;
  clearOrder?: ClearOrder;
  onDecrypt: (orderIndex: number) => void;
  canDecrypt: boolean;
  isDecrypting: boolean;
};

export const TradeCard = ({
  order,
  clearOrder,
  onDecrypt,
  canDecrypt,
  isDecrypting,
}: TradeCardProps) => {
  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="card bg-base-100 shadow-xl border-2 border-black">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h2 className="card-title">
            Order #{order.orderIndex}
            <span
              className={`badge ${
                order.isBuy ? "badge-success" : "badge-error"
              }`}
            >
              {order.isBuy ? "BUY" : "SELL"}
            </span>
          </h2>
        </div>

        {clearOrder ? (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">Amount:</span>
              <span className="font-mono">{clearOrder.amount.toString()} ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Price:</span>
              <span className="font-mono">${clearOrder.price.toString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Total Value:</span>
              <span className="font-mono font-bold">
                ${(Number(clearOrder.amount) * Number(clearOrder.price)).toFixed(2)}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="badge badge-info">Encrypted</div>
            <div className="text-sm text-gray-600">
              Amount and Price are hidden. Click Decrypt to reveal.
            </div>
          </div>
        )}

        <div className="divider"></div>

        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Owner:</span>
            <span className="font-mono">{formatAddress(order.owner)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Timestamp:</span>
            <span>{formatTimestamp(order.timestamp)}</span>
          </div>
        </div>

        {!clearOrder && (
          <div className="card-actions justify-end mt-4">
            <button
              className={`btn btn-sm btn-primary ${
                !canDecrypt || isDecrypting ? "btn-disabled" : ""
              }`}
              onClick={() => onDecrypt(order.orderIndex)}
              disabled={!canDecrypt || isDecrypting}
            >
              {isDecrypting ? "Decrypting..." : "Decrypt"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

