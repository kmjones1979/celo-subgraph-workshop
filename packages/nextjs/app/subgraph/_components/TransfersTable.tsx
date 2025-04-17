"use client";

import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { GetTransfersDocument, execute } from "~~/.graphclient";
import { Address } from "~~/components/scaffold-eth";

interface Transfer {
  id: string;
  from: string;
  to: string;
  value: string;
}

interface TransfersData {
  transfers: Transfer[];
}

const TransfersTable = () => {
  const [transfersData, setTransfersData] = useState<TransfersData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!execute || !GetTransfersDocument) {
        return;
      }
      try {
        const { data: result } = await execute(GetTransfersDocument, {});
        console.log("Transfer data:", result);
        setTransfersData(result as TransfersData);
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching transfers:", err);
      }
    };

    fetchData();
    // Set up polling every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Error loading transfers. Please try again later.</span>
      </div>
    );
  }

  if (!transfersData?.transfers?.length) {
    return (
      <div className="alert alert-info">
        <span>No transfers found.</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="overflow-x-auto shadow-2xl rounded-xl">
        <table className="table bg-base-100 table-zebra">
          <thead>
            <tr className="rounded-xl">
              <th className="bg-primary"></th>
              <th className="bg-primary">From</th>
              <th className="bg-primary">To</th>
              <th className="bg-primary">Value</th>
            </tr>
          </thead>
          <tbody>
            {transfersData.transfers.map((transfer: Transfer, index: number) => (
              <tr key={transfer.id}>
                <th>{index + 1}</th>
                <td>
                  <Address address={transfer.from} />
                </td>
                <td>
                  <Address address={transfer.to} />
                </td>
                <td>
                  <div className="badge badge-primary badge-lg">
                    {transfer.value ? Number(formatEther(BigInt(transfer.value))).toFixed(2) : "0.00"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransfersTable;
