"use client";

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Loader2, WifiOff } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";

type WalletConnectButtonProps = {
  className?: string;
};

export const WalletConnectButton = ({
  className,
}: WalletConnectButtonProps) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        authenticationStatus,
        mounted,
        openAccountModal,
        openChainModal,
        openConnectModal,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        if (!ready) {
          return (
            <button
              className={clsx(
                "btn btn-ghost btn-sm gap-2 text-base-content/70",
                className,
              )}
              type="button"
              disabled
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Connecting
            </button>
          );
        }

        if (!connected) {
          return (
            <button
              className={clsx("btn btn-primary btn-sm gap-2", className)}
              type="button"
              onClick={openConnectModal}
            >
              Connect Wallet
            </button>
          );
        }

        if (chain.unsupported) {
          return (
            <button
              className={clsx(
                "btn btn-warning btn-sm gap-2 text-warning-content",
                className,
              )}
              type="button"
              onClick={openChainModal}
            >
              <WifiOff className="h-4 w-4" />
              Switch Network
            </button>
          );
        }

        return (
          <div
            className={clsx(
              "flex items-center gap-2 rounded-full bg-base-100/80 p-1",
              className,
            )}
          >
            <button
              type="button"
              className="btn btn-outline btn-sm gap-2 border-base-200"
              onClick={openChainModal}
            >
              {chain.hasIcon && chain.iconUrl ? (
                <span className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-base-300">
                  <Image
                    alt={chain.name ?? "Chain icon"}
                    src={chain.iconUrl}
                    width={20}
                    height={20}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </span>
              ) : null}
              <span>{chain.name}</span>
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm gap-2"
              onClick={openAccountModal}
            >
              <span>{account.displayName}</span>
              {account.displayBalance ? (
                <span className="hidden text-primary-content/80 sm:inline">
                  {account.displayBalance}
                </span>
              ) : null}
            </button>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
