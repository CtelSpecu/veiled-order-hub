"use client";

import { useFhevm } from "../fhevm/useFhevm";
import { useInMemoryStorage } from "../hooks/useInMemoryStorage";
import { useMetaMaskEthersSigner } from "../hooks/metamask/useMetaMaskEthersSigner";
import { useVeiledOrder } from "@/hooks/useVeiledOrder";
import { errorNotDeployed } from "./ErrorNotDeployed";
import { OrderForm } from "./OrderForm";
import { TradeCard } from "./TradeCard";

export const VeiledOrderDemo = () => {
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();
  const {
    provider,
    chainId,
    isConnected,
    connect,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
    initialMockChains,
  } = useMetaMaskEthersSigner();

  //////////////////////////////////////////////////////////////////////////////
  // FHEVM instance
  //////////////////////////////////////////////////////////////////////////////

  const {
    instance: fhevmInstance,
    status: fhevmStatus,
    error: fhevmError,
  } = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: true,
  });

  //////////////////////////////////////////////////////////////////////////////
  // useVeiledOrder hook
  //////////////////////////////////////////////////////////////////////////////

  const veiledOrder = useVeiledOrder({
    instance: fhevmInstance,
    fhevmDecryptionSignatureStorage,
    eip1193Provider: provider,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  });

  //////////////////////////////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////////////////////////////

  if (!isConnected) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-base-200 bg-base-100/70 p-10 text-center shadow-lg">
        <h2 className="text-2xl font-semibold">Wallet not connected</h2>
        <p className="mt-3 text-base-content/70">
          Use the wallet button in the top-right corner to connect and unlock encrypted order flows.
        </p>
        <div className="mt-6">
          <button
            className="btn btn-outline btn-lg gap-2"
            disabled={isConnected}
            onClick={connect}
          >
            <span>Connect with MetaMask</span>
          </button>
        </div>
      </div>
    );
  }

  if (veiledOrder.isDeployed === false) {
    return errorNotDeployed(chainId);
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Veiled Order Hub</h1>
        <p className="text-lg text-gray-600">
          Privacy-preserving encrypted order submission using FHEVM
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-base-100 shadow-xl border-2 border-black">
          <div className="card-body">
            <h2 className="card-title text-sm">Contract</h2>
            <p className="font-mono text-xs break-all">
              {veiledOrder.contractAddress || "Not deployed"}
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl border-2 border-black">
          <div className="card-body">
            <h2 className="card-title text-sm">FHEVM Status</h2>
            <p className="font-mono text-xs">
              {fhevmInstance ? "Ready" : fhevmStatus}
            </p>
            {fhevmError && (
              <p className="text-xs text-error">
                {fhevmError instanceof Error ? fhevmError.message : String(fhevmError)}
              </p>
            )}
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl border-2 border-black">
          <div className="card-body">
            <h2 className="card-title text-sm">My Orders</h2>
            <p className="font-mono text-2xl font-bold">
              {veiledOrder.myOrderIndices.length}
            </p>
          </div>
        </div>
      </div>

      {/* Order Form */}
      <OrderForm
        onSubmit={veiledOrder.submitOrder}
        canSubmit={Boolean(veiledOrder.canSubmit)}
        isSubmitting={Boolean(veiledOrder.isSubmitting)}
      />

      {/* Message Display */}
      {veiledOrder.message && (
        <div className="alert alert-info">
          <span>{veiledOrder.message}</span>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Orders</h2>
          <button
            className={`btn btn-sm ${
              veiledOrder.canRefresh ? "btn-primary" : "btn-disabled"
            }`}
            onClick={veiledOrder.refreshMyOrders}
            disabled={!veiledOrder.canRefresh || veiledOrder.isRefreshing}
          >
            {veiledOrder.isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {veiledOrder.orders.length === 0 ? (
          <div className="card bg-base-100 shadow-xl border-2 border-dashed border-gray-300">
            <div className="card-body text-center">
              <p className="text-gray-500">No orders yet. Submit your first order above!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {veiledOrder.orders.map((order) => (
              <TradeCard
                key={order.orderIndex}
                order={order}
                clearOrder={veiledOrder.getClearOrder(order.orderIndex)}
                onDecrypt={veiledOrder.decryptOrder}
                canDecrypt={Boolean(veiledOrder.canDecrypt)}
                isDecrypting={Boolean(veiledOrder.isDecrypting)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

