"use client";

import { useState } from "react";

type OrderFormProps = {
  onSubmit: (amount: number, price: number, isBuy: boolean) => void;
  canSubmit: boolean;
  isSubmitting: boolean;
};

export const OrderForm = ({
  onSubmit,
  canSubmit,
  isSubmitting,
}: OrderFormProps) => {
  const [amount, setAmount] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [isBuy, setIsBuy] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    const priceNum = parseFloat(price);

    if (isNaN(amountNum) || isNaN(priceNum) || amountNum <= 0 || priceNum <= 0) {
      return;
    }

    onSubmit(amountNum, priceNum, isBuy);
    // Reset form after submission
    setAmount("");
    setPrice("");
  };

  return (
    <div className="card bg-base-100 shadow-xl border-2 border-black">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold">Submit New Order</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Order Type</span>
            </label>
            <div className="flex gap-4">
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  name="orderType"
                  className="radio radio-primary"
                  checked={isBuy}
                  onChange={() => setIsBuy(true)}
                />
                <span className="label-text ml-2">Buy</span>
              </label>
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  name="orderType"
                  className="radio radio-primary"
                  checked={!isBuy}
                  onChange={() => setIsBuy(false)}
                />
                <span className="label-text ml-2">Sell</span>
              </label>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Amount (ETH)</span>
            </label>
            <input
              type="number"
              step="0.001"
              min="0.001"
              placeholder="0.0"
              className="input input-bordered w-full"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Price (USD)</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.0"
              className="input input-bordered w-full"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="form-control mt-6">
            <button
              type="submit"
              className={`btn btn-primary w-full ${
                !canSubmit || isSubmitting ? "btn-disabled" : ""
              }`}
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting
                ? "Submitting..."
                : isBuy
                  ? "Submit Buy Order"
                  : "Submit Sell Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

